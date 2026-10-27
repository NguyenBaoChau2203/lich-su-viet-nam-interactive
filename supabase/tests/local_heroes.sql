-- Synthetic fixtures only. Run exclusively on the explicitly disposable local target.
begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;
select no_plan();
select has_table('public', 'history_localities', 'LH_REGISTRY');
select has_table('public', 'figure_sources', 'LH_FIGURE_SOURCES');
select has_table('public', 'figure_stories', 'LH_STORIES');
select has_function('public', 'local_hero_page', array['text','text','integer'], 'LH_PAGE_RPC');
select has_function('public', 'local_hero_save_graph', array['jsonb'], 'LH_ATOMIC_SAVE');
\ir fixtures/local-heroes.inc
set constraints all immediate;
set constraints all deferred;
select is((select count(*)::integer from public.history_localities),34,'LH_REGISTRY_EXACT_34');
select ok(not (select is_local_hero from public.historical_figures where slug='lh-synthetic-legacy'),'LH_LEGACY_DEFAULTS');
select is((select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-legacy'),'0','LH_LEGACY_REVISION');
select ok(not has_table_privilege('authenticated','public.history_localities','INSERT'),'LH_REGISTRY_IMMUTABLE');
select ok(not has_function_privilege('anon','public.local_hero_save_graph(jsonb)','EXECUTE'),'LH_ANON_COMMAND_DENIED');
select ok(not has_schema_privilege('authenticated','private','USAGE'),'LH_NO_PRIVATE_API');
select ok((select bool_and(not prosecdef) from pg_proc where oid in ('public.local_hero_page(text,text,integer)'::regprocedure,'public.local_hero_profile(text)'::regprocedure,'public.local_hero_save_graph(jsonb)'::regprocedure,'public.local_hero_review_graph(jsonb)'::regprocedure)),'LH_INVOKER_ONLY');

set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true);
select is(public.local_hero_submit_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000001')))->>'ok','true','LH_PENDING_GRAPH_SUBMIT');
select is((select workflow_status::text from public.figure_stories where id='ee000000-0000-4000-8000-000000000001'),'pending_review','LH_PENDING_PRIMARY');
select is((select workflow_status::text from public.figure_stories where id='ee000000-0000-4000-8000-000000000002'),'draft','LH_UNSELECTED_STAYS_DRAFT');
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision','0','action','publish'))->'error'->>'code','FORBIDDEN','LH_EDITOR_CANNOT_PUBLISH');
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000002',true);
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'action','request_revision','reason','PRIVATE_REVIEW_SENTINEL: kiểm tra lại chứng cứ.'))->>'ok','true','LH_REQUEST_REVISION');
select is((select workflow_status::text from public.figure_stories where id='ee000000-0000-4000-8000-000000000001'),'needs_revision','LH_REVISION_STORIES_TOGETHER');
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true);
select is(public.local_hero_submit_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000001')))->>'ok','true','LH_RESUBMIT_AFTER_REVISION');
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000002',true);
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'action','publish'))->>'ok','true','LH_ATOMIC_PROMOTION');
select is((select workflow_status::text from public.figure_stories where id='ee000000-0000-4000-8000-000000000001'),'published','LH_PUBLISHED_PRIMARY');
with attempted as (update public.figure_localities set explanation='Forged content' where id='dd000000-0000-4000-8000-000000000001' returning id)
select is((select count(*)::integer from attempted),0,'LH_REVIEWER_STATUS_ONLY');
select throws_ok($q$update public.sources set title='Forged content' where id='bb000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_PROTECTED_SOURCE');
select throws_ok($q$update public.historical_figures set local_hero_revision=0 where slug='lh-synthetic-one'$q$,'LH002','REVISION_FORGERY','LH_REVISION_FORGERY');

set local role anon;
select set_config('request.jwt.claim.sub','',true);
select is((public.local_hero_page(null,'',1)->>'totalPeople')::integer,1,'LH_ANON_PUBLIC_ONLY');
select is((public.local_hero_page(null,'',1)->'coverage'->>'representedLocalities')::integer,2,'LH_DISTINCT_COVERAGE');
select is((public.local_hero_page('08','',1)->>'totalPeople')::integer,0,'LH_COMMEMORATION_NOT_MEMBERSHIP');
select is((public.local_hero_page('99','',999999)->'filters'->>'page')::integer,1,'LH_CLAMP_UNKNOWN_LOCALITY');
select is((public.local_hero_page(null,'bi danh GIA',1)->>'totalPeople')::integer,1,'LH_ALIAS_SEARCH');
select is((public.local_hero_page(null,'đặng',1)->>'totalPeople')::integer,1,'LH_FOLD_PARITY');
select is((public.local_hero_page(null,'% _',1)->>'totalPeople')::integer,1,'LH_LITERAL_WILDCARDS');
select is((public.local_hero_page(null,'%',1)->>'totalPeople')::integer,1,'LH_LITERAL_PERCENT');
select is((public.local_hero_page(null,'does-not-exist',1)->>'totalPages')::integer,0,'LH_EMPTY_TOTAL_PAGES');
select is((select count(*)::integer from public.figure_stories),1,'LH_PRIVATE_STORY_HIDDEN');
select is((select count(*)::integer from public.media_assets where figure_id='cc000000-0000-4000-8000-000000000001'),1,'LH_HELD_MEDIA_HIDDEN');
select ok(public.local_hero_profile('lh-synthetic-one')::text not like '%PRIVATE_%','LH_NO_PRIVATE_DTO');
select is((select count(*)::integer from public.sources where id='bb000000-0000-4000-8000-000000000001'),1,'LH_SOURCE_FIGURE_ONLY');
select is((select count(*)::integer from public.sources where id='bb000000-0000-4000-8000-000000000002'),1,'LH_SOURCE_STORY_ONLY');
select is((select count(*)::integer from public.sources where id in ('bb000000-0000-4000-8000-000000000003','bb000000-0000-4000-8000-000000000004','bb000000-0000-4000-8000-000000000005')),3,'LH_SOURCE_MEDIA_ONLY');
select is((select count(*)::integer from public.sources where id in ('bb000000-0000-4000-8000-000000000006','bb000000-0000-4000-8000-000000000008')),0,'LH_DRAFT_SOURCE_HIDDEN');
select is(public.local_hero_profile('lh-synthetic-draft'),null::jsonb,'LH_DRAFT_PROFILE_NULL');

set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000004',true);
select throws_ok($q$insert into public.figure_sources values('cc000000-0000-4000-8000-000000000001','forged','bb000000-0000-4000-8000-000000000001','x','x','x','verified',null)$q$,'LH002','FORBIDDEN','LH_LEARNER_DENY_WRITE');
select is(public.local_hero_restore_draft('{}')->'error'->>'code','FORBIDDEN','LH_LEARNER_DENY_RPC');
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000005',true);
select is((select count(*)::integer from public.figure_stories),1,'LH_LOCKED_STAFF_DENY');
select is(public.local_hero_submit_graph('{}')->'error'->>'code','FORBIDDEN','LH_LOCKED_EDITOR_DENY');
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000006',true);
select is(public.local_hero_review_graph('{}')->'error'->>'code','FORBIDDEN','LH_LOCKED_REVIEWER_DENY');
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000007',true);
select is(public.local_hero_restore_draft('{}')->'error'->>'code','FORBIDDEN','LH_LOCKED_ADMIN_DENY');

reset role;
select set_config('request.jwt.claim.sub','',true);
-- Each probe is rolled back even if an unauthorized write unexpectedly succeeds.
create temporary table lh_write_cases(label text, statement text);
insert into lh_write_cases values
('figure_source_insert',$q$insert into public.figure_sources values('cc000000-0000-4000-8000-000000000001','synthetic-injected','bb000000-0000-4000-8000-000000000001','Synthetic claim','Synthetic paragraph','Synthetic scope','verified',null)$q$),
('figure_source_update',$q$update public.figure_sources set claim_text='Synthetic forbidden change' where figure_id='cc000000-0000-4000-8000-000000000001' and claim_key='identity'$q$),
('figure_source_delete',$q$delete from public.figure_sources where figure_id='cc000000-0000-4000-8000-000000000001' and claim_key='identity'$q$),
('locality_insert',$q$insert into public.figure_localities(figure_id,locality_code,relationship_kind,historical_place_label,explanation,claim_key,primary_source_id,certainty) values('cc000000-0000-4000-8000-000000000001','12','commemoration','Synthetic place','Synthetic explanation','locality:12:commemoration','bb000000-0000-4000-8000-000000000001','verified')$q$),
('locality_update',$q$update public.figure_localities set explanation='Synthetic forbidden change' where id='dd000000-0000-4000-8000-000000000001'$q$),
('locality_delete',$q$delete from public.figure_localities where id='dd000000-0000-4000-8000-000000000001'$q$),
('story_insert',$q$insert into public.figure_stories(figure_id,slug,title,summary,body) values('cc000000-0000-4000-8000-000000000001','synthetic-injected','Synthetic story','','')$q$),
('story_update',$q$update public.figure_stories set title='Synthetic forbidden change' where id='ee000000-0000-4000-8000-000000000001'$q$),
('story_delete',$q$delete from public.figure_stories where id='ee000000-0000-4000-8000-000000000001'$q$),
('story_source_insert',$q$insert into public.figure_story_sources values('ee000000-0000-4000-8000-000000000001','synthetic-extra','bb000000-0000-4000-8000-000000000001','Synthetic claim','Synthetic paragraph','Synthetic scope','verified',null)$q$),
('story_source_update',$q$update public.figure_story_sources set claim_text='Synthetic forbidden change' where story_id='ee000000-0000-4000-8000-000000000001'$q$),
('story_source_delete',$q$delete from public.figure_story_sources where story_id='ee000000-0000-4000-8000-000000000001'$q$),
('evidence_insert',$q$insert into public.figure_media_evidence values('ff000000-0000-4000-8000-000000000003','cc000000-0000-4000-8000-000000000001','portrait','held','bb000000-0000-4000-8000-000000000006','Synthetic paragraph','verified','unknown',null,null,null,null)$q$),
('evidence_update',$q$update public.figure_media_evidence set identity_locator='Synthetic forbidden change' where media_id='ff000000-0000-4000-8000-000000000001'$q$),
('evidence_delete',$q$delete from public.figure_media_evidence where media_id='ff000000-0000-4000-8000-000000000001'$q$),
('media_insert',$q$insert into public.media_assets(figure_id,file_url,media_type,caption) values('cc000000-0000-4000-8000-000000000001','https://example.invalid/synthetic-extra.jpg','image','Synthetic extra')$q$),
('media_update',$q$update public.media_assets set caption='Synthetic forbidden change' where id='ff000000-0000-4000-8000-000000000001'$q$),
('media_delete',$q$delete from public.media_assets where id='ff000000-0000-4000-8000-000000000001'$q$),
('source_update',$q$update public.sources set title='Synthetic forbidden change' where id='bb000000-0000-4000-8000-000000000001'$q$),
('source_delete',$q$delete from public.sources where id='bb000000-0000-4000-8000-000000000001'$q$),
('parent_update',$q$update public.historical_figures set name='Synthetic forbidden change' where id='cc000000-0000-4000-8000-000000000001'$q$),
('parent_delete',$q$delete from public.historical_figures where id='cc000000-0000-4000-8000-000000000001'$q$);
grant select on lh_write_cases to anon,authenticated;
create function pg_temp.lh_denied(p_statement text) returns boolean language plpgsql security invoker set search_path='' as $$
declare affected integer;
begin
  begin
    execute p_statement;
    get diagnostics affected=row_count;
    raise exception using errcode='ZX001',message='Rollback probe';
  exception
    when sqlstate 'ZX001' then return affected=0;
    when sqlstate '42501' or sqlstate 'LH002' then return true;
    when others then return false;
  end;
end $$;
grant execute on function pg_temp.lh_denied(text) to anon,authenticated;
set local role anon;
select ok(pg_temp.lh_denied(statement),'LH_RAW_ANON_'||label) from pg_temp.lh_write_cases order by label;
reset role;
create function pg_temp.lh_role_matrix() returns setof text language plpgsql security invoker set search_path=extensions,pg_catalog as $$
declare actor integer; c record;
begin
  for actor in 1..7 loop
    perform set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-'||lpad(actor::text,12,'0'),true);
    return next extensions.is(public.current_staff_role()::text,case actor when 1 then 'editor' when 2 then 'reviewer' when 3 then 'system_admin' else null end,'LH_MATRIX_ACTOR_'||actor);
    for c in select * from pg_temp.lh_write_cases order by label loop
      return next extensions.ok(pg_temp.lh_denied(c.statement),'LH_RAW_ROLE_'||actor||'_'||c.label);
    end loop;
  end loop;
end $$;
grant execute on function pg_temp.lh_role_matrix() to authenticated;
set local role authenticated;
select * from pg_temp.lh_role_matrix();
reset role;
-- Direct database-owner probes exercise the deferred invariant beneath API authorization.
-- Each expected failure rolls back its entire statement, including reverse parent touches.
select set_config('request.jwt.claim.sub','',true);
set constraints all immediate;
select throws_ok($q$update public.figure_sources set scope_note='TODO SYNTHETIC private note' where figure_id='cc000000-0000-4000-8000-000000000001' and claim_key='identity'$q$,'LH001','INTERNAL_NOTE','LH_PUBLIC_CITATION_INTERNAL_NOTE');
select throws_ok($q$delete from public.figure_sources where figure_id='cc000000-0000-4000-8000-000000000001' and claim_key='identity'$q$,'LH001','IDENTITY_SOURCE_REQUIRED','LH_LAST_SOURCE');
select throws_ok($q$delete from public.figure_stories where id='ee000000-0000-4000-8000-000000000001'$q$,'LH001','PRIMARY_STORY_REQUIRED','LH_LAST_STORY');
select throws_ok($q$delete from public.figure_media_evidence where media_id='ff000000-0000-4000-8000-000000000001'$q$,'LH001','IMAGE_REQUIRED','LH_LAST_MEDIA');
select throws_ok($q$delete from public.figure_localities where figure_id='cc000000-0000-4000-8000-000000000001' and relationship_kind<>'commemoration'$q$,'LH001','LOCALITY_MAPPING_REQUIRED','LH_LAST_LOCALITY');
select throws_ok($q$update public.media_assets set width=null where id='ff000000-0000-4000-8000-000000000001'$q$,'LH001','IMAGE_IDENTITY','LH_BASE_IMAGE_MODIFICATION');
select throws_ok($q$update public.sources set title='' where id='bb000000-0000-4000-8000-000000000001'$q$,'LH001','SOURCE_METADATA','LH_SOURCE_METADATA_REVERSE');
select is((select count(*)::integer from public.figure_localities where figure_id='cc000000-0000-4000-8000-000000000001'),3,'LH_FAILED_DELETE_ROLLBACK');
select throws_ok($q$insert into public.figure_localities select id,figure_id,locality_code,relationship_kind,historical_place_label,explanation,claim_key,primary_source_id,certainty,uncertainty_note from public.figure_localities where id='dd000000-0000-4000-8000-000000000001'$q$,'23505',null,'LH_DUPLICATE_LINK');
select throws_ok($q$insert into public.figure_sources values('cc000000-0000-4000-8000-000000000003','identity','bb000000-0000-4000-8000-000000000001','x','x','x','verified',null)$q$,'23514','LH_INVALID_PARENT','LH_INVALID_PARENT');
select is(public.local_hero_fold(U&'  \0110\1eb6NG\00a0V\0103n  '),'dang van','LH_FOLD_WHITESPACE');
select is(public.local_hero_fold(U&'\0111a\0323\0306ng'),'dang','LH_FOLD_DECOMPOSED');

create temporary table lh_results(label text primary key, value jsonb);
grant all on lh_results to authenticated;
create temporary table lh_commands(value jsonb);
insert into lh_commands values(jsonb_build_object('figureId',null,'expectedRevision',null,'figure',jsonb_build_object('name','Synthetic incomplete created','slug','lh-synthetic-created','otherNames',null,'birthYear',null,'deathYear',null,'biography',null,'isLocalHero',true,'contributionSummary',null,'contributionStartYear',null,'contributionEndYear',null,'catalogAliases','[]'::jsonb),'sources','[]'::jsonb,'localities','[]'::jsonb,'stories','[]'::jsonb,'mediaEvidence','[]'::jsonb));
grant select on lh_commands to authenticated;
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true);
insert into lh_results select 'draft',public.local_hero_save_graph(value) from lh_commands;
select is((select value->>'ok' from lh_results where label='draft'),'true','LH_INCOMPLETE_DRAFT_SAVE');
select ok((select jsonb_array_length(value->'data'->'readiness'->'blocking')>0 from lh_results where label='draft'),'LH_STRUCTURAL_NOT_PUBLIC_READINESS');
select is(public.local_hero_save_graph((select value||'{"role":"system_admin"}'::jsonb from lh_commands))->'error'->>'code','INVALID_INPUT','LH_RAW_REST_EQUIVALENT');
select is(public.local_hero_save_graph((select value||jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000002','expectedRevision','0') from lh_commands))->'error'->>'code','STALE','LH_CAS_REJECTS_STALE');
select is(public.local_hero_save_graph((select value||jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000002','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-draft'),'stories',jsonb_build_array(jsonb_build_object('id','ee000000-0000-4000-8000-000000000001'))) from lh_commands))->'error'->>'code','FORBIDDEN','LH_CROSS_OWNER_ID');
select is((select name from public.historical_figures where slug='lh-synthetic-draft'),'Synthetic Draft','LH_ATOMIC_SAVE_ROLLBACK');
select is(public.local_hero_submit_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000002','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-draft'),'storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000003')))->'error'->>'code','READINESS_FAILED','LH_INCOMPLETE_CANNOT_SUBMIT');
select is((select workflow_status::text from public.figure_stories where id='ee000000-0000-4000-8000-000000000003'),'draft','LH_SUBMIT_ROLLBACK_STORY');
with attempted as(delete from public.figure_sources where figure_id='cc000000-0000-4000-8000-000000000001' returning figure_id) select is((select count(*)::integer from attempted),0,'LH_EDITOR_EDITABLE_ONLY');

select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000003',true);
with attempted as(update public.figure_localities set explanation='Forged admin content' where id='dd000000-0000-4000-8000-000000000001' returning id) select is((select count(*)::integer from attempted),0,'LH_ADMIN_PROTECTED_CHILD');
select throws_ok($q$delete from public.media_assets where id='ff000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_ADMIN_PROTECTED_IMAGE');
select throws_ok($q$update public.sources set title='Forged admin source' where id='bb000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_ADMIN_PROTECTED_SOURCE');
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'action','hide'))->>'ok','true','LH_ATOMIC_HIDE');
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'action','republish','storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000003')))->'error'->>'code','FORBIDDEN','LH_REPUBLISH_FORGED_STORY');
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'action','republish','storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000001')))->>'ok','true','LH_ATOMIC_REPUBLISH');
select is(public.local_hero_restore_draft(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one')))->>'ok','true','LH_ADMIN_RESTORE');
select is((select workflow_status::text from public.figure_stories where id='ee000000-0000-4000-8000-000000000001'),'draft','LH_RESTORE_STORIES');
reset role;
select set_config('request.jwt.claim.sub','',true);
select throws_ok($q$insert into public.figure_sources values('cc000000-0000-4000-8000-000000000002','synthetic-uncertain','bb000000-0000-4000-8000-000000000001','Synthetic claim','Synthetic locator','Synthetic scope','approximate',null)$q$,'23514',null,'LH_UNCERTAINTY_NOTE_REQUIRED');
-- A complete replacement changes the primary without violating the one-primary index.
create temporary table lh_full_graph as select jsonb_build_object(
  'figureId',f.id,'expectedRevision',f.local_hero_revision::text,
  'figure',jsonb_build_object('name',f.name,'slug',f.slug,'otherNames',f.other_names,'birthYear',f.birth_year,'deathYear',f.death_year,'biography',f.biography,'isLocalHero',true,'contributionSummary',f.contribution_summary,'contributionStartYear',f.contribution_start_year,'contributionEndYear',f.contribution_end_year,'catalogAliases',to_jsonb(f.catalog_aliases)),
  'sources',(select jsonb_agg(jsonb_build_object('claimKey',s.claim_key,'sourceId',s.source_id,'claimText',s.claim_text,'locator',s.locator,'scopeNote',s.scope_note,'certainty',s.certainty,'uncertaintyNote',s.uncertainty_note)) from public.figure_sources s where s.figure_id=f.id),
  'localities',(select jsonb_agg(jsonb_build_object('id',l.id,'localityCode',l.locality_code,'kind',l.relationship_kind,'historicalPlaceLabel',l.historical_place_label,'explanation',l.explanation,'claimKey',l.claim_key,'primarySourceId',l.primary_source_id,'certainty',l.certainty,'uncertaintyNote',l.uncertainty_note)) from public.figure_localities l where l.figure_id=f.id),
  'stories',(select jsonb_agg(jsonb_build_object('id',s.id,'slug',s.slug,'title',s.title,'summary',s.summary,'body',s.body,'sortOrder',s.sort_order,'isPrimary',s.id='ee000000-0000-4000-8000-000000000002','sources',coalesce((select jsonb_agg(jsonb_build_object('claimKey',c.claim_key,'sourceId',c.source_id,'claimText',c.claim_text,'locator',c.locator,'scopeNote',c.scope_note,'certainty',c.certainty,'uncertaintyNote',c.uncertainty_note)) from public.figure_story_sources c where c.story_id=s.id),'[]'::jsonb))) from public.figure_stories s where s.figure_id=f.id),
  'mediaEvidence',(select jsonb_agg(jsonb_build_object('mediaId',m.media_id,'depictionKind',m.depiction_kind,'decision',m.decision,'identitySourceId',m.identity_source_id,'identityLocator',m.identity_locator,'identityCertainty',m.identity_certainty,'usageBasis',m.usage_basis,'usageSourceId',m.usage_source_id,'usageLocator',m.usage_locator,'usageNote',m.usage_note,'checkedAt',to_char(m.checked_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'))) from public.figure_media_evidence m where m.figure_id=f.id)
) value from public.historical_figures f where f.id='cc000000-0000-4000-8000-000000000001';
grant select on lh_full_graph to authenticated;
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true);
insert into lh_results select 'replacement',public.local_hero_save_graph(value) from lh_full_graph;
select is((select value->>'ok' from lh_results where label='replacement'),'true','LH_ATOMIC_REPLACEMENT_PRIMARY');
select ok((select value->'data'->'readiness'->'blocking' @> '[{"code":"STORY_LENGTH"}]'::jsonb from lh_results where label='replacement'),'LH_DRAFT_FULL_READINESS');
select is(public.local_hero_save_graph((select jsonb_set(value,'{localities,0,explanation}','123')||jsonb_build_object('expectedRevision',(select local_hero_revision::text from public.historical_figures where id='cc000000-0000-4000-8000-000000000001')) from lh_full_graph))->'error'->>'code','INVALID_INPUT','LH_RAW_LOCALITY_TYPES');
select is(public.local_hero_save_graph((select jsonb_set(value,'{mediaEvidence,0,checkedAt}','"2026-10-26"')||jsonb_build_object('expectedRevision',(select local_hero_revision::text from public.historical_figures where id='cc000000-0000-4000-8000-000000000001')) from lh_full_graph))->'error'->>'code','INVALID_INPUT','LH_RAW_UTC_TIMESTAMP');
select lives_ok($q$update public.figure_media_evidence set usage_basis='coursework_reference',usage_source_id=null,usage_locator=null,usage_note='LH-1.0.0-draft.1 coursework attribution https://example.invalid/media-source' where media_id='ff000000-0000-4000-8000-000000000001'$q$,'LH_COURSEWORK_NULL_LICENSE');
select throws_ok($q$update public.figure_localities set figure_id='cc000000-0000-4000-8000-000000000002' where id='dd000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_OLD_NEW_LOCALITY_OWNER');
select throws_ok($q$update public.figure_story_sources set story_id='ee000000-0000-4000-8000-000000000003' where story_id='ee000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_OLD_NEW_STORY_OWNER');
select throws_ok($q$update public.media_assets set figure_id='cc000000-0000-4000-8000-000000000002' where id='ff000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_OLD_NEW_MEDIA_OWNER');
select throws_ok($q$update public.figure_media_evidence set figure_id='cc000000-0000-4000-8000-000000000002' where media_id='ff000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_OLD_NEW_EVIDENCE_OWNER');
select throws_ok($q$update public.historical_figures set is_local_hero=false where id='cc000000-0000-4000-8000-000000000001'$q$,'LH002','FORBIDDEN','LH_ENROLLMENT_CANNOT_ESCAPE');
reset role;
select set_config('request.jwt.claim.sub','',true);
update public.figure_stories set workflow_status='hidden' where id='ee000000-0000-4000-8000-000000000003';
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true);
select is(public.local_hero_save_graph((select jsonb_set(value,'{figure,slug}','"lh-synthetic-draft"')||jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000002','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-draft')) from lh_commands))->'error'->>'code','FORBIDDEN','LH_OMITTED_LOCKED_STORY_DENIED');
reset role;
select set_config('request.jwt.claim.sub','',true);
-- Thirteen additional synthetic public people prove real DB pagination/order/dedup/counts.
set constraints all deferred;
insert into public.historical_figures(id,name,slug,is_local_hero,contribution_summary,contribution_start_year,contribution_end_year,workflow_status)
select ('ca000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,case i when 1 then 'An Synthetic' when 2 then 'Ân Synthetic' else 'Z Synthetic' end,'lh-page-'||lpad(i::text,2,'0'),true,'Synthetic contribution',1940,1950,'published' from generate_series(1,13) i;
insert into public.figure_sources(figure_id,claim_key,source_id,claim_text,locator,scope_note,certainty)
select f.id,k,'bb000000-0000-4000-8000-000000000001','Synthetic claim','Synthetic paragraph','Synthetic scope','verified' from public.historical_figures f cross join unnest(array['identity','contribution','period','locality:01:activity']) k where f.id::text like 'ca000000-%';
insert into public.figure_localities(figure_id,locality_code,relationship_kind,historical_place_label,explanation,claim_key,primary_source_id,certainty)
select id,'01','activity','Synthetic historical place','Synthetic mapping','locality:01:activity','bb000000-0000-4000-8000-000000000001','verified' from public.historical_figures where id::text like 'ca000000-%';
insert into public.figure_sources values('ca000000-0000-4000-8000-000000000001','locality:04:home_origin','bb000000-0000-4000-8000-000000000001','Synthetic mapping','Synthetic paragraph','Synthetic scope','verified',null);
insert into public.figure_localities(figure_id,locality_code,relationship_kind,historical_place_label,explanation,claim_key,primary_source_id,certainty) values('ca000000-0000-4000-8000-000000000001','04','home_origin','Synthetic second place','Synthetic mapping','locality:04:home_origin','bb000000-0000-4000-8000-000000000001','verified');
insert into public.figure_stories(id,figure_id,slug,title,summary,body,is_primary,workflow_status)
select ('ea000000-0000-4000-8000-'||right(id::text,12))::uuid,id,'synthetic-primary','Synthetic story','Synthetic summary',repeat('từ ',360)||'[[cite:synthetic-story]]',true,'published' from public.historical_figures where id::text like 'ca000000-%';
insert into public.figure_story_sources(story_id,claim_key,source_id,claim_text,locator,scope_note,certainty)
select id,'synthetic-story','bb000000-0000-4000-8000-000000000002','Synthetic story claim','Synthetic paragraph','Synthetic scope','verified' from public.figure_stories where id::text like 'ea000000-%';
insert into public.media_assets(id,figure_id,file_url,media_type,caption,alt_text,source_id,era,photographer,width,height,source_page_url)
select ('fa000000-0000-4000-8000-'||right(id::text,12))::uuid,id,'https://example.invalid/fixture.jpg','image','Tư liệu bối cảnh, không phải chân dung','Synthetic document','bb000000-0000-4000-8000-000000000005','historical','Synthetic archive; unknown author',480,300,'https://example.invalid/source' from public.historical_figures where id::text like 'ca000000-%';
insert into public.figure_media_evidence
select ma.id,ma.figure_id,'historical_context','accepted','bb000000-0000-4000-8000-000000000003','Synthetic identity','verified','permission','bb000000-0000-4000-8000-000000000004','Synthetic permission',null,timestamptz '2026-10-26T00:00:00Z' from public.media_assets ma where ma.id::text like 'fa000000-%';
update public.historical_figures set workflow_status='published' where id='cc000000-0000-4000-8000-000000000003';
insert into public.curriculum_topics(id,name,slug,workflow_status) values('c9000000-0000-4000-8000-000000000001','Synthetic shared-source topic','lh-synthetic-topic','published');
insert into public.historical_events(id,topic_id,title,slug,start_year,date_text,date_precision,summary) values('e9000000-0000-4000-8000-000000000001','c9000000-0000-4000-8000-000000000001','Synthetic shared-source event','lh-synthetic-event',1940,'1940','year','Synthetic event');
insert into public.event_sources(event_id,source_id) values('e9000000-0000-4000-8000-000000000001','bb000000-0000-4000-8000-000000000007');
update public.historical_events set workflow_status='published' where id='e9000000-0000-4000-8000-000000000001';
set constraints all immediate;
select is((select count(*)::integer from pg_trigger where tgname='trg_lh_graph_integrity' and tgdeferrable and tginitdeferred),8,'LH_ALL_REVERSE_CONSTRAINT_TRIGGERS');
select ok((select bool_and(relrowsecurity) from pg_class where oid in ('public.history_localities'::regclass,'public.figure_sources'::regclass,'public.figure_localities'::regclass,'public.figure_stories'::regclass,'public.figure_story_sources'::regclass,'public.figure_media_evidence'::regclass)),'LH_ALL_TABLES_RLS');
select ok(not has_function_privilege('authenticated','private.local_hero_assert_graph(uuid)','EXECUTE'),'LH_PRIVATE_HELPERS_NONCALLABLE');
set local role anon;
select is((public.local_hero_page(null,'',1)->>'totalPeople')::integer,13,'LH_DISTINCT_PEOPLE_MULTI_LOCALITY');
select is(jsonb_array_length(public.local_hero_page(null,'',1)->'items'),12,'LH_BOUNDED_PAGE_12');
select is((select count(distinct v->>'id')::integer from jsonb_array_elements(public.local_hero_page(null,'',1)->'items') v),12,'LH_NO_DUPLICATE_CARD_IDS');
select is(public.local_hero_page(null,'',1)->'items'->0->>'name','An Synthetic','LH_VI_NAME_ORDER_A');
select is(public.local_hero_page(null,'',1)->'items'->1->>'name','Ân Synthetic','LH_VI_NAME_ORDER_CIRCUMFLEX');
select is(public.local_hero_page(null,'',1)->'items'->2->>'slug','lh-page-03','LH_SLUG_TIE_BREAK_C');
select is((public.local_hero_page(null,'',999999)->'filters'->>'page')::integer,2,'LH_PAGE_CLAMP_AFTER_COUNT');
select is(public.local_hero_page(null,'',999999)->'items'->0->>'slug','lh-page-13','LH_LAST_PAGE_DETERMINISTIC');
select is((public.local_hero_page('04','',1)->>'totalPeople')::integer,1,'LH_SECOND_LOCALITY_SAME_IDENTITY');
select is((public.local_hero_page(null,'no-match',1)->'coverage'->>'representedLocalities')::integer,2,'LH_COVERAGE_INDEPENDENT_OF_QUERY');
select is((select count(*)::integer from public.historical_figures where slug='lh-synthetic-legacy'),1,'LH_LEGACY_PUBLIC_BEHAVIOR');
select is(public.local_hero_profile('lh-synthetic-legacy'),null::jsonb,'LH_LEGACY_NOT_AUTO_ENROLLED');
select is((select count(*)::integer from public.sources where id='bb000000-0000-4000-8000-000000000007'),1,'LH_SHARED_EVENT_SOURCE');
reset role;
-- Fault injection proves the page batches its child reads instead of calling a profile per card.
create or replace function public.local_hero_profile(p_slug text) returns jsonb language plpgsql stable security invoker set search_path='' as $$
begin raise exception 'SYNTHETIC_PROFILE_FAILURE'; end $$;
set local role anon;
select lives_ok($q$select public.local_hero_page(null,'',1)$q$,'LH_PAGE_BATCH_NO_PROFILE_N_PLUS_ONE');
reset role;
select * from finish();
rollback;
