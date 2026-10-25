-- Local review artifact only. No remote application/publication is authorized.

-- Preconditions: current migrations, required curriculum topics, staff review of this package.

-- Existing slugs with different content are skipped; reconcile them explicitly in administration.

begin;

set local lock_timeout = '5s';

do $preflight$ begin
if exists (select 1 from (values ('doi-ngoai-viet-nam'), ('cong-cuoc-doi-moi'), ('bao-ve-to-quoc-sau-1975'), ('khang-chien-chong-phap'), ('khang-chien-chong-my'), ('cach-mang-thang-tam-1945'), ('ho-chi-minh')) required(slug) left join public.curriculum_topics t using (slug) where t.id is null) then
raise exception 'Required curriculum topics missing; no content imported';
end if;
end $preflight$;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '61ca5bfa-cf1c-41c8-801c-22e406e07e25', 'Viet Nam — Accessions', 'World Trade Organization', 'World Trade Organization', 'https://www.wto.org/english/thewto_e/acc_e/a1_vietnam_e.htm', 'official', 'World Trade Organization; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://www.wto.org/english/thewto_e/acc_e/a1_vietnam_e.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '208a1863-9298-4e6d-83cb-7d7597e8f3e8', 'Thông tin cơ bản về ASEAN và quan hệ Việt Nam – ASEAN', 'Bộ Ngoại giao Việt Nam', 'Bộ Ngoại giao Việt Nam', 'https://mofa.gov.vn/tin-chi-tiet/chi-tiet/thong-tin-co-ban-ve-asean-va-quan-he-viet-nam-asean-166.html', 'official', 'Bộ Ngoại giao Việt Nam; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://mofa.gov.vn/tin-chi-tiet/chi-tiet/thong-tin-co-ban-ve-asean-va-quan-he-viet-nam-asean-166.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '6960bb2a-4e30-4417-8c85-13e7dd38ac68', 'Remarks by the President in announcement on normalization of diplomatic relations with Vietnam', 'The White House; U.S. National Archives frozen archive', 'The White House; U.S. National Archives frozen archive', 'https://clintonwhitehouse6.archives.gov/1995/07/1995-07-11-remarks-on-normalization-of-relations-with-vietnam.html', 'official', 'The White House; U.S. National Archives frozen archive; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://clintonwhitehouse6.archives.gov/1995/07/1995-07-11-remarks-on-normalization-of-relations-with-vietnam.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'e5f041ac-1d25-4661-82d1-df86f9fe6660', 'Tưởng niệm, tri ân 64 liệt sĩ hy sinh tại đảo Gạc Ma', 'Báo Điện tử Chính phủ', 'Báo Điện tử Chính phủ', 'https://baochinhphu.vn/tuong-niem-tri-an-64-liet-si-hy-sinh-tai-dao-gac-ma-10224031414164731.htm', 'official', 'Báo Điện tử Chính phủ; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baochinhphu.vn/tuong-niem-tri-an-64-liet-si-hy-sinh-tai-dao-gac-ma-10224031414164731.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'c436e7b6-c8b8-4493-8302-4210b2c4c904', 'Tri ân liệt sỹ nơi đầu sóng', 'Đài Tiếng nói Việt Nam (VOV)', 'Đài Tiếng nói Việt Nam (VOV)', 'https://vov.vn/xa-hoi/tri-an-liet-sy-noi-dau-song-1074040.vov', 'official', 'Đài Tiếng nói Việt Nam (VOV); accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://vov.vn/xa-hoi/tri-an-liet-sy-noi-dau-song-1074040.vov') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '8d87e7fc-143e-4d4d-8e6a-53d63de8b0f9', 'Lịch sử Biên niên Đảng Cộng sản Việt Nam — Tập 3', 'Cổng TTĐT Đảng Cộng sản Việt Nam; NXB Chính trị Quốc gia – Sự thật', 'Cổng TTĐT Đảng Cộng sản Việt Nam; NXB Chính trị Quốc gia – Sự thật', 'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-3-176?categoryId=102000083', 'official', 'Cổng TTĐT Đảng Cộng sản Việt Nam; NXB Chính trị Quốc gia – Sự thật; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-3-176?categoryId=102000083') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '36b971e4-5a0e-4830-8273-d417f9f289b2', 'Di tích Núi Báo Đông nơi Chủ tịch Hồ Chí Minh quan sát trận đánh đồn Đông Khê', 'Bảo tàng Hồ Chí Minh', 'Bảo tàng Hồ Chí Minh', 'https://baotanghochiminh.vn/di-tich-nui-bao-dong-noi-chu-tich-ho-chi-minh-quan-sat-tran-danh-don-dong-khe-chien-dich-bien-gioi-1950.htm', 'official', 'Bảo tàng Hồ Chí Minh; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanghochiminh.vn/di-tich-nui-bao-dong-noi-chu-tich-ho-chi-minh-quan-sat-tran-danh-don-dong-khe-chien-dich-bien-gioi-1950.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'a87707b4-0d19-4f0a-8fc6-5f5efa80a5ca', 'Kỷ niệm 54 năm Đồng khởi Bến Tre (17/1/1960–17/1/2014)', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/VI/Articles/3097/15652/ky-niem-54-nam-djong-khoi-ben-tre-17-1-1960-17-1-2014.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3097/15652/ky-niem-54-nam-djong-khoi-ben-tre-17-1-1960-17-1-2014.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'e658bf4d-97a2-4613-866f-13106816ec18', 'Tổng khởi nghĩa Cách mạng tháng Tám năm 1945', 'Bảo tàng Lịch sử Quốc gia; Nguyễn Thị Ngọc Anh', 'Bảo tàng Lịch sử Quốc gia; Nguyễn Thị Ngọc Anh', 'https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html', 'official', 'Bảo tàng Lịch sử Quốc gia; Nguyễn Thị Ngọc Anh; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '355b2355-b7c2-4900-8cf3-a6fce1294b05', 'Nhớ về chiến dịch mang tính bước ngoặt của mùa Xuân 1975', 'Báo Điện tử Chính phủ; Hà Minh Hồng', 'Báo Điện tử Chính phủ; Hà Minh Hồng', 'https://baochinhphu.vn/nho-ve-chien-dich-mang-tinh-buoc-ngoat-cua-mua-xuan-1975-102270035.htm', 'official', 'Báo Điện tử Chính phủ; Hà Minh Hồng; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baochinhphu.vn/nho-ve-chien-dich-mang-tinh-buoc-ngoat-cua-mua-xuan-1975-102270035.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'ea2be649-c67f-47ae-8bc3-40733821cb59', 'Nghệ thuật vận dụng thời cơ trong Chiến dịch Trị Thiên', 'Báo Điện tử Chính phủ; nguồn QĐND/Cổng TTĐT Bộ Quốc phòng', 'Báo Điện tử Chính phủ; nguồn QĐND/Cổng TTĐT Bộ Quốc phòng', 'https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm', 'official', 'Báo Điện tử Chính phủ; nguồn QĐND/Cổng TTĐT Bộ Quốc phòng; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'a82750b0-48bf-4343-87ab-70b3e391a267', 'Thông tin báo chí trưng bày chuyên đề Non sông liền một dải', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '00fae9da-6be0-4f34-8ca2-b1a18826a22f', 'Vài nét về Quốc hội nước CHXHCN Việt Nam', 'Báo Điện tử Chính phủ', 'Báo Điện tử Chính phủ', 'https://baochinhphu.vn/vai-net-ve-quoc-hoi-nuoc-chxhcn-viet-nam-10271664.htm', 'official', 'Báo Điện tử Chính phủ; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baochinhphu.vn/vai-net-ve-quoc-hoi-nuoc-chxhcn-viet-nam-10271664.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'bc4d0c3b-76fd-4e00-8970-e3b7a1fefd5e', 'Phong trào Đông Du (1905–1908) — Một hình thức xây dựng lực lượng cách mạng những năm đầu thế kỷ XX', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/vi/Articles/3097/14624/phong-trao-djong-du-1905-1908-mot-hinh-thuc-xay-dung-luc-luong-cach-mang-nhung-nam-dau-the-ky-xx.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/3097/14624/phong-trao-djong-du-1905-1908-mot-hinh-thuc-xay-dung-luc-luong-cach-mang-nhung-nam-dau-the-ky-xx.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'ad8b9226-8f13-4ec4-8c09-77db483065b8', 'Chủ tịch Hồ Chí Minh và hành trình 30 năm tìm đường cứu nước giải phóng dân tộc', 'Cổng thông tin Hồ Chí Minh', 'Cổng thông tin Hồ Chí Minh', 'https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013', 'official', 'Cổng thông tin Hồ Chí Minh; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'b9d2458d-c838-4288-8d20-380f95f2c7ed', 'Ngày thành lập Đảng Cộng sản Việt Nam 3-2-1930', 'Tư liệu Văn kiện Đảng; Cổng TTĐT ĐCSVN', 'Tư liệu Văn kiện Đảng; Cổng TTĐT ĐCSVN', 'https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/su-kien-va-nhan-chung/ngay-thanh-lap-dang-cong-san-viet-nam-3-2-1930-3342', 'official', 'Tư liệu Văn kiện Đảng; Cổng TTĐT ĐCSVN; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/su-kien-va-nhan-chung/ngay-thanh-lap-dang-cong-san-viet-nam-3-2-1930-3342') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '3a080ca6-f9e2-4728-8d4b-4eb7b33b18c7', '19/5/1941: Thành lập Mặt trận Việt Minh', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/VI/Articles/3097/16382/19-5-1941-thanh-lap-mat-tran-viet-minh.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3097/16382/19-5-1941-thanh-lap-mat-tran-viet-minh.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '563c5e74-44b3-4df7-8a51-37a7ab9490db', 'Chiến thắng Ấp Bắc ngày 2-1-1963', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/vi/Articles/2002/61989/chien-thang-ap-bac-ngay-2-1-1963.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/2002/61989/chien-thang-ap-bac-ngay-2-1-1963.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '98fb7418-c447-45b8-8879-9699c33ec4e7', 'Kỷ niệm 48 năm (18/8/1965–18/8/2013) — Chiến thắng Vạn Tường', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/vi/Articles/3097/14898/ky-niem-48-nam-18-8-1965-18-8-2013-chien-thang-van-tuong.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/3097/14898/ky-niem-48-nam-18-8-1965-18-8-2013-chien-thang-van-tuong.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'e9ee84b9-6b6d-475d-8229-5c6b455ae1c0', 'Ngày 30-3-1972: Cuộc Tổng tiến công chiến lược năm 1972 bắt đầu', 'Bảo tàng Lịch sử Quốc gia', 'Bảo tàng Lịch sử Quốc gia', 'https://baotanglichsu.vn/vi/Articles/2002/68267/ngay-30-3-1972-cuoc-tong-tien-cong-chien-luoc-nam-1972-bat-djau.html', 'official', 'Bảo tàng Lịch sử Quốc gia; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/2002/68267/ngay-30-3-1972-cuoc-tong-tien-cong-chien-luoc-nam-1972-bat-djau.html') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select 'cd210816-bec6-4635-884a-3a6ba489fa7a', 'Giải quyết vấn đề nông nghiệp, nông dân, nông thôn là nhiệm vụ của cả hệ thống chính trị và toàn xã hội', 'Báo Điện tử Chính phủ', 'Báo Điện tử Chính phủ', 'https://baochinhphu.vn/giai-quyet-van-de-nong-nghiep-nong-dan-nong-thon-la-nhiem-vu-cua-ca-he-thong-chinh-tri-va-toan-xa-hoi-102829.htm', 'official', 'Báo Điện tử Chính phủ; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://baochinhphu.vn/giai-quyet-van-de-nong-nghiep-nong-dan-nong-thon-la-nhiem-vu-cua-ca-he-thong-chinh-tri-va-toan-xa-hoi-102829.htm') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '6e53a4dc-8586-464f-8d6e-8e3d086ed074', 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng', 'Tư liệu Văn kiện Đảng; Cổng TTĐT ĐCSVN', 'Tư liệu Văn kiện Đảng; Cổng TTĐT ĐCSVN', 'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-viii/dai-hoi-dai-bieu-toan-quoc-lan-thu-viii-cua-dang-13', 'official', 'Tư liệu Văn kiện Đảng; Cổng TTĐT ĐCSVN; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-viii/dai-hoi-dai-bieu-toan-quoc-lan-thu-viii-cua-dang-13') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '33a42d34-12d3-4f86-8b73-3406fabb5bbc', 'Báo cáo Chính trị của Ban Chấp hành Trung ương Đảng khóa VII tại Đại hội VIII', 'Ban Chấp hành Trung ương ĐCSVN; bản số hóa Tư liệu Văn kiện Đảng', 'Ban Chấp hành Trung ương ĐCSVN; bản số hóa Tư liệu Văn kiện Đảng', 'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-viii/bao-cao-chinh-tri-cua-ban-chap-hanh-trung-uong-dang-khoa-vii-tai-dai-hoi-dai-bieu-toan-quoc-lan-thu-viii-cua-dang-1549?categoryId=104000022', 'official', 'Ban Chấp hành Trung ương ĐCSVN; bản số hóa Tư liệu Văn kiện Đảng; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-viii/bao-cao-chinh-tri-cua-ban-chap-hanh-trung-uong-dang-khoa-vii-tai-dai-hoi-dai-bieu-toan-quoc-lan-thu-viii-cua-dang-1549?categoryId=104000022') on conflict (id) do nothing;

insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)
select '1033030d-91fa-427a-8b0a-17056283fb45', 'Hiệp định CPTPP chính thức có hiệu lực đối với Việt Nam từ ngày 14/01/2019', 'Bộ Công Thương', 'Bộ Công Thương', 'https://moit.gov.vn/tin-tuc/thi-truong-nuoc-ngoai/hiep-dinh-cptpp-chinh-thuc-co-hieu-luc-doi-voi-viet-nam-tu-n.html', 'official', 'Bộ Công Thương; accessed 2026-10-25. Claim locators are in event_sources and the versioned ledger.', '2026-10-25'
where not exists (select 1 from public.sources where url = 'https://moit.gov.vn/tin-tuc/thi-truong-nuoc-ngoai/hiep-dinh-cptpp-chinh-thuc-co-hieu-luc-doi-voi-viet-nam-tu-n.html') on conflict (id) do nothing;


-- viet-nam-gia-nhap-wto-2007
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)', 'viet-nam-gia-nhap-wto-2007', 2007, 2007, '2007-01-11', '2007-01-11', '11/1/2007', 'exact', 'Ngày 11/1/2007, Việt Nam trở thành thành viên thứ 150 của WTO.', '## Mốc hội nhập

Việt Nam trở thành thành viên thứ 150 của WTO ngày 11/1/2007. Trang hồ sơ gia nhập của WTO ghi nhận đơn xin gia nhập được tiếp nhận ngày 4/1/1995.

## Đọc mốc trong tiến trình Đổi mới

Đây là một mốc để tìm hiểu hội nhập kinh tế quốc tế. Không thể dùng riêng ngày gia nhập để kết luận về mọi thành tựu kinh tế hay tác động đến từng ngành.', 'draft' from public.curriculum_topics t where t.slug = 'doi-ngoai-viet-nam' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Opening accession paragraph; Viet Nam timeline, Application received row — Bounded date, membership/announcement and narrative; editorial reading notes are explicitly interpretive.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-wto-2007' and workflow_status = 'draft' and title = 'Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)' and summary = 'Ngày 11/1/2007, Việt Nam trở thành thành viên thứ 150 của WTO.' and content = '## Mốc hội nhập

Việt Nam trở thành thành viên thứ 150 của WTO ngày 11/1/2007. Trang hồ sơ gia nhập của WTO ghi nhận đơn xin gia nhập được tiếp nhận ngày 4/1/1995.

## Đọc mốc trong tiến trình Đổi mới

Đây là một mốc để tìm hiểu hội nhập kinh tế quốc tế. Không thể dùng riêng ngày gia nhập để kết luận về mọi thành tựu kinh tế hay tác động đến từng ngành.' and start_year = 2007 and end_year is not distinct from 2007 and start_date is not distinct from '2007-01-11'::date and end_date is not distinct from '2007-01-11'::date and date_precision = 'exact' and date_text = '11/1/2007' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join lateral (select id from public.sources where url = 'https://www.wto.org/english/thewto_e/acc_e/a1_vietnam_e.htm' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '10-khai-quat-ve-cong-cuoc-doi-moi', 'muc-3', e.id, 0 from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-wto-2007' and workflow_status = 'draft' and title = 'Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)' and summary = 'Ngày 11/1/2007, Việt Nam trở thành thành viên thứ 150 của WTO.' and content = '## Mốc hội nhập

Việt Nam trở thành thành viên thứ 150 của WTO ngày 11/1/2007. Trang hồ sơ gia nhập của WTO ghi nhận đơn xin gia nhập được tiếp nhận ngày 4/1/1995.

## Đọc mốc trong tiến trình Đổi mới

Đây là một mốc để tìm hiểu hội nhập kinh tế quốc tế. Không thể dùng riêng ngày gia nhập để kết luận về mọi thành tựu kinh tế hay tác động đến từng ngành.' and start_year = 2007 and end_year is not distinct from 2007 and start_date is not distinct from '2007-01-11'::date and end_date is not distinct from '2007-01-11'::date and date_precision = 'exact' and date_text = '11/1/2007' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '14-doi-ngoai-tu-nam-1975-den-nay', 'muc-2', e.id, 1 from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-wto-2007' and workflow_status = 'draft' and title = 'Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)' and summary = 'Ngày 11/1/2007, Việt Nam trở thành thành viên thứ 150 của WTO.' and content = '## Mốc hội nhập

Việt Nam trở thành thành viên thứ 150 của WTO ngày 11/1/2007. Trang hồ sơ gia nhập của WTO ghi nhận đơn xin gia nhập được tiếp nhận ngày 4/1/1995.

## Đọc mốc trong tiến trình Đổi mới

Đây là một mốc để tìm hiểu hội nhập kinh tế quốc tế. Không thể dùng riêng ngày gia nhập để kết luận về mọi thành tựu kinh tế hay tác động đến từng ngành.' and start_year = 2007 and end_year is not distinct from 2007 and start_date is not distinct from '2007-01-11'::date and end_date is not distinct from '2007-01-11'::date and date_precision = 'exact' and date_text = '11/1/2007' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.event_topics (event_id,topic_id)
select e.id,t.id from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-wto-2007' and workflow_status = 'draft' and title = 'Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)' and summary = 'Ngày 11/1/2007, Việt Nam trở thành thành viên thứ 150 của WTO.' and content = '## Mốc hội nhập

Việt Nam trở thành thành viên thứ 150 của WTO ngày 11/1/2007. Trang hồ sơ gia nhập của WTO ghi nhận đơn xin gia nhập được tiếp nhận ngày 4/1/1995.

## Đọc mốc trong tiến trình Đổi mới

Đây là một mốc để tìm hiểu hội nhập kinh tế quốc tế. Không thể dùng riêng ngày gia nhập để kết luận về mọi thành tựu kinh tế hay tác động đến từng ngành.' and start_year = 2007 and end_year is not distinct from 2007 and start_date is not distinct from '2007-01-11'::date and end_date is not distinct from '2007-01-11'::date and date_precision = 'exact' and date_text = '11/1/2007' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join public.curriculum_topics t where t.slug = 'cong-cuoc-doi-moi' on conflict (event_id,topic_id) do nothing;


-- viet-nam-gia-nhap-asean-1995
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Việt Nam gia nhập ASEAN', 'viet-nam-gia-nhap-asean-1995', 1995, 1995, '1995-07-28', '1995-07-28', '28/7/1995', 'exact', 'Ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.', '## Gia nhập ASEAN

Bộ Ngoại giao ghi nhận ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.

## Cách đọc mốc

Mốc này giúp đối chiếu quá trình mở rộng quan hệ đối ngoại và hội nhập khu vực sau 1986. Thứ tự thành viên ở đây gắn với thời điểm năm 1995, không mô tả số thành viên hiện nay.', 'draft' from public.curriculum_topics t where t.slug = 'doi-ngoai-viet-nam' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Section I, introduction/history paragraph beginning Khi mới thành lập ASEAN — Bounded date, membership/announcement and narrative; editorial reading notes are explicitly interpretive.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-asean-1995' and workflow_status = 'draft' and title = 'Việt Nam gia nhập ASEAN' and summary = 'Ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.' and content = '## Gia nhập ASEAN

Bộ Ngoại giao ghi nhận ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.

## Cách đọc mốc

Mốc này giúp đối chiếu quá trình mở rộng quan hệ đối ngoại và hội nhập khu vực sau 1986. Thứ tự thành viên ở đây gắn với thời điểm năm 1995, không mô tả số thành viên hiện nay.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-28'::date and end_date is not distinct from '1995-07-28'::date and date_precision = 'exact' and date_text = '28/7/1995' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join lateral (select id from public.sources where url = 'https://mofa.gov.vn/tin-chi-tiet/chi-tiet/thong-tin-co-ban-ve-asean-va-quan-he-viet-nam-asean-166.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '14-doi-ngoai-tu-nam-1975-den-nay', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-asean-1995' and workflow_status = 'draft' and title = 'Việt Nam gia nhập ASEAN' and summary = 'Ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.' and content = '## Gia nhập ASEAN

Bộ Ngoại giao ghi nhận ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.

## Cách đọc mốc

Mốc này giúp đối chiếu quá trình mở rộng quan hệ đối ngoại và hội nhập khu vực sau 1986. Thứ tự thành viên ở đây gắn với thời điểm năm 1995, không mô tả số thành viên hiện nay.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-28'::date and end_date is not distinct from '1995-07-28'::date and date_precision = 'exact' and date_text = '28/7/1995' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '4-su-ra-doi-va-phat-trien-cua-asean', 'muc-2', e.id, 1 from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-asean-1995' and workflow_status = 'draft' and title = 'Việt Nam gia nhập ASEAN' and summary = 'Ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.' and content = '## Gia nhập ASEAN

Bộ Ngoại giao ghi nhận ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.

## Cách đọc mốc

Mốc này giúp đối chiếu quá trình mở rộng quan hệ đối ngoại và hội nhập khu vực sau 1986. Thứ tự thành viên ở đây gắn với thời điểm năm 1995, không mô tả số thành viên hiện nay.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-28'::date and end_date is not distinct from '1995-07-28'::date and date_precision = 'exact' and date_text = '28/7/1995' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.event_topics (event_id,topic_id)
select e.id,t.id from (select id from public.historical_events where slug = 'viet-nam-gia-nhap-asean-1995' and workflow_status = 'draft' and title = 'Việt Nam gia nhập ASEAN' and summary = 'Ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.' and content = '## Gia nhập ASEAN

Bộ Ngoại giao ghi nhận ngày 28/7/1995, Việt Nam trở thành thành viên thứ bảy của ASEAN.

## Cách đọc mốc

Mốc này giúp đối chiếu quá trình mở rộng quan hệ đối ngoại và hội nhập khu vực sau 1986. Thứ tự thành viên ở đây gắn với thời điểm năm 1995, không mô tả số thành viên hiện nay.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-28'::date and end_date is not distinct from '1995-07-28'::date and date_precision = 'exact' and date_text = '28/7/1995' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join public.curriculum_topics t where t.slug = 'cong-cuoc-doi-moi' on conflict (event_id,topic_id) do nothing;


-- binh-thuong-hoa-quan-he-viet-my-1995
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Bình thường hóa quan hệ Việt Nam – Hoa Kỳ', 'binh-thuong-hoa-quan-he-viet-my-1995', 1995, 1995, '1995-07-11', '1995-07-11', '11/7/1995 (tuyên bố tại Hoa Kỳ)', 'exact', 'Ngày 11/7/1995 tại Washington, Tổng thống Bill Clinton tuyên bố bình thường hóa quan hệ ngoại giao với Việt Nam.', '## Tuyên bố tại Hoa Kỳ

Văn bản Nhà Trắng ngày 11/7/1995 ghi lại tuyên bố của Tổng thống Bill Clinton về bình thường hóa quan hệ ngoại giao với Việt Nam. Đây là ngày theo địa điểm và thời gian của văn bản Hoa Kỳ.

## Phạm vi ngày tháng

Bài viết dùng mốc tuyên bố này; không gộp hai tuyên bố của hai nước thành một ngày chung. Các mốc về dỡ bỏ cấm vận, mở đại sứ quán và quan hệ sau đó cần nguồn riêng.', 'draft' from public.curriculum_topics t where t.slug = 'doi-ngoai-viet-nam' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Release date July 11, 1995; East Room; first substantive announcement paragraph — Bounded date, membership/announcement and narrative; editorial reading notes are explicitly interpretive.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'binh-thuong-hoa-quan-he-viet-my-1995' and workflow_status = 'draft' and title = 'Bình thường hóa quan hệ Việt Nam – Hoa Kỳ' and summary = 'Ngày 11/7/1995 tại Washington, Tổng thống Bill Clinton tuyên bố bình thường hóa quan hệ ngoại giao với Việt Nam.' and content = '## Tuyên bố tại Hoa Kỳ

Văn bản Nhà Trắng ngày 11/7/1995 ghi lại tuyên bố của Tổng thống Bill Clinton về bình thường hóa quan hệ ngoại giao với Việt Nam. Đây là ngày theo địa điểm và thời gian của văn bản Hoa Kỳ.

## Phạm vi ngày tháng

Bài viết dùng mốc tuyên bố này; không gộp hai tuyên bố của hai nước thành một ngày chung. Các mốc về dỡ bỏ cấm vận, mở đại sứ quán và quan hệ sau đó cần nguồn riêng.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-11'::date and end_date is not distinct from '1995-07-11'::date and date_precision = 'exact' and date_text = '11/7/1995 (tuyên bố tại Hoa Kỳ)' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join lateral (select id from public.sources where url = 'https://clintonwhitehouse6.archives.gov/1995/07/1995-07-11-remarks-on-normalization-of-relations-with-vietnam.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '14-doi-ngoai-tu-nam-1975-den-nay', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'binh-thuong-hoa-quan-he-viet-my-1995' and workflow_status = 'draft' and title = 'Bình thường hóa quan hệ Việt Nam – Hoa Kỳ' and summary = 'Ngày 11/7/1995 tại Washington, Tổng thống Bill Clinton tuyên bố bình thường hóa quan hệ ngoại giao với Việt Nam.' and content = '## Tuyên bố tại Hoa Kỳ

Văn bản Nhà Trắng ngày 11/7/1995 ghi lại tuyên bố của Tổng thống Bill Clinton về bình thường hóa quan hệ ngoại giao với Việt Nam. Đây là ngày theo địa điểm và thời gian của văn bản Hoa Kỳ.

## Phạm vi ngày tháng

Bài viết dùng mốc tuyên bố này; không gộp hai tuyên bố của hai nước thành một ngày chung. Các mốc về dỡ bỏ cấm vận, mở đại sứ quán và quan hệ sau đó cần nguồn riêng.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-11'::date and end_date is not distinct from '1995-07-11'::date and date_precision = 'exact' and date_text = '11/7/1995 (tuyên bố tại Hoa Kỳ)' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.event_topics (event_id,topic_id)
select e.id,t.id from (select id from public.historical_events where slug = 'binh-thuong-hoa-quan-he-viet-my-1995' and workflow_status = 'draft' and title = 'Bình thường hóa quan hệ Việt Nam – Hoa Kỳ' and summary = 'Ngày 11/7/1995 tại Washington, Tổng thống Bill Clinton tuyên bố bình thường hóa quan hệ ngoại giao với Việt Nam.' and content = '## Tuyên bố tại Hoa Kỳ

Văn bản Nhà Trắng ngày 11/7/1995 ghi lại tuyên bố của Tổng thống Bill Clinton về bình thường hóa quan hệ ngoại giao với Việt Nam. Đây là ngày theo địa điểm và thời gian của văn bản Hoa Kỳ.

## Phạm vi ngày tháng

Bài viết dùng mốc tuyên bố này; không gộp hai tuyên bố của hai nước thành một ngày chung. Các mốc về dỡ bỏ cấm vận, mở đại sứ quán và quan hệ sau đó cần nguồn riêng.' and start_year = 1995 and end_year is not distinct from 1995 and start_date is not distinct from '1995-07-11'::date and end_date is not distinct from '1995-07-11'::date and date_precision = 'exact' and date_text = '11/7/1995 (tuyên bố tại Hoa Kỳ)' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join public.curriculum_topics t where t.slug = 'cong-cuoc-doi-moi' on conflict (event_id,topic_id) do nothing;


-- bao-ve-chu-quyen-gac-ma-1988
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Bảo vệ chủ quyền tại Gạc Ma năm 1988', 'bao-ve-chu-quyen-gac-ma-1988', 1988, 1988, '1988-03-14', '1988-03-14', '14/3/1988', 'exact', 'Ngày 14/3/1988, 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.', '## Mốc tưởng niệm

Báo Điện tử Chính phủ và VOV cùng ghi nhận ngày 14/3/1988 và 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.

## Giới hạn nội dung

Bài viết ghi lại mốc và sự hy sinh được các nguồn Việt Nam nêu. Không tái dựng diễn biến tác chiến, tọa độ từng tàu hay lời nói cuối cùng của người tham chiến. Đây là nội dung cần được giáo viên đối chiếu trước khi công bố.', 'draft' from public.curriculum_topics t where t.slug = 'bao-ve-to-quoc-sau-1975' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Opening description of 36th anniversary, 14/3/1988–14/3/2024; paragraph on 64 sailors — Date and commemoration count only; no combat reconstruction or territorial geometry.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'bao-ve-chu-quyen-gac-ma-1988' and workflow_status = 'draft' and title = 'Bảo vệ chủ quyền tại Gạc Ma năm 1988' and summary = 'Ngày 14/3/1988, 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.' and content = '## Mốc tưởng niệm

Báo Điện tử Chính phủ và VOV cùng ghi nhận ngày 14/3/1988 và 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.

## Giới hạn nội dung

Bài viết ghi lại mốc và sự hy sinh được các nguồn Việt Nam nêu. Không tái dựng diễn biến tác chiến, tọa độ từng tàu hay lời nói cuối cùng của người tham chiến. Đây là nội dung cần được giáo viên đối chiếu trước khi công bố.' and start_year = 1988 and end_year is not distinct from 1988 and start_date is not distinct from '1988-03-14'::date and end_date is not distinct from '1988-03-14'::date and date_precision = 'exact' and date_text = '14/3/1988' and topic_id = (select id from public.curriculum_topics where slug = 'bao-ve-to-quoc-sau-1975')) e cross join lateral (select id from public.sources where url = 'https://baochinhphu.vn/tuong-niem-tri-an-64-liet-si-hy-sinh-tai-dao-gac-ma-10224031414164731.htm' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph beginning Lịch sử vẫn luôn nhắc nhớ; next paragraph Cuộc chiến ấy, 64 chiến sĩ — Independent broadcaster corroboration of date/count; retrieved HTTP 200 via direct fetch after web extractor failed.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'bao-ve-chu-quyen-gac-ma-1988' and workflow_status = 'draft' and title = 'Bảo vệ chủ quyền tại Gạc Ma năm 1988' and summary = 'Ngày 14/3/1988, 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.' and content = '## Mốc tưởng niệm

Báo Điện tử Chính phủ và VOV cùng ghi nhận ngày 14/3/1988 và 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.

## Giới hạn nội dung

Bài viết ghi lại mốc và sự hy sinh được các nguồn Việt Nam nêu. Không tái dựng diễn biến tác chiến, tọa độ từng tàu hay lời nói cuối cùng của người tham chiến. Đây là nội dung cần được giáo viên đối chiếu trước khi công bố.' and start_year = 1988 and end_year is not distinct from 1988 and start_date is not distinct from '1988-03-14'::date and end_date is not distinct from '1988-03-14'::date and date_precision = 'exact' and date_text = '14/3/1988' and topic_id = (select id from public.curriculum_topics where slug = 'bao-ve-to-quoc-sau-1975')) e cross join lateral (select id from public.sources where url = 'https://vov.vn/xa-hoi/tri-an-liet-sy-noi-dau-song-1074040.vov' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '9-bao-ve-to-quoc-tu-sau-thang-4-1975', 'muc-3', e.id, 0 from (select id from public.historical_events where slug = 'bao-ve-chu-quyen-gac-ma-1988' and workflow_status = 'draft' and title = 'Bảo vệ chủ quyền tại Gạc Ma năm 1988' and summary = 'Ngày 14/3/1988, 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.' and content = '## Mốc tưởng niệm

Báo Điện tử Chính phủ và VOV cùng ghi nhận ngày 14/3/1988 và 64 cán bộ, chiến sĩ Hải quân Việt Nam hy sinh trong sự kiện tại khu vực Gạc Ma.

## Giới hạn nội dung

Bài viết ghi lại mốc và sự hy sinh được các nguồn Việt Nam nêu. Không tái dựng diễn biến tác chiến, tọa độ từng tàu hay lời nói cuối cùng của người tham chiến. Đây là nội dung cần được giáo viên đối chiếu trước khi công bố.' and start_year = 1988 and end_year is not distinct from 1988 and start_date is not distinct from '1988-03-14'::date and end_date is not distinct from '1988-03-14'::date and date_precision = 'exact' and date_text = '14/3/1988' and topic_id = (select id from public.curriculum_topics where slug = 'bao-ve-to-quoc-sau-1975')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- chien-dich-viet-bac-1947
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Mở đầu cuộc chiến đấu bảo vệ Việt Bắc năm 1947', 'chien-dich-viet-bac-1947', 1947, 1947, '1947-10-07', '1947-10-07', '7/10/1947', 'exact', 'Ngày 7/10/1947, quân Pháp mở cuộc tiến công lên Việt Bắc; lực lượng kháng chiến tổ chức chiến đấu bảo vệ căn cứ.', '## Mốc được chọn

Ngày 7/10/1947, quân Pháp mở cuộc tiến công lên Việt Bắc; lực lượng kháng chiến tổ chức chiến đấu bảo vệ căn cứ.

## Phạm vi học tập

Mốc này đánh dấu ngày mở cuộc tiến công của Pháp và cuộc chiến đấu bảo vệ căn cứ. Không dùng ngày mở đầu thay cho toàn bộ thời gian của chiến dịch. Các số liệu binh lực và câu chữ có sai lệch trong bản số hóa không được đưa vào bài.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-phap' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, '1947 entries: TỪ NGÀY 7-10 ĐẾN NGÀY 22-12; 9-10 and 15-10 entries — Opening milestone and bounded place description only; no unsupported campaign duration, statistics or coordinates.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'chien-dich-viet-bac-1947' and workflow_status = 'draft' and title = 'Mở đầu cuộc chiến đấu bảo vệ Việt Bắc năm 1947' and summary = 'Ngày 7/10/1947, quân Pháp mở cuộc tiến công lên Việt Bắc; lực lượng kháng chiến tổ chức chiến đấu bảo vệ căn cứ.' and content = '## Mốc được chọn

Ngày 7/10/1947, quân Pháp mở cuộc tiến công lên Việt Bắc; lực lượng kháng chiến tổ chức chiến đấu bảo vệ căn cứ.

## Phạm vi học tập

Mốc này đánh dấu ngày mở cuộc tiến công của Pháp và cuộc chiến đấu bảo vệ căn cứ. Không dùng ngày mở đầu thay cho toàn bộ thời gian của chiến dịch. Các số liệu binh lực và câu chữ có sai lệch trong bản số hóa không được đưa vào bài.' and start_year = 1947 and end_year is not distinct from 1947 and start_date is not distinct from '1947-10-07'::date and end_date is not distinct from '1947-10-07'::date and date_precision = 'exact' and date_text = '7/10/1947' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-phap')) e cross join lateral (select id from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-3-176?categoryId=102000083' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '7-khang-chien-chong-phap', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'chien-dich-viet-bac-1947' and workflow_status = 'draft' and title = 'Mở đầu cuộc chiến đấu bảo vệ Việt Bắc năm 1947' and summary = 'Ngày 7/10/1947, quân Pháp mở cuộc tiến công lên Việt Bắc; lực lượng kháng chiến tổ chức chiến đấu bảo vệ căn cứ.' and content = '## Mốc được chọn

Ngày 7/10/1947, quân Pháp mở cuộc tiến công lên Việt Bắc; lực lượng kháng chiến tổ chức chiến đấu bảo vệ căn cứ.

## Phạm vi học tập

Mốc này đánh dấu ngày mở cuộc tiến công của Pháp và cuộc chiến đấu bảo vệ căn cứ. Không dùng ngày mở đầu thay cho toàn bộ thời gian của chiến dịch. Các số liệu binh lực và câu chữ có sai lệch trong bản số hóa không được đưa vào bài.' and start_year = 1947 and end_year is not distinct from 1947 and start_date is not distinct from '1947-10-07'::date and end_date is not distinct from '1947-10-07'::date and date_precision = 'exact' and date_text = '7/10/1947' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-phap')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- chien-dich-bien-gioi-1950
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Mở chiến dịch Biên giới năm 1950', 'chien-dich-bien-gioi-1950', 1950, 1950, '1950-09-16', '1950-09-16', '16/9/1950', 'exact', 'Ngày 16/9/1950, trận Đông Khê mở đầu Chiến dịch Biên giới.', '## Mốc được chọn

Ngày 16/9/1950, trận Đông Khê mở đầu Chiến dịch Biên giới.

## Phạm vi học tập

Đông Khê là trận mở đầu được nguồn xác định. Đây là một mốc trong chiến dịch; bài không biến ngày mở đầu thành thời gian của toàn chiến dịch, và không đưa giờ tấn công vào trường ngày chính xác.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-phap' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph beginning Theo chỉ thị của Người đúng 6h ngày 16/9/1950 — Opening milestone and bounded place description only; no unsupported campaign duration, statistics or coordinates.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'chien-dich-bien-gioi-1950' and workflow_status = 'draft' and title = 'Mở chiến dịch Biên giới năm 1950' and summary = 'Ngày 16/9/1950, trận Đông Khê mở đầu Chiến dịch Biên giới.' and content = '## Mốc được chọn

Ngày 16/9/1950, trận Đông Khê mở đầu Chiến dịch Biên giới.

## Phạm vi học tập

Đông Khê là trận mở đầu được nguồn xác định. Đây là một mốc trong chiến dịch; bài không biến ngày mở đầu thành thời gian của toàn chiến dịch, và không đưa giờ tấn công vào trường ngày chính xác.' and start_year = 1950 and end_year is not distinct from 1950 and start_date is not distinct from '1950-09-16'::date and end_date is not distinct from '1950-09-16'::date and date_precision = 'exact' and date_text = '16/9/1950' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-phap')) e cross join lateral (select id from public.sources where url = 'https://baotanghochiminh.vn/di-tich-nui-bao-dong-noi-chu-tich-ho-chi-minh-quan-sat-tran-danh-don-dong-khe-chien-dich-bien-gioi-1950.htm' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '7-khang-chien-chong-phap', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'chien-dich-bien-gioi-1950' and workflow_status = 'draft' and title = 'Mở chiến dịch Biên giới năm 1950' and summary = 'Ngày 16/9/1950, trận Đông Khê mở đầu Chiến dịch Biên giới.' and content = '## Mốc được chọn

Ngày 16/9/1950, trận Đông Khê mở đầu Chiến dịch Biên giới.

## Phạm vi học tập

Đông Khê là trận mở đầu được nguồn xác định. Đây là một mốc trong chiến dịch; bài không biến ngày mở đầu thành thời gian của toàn chiến dịch, và không đưa giờ tấn công vào trường ngày chính xác.' and start_year = 1950 and end_year is not distinct from 1950 and start_date is not distinct from '1950-09-16'::date and end_date is not distinct from '1950-09-16'::date and date_precision = 'exact' and date_text = '16/9/1950' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-phap')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- phong-trao-dong-khoi-1960
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Đồng khởi Bến Tre năm 1960', 'phong-trao-dong-khoi-1960', 1960, 1960, '1960-01-17', '1960-01-17', '17/1/1960', 'exact', 'Ngày 17/1/1960, Đồng khởi nổ ra tại Định Thủy, Phước Hiệp và Bình Khánh, huyện Mỏ Cày, Bến Tre.', '## Mốc được chọn

Ngày 17/1/1960, Đồng khởi nổ ra tại Định Thủy, Phước Hiệp và Bình Khánh, huyện Mỏ Cày, Bến Tre.

## Phạm vi học tập

Bài chọn mốc Bến Tre trong phong trào Đồng khởi rộng hơn. Ngày 17/1 không phải ngày đồng loạt khởi đầu của mọi cuộc nổi dậy ở miền Nam.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraphs after Đúng theo kế hoạch, ngày 17-1-1960; preceding paragraph naming three communes — Opening milestone and bounded place description only; no unsupported campaign duration, statistics or coordinates.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'phong-trao-dong-khoi-1960' and workflow_status = 'draft' and title = 'Đồng khởi Bến Tre năm 1960' and summary = 'Ngày 17/1/1960, Đồng khởi nổ ra tại Định Thủy, Phước Hiệp và Bình Khánh, huyện Mỏ Cày, Bến Tre.' and content = '## Mốc được chọn

Ngày 17/1/1960, Đồng khởi nổ ra tại Định Thủy, Phước Hiệp và Bình Khánh, huyện Mỏ Cày, Bến Tre.

## Phạm vi học tập

Bài chọn mốc Bến Tre trong phong trào Đồng khởi rộng hơn. Ngày 17/1 không phải ngày đồng loạt khởi đầu của mọi cuộc nổi dậy ở miền Nam.' and start_year = 1960 and end_year is not distinct from 1960 and start_date is not distinct from '1960-01-17'::date and end_date is not distinct from '1960-01-17'::date and date_precision = 'exact' and date_text = '17/1/1960' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3097/15652/ky-niem-54-nam-djong-khoi-ben-tre-17-1-1960-17-1-2014.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'phong-trao-dong-khoi-1960' and workflow_status = 'draft' and title = 'Đồng khởi Bến Tre năm 1960' and summary = 'Ngày 17/1/1960, Đồng khởi nổ ra tại Định Thủy, Phước Hiệp và Bình Khánh, huyện Mỏ Cày, Bến Tre.' and content = '## Mốc được chọn

Ngày 17/1/1960, Đồng khởi nổ ra tại Định Thủy, Phước Hiệp và Bình Khánh, huyện Mỏ Cày, Bến Tre.

## Phạm vi học tập

Bài chọn mốc Bến Tre trong phong trào Đồng khởi rộng hơn. Ngày 17/1 không phải ngày đồng loạt khởi đầu của mọi cuộc nổi dậy ở miền Nam.' and start_year = 1960 and end_year is not distinct from 1960 and start_date is not distinct from '1960-01-17'::date and end_date is not distinct from '1960-01-17'::date and date_precision = 'exact' and date_text = '17/1/1960' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- hue-gianh-chinh-quyen-1945
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Huế giành chính quyền năm 1945', 'hue-gianh-chinh-quyen-1945', 1945, 1945, '1945-08-23', '1945-08-23', '23/8/1945', 'exact', 'Ngày 23/8/1945, nhân dân Huế nổi dậy giành chính quyền.', '## Mốc lịch sử

Ngày 23/8/1945, nhân dân Huế nổi dậy giành chính quyền.

## Phạm vi

Đây là mốc giành chính quyền ở một đô thị trong Tổng khởi nghĩa tháng Tám. Không dùng ngày này làm ngày khởi nghĩa chung của cả nước.', 'draft' from public.curriculum_topics t where t.slug = 'cach-mang-thang-tam-1945' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Section Giành chính quyền tại Huế 23/8/1945 — City milestone or bounded two-day battle; no crowd counts, anecdotes, exact sites or campaign-wide date substitution.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'hue-gianh-chinh-quyen-1945' and workflow_status = 'draft' and title = 'Huế giành chính quyền năm 1945' and summary = 'Ngày 23/8/1945, nhân dân Huế nổi dậy giành chính quyền.' and content = '## Mốc lịch sử

Ngày 23/8/1945, nhân dân Huế nổi dậy giành chính quyền.

## Phạm vi

Đây là mốc giành chính quyền ở một đô thị trong Tổng khởi nghĩa tháng Tám. Không dùng ngày này làm ngày khởi nghĩa chung của cả nước.' and start_year = 1945 and end_year is not distinct from 1945 and start_date is not distinct from '1945-08-23'::date and end_date is not distinct from '1945-08-23'::date and date_precision = 'exact' and date_text = '23/8/1945' and topic_id = (select id from public.curriculum_topics where slug = 'cach-mang-thang-tam-1945')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '6-cach-mang-thang-tam-nam-1945', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'hue-gianh-chinh-quyen-1945' and workflow_status = 'draft' and title = 'Huế giành chính quyền năm 1945' and summary = 'Ngày 23/8/1945, nhân dân Huế nổi dậy giành chính quyền.' and content = '## Mốc lịch sử

Ngày 23/8/1945, nhân dân Huế nổi dậy giành chính quyền.

## Phạm vi

Đây là mốc giành chính quyền ở một đô thị trong Tổng khởi nghĩa tháng Tám. Không dùng ngày này làm ngày khởi nghĩa chung của cả nước.' and start_year = 1945 and end_year is not distinct from 1945 and start_date is not distinct from '1945-08-23'::date and end_date is not distinct from '1945-08-23'::date and date_precision = 'exact' and date_text = '23/8/1945' and topic_id = (select id from public.curriculum_topics where slug = 'cach-mang-thang-tam-1945')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- sai-gon-gianh-chinh-quyen-1945
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Sài Gòn giành chính quyền năm 1945', 'sai-gon-gianh-chinh-quyen-1945', 1945, 1945, '1945-08-25', '1945-08-25', '25/8/1945', 'exact', 'Sáng 25/8/1945, lực lượng cách mạng giành chính quyền ở Sài Gòn.', '## Mốc lịch sử

Sáng 25/8/1945, lực lượng cách mạng giành chính quyền ở Sài Gòn.

## Phạm vi

Đây là mốc giành chính quyền ở một đô thị trong Tổng khởi nghĩa tháng Tám. Không dùng ngày này làm ngày khởi nghĩa chung của cả nước.', 'draft' from public.curriculum_topics t where t.slug = 'cach-mang-thang-tam-1945' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Section Giành chính quyền tại Sài Gòn, 25/8/1945; paragraph Sáng 25/8 — City milestone or bounded two-day battle; no crowd counts, anecdotes, exact sites or campaign-wide date substitution.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'sai-gon-gianh-chinh-quyen-1945' and workflow_status = 'draft' and title = 'Sài Gòn giành chính quyền năm 1945' and summary = 'Sáng 25/8/1945, lực lượng cách mạng giành chính quyền ở Sài Gòn.' and content = '## Mốc lịch sử

Sáng 25/8/1945, lực lượng cách mạng giành chính quyền ở Sài Gòn.

## Phạm vi

Đây là mốc giành chính quyền ở một đô thị trong Tổng khởi nghĩa tháng Tám. Không dùng ngày này làm ngày khởi nghĩa chung của cả nước.' and start_year = 1945 and end_year is not distinct from 1945 and start_date is not distinct from '1945-08-25'::date and end_date is not distinct from '1945-08-25'::date and date_precision = 'exact' and date_text = '25/8/1945' and topic_id = (select id from public.curriculum_topics where slug = 'cach-mang-thang-tam-1945')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '6-cach-mang-thang-tam-nam-1945', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'sai-gon-gianh-chinh-quyen-1945' and workflow_status = 'draft' and title = 'Sài Gòn giành chính quyền năm 1945' and summary = 'Sáng 25/8/1945, lực lượng cách mạng giành chính quyền ở Sài Gòn.' and content = '## Mốc lịch sử

Sáng 25/8/1945, lực lượng cách mạng giành chính quyền ở Sài Gòn.

## Phạm vi

Đây là mốc giành chính quyền ở một đô thị trong Tổng khởi nghĩa tháng Tám. Không dùng ngày này làm ngày khởi nghĩa chung của cả nước.' and start_year = 1945 and end_year is not distinct from 1945 and start_date is not distinct from '1945-08-25'::date and end_date is not distinct from '1945-08-25'::date and date_precision = 'exact' and date_text = '25/8/1945' and topic_id = (select id from public.curriculum_topics where slug = 'cach-mang-thang-tam-1945')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- chien-thang-buon-ma-thuot-1975
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Trận Buôn Ma Thuột tháng 3/1975', 'chien-thang-buon-ma-thuot-1975', 1975, 1975, '1975-03-10', '1975-03-11', '10–11/3/1975', 'period', 'Trong hai ngày 10–11/3/1975, lực lượng tiến công giải phóng thị xã Buôn Ma Thuột, mở ra bước ngoặt của Chiến dịch Tây Nguyên.', '## Mốc lịch sử

Trong hai ngày 10–11/3/1975, lực lượng tiến công giải phóng thị xã Buôn Ma Thuột, mở ra bước ngoặt của Chiến dịch Tây Nguyên.

## Phạm vi

Khoảng hai ngày là thời gian trận then chốt tại thị xã được bài nguồn nêu; không phải toàn bộ thời gian Chiến dịch Tây Nguyên.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph beginning Từ ngày 10-11/3/1975 — City milestone or bounded two-day battle; no crowd counts, anecdotes, exact sites or campaign-wide date substitution.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'chien-thang-buon-ma-thuot-1975' and workflow_status = 'draft' and title = 'Trận Buôn Ma Thuột tháng 3/1975' and summary = 'Trong hai ngày 10–11/3/1975, lực lượng tiến công giải phóng thị xã Buôn Ma Thuột, mở ra bước ngoặt của Chiến dịch Tây Nguyên.' and content = '## Mốc lịch sử

Trong hai ngày 10–11/3/1975, lực lượng tiến công giải phóng thị xã Buôn Ma Thuột, mở ra bước ngoặt của Chiến dịch Tây Nguyên.

## Phạm vi

Khoảng hai ngày là thời gian trận then chốt tại thị xã được bài nguồn nêu; không phải toàn bộ thời gian Chiến dịch Tây Nguyên.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-10'::date and end_date is not distinct from '1975-03-11'::date and date_precision = 'period' and date_text = '10–11/3/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baochinhphu.vn/nho-ve-chien-dich-mang-tinh-buoc-ngoat-cua-mua-xuan-1975-102270035.htm' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-3', e.id, 0 from (select id from public.historical_events where slug = 'chien-thang-buon-ma-thuot-1975' and workflow_status = 'draft' and title = 'Trận Buôn Ma Thuột tháng 3/1975' and summary = 'Trong hai ngày 10–11/3/1975, lực lượng tiến công giải phóng thị xã Buôn Ma Thuột, mở ra bước ngoặt của Chiến dịch Tây Nguyên.' and content = '## Mốc lịch sử

Trong hai ngày 10–11/3/1975, lực lượng tiến công giải phóng thị xã Buôn Ma Thuột, mở ra bước ngoặt của Chiến dịch Tây Nguyên.

## Phạm vi

Khoảng hai ngày là thời gian trận then chốt tại thị xã được bài nguồn nêu; không phải toàn bộ thời gian Chiến dịch Tây Nguyên.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-10'::date and end_date is not distinct from '1975-03-11'::date and date_precision = 'period' and date_text = '10–11/3/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- giai-phong-hue-1975
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Giải phóng Huế năm 1975', 'giai-phong-hue-1975', 1975, 1975, '1975-03-26', '1975-03-26', '26/03/1975', 'exact', 'Ngày 26/3/1975, thành phố Huế được giải phóng.', '## Mốc lịch sử

Ngày 26/3/1975, thành phố Huế được giải phóng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Part 3, Tài liệu, hiện vật tiêu biểu: caption list for Huế 26/3 and Đà Nẵng 29/3 — Concluding city milestone only, not campaign start or duration.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'giai-phong-hue-1975' and workflow_status = 'draft' and title = 'Giải phóng Huế năm 1975' and summary = 'Ngày 26/3/1975, thành phố Huế được giải phóng.' and content = '## Mốc lịch sử

Ngày 26/3/1975, thành phố Huế được giải phóng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-26'::date and end_date is not distinct from '1975-03-26'::date and date_precision = 'exact' and date_text = '26/03/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Final paragraph of Đợt 2 (21–26/3/1975) — Independent city milestone corroboration.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'giai-phong-hue-1975' and workflow_status = 'draft' and title = 'Giải phóng Huế năm 1975' and summary = 'Ngày 26/3/1975, thành phố Huế được giải phóng.' and content = '## Mốc lịch sử

Ngày 26/3/1975, thành phố Huế được giải phóng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-26'::date and end_date is not distinct from '1975-03-26'::date and date_precision = 'exact' and date_text = '26/03/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-3', e.id, 0 from (select id from public.historical_events where slug = 'giai-phong-hue-1975' and workflow_status = 'draft' and title = 'Giải phóng Huế năm 1975' and summary = 'Ngày 26/3/1975, thành phố Huế được giải phóng.' and content = '## Mốc lịch sử

Ngày 26/3/1975, thành phố Huế được giải phóng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-26'::date and end_date is not distinct from '1975-03-26'::date and date_precision = 'exact' and date_text = '26/03/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- giai-phong-da-nang-1975
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Giải phóng Đà Nẵng năm 1975', 'giai-phong-da-nang-1975', 1975, 1975, '1975-03-29', '1975-03-29', '29/03/1975', 'exact', 'Ngày 29/3/1975, lực lượng giải phóng hoàn toàn làm chủ thành phố Đà Nẵng.', '## Mốc lịch sử

Ngày 29/3/1975, lực lượng giải phóng hoàn toàn làm chủ thành phố Đà Nẵng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Part 3, Tài liệu, hiện vật tiêu biểu: caption list for Huế 26/3 and Đà Nẵng 29/3 — Concluding city milestone only, not campaign start or duration.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'giai-phong-da-nang-1975' and workflow_status = 'draft' and title = 'Giải phóng Đà Nẵng năm 1975' and summary = 'Ngày 29/3/1975, lực lượng giải phóng hoàn toàn làm chủ thành phố Đà Nẵng.' and content = '## Mốc lịch sử

Ngày 29/3/1975, lực lượng giải phóng hoàn toàn làm chủ thành phố Đà Nẵng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-29'::date and end_date is not distinct from '1975-03-29'::date and date_precision = 'exact' and date_text = '29/03/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-3', e.id, 0 from (select id from public.historical_events where slug = 'giai-phong-da-nang-1975' and workflow_status = 'draft' and title = 'Giải phóng Đà Nẵng năm 1975' and summary = 'Ngày 29/3/1975, lực lượng giải phóng hoàn toàn làm chủ thành phố Đà Nẵng.' and content = '## Mốc lịch sử

Ngày 29/3/1975, lực lượng giải phóng hoàn toàn làm chủ thành phố Đà Nẵng.

## Đọc trong Tổng tiến công mùa Xuân

Đây là ngày kết thúc giải phóng một đô thị theo nguồn. Không dùng mốc này làm ngày mở đầu hay toàn bộ thời gian của chiến dịch trên khu vực rộng hơn.' and start_year = 1975 and end_year is not distinct from 1975 and start_date is not distinct from '1975-03-29'::date and end_date is not distinct from '1975-03-29'::date and date_precision = 'exact' and date_text = '29/03/1975' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- phong-trao-dong-du
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Phong trào Đông Du', 'phong-trao-dong-du', 1905, 1909, null, null, '1905–1909 (hoạt động chủ yếu 1905–1908)', 'period', 'Từ năm 1905, Phan Bội Châu vận động thanh niên Việt Nam sang Nhật Bản học tập. Phong trào bị giải tán năm 1908; Phan Bội Châu và Cường Để bị trục xuất khỏi Nhật Bản vào tháng 2/1909.', '## Mốc lịch sử

Từ năm 1905, Phan Bội Châu vận động thanh niên Việt Nam sang Nhật Bản học tập. Phong trào bị giải tán năm 1908; Phan Bội Châu và Cường Để bị trục xuất khỏi Nhật Bản vào tháng 2/1909.

## Phạm vi và độ chính xác

Nguồn đặt tiêu đề 1905–1908 và ghi thêm việc trục xuất năm 1909 trong phần kết. Khoảng năm ở đây bao gồm cả kết cục đó; không gán một ngày chính xác cho cả phong trào.', 'draft' from public.curriculum_topics t where t.slug = 'doi-ngoai-viet-nam' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Opening Đầu năm 1905; paragraph Những hoạt động...1905 đến 1908; paragraph Tháng 9 năm 1908...Tháng 2 năm 1909 — Bounded movement/month/commemoration claim; conference-wide dates, exact buildings and statistics excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'phong-trao-dong-du' and workflow_status = 'draft' and title = 'Phong trào Đông Du' and summary = 'Từ năm 1905, Phan Bội Châu vận động thanh niên Việt Nam sang Nhật Bản học tập. Phong trào bị giải tán năm 1908; Phan Bội Châu và Cường Để bị trục xuất khỏi Nhật Bản vào tháng 2/1909.' and content = '## Mốc lịch sử

Từ năm 1905, Phan Bội Châu vận động thanh niên Việt Nam sang Nhật Bản học tập. Phong trào bị giải tán năm 1908; Phan Bội Châu và Cường Để bị trục xuất khỏi Nhật Bản vào tháng 2/1909.

## Phạm vi và độ chính xác

Nguồn đặt tiêu đề 1905–1908 và ghi thêm việc trục xuất năm 1909 trong phần kết. Khoảng năm ở đây bao gồm cả kết cục đó; không gán một ngày chính xác cho cả phong trào.' and start_year = 1905 and end_year is not distinct from 1909 and start_date is not distinct from null::date and end_date is not distinct from null::date and date_precision = 'period' and date_text = '1905–1909 (hoạt động chủ yếu 1905–1908)' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/3097/14624/phong-trao-djong-du-1905-1908-mot-hinh-thuc-xay-dung-luc-luong-cach-mang-nhung-nam-dau-the-ky-xx.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '12-doi-ngoai-dau-the-ki-xx-den-1945', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'phong-trao-dong-du' and workflow_status = 'draft' and title = 'Phong trào Đông Du' and summary = 'Từ năm 1905, Phan Bội Châu vận động thanh niên Việt Nam sang Nhật Bản học tập. Phong trào bị giải tán năm 1908; Phan Bội Châu và Cường Để bị trục xuất khỏi Nhật Bản vào tháng 2/1909.' and content = '## Mốc lịch sử

Từ năm 1905, Phan Bội Châu vận động thanh niên Việt Nam sang Nhật Bản học tập. Phong trào bị giải tán năm 1908; Phan Bội Châu và Cường Để bị trục xuất khỏi Nhật Bản vào tháng 2/1909.

## Phạm vi và độ chính xác

Nguồn đặt tiêu đề 1905–1908 và ghi thêm việc trục xuất năm 1909 trong phần kết. Khoảng năm ở đây bao gồm cả kết cục đó; không gán một ngày chính xác cho cả phong trào.' and start_year = 1905 and end_year is not distinct from 1909 and start_date is not distinct from null::date and end_date is not distinct from null::date and date_precision = 'period' and date_text = '1905–1909 (hoạt động chủ yếu 1905–1908)' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- nguyen-ai-quoc-dai-hoi-tours-1920
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Nguyễn Ái Quốc tại Đại hội Tours', 'nguyen-ai-quoc-dai-hoi-tours-1920', 1920, 1920, null, null, 'Tháng 12/1920', 'approximate', 'Tháng 12/1920, Nguyễn Ái Quốc tham dự Đại hội Đảng Xã hội Pháp tại Tours và tham gia sáng lập Đảng Cộng sản Pháp.', '## Mốc lịch sử

Tháng 12/1920, Nguyễn Ái Quốc tham dự Đại hội Đảng Xã hội Pháp tại Tours và tham gia sáng lập Đảng Cộng sản Pháp.

## Phạm vi và độ chính xác

Ngày trong bài được giữ ở mức tháng theo phạm vi chọn lọc. Trường dữ liệu hiện không có enum tháng; dùng approximate và không điền ngày đầu tháng giả định.', 'draft' from public.curriculum_topics t where t.slug = 'ho-chi-minh' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph Đại hội lần thứ XVIII...tại thành phố Tours tháng 12-1920; following paragraph bỏ phiếu tán thành Quốc tế III — Bounded movement/month/commemoration claim; conference-wide dates, exact buildings and statistics excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'nguyen-ai-quoc-dai-hoi-tours-1920' and workflow_status = 'draft' and title = 'Nguyễn Ái Quốc tại Đại hội Tours' and summary = 'Tháng 12/1920, Nguyễn Ái Quốc tham dự Đại hội Đảng Xã hội Pháp tại Tours và tham gia sáng lập Đảng Cộng sản Pháp.' and content = '## Mốc lịch sử

Tháng 12/1920, Nguyễn Ái Quốc tham dự Đại hội Đảng Xã hội Pháp tại Tours và tham gia sáng lập Đảng Cộng sản Pháp.

## Phạm vi và độ chính xác

Ngày trong bài được giữ ở mức tháng theo phạm vi chọn lọc. Trường dữ liệu hiện không có enum tháng; dùng approximate và không điền ngày đầu tháng giả định.' and start_year = 1920 and end_year is not distinct from 1920 and start_date is not distinct from null::date and end_date is not distinct from null::date and date_precision = 'approximate' and date_text = 'Tháng 12/1920' and topic_id = (select id from public.curriculum_topics where slug = 'ho-chi-minh')) e cross join lateral (select id from public.sources where url = 'https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '16-ho-chi-minh-anh-hung-giai-phong-dan-toc', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'nguyen-ai-quoc-dai-hoi-tours-1920' and workflow_status = 'draft' and title = 'Nguyễn Ái Quốc tại Đại hội Tours' and summary = 'Tháng 12/1920, Nguyễn Ái Quốc tham dự Đại hội Đảng Xã hội Pháp tại Tours và tham gia sáng lập Đảng Cộng sản Pháp.' and content = '## Mốc lịch sử

Tháng 12/1920, Nguyễn Ái Quốc tham dự Đại hội Đảng Xã hội Pháp tại Tours và tham gia sáng lập Đảng Cộng sản Pháp.

## Phạm vi và độ chính xác

Ngày trong bài được giữ ở mức tháng theo phạm vi chọn lọc. Trường dữ liệu hiện không có enum tháng; dùng approximate và không điền ngày đầu tháng giả định.' and start_year = 1920 and end_year is not distinct from 1920 and start_date is not distinct from null::date and end_date is not distinct from null::date and date_precision = 'approximate' and date_text = 'Tháng 12/1920' and topic_id = (select id from public.curriculum_topics where slug = 'ho-chi-minh')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- thanh-lap-dang-cong-san-viet-nam-1930
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Thành lập Đảng Cộng sản Việt Nam', 'thanh-lap-dang-cong-san-viet-nam-1930', 1930, 1930, '1930-02-03', '1930-02-03', '3/2/1930 (ngày thành lập được kỷ niệm)', 'exact', 'Ngày 3/2/1930 được xác định là Ngày thành lập Đảng Cộng sản Việt Nam. Nguyễn Ái Quốc chủ trì việc hợp nhất các tổ chức cộng sản thành một đảng thống nhất.', '## Mốc lịch sử

Ngày 3/2/1930 được xác định là Ngày thành lập Đảng Cộng sản Việt Nam. Nguyễn Ái Quốc chủ trì việc hợp nhất các tổ chức cộng sản thành một đảng thống nhất.

## Phạm vi và độ chính xác

Mốc 3/2 là ngày thành lập được kỷ niệm, không phải tuyên bố hội nghị chỉ diễn ra trong một ngày. Bài không chốt thời gian toàn hội nghị từ các niên biểu khác nhau.', 'draft' from public.curriculum_topics t where t.slug = 'ho-chi-minh' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph Hội nghị nhất trí...Ngày 3 tháng 2 năm 1930 trở thành Ngày thành lập Đảng Cộng sản Việt Nam — Bounded movement/month/commemoration claim; conference-wide dates, exact buildings and statistics excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'thanh-lap-dang-cong-san-viet-nam-1930' and workflow_status = 'draft' and title = 'Thành lập Đảng Cộng sản Việt Nam' and summary = 'Ngày 3/2/1930 được xác định là Ngày thành lập Đảng Cộng sản Việt Nam. Nguyễn Ái Quốc chủ trì việc hợp nhất các tổ chức cộng sản thành một đảng thống nhất.' and content = '## Mốc lịch sử

Ngày 3/2/1930 được xác định là Ngày thành lập Đảng Cộng sản Việt Nam. Nguyễn Ái Quốc chủ trì việc hợp nhất các tổ chức cộng sản thành một đảng thống nhất.

## Phạm vi và độ chính xác

Mốc 3/2 là ngày thành lập được kỷ niệm, không phải tuyên bố hội nghị chỉ diễn ra trong một ngày. Bài không chốt thời gian toàn hội nghị từ các niên biểu khác nhau.' and start_year = 1930 and end_year is not distinct from 1930 and start_date is not distinct from '1930-02-03'::date and end_date is not distinct from '1930-02-03'::date and date_precision = 'exact' and date_text = '3/2/1930 (ngày thành lập được kỷ niệm)' and topic_id = (select id from public.curriculum_topics where slug = 'ho-chi-minh')) e cross join lateral (select id from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/su-kien-va-nhan-chung/ngay-thanh-lap-dang-cong-san-viet-nam-3-2-1930-3342' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '15-khai-quat-cuoc-doi-va-su-nghiep-ho-chi-minh', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'thanh-lap-dang-cong-san-viet-nam-1930' and workflow_status = 'draft' and title = 'Thành lập Đảng Cộng sản Việt Nam' and summary = 'Ngày 3/2/1930 được xác định là Ngày thành lập Đảng Cộng sản Việt Nam. Nguyễn Ái Quốc chủ trì việc hợp nhất các tổ chức cộng sản thành một đảng thống nhất.' and content = '## Mốc lịch sử

Ngày 3/2/1930 được xác định là Ngày thành lập Đảng Cộng sản Việt Nam. Nguyễn Ái Quốc chủ trì việc hợp nhất các tổ chức cộng sản thành một đảng thống nhất.

## Phạm vi và độ chính xác

Mốc 3/2 là ngày thành lập được kỷ niệm, không phải tuyên bố hội nghị chỉ diễn ra trong một ngày. Bài không chốt thời gian toàn hội nghị từ các niên biểu khác nhau.' and start_year = 1930 and end_year is not distinct from 1930 and start_date is not distinct from '1930-02-03'::date and end_date is not distinct from '1930-02-03'::date and date_precision = 'exact' and date_text = '3/2/1930 (ngày thành lập được kỷ niệm)' and topic_id = (select id from public.curriculum_topics where slug = 'ho-chi-minh')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- thanh-lap-viet-minh-1941
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Thành lập Mặt trận Việt Minh', 'thanh-lap-viet-minh-1941', 1941, 1941, '1941-05-19', '1941-05-19', '19/5/1941', 'exact', 'Ngày 19/5/1941, Mặt trận Việt Nam độc lập đồng minh, gọi tắt là Việt Minh, ra đời để tập hợp các lực lượng tham gia đấu tranh giải phóng dân tộc.', '## Mốc lịch sử

Ngày 19/5/1941, Mặt trận Việt Nam độc lập đồng minh, gọi tắt là Việt Minh, ra đời để tập hợp các lực lượng tham gia đấu tranh giải phóng dân tộc.

## Đọc nguồn

Mốc thành lập tổ chức này được giữ tách biệt với mốc Nguyễn Ái Quốc trở về nước. Hai sự kiện có quan hệ trong tiến trình chuẩn bị cách mạng nhưng có danh tính và ngày riêng.', 'draft' from public.curriculum_topics t where t.slug = 'cach-mang-thang-tam-1945' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraphs Hội nghị đã quyết định thành lập Việt Nam độc lập đồng minh and Ngày 19-5-1941 — Date, event identity and bounded summary only; statistics, exact military positions and anecdotes excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'thanh-lap-viet-minh-1941' and workflow_status = 'draft' and title = 'Thành lập Mặt trận Việt Minh' and summary = 'Ngày 19/5/1941, Mặt trận Việt Nam độc lập đồng minh, gọi tắt là Việt Minh, ra đời để tập hợp các lực lượng tham gia đấu tranh giải phóng dân tộc.' and content = '## Mốc lịch sử

Ngày 19/5/1941, Mặt trận Việt Nam độc lập đồng minh, gọi tắt là Việt Minh, ra đời để tập hợp các lực lượng tham gia đấu tranh giải phóng dân tộc.

## Đọc nguồn

Mốc thành lập tổ chức này được giữ tách biệt với mốc Nguyễn Ái Quốc trở về nước. Hai sự kiện có quan hệ trong tiến trình chuẩn bị cách mạng nhưng có danh tính và ngày riêng.' and start_year = 1941 and end_year is not distinct from 1941 and start_date is not distinct from '1941-05-19'::date and end_date is not distinct from '1941-05-19'::date and date_precision = 'exact' and date_text = '19/5/1941' and topic_id = (select id from public.curriculum_topics where slug = 'cach-mang-thang-tam-1945')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/VI/Articles/3097/16382/19-5-1941-thanh-lap-mat-tran-viet-minh.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '16-ho-chi-minh-anh-hung-giai-phong-dan-toc', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'thanh-lap-viet-minh-1941' and workflow_status = 'draft' and title = 'Thành lập Mặt trận Việt Minh' and summary = 'Ngày 19/5/1941, Mặt trận Việt Nam độc lập đồng minh, gọi tắt là Việt Minh, ra đời để tập hợp các lực lượng tham gia đấu tranh giải phóng dân tộc.' and content = '## Mốc lịch sử

Ngày 19/5/1941, Mặt trận Việt Nam độc lập đồng minh, gọi tắt là Việt Minh, ra đời để tập hợp các lực lượng tham gia đấu tranh giải phóng dân tộc.

## Đọc nguồn

Mốc thành lập tổ chức này được giữ tách biệt với mốc Nguyễn Ái Quốc trở về nước. Hai sự kiện có quan hệ trong tiến trình chuẩn bị cách mạng nhưng có danh tính và ngày riêng.' and start_year = 1941 and end_year is not distinct from 1941 and start_date is not distinct from '1941-05-19'::date and end_date is not distinct from '1941-05-19'::date and date_precision = 'exact' and date_text = '19/5/1941' and topic_id = (select id from public.curriculum_topics where slug = 'cach-mang-thang-tam-1945')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- chien-thang-ap-bac-1963
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Chiến thắng Ấp Bắc', 'chien-thang-ap-bac-1963', 1963, 1963, '1963-01-02', '1963-01-02', '2/1/1963', 'exact', 'Ngày 2/1/1963, trận Ấp Bắc diễn ra và lực lượng cách mạng giành thắng lợi.', '## Mốc lịch sử

Ngày 2/1/1963, trận Ấp Bắc diễn ra và lực lượng cách mạng giành thắng lợi.

## Đọc nguồn

Bài chọn ngày của trận đánh được nguồn nêu. Không dùng một trận đánh để đại diện cho mọi diễn biến hay ngày kết thúc của một chiến lược chiến tranh; không đưa số liệu thương vong chưa được đối chiếu vào bài.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Title, opening place/date paragraph and paragraph Sáng ngày 2-1-1963 — Date, event identity and bounded summary only; statistics, exact military positions and anecdotes excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'chien-thang-ap-bac-1963' and workflow_status = 'draft' and title = 'Chiến thắng Ấp Bắc' and summary = 'Ngày 2/1/1963, trận Ấp Bắc diễn ra và lực lượng cách mạng giành thắng lợi.' and content = '## Mốc lịch sử

Ngày 2/1/1963, trận Ấp Bắc diễn ra và lực lượng cách mạng giành thắng lợi.

## Đọc nguồn

Bài chọn ngày của trận đánh được nguồn nêu. Không dùng một trận đánh để đại diện cho mọi diễn biến hay ngày kết thúc của một chiến lược chiến tranh; không đưa số liệu thương vong chưa được đối chiếu vào bài.' and start_year = 1963 and end_year is not distinct from 1963 and start_date is not distinct from '1963-01-02'::date and end_date is not distinct from '1963-01-02'::date and date_precision = 'exact' and date_text = '2/1/1963' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/2002/61989/chien-thang-ap-bac-ngay-2-1-1963.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'chien-thang-ap-bac-1963' and workflow_status = 'draft' and title = 'Chiến thắng Ấp Bắc' and summary = 'Ngày 2/1/1963, trận Ấp Bắc diễn ra và lực lượng cách mạng giành thắng lợi.' and content = '## Mốc lịch sử

Ngày 2/1/1963, trận Ấp Bắc diễn ra và lực lượng cách mạng giành thắng lợi.

## Đọc nguồn

Bài chọn ngày của trận đánh được nguồn nêu. Không dùng một trận đánh để đại diện cho mọi diễn biến hay ngày kết thúc của một chiến lược chiến tranh; không đưa số liệu thương vong chưa được đối chiếu vào bài.' and start_year = 1963 and end_year is not distinct from 1963 and start_date is not distinct from '1963-01-02'::date and end_date is not distinct from '1963-01-02'::date and date_precision = 'exact' and date_text = '2/1/1963' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- chien-thang-van-tuong-1965
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Chiến thắng Vạn Tường', 'chien-thang-van-tuong-1965', 1965, 1965, '1965-08-18', '1965-08-18', '18/8/1965', 'exact', 'Ngày 18/8/1965, trận Vạn Tường diễn ra giữa lực lượng giải phóng miền Nam và quân đội Mỹ.', '## Mốc lịch sử

Ngày 18/8/1965, trận Vạn Tường diễn ra giữa lực lượng giải phóng miền Nam và quân đội Mỹ.

## Đọc nguồn

Bài chọn ngày của trận đánh được nguồn nêu. Không dùng một trận đánh để đại diện cho mọi diễn biến hay ngày kết thúc của một chiến lược chiến tranh; không đưa số liệu thương vong chưa được đối chiếu vào bài.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Title and opening paragraph naming opposing forces and date — Date, event identity and bounded summary only; statistics, exact military positions and anecdotes excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'chien-thang-van-tuong-1965' and workflow_status = 'draft' and title = 'Chiến thắng Vạn Tường' and summary = 'Ngày 18/8/1965, trận Vạn Tường diễn ra giữa lực lượng giải phóng miền Nam và quân đội Mỹ.' and content = '## Mốc lịch sử

Ngày 18/8/1965, trận Vạn Tường diễn ra giữa lực lượng giải phóng miền Nam và quân đội Mỹ.

## Đọc nguồn

Bài chọn ngày của trận đánh được nguồn nêu. Không dùng một trận đánh để đại diện cho mọi diễn biến hay ngày kết thúc của một chiến lược chiến tranh; không đưa số liệu thương vong chưa được đối chiếu vào bài.' and start_year = 1965 and end_year is not distinct from 1965 and start_date is not distinct from '1965-08-18'::date and end_date is not distinct from '1965-08-18'::date and date_precision = 'exact' and date_text = '18/8/1965' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/3097/14898/ky-niem-48-nam-18-8-1965-18-8-2013-chien-thang-van-tuong.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'chien-thang-van-tuong-1965' and workflow_status = 'draft' and title = 'Chiến thắng Vạn Tường' and summary = 'Ngày 18/8/1965, trận Vạn Tường diễn ra giữa lực lượng giải phóng miền Nam và quân đội Mỹ.' and content = '## Mốc lịch sử

Ngày 18/8/1965, trận Vạn Tường diễn ra giữa lực lượng giải phóng miền Nam và quân đội Mỹ.

## Đọc nguồn

Bài chọn ngày của trận đánh được nguồn nêu. Không dùng một trận đánh để đại diện cho mọi diễn biến hay ngày kết thúc của một chiến lược chiến tranh; không đưa số liệu thương vong chưa được đối chiếu vào bài.' and start_year = 1965 and end_year is not distinct from 1965 and start_date is not distinct from '1965-08-18'::date and end_date is not distinct from '1965-08-18'::date and date_precision = 'exact' and date_text = '18/8/1965' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- tien-cong-chien-luoc-1972
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Mở cuộc tiến công chiến lược năm 1972', 'tien-cong-chien-luoc-1972', 1972, 1972, '1972-03-30', '1972-03-30', '30/3/1972', 'exact', 'Ngày 30/3/1972, cuộc tiến công chiến lược bắt đầu, với Quảng Trị là hướng tiến công chủ yếu.', '## Mốc lịch sử

Ngày 30/3/1972, cuộc tiến công chiến lược bắt đầu, với Quảng Trị là hướng tiến công chủ yếu.

## Phạm vi

Bài chọn mốc mở đầu trong tháng 3. Đây là sự kiện khác với cuộc chiến đấu chống tập kích đường không tại Hà Nội và Hải Phòng tháng 12/1972; không gộp hai sự kiện thành một.', 'draft' from public.curriculum_topics t where t.slug = 'khang-chien-chong-my' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph Trưa 30-3-1972...Quảng Trị...phát triển rộng...kéo dài trong năm 1972 — Opening date and main direction only; campaign-wide end dates excluded.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'tien-cong-chien-luoc-1972' and workflow_status = 'draft' and title = 'Mở cuộc tiến công chiến lược năm 1972' and summary = 'Ngày 30/3/1972, cuộc tiến công chiến lược bắt đầu, với Quảng Trị là hướng tiến công chủ yếu.' and content = '## Mốc lịch sử

Ngày 30/3/1972, cuộc tiến công chiến lược bắt đầu, với Quảng Trị là hướng tiến công chủ yếu.

## Phạm vi

Bài chọn mốc mở đầu trong tháng 3. Đây là sự kiện khác với cuộc chiến đấu chống tập kích đường không tại Hà Nội và Hải Phòng tháng 12/1972; không gộp hai sự kiện thành một.' and start_year = 1972 and end_year is not distinct from 1972 and start_date is not distinct from '1972-03-30'::date and end_date is not distinct from '1972-03-30'::date and date_precision = 'exact' and date_text = '30/3/1972' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e cross join lateral (select id from public.sources where url = 'https://baotanglichsu.vn/vi/Articles/2002/68267/ngay-30-3-1972-cuoc-tong-tien-cong-chien-luoc-nam-1972-bat-djau.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '8-khang-chien-chong-my-cuu-nuoc', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'tien-cong-chien-luoc-1972' and workflow_status = 'draft' and title = 'Mở cuộc tiến công chiến lược năm 1972' and summary = 'Ngày 30/3/1972, cuộc tiến công chiến lược bắt đầu, với Quảng Trị là hướng tiến công chủ yếu.' and content = '## Mốc lịch sử

Ngày 30/3/1972, cuộc tiến công chiến lược bắt đầu, với Quảng Trị là hướng tiến công chủ yếu.

## Phạm vi

Bài chọn mốc mở đầu trong tháng 3. Đây là sự kiện khác với cuộc chiến đấu chống tập kích đường không tại Hà Nội và Hải Phòng tháng 12/1972; không gộp hai sự kiện thành một.' and start_year = 1972 and end_year is not distinct from 1972 and start_date is not distinct from '1972-03-30'::date and end_date is not distinct from '1972-03-30'::date and date_precision = 'exact' and date_text = '30/3/1972' and topic_id = (select id from public.curriculum_topics where slug = 'khang-chien-chong-my')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- nghi-quyet-khoan-10-1988
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp', 'nghi-quyet-khoan-10-1988', 1988, 1988, '1988-04-05', '1988-04-05', '5/4/1988', 'exact', 'Ngày 5/4/1988, Bộ Chính trị ban hành Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp, xác định vai trò tự chủ của kinh tế hộ.', '## Mốc lịch sử

Ngày 5/4/1988, Bộ Chính trị ban hành Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp, xác định vai trò tự chủ của kinh tế hộ.

## Phạm vi

Đây là ngày ban hành một chủ trương. Phạm vi áp dụng và tác động kinh tế không thể được biểu diễn bằng một điểm ban hành trên bản đồ; bài giữ sự kiện không có tọa độ.', 'draft' from public.curriculum_topics t where t.slug = 'cong-cuoc-doi-moi' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Paragraph Trên cơ sở thắng lợi của cơ chế Khoán 100...ngày 5/4/1988...Nghị quyết 10 — Issuing body/date, policy subject and household autonomy only; no aggregate output attribution.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'nghi-quyet-khoan-10-1988' and workflow_status = 'draft' and title = 'Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp' and summary = 'Ngày 5/4/1988, Bộ Chính trị ban hành Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp, xác định vai trò tự chủ của kinh tế hộ.' and content = '## Mốc lịch sử

Ngày 5/4/1988, Bộ Chính trị ban hành Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp, xác định vai trò tự chủ của kinh tế hộ.

## Phạm vi

Đây là ngày ban hành một chủ trương. Phạm vi áp dụng và tác động kinh tế không thể được biểu diễn bằng một điểm ban hành trên bản đồ; bài giữ sự kiện không có tọa độ.' and start_year = 1988 and end_year is not distinct from 1988 and start_date is not distinct from '1988-04-05'::date and end_date is not distinct from '1988-04-05'::date and date_precision = 'exact' and date_text = '5/4/1988' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e cross join lateral (select id from public.sources where url = 'https://baochinhphu.vn/giai-quyet-van-de-nong-nghiep-nong-dan-nong-thon-la-nhiem-vu-cua-ca-he-thong-chinh-tri-va-toan-xa-hoi-102829.htm' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '10-khai-quat-ve-cong-cuoc-doi-moi', 'muc-1', e.id, 0 from (select id from public.historical_events where slug = 'nghi-quyet-khoan-10-1988' and workflow_status = 'draft' and title = 'Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp' and summary = 'Ngày 5/4/1988, Bộ Chính trị ban hành Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp, xác định vai trò tự chủ của kinh tế hộ.' and content = '## Mốc lịch sử

Ngày 5/4/1988, Bộ Chính trị ban hành Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp, xác định vai trò tự chủ của kinh tế hộ.

## Phạm vi

Đây là ngày ban hành một chủ trương. Phạm vi áp dụng và tác động kinh tế không thể được biểu diễn bằng một điểm ban hành trên bản đồ; bài giữ sự kiện không có tọa độ.' and start_year = 1988 and end_year is not distinct from 1988 and start_date is not distinct from '1988-04-05'::date and end_date is not distinct from '1988-04-05'::date and date_precision = 'exact' and date_text = '5/4/1988' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- dai-hoi-dang-lan-thu-viii-1996
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng', 'dai-hoi-dang-lan-thu-viii-1996', 1996, 1996, '1996-06-28', '1996-07-01', '28/6–1/7/1996', 'period', 'Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.', '## Mốc lịch sử

Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.

## Đọc đánh giá mười năm Đổi mới tại thời điểm 1996

Báo cáo Chính trị tại Đại hội VIII đánh giá Việt Nam đã ra khỏi khủng hoảng kinh tế – xã hội, đồng thời lưu ý một số mặt chưa vững chắc. Đây là đánh giá của văn kiện ở thời điểm 1996, không phải bản tổng kết toàn bộ thời kỳ Đổi mới đến hiện nay.

## Một số bài học được văn kiện nêu

Văn kiện nhấn mạnh giữ mục tiêu độc lập dân tộc và chủ nghĩa xã hội; kết hợp đổi mới kinh tế với đổi mới chính trị, lấy đổi mới kinh tế làm trọng tâm; mở rộng hợp tác quốc tế đi đôi với phát huy nguồn lực bên trong.

## Gợi ý đối chiếu

Khi học, phân biệt kết quả được đánh giá trong một thời kỳ, chủ trương tiếp theo và các mốc hội nhập sau đó. Gia nhập WTO hoặc CPTPP là những ví dụ để đối chiếu tiến trình, không tự chứng minh mọi kết quả kinh tế – xã hội.', 'draft' from public.curriculum_topics t where t.slug = 'cong-cuoc-doi-moi' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Opening context and paragraph Trong hoàn cảnh đó...28-6 đến 1-7-1996 — Congress interval/place and context.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'dai-hoi-dang-lan-thu-viii-1996' and workflow_status = 'draft' and title = 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng' and summary = 'Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.' and content = '## Mốc lịch sử

Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.

## Đọc đánh giá mười năm Đổi mới tại thời điểm 1996

Báo cáo Chính trị tại Đại hội VIII đánh giá Việt Nam đã ra khỏi khủng hoảng kinh tế – xã hội, đồng thời lưu ý một số mặt chưa vững chắc. Đây là đánh giá của văn kiện ở thời điểm 1996, không phải bản tổng kết toàn bộ thời kỳ Đổi mới đến hiện nay.

## Một số bài học được văn kiện nêu

Văn kiện nhấn mạnh giữ mục tiêu độc lập dân tộc và chủ nghĩa xã hội; kết hợp đổi mới kinh tế với đổi mới chính trị, lấy đổi mới kinh tế làm trọng tâm; mở rộng hợp tác quốc tế đi đôi với phát huy nguồn lực bên trong.

## Gợi ý đối chiếu

Khi học, phân biệt kết quả được đánh giá trong một thời kỳ, chủ trương tiếp theo và các mốc hội nhập sau đó. Gia nhập WTO hoặc CPTPP là những ví dụ để đối chiếu tiến trình, không tự chứng minh mọi kết quả kinh tế – xã hội.' and start_year = 1996 and end_year is not distinct from 1996 and start_date is not distinct from '1996-06-28'::date and end_date is not distinct from '1996-07-01'::date and date_precision = 'period' and date_text = '28/6–1/7/1996' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e cross join lateral (select id from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-viii/dai-hoi-dai-bieu-toan-quoc-lan-thu-viii-cua-dang-13' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Assessment after 10 years, paragraph Nước ta đã ra khỏi khủng hoảng...nhưng một số mặt còn chưa vững chắc; lessons 1, 2 and 5 — Attributed 1996 assessment and bounded lesson examples; not a current all-period statistical assessment.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'dai-hoi-dang-lan-thu-viii-1996' and workflow_status = 'draft' and title = 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng' and summary = 'Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.' and content = '## Mốc lịch sử

Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.

## Đọc đánh giá mười năm Đổi mới tại thời điểm 1996

Báo cáo Chính trị tại Đại hội VIII đánh giá Việt Nam đã ra khỏi khủng hoảng kinh tế – xã hội, đồng thời lưu ý một số mặt chưa vững chắc. Đây là đánh giá của văn kiện ở thời điểm 1996, không phải bản tổng kết toàn bộ thời kỳ Đổi mới đến hiện nay.

## Một số bài học được văn kiện nêu

Văn kiện nhấn mạnh giữ mục tiêu độc lập dân tộc và chủ nghĩa xã hội; kết hợp đổi mới kinh tế với đổi mới chính trị, lấy đổi mới kinh tế làm trọng tâm; mở rộng hợp tác quốc tế đi đôi với phát huy nguồn lực bên trong.

## Gợi ý đối chiếu

Khi học, phân biệt kết quả được đánh giá trong một thời kỳ, chủ trương tiếp theo và các mốc hội nhập sau đó. Gia nhập WTO hoặc CPTPP là những ví dụ để đối chiếu tiến trình, không tự chứng minh mọi kết quả kinh tế – xã hội.' and start_year = 1996 and end_year is not distinct from 1996 and start_date is not distinct from '1996-06-28'::date and end_date is not distinct from '1996-07-01'::date and date_precision = 'period' and date_text = '28/6–1/7/1996' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e cross join lateral (select id from public.sources where url = 'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-viii/bao-cao-chinh-tri-cua-ban-chap-hanh-trung-uong-dang-khoa-vii-tai-dai-hoi-dai-bieu-toan-quoc-lan-thu-viii-cua-dang-1549?categoryId=104000022' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '10-khai-quat-ve-cong-cuoc-doi-moi', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'dai-hoi-dang-lan-thu-viii-1996' and workflow_status = 'draft' and title = 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng' and summary = 'Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.' and content = '## Mốc lịch sử

Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.

## Đọc đánh giá mười năm Đổi mới tại thời điểm 1996

Báo cáo Chính trị tại Đại hội VIII đánh giá Việt Nam đã ra khỏi khủng hoảng kinh tế – xã hội, đồng thời lưu ý một số mặt chưa vững chắc. Đây là đánh giá của văn kiện ở thời điểm 1996, không phải bản tổng kết toàn bộ thời kỳ Đổi mới đến hiện nay.

## Một số bài học được văn kiện nêu

Văn kiện nhấn mạnh giữ mục tiêu độc lập dân tộc và chủ nghĩa xã hội; kết hợp đổi mới kinh tế với đổi mới chính trị, lấy đổi mới kinh tế làm trọng tâm; mở rộng hợp tác quốc tế đi đôi với phát huy nguồn lực bên trong.

## Gợi ý đối chiếu

Khi học, phân biệt kết quả được đánh giá trong một thời kỳ, chủ trương tiếp theo và các mốc hội nhập sau đó. Gia nhập WTO hoặc CPTPP là những ví dụ để đối chiếu tiến trình, không tự chứng minh mọi kết quả kinh tế – xã hội.' and start_year = 1996 and end_year is not distinct from 1996 and start_date is not distinct from '1996-06-28'::date and end_date is not distinct from '1996-07-01'::date and date_precision = 'period' and date_text = '28/6–1/7/1996' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '11-thanh-tuu-va-bai-hoc-cua-cong-cuoc-doi-moi', 'muc-1', e.id, 1 from (select id from public.historical_events where slug = 'dai-hoi-dang-lan-thu-viii-1996' and workflow_status = 'draft' and title = 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng' and summary = 'Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.' and content = '## Mốc lịch sử

Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.

## Đọc đánh giá mười năm Đổi mới tại thời điểm 1996

Báo cáo Chính trị tại Đại hội VIII đánh giá Việt Nam đã ra khỏi khủng hoảng kinh tế – xã hội, đồng thời lưu ý một số mặt chưa vững chắc. Đây là đánh giá của văn kiện ở thời điểm 1996, không phải bản tổng kết toàn bộ thời kỳ Đổi mới đến hiện nay.

## Một số bài học được văn kiện nêu

Văn kiện nhấn mạnh giữ mục tiêu độc lập dân tộc và chủ nghĩa xã hội; kết hợp đổi mới kinh tế với đổi mới chính trị, lấy đổi mới kinh tế làm trọng tâm; mở rộng hợp tác quốc tế đi đôi với phát huy nguồn lực bên trong.

## Gợi ý đối chiếu

Khi học, phân biệt kết quả được đánh giá trong một thời kỳ, chủ trương tiếp theo và các mốc hội nhập sau đó. Gia nhập WTO hoặc CPTPP là những ví dụ để đối chiếu tiến trình, không tự chứng minh mọi kết quả kinh tế – xã hội.' and start_year = 1996 and end_year is not distinct from 1996 and start_date is not distinct from '1996-06-28'::date and end_date is not distinct from '1996-07-01'::date and date_precision = 'period' and date_text = '28/6–1/7/1996' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '11-thanh-tuu-va-bai-hoc-cua-cong-cuoc-doi-moi', 'muc-2', e.id, 2 from (select id from public.historical_events where slug = 'dai-hoi-dang-lan-thu-viii-1996' and workflow_status = 'draft' and title = 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng' and summary = 'Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.' and content = '## Mốc lịch sử

Đại hội VIII diễn ra từ ngày 28/6 đến ngày 1/7/1996 tại Hà Nội, đánh giá mười năm Đổi mới và đề ra nhiệm vụ đẩy mạnh công nghiệp hóa, hiện đại hóa.

## Đọc đánh giá mười năm Đổi mới tại thời điểm 1996

Báo cáo Chính trị tại Đại hội VIII đánh giá Việt Nam đã ra khỏi khủng hoảng kinh tế – xã hội, đồng thời lưu ý một số mặt chưa vững chắc. Đây là đánh giá của văn kiện ở thời điểm 1996, không phải bản tổng kết toàn bộ thời kỳ Đổi mới đến hiện nay.

## Một số bài học được văn kiện nêu

Văn kiện nhấn mạnh giữ mục tiêu độc lập dân tộc và chủ nghĩa xã hội; kết hợp đổi mới kinh tế với đổi mới chính trị, lấy đổi mới kinh tế làm trọng tâm; mở rộng hợp tác quốc tế đi đôi với phát huy nguồn lực bên trong.

## Gợi ý đối chiếu

Khi học, phân biệt kết quả được đánh giá trong một thời kỳ, chủ trương tiếp theo và các mốc hội nhập sau đó. Gia nhập WTO hoặc CPTPP là những ví dụ để đối chiếu tiến trình, không tự chứng minh mọi kết quả kinh tế – xã hội.' and start_year = 1996 and end_year is not distinct from 1996 and start_date is not distinct from '1996-06-28'::date and end_date is not distinct from '1996-07-01'::date and date_precision = 'period' and date_text = '28/6–1/7/1996' and topic_id = (select id from public.curriculum_topics where slug = 'cong-cuoc-doi-moi')) e on conflict (lesson_slug,section_id,event_id) do nothing;


-- cptpp-co-hieu-luc-voi-viet-nam-2019
insert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)
select t.id, 'CPTPP có hiệu lực đối với Việt Nam', 'cptpp-co-hieu-luc-voi-viet-nam-2019', 2019, 2019, '2019-01-14', '2019-01-14', '14/1/2019', 'exact', 'Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP) có hiệu lực đối với Việt Nam từ ngày 14/1/2019.', '## Mốc hội nhập sau năm 2007

CPTPP có hiệu lực đối với Việt Nam từ ngày 14/1/2019. Thông tin Bộ Công Thương công bố ngày 11/1/2019 phân biệt mốc có hiệu lực với ngày Quốc hội phê chuẩn hiệp định là 12/11/2018.

## Cách đọc mốc

Đây là mốc của quá trình hội nhập quốc tế, được gắn ở mức chủ đề với bài Đổi mới và đối ngoại từ sau 1986. Nó không phải ngày một trận đánh, một chuyến đi hay tác động kinh tế xảy ra tại duy nhất một địa điểm; vì vậy không gán tọa độ. Sự có hiệu lực của hiệp định không tự chứng minh mọi kết quả thương mại sau đó.', 'draft' from public.curriculum_topics t where t.slug = 'doi-ngoai-viet-nam' on conflict (slug) do nothing;

insert into public.event_sources (event_id,source_id,source_note,confidence_note)
select e.id, s.id, 'Title; paragraph Đối với Việt Nam, Quốc hội đã thông qua...12 tháng 11 năm 2018...14 tháng 01 năm 2019 — Entry-into-force and distinct ratification date only; not trade impact statistics or exact textbook placement.', 'Bounded source review; not human publication approval.' from (select id from public.historical_events where slug = 'cptpp-co-hieu-luc-voi-viet-nam-2019' and workflow_status = 'draft' and title = 'CPTPP có hiệu lực đối với Việt Nam' and summary = 'Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP) có hiệu lực đối với Việt Nam từ ngày 14/1/2019.' and content = '## Mốc hội nhập sau năm 2007

CPTPP có hiệu lực đối với Việt Nam từ ngày 14/1/2019. Thông tin Bộ Công Thương công bố ngày 11/1/2019 phân biệt mốc có hiệu lực với ngày Quốc hội phê chuẩn hiệp định là 12/11/2018.

## Cách đọc mốc

Đây là mốc của quá trình hội nhập quốc tế, được gắn ở mức chủ đề với bài Đổi mới và đối ngoại từ sau 1986. Nó không phải ngày một trận đánh, một chuyến đi hay tác động kinh tế xảy ra tại duy nhất một địa điểm; vì vậy không gán tọa độ. Sự có hiệu lực của hiệp định không tự chứng minh mọi kết quả thương mại sau đó.' and start_year = 2019 and end_year is not distinct from 2019 and start_date is not distinct from '2019-01-14'::date and end_date is not distinct from '2019-01-14'::date and date_precision = 'exact' and date_text = '14/1/2019' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join lateral (select id from public.sources where url = 'https://moit.gov.vn/tin-tuc/thi-truong-nuoc-ngoai/hiep-dinh-cptpp-chinh-thuc-co-hieu-luc-doi-voi-viet-nam-tu-n.html' order by id limit 1) s on conflict (event_id,source_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '14-doi-ngoai-tu-nam-1975-den-nay', 'muc-2', e.id, 0 from (select id from public.historical_events where slug = 'cptpp-co-hieu-luc-voi-viet-nam-2019' and workflow_status = 'draft' and title = 'CPTPP có hiệu lực đối với Việt Nam' and summary = 'Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP) có hiệu lực đối với Việt Nam từ ngày 14/1/2019.' and content = '## Mốc hội nhập sau năm 2007

CPTPP có hiệu lực đối với Việt Nam từ ngày 14/1/2019. Thông tin Bộ Công Thương công bố ngày 11/1/2019 phân biệt mốc có hiệu lực với ngày Quốc hội phê chuẩn hiệp định là 12/11/2018.

## Cách đọc mốc

Đây là mốc của quá trình hội nhập quốc tế, được gắn ở mức chủ đề với bài Đổi mới và đối ngoại từ sau 1986. Nó không phải ngày một trận đánh, một chuyến đi hay tác động kinh tế xảy ra tại duy nhất một địa điểm; vì vậy không gán tọa độ. Sự có hiệu lực của hiệp định không tự chứng minh mọi kết quả thương mại sau đó.' and start_year = 2019 and end_year is not distinct from 2019 and start_date is not distinct from '2019-01-14'::date and end_date is not distinct from '2019-01-14'::date and date_precision = 'exact' and date_text = '14/1/2019' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)
select '10-khai-quat-ve-cong-cuoc-doi-moi', 'muc-3', e.id, 1 from (select id from public.historical_events where slug = 'cptpp-co-hieu-luc-voi-viet-nam-2019' and workflow_status = 'draft' and title = 'CPTPP có hiệu lực đối với Việt Nam' and summary = 'Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP) có hiệu lực đối với Việt Nam từ ngày 14/1/2019.' and content = '## Mốc hội nhập sau năm 2007

CPTPP có hiệu lực đối với Việt Nam từ ngày 14/1/2019. Thông tin Bộ Công Thương công bố ngày 11/1/2019 phân biệt mốc có hiệu lực với ngày Quốc hội phê chuẩn hiệp định là 12/11/2018.

## Cách đọc mốc

Đây là mốc của quá trình hội nhập quốc tế, được gắn ở mức chủ đề với bài Đổi mới và đối ngoại từ sau 1986. Nó không phải ngày một trận đánh, một chuyến đi hay tác động kinh tế xảy ra tại duy nhất một địa điểm; vì vậy không gán tọa độ. Sự có hiệu lực của hiệp định không tự chứng minh mọi kết quả thương mại sau đó.' and start_year = 2019 and end_year is not distinct from 2019 and start_date is not distinct from '2019-01-14'::date and end_date is not distinct from '2019-01-14'::date and date_precision = 'exact' and date_text = '14/1/2019' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e on conflict (lesson_slug,section_id,event_id) do nothing;

insert into public.event_topics (event_id,topic_id)
select e.id,t.id from (select id from public.historical_events where slug = 'cptpp-co-hieu-luc-voi-viet-nam-2019' and workflow_status = 'draft' and title = 'CPTPP có hiệu lực đối với Việt Nam' and summary = 'Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP) có hiệu lực đối với Việt Nam từ ngày 14/1/2019.' and content = '## Mốc hội nhập sau năm 2007

CPTPP có hiệu lực đối với Việt Nam từ ngày 14/1/2019. Thông tin Bộ Công Thương công bố ngày 11/1/2019 phân biệt mốc có hiệu lực với ngày Quốc hội phê chuẩn hiệp định là 12/11/2018.

## Cách đọc mốc

Đây là mốc của quá trình hội nhập quốc tế, được gắn ở mức chủ đề với bài Đổi mới và đối ngoại từ sau 1986. Nó không phải ngày một trận đánh, một chuyến đi hay tác động kinh tế xảy ra tại duy nhất một địa điểm; vì vậy không gán tọa độ. Sự có hiệu lực của hiệp định không tự chứng minh mọi kết quả thương mại sau đó.' and start_year = 2019 and end_year is not distinct from 2019 and start_date is not distinct from '2019-01-14'::date and end_date is not distinct from '2019-01-14'::date and date_precision = 'exact' and date_text = '14/1/2019' and topic_id = (select id from public.curriculum_topics where slug = 'doi-ngoai-viet-nam')) e cross join public.curriculum_topics t where t.slug = 'cong-cuoc-doi-moi' on conflict (event_id,topic_id) do nothing;

commit;

-- Inspect inserted/skipped counts before review. No workflow transition to published is included.
