-- Explicitly synthetic, local-only regression data. Never import as historical content.
insert into auth.users(id,email) values
('aa000000-0000-4000-8000-000000000001','lh-editor@example.invalid'),
('aa000000-0000-4000-8000-000000000002','lh-reviewer@example.invalid'),
('aa000000-0000-4000-8000-000000000003','lh-admin@example.invalid'),
('aa000000-0000-4000-8000-000000000004','lh-learner@example.invalid'),
('aa000000-0000-4000-8000-000000000005','lh-locked-editor@example.invalid'),
('aa000000-0000-4000-8000-000000000006','lh-locked-reviewer@example.invalid'),
('aa000000-0000-4000-8000-000000000007','lh-locked-admin@example.invalid');
insert into public.staff_profiles(id,role,account_status) values
('aa000000-0000-4000-8000-000000000001','editor','active'),
('aa000000-0000-4000-8000-000000000002','reviewer','active'),
('aa000000-0000-4000-8000-000000000003','system_admin','active'),
('aa000000-0000-4000-8000-000000000005','editor','locked'),
('aa000000-0000-4000-8000-000000000006','reviewer','locked'),
('aa000000-0000-4000-8000-000000000007','system_admin','locked');

insert into public.sources(id,title,author_org,publisher,url,source_type,citation,accessed_at)
select ('bb000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'Synthetic source '||i,'Synthetic archive '||i,'Synthetic institution','https://example.invalid/source-'||i,'archive','Synthetic fixture citation',date '2026-10-26' from generate_series(1,8) i;
insert into public.historical_figures(id,name,slug,is_local_hero,contribution_summary,contribution_start_year,contribution_end_year,catalog_aliases) values
('cc000000-0000-4000-8000-000000000001','Đặng Nhân Vật Giả','lh-synthetic-one',true,'Đóng góp giả định % _ để kiểm thử',1940,1950,array['Bí danh giả']),
('cc000000-0000-4000-8000-000000000002','Synthetic Draft','lh-synthetic-draft',true,null,null,null,'{}'),
('cc000000-0000-4000-8000-000000000003','Synthetic Legacy','lh-synthetic-legacy',false,null,null,null,'{}');
insert into public.figure_sources(figure_id,claim_key,source_id,claim_text,locator,scope_note,certainty)
select 'cc000000-0000-4000-8000-000000000001',k,'bb000000-0000-4000-8000-000000000001','Synthetic claim '||k,'Synthetic paragraph','Synthetic scope','verified' from unnest(array['identity','contribution','period','aliases','locality:01:activity','locality:04:home_origin','locality:08:commemoration','locality:12:commemoration']) k;
insert into public.figure_sources values('cc000000-0000-4000-8000-000000000002','identity','bb000000-0000-4000-8000-000000000006','Synthetic draft identity','Synthetic paragraph','Synthetic scope','verified',null);
insert into public.figure_localities(id,figure_id,locality_code,relationship_kind,historical_place_label,explanation,claim_key,primary_source_id,certainty)
select ('dd000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'cc000000-0000-4000-8000-000000000001',code,kind,'Synthetic historical label','Synthetic evidenced mapping','locality:'||code||':'||kind,'bb000000-0000-4000-8000-000000000001','verified' from (values(1,'01','activity'),(2,'04','home_origin'),(3,'08','commemoration')) v(i,code,kind);
insert into public.figure_stories(id,figure_id,slug,title,summary,body,is_primary) values
('ee000000-0000-4000-8000-000000000001','cc000000-0000-4000-8000-000000000001','synthetic-primary','Synthetic sourced story','Synthetic summary',repeat('từ ',360)||'[[cite:synthetic-story]]',true),
('ee000000-0000-4000-8000-000000000002','cc000000-0000-4000-8000-000000000001','synthetic-private','PRIVATE_STORY_SENTINEL','', '',false),
('ee000000-0000-4000-8000-000000000003','cc000000-0000-4000-8000-000000000002','foreign-story','Synthetic other parent','', '',false);
insert into public.figure_story_sources values('ee000000-0000-4000-8000-000000000001','synthetic-story','bb000000-0000-4000-8000-000000000002','Synthetic story claim','Synthetic paragraph','Synthetic scope','verified',null);
insert into public.media_assets(id,figure_id,file_url,media_type,caption,alt_text,source_id,era,photographer,width,height) values
('ff000000-0000-4000-8000-000000000001','cc000000-0000-4000-8000-000000000001','https://example.invalid/synthetic.jpg','image','Tư liệu bối cảnh, không phải chân dung. Synthetic fixture.','Synthetic archival document','bb000000-0000-4000-8000-000000000005','historical','Synthetic archive; unknown author',480,300),
('ff000000-0000-4000-8000-000000000002','cc000000-0000-4000-8000-000000000001','https://example.invalid/private.jpg','image','PRIVATE_MEDIA_SENTINEL','Synthetic held image',null,'historical',null,null,null),
('ff000000-0000-4000-8000-000000000003','cc000000-0000-4000-8000-000000000001','https://example.invalid/no-evidence.jpg','image','PRIVATE_MEDIA_WITHOUT_EVIDENCE','Synthetic candidate',null,'historical',null,null,null);
insert into public.figure_media_evidence values
('ff000000-0000-4000-8000-000000000001','cc000000-0000-4000-8000-000000000001','historical_context','accepted','bb000000-0000-4000-8000-000000000003','Synthetic identity paragraph','verified','permission','bb000000-0000-4000-8000-000000000004','Synthetic permission locator',null,timestamptz '2026-10-26T00:00:00Z'),
('ff000000-0000-4000-8000-000000000002','cc000000-0000-4000-8000-000000000001','portrait','held','bb000000-0000-4000-8000-000000000006','Unverified synthetic lead','approximate','unknown',null,null,null,null);
update public.media_assets set source_page_url='https://example.invalid/media-source' where id='ff000000-0000-4000-8000-000000000001';
