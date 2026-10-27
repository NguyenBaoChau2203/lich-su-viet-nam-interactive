-- Explicitly synthetic, local-only regression data for Heritage Sites (HS-1.0). Never import as historical content.
insert into auth.users(id,email) values
('aa000000-0000-4000-8000-000000000001','hs-editor@example.invalid'),
('aa000000-0000-4000-8000-000000000002','hs-reviewer@example.invalid'),
('aa000000-0000-4000-8000-000000000003','hs-admin@example.invalid'),
('aa000000-0000-4000-8000-000000000004','hs-learner@example.invalid')
on conflict (id) do nothing;

insert into public.staff_profiles(id,role,account_status) values
('aa000000-0000-4000-8000-000000000001','editor','active'),
('aa000000-0000-4000-8000-000000000002','reviewer','active'),
('aa000000-0000-4000-8000-000000000003','system_admin','active')
on conflict (id) do nothing;

insert into public.sources(id,title,author_org,publisher,url,source_type,citation,accessed_at) values
('bb000000-0000-4000-9000-000000000001','Synthetic Heritage Source 1','Cục Di sản văn hóa','Bộ VHTTDL','https://example.invalid/hs-1','official','Citation 1',date '2026-10-27'),
('bb000000-0000-4000-9000-000000000002','Synthetic Heritage Source 2','Bảo tàng Lịch sử','Bộ VHTTDL','https://example.invalid/hs-2','official','Citation 2',date '2026-10-27'),
('bb000000-0000-4000-9000-000000000003','Synthetic Draft Heritage Source 3','Báo Quân đội nhân dân','QĐND','https://example.invalid/hs-3','article','Citation 3',date '2026-10-27')
on conflict (id) do nothing;

insert into public.historical_locations(id,name,slug,description,latitude,longitude,accuracy_level,accuracy_note,workflow_status,locality_code,heritage_tier,heritage_rank,heritage_period,heritage_teaser,lesson_slug) values
('cc000000-0000-4000-9000-000000000001','Synthetic Published Site','hs-synthetic-published','Description published site',16.75,107.18,'exact','Tọa độ đo trên OSM','published','44','grade12',1,'1972','Đoạn giới thiệu teaser của địa danh xuất bản kiểm thử với độ dài trên bốn mươi ký tự chuẩn xác.','chien-dich-ho-chi-minh-1975'),
('cc000000-0000-4000-9000-000000000002','Synthetic Draft Site','hs-synthetic-draft','Description draft site',16.80,107.20,'exact','Tọa độ đo trên OSM','draft','44','extended',2,'1965-1972','Đoạn giới thiệu teaser của địa danh bản thảo kiểm thử với độ dài trên bốn mươi ký tự chuẩn xác.',null)
on conflict (id) do nothing;

insert into public.location_story_sections(id,location_id,sort_order,heading,body,certainty,uncertainty_note) values
('dd000000-0000-4000-9000-000000000001','cc000000-0000-4000-9000-000000000001',1,'Bối cảnh',repeat('Nội dung đoạn bối cảnh của di tích xuất bản kiểm thử độ dài trên 80 ký tự. ', 3),'verified',null),
('dd000000-0000-4000-9000-000000000002','cc000000-0000-4000-9000-000000000001',2,'Ý nghĩa',repeat('Nội dung đoạn ý nghĩa của di tích xuất bản kiểm thử độ dài trên 80 ký tự. ', 3),'verified',null),
('dd000000-0000-4000-9000-000000000003','cc000000-0000-4000-9000-000000000002',1,'Bối cảnh',repeat('Nội dung đoạn bối cảnh của di tích bản thảo kiểm thử độ dài trên 80 ký tự. ', 3),'verified',null)
on conflict (id) do nothing;

insert into public.location_story_sources(section_id,source_id,locator,scope_note) values
('dd000000-0000-4000-9000-000000000001','bb000000-0000-4000-9000-000000000001','mục 1, đoạn 2','bối cảnh lịch sử'),
('dd000000-0000-4000-9000-000000000002','bb000000-0000-4000-9000-000000000002','trang 45-48','ý nghĩa di tích'),
('dd000000-0000-4000-9000-000000000003','bb000000-0000-4000-9000-000000000003','trang 12','bản thảo draft')
on conflict (section_id, source_id) do nothing;

insert into public.location_videos(id,location_id,youtube_id,title,channel,channel_url,note,embed_checked_at,sort_order) values
('ee000000-0000-4000-9000-000000000001','cc000000-0000-4000-9000-000000000001','AbCdEf12345','Video Thành Cổ','Kênh QPVN','https://www.youtube.com/@qpvn','Tư liệu 81 ngày đêm','2026-10-27',1),
('ee000000-0000-4000-9000-000000000002','cc000000-0000-4000-9000-000000000002','ZyXwVu98765','Video Vịnh Mốc','Kênh VTV','https://www.youtube.com/@vtv','Tư liệu làng hầm','2026-10-27',1)
on conflict (id) do nothing;

insert into public.media_assets(id,location_id,file_url,source_page_url,media_type,caption,alt_text,era,usage_basis,is_cover,license,license_url,photographer,width,height) values
('ff000000-0000-4000-9000-000000000001','cc000000-0000-4000-9000-000000000001','https://example.invalid/pub.jpg','https://example.invalid/pub','image','Ảnh đài tưởng niệm thành cổ hôm nay','Đài tưởng niệm Thành cổ Quảng Trị','today','open_license',true,'CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/','Photographer',1600,1067),
('ff000000-0000-4000-9000-000000000002','cc000000-0000-4000-9000-000000000002','https://example.invalid/draft.jpg','https://example.invalid/draft','image','Ảnh địa đạo Vịnh Mốc bản thảo','Cửa hầm địa đạo Vịnh Mốc','today','open_license',true,'CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/','Photographer',1600,1067)
on conflict (id) do nothing;
