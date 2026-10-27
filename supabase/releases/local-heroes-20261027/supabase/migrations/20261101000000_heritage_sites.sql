-- Địa danh lịch sử theo địa phương (HS-1.0): liên kết địa điểm với 34 địa phương, câu chuyện có nguồn, video.
-- Chỉ THÊM; không xóa/sửa dữ liệu. Chạy trên DB local/disposable; DB thật chỉ khi chủ dự án cho phép (xem README release).
begin;

-- 1. Heritage fields on the existing place identity
alter table public.historical_locations
  add column locality_code text references public.history_localities(code) on delete restrict,
  add column heritage_tier text,
  add column heritage_rank smallint,
  add column heritage_period text,
  add column heritage_teaser text,
  add column lesson_slug text,
  add constraint historical_locations_heritage_tier_check check (heritage_tier is null or heritage_tier in ('grade12','extended')),
  add constraint historical_locations_heritage_rank_check check (heritage_rank is null or heritage_rank between 1 and 9),
  add constraint historical_locations_heritage_period_check check (heritage_period is null or char_length(btrim(heritage_period)) between 1 and 60),
  add constraint historical_locations_heritage_teaser_check check (heritage_teaser is null or char_length(btrim(heritage_teaser)) between 40 and 360),
  add constraint historical_locations_lesson_slug_check check (lesson_slug is null or lesson_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  add constraint historical_locations_heritage_complete check (
    heritage_tier is null or (locality_code is not null and heritage_rank is not null and heritage_teaser is not null and heritage_period is not null)
  );

create unique index uq_historical_locations_heritage_rank
  on public.historical_locations (locality_code, heritage_rank) where heritage_tier is not null;

create unique index uq_historical_locations_one_grade12
  on public.historical_locations (locality_code) where heritage_tier = 'grade12';

create index idx_historical_locations_locality
  on public.historical_locations (locality_code) where locality_code is not null;

-- 2. Usage basis on media (nullable; legacy rows unchanged)
alter table public.media_assets
  add column usage_basis text,
  add constraint media_assets_usage_basis_check check (usage_basis is null or usage_basis in ('open_license','public_domain','permission','coursework_reference'));

-- 3. Story sections
create table public.location_story_sections (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.historical_locations(id) on delete cascade,
  sort_order smallint not null check (sort_order between 1 and 20),
  heading text not null check (char_length(btrim(heading)) between 2 and 120),
  body text not null check (char_length(btrim(body)) between 80 and 4000),
  certainty text not null default 'verified' check (certainty in ('verified','approximate','disputed','editorial')),
  uncertainty_note text,
  constraint location_story_sections_uncertainty_check check (certainty not in ('approximate','disputed') or char_length(btrim(coalesce(uncertainty_note,''))) > 0),
  unique (location_id, sort_order)
);

create table public.location_story_sources (
  section_id uuid not null references public.location_story_sections(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete restrict,
  locator text not null check (char_length(btrim(locator)) > 0),
  scope_note text not null check (char_length(btrim(scope_note)) > 0),
  primary key (section_id, source_id)
);

create index idx_location_story_sources_source on public.location_story_sources (source_id);

-- 4. Videos
create table public.location_videos (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.historical_locations(id) on delete cascade,
  youtube_id text not null check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null check (char_length(btrim(title)) between 3 and 200),
  channel text not null check (char_length(btrim(channel)) between 2 and 120),
  channel_url text check (channel_url is null or channel_url ~ '^https://(www\.)?youtube\.com/'),
  note text check (note is null or char_length(note) <= 300),
  embed_checked_at date not null,
  sort_order smallint not null default 1 check (sort_order between 1 and 5),
  unique (location_id, youtube_id),
  unique (location_id, sort_order)
);

-- 5. RLS on location_story_sections, location_story_sources, location_videos
alter table public.location_story_sections enable row level security;
alter table public.location_story_sources enable row level security;
alter table public.location_videos enable row level security;

revoke all on public.location_story_sections from public, anon, authenticated;
revoke all on public.location_story_sources from public, anon, authenticated;
revoke all on public.location_videos from public, anon, authenticated;

grant select on public.location_story_sections to anon, authenticated;
grant insert, update, delete on public.location_story_sections to authenticated;

grant select on public.location_story_sources to anon, authenticated;
grant insert, update, delete on public.location_story_sources to authenticated;

grant select on public.location_videos to anon, authenticated;
grant insert, update, delete on public.location_videos to authenticated;

-- Policies on location_story_sections
create policy "location_story_sections_public" on public.location_story_sections
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.historical_locations l
      where l.id = location_id and l.workflow_status = 'published'
    )
  );

create policy "location_story_sections_staff" on public.location_story_sections
  for select to authenticated
  using (public.current_staff_role() is not null);

create policy "location_story_sections_review" on public.location_story_sections
  for all to authenticated
  using (public.current_staff_role() in ('reviewer', 'system_admin'))
  with check (public.current_staff_role() in ('reviewer', 'system_admin'));

create policy "location_story_sections_editable" on public.location_story_sections
  for all to authenticated
  using (
    public.current_staff_role() = 'editor'
    and exists (
      select 1 from public.historical_locations l
      where l.id = location_id and l.workflow_status in ('draft', 'needs_revision')
    )
  )
  with check (
    public.current_staff_role() = 'editor'
    and exists (
      select 1 from public.historical_locations l
      where l.id = location_id and l.workflow_status in ('draft', 'needs_revision')
    )
  );

-- Policies on location_story_sources (parent reached through location_story_sections)
create policy "location_story_sources_public" on public.location_story_sources
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.location_story_sections s
      join public.historical_locations l on l.id = s.location_id
      where s.id = section_id and l.workflow_status = 'published'
    )
  );

create policy "location_story_sources_staff" on public.location_story_sources
  for select to authenticated
  using (public.current_staff_role() is not null);

create policy "location_story_sources_review" on public.location_story_sources
  for all to authenticated
  using (public.current_staff_role() in ('reviewer', 'system_admin'))
  with check (public.current_staff_role() in ('reviewer', 'system_admin'));

create policy "location_story_sources_editable" on public.location_story_sources
  for all to authenticated
  using (
    public.current_staff_role() = 'editor'
    and exists (
      select 1 from public.location_story_sections s
      join public.historical_locations l on l.id = s.location_id
      where s.id = section_id and l.workflow_status in ('draft', 'needs_revision')
    )
  )
  with check (
    public.current_staff_role() = 'editor'
    and exists (
      select 1 from public.location_story_sections s
      join public.historical_locations l on l.id = s.location_id
      where s.id = section_id and l.workflow_status in ('draft', 'needs_revision')
    )
  );

-- Policies on location_videos
create policy "location_videos_public" on public.location_videos
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.historical_locations l
      where l.id = location_id and l.workflow_status = 'published'
    )
  );

create policy "location_videos_staff" on public.location_videos
  for select to authenticated
  using (public.current_staff_role() is not null);

create policy "location_videos_review" on public.location_videos
  for all to authenticated
  using (public.current_staff_role() in ('reviewer', 'system_admin'))
  with check (public.current_staff_role() in ('reviewer', 'system_admin'));

create policy "location_videos_editable" on public.location_videos
  for all to authenticated
  using (
    public.current_staff_role() = 'editor'
    and exists (
      select 1 from public.historical_locations l
      where l.id = location_id and l.workflow_status in ('draft', 'needs_revision')
    )
  )
  with check (
    public.current_staff_role() = 'editor'
    and exists (
      select 1 from public.historical_locations l
      where l.id = location_id and l.workflow_status in ('draft', 'needs_revision')
    )
  );

-- 6. Public read of sources
-- Recreate "public_read_published" on public.sources copying predicate verbatim from
-- 20261031000001_local_hero_catalog.sql and extending with heritage location stories.
drop policy if exists public_read_published on public.sources;
create policy public_read_published on public.sources for select to anon, authenticated using(
  exists(select 1 from public.event_sources es join public.historical_events e on e.id=es.event_id where es.source_id=sources.id and e.workflow_status='published')
  or exists(select 1 from public.figure_sources fs join public.historical_figures f on f.id=fs.figure_id where fs.source_id=sources.id and f.is_local_hero and f.workflow_status='published')
  or exists(select 1 from public.figure_story_sources ss join public.figure_stories s on s.id=ss.story_id join public.historical_figures f on f.id=s.figure_id where ss.source_id=sources.id and s.workflow_status='published' and f.is_local_hero and f.workflow_status='published')
  or exists(select 1 from public.figure_media_evidence me join public.historical_figures f on f.id=me.figure_id where (me.identity_source_id=sources.id or me.usage_source_id=sources.id) and me.decision='accepted' and f.is_local_hero and f.workflow_status='published')
  or exists(select 1 from public.media_assets ma join public.figure_media_evidence me on me.media_id=ma.id join public.historical_figures f on f.id=me.figure_id where ma.source_id=sources.id and me.decision='accepted' and f.is_local_hero and f.workflow_status='published')
  or exists(select 1 from public.location_story_sources lss join public.location_story_sections s on s.id=lss.section_id join public.historical_locations l on l.id=s.location_id where lss.source_id=sources.id and l.workflow_status='published')
);

-- 7. Editor source lock
-- Recreate public.source_locked_for_editor copying body verbatim from
-- 20261031000001_local_hero_catalog.sql and extending with heritage location stories.
create or replace function public.source_locked_for_editor(p_source uuid) returns boolean
language sql stable security invoker set search_path='' as $$
  select exists(select 1 from public.event_sources es join public.historical_events e on e.id=es.event_id where es.source_id=p_source and e.workflow_status in ('pending_review','published','hidden'))
  or exists(select 1 from public.media_assets ma where ma.source_id=p_source and public.media_owner_status(ma.event_id,ma.figure_id,ma.location_id) in ('pending_review','published','hidden'))
  or exists(select 1 from public.figure_sources fs join public.historical_figures f on f.id=fs.figure_id where fs.source_id=p_source and f.workflow_status in ('pending_review','published','hidden'))
  or exists(select 1 from public.figure_story_sources ss join public.figure_stories s on s.id=ss.story_id join public.historical_figures f on f.id=s.figure_id where ss.source_id=p_source and f.workflow_status in ('pending_review','published','hidden'))
  or exists(select 1 from public.figure_media_evidence me join public.historical_figures f on f.id=me.figure_id where (me.identity_source_id=p_source or me.usage_source_id=p_source) and f.workflow_status in ('pending_review','published','hidden'))
  or exists(select 1 from public.figure_localities fl join public.historical_figures f on f.id=fl.figure_id where fl.primary_source_id=p_source and f.workflow_status in ('pending_review','published','hidden'))
  or exists(select 1 from public.location_story_sources lss join public.location_story_sections s on s.id=lss.section_id join public.historical_locations l on l.id=s.location_id where lss.source_id=p_source and l.workflow_status in ('pending_review','published','hidden'))
$$;

commit;
