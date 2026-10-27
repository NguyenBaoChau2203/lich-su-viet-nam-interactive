-- Synthetic fixtures only. Run exclusively on the explicitly disposable local target.
begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select no_plan();

-- Verify schema tables and columns exist
select has_table('public', 'location_story_sections', 'HS_SECTIONS_TABLE');
select has_table('public', 'location_story_sources', 'HS_SOURCES_TABLE');
select has_table('public', 'location_videos', 'HS_VIDEOS_TABLE');
select has_column('public', 'historical_locations', 'locality_code', 'HS_COL_LOCALITY');
select has_column('public', 'historical_locations', 'heritage_tier', 'HS_COL_TIER');
select has_column('public', 'historical_locations', 'heritage_rank', 'HS_COL_RANK');
select has_column('public', 'historical_locations', 'heritage_period', 'HS_COL_PERIOD');
select has_column('public', 'historical_locations', 'heritage_teaser', 'HS_COL_TEASER');
select has_column('public', 'historical_locations', 'lesson_slug', 'HS_COL_LESSON');
select has_column('public', 'media_assets', 'usage_basis', 'HS_COL_USAGE_BASIS');

\ir fixtures/heritage-sites.inc

-- D1: Anon sees published site's sections, story sources, videos, and media; sees none for draft
set local role anon;
select set_config('request.jwt.claim.sub','',true);

select is((select count(*)::integer from public.location_story_sections where location_id='cc000000-0000-4000-9000-000000000001'), 2, 'D1_ANON_SEES_PUBLISHED_SECTIONS');
select is((select count(*)::integer from public.location_story_sources lss join public.location_story_sections s on s.id=lss.section_id where s.location_id='cc000000-0000-4000-9000-000000000001'), 2, 'D1_ANON_SEES_PUBLISHED_STORY_SOURCES');
select is((select count(*)::integer from public.location_videos where location_id='cc000000-0000-4000-9000-000000000001'), 1, 'D1_ANON_SEES_PUBLISHED_VIDEOS');
select is((select count(*)::integer from public.media_assets where location_id='cc000000-0000-4000-9000-000000000001'), 1, 'D1_ANON_SEES_PUBLISHED_MEDIA');

select is((select count(*)::integer from public.location_story_sections where location_id='cc000000-0000-4000-9000-000000000002'), 0, 'D1_ANON_HIDES_DRAFT_SECTIONS');
select is((select count(*)::integer from public.location_story_sources lss join public.location_story_sections s on s.id=lss.section_id where s.location_id='cc000000-0000-4000-9000-000000000002'), 0, 'D1_ANON_HIDES_DRAFT_STORY_SOURCES');
select is((select count(*)::integer from public.location_videos where location_id='cc000000-0000-4000-9000-000000000002'), 0, 'D1_ANON_HIDES_DRAFT_VIDEOS');
select is((select count(*)::integer from public.media_assets where location_id='cc000000-0000-4000-9000-000000000002'), 0, 'D1_ANON_HIDES_DRAFT_MEDIA');

-- D2: Anon can read sources linked via published story; cannot read draft-only source
select is((select count(*)::integer from public.sources where id in ('bb000000-0000-4000-9000-000000000001','bb000000-0000-4000-9000-000000000002')), 2, 'D2_ANON_SEES_PUBLISHED_SOURCES');
select is((select count(*)::integer from public.sources where id='bb000000-0000-4000-9000-000000000003'), 0, 'D2_ANON_HIDES_DRAFT_ONLY_SOURCE');

-- D3: Anon and learners cannot insert/update/delete any new table
select throws_ok(
  $q$insert into public.location_story_sections(location_id,sort_order,heading,body) values('cc000000-0000-4000-9000-000000000001',3,'Forced','Nội dung kiểm thử độ dài trên 80 ký tự để thử nghiệm bảo mật bảng liên kết.')$q$,
  '42501',
  null,
  'D3_ANON_CANNOT_INSERT_SECTIONS'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000004',true); -- Learner

select throws_ok(
  $q$insert into public.location_story_sections(location_id,sort_order,heading,body) values('cc000000-0000-4000-9000-000000000001',3,'Forced','Nội dung kiểm thử độ dài trên 80 ký tự để thử nghiệm bảo mật bảng liên kết.')$q$,
  '42501',
  null,
  'D3_LEARNER_CANNOT_INSERT_SECTIONS'
);

-- D4: Editor can insert/update/delete sections, sources and videos of a DRAFT site; cannot on a PUBLISHED site
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true); -- Editor

-- Cannot write to published site
select throws_ok(
  $q$insert into public.location_story_sections(location_id,sort_order,heading,body) values('cc000000-0000-4000-9000-000000000001',3,'Forced by editor','Nội dung kiểm thử độ dài trên 80 ký tự để thử nghiệm bảo mật bảng liên kết.')$q$,
  '42501',
  null,
  'D4_EDITOR_CANNOT_INSERT_ON_PUBLISHED_SITE'
);
select throws_ok(
  $q$delete from public.location_story_sections where id='dd000000-0000-4000-9000-000000000001'$q$,
  '42501',
  null,
  'D4_EDITOR_CANNOT_DELETE_ON_PUBLISHED_SITE'
);

-- Can write to draft site
select lives_ok(
  $q$insert into public.location_story_sections(id,location_id,sort_order,heading,body) values('dd000000-0000-4000-9000-000000000004','cc000000-0000-4000-9000-000000000002',2,'Mục mới của editor','Nội dung hợp lệ của editor cho bản thảo kiểm thử với độ dài trên tám mươi ký tự.')'::text$,
  'D4_EDITOR_CAN_INSERT_ON_DRAFT_SITE'
);
select lives_ok(
  $q$update public.location_story_sections set heading='Tiêu đề sửa đổi' where id='dd000000-0000-4000-9000-000000000003'$q$,
  'D4_EDITOR_CAN_UPDATE_ON_DRAFT_SITE'
);

-- D5: Reviewer can change workflow status but cannot change heritage_teaser / locality_code
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000002',true); -- Reviewer

select lives_ok(
  $q$update public.historical_locations set workflow_status='pending_review' where id='cc000000-0000-4000-9000-000000000002'$q$,
  'D5_REVIEWER_CAN_CHANGE_STATUS'
);
select throws_ok(
  $q$update public.historical_locations set heritage_teaser='Teaser sửa đổi trái phép bởi reviewer với độ dài trên bốn mươi ký tự hợp lệ.' where id='cc000000-0000-4000-9000-000000000002'$q$,
  'P0001',
  null,
  'D5_REVIEWER_CANNOT_CHANGE_TEASER'
);

-- D6: System Admin can manage everything
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000003',true); -- Admin

select lives_ok(
  $q$update public.historical_locations set heritage_teaser='Teaser cập nhật bởi quản trị hệ thống với độ dài trên bốn mươi ký tự hợp lệ.' where id='cc000000-0000-4000-9000-000000000001'$q$,
  'D6_ADMIN_CAN_UPDATE_HERITAGE_TEASER'
);

-- D7: Constraints check
reset role;
select set_config('request.jwt.claim.sub','',true);

-- Bad youtube id (length 6)
select throws_ok(
  $q$insert into public.location_videos(location_id,youtube_id,title,channel,embed_checked_at) values('cc000000-0000-4000-9000-000000000001','short','Tiêu đề','Kênh',date '2026-10-27')$q$,
  '23514',
  null,
  'D7_REJECT_BAD_YOUTUBE_ID'
);

-- Short teaser (<40 chars)
select throws_ok(
  $q$insert into public.historical_locations(name,slug,locality_code,heritage_tier,heritage_rank,heritage_period,heritage_teaser) values('Test','test-short-teaser','01','grade12',1,'1945','Quá ngắn')$q$,
  '23514',
  null,
  'D7_REJECT_SHORT_TEASER'
);

-- Tier without locality
select throws_ok(
  $q$insert into public.historical_locations(name,slug,locality_code,heritage_tier,heritage_rank,heritage_period,heritage_teaser) values('Test','test-no-locality',null,'grade12',1,'1945','Đoạn teaser hợp lệ trên bốn mươi ký tự nhưng thiếu mã địa phương.')$q$,
  '23514',
  null,
  'D7_REJECT_TIER_WITHOUT_LOCALITY'
);

-- Second grade12 in same locality
select throws_ok(
  $q$insert into public.historical_locations(name,slug,locality_code,heritage_tier,heritage_rank,heritage_period,heritage_teaser) values('Second Grade 12','test-second-g12','44','grade12',2,'1972','Đoạn teaser hợp lệ trên bốn mươi ký tự để kiểm thử một lớp 12 trên mỗi tỉnh.')$q$,
  '23505',
  null,
  'D7_REJECT_SECOND_GRADE12_SAME_LOCALITY'
);

-- Duplicate rank in same locality
select throws_ok(
  $q$insert into public.historical_locations(name,slug,locality_code,heritage_tier,heritage_rank,heritage_period,heritage_teaser) values('Duplicate Rank','test-dup-rank','44','extended',1,'1972','Đoạn teaser hợp lệ trên bốn mươi ký tự để kiểm thử rank trùng trong tỉnh.')$q$,
  '23505',
  null,
  'D7_REJECT_DUPLICATE_RANK_SAME_LOCALITY'
);

-- Approximate section without uncertainty_note
select throws_ok(
  $q$insert into public.location_story_sections(location_id,sort_order,heading,body,certainty,uncertainty_note) values('cc000000-0000-4000-9000-000000000001',5,'Xấp xỉ',repeat('Đoạn văn kiểm thử trên 80 ký tự cho việc xấp xỉ không có ghi chú giải thích sự không chắc chắn. ',2),'approximate',null)$q$,
  '23514',
  null,
  'D7_REJECT_APPROXIMATE_WITHOUT_NOTE'
);

-- Usage basis outside enum
select throws_ok(
  $q$insert into public.media_assets(location_id,file_url,media_type,caption,usage_basis) values('cc000000-0000-4000-9000-000000000001','https://example.invalid/bad.jpg','image','Chú thích','invalid_basis')$q$,
  '23514',
  null,
  'D7_REJECT_INVALID_USAGE_BASIS'
);

-- D8: source_locked_for_editor check
select is(public.source_locked_for_editor('bb000000-0000-4000-9000-000000000001'), true, 'D8_SOURCE_LOCKED_WHEN_SITE_PUBLISHED');
select is(public.source_locked_for_editor('bb000000-0000-4000-9000-000000000003'), false, 'D8_SOURCE_UNLOCKED_WHEN_SITE_DRAFT');

-- D9: Existing behaviour preserved
select is(public.source_locked_for_editor('00000000-0000-0000-0000-000000000000'::uuid), false, 'D9_UNLINKED_SOURCE_UNLOCKED');

rollback;
