-- Heritage Sites Media Corrective Release (ROLLBACK)
-- Restores exact state recorded in before.json
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';
SET LOCAL TIME ZONE 'UTC';
SET standard_conforming_strings = on;
SELECT pg_advisory_xact_lock(18012, 3402);
SET CONSTRAINTS ALL DEFERRED;

-- 1. Remove newly inserted media assets
DELETE FROM public.media_assets WHERE file_url LIKE 'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/%';

-- 2. Restore previously deleted media assets
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '788efc9c-c9b1-4c76-ad18-51740f1f0f79', (SELECT id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Doan_Mon_-_Hanoi_Citadel.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Doan_Mon_-_Hanoi_Citadel.jpg', 'image', 'Cổng Đoan Môn – cửa ngõ chính vào Cấm thành Thăng Long tại trung tâm Hà Nội.', 'Cổng Đoan Môn cổ kính bằng gạch ngói với ba tầng lầu nhìn ra sân cỏ rộng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '9f86bd65-6097-457c-bab9-22c464ac3b66', (SELECT id FROM public.historical_locations WHERE slug = 'thanh-nha-ho'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_nha_Ho_Cong_Nam.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Thanh_nha_Ho_Cong_Nam.jpg', 'image', 'Cổng Nam Thành nhà Hồ với 3 vòm cuốn bằng đá nguyên khối tráng lệ trải qua hơn 6 thế kỷ.', 'Bức tường thành bằng đá xám vĩ đại với ba cửa vòm vươn cao giữa cánh đồng cỏ rộng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'b8cc55c9-18ce-4cb3-9257-22f88c16afdb', (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Maison_Centrale_Hanoi_entrance.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Maison_Centrale_Hanoi_entrance.jpg', 'image', 'Cổng chính Di tích Lịch sử Nhà tù Hỏa Lò (Maison Centrale) tại quận Hoàn Kiếm, Hà Nội.', 'Cổng chính kiến trúc kiên cố bằng đá sẫm màu của Nhà tù Hỏa Lò tại Hà Nội',
  'Wikimedia Commons Contributor', 'CC BY-SA 3.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '383b7e6c-378b-4742-b993-8e19fd4aa9d2', (SELECT id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao'),
  'https://caobang.gov.vn/uploads/images/2021/12/khu-di-tich-rung-tran-hung-dao.jpg', 'https://caobang.gov.vn/di-tich-rung-tran-hung-dao', 'image', 'Bia ghi danh 34 chiến sĩ Đội Việt Nam Tuyên truyền Giải phóng quân giữa cánh rừng đại ngàn Trần Hưng Đạo, Nguyên Bình, Cao Bằng.', 'Bia đá di tích hình đóm lửa dựng giữa tán rừng cây cổ thụ râm mát',
  'Cổng Thông tin Điện tử tỉnh Cao Bằng', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'f608e946-2407-4196-8b56-1fbbba38f0d0', (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Tan_Trao.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Dinh_Tan_Trao.jpg', 'image', 'Đình Tân Trào – nơi diễn ra Quốc dân Đại hội tháng 8/1945 quyết định Tổng khởi nghĩa giành chính quyền.', 'Ngôi đình gỗ mái lá đơn sơ truyền thống tọa lạc giữa vườn cây xanh ngát ở Tuyên Quang',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '284b2009-d6f6-44c8-bb69-20627fbc272c', (SELECT id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cot_co_Lung_Cu_-_Ha_Giang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cot_co_Lung_Cu_-_Ha_Giang.jpg', 'image', 'Cột cờ Quốc gia Lũng Cú sừng sững trên đỉnh núi Rồng, lá cờ 54m² bay phấp phới giữa đất trời biên cương.', 'Tháp cột cờ bằng đá vươn cao trên đỉnh núi đá hùng vĩ với lá cờ đỏ sao vàng lớn đang bay',
  'Wikimedia Commons Contributor', 'CC BY-SA 3.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '4a3d854b-b792-42ab-a8ed-9dfda2692be3', (SELECT id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/My_Son_Sanctuary_Quang_Nam.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:My_Son_Sanctuary_Quang_Nam.jpg', 'image', 'Quần thể các đền tháp gạch nung rêu phong cổ kính giữa thung lũng xanh Thánh địa Mỹ Sơn.', 'Các khối đền tháp Chăm bằng gạch nung màu đỏ trầm sừng sững giữa cây rừng nhiệt đới',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '74cfeed9-0c1b-45e2-8201-207b16a5ff79', (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Doi_A1_Dien_Bien_Phu.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Doi_A1_Dien_Bien_Phu.jpg', 'image', 'Hố phễu bộc phá lịch sử sâu hoắm trên đỉnh Đồi A1 sau tiếng nổ đêm 6/5/1954 trong Chiến dịch Điện Biên Phủ.', 'Miệng hố đất đá hình phễu khổng lồ do khối bộc phá tạo ra trên đỉnh đồi thoai thoải',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '62cc1be4-8776-43b5-aa7b-bf0d1f64a8e2', (SELECT id FROM public.historical_locations WHERE slug = 'ham-de-castries'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ham_De_Castries_Dien_Bien_Phu.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ham_De_Castries_Dien_Bien_Phu.jpg', 'image', 'Cửa vào Hầm Sở chỉ huy Tướng De Castries với kết cấu vòm thép và bao cát tại cánh đồng Mường Thanh.', 'Lối vào hầm ngầm xây bằng vòm sắt uốn cong phủ các lớp bao cát đất bảo vệ xung quanh',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '7bd20f07-9c22-4e10-87f5-e0709fa42656', (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953'),
  'https://laichau.gov.vn/uploads/images/2023/12/chien-thang-lai-chau-1953.jpg', 'https://laichau.gov.vn/di-tich-chien-thang-lai-chau-1953', 'image', 'Tượng đài Chiến thắng Giải phóng Lai Châu năm 1953 sừng sững bên dòng sông Đà hùng vĩ.', 'Tượng đài chiến sĩ bộ đội và nhân dân các dân tộc Tây Bắc giương cao cờ chiến thắng',
  'Cổng Thông tin Điện tử tỉnh Lai Châu', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '25bb0ec1-afc6-40d9-95aa-54593153d02f', (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-son-la'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Son_La.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nha_tu_Son_La.jpg', 'image', 'Bức tường đá kiên cố và các dãy xà lim Di tích Quốc gia Đặc biệt Nhà tù Sơn La trên đồi Khau Cả.', 'Khu phế tích tường đá cổ xám rêu phong của các buồng giam nhà lao Sơn La',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'd41f5dfc-cc39-45f1-9b1d-cd5985bd27b6', (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930'),
  'https://yenbai.gov.vn/uploads/images/2020/02/khu-tuong-niem-nguyen-thai-hoc.jpg', 'https://yenbai.gov.vn/di-tich-khoi-nghia-yen-bai', 'image', 'Tượng đài nhà yêu nước Nguyễn Thái Học cùng các nghĩa sĩ Khởi nghĩa Yên Bái năm 1930 tại công viên Yên Hòa.', 'Tượng đài đá cẩm thạch tạc hình người chiến sĩ yêu nước đứng hiên ngang giữa quảng trường xanh',
  'Cổng Thông tin Điện tử tỉnh Yên Bái', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'eab40afa-ab78-4dcb-b578-75c6bb8f09ff', (SELECT id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Lan_Na_Nua_ATK_Dinh_Hoa.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Lan_Na_Nua_ATK_Dinh_Hoa.jpg', 'image', 'Căn lán gỗ mộc mạc tại lán Tỉn Keo, ATK Định Hóa – nơi Bác Hồ chủ trì cuộc họp Bộ Chính trị mở Chiến dịch Điện Biên Phủ.', 'Ngôi lán nhỏ bằng tre nứa mái cọ lợp tranh đơn sơ nép mình bên sườn đồi xanh',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '02e4a1ea-a25f-430b-a563-5de021c7e5b0', (SELECT id FROM public.historical_locations WHERE slug = 'atk-cho-don'),
  'https://backan.gov.vn/uploads/images/2022/05/atk-cho-don.jpg', 'https://backan.gov.vn/di-tich-atk-cho-don', 'image', 'Khu di tích lịch sử lán Nà Pậu – nơi Chủ tịch Hồ Chí Minh sống và làm việc đầu năm 1951 tại ATK Chợ Đồn.', 'Căn lán gỗ sàn truyền thống nép mình bên gốc cây đại ngàn giữa núi rừng xanh thẳm',
  'Cổng Thông tin Điện tử tỉnh Bắc Kạn', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '92d25f85-2d5d-4b5e-a40d-df00cbf63d45', (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son'),
  'https://langson.gov.vn/uploads/images/2021/09/di-tich-don-mo-nhai-bac-son.jpg', 'https://langson.gov.vn/di-tich-khoi-nghia-bac-son', 'image', 'Địa điểm Đồn Mỏ Nhài – nơi nhân dân Bắc Sơn đánh chiếm đêm 27/9/1940 mở đầu khởi nghĩa vũ trang.', 'Bia đá di tích và công viên đài tưởng niệm Khởi nghĩa Bắc Sơn tại Lạng Sơn',
  'Cổng Thông tin Điện tử tỉnh Lạng Sơn', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '148d4502-9bcb-4fe8-bd57-9310d026bbe5', (SELECT id FROM public.historical_locations WHERE slug = 'ai-chi-lang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ai_Chi_Lang_Lang_Son.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ai_Chi_Lang_Lang_Son.jpg', 'image', 'Thung lũng Ải Chi Lăng nhìn về hướng núi Mã Yên – nơi nghĩa quân Lam Sơn chém tướng Liễu Thăng năm 1427.', 'Toàn cảnh thung lũng xanh mướt với những dãy núi đá vôi sừng sững bao bọc hai bên',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '1468b1ac-6586-4388-8c75-2a5880b0a193', (SELECT id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai'),
  'https://quangninh.gov.vn/uploads/images/2021/03/di-tich-bac-ho-ve-tham-deo-nai.jpg', 'https://quangninh.gov.vn/di-tich-mo-than-deo-nai', 'image', 'Khu di tích lịch sử Tượng đài Bác Hồ về thăm mỏ than Đèo Nai tại thành phố Cẩm Phả, Quảng Ninh.', 'Tượng đài Chủ tịch Hồ Chí Minh đứng giản dị vẫy tay chào thợ mỏ giữa khuôn viên râm mát',
  'Cổng Thông tin Điện tử tỉnh Quảng Ninh', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'a338a171-ea01-4407-8a58-4251633dee43', (SELECT id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Bai_coc_Bach_Dang_Yen_Hung.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Bai_coc_Bach_Dang_Yen_Hung.jpg', 'image', 'Bãi cọc gỗ lim lịch sử được khai quật và bảo tồn nguyên trạng tại Di tích Bạch Đằng, Quảng Ninh.', 'Những đầu cọc gỗ lim cổ thụ đen bóng vùi sâu trong bùn đất được che mái bảo tồn cẩn thận',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'ef5ea1a9-1116-437b-86d9-4d31a3a274bf', (SELECT id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa'),
  'https://bacninh.gov.vn/uploads/images/2021/01/di-tich-atk2-hiep-hoa.jpg', 'https://bacninh.gov.vn/di-tich-atk-ii-hiep-hoa', 'image', 'Đình Xuân Biều – một trong những điểm di tích lịch sử trung tâm của An toàn khu ATK II Hiệp Hòa.', 'Ngôi đình làng cổ mái ngói rêu phong nằm yên bình dưới rặng đa cổ thụ',
  'Cổng Thông tin Điện tử tỉnh', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'f130b771-7a8c-4170-a442-69eb8041acaa', (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Don_Phon_Xuong_Yen_The.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Don_Phon_Xuong_Yen_The.jpg', 'image', 'Cổng vào Di tích Đồn Phồn Xương – đại bản doanh kiên cố của thủ lĩnh Hoàng Hoa Thám tại Yên Thế.', 'Cổng lũy đất đá kiên cố được phục dựng trang nghiêm giữa vườn cây xanh',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '15323e78-37cb-451b-91e0-4e9504cc8b8d', (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung'),
  'https://phutho.gov.vn/uploads/images/2021/10/tuong-dai-chien-thang-song-lo.jpg', 'https://phutho.gov.vn/di-tich-chien-thang-song-lo', 'image', 'Tượng đài Chiến thắng Sông Lô oai nghiêm trên đỉnh đồi cao thị trấn Đoan Hùng nhìn xuống dòng sông cuộn sóng.', 'Tượng đài pháo binh và người chiến sĩ giải phóng quân đứng hiên ngang trên đỉnh đồi',
  'Cổng Thông tin Điện tử tỉnh Phú Thọ', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'ec0cb811-1181-4021-8050-be7614657eb2', (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cong_Den_Hung_Phu_Tho.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cong_Den_Hung_Phu_Tho.jpg', 'image', 'Cổng chính lối lên các ngôi đền cổ kính trên núi Nghĩa Lĩnh, Khu di tích lịch sử Đền Hùng.', 'Cổng đền tam quan bằng đá ngói uy nghi dưới chân rừng cây cổ thụ Đền Hùng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '76e54387-386c-4d53-81f3-cc0e77aaf671', (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_K15_Do_Son_Hai_Phong.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ben_K15_Do_Son_Hai_Phong.jpg', 'image', 'Các trụ cầu cảng bê tông lịch sử của Bến K15 Đồ Sơn – nơi những con Tàu Không số xuất phát ra khơi.', 'Các khối bê tông mố cầu tàu cổ vươn ra bờ biển đá sóng vỗ tại Đồ Sơn Hải Phòng',
  'Wikimedia Commons Contributor', 'CC BY-SA 3.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '7ab39638-a397-4769-9bbe-db4f3f15d003', (SELECT id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Kiep_Bac_Chi_Linh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Den_Kiep_Bac_Chi_Linh.jpg', 'image', 'Cổng tam quan Đền Kiếp Bạc uy nghiêm bên bến sông Lục Đầu lịch sử.', 'Cổng đền tam quan cổ kính bằng đá gạch mái vòm nhìn ra bến sông rộng lớn',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'b6d20340-cf17-46f7-8f09-c5527edfee05', (SELECT id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai'),
  'https://hungyen.gov.vn/uploads/images/2021/10/di-tich-tieng-trong-tien-hai.jpg', 'https://hungyen.gov.vn/di-tich-tieng-trong-tien-hai', 'image', 'Tượng đài tái hiện cuộc biểu tình Tiếng trống Tiền Hải ngày 14/10/1930 tại khu lưu niệm.', 'Nhóm tượng đài nông dân tay giương cao cờ đỏ búa liềm và dùi trống biểu tình',
  'Cổng Thông tin Điện tử tỉnh', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '39d0e0d1-28b5-46e3-bd26-fc7512d56a18', (SELECT id FROM public.historical_locations WHERE slug = 'pho-hien'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Chua_Chuong_Pho_Hien.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Chua_Chuong_Pho_Hien.jpg', 'image', 'Chùa Chuông (Kim Chung Tự) – ''Phố Hiến đệ nhất danh lam'' với kiến trúc cổ kính tuyệt đẹp.', 'Ngôi chùa cổ kính mái ngói mũi hài rêu phong in bóng bên mặt hồ nước phẳng lặng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'ef7f5ad2-8f68-49a7-8ef9-e84e57ca3486', (SELECT id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh'),
  'https://ninhbinh.gov.vn/uploads/images/2021/05/bao-tang-det-may-nam-dinh.jpg', 'https://ninhbinh.gov.vn/di-tich-nha-may-det-nam-dinh', 'image', 'Khuôn viên Bảo tàng Dệt May Nam Định – nơi lưu giữ ký ức phong trào công nhân kiên cường.', 'Tòa nhà kiến trúc thời Pháp cổ bằng gạch đỏ lưu giữ hiện vật nhà máy dệt',
  'Cổng Thông tin Điện tử', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'bf474e18-11c1-4b95-8d95-de29a2344a41', (SELECT id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg', 'image', 'Đền thờ Vua Đinh Tiên Hoàng cổ kính uy nghiêm giữa thung lũng đá vôi Cố đô Hoa Lư.', 'Ngôi đền thờ cổ lợp ngói vảy cá với sân rồng đá uy nghi dưới chân dãy núi đá sừng sững',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'bc64b3f9-e9db-423a-9571-55cc33c17cf4', (SELECT id FROM public.historical_locations WHERE slug = 'cau-ham-rong'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Ham_Rong_Thanh_Hoa.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cau_Ham_Rong_Thanh_Hoa.jpg', 'image', 'Cây cầu Hàm Rồng bằng thép kiên cường vắt qua dòng sông Mã oai hùng tại Thanh Hóa.', 'Nhịp cầu thép sừng sững bắc qua dòng sông Mã rộng lớn uốn lượn dưới chân núi đá râm mát',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '90ae4451-1f34-48ef-8b9c-95afd54d6218', (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg', 'image', 'Nếp nhà lá 5 gian đơn sơ mộc mạc của gia đình Bác Hồ tại Làng Sen, Kim Liên, Nam Đàn, Nghệ An.', 'Ngôi nhà gỗ mái tranh mộc mạc nép mình dưới rặng tre và hàng cau xanh ngát',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '25e34de1-f255-4db8-a149-3e1fe32c633c', (SELECT id FROM public.historical_locations WHERE slug = 'truong-bon'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Truong_Bon_Nghe_An.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_di_tich_Truong_Bon_Nghe_An.jpg', 'image', 'Khu tưởng niệm Di tích Lịch sử Quốc gia Truông Bồn – nơi ghi dấu sự hy sinh anh dũng của 13 chiến sĩ TNXP.', 'Khuôn viên tưởng niệm trang nghiêm với đài tháp lửa vươn cao giữa núi rừng Đô Lương',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'dfe44165-3544-41c8-ab5c-67ffa1d63dbd', (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nga_ba_Dong_Loc_Ha_Tinh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nga_ba_Dong_Loc_Ha_Tinh.jpg', 'image', 'Quần thể Khu tưởng niệm Di tích Quốc gia Đặc biệt Ngã ba Đồng Lộc tại Can Lộc, Hà Tĩnh.', 'Khu di tích trang nghiêm với tượng đài và tháp chuông tưởng niệm giữa thung lũng xanh',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '09a9df77-9fd6-45a8-b041-f99c2671606d', (SELECT id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_co_Quang_Tri_Dai_tuong_niem.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Thanh_co_Quang_Tri_Dai_tuong_niem.jpg', 'image', 'Đài tưởng niệm trung tâm Thành cổ Quảng Trị mô phỏng ngọn thiên đăng tri ân các anh hùng liệt sĩ.', 'Đài tưởng niệm hình bát giác uy nghiêm giữa công viên cỏ xanh rợp bóng cây Thành cổ Quảng Trị',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '0c4da11c-d9d1-46cc-9bae-e697a0119250', (SELECT id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg', 'image', 'Cầu Hiền Lương lịch sử bắc qua sông Bến Hải chia cắt vĩ tuyến 17 được phục dựng nguyên trạng.', 'Cây cầu sắt sơn hai màu xanh và vàng chia đôi nhịp cầu bắc qua con sông Bến Hải êm đềm',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '61004769-5064-40b7-8bfb-62878e311dc9', (SELECT id FROM public.historical_locations WHERE slug = 'ngo-mon-hue'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ngo_Mon_Hue_Imperial_City.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ngo_Mon_Hue_Imperial_City.jpg', 'image', 'Cửa Ngọ Môn và lầu Ngũ Phụng uy nghi tráng lệ – nơi Vua Bảo Đại thoái vị ngày 30/8/1945.', 'Cổng đá lớn màu xám có 5 cửa vòm nâng đỡ lầu gác gỗ nhiều tầng mái ngói vàng rực rỡ',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'e3f6b25e-78fa-49a0-ac88-565984ce82ac', (SELECT id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ky_Dai_Hue_Flag_Tower.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ky_Dai_Hue_Flag_Tower.jpg', 'image', 'Kỳ Đài Huế sừng sững trước Hoàng thành – nơi lá cờ Mặt trận Giải phóng tung bay suốt 25 ngày đêm Tết Mậu Thân 1968.', 'Bệ đài gạch ba tầng đồ sộ nâng đỡ cột cờ cao vút giữa quảng trường Ngọ Môn',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '6f9f0d0b-fc7b-41d2-9d05-d8abf0c4e099', (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965'),
  'https://danang.gov.vn/uploads/images/2021/05/tuong-dai-chien-thang-nui-thanh.jpg', 'https://danang.gov.vn/di-tich-chien-thang-nui-thanh', 'image', 'Tượng đài Chiến thắng Núi Thành sừng sững trên đỉnh đồi – nơi mở đầu phong trào đánh thắng quân viễn chinh Mỹ.', 'Tượng đài người chiến sĩ giải phóng quân tay nắm chắc súng vươn cao trên đỉnh đồi',
  'Cổng Thông tin Điện tử', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '0ff7735e-33c8-42e5-96f7-5e9e11afbcb2', (SELECT id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_chung_tich_Son_My_Quang_Ngai.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_chung_tich_Son_My_Quang_Ngai.jpg', 'image', 'Cụm tượng đài người mẹ Sơn Mỹ ôm con che chở trước bom đạn tại Khu chứng tích Quốc gia Đặc biệt.', 'Bức tượng đá tạc hình người mẹ quặn thắt ôm chặt đứa con nhỏ giữa vườn tưởng niệm',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '4a20030b-75bc-4817-9871-d3cb547bc1bc', (SELECT id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh'),
  'https://quangngai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-dak-to.jpg', 'https://quangngai.gov.vn/di-tich-dak-to-tan-canh', 'image', 'Tượng đài Chiến thắng Đắk Tô – Tân Cảnh và xác xe tăng lịch sử tại thị trấn Đắk Tô.', 'Tượng đài chiến thắng bằng đá vươn cao bên cạnh chiếc xe tăng T-54 lịch sử',
  'Cổng Thông tin Điện tử', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'f28c7e02-70f0-4a6b-8267-c36eeccb772d', (SELECT id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor'),
  'https://gialai.gov.vn/uploads/images/2021/08/lang-khang-chien-stor.jpg', 'https://gialai.gov.vn/di-tich-lang-stor', 'image', 'Mái nhà Rông truyền thống uy nghiêm tại Làng kháng chiến Stơr – quê hương Anh hùng Núp.', 'Ngôi nhà rông Bahnar mái lợp tranh cao vút vươn thẳng lên bầu trời xanh giữa rừng cây',
  'Cổng Thông tin Điện tử tỉnh Gia Lai', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '32cf8f15-4068-4af1-b839-15c453ca4036', (SELECT id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Bao_tang_Quang_Trung_Binh_Dinh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Bao_tang_Quang_Trung_Binh_Dinh.jpg', 'image', 'Tượng đài Hoàng đế Quang Trung – Nguyễn Huệ oai phong lẫm liệt trước sân Bảo tàng Quang Trung.', 'Tượng đài người anh hùng áo vải cất cao thanh kiếm chỉ huy xung trận giữa quảng trường hoa',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '04712de9-a030-44b8-a1a5-45a9e7f6538f', (SELECT id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son'),
  'https://khanhhoa.gov.vn/uploads/images/2021/04/di-tich-san-bay-thanh-son.jpg', 'https://khanhhoa.gov.vn/di-tich-san-bay-thanh-son', 'image', 'Bia di tích kỷ niệm nơi Phi đội Quyết Thắng xuất kích chiều ngày 28/4/1975 tại Sân bay Thành Sơn.', 'Bia đá di tích hình cánh chim máy bay cất cánh giữa khuôn viên sân bay rộng lớn',
  'Cổng Thông tin Điện tử', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'f123ee15-f494-4edc-bc50-2a7ea30bea56', (SELECT id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Ba_Ponagar_Nha_Trang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Thap_Ba_Ponagar_Nha_Trang.jpg', 'image', 'Các tòa tháp cổ Tháp Bà Ponagar xây bằng gạch nung đỏ rực rỡ bên bờ sông Cái Nha Trang.', 'Các khối tháp Chăm bằng gạch nung màu cam đỏ vươn cao trên đồi cây nhìn xuống cửa biển',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '19506177-71d0-44c0-adf6-48f9fd17ea29', (SELECT id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg', 'image', 'Tượng đài Chiến thắng Buôn Ma Thuột với chiếc xe tăng lịch sử tại Ngã Sáu trung tâm thành phố.', 'Bệ tượng đài bê tông cao vút nâng đỡ chiếc xe tăng hướng mũi tên về phía trước giữa vòng xoay',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'f739d546-bece-4af3-996b-7f695d2e90ed', (SELECT id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Vinh_Vung_Ro_Phu_Yen.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Vinh_Vung_Ro_Phu_Yen.jpg', 'image', 'Toàn cảnh Vịnh Vũng Rô xanh biếc dưới chân Đèo Cả – nơi ghi dấu huyền thoại Tàu Không số.', 'Vịnh biển nước xanh ngắt hình bán nguyệt nép mình dưới chân những dãy núi đá cao hùng vĩ',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'aea4c68b-b61e-4d85-86a2-4be4dfd3706f', (SELECT id FROM public.historical_locations WHERE slug = 'truong-duc-thanh'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Truong_Duc_Thanh_Phan_Thiet.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Truong_Duc_Thanh_Phan_Thiet.jpg', 'image', 'Mái nhà gỗ cổ kính và vườn cây xanh Trường Dục Thanh – nơi thầy giáo Nguyễn Tất Thành dạy học năm 1910.', 'Ngôi nhà gỗ lợp ngói âm dương cổ kính với hàng hiên thoáng mát giữa vườn cây râm mát',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'a4e8c2a8-a84e-4c43-85a8-057c0e8b6551', (SELECT id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat'),
  'https://lamdong.gov.vn/uploads/images/2021/06/nha-lao-thieu-nhi-da-lat.jpg', 'https://lamdong.gov.vn/di-tich-nha-lao-thieu-nhi', 'image', 'Khuôn viên Di tích Lịch sử Quốc gia Nhà lao Thiếu nhi Đà Lạt giữa rừng thông thơ mộng.', 'Các dãy nhà giam tường đá kiên cố mái tôn xám nép mình bên sườn đồi thông Đà Lạt',
  'Cổng Thông tin Điện tử tỉnh Lâm Đồng', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '9f91075e-a5a5-4076-a923-ff87a167c7ef', (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975'),
  'https://dongnai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-xuan-loc.jpg', 'https://dongnai.gov.vn/di-tich-chien-thang-xuan-loc', 'image', 'Tượng đài Chiến thắng Xuân Lộc 1975 sừng sững tại trung tâm thành phố Long Khánh, Đồng Nai.', 'Tượng đài hình mũi tên chiến thắng bằng đá hoa cương vươn thẳng lên bầu trời xanh',
  'Cổng Thông tin Điện tử tỉnh Đồng Nai', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'c2de2b7c-03d7-42d1-aca6-68efdc9104ba', (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Ta_Thiet_Binh_Phuoc.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Can_cu_Ta_Thiet_Binh_Phuoc.jpg', 'image', 'Lán làm việc bán âm đơn sơ của Bộ Chỉ huy Chiến dịch Hồ Chí Minh tại Căn cứ Tà Thiết.', 'Ngôi lán gỗ mái lợp lá trung quân nép mình dưới bóng cây rừng đại ngàn râm mát',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '579406a5-7caf-4874-b867-a1ae7dde08c3', (SELECT id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dia_dao_Cu_Chi_Ben_Dinh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Dia_dao_Cu_Chi_Ben_Dinh.jpg', 'image', 'Nắp hầm bí mật ngụy trang bằng lá khô mở lối vào hệ thống mê cung Địa đạo Củ Chi.', 'Nắp hầm gỗ nhỏ ngụy trang lá cây vừa một người chui lọt giữa rừng cao su Củ Chi',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '2cbe2204-a57d-4cd5-9d52-1c6bb7af2fbb', (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg', 'image', 'Nhà làm việc lợp lá trung quân mộc mạc tại Di tích Quốc gia Đặc biệt Căn cứ Trung ương Cục miền Nam.', 'Ngôi nhà gỗ đơn sơ mái lá trung quân nép mình dưới bóng rừng đại ngàn Tân Biên',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'fda09b6d-ff03-4060-b457-2962f38febcf', (SELECT id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa'),
  'https://tayninh.gov.vn/uploads/images/2021/06/di-tich-nga-tu-duc-hoa.jpg', 'https://tayninh.gov.vn/di-tich-nga-tu-duc-hoa', 'image', 'Tượng đài đồng chí Võ Văn Tần tại Khu di tích Lịch sử Quốc gia Ngã tư Đức Hòa.', 'Tượng đài nhà cách mạng kiên trung bằng đá đứng uy nghiêm giữa quảng trường hoa',
  'Cổng Thông tin Điện tử', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '323d8814-3d4a-48a6-8b12-afcfc00fa7fd', (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Ap_Bac_Tien_Giang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_di_tich_Ap_Bac_Tien_Giang.jpg', 'image', 'Tượng đài ba chiến sĩ gang thép tại Khu di tích Quốc gia Đặc biệt Chiến thắng Ấp Bắc.', 'Nhóm tượng đài bằng đồng đỏ tạc ba người chiến sĩ giải phóng quân xung trận anh dũng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'b4fed9b1-f028-4df5-9e96-0c2e7a12f782', (SELECT id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg', 'image', 'Khu lăng mộ Cụ Phó bảng Nguyễn Sinh Sắc với vòm mái hình cánh sen cách điệu tại thành phố Cao Lãnh.', 'Vòm mái kiến trúc hình cánh hoa sen trắng thanh thoát vươn trên mặt hồ nước phẳng lặng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '21fd0e40-3587-4f54-bdc4-a8b9bfab137a', (SELECT id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Dong_Khoi_Ben_Tre.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_di_tich_Dong_Khoi_Ben_Tre.jpg', 'image', 'Nhà truyền thống Khu di tích Quốc gia Đặc biệt Đồng Khởi tại xã Định Thủy, huyện Mỏ Cày.', 'Nhà trưng bày mái dốc trang nhã bên rặng dừa xanh ngút ngàn của xứ dừa Bến Tre',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '0394812e-70d8-4511-bf7e-722c06270b1e', (SELECT id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet'),
  'https://vinhlong.gov.vn/uploads/images/2021/11/khu-tuong-niem-vo-van-kiet.jpg', 'https://vinhlong.gov.vn/di-tich-vo-van-kiet', 'image', 'Không gian xanh mát Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt (Vườn ông Sáu Dân) tại Vũng Liêm.', 'Khuôn viên nhà tưởng niệm mái cong kiến trúc mở giữa vườn hoa cỏ xanh mướt',
  'Cổng Thông tin Điện tử tỉnh Vĩnh Long', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '4139a5a7-1b17-46a0-bd20-bfa35a8613ce', (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Phu_Quoc_Chuong_cop.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nha_tu_Phu_Quoc_Chuong_cop.jpg', 'image', 'Mô hình phục dựng chuồng cọp kẽm gai ngoài trời tại Di tích Quốc gia Đặc biệt Nhà tù Phú Quốc.', 'Khung dây thép gai sắc nhọn bao quanh buồng nhốt chật hẹp ngoài trời trên nền cát trắng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '2168d110-6806-4c24-a528-428e6b2825c2', (SELECT id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg', 'image', 'Đền thờ Chủ tịch Tôn Đức Thắng kiến trúc cổ truyền tại Khu di tích Quốc gia Đặc biệt cù lao Ông Hổ.', 'Ngôi đền thờ gỗ cổ lợp ngói âm dương uy nghi giữa hoa viên cây xanh cù lao Ông Hổ',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '21f18486-3f7d-4f3c-800f-d98ba2555ab3', (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973'),
  'https://cantho.gov.vn/uploads/images/2021/07/di-tich-chien-thang-chuong-thien.jpg', 'https://cantho.gov.vn/di-tich-chien-thang-chuong-thien', 'image', 'Khuôn viên Tượng đài Chiến thắng Chương Thiện – nơi đánh bại 75 lượt tiểu đoàn địch năm 1973.', 'Cụm tượng đài chiến sĩ bộ đội và nhân dân miền Tây Nam Bộ xung phong tiến công',
  'Cổng Thông tin Điện tử', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'f1b2e2d7-577f-43cb-b380-0d16e4670abc', (SELECT id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kham_Lon_Can_Tho_Prison.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Kham_Lon_Can_Tho_Prison.jpg', 'image', 'Bức tường đá kiên cố và cổng vào Di tích Lịch sử Quốc gia Khám Lớn Cần Thơ.', 'Tường thành nhà tù bằng đá xám cổ kính rêu phong với cổng vòm sắt sơn đen',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  'e5ae2c04-4370-4a79-9d01-7eab1e5b7c39', (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940'),
  'https://camau.gov.vn/uploads/images/2021/12/hai-dang-hon-khoai-ca-mau.jpg', 'https://camau.gov.vn/di-tich-khoi-nghia-hon-khoai', 'image', 'Ngọn hải đăng cổ kính trên đỉnh Hòn Khoai – nơi nổ ra cuộc khởi nghĩa vũ trang đêm 13/12/1940.', 'Ngọn tháp hải đăng cổ bằng đá xám vươn cao trên đỉnh núi phủ đầy rừng nhiệt đới giữa biển xanh',
  'Cổng Thông tin Điện tử tỉnh Cà Mau', NULL, 'coursework_reference', true,
  1200, 800, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '74dbc826-7cb1-4e14-a522-c204ae54e771', (SELECT id FROM public.historical_locations WHERE slug = 'ben-vam-lung'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Vam_Lung_Ca_Mau.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ben_Vam_Lung_Ca_Mau.jpg', 'image', 'Tượng đài kỷ niệm Bến Vàm Lũng – điểm cập bến lịch sử của những chuyến Tàu Không số tại Cà Mau.', 'Bia đá di tích hình con thuyền xé sóng đứng uy nghiêm bên cửa sông rừng đước ngập mặn',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', true,
  1600, 1067, 1
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '5e35a38d-3f65-49f7-a075-9c631bf69d03', (SELECT id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Suoi_Lenin_Pac_Bo.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Suoi_Lenin_Pac_Bo.jpg', 'image', 'Dòng suối Lê-nin trong xanh uốn lượn dưới chân núi Các Mác tại Khu di tích lịch sử Pác Bó, Cao Bằng.', 'Dòng suối nước màu xanh ngọc bích chảy quanh chân vách núi đá vôi phủ đầy cây rừng',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', false,
  1600, 1067, 2
);
INSERT INTO public.media_assets (
  id, location_id, file_url, source_page_url, media_type, caption, alt_text,
  photographer, license, usage_basis, is_cover, width, height, sort_order
) VALUES (
  '1235ccda-2036-4e2c-a788-a4e5ac841fec', (SELECT id FROM public.historical_locations WHERE slug = 'dinh-doc-lap'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Doc_Lap_Reunification_Palace.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Dinh_Doc_Lap_Reunification_Palace.jpg', 'image', 'Toàn cảnh Di tích Quốc gia Đặc biệt Dinh Độc Lập (Hội trường Thống Nhất) tại Quận 1, TP. Hồ Chí Minh.', 'Tòa nhà dinh thự kiến trúc hiện đại với rèm hoa đá trắng trang nhã nhìn ra bãi cỏ tròn xanh mướt',
  'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'open_license', false,
  1600, 1067, 2
);

-- 3. Restore previously deleted videos
INSERT INTO public.location_videos (id, location_id, youtube_id, title)
VALUES (
  '5499857d-0cdf-4dc3-8592-71a41d584a07', (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo'),
  'W6_bO4m3F6c', 'Ký ức Hỏa Lò – Di tích lịch sử Quốc gia'
);
INSERT INTO public.location_videos (id, location_id, youtube_id, title)
VALUES (
  '8b1baa34-8339-4343-8632-43fff0ecf56c', (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu'),
  'W5i3h-h9K2Q', 'Ký ức 39 ngày đêm quyết chiến đồi A1 Điện Biên Phủ'
);
INSERT INTO public.location_videos (id, location_id, youtube_id, title)
VALUES (
  '5a611332-5706-424f-87bd-7d770d262713', (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son'),
  'n4m17K-a128', 'Huyền thoại Đường Hồ Chí Minh trên biển – Bến K15 Đồ Sơn'
);
INSERT INTO public.location_videos (id, location_id, youtube_id, title)
VALUES (
  '98e081d5-0c82-4caa-ba29-303ff12440e9', (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc'),
  'W4P81Jc96zU', 'Ký ức ngã ba Đồng Lộc – Mười đóa hoa bất tử'
);

SET CONSTRAINTS ALL IMMEDIATE;
COMMIT;
