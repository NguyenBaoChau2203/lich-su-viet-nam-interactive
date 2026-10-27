-- Synthetic-only structural regression. Use the descriptor-confirmed disposable project.
begin;
create extension if not exists pgtap with schema extensions;
set search_path=public,extensions;
select plan(8);
\ir fixtures/local-heroes.inc
update public.historical_figures set birth_year=1900 where slug='lh-synthetic-one';
insert into public.figure_sources(figure_id,claim_key,source_id,claim_text,locator,scope_note,certainty) values
('cc000000-0000-4000-8000-000000000001','birth_year','bb000000-0000-4000-8000-000000000001','Synthetic year 1900','Synthetic paragraph','Synthetic scope','verified'),
('cc000000-0000-4000-8000-000000000001','birth_year','bb000000-0000-4000-8000-000000000003','Synthetic year 1901','Synthetic paragraph','Synthetic scope','verified');
select throws_ok('set constraints all immediate','23514','LH_CLAIM_GROUP','LH_FIGURE_CLAIM_GROUP_CONSISTENCY');
update public.figure_sources set claim_text='Synthetic year 1900' where figure_id='cc000000-0000-4000-8000-000000000001' and claim_key='birth_year';
select lives_ok('set constraints all immediate','LH_MATCHING_FIGURE_CORROBORATION_ALLOWED');
set constraints all deferred;
insert into public.figure_story_sources(story_id,claim_key,source_id,claim_text,locator,scope_note,certainty) values
('ee000000-0000-4000-8000-000000000001','synthetic-story','bb000000-0000-4000-8000-000000000003','Synthetic conflicting narrative','Synthetic paragraph','Synthetic scope','verified');
select throws_ok('set constraints all immediate','23514','LH_CLAIM_GROUP','LH_STORY_CLAIM_GROUP_CONSISTENCY');
update public.figure_story_sources set claim_text='Synthetic story claim' where story_id='ee000000-0000-4000-8000-000000000001' and claim_key='synthetic-story';
select lives_ok('set constraints all immediate','LH_MATCHING_STORY_CORROBORATION_ALLOWED');
set local role authenticated;
select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000003',true);
select is(public.local_hero_submit_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000001')))->>'ok','true','LH_CORROBORATED_GRAPH_SUBMIT');
select is(public.local_hero_review_graph(jsonb_build_object('figureId','cc000000-0000-4000-8000-000000000001','expectedRevision',(select local_hero_revision::text from public.historical_figures where slug='lh-synthetic-one'),'action','publish'))->>'ok','true','LH_CORROBORATED_GRAPH_PUBLISH');
set local role anon;
select set_config('request.jwt.claim.sub','',true);
select is(public.local_hero_profile('lh-synthetic-one')->>'birthYear','1900','LH_MULTI_SOURCE_DATE_READER');
select is((select jsonb_array_length(value->'sources') from jsonb_array_elements(public.local_hero_profile('lh-synthetic-one')->'claims') where value->>'key'='birth_year'),2,'LH_CORROBORATION_MERGED_WITHOUT_CHOOSING_A_SOURCE');
select * from finish();
rollback;
