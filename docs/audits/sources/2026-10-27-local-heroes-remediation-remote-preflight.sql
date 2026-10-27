begin read only;
select jsonb_build_object(
  'server_version',current_setting('server_version'),
  'catalog_tables',(select coalesce(jsonb_agg(tablename order by tablename),'[]'::jsonb) from pg_tables where schemaname='public' and (tablename like 'figure_%' or tablename in ('history_localities','historical_figures','sources','media_assets'))),
  'figure_columns',(select jsonb_agg(column_name order by ordinal_position) from information_schema.columns where table_schema='public' and table_name='historical_figures'),
  'migration_table_exists',to_regclass('supabase_migrations.schema_migrations') is not null,
  'figures',(select coalesce(jsonb_agg(jsonb_build_object('id',f.id,'name',f.name,'slug',f.slug,'status',f.workflow_status,'is_local_hero',to_jsonb(f)->'is_local_hero','event_links',(select count(*) from public.event_figures e where e.figure_id=f.id)) order by f.slug),'[]'::jsonb) from public.historical_figures f),
  'sources',(select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'title',s.title,'url',s.url) order by s.id),'[]'::jsonb) from public.sources s),
  'figure_media',(select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'figure_id',m.figure_id,'file_url',m.file_url,'source_id',m.source_id,'source_page_url',to_jsonb(m)->'source_page_url') order by m.id),'[]'::jsonb) from public.media_assets m where m.figure_id is not null),
  'event_count',(select count(*) from public.historical_events)
) as inventory;
commit;
