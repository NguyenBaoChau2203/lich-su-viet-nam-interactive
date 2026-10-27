-- Heritage Sites release (HS-1.0) — Mode: publish
-- Package: supabase/content/heritage-sites/v1
-- Sites: 64 accepted (62 new, 2 enrolled)
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';
SET LOCAL TIME ZONE 'UTC';
SET standard_conforming_strings = on;
SELECT pg_advisory_xact_lock(18012, 3402);
SET CONSTRAINTS ALL DEFERRED;

-- Preflight assertions: verify enrolled sites exist with expected properties
DO $preflight$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.historical_locations
    WHERE slug = 'dinh-doc-lap'
      AND workflow_status = 'published'
  ) THEN
    RAISE EXCEPTION 'PREFLIGHT_FAIL: enrolled location % missing or wrong status', 'dinh-doc-lap';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.historical_locations
    WHERE slug = 'pac-bo-cao-bang'
      AND workflow_status = 'published'
  ) THEN
    RAISE EXCEPTION 'PREFLIGHT_FAIL: enrolled location % missing or wrong status', 'pac-bo-cao-bang';
  END IF;
END $preflight$;

-- Deduplicated sources
CREATE TEMP TABLE hs_sources_temp (
  source_key text PRIMARY KEY,
  source_id uuid NOT NULL
) ON COMMIT DROP;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'OpenStreetMap Geographic Data', 'OpenStreetMap Contributors', 'OpenStreetMap Foundation', 'https://www.openstreetmap.org', 'web', 'OpenStreetMap contributors (2026). OpenStreetMap database.', 2026, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://www.openstreetmap.org');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-osm', id FROM public.sources WHERE url = 'https://www.openstreetmap.org' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Sách giáo khoa Lịch sử 12 (Kết nối tri thức với cuộc sống)', 'Vũ Minh Giang, Nghiêm Đình Vì (đồng Tổng Chủ biên) cùng tập thể tác giả', 'Nhà xuất bản Giáo dục Việt Nam', 'https://nxbgd.vn', 'book', 'Bộ Giáo dục và Đào tạo (2024). Lịch sử 12 – Bộ Kết nối tri thức với cuộc sống. NXB Giáo dục Việt Nam.', 2024, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://nxbgd.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-sgk-su-12', id FROM public.sources WHERE url = 'https://nxbgd.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Nhà tù Hỏa Lò', 'Cục Di sản văn hóa', 'Bộ Văn hóa, Thể thao và Du lịch', 'http://dsvh.gov.vn', 'official', 'Cục Di sản văn hóa. Di tích lịch sử Nhà tù Hỏa Lò (Hà Nội), Quyết định số 1543-QĐ/VH ngày 18/6/1997.', 1997, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nha-tu-hoa-lo', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu trung tâm Hoàng thành Thăng Long', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2009). Quyết định số 1272/QĐ-TTg ngày 12/8/2009.', 2009, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-hoang-thanh-thang-long', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Pác Bó', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-pac-bo', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm lưu niệm thành lập Đội VNTTGPQ', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-rung-tran-hung-dao', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Tân Trào', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-tan-trao', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử danh thắng Cột cờ Lũng Cú', 'Sở Văn hóa, Thể thao và Du lịch Hà Giang', 'UBND tỉnh Hà Giang', 'https://hagiang.gov.vn', 'official', 'UBND tỉnh Hà Giang. Hồ sơ Di tích danh thắng Quốc gia Cột cờ Lũng Cú.', 2010, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://hagiang.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-cot-co-lung-cu', id FROM public.sources WHERE url = 'https://hagiang.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Chiến trường Điện Biên Phủ', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2009). Quyết định số 1272/QĐ-TTg ngày 12/8/2009 xếp hạng Chiến trường Điện Biên Phủ (Cứ điểm Đồi A1).', 2009, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-doi-a1', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích Hầm Sở chỉ huy Tập đoàn cứ điểm Điện Biên Phủ', 'Ban Quản lý Di tích tỉnh Điện Biên', 'Sở VHTTDL tỉnh Điện Biên', 'https://dienbien.gov.vn', 'official', 'Ban Quản lý Di tích tỉnh Điện Biên. Hồ sơ Di tích Hầm De Castries, Chiến trường Điện Biên Phủ.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://dienbien.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-ham-de-castries', id FROM public.sources WHERE url = 'https://dienbien.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Chiến thắng giải phóng Lai Châu năm 1953 trong Chiến cuộc Đông - Xuân 1953-1954', 'Viện Lịch sử Quân sự', 'Báo Quân đội nhân dân', 'https://www.qdnd.vn', 'article', 'Viện Lịch sử Quân sự. Chiến thắng giải phóng Lai Châu ngày 12/12/1953 và ý nghĩa chiến lược trong Đông - Xuân 1953-1954.', 2023, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://www.qdnd.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-qdnd-lai-chau-1953', id FROM public.sources WHERE url = 'https://www.qdnd.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Nhà tù Sơn La', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2014). Quyết định số 2408/QĐ-TTg ngày 31/12/2014.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nha-tu-son-la', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Khu lăng mộ và Tượng đài Nguyễn Thái Học cùng các nghĩa sĩ Khởi nghĩa Yên Bái', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Quyết định số 135/QĐ-BT ngày 27/9/1990 công nhận Di tích lịch sử quốc gia Khởi nghĩa Yên Bái.', 1990, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-khoi-nghia-yen-bai', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt An toàn khu (ATK) Định Hóa', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-atk-dinh-hoa', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt An toàn khu (ATK) Chợ Đồn', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2016). Quyết định số 2499/QĐ-TTg ngày 22/12/2016.', 2016, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-atk-cho-don', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm Khởi nghĩa Bắc Sơn', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2016). Quyết định số 2499/QĐ-TTg ngày 22/12/2016.', 2016, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-khoi-nghia-bac-son', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Chi Lăng', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2019). Quyết định số 1959/QĐ-TTg ngày 31/12/2019.', 2019, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-ai-chi-lang', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Địa điểm Bác Hồ về thăm Mỏ than Đèo Nai', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa, Thể thao và Du lịch. Quyết định số 406/QĐ-BVHTTDL ngày 28/01/2004.', 2004, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-mo-than-deo-nai', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Bạch Đằng', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 1419/QĐ-TTg ngày 27/9/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-bach-dang', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt An toàn khu (ATK) II Hiệp Hòa', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2020). Quyết định số 2280/QĐ-TTg ngày 31/12/2020.', 2020, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-atk-ii-hiep-hoa', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Những địa điểm Khởi nghĩa Yên Thế', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-khoi-nghia-yen-the', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Tượng đài Chiến thắng Sông Lô – Đoan Hùng', 'Bộ Văn hóa', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa. Quyết định số 1288-VH/QĐ ngày 16/11/1987 công nhận Di tích lịch sử cấp quốc gia Tượng đài Chiến thắng Sông Lô Núi Đồn.', 1987, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-chien-thang-song-lo', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Đền Hùng', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2009). Quyết định số 1272/QĐ-TTg ngày 12/8/2009.', 2009, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-den-hung', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích quốc gia Bến K15 Đồ Sơn – Điểm xuất phát Đường Hồ Chí Minh trên biển', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa, Thể thao và Du lịch. Quyết định số 3463/QĐ-BVHTTDL ngày 18/8/2008.', 2008, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-ben-k15-do-son', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Quần thể di tích Côn Sơn – Kiếp Bạc', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-con-son-kiep-bac', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Đình Nho Lâm và Khu lưu niệm Tiếng trống Tiền Hải 1930', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Di tích lịch sử Địa điểm ghi dấu phong trào đấu tranh biểu tình nông dân Tiền Hải ngày 14/10/1930.', 1989, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-tieng-trong-tien-hai', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích Phố Hiến', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2014). Quyết định số 2408/QĐ-TTg ngày 31/12/2014.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-pho-hien', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Nhà máy Dệt Nam Định', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Cục Di sản văn hóa. Di tích lịch sử văn hóa cấp quốc gia Nhà máy Dệt Nam Định (Bảo tàng Dệt May Việt Nam).', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nha-may-det-nam-dinh', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Cố đô Hoa Lư', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-co-do-hoa-lu', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử văn hóa Cầu Hàm Rồng', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin (1975). Quyết định xếp hạng Di tích lịch sử văn hóa cấp quốc gia Cầu Hàm Rồng.', 1975, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-cau-ham-rong', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Thành nhà Hồ', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 1419/QĐ-TTg ngày 27/9/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-thanh-nha-ho', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Kim Liên', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-kim-lien', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử quốc gia Truông Bồn', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa, Thể thao và Du lịch. Quyết định số 51/QĐ-BVHTTDL ngày 12/01/2010.', 2010, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-truong-bon', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Ngã ba Đồng Lộc', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nga-ba-dong-loc', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Thành cổ Quảng Trị và những địa điểm lưu niệm sự kiện 81 ngày đêm năm 1972', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-thanh-co-quang-tri', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Đôi bờ Hiền Lương – Bến Hải', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-hien-luong-ben-hai', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di sản Thế giới Quần thể Di tích Cố đô Huế (Khu vực Cửa Ngọ Môn)', 'Trung tâm Bảo tồn Di tích Cố đô Huế', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Trung tâm Bảo tồn Di tích Cố đô Huế. Hồ sơ Di tích Cửa Ngọ Môn và sự kiện vua Bảo Đại thoái vị ngày 30/8/1945.', 1993, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-ngo-mon-hue', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Sự kiện Mặt trận Thừa Thiên Huế trong cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968', 'Bảo tàng Lịch sử Thừa Thiên Huế', 'Sở VHTT tỉnh Thừa Thiên Huế', 'https://baotanglichsu.thuathienhue.gov.vn', 'article', 'Bảo tàng Lịch sử Thừa Thiên Huế. 26 ngày đêm làm chủ thành phố Huế trong Tết Mậu Thân 1968.', 2018, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://baotanglichsu.thuathienhue.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-kinh-thanh-hue-1968', id FROM public.sources WHERE url = 'https://baotanglichsu.thuathienhue.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Tượng đài Chiến thắng Núi Thành', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Quyết định xếp hạng Di tích lịch sử quốc gia Chiến thắng Núi Thành 1965.', 1979, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-chien-thang-nui-thanh', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu đền tháp Mỹ Sơn', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-my-son', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm thảm sát Sơn Mỹ', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2014). Quyết định số 2408/QĐ-TTg ngày 31/12/2014.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-son-my', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Đắk Tô – Tân Cảnh', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2020). Quyết định số 2280/QĐ-TTg ngày 31/12/2020.', 2020, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-dak-to-tan-canh', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Làng kháng chiến Stơr', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa, Thể thao và Du lịch. Quyết định số 62/QĐ-BVHTTDL ngày 18/3/2011.', 2011, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-lang-khang-chien-stor', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Đền thờ Tây Sơn Tam Kiệt / Bảo tàng Quang Trung', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2014). Quyết định số 2408/QĐ-TTg ngày 31/12/2014.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-bao-tang-quang-trung', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Địa điểm Phi đội Quyết thắng xuất kích tại Sân bay Thành Sơn', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Quyết định xếp hạng Di tích lịch sử cấp quốc gia Sân bay Thành Sơn (Ninh Thuận).', 1999, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-san-bay-thanh-son', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích quốc gia đặc biệt Tháp Bà Ponagar Nha Trang', 'Cục Di sản văn hóa', 'Bộ Văn hóa, Thể thao và Du lịch', 'http://dsvh.gov.vn', 'official', 'Cục Di sản văn hóa. Hồ sơ Di tích kiến trúc nghệ thuật Tháp Bà Ponagar.', 2001, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-thap-ba-ponagar', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Nhà đày Buôn Ma Thuột', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2019). Quyết định số 1959/QĐ-TTg ngày 31/12/2019.', 2019, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-buon-ma-thuot', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm Tàu Không số Vịnh Vũng Rô', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2014). Quyết định số 2408/QĐ-TTg ngày 31/12/2014.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-vung-ro', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Trường Dục Thanh', 'Bộ Văn hóa', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa. Quyết định số 234/QĐ-BT ngày 12/12/1986 công nhận Di tích lịch sử quốc gia Trường Dục Thanh Phan Thiết.', 1986, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-truong-duc-thanh', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Nhà lao Thiếu nhi Đà Lạt', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa, Thể thao và Du lịch. Quyết định số 275/QĐ-BVHTTDL ngày 22/01/2009.', 2009, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nha-lao-thieu-nhi-da-lat', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Tượng đài Chiến thắng Xuân Lộc 1975', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Di tích lịch sử Tượng đài Chiến thắng Xuân Lộc (Đồng Nai).', 1988, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-chien-thang-xuan-loc', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Căn cứ Bộ Chỉ huy Miền Tà Thiết', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-can-cu-ta-thiet', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Di tích lịch sử Dinh Độc Lập', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2009). Quyết định số 1272/QĐ-TTg ngày 12/8/2009.', 2009, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-dinh-doc-lap', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa đạo Củ Chi', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-dia-dao-cu-chi', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Căn cứ Trung ương Cục miền Nam', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-trung-uong-cuc-mien-nam', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Ngã tư Đức Hòa', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Quyết định xếp hạng Di tích lịch sử cấp quốc gia Ngã tư Đức Hòa (Long An).', 1989, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nga-tu-duc-hoa', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Ấp Bắc', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2020). Quyết định số 2280/QĐ-TTg ngày 31/12/2020.', 2020, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-chien-thang-ap-bac', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Khu di tích Cụ Phó bảng Nguyễn Sinh Sắc', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Quyết định xếp hạng Di tích lịch sử quốc gia Mộ Cụ Phó bảng Nguyễn Sinh Sắc (Đồng Tháp).', 1992, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-mo-nguyen-sinh-sac', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Di tích lịch sử Đồng Khởi Bến Tre', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2016). Quyết định số 2499/QĐ-TTg ngày 22/12/2016.', 2016, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-dong-khoi-ben-tre', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Khu tưởng niệm Thủ tướng Chính phủ Võ Văn Kiệt', 'Sở Văn hóa, Thể thao và Du lịch Vĩnh Long', 'UBND tỉnh Vĩnh Long', 'https://vinhlong.gov.vn', 'official', 'UBND tỉnh Vĩnh Long. Hồ sơ Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt tại huyện Vũng Liêm.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'https://vinhlong.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-vo-van-kiet', id FROM public.sources WHERE url = 'https://vinhlong.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Trại giam Tù binh Chiến tranh Phú Quốc', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2014). Quyết định số 2408/QĐ-TTg ngày 31/12/2014.', 2014, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-nha-tu-phu-quoc', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Khu lưu niệm Chủ tịch Tôn Đức Thắng', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2012). Quyết định số 548/QĐ-TTg ngày 10/5/2012.', 2012, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-ton-duc-thang', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Quyết định xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng 75 lượt tiểu đoàn địch của quân và dân khu 9', 'Thủ tướng Chính phủ', 'Cổng Thông tin điện tử Chính phủ', 'http://vanban.chinhphu.vn', 'official', 'Thủ tướng Chính phủ (2013). Quyết định số 2383/QĐ-TTg ngày 09/12/2013.', 2013, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://vanban.chinhphu.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-chien-thang-chuong-thien', id FROM public.sources WHERE url = 'http://vanban.chinhphu.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Khám Lớn Cần Thơ', 'Bộ Văn hóa - Thông tin', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa - Thông tin. Quyết định xếp hạng Di tích lịch sử cấp quốc gia Khám Lớn Cần Thơ.', 1996, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-kham-lon-can-tho', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Khởi nghĩa Hòn Khoai 1940', 'Bộ Văn hóa', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa. Quyết định số 839/QĐ-BT ngày 27/4/1990 công nhận Di tích lịch sử quốc gia Khởi nghĩa Hòn Khoai.', 1990, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-khoi-nghia-hon-khoai', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)
SELECT 'Hồ sơ Di tích lịch sử Bến Vàm Lũng – Điểm cuối Đường Hồ Chí Minh trên biển', 'Bộ Văn hóa, Thể thao và Du lịch', 'Cục Di sản văn hóa', 'http://dsvh.gov.vn', 'official', 'Bộ Văn hóa, Thể thao và Du lịch. Quyết định số 2377/QĐ-BVHTTDL ngày 10/11/2010.', 2010, '2026-10-27'
WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE url = 'http://dsvh.gov.vn');

INSERT INTO hs_sources_temp (source_key, source_id)
SELECT 'src-dsvh-ben-vam-lung', id FROM public.sources WHERE url = 'http://dsvh.gov.vn' LIMIT 1;

-- Insert new historical locations
INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nha-tu-hoa-lo', 'Nhà tù Hỏa Lò', 'Nhà tù Hỏa Lò (Maison Centrale)', 'Nhà tù Hỏa Lò được thực dân Pháp xây dựng năm 1896 tại trung tâm Hà Nội. Nơi đây từng giam giữ các chiến sĩ cộng sản tiêu biểu và sau này tạm giữ phi công Mỹ bị bắn rơi ở miền Bắc.', 21.0253, 105.8466,
  'exact', 'Tọa độ Di tích lịch sử Nhà tù Hỏa Lò, số 1 phố Hỏa Lò, phường Trần Hưng Đạo, quận Hoàn Kiếm, Hà Nội theo OpenStreetMap.', 'published', '01',
  'grade12', 1, '1896 – 1973', 'Nơi thực dân Pháp giam giữ hàng ngàn chiến sĩ cách mạng kiên trung thời kỳ 1930–1954 và là nơi tạm giữ phi công Mỹ trong chiến tranh phá hoại miền Bắc (1964–1973).', 'dien-bien-phu-tren-khong-1972'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'hoang-thanh-thang-long', 'Khu trung tâm Hoàng thành Thăng Long', 'Kinh đô Thăng Long', 'Khu trung tâm Hoàng thành Thăng Long minh chứng cho sự giao thoa văn hóa và bề dày lịch sử ngàn năm văn hiến của Thăng Long – Hà Nội.', 21.0347, 105.8408,
  'exact', 'Tọa độ cổng Đoan Môn, Khu di tích Hoàng thành Thăng Long, 19C Hoàng Diệu, Hà Nội theo OpenStreetMap.', 'published', '01',
  'extended', 2, 'Thế kỷ XI – XVIII', 'Trung tâm quyền lực chính trị nghìn năm của nước Đại Việt từ thời Lý, Trần, Lê đến thời Nguyễn và giai đoạn lịch sử hiện đại; Di sản Văn hóa Thế giới.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'rung-tran-hung-dao', 'Khu di tích Rừng Trần Hưng Đạo', 'Khu rừng Sam Cao', 'Khu di tích Rừng Trần Hưng Đạo nằm dưới chân núi Slam Cao thuộc xã Tam Kim và Hoa Thám, huyện Nguyên Bình, nơi khai sinh Quân đội nhân dân Việt Nam anh hùng.', 22.5936, 105.9725,
  'exact', 'Tọa độ bia kỷ niệm thành lập Đội VNTTGPQ trong rừng Trần Hưng Đạo theo OpenStreetMap.', 'published', '04',
  'extended', 2, '22/12/1944', 'Nơi thành lập Đội Việt Nam Tuyên truyền Giải phóng quân ngày 22/12/1944 gồm 34 chiến sĩ dưới sự chỉ huy của đồng chí Võ Nguyên Giáp.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-di-tich-tan-trao', 'Khu di tích Quốc gia đặc biệt Tân Trào', 'Thủ đô Khu Giải phóng Tân Trào', 'Khu di tích Quốc gia đặc biệt Tân Trào gồm lán Nà Nưa, đình Tân Trào, cây đa Tân Trào – nơi diễn ra Quốc dân Đại hội Tân Trào tháng 8/1945 quyết định vận mệnh dân tộc.', 21.7583, 105.4833,
  'exact', 'Tọa độ cụm di tích Đình Tân Trào và Lán Nà Nưa, huyện Sơn Dương, Tuyên Quang theo OpenStreetMap.', 'published', '08',
  'grade12', 1, '5/1945 – 1954', 'Thủ đô Khu giải phóng trong Cách mạng Tháng Tám 1945 và Thủ đô kháng chiến chống thực dân Pháp, nơi Trung ương Đảng và Bác Hồ phát lệnh Tổng khởi nghĩa.', 'cach-mang-thang-tam-1945'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'cot-co-lung-cu', 'Cột cờ Lũng Cú', 'Đỉnh núi Rồng (Long Sơn)', 'Cột cờ Lũng Cú tọa lạc tại xã Lũng Cú, huyện Đồng Văn (Hà Giang cũ, nay thuộc Tuyên Quang), là biểu tượng chủ quyền thiêng liêng nơi địa đầu cực Bắc Việt Nam.', 23.3601, 105.3191,
  'exact', 'Tọa độ đỉnh Cột cờ Lũng Cú trên núi Long Sơn theo OpenStreetMap.', 'published', '08',
  'extended', 2, '1978 – nay', 'Cột cờ quốc gia trên đỉnh núi Rồng ở điểm cực Bắc Tổ quốc với lá cờ đỏ sao vàng rộng 54 m² tượng trưng cho 54 dân tộc anh em.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'doi-a1-dien-bien-phu', 'Cứ điểm Đồi A1 – Điện Biên Phủ', 'Cứ điểm Eliane 2', 'Đồi A1 (Eliane 2) là trận đánh ác liệt và kéo dài nhất trong Chiến dịch Điện Biên Phủ năm 1954. Chiến thắng Đồi A1 đã bẻ gãy tuyến phòng thủ cuối cùng của tập đoàn cứ điểm.', 21.3831, 103.0189,
  'exact', 'Tọa độ đỉnh đồi A1 và hố bộc phá 960kg, phường Mường Thanh, TP. Điện Biên Phủ theo OpenStreetMap.', 'published', '11',
  'grade12', 1, '30/3 – 7/5/1954', 'Cứ điểm kiên cố nhất bảo vệ trung tâm Mường Thanh, nơi diễn ra cuộc giao tranh ác liệt 39 ngày đêm trước khi khối bộc phá 960 kg nổ mở đường giải phóng.', 'chien-dich-dien-bien-phu'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'ham-de-castries', 'Hầm Chỉ huy Tướng De Castries', 'PC GONO Mường Thanh', 'Hầm De Castries nằm ở trung tâm cánh đồng Mường Thanh, được che chắn bằng vòm sắt và bao cát dày đặc, là điểm kết thúc hoàn toàn Chiến dịch Điện Biên Phủ lịch sử.', 21.3854, 103.0078,
  'exact', 'Tọa độ công trình hầm chỉ huy De Castries tại trung tâm cánh đồng Mường Thanh theo OpenStreetMap.', 'published', '11',
  'extended', 2, '7/5/1954', 'Sở chỉ huy đầu não của tập đoàn cứ điểm Pháp tại Điện Biên Phủ, nơi tổ xung kích của ta bắt sống tướng De Castries vào chiều ngày 7/5/1954.', 'chien-dich-dien-bien-phu'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'chien-thang-lai-chau-1953', 'Địa điểm Chiến thắng Giải phóng Lai Châu 1953', 'Thị xã Lai Châu cũ (Mường Lay)', 'Thực hiện quyết định phân tán lực lượng địch của Trung ương Đảng trong Đông - Xuân 1953-1954, quân ta tiến công giải phóng thị xã Lai Châu và toàn bộ vùng phụ cận.', 22.0543, 103.1558,
  'approximate', 'Tọa độ khu vực trung tâm thị xã Lai Châu lịch sử năm 1953 (nay thuộc thị xã Mường Lay) theo OpenStreetMap.', 'published', '12',
  'grade12', 1, '12/12/1953', 'Địa bàn ghi dấu chiến thắng giải phóng thị xã Lai Châu ngày 12/12/1953 trong Chiến cuộc Đông – Xuân 1953–1954, buộc quân Pháp phải co cụm về Điện Biên Phủ.', 'chien-dich-dien-bien-phu'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nha-tu-son-la', 'Di tích Quốc gia đặc biệt Nhà tù Sơn La', 'Nhà ngục Sơn La', 'Nhà tù Sơn La nằm trên đồi Khau Cả, được thực dân Pháp xây dựng năm 1908 để giam giữ các chiến sĩ cách mạng Việt Nam, gắn liền với tên tuổi đồng chí Tô Hiệu.', 21.3278, 103.9135,
  'exact', 'Tọa độ Di tích Nhà tù Sơn La trên đỉnh đồi Khau Cả, TP. Sơn La theo OpenStreetMap.', 'published', '14',
  'grade12', 1, '1908 – 1945', 'Nơi thực dân Pháp đày ải và giam cầm các chiến sĩ cộng sản kiên trung; biểu tượng Cây đào Tô Hiệu thắp sáng tinh thần biến nhà tù đế quốc thành trường học cách mạng.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khoi-nghia-yen-bai-1930', 'Khu tưởng niệm Khởi nghĩa Yên Bái 1930', 'Pháp trường Khởi nghĩa Yên Bái', 'Khu tưởng niệm Khởi nghĩa Yên Bái nằm tại công viên Yên Hòa, thành phố Yên Bái (Yên Bái cũ, nay thuộc Lào Cai), nơi yên nghỉ của Nguyễn Thái Học và các nghĩa sĩ năm 1930.', 21.7167, 104.9083,
  'exact', 'Tọa độ Khu lăng mộ Nguyễn Thái Học và các nghĩa sĩ Khởi nghĩa Yên Bái theo OpenStreetMap.', 'published', '15',
  'grade12', 1, '2/1930', 'Khu lăng mộ và tượng đài ghi dấu cuộc khởi nghĩa ngày 9/2/1930 của Việt Nam Quốc dân Đảng do Nguyễn Thái Học lãnh đạo với khẩu hiệu ''Không thành công cũng thành nhân''.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'atk-dinh-hoa', 'Khu di tích Quốc gia đặc biệt ATK Định Hóa', 'Thủ đô gió ngàn – An toàn khu Trung ương', 'ATK Định Hóa (Thái Nguyên) là địa bàn chiến lược vững chắc, bảo vệ tuyệt đối an toàn cơ quan đầu não của Đảng và Chính phủ trong suốt cuộc kháng chiến chống thực dân Pháp.', 21.9056, 105.6528,
  'exact', 'Tọa độ Đồi Tỉn Keo, xã Phú Đình, huyện Định Hóa, tỉnh Thái Nguyên theo OpenStreetMap.', 'published', '19',
  'grade12', 1, '1947 – 1954', 'Trung tâm đầu não kháng chiến chống Pháp, nơi Bác Hồ và Ban Thường vụ Trung ương Đảng quyết định mở Chiến dịch Đông – Xuân 1953–1954 và Chiến dịch Điện Biên Phủ.', 'chien-dich-dien-bien-phu'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'atk-cho-don', 'Khu di tích Quốc gia đặc biệt ATK Chợ Đồn', 'An toàn khu Chợ Đồn', 'ATK Chợ Đồn (Bắc Kạn cũ, nay thuộc Thái Nguyên) gồm các di tích Nà Pậu, Bản Ca, đồi Khau Mạ, góp phần cấu thành quần thể Chiến khu Việt Bắc anh hùng.', 22.1583, 105.5972,
  'exact', 'Tọa độ di tích lán Nà Pậu, huyện Chợ Đồn theo OpenStreetMap.', 'published', '19',
  'extended', 2, '1947 – 1952', 'Vùng căn cứ an toàn khu giáp ranh Định Hóa, nơi Bác Hồ và đồng chí Phạm Văn Đồng từng sống, làm việc và chỉ đạo nhiều chiến dịch lớn thời kháng Pháp.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khoi-nghia-bac-son', 'Khu di tích Quốc gia đặc biệt Khởi nghĩa Bắc Sơn', 'Đồn Mỏ Nhài, Đình Nông Lục', 'Khởi nghĩa Bắc Sơn bùng nổ ngày 27/9/1940 tại đồn Mỏ Nhài, đánh dấu bước phát triển mới của phong trào giải phóng dân tộc dưới ngọn cờ của Đảng.', 21.9, 106.3167,
  'exact', 'Tọa độ di tích Đồn Mỏ Nhài, thị trấn Bắc Sơn, tỉnh Lạng Sơn theo OpenStreetMap.', 'published', '20',
  'grade12', 1, '27/9/1940', 'Phát súng đầu tiên báo hiệu thời kỳ đấu tranh vũ trang cách mạng (1939–1945), từ đó hình thành Đội Du kích Bắc Sơn – một trong những mầm mống đầu tiên của LLVTND.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'ai-chi-lang', 'Khu di tích Lịch sử Chi Lăng', 'Ải Chi Lăng', 'Ải Chi Lăng thuộc huyện Chi Lăng, Lạng Sơn, là thung lũng hẹp hình bầu dục được bao bọc bởi núi đá hiểm trở, giữ vị trí yết hầu trên con đường thiên lý Bắc - Nam.', 21.6083, 106.5833,
  'exact', 'Tọa độ cụm di tích Ải Chi Lăng theo OpenStreetMap.', 'published', '20',
  'extended', 2, '981 – 1427', 'Cửa ải hiểm trở ghi dấu những chiến công hiển hách chống ngoại xâm của dân tộc, tiêu biểu là chiến thắng Chi Lăng – Xương Giang năm 1427 chém đầu Liễu Thăng.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'mo-than-deo-nai', 'Khu di tích Mỏ than Đèo Nai – Cẩm Phả', 'Khai trường Than Đèo Nai', 'Mỏ than Đèo Nai tại Cẩm Phả ghi dấu truyền thống ''Kỷ luật và Đồng tâm'' bất khuất của giai cấp công nhân Việt Nam trong đấu tranh giành độc lập và xây dựng CNXH.', 21.0264, 107.3194,
  'exact', 'Tọa độ địa điểm Di tích Bác Hồ về thăm Mỏ than Đèo Nai năm 1959 theo OpenStreetMap.', 'published', '22',
  'grade12', 1, '1936 – 1959', 'Cái nôi phong trào công nhân mỏ với cuộc bãi công lịch sử của hơn 3 vạn thợ mỏ năm 1936 thời kỳ Mặt trận Dân chủ; nơi duy nhất Bác Hồ về thăm công nhân ngành Than năm 1959.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'bai-coc-bach-dang', 'Khu di tích Quốc gia đặc biệt Bạch Đằng', 'Bãi cọc Yên Giang, Đồng Vạn Muối', 'Khu di tích Bạch Đằng nằm tại thị xã Quảng Yên, lưu giữ các bãi cọc gỗ nguyên bản minh chứng cho nghệ thuật quân sự tài tình của cha ông ta.', 20.9389, 106.7972,
  'exact', 'Tọa độ Bãi cọc Yên Giang, thị xã Quảng Yên, Quảng Ninh theo OpenStreetMap.', 'published', '22',
  'extended', 2, '938 – 1288', 'Dòng sông lịch sử với các bãi cọc gỗ lim ghi dấu ba chiến thắng thủy chiến oanh liệt của Ngô Quyền (938), Lê Hoàn (981) và Trần Hưng Đạo (1288).', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'atk-ii-hiep-hoa', 'Khu di tích Quốc gia đặc biệt ATK II Hiệp Hòa', 'An toàn khu II của Trung ương Đảng', 'ATK II Hiệp Hòa (Bắc Giang cũ, nay thuộc Bắc Ninh) giữ vị trí then chốt nối liền chiến khu Việt Bắc với vùng đồng bằng Bắc Bộ trong Tổng khởi nghĩa 1945.', 21.35, 105.9833,
  'exact', 'Tọa độ nhà cụ Ngô Văn Thấu (nhà đỏ cách mạng ATK II), xã Hoàng Vân theo OpenStreetMap.', 'published', '24',
  'grade12', 1, '1940 – 1945', 'An toàn khu dự bị của Ban Thường vụ Trung ương Đảng thời kỳ tiền khởi nghĩa (1940–1945), nơi nuôi giấu các đồng chí lãnh đạo Trường Chinh, Hoàng Quốc Việt.', 'cach-mang-thang-tam-1945'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khoi-nghia-yen-the', 'Khu di tích Quốc gia đặc biệt Khởi nghĩa Yên Thế', 'Đồn Phồn Xương', 'Quần thể di tích đồn Phồn Xương, chùa Lèo, đình Dĩnh Thép tại Yên Thế ghi dấu tinh thần quật cường của nghĩa quân nông dân chống ách đô hộ của thực dân Pháp.', 21.5167, 106.1333,
  'exact', 'Tọa độ Đồn Phồn Xương, thị trấn Cầu Gồ, huyện Yên Thế theo OpenStreetMap.', 'published', '24',
  'extended', 2, '1884 – 1913', 'Căn cứ địa của phong trào khởi nghĩa nông dân Yên Thế kiên cường chống thực dân Pháp kéo dài gần 30 năm dưới sự lãnh đạo của ''Hùm xám Yên Thế'' Hoàng Hoa Thám.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'chien-thang-song-lo-doan-hung', 'Di tích Lịch sử Chiến thắng Sông Lô – Đoan Hùng', 'Trận địa Núi Đồn – Sông Lô', 'Chiến thắng Sông Lô ngày 24/10/1947 tại Đoan Hùng (Phú Thọ) đã đi vào lịch sử và âm nhạc như một trong những mốc son mở đầu nghệ thuật tác chiến pháo binh Việt Nam.', 21.6167, 105.1833,
  'exact', 'Tọa độ Tượng đài Chiến thắng Sông Lô trên Núi Đồn, thị trấn Đoan Hùng theo OpenStreetMap.', 'published', '25',
  'grade12', 1, '24/10/1947', 'Trận phục kích pháo binh xuất sắc trên sông Lô trong Chiến dịch Việt Bắc thu – đông 1947, bắn chìm đoàn tàu chiến Pháp, bẻ gãy gọng kìm sông nước của địch.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-di-tich-den-hung', 'Khu di tích Quốc gia đặc biệt Đền Hùng', 'Khu di tích lịch sử Đền Hùng – Núi Nghĩa Lĩnh', 'Khu di tích lịch sử Đền Hùng là trung tâm văn hóa tín ngưỡng thờ cúng Hùng Vương – Di sản văn hóa phi vật thể đại diện của nhân loại.', 21.3917, 105.3278,
  'exact', 'Tọa độ Đền Thượng trên đỉnh núi Nghĩa Lĩnh, Khu di tích Đền Hùng theo OpenStreetMap.', 'published', '25',
  'extended', 2, 'Thời kỳ Văn Lang – nay', 'Kinh đô cội nguồn dân tộc trên núi Nghĩa Lĩnh thờ phụng các Vua Hùng dựng nước; nơi Bác Hồ căn dặn: ''Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước''.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'ben-k15-do-son', 'Di tích Bến K15 Đồ Sơn – Đường Hồ Chí Minh trên biển', 'Bến K15 Vạn Hương', 'Bến K15 nằm tại thung lũng Vạn Hương, chân đồi Nghinh Phong thuộc Đồ Sơn, Hải Phòng, là biểu tượng anh hùng của Đường Hồ Chí Minh trên biển.', 20.6975, 106.7917,
  'exact', 'Tọa độ Tượng đài di tích Bến K15 Đồ Sơn theo OpenStreetMap.', 'published', '31',
  'grade12', 1, '1961 – 1975', 'Điểm xuất phát của những chuyến Tàu không số huyền thoại thuộc Đoàn 759 (Đoàn 125 hải quân), chi viện hàng vạn tấn vũ khí cho chiến trường miền Nam đánh Mỹ.', 'duong-truong-son'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'con-son-kiep-bac', 'Khu di tích Quốc gia đặc biệt Côn Sơn – Kiếp Bạc', 'Khu di tích Chí Linh', 'Côn Sơn – Kiếp Bạc (Hải Dương cũ, nay thuộc Hải Phòng) là trung tâm văn hóa tâm linh và quân sự tiêu biểu của Đại Việt thời Trần và Hậu Lê.', 21.1333, 106.4167,
  'exact', 'Tọa độ Đền Kiếp Bạc thờ Hưng Đạo Đại vương Trần Quốc Tuấn theo OpenStreetMap.', 'published', '31',
  'extended', 2, 'Thế kỷ XIII – XV', 'Quần thể di tích lịch sử gắn liền với cuộc đời, sự nghiệp của Anh hùng dân tộc Trần Hưng Đạo và Danh nhân văn hóa thế giới Nguyễn Trãi.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'tieng-trong-tien-hai', 'Khu di tích Tiếng trống Tiền Hải 1930', 'Đình Nho Lâm – Địa điểm biểu tình Tiền Hải', 'Khu di tích Đình Nho Lâm (Thái Bình cũ, nay thuộc Hưng Yên) ghi dấu sự kiện Tiếng trống Tiền Hải nổ ra, thể hiện tinh thần cách mạng quật khởi của giai cấp nông dân.', 20.3958, 106.5125,
  'exact', 'Tọa độ Di tích lịch sử Đình Nho Lâm, xã Tây An, huyện Tiền Hải theo OpenStreetMap.', 'published', '33',
  'grade12', 1, '14/10/1930', 'Cuộc biểu tình vũ trang của hàng nghìn nông dân Tiền Hải ngày 14/10/1930 hưởng ứng phong trào Xô viết Nghệ Tĩnh trong cao trào cách mạng 1930–1931.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'pho-hien', 'Khu di tích Quốc gia đặc biệt Phố Hiến', 'Thương cảng Phố Hiến', 'Quần thể di tích Phố Hiến tại TP. Hưng Yên bảo tồn các công trình đình, đền, chùa, văn miếu Xích Đằng cổ kính phản ánh thời kỳ mở cửa giao thương của Đại Việt.', 20.65, 106.05,
  'exact', 'Tọa độ khu vực hồ Bán Nguyệt và Đền Mẫu Phố Hiến theo OpenStreetMap.', 'published', '33',
  'extended', 2, 'Thế kỷ XVI – XVII', 'Đô thị thương cảng cổ phồn thịnh từng được mệnh danh ''Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến'', nơi giao thương sầm uất với phương Tây và châu Á.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nha-may-det-nam-dinh', 'Di tích Lịch sử Nhà máy Dệt Nam Định', 'Nhà máy Sợi Nam Định (Cotonnière)', 'Nhà máy Dệt Nam Định (Nam Định cũ, nay thuộc Ninh Bình) từng là cơ sở công nghiệp dệt lớn nhất Đông Dương, nơi Bác Hồ từng ba lần về thăm công nhân.', 20.4333, 106.1833,
  'exact', 'Tọa độ Bảo tàng Dệt May Nam Định, số 43 Tô Hiệu, TP. Nam Định theo OpenStreetMap.', 'published', '37',
  'grade12', 1, '1930 – 1972', 'Cái nôi của phong trào công nhân dệt may thời kỳ thành lập Đảng (1930) và biểu tượng ''Vừa sản xuất, vừa chiến đấu'' kiên cường bắn rơi máy bay Mỹ.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'co-do-hoa-lu', 'Khu di tích Quốc gia đặc biệt Cố đô Hoa Lư', 'Kinh đô Hoa Lư Đại Cồ Việt', 'Cố đô Hoa Lư nằm trong vùng lõi Quần thể danh thắng Tràng An (Ninh Bình), nơi lưu giữ các đền thờ Vua Đinh Tiên Hoàng và Vua Lê Đại Hành cổ kính.', 20.2833, 105.9,
  'exact', 'Tọa độ Đền thờ Vua Đinh Tiên Hoàng tại xã Trường Yên, huyện Hoa Lư theo OpenStreetMap.', 'published', '37',
  'extended', 2, '968 – 1010', 'Kinh đô đầu tiên của nhà nước phong kiến tập quyền Đại Cồ Việt dưới triều Đinh, Tiền Lê trước khi vua Lý Thái Tổ dời đô về Thăng Long năm 1010.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'cau-ham-rong', 'Di tích Lịch sử Cầu Hàm Rồng', 'Cầu Hàm Rồng bắc qua sông Mã', 'Cầu Hàm Rồng bắc qua dòng sông Mã tại cửa ngõ TP. Thanh Hóa. Quân và dân Hàm Rồng đã bắn rơi hơn 100 máy bay giặc Mỹ, giữ vững mạch cầu ra trận.', 19.8333, 105.7833,
  'exact', 'Tọa độ Cầu Hàm Rồng bắc qua sông Mã, phường Hàm Rồng, TP. Thanh Hóa theo OpenStreetMap.', 'published', '38',
  'grade12', 1, '1965 – 1972', 'Huyết mạch giao thông trọng yếu chi viện tiền tuyến lớn miền Nam; biểu tượng ý chí kiên cường đánh thắng hai cuộc chiến tranh phá hoại của không quân Mỹ.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'thanh-nha-ho', 'Di sản Thế giới Thành nhà Hồ', 'Tây Đô', 'Thành nhà Hồ nằm tại huyện Vĩnh Lộc, tỉnh Thanh Hóa, được UNESCO công nhận là Di sản Văn hóa Thế giới năm 2011.', 20.0767, 105.6078,
  'exact', 'Tọa độ Cổng Nam Thành nhà Hồ, huyện Vĩnh Lộc, Thanh Hóa theo OpenStreetMap.', 'published', '38',
  'extended', 2, '1397 – 1407', 'Tòa thành bằng đá khối độc nhất vô nhị ở Đông Nam Á do Hồ Quý Ly xây dựng năm 1397, minh chứng cho kỹ thuật xây vòm đá đỉnh cao của người Việt.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-di-tich-kim-lien', 'Khu di tích Quốc gia đặc biệt Kim Liên', 'Làng Sen quê nội, Làng Hoàng Trù quê ngoại', 'Khu di tích Kim Liên tại huyện Nam Đàn, Nghệ An lưu giữ nguyên vẹn nếp nhà tranh đơn sơ và những kỷ vật thời niên thiếu của Bác Hồ kính yêu.', 18.6944, 105.5583,
  'exact', 'Tọa độ ngôi nhà tranh Bác Hồ ở Làng Sen, xã Kim Liên, huyện Nam Đàn theo OpenStreetMap.', 'published', '40',
  'grade12', 1, '1890 – nay', 'Quê hương của Chủ tịch Hồ Chí Minh, nơi nuôi dưỡng tuổi thơ và hun đúc lòng yêu nước nồng nàn của người anh hùng giải phóng dân tộc, danh nhân văn hóa.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'truong-bon', 'Khu di tích Lịch sử Quốc gia Truông Bồn', 'Tọa độ lửa Truông Bồn trên Tuyến đường 15A', 'Truông Bồn thuộc xã Mỹ Sơn, huyện Đô Lương, Nghệ An là biểu tượng bất tử của tinh thần ''Sống bám cầu đường, chết kiên cường dũng cảm''.', 18.8472, 105.4778,
  'exact', 'Tọa độ Khu tưởng niệm 13 liệt sĩ TNXP Truông Bồn theo OpenStreetMap.', 'published', '40',
  'extended', 2, '1964 – 1968', 'Tọa độ lửa trên Đường 15A thời chống Mỹ, nơi ghi dấu sự hy sinh anh dũng của 13 chiến sĩ ''Tiểu đội thép'' TNXP Đại đội 317 rạng sáng ngày 31/10/1968.', 'duong-truong-son'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nga-ba-dong-loc', 'Khu di tích Quốc gia đặc biệt Ngã ba Đồng Lộc', 'Ngã ba Đồng Lộc – Trọng điểm Đường Trường Sơn', 'Ngã ba Đồng Lộc tại huyện Can Lộc, Hà Tĩnh là cửa ngõ hiểm yếu nơi máy bay Mỹ trút hàng vạn tấn bom đạn nhằm cắt đứt tuyến chi viện Nam – Bắc.', 18.3167, 105.7,
  'exact', 'Tọa độ Khu mộ 10 nữ liệt sĩ TNXP Ngã ba Đồng Lộc theo OpenStreetMap.', 'published', '42',
  'grade12', 1, '1965 – 1968', 'Trọng điểm giao thông huyết mạch trên tuyến lửa Trường Sơn, nơi 10 nữ liệt sĩ thanh niên xung phong Tiểu đội 4 anh dũng hy sinh ngày 24/7/1968 để thông đường.', 'duong-truong-son'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'thanh-co-quang-tri', 'Khu di tích Quốc gia đặc biệt Thành cổ Quảng Trị', 'Thành cổ Đinh Công Tráng', 'Thành cổ Quảng Trị là di tích lịch sử quốc gia đặc biệt, nơi từng tấc đất dòng sông đều thấm đượm máu xương của các chiến sĩ quân giải phóng mùa hè năm 1972.', 16.7483, 107.1903,
  'exact', 'Tọa độ Đài tưởng niệm trung tâm Thành cổ Quảng Trị theo OpenStreetMap.', 'published', '44',
  'grade12', 1, '28/6 – 16/9/1972', 'Địa danh ghi dấu cuộc chiến đấu kiên cường 81 ngày đêm mùa hè đỏ lửa 1972, biểu tượng sáng ngời về lòng quả cảm, tạo ưu thế trên bàn đàm phán Paris 1973.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'doi-bo-hien-luong-ben-hai', 'Khu di tích Quốc gia đặc biệt Đôi bờ Hiền Lương – Bến Hải', 'Giới tuyến quân sự tạm thời Vĩ tuyến 17', 'Cụm di tích Đôi bờ Hiền Lương – Bến Hải gồm cầu Hiền Lương, Cột cờ bờ Bắc, Nhà liên hợp, đồn bốt cảnh sát chứng kiến cuộc đấu tranh giữ cờ hào hùng.', 17.0017, 107.0347,
  'exact', 'Tọa độ Cầu Hiền Lương lịch sử bắc qua sông Bến Hải theo OpenStreetMap.', 'published', '44',
  'extended', 2, '1954 – 1975', 'Biểu tượng nỗi đau chia cắt đất nước và khát vọng thống nhất non sông suốt hơn 20 năm kháng chiến chống Mỹ bên dòng sông Bến Hải và cầu Hiền Lương.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'ngo-mon-hue', 'Di tích Cửa Ngọ Môn – Cố đô Huế', 'Ngọ Môn Hoàng thành Huế', 'Cửa Ngọ Môn là cổng chính phía nam của Hoàng thành Huế. Ngày 30/8/1945, sự kiện thoái vị tại đây đã đánh dấu thắng lợi trọn vẹn của Cách mạng Tháng Tám.', 16.4678, 107.5786,
  'exact', 'Tọa độ cổng Ngọ Môn, Đại Nội Huế theo OpenStreetMap.', 'published', '46',
  'grade12', 1, '30/8/1945', 'Nơi vua Bảo Đại đọc Tuyên ngôn Thoái vị và trao ấn kiếm cho đại diện Chính phủ lâm thời ngày 30/8/1945, chấm dứt hoàn toàn chế độ phong kiến Việt Nam.', 'cach-mang-thang-tam-1945'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'kinh-thanh-hue-1968', 'Kỳ Đài Huế – Mặt trận Tết Mậu Thân 1968', 'Cột Cờ Huế (Kỳ Đài)', 'Kỳ Đài Huế trước Ngọ Môn là nhân chứng lịch sử quan trọng trong cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 tại mặt trận Trị – Thiên – Huế.', 16.4667, 107.5833,
  'exact', 'Tọa độ công trình Kỳ Đài trước cổng Ngọ Môn Huế theo OpenStreetMap.', 'published', '46',
  'extended', 2, 'Xuân Mậu Thân 1968', 'Nơi lá cờ của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam tung bay suốt 26 ngày đêm quân giải phóng làm chủ thành phố Huế trong Tết Mậu Thân 1968.', 'tet-mau-than-1968'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'chien-thang-nui-thanh-1965', 'Di tích Lịch sử Chiến thắng Núi Thành', 'Cứ điểm Đồi Yên Ngựa – Núi Thành', 'Chiến thắng Núi Thành (Quảng Nam cũ, nay thuộc Đà Nẵng) đã khẳng định quân dân miền Nam có đầy đủ khả năng đánh thắng quân viễn chinh Mỹ trong Chiến tranh cục bộ.', 15.4167, 108.6833,
  'exact', 'Tọa độ Tượng đài Chiến thắng Núi Thành, huyện Núi Thành theo OpenStreetMap.', 'published', '48',
  'grade12', 1, '26/5/1965', 'Trận tập kích tiêu diệt đại đội lính thủy đánh bộ Mỹ đêm 25 rạng ngày 26/5/1965, mở đầu phong trào ''Tìm Mỹ mà đánh, tìm Ngụy mà diệt'' trên toàn miền Nam.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-den-thap-my-son', 'Khu đền tháp Mỹ Sơn', 'Thánh địa Mỹ Sơn', 'Khu đền tháp Mỹ Sơn (Quảng Nam cũ, nay thuộc Đà Nẵng) là trung tâm cúng tế linh thiêng của vương triều Chăm Pa qua nhiều thế kỷ.', 15.7958, 108.1239,
  'exact', 'Tọa độ tháp B1 trung tâm thánh địa Mỹ Sơn theo OpenStreetMap.', 'published', '48',
  'extended', 2, 'Thế kỷ IV – XIII', 'Quần thể thánh địa đền tháp Chăm Pa cổ kính trong thung lũng khép kín, minh chứng cho nghệ thuật kiến trúc điêu khắc gạch độc đáo; Di sản Thế giới UNESCO.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-chung-tich-son-my', 'Khu chứng tích Quốc gia đặc biệt Sơn Mỹ', 'Làng Mỹ Lai – Sơn Mỹ', 'Khu chứng tích Sơn Mỹ thuộc xã Tịnh Khê, TP. Quảng Ngãi là nơi ghi dấu vụ thảm sát chấn động lương tri loài người trong cuộc chiến tranh chống Mỹ cứu nước.', 15.1764, 108.8953,
  'exact', 'Tọa độ Tượng đài Chứng tích Sơn Mỹ, thôn Cung Kinh, xã Tịnh Khê theo OpenStreetMap.', 'published', '51',
  'grade12', 1, '16/3/1968', 'Nơi tưởng niệm 504 thường dân vô tội bị quân đội Mỹ sát hại ngày 16/3/1968; bản cáo trạng đanh thép về tội ác chiến tranh và thông điệp tha thiết vì hòa bình.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'dak-to-tan-canh', 'Khu di tích Quốc gia đặc biệt Đắk Tô – Tân Cảnh', 'Căn cứ E42 Tân Cảnh', 'Chiến thắng Đắk Tô – Tân Cảnh (Kon Tum cũ, nay thuộc Quảng Ngãi) gắn liền với chiếc xe tăng T-54 số hiệu 377 anh dũng một mình tiêu diệt gần chục xe tăng địch.', 14.65, 107.8333,
  'exact', 'Tọa độ Tượng đài Chiến thắng Đắk Tô – Tân Cảnh theo OpenStreetMap.', 'published', '51',
  'extended', 2, '24/4/1972', 'Căn cứ quân sự kiên cố của địch ở Bắc Tây Nguyên bị quân ta đánh chiếm ngày 24/4/1972, giải phóng hoàn toàn Đắk Tô – Tân Cảnh trong Chiến dịch Tây Nguyên 1972.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'lang-khang-chien-stor', 'Di tích Lịch sử Làng kháng chiến Stơr', 'Làng Stơr anh hùng của Đinh Núp', 'Làng kháng chiến Stơr tại xã Tơ Tung, huyện Kbang, tỉnh Gia Lai là biểu tượng cho lòng yêu nước và tinh thần kiên cường của đồng bào các dân tộc Tây Nguyên.', 14.2167, 108.6,
  'exact', 'Tọa độ Nhà lưu niệm Anh hùng Đinh Núp tại làng Stơr, huyện Kbang theo OpenStreetMap.', 'published', '52',
  'grade12', 1, '1950 – 1954', 'Quê hương của Anh hùng Đinh Núp, nơi đồng bào Ba Na biến làng thành pháo đài chông tre bẫy đá đánh giặc, nguyên mẫu của tác phẩm bất hủ ''Đất nước đứng lên''.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'bao-tang-quang-trung', 'Khu di tích Quốc gia đặc biệt Tây Sơn Tam Kiệt', 'Bảo tàng Quang Trung – Đền thờ Tây Sơn', 'Bảo tàng Quang Trung tại thị trấn Phú Phong (Bình Định cũ, nay thuộc Gia Lai) lưu giữ cây me, giếng nước cổ và hào khí phong trào Tây Sơn bách chiến bách thắng.', 13.9167, 108.9167,
  'exact', 'Tọa độ Đền thờ Tây Sơn Tam Kiệt trong khuôn viên Bảo tàng Quang Trung theo OpenStreetMap.', 'published', '52',
  'extended', 2, 'Thế kỷ XVIII (1771 – 1789)', 'Quê hương và nơi khởi phát phong trào nông dân Tây Sơn gắn liền với người anh hùng áo vải cờ đào Quang Trung – Nguyễn Huệ đánh tan quân Xiêm và 29 vạn quân Thanh.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'san-bay-thanh-son', 'Di tích Sân bay Thành Sơn – Phi đội Quyết thắng', 'Căn cứ Không quân Phan Rang', 'Sân bay Thành Sơn (Ninh Thuận cũ, nay thuộc Khánh Hòa) ghi dấu trận tập kích đường không huyền thoại bằng máy bay A-37 thu được của địch trưa chiều 28/4/1975.', 11.6033, 108.9558,
  'exact', 'Tọa độ khu vực đường băng Sân bay Thành Sơn theo OpenStreetMap.', 'published', '56',
  'grade12', 1, '28/4/1975', 'Căn cứ không quân nơi Phi đội Quyết thắng xuất kích ném bom sân bay Tân Sơn Nhất chiều ngày 28/4/1975, làm tê liệt cầu hàng không địch trong Chiến dịch Hồ Chí Minh.', 'chien-dich-ho-chi-minh-1975'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'thap-ba-ponagar', 'Khu di tích Quốc gia đặc biệt Tháp Bà Ponagar', 'Yang Po Ino Nagar', 'Tháp Bà Ponagar tại TP. Nha Trang là kiệt tác nghệ thuật kiến trúc điêu khắc gạch đất nung của văn minh Chăm Pa cổ đại.', 12.2656, 109.1961,
  'exact', 'Tọa độ Tháp chính Tháp Bà Ponagar, TP. Nha Trang theo OpenStreetMap.', 'published', '56',
  'extended', 2, 'Thế kỷ VIII – XIII', 'Quần thể đền tháp Chăm Pa cổ kính trên đồi Cù Lao nhìn ra cửa biển Nha Trang, thờ Nữ thần Mẹ Xứ sở Thiên Y A Na linh thiêng.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'buon-ma-thuot-1975', 'Tượng đài Chiến thắng Buôn Ma Thuột & Nhà đày', 'Thị xã Buôn Ma Thuột – Căn cứ Trung đoàn 53', 'Chiến thắng Buôn Ma Thuột ngày 10–11/3/1975 mở ra cuộc Tổng tiến công và nổi dậy mùa Xuân 1975. Nhà đày Buôn Ma Thuột là Di tích quốc gia đặc biệt giam cầm tù chính trị kiên trung.', 12.6833, 108.05,
  'exact', 'Tọa độ Tượng đài Chiến thắng Ngã sáu Buôn Ma Thuột theo OpenStreetMap.', 'published', '66',
  'grade12', 1, '10/3/1975', 'Trận đánh then chốt mở màn Chiến dịch Tây Nguyên ngày 10/3/1975, giáng đòn sấm sét tạo bước ngoặt chiến lược giải phóng hoàn toàn miền Nam năm 1975.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'vung-ro-phu-yen', 'Khu di tích Quốc gia đặc biệt Vịnh Vũng Rô', 'Bến Vũng Rô – Tàu Không số', 'Vịnh Vũng Rô (Phú Yên cũ, nay thuộc Đắk Lắk) được bao bọc bởi đèo Cả, núi Đá Bia, là bến đỗ lịch sử anh hùng của đoàn tàu không số chi viện Nam Trung Bộ.', 12.8667, 109.4167,
  'exact', 'Tọa độ Đài tưởng niệm Tàu Không số Vịnh Vũng Rô theo OpenStreetMap.', 'published', '66',
  'extended', 2, '1964 – 1965', 'Bến tiếp nhận vũ khí bí mật của Đường Hồ Chí Minh trên biển, nơi ghi dấu sự kiện Tàu C41 và cuộc chiến đấu quả cảm của Tàu 143 đầu năm 1965.', 'duong-truong-son'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'truong-duc-thanh', 'Khu di tích Lịch sử Trường Dục Thanh', 'Dục Thanh Học Hiệu', 'Trường Dục Thanh do các sĩ phu yêu nước phong trào Duy Tân sáng lập tại Phan Thiết (Bình Thuận cũ, nay thuộc Lâm Đồng), lưu giữ nhiều kỷ vật thời Bác Hồ dạy học.', 10.9272, 108.0989,
  'exact', 'Tọa độ Di tích Trường Dục Thanh, số 39 Trưng Nhị, TP. Phan Thiết theo OpenStreetMap.', 'published', '68',
  'grade12', 1, '9/1910 – 2/1911', 'Nơi người thanh niên yêu nước Nguyễn Tất Thành dạy học từ tháng 9/1910 đến tháng 2/1911 trước khi vào Sài Gòn ra đi tìm đường cứu nước ngày 5/6/1911.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nha-lao-thieu-nhi-da-lat', 'Di tích Lịch sử Nhà lao Thiếu nhi Đà Lạt', 'Trung tâm Giáo huấn Thiếu nhi Đà Lạt', 'Nhà lao Thiếu nhi Đà Lạt được lập năm 1971, chứng kiến tinh thần đoàn kết, kiên trung của các chiến sĩ cách mạng nhỏ tuổi trước mọi ngón đòn tra tấn.', 11.95, 108.45,
  'exact', 'Tọa độ Di tích Nhà lao Thiếu nhi Đà Lạt, số 9A đường Lữ Gia, TP. Đà Lạt theo OpenStreetMap.', 'published', '68',
  'extended', 2, '1971 – 1973', 'Nơi chính quyền Sài Gòn giam giữ hơn 600 thiếu nhi yêu nước miền Nam; biểu tượng ''Tuổi nhỏ chí lớn'' bất khuất với phong trào diệt ác phá kìm giải phóng nhà lao.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'chien-thang-xuan-loc-1975', 'Di tích Lịch sử Chiến thắng Xuân Lộc 1975', 'Căn cứ phòng thủ Xuân Lộc – Long Khánh', 'Chiến thắng Xuân Lộc (9–21/4/1975) tại Đồng Nai đã làm rung chuyển toàn bộ chính quyền Sài Gòn, trực tiếp dẫn đến việc Tổng thống Nguyễn Văn Thiệu từ chức tối 21/4.', 10.9333, 107.2333,
  'exact', 'Tọa độ Tượng đài Chiến thắng Xuân Lộc, thị xã Long Khánh, tỉnh Đồng Nai theo OpenStreetMap.', 'published', '75',
  'grade12', 1, '9 – 21/4/1975', 'Trận đánh đập tan ''Cánh cửa thép'' phòng thủ cửa ngõ phía đông Sài Gòn của địch, mở toang đường tiến quân cho các cánh quân giải phóng tiến vào giải phóng Sài Gòn.', 'chien-dich-ho-chi-minh-1975'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'can-cu-ta-thiet', 'Khu di tích Quốc gia đặc biệt Căn cứ Tà Thiết', 'Rừng Chính phủ – Căn cứ Bộ Chỉ huy Miền', 'Căn cứ Tà Thiết (Bình Phước cũ, nay thuộc Đồng Nai) nằm giữa rừng nguyên sinh Lộc Ninh, là nơi đón nhận mệnh lệnh lịch sử mở Chiến dịch Hồ Chí Minh tháng 4/1975.', 11.8333, 106.5833,
  'exact', 'Tọa độ Nhà làm việc của Bộ Chỉ huy Chiến dịch Hồ Chí Minh tại Tà Thiết theo OpenStreetMap.', 'published', '75',
  'extended', 2, '1973 – 1975', 'Sở chỉ huy tiền phương của Chiến dịch Hồ Chí Minh năm 1975 và là căn cứ đầu não của Bộ Chỉ huy Quân giải phóng miền Nam Việt Nam trong giai đoạn cuối kháng chiến.', 'chien-dich-ho-chi-minh-1975'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'dia-dao-cu-chi', 'Khu di tích Quốc gia đặc biệt Địa đạo Củ Chi', 'Đất thép thành đồng Củ Chi', 'Địa đạo Củ Chi gồm các căn cứ Bến Dược và Bến Đình, là công trình đánh giặc độc đáo dưới lòng đất giúp quân dân ta trụ vững trước mọi cuộc càn quét của quân Mỹ.', 11.1417, 106.4639,
  'exact', 'Tọa độ Đền tưởng niệm Liệt sĩ Bến Dược – Địa đạo Củ Chi theo OpenStreetMap.', 'published', '79',
  'extended', 2, '1946 – 1975', 'Hệ thống địa đạo kỳ vĩ dài hơn 250 km trong lòng đất, căn cứ kháng chiến kiên cường cửa ngõ Sài Gòn, biểu tượng bất diệt của nghệ thuật chiến tranh nhân dân.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'can-cu-trung-uong-cuc-mien-nam', 'Khu di tích Quốc gia đặc biệt Căn cứ Trung ương Cục miền Nam', 'Rừng R – Căn cứ Chàng Riệc', 'Căn cứ Trung ương Cục miền Nam nằm tại rừng Chàng Riệc, huyện Tân Biên, tỉnh Tây Ninh, là cơ quan đầu não chỉ đạo cuộc kháng chiến chống Mỹ cứu nước ở miền Nam.', 11.6333, 105.95,
  'exact', 'Tọa độ Nhà lưu niệm Ban Thường vụ Trung ương Cục tại rừng Chàng Riệc theo OpenStreetMap.', 'published', '80',
  'grade12', 1, '1961 – 1975', '''Thủ đô kháng chiến'' của cách mạng miền Nam thời chống Mỹ, nơi Trung ương Cục trực tiếp lãnh đạo phong trào cách mạng và đánh bại các chiến lược chiến tranh của Mỹ.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nga-tu-duc-hoa', 'Khu di tích Lịch sử Ngã tư Đức Hòa', 'Địa điểm thành lập Chi bộ Đảng đầu tiên Chợ Lớn', 'Khu di tích Ngã tư Đức Hòa (Long An cũ, nay thuộc Tây Ninh) là cái nôi của phong trào đấu tranh cách mạng miền Đông Nam Bộ từ những ngày đầu dựng Đảng.', 10.8833, 106.45,
  'exact', 'Tọa độ Tượng đài đồng chí Võ Văn Tần tại Ngã tư Đức Hòa theo OpenStreetMap.', 'published', '80',
  'extended', 2, '1930 – 1940', 'Nơi thành lập Chi bộ Đảng đầu tiên của tỉnh Chợ Lớn đầu năm 1930 và nơi ghi dấu cuộc biểu tình đẫm máu trong phong trào Nam Kỳ Khởi nghĩa 1940.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'chien-thang-ap-bac-1963', 'Khu di tích Quốc gia đặc biệt Địa điểm Chiến thắng Ấp Bắc', 'Ấp Bắc – Xã Tân Phú', 'Chiến thắng Ấp Bắc (Tiền Giang cũ, nay thuộc Đồng Tháp) mở ra phong trào ''Thi đua Ấp Bắc, giết giặc lập công'' sôi nổi trên toàn chiến trường miền Nam.', 10.4333, 106.1833,
  'exact', 'Tọa độ Tượng đài Ba chiến sĩ gang thép tại Khu di tích Ấp Bắc theo OpenStreetMap.', 'published', '82',
  'grade12', 1, '2/1/1963', 'Trận đánh ngày 2/1/1963 đánh bại cuộc càn quét quy mô lớn của địch, làm phá sản chiến thuật ''Trực thăng vận'' và ''Thiết xa vận'' trong Chiến lược Chiến tranh đặc biệt.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'mo-cu-pho-bang-nguyen-sinh-sac', 'Khu di tích Mộ Cụ Phó bảng Nguyễn Sinh Sắc', 'Mộ Cụ Sắc – TP. Cao Lãnh', 'Khu di tích Mộ Cụ Phó bảng Nguyễn Sinh Sắc tọa lạc tại phường 4, TP. Cao Lãnh, tỉnh Đồng Tháp, là địa chỉ đỏ giáo dục truyền thống yêu nước sâu sắc.', 10.4583, 105.6333,
  'exact', 'Tọa độ Lăng mộ Cụ Phó bảng Nguyễn Sinh Sắc, TP. Cao Lãnh theo OpenStreetMap.', 'published', '82',
  'extended', 2, '1929 – nay', 'Nơi yên nghỉ của Cụ Phó bảng Nguyễn Sinh Sắc – thân sinh Chủ tịch Hồ Chí Minh, nhà nho yêu nước thương dân trọn đời vì dân vì nước.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'dong-khoi-ben-tre-1960', 'Khu di tích Quốc gia đặc biệt Đồng Khởi Bến Tre', 'Đồng Khởi Định Thủy – Mỏ Cày', 'Di tích Đồng Khởi Bến Tre (Bến Tre cũ, nay thuộc Vĩnh Long) gắn liền với tên tuổi nữ tướng Nguyễn Thị Định và ''Đội quân tóc dài'' huyền thoại làm tan rã chính quyền cơ sở địch.', 10.1583, 106.3333,
  'exact', 'Tọa độ Nhà truyền thống Đồng Khởi xã Định Thủy, Mỏ Cày Nam theo OpenStreetMap.', 'published', '86',
  'grade12', 1, '17/1/1960', 'Cái nôi của Phong trào Đồng Khởi bùng nổ ngày 17/1/1960, tạo bước ngoặt chuyển cách mạng miền Nam từ giữ gìn lực lượng sang thế tiến công mạnh mẽ.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-tuong-niem-vo-van-kiet', 'Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt', 'Vườn ông Sáu Dân – Vũng Liêm', 'Khu tưởng niệm tọa lạc tại thị trấn Vũng Liêm, tỉnh Vĩnh Long, nổi bật với kiến trúc mở hài hòa, tôn vinh một nhà lãnh đạo kiệt xuất vì dân vì nước.', 10.1917, 106.1833,
  'exact', 'Tọa độ Nhà tưởng niệm Thủ tướng Võ Văn Kiệt tại thị trấn Vũng Liêm theo OpenStreetMap.', 'published', '86',
  'extended', 2, '1922 – 2008', 'Nơi lưu giữ cuộc đời và cống hiến to lớn của đồng chí Võ Văn Kiệt – người học trò xuất sắc của Chủ tịch Hồ Chí Minh, ''tổng công trình sư'' thời kỳ Đổi mới.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'nha-tu-phu-quoc', 'Di tích Quốc gia đặc biệt Trại giam Tù binh Phú Quốc', 'Trại giam Tù binh Chiến tranh Phú Quốc', 'Nhà tù Phú Quốc (Kiên Giang cũ, nay thuộc An Giang) minh chứng cho tội ác chiến tranh của Mỹ - ngụy và tinh thần đấu tranh anh dũng vượt ngục của các chiến sĩ cách mạng.', 10.0436, 104.0189,
  'exact', 'Tọa độ cổng Phân khu B2, Di tích Nhà tù Phú Quốc theo OpenStreetMap.', 'published', '91',
  'grade12', 1, '1967 – 1973', '''Địa ngục trần gian'' nơi giam giữ hơn 40.000 cán bộ, chiến sĩ cách mạng kiên trung; biểu tượng sáng ngời về ý chí kiên định bất khuất trước mọi cực hình tàn độc.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khu-luu-niem-ton-duc-thang', 'Khu lưu niệm Chủ tịch Tôn Đức Thắng', 'Cù lao Ông Hổ – Quê hương Bác Tôn', 'Khu lưu niệm nằm trên Cù lao Ông Hổ (xã Mỹ Hòa Hưng, TP. Long Xuyên, An Giang) lưu giữ ngôi nhà sàn thời thơ ấu và chuyên cơ YAK-40 của Bác Tôn.', 10.4, 105.45,
  'exact', 'Tọa độ Nhà lưu niệm Bác Tôn tại Cù lao Ông Hổ theo OpenStreetMap.', 'published', '91',
  'extended', 2, '1888 – 1980', 'Quê hương của Chủ tịch Tôn Đức Thắng – người chiến sĩ kéo cờ đỏ trên chiến hạm Pháp ở Biển Đen năm 1919 ủng hộ Cách mạng Tháng Mười Nga, Chủ tịch nước CHXHCN Việt Nam.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'chien-thang-chuong-thien-1973', 'Khu di tích Quốc gia đặc biệt Địa điểm Chiến thắng Chương Thiện 1973', 'Yếu khu Chương Thiện – Mặt trận Tây Nam Bộ', 'Chiến thắng Chương Thiện (Hậu Giang cũ, nay thuộc Cần Thơ) là đòn giáng mạnh mẽ bảo vệ vững chắc vùng giải phóng miền Tây Nam Bộ trong giai đoạn quyết định.', 9.7833, 105.4667,
  'exact', 'Tọa độ Tượng đài Chiến thắng 75 lượt tiểu đoàn địch tại TP. Vị Thanh theo OpenStreetMap.', 'published', '92',
  'grade12', 1, '1973', 'Chiến công đánh bại 75 lượt tiểu đoàn địch của quân dân Quân khu 9 năm 1973, đập tan kế hoạch ''tràn ngập lãnh thổ'' của chính quyền Sài Gòn sau Hiệp định Paris.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'kham-lon-can-tho', 'Di tích Lịch sử Khám Lớn Cần Thơ', 'Prison Provinciale de Can Tho', 'Khám Lớn Cần Thơ tại số 8 đường Ngô Gia Tự, quận Ninh Kiều là bằng chứng tố cáo chế độ lao tù tàn bạo của thực dân Pháp và đế quốc Mỹ ở Tây Nam Bộ.', 10.0333, 105.7833,
  'exact', 'Tọa độ Di tích Khám Lớn Cần Thơ, số 8 Ngô Gia Tự theo OpenStreetMap.', 'published', '92',
  'extended', 2, '1886 – 1975', 'Nhà tù lớn nhất miền Tây Nam Bộ thời Pháp – Mỹ giam giữ hàng ngàn chiến sĩ yêu nước, nơi các chiến sĩ cộng sản giữ vững khí tiết ''Thà chết vinh hơn sống nhục''.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'khoi-nghia-hon-khoai-1940', 'Di tích Lịch sử Khởi nghĩa Hòn Khoai 1940', 'Đảo Hòn Khoai – Ngọn hải đăng Hòn Khoai', 'Khởi nghĩa Hòn Khoai đánh dấu mốc son chói lọi trong lịch sử đấu tranh vũ trang của nhân dân vùng đất cực Nam Tổ quốc thời kỳ tiền khởi nghĩa.', 8.4358, 104.8319,
  'exact', 'Tọa độ Ngọn hải đăng và Đài tưởng niệm Khởi nghĩa Hòn Khoai theo OpenStreetMap.', 'published', '96',
  'grade12', 1, '13/12/1940', 'Cuộc khởi nghĩa vũ trang đêm 13/12/1940 do thầy giáo Phan Ngọc Hiển chỉ huy hưởng ứng Nam Kỳ Khởi nghĩa, trở thành Ngày truyền thống cách mạng của Đảng bộ Cà Mau.', NULL
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

INSERT INTO public.historical_locations (
  slug, name, historical_name, description, latitude, longitude,
  accuracy_level, accuracy_note, workflow_status, locality_code,
  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug
) VALUES (
  'ben-vam-lung', 'Di tích Lịch sử Bến Vàm Lũng – Đường Hồ Chí Minh trên biển', 'Bến Vàm Lũng Rạch Gốc', 'Bến Vàm Lũng thuộc thị trấn Rạch Gốc, huyện Ngọc Hiển, Cà Mau, là điểm tiếp nhận vũ khí bí mật cho các đơn vị vũ trang cách mạng miền Tây Nam Bộ.', 8.6167, 105,
  'exact', 'Tọa độ Tượng đài di tích Bến Vàm Lũng tại cửa rạch Vàm Lũng theo OpenStreetMap.', 'published', '96',
  'extended', 2, '1962 – 1975', 'Điểm cập bến an toàn của chuyến tàu không số đầu tiên (Tàu Gỗ Bạc Liêu) đêm 16/10/1962, mở đầu tuyến chi viện vũ khí bằng đường biển vào cực Nam Tổ quốc.', 'duong-truong-son'
) ON CONFLICT (slug) DO UPDATE SET
  locality_code = EXCLUDED.locality_code,
  heritage_tier = EXCLUDED.heritage_tier,
  heritage_rank = EXCLUDED.heritage_rank,
  heritage_period = EXCLUDED.heritage_period,
  heritage_teaser = EXCLUDED.heritage_teaser,
  lesson_slug = EXCLUDED.lesson_slug;

-- Update enrolled existing locations
UPDATE public.historical_locations SET
  locality_code = '04',
  heritage_tier = 'grade12',
  heritage_rank = 1,
  heritage_period = '1941 – 1945',
  heritage_teaser = 'Nơi lãnh tụ Nguyễn Ái Quốc đặt chân về Tổ quốc ngày 28/1/1941 sau 30 năm bôn ba, trực tiếp lãnh đạo cách mạng Việt Nam và thành lập Mặt trận Việt Minh.',
  lesson_slug = 'cach-mang-thang-tam-1945'
WHERE slug = 'pac-bo-cao-bang';

UPDATE public.historical_locations SET
  locality_code = '79',
  heritage_tier = 'grade12',
  heritage_rank = 1,
  heritage_period = '30/4/1975',
  heritage_teaser = 'Nơi xe tăng 390 và 843 húc đổ cổng chính trưa ngày 30/4/1975, cắm cờ giải phóng trên nóc Dinh, đánh dấu thời khắc toàn thắng của Chiến dịch Hồ Chí Minh lịch sử.',
  lesson_slug = 'chien-dich-ho-chi-minh-1975'
WHERE slug = 'dinh-doc-lap';

-- Story sections and sources
DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Bối cảnh lịch sử', 'Nhà tù Hỏa Lò (tên tiếng Pháp: Maison Centrale) được thực dân Pháp khởi công xây dựng năm 1896 trên đất làng Phụ Khánh thuộc tổng Tiền Nghiêm, huyện Thọ Xương cũ (nay thuộc quận Hoàn Kiếm, Hà Nội). Đây là một trong những nhà tù kiên cố và quy mô lớn nhất Đông Dương lúc bấy giờ, giữ vai trò đầu não đàn áp phong trào yêu nước và phong trào cách mạng của nhân dân Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-hoa-lo'),
    'Hồ sơ di tích, mục I: Lịch sử hình thành',
    'Thời gian khởi công 1896 và vị trí làng Phụ Khánh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Hệ thống nhà tù thực dân đàn áp phong trào cách mạng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trường học cách mạng trong chốn lao tù', 'Trong suốt giai đoạn 1930–1954, Hỏa Lò là nơi giam giữ hàng ngàn chiến sĩ cách mạng ưu tú. Dưới chế độ cai trị hà khắc và máy chém tàn bạo, các chiến sĩ cộng sản kiên trung như Phan Bội Châu, Lương Văn Can, Nguyễn Văn Cừ, Trường Chinh, Lê Duẩn, Nguyễn Văn Linh đã biến nhà tù thực dân thành trường học lý luận chính trị, tôi luyện ý chí kiên cường và tổ chức nhiều cuộc vượt ngục quả cảm trở về với nhân dân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-hoa-lo'),
    'Hồ sơ di tích, mục II: Phong trào đấu tranh của tù chính trị',
    'Hoạt động biến nhà tù thành trường học và các cuộc vượt ngục'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Khách sạn Hilton Hà Nội và chính sách nhân đạo', 'Từ năm 1964 đến đầu năm 1973, Nhà tù Hỏa Lò được sử dụng làm nơi tạm giam các phi công quân đội Mỹ bị bắn rơi trong các chiến dịch chiến tranh phá hoại miền Bắc, trong đó có Thượng nghị sĩ John McCain sau này. Các tù binh phi công Mỹ gọi nơi đây bằng biệt danh châm biếm ''Hanoi Hilton''. Sau khi Hiệp định Paris được ký kết ngày 27/1/1973, toàn bộ phi công Mỹ đã được Chính phủ Việt Nam trao trả an toàn và nhân đạo.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-hoa-lo'),
    'Khu trưng bày chuyên đề tù binh phi công Mỹ',
    'Giai đoạn 1964-1973 và việc trao trả tù binh sau Hiệp định Paris'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến dịch Điện Biên Phủ trên không 1972 và trao trả tù binh phi công'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 4, 'Di tích ngày nay', 'Khu Di tích Lịch sử Nhà tù Hỏa Lò hiện tọa lạc tại số 1 phố Hỏa Lò, phường Trần Hưng Đạo, quận Hoàn Kiếm, Hà Nội. Di tích được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1997 và hiện do Ban Quản lý Di tích Nhà tù Hỏa Lò thuộc Sở Văn hóa và Thể thao Hà Nội trực tiếp quản lý, đón hàng trăm nghìn lượt khách trong nước và quốc tế mỗi năm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-hoa-lo'),
    'Quyết định xếp hạng di tích quốc gia năm 1997',
    'Cấp xếp hạng và đơn vị quản lý hiện hành'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Kinh đô ngàn năm văn hiến', 'Mùa thu năm 1010, Vua Lý Thái Tổ ban Chiếu dời đô từ Hoa Lư về thành Đại La, đổi tên là Thăng Long và xây dựng kinh thành quy mô lớn. Hoàng thành Thăng Long là trung tâm quyền lực chính trị tối cao của nước Đại Việt liên tục qua các triều đại Lý, Trần, Lê sơ, Mạc và Lê Trung hưng suốt hơn 8 thế kỷ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-hoang-thanh-thang-long'),
    'Hồ sơ đệ trình UNESCO, trang 14',
    'Mốc định đô năm 1010 và tính liên tục lịch sử'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Di sản văn hóa Thăng Long - Hà Nội',
    'Chiếu dời đô và vị thế trung tâm chính trị Đại Việt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Dấu ấn kháng chiến thời hiện đại: Nhà và Hầm D67', 'Không chỉ gắn bó với các triều đại phong kiến, trong cuộc kháng chiến chống Mỹ cứu nước, khu vực Sở Chỉ huy Bộ Quốc phòng tại Hoàng thành Thăng Long là nơi làm việc của Bộ Chính trị, Quân ủy Trung ương và Đại tướng Võ Nguyên Giáp. Tại Nhà và Hầm D67, những quyết định lịch sử mang tính bước ngoặt đã được ban hành, chỉ đạo thắng lợi cuộc Tổng tiến công và nổi dậy mùa Xuân 1975.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-hoang-thanh-thang-long'),
    'Khu di tích cách mạng Nhà và Hầm D67',
    'Vai trò chỉ đạo chiến lược của Bộ Chính trị thời chống Mỹ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di sản Văn hóa Thế giới ngày nay', 'Năm 2009, Hoàng thành Thăng Long được xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg của Thủ tướng Chính phủ. Tháng 8/2010, đúng dịp kỷ niệm 1.000 năm Thăng Long - Hà Nội, UNESCO đã vinh danh Khu trung tâm Hoàng thành Thăng Long - Hà Nội là Di sản Văn hóa Thế giới nhờ các giá trị nổi bật toàn cầu về văn hóa và khảo cổ học.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-hoang-thanh-thang-long'),
    'Quyết định 1272/QĐ-TTg và Văn bản ghi nhận UNESCO 2010',
    'Xếp hạng Di tích quốc gia đặc biệt và Di sản thế giới'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Căn cứ địa đầu tiên khi Bác Hồ về nước', 'Ngày 28/1/1941, sau ba mươi năm bôn ba tìm đường cứu nước, Lãnh tụ Nguyễn Ái Quốc đã bí mật vượt qua mốc 108 biên giới Việt - Trung trở về Tổ quốc tại Pác Bó, xã Trường Hà, huyện Hà Quảng, tỉnh Cao Bằng. Người đã chọn núi rừng hiểm trở nơi đây làm căn cứ địa cách mạng đầu tiên để trực tiếp lãnh đạo phong trào giải phóng dân tộc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-pac-bo'),
    'Hồ sơ di tích, mục I: Bối cảnh Bác Hồ về nước 1941',
    'Sự kiện ngày 28/1/1941 tại cột mốc 108'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Nguyễn Ái Quốc về nước lãnh đạo cách mạng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Hội nghị Trung ương 8 và sự ra đời của Mặt trận Việt Minh', 'Từ ngày 10 đến ngày 19/5/1941, tại lán Khuổi Nặm thuộc Pác Bó, Nguyễn Ái Quốc chủ trì Hội nghị lần thứ 8 Ban Chấp hành Trung ương Đảng Cộng sản Đông Dương. Hội nghị đã hoàn chỉnh chủ trương chuyển hướng chỉ đạo chiến lược: đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và thành lập Mặt trận Việt Nam Độc lập Đồng minh (Việt Minh), phát động phong trào đánh Pháp đuổi Nhật sâu rộng trong cả nước.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-pac-bo'),
    'Hồ sơ di tích lán Khuổi Nặm',
    'Hội nghị Trung ương 8 từ ngày 10-19/5/1941'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Chủ trương chuyển hướng chỉ đạo chiến lược tại Hội nghị TW 8'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Dấu tích thiêng liêng và di tích ngày nay', 'Tại Pác Bó, Bác Hồ đã sống và làm việc trong hang Cốc Bó giản dị, Người đặt tên ngọn núi cao phía sau là núi Các Mác và con suối trong vắt chảy qua là suối Lê-nin. Năm 2012, Thủ tướng Chính phủ ký Quyết định số 548/QĐ-TTg xếp hạng Khu di tích lịch sử Pác Bó là Di tích Quốc gia Đặc biệt, trở thành biểu tượng cội nguồn cách mạng vẻ vang của dân tộc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-pac-bo'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Pác Bó'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Chỉ thị thành lập đội quân chủ lực', 'Tháng 12/1944, nhận định thời cơ khởi nghĩa vũ trang đang đến gần nhưng lực lượng phân tán, Lãnh tụ Hồ Chí Minh đã gửi thư chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân. Người căn dặn: ''Tên Đội Việt Nam Tuyên truyền Giải phóng quân nghĩa là chính trị trọng hơn quân sự. Nó là đội tuyên truyền... Tuy lúc đầu quy mô nhỏ, nhưng tiền đồ của nó rất vẻ vang''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-rung-tran-hung-dao'),
    'Chỉ thị thành lập Đội VNTTGPQ của Lãnh tụ Hồ Chí Minh',
    'Nội dung chỉ thị nguyên văn của Bác Hồ tháng 12/1944'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Sự thành lập Đội Việt Nam Tuyên truyền Giải phóng quân'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Buổi lễ tuyên thệ tại rừng Sam Cao', 'Chiều ngày 22/12/1944, tại khu rừng Sam Cao thuộc xã Cẩm Lý (nay là xã Tam Kim, huyện Nguyên Bình, tỉnh Cao Bằng), đồng chí Võ Nguyên Giáp được ủy nhiệm chủ trì lễ thành lập Đội với 34 chiến sĩ kiên trung. Đội biên chế thành 3 tiểu đội, mang theo vũ khí thô sơ cùng lời thề danh dự thiêng liêng ''Hy sinh vì Tổ quốc''. Chỉ ít ngày sau, Đội lập chiến công vang dội đánh thắng hai đồn Phai Khắt và Nà Ngần.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-rung-tran-hung-dao'),
    'Hồ sơ di tích, mục II: Lễ thành lập 22/12/1944',
    '34 chiến sĩ, đồng chí Võ Nguyên Giáp chỉ huy và chiến thắng Phai Khắt, Nà Ngần'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Cội nguồn Quân đội nhân dân Việt Nam', 'Khu di tích lịch sử Rừng Trần Hưng Đạo được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây lưu giữ nguyên vẹn lán nghỉ, bếp ăn Hoàng Cầm, cụm bia tưởng niệm 34 chiến sĩ đầu tiên – cội nguồn sinh thành của Quân đội nhân dân Việt Nam anh hùng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-rung-tran-hung-dao'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Rừng Trần Hưng Đạo'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Thủ đô Khu Giải phóng mùa thu 1945', 'Tháng 5/1945, trước diễn biến mau lẹ của Chiến tranh thế giới thứ hai, Lãnh tụ Hồ Chí Minh cùng các đồng chí lãnh đạo Trung ương chuyển từ Pác Bó về xã Tân Trào, huyện Sơn Dương, tỉnh Tuyên Quang. Tân Trào nhanh chóng trở thành trung tâm đầu não chỉ huy cách mạng, được mệnh danh là ''Thủ đô Khu giải phóng'' liên kết 6 tỉnh căn cứ địa Việt Bắc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-tan-trao'),
    'Hồ sơ di tích lịch sử Tân Trào, mục Tổng quan',
    'Bác Hồ về Tân Trào tháng 5/1945 và thành lập Khu giải phóng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Tân Trào - Thủ đô Khu giải phóng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Quốc dân Đại hội Tân Trào và Lệnh Tổng khởi nghĩa', 'Tại Đình Tân Trào, ngày 16 và 17/8/1945, Quốc dân Đại hội lịch sử đã họp và nhất trí tán thành chủ trương Tổng khởi nghĩa của Đảng, thông qua 10 chính sách lớn của Việt Minh, bầu Ủy ban Dân tộc Giải phóng Việt Nam (tức Chính phủ lâm thời) do đồng chí Hồ Chí Minh làm Chủ tịch. Chiều 16/8/1945, dưới bóng Cây đa Tân Trào, đồng chí Võ Nguyên Giáp đọc Quân lệnh số 1 làm lễ xuất quân tiến về giải phóng Thái Nguyên.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-tan-trao'),
    'Hồ sơ di tích Đình Tân Trào và Cây đa Tân Trào',
    'Quốc dân Đại hội 16-17/8/1945 và lễ xuất quân'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Quân lệnh số 1 và Quốc dân Đại hội Tân Trào'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Tân Trào được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể di tích bao gồm cụm lán Nà Nưa (nơi Bác Hồ ở và làm việc), đình Tân Trào, đình Hồng Thái và cây đa Tân Trào, là địa chỉ đỏ giáo dục truyền thống cách mạng thiêng liêng cho thế hệ trẻ cả nước.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-tan-trao'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Tân Trào'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vị trí địa đầu thiêng liêng của Tổ quốc', 'Cột cờ Quốc gia Lũng Cú tọa lạc trên đỉnh núi Rồng (Long Sơn) có độ cao 1.470 mét so với mực nước biển, thuộc xã Lũng Cú, huyện Đồng Văn (khu vực địa đầu phía Bắc Tổ quốc). Đây là điểm cực Bắc ghi dấu chủ quyền lãnh thổ thiêng liêng của quốc gia, nơi ''mỗi tấc đất đều thấm đẫm mồ hôi và xương máu của các thế hệ cha anh giữ gìn bờ cõi''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-cot-co-lung-cu'),
    'Hồ sơ danh thắng Cột cờ Lũng Cú, phần vị trí địa lý',
    'Độ cao 1.470m và tọa độ điểm cực Bắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Lịch sử cắm cờ và lá cờ 54 mét vuông', 'Theo truyền tích lịch sử, cột cờ đầu tiên được dựng từ thời Thái úy Lý Thường Kiệt khi Người đem quân tuần tiễu vùng biên ải. Trải qua các thời kỳ, cột cờ được quân và dân ta kiên cường bảo vệ và tôn tạo vững chắc. Lá cờ đỏ sao vàng tung bay kiêu hãnh trên đỉnh cột cờ có diện tích đúng 54 mét vuông, tượng trưng cho khối đại đoàn kết bền chặt của 54 dân tộc anh em trên dải đất Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-cot-co-lung-cu'),
    'Hồ sơ kiến trúc và quy chuẩn lá cờ 54m2',
    'Ý nghĩa diện tích 54m2 biểu trưng cho 54 dân tộc Việt Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích lịch sử và danh thắng quốc gia', 'Cột cờ Lũng Cú được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích lịch sử và danh lam thắng cảnh Quốc gia năm 2009. Công trình cột cờ hiện nay cao 33,15m với phần chân bệ bát giác gắn 8 bức phù điêu đá xanh tinh xảo tái hiện trang sử hào hùng dựng nước và giữ nước cùng nét đẹp văn hóa truyền thống của đồng bào vùng cao biên viễn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-cot-co-lung-cu'),
    'Quyết định xếp hạng Di tích quốc gia năm 2009',
    'Xếp hạng cấp quốc gia và thông số kỹ thuật công trình'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cứ điểm yết hầu của Điện Biên Phủ', 'Đồi A1 (tên mật danh quân sự của Pháp: Eliane 2) là cứ điểm phòng ngự quan trọng bậc nhất trong phân khu trung tâm của Tập đoàn cứ điểm Điện Biên Phủ. Nằm trên dãy đồi phía đông khống chế trực tiếp lòng chảo Mường Thanh và Sở chỉ huy tập đoàn cứ điểm, quân đội viễn chinh Pháp đã bố trí tại đây hệ thống hầm ngầm bê tông cốt thép kiên cố, nhiều tầng hỏa lực đan xen và hàng rào dây thép gai dày đặc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-doi-a1'),
    'Hồ sơ di tích cứ điểm đồi A1, mục Cấu trúc quân sự',
    'Vị trí chiến lược và hệ thống công sự Eliane 2 của Pháp'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Tập đoàn cứ điểm Điện Biên Phủ và vị thế cứ điểm đồi A1'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, '39 ngày đêm quyết chiến và tiếng nổ bộc phá lịch sử', 'Trận chiến giành giật đồi A1 giữa cán bộ, chiến sĩ Trung đoàn 174 (Đại đoàn 316) cùng Trung đoàn 102 (Đại đoàn 308) với quân Pháp kéo dài ác liệt suốt 39 ngày đêm (từ 30/3 đến sáng 7/5/1954). Quyết tâm đánh sập lô cốt ngầm của địch, tổ công binh của ta đã kiên trì đào một đường hầm dài 47m ăn sâu vào lòng đồi để đặt khối bộc phá gần 1.000kg thuốc nổ. Đúng 20 giờ 30 phút đêm 6/5/1954, khối bộc phá phát nổ làm rung chuyển quả đồi, thổi bay hầm ngầm chỉ huy địch, mở đường cho quân ta xung phong tiêu diệt toàn bộ cứ điểm lúc 4 giờ 30 sáng ngày 7/5/1954.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-doi-a1'),
    'Hồ sơ chiến lệ đồi A1, diễn biến 30/3 - 7/5/1954',
    'Thời gian đào hầm ngầm, khối bộc phá 960kg và thời điểm nổ đêm 6/5'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Diễn biến đợt tiến công tiêu diệt cứ điểm A1 mở đường giải phóng Mường Thanh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Cứ điểm Đồi A1 là thành phần trung tâm của Quần thể Di tích Quốc gia Đặc biệt Chiến trường Điện Biên Phủ theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009 của Thủ tướng Chính phủ. Hiện nay trên đỉnh đồi vẫn còn nguyên vẹn hố phễu bộc phá sâu hoắm lịch sử, xác xe tăng Bazeille của Pháp bị bắn cháy và đài tưởng niệm tri ân những anh hùng liệt sĩ đã ngã xuống vì độc lập tự do của Tổ quốc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-doi-a1'),
    'Quyết định số 1272/QĐ-TTg ngày 12/8/2009',
    'Xếp hạng Di tích quốc gia đặc biệt Chiến trường Điện Biên Phủ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ham-de-castries';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Đầu não chỉ huy của quân viễn chinh Pháp', 'Hầm chỉ huy của Thiếu tướng Christian de Castries nằm ở trung tâm lòng chảo Mường Thanh, cánh đồng Điện Biên. Hầm được thiết kế kiên cố bằng vòm thép gợn sóng dày đúc sẵn, phủ các lớp bao cát và đất dày chống đạn pháo hạng nặng, chung quanh có 4 cỗ xe tăng túc trực bảo vệ cùng mạng lưới chiến hào tỏa đi khắp phân khu trung tâm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ham-de-castries'),
    'Hồ sơ di tích Hầm De Castries, mô tả kiến trúc',
    'Vật liệu vòm thép, kích thước và hệ thống phòng thủ quanh hầm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Sở chỉ huy tập đoàn cứ điểm Mường Thanh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ham-de-castries';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Thời khắc bắt sống tướng De Castries và lá cờ Quyết chiến Quyết thắng', 'Khoảng 17 giờ ngày 7/5/1954, tổ xung kích của Đại đội 360, Trung đoàn 209 (Đại đoàn 312) do Đại đội trưởng Tạ Quốc Luật chỉ huy đã vượt qua cầu Mường Thanh tiến thẳng vào Sở chỉ huy địch. Đồng chí Tạ Quốc Luật cùng các chiến sĩ Hoàng Đăng Vinh, Bùi Văn Nhỏ đã xông vào hầm bắt sống tướng De Castries cùng toàn bộ bộ tham mưu tập đoàn cứ điểm. Đúng 17 giờ 30 phút, lá cờ ''Quyết chiến - Quyết thắng'' của quân đội ta tung bay kiêu hãnh trên nóc hầm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ham-de-castries'),
    'Hồ sơ di tích, diễn biến chiều ngày 7/5/1954',
    'Tổ xung kích đồng chí Tạ Quốc Luật bắt sống bộ chỉ huy Pháp lúc 17h30'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Toàn thắng Chiến dịch Điện Biên Phủ ngày 7/5/1954'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ham-de-castries';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích ngày nay', 'Hầm De Castries được giữ gìn nguyên trạng vòm thép kiên cố và bao cát bảo vệ trong Quần thể Di tích Quốc gia Đặc biệt Chiến trường Điện Biên Phủ. Đây là một trong những điểm tham quan lịch sử thu hút đông đảo du khách quốc tế khi đến Điện Biên để tận mắt chứng kiến nơi sụp đổ của chủ nghĩa thực dân cũ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ham-de-castries'),
    'Bảo tồn di tích Chiến trường Điện Biên Phủ',
    'Hiện trạng bảo tồn và quản lý du lịch'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Mưu đồ của thực dân Pháp tại vùng Tây Bắc', 'Thu Đông năm 1953, thực dân Pháp triển khai Kế hoạch Nava nhằm đảo ngược cục diện chiến tranh. Trên hướng Tây Bắc, Pháp ráo riết củng cố thị xã Lai Châu làm bàn đạp chiếm đóng, khống chế đồng bào các dân tộc thiểu số và ngăn chặn các tuyến vận tải tiếp tế của ta sang Thượng Lào.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-qdnd-lai-chau-1953'),
    'Chuyên đề lịch sử Đảng bộ tỉnh Lai Châu, phần Kháng chiến chống Pháp',
    'Âm mưu của Pháp tại Tây Bắc và Kế hoạch Nava'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Chủ trương tác chiến Đông - Xuân 1953-1954 của Trung ương Đảng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Chiến dịch tiến công giải phóng Lai Châu ngày 12/12/1953', 'Thực hiện quyết định tác chiến chiến lược Đông - Xuân 1953 - 1954, Bộ Tổng Tư lệnh giao Đại đoàn 316 cùng các lực lượng vũ trang địa phương mở cuộc tiến công vào Lai Châu. Trước sức ép thần tốc và áp đảo của bộ đội ta, ngày 12/12/1953, quân địch buộc phải bỏ chạy khỏi thị xã Lai Châu. Quân ta nhanh chóng truy kích tiêu diệt tàn quân địch trên đường rút chạy về Điện Biên Phủ, giải phóng hoàn toàn thị xã Lai Châu rộng lớn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-qdnd-lai-chau-1953'),
    'Báo Quân đội nhân dân: Chiến thắng giải phóng Lai Châu năm 1953',
    'Diễn biến ngày 12/12/1953 và cuộc truy kích tàn quân Pháp'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Ý nghĩa chiến lược mở màn cho Điện Biên Phủ', 'Thắng lợi Giải phóng Lai Châu ngày 12/12/1953 có ý nghĩa chiến lược đặc biệt to lớn: đập tan ý đồ củng cố vùng Tây Bắc của Pháp, buộc Tổng chỉ huy Navarre phải vội vã điều động lực lượng cơ động nhảy dù tăng viện xuống thung lũng Mường Thanh. Kế hoạch ban đầu của Pháp bị đảo lộn hoàn toàn, biến Điện Biên Phủ thành ''tập đoàn cứ điểm'' cô lập bị quân ta vây hãm và tiêu diệt.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-qdnd-lai-chau-1953'),
    'Báo Quân đội nhân dân, ý nghĩa chiến lược',
    'Buộc Nava điều quân nhảy dù xuống Điện Biên Phủ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Bước phân tán lực lượng địch trong Đông - Xuân 1953-1954'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-son-la';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Địa ngục trần gian nơi rừng thiêng nước độc', 'Năm 1908, thực dân Pháp xây dựng Nhà tù Sơn La trên đỉnh đồi Khau Cả (thị xã Sơn La) và mở rộng quy mô lớn vào các năm 1930, 1940. Với khí hậu khắc nghiệt rừng thiêng nước độc và chế độ giam cầm tàn bạo, thực dân Pháp toan tính dùng bệnh tật và lao động khổ sai để triệt hạ thể xác và ý chí chiến đấu của các chiến sĩ cộng sản Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-son-la'),
    'Hồ sơ di tích, mục I: Quá trình xây dựng 1908-1940',
    'Thời gian xây dựng trên đỉnh đồi Khau Cả và chế độ giam cầm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Hệ thống nhà tù đày ải tù chính trị của thực dân Pháp'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-son-la';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Chi bộ Nhà tù và Cây đào Tô Hiệu bất tử', 'Tháng 12/1939, chi bộ Đảng Cộng sản tại Nhà tù Sơn La được bí mật thành lập do đồng chí Tô Hiệu làm Bí thư. Chi bộ đã kiên trì lãnh đạo anh em tù nhân tuyệt thực đòi dân sinh, xuất bản báo bí mật, biến chốn ngục tù thành trường đào tạo lý luận cách mạng cho nhiều cán bộ lãnh đạo ưu tú của Đảng như Trường Chinh, Lê Duẩn, Nguyễn Lương Bằng, Văn Tiến Dũng. Dù bị bệnh lao nặng và bị giam trong xà lim tối tăm, đồng chí Tô Hiệu vẫn kiên cường giữ vững khí tiết cho đến hơi thở cuối cùng vào tháng 3/1944. Cây đào do Người chăm sóc bên góc tường xà lim đã trở thành biểu tượng bất tử của tinh thần lạc quan cách mạng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-son-la'),
    'Hồ sơ di tích, mục II: Chi bộ nhà tù và tấm gương đồng chí Tô Hiệu',
    'Thành lập chi bộ tháng 12/1939 và biểu tượng cây đào Tô Hiệu'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-son-la';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ghi nhận giá trị lịch sử đặc biệt to lớn, ngày 31/12/2014, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg xếp hạng Nhà tù Sơn La là Di tích Quốc gia Đặc biệt. Quần thể di tích ngày nay lưu giữ các xà lim ngầm, cổng nhà lao cổ và gốc đào Tô Hiệu vẫn đơm hoa rực rỡ mỗi dịp xuân về giữa lòng thành phố Sơn La.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-son-la'),
    'Quyết định số 2408/QĐ-TTg ngày 31/12/2014',
    'Xếp hạng Di tích quốc gia đặc biệt Nhà tù Sơn La'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Bối cảnh khởi nghĩa vũ trang đầu năm 1930', 'Sau vụ ám sát tên trùm mộ phu Bazin ở Hà Nội đầu năm 1929, thực dân Pháp tăng cường khủng bố gắt gao nhằm triệt phá tổ chức Việt Nam Quốc dân Đảng. Trước nguy cơ bị tiêu diệt hoàn toàn, các đồng chí lãnh đạo tổ chức do Nguyễn Thái Học đứng đầu đã quyết định phát động cuộc khởi nghĩa vũ trang quyết tử với tinh thần ''Không thành công cũng thành nhân''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-yen-bai'),
    'Hồ sơ di tích, mục I: Bối cảnh khởi nghĩa 1930',
    'Sự đàn áp của Pháp và quyết định khởi nghĩa của Việt Nam Quốc dân Đảng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Việt Nam Quốc dân Đảng và cuộc Khởi nghĩa Yên Bái'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đêm sấm sét 9 rạng sáng 10/2/1930 và tấm gương nghĩa sĩ', 'Đêm ngày 9 rạng sáng ngày 10/2/1930, tiếng súng khởi nghĩa đồng loạt nổ ra tại tỉnh lỵ Yên Bái. Nghĩa quân dũng cảm tấn công chiếm đồn lính khố đỏ và dinh công sứ Pháp. Dù cuộc khởi nghĩa sau đó bị thực dân Pháp đàn áp khốc liệt và sáng ngày 17/6/1930, Nguyễn Thái Học cùng 12 nghĩa sĩ anh dũng bước lên máy chém tại thị xã Yên Bái, câu khẩu hiệu bất hủ và tinh thần quả cảm của các nghĩa sĩ đã làm rung chuyển bộ máy thống trị thực dân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-yen-bai'),
    'Hồ sơ di tích, mục II: Diễn biến khởi nghĩa và ngày 17/6/1930',
    'Diễn biến đêm 9 rạng sáng 10/2/1930 và 13 nghĩa sĩ bước lên máy chém'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Ý nghĩa cuộc Khởi nghĩa Yên Bái và bài học lịch sử'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Khu tưởng niệm Di tích Quốc gia ngày nay', 'Khu di tích lịch sử lăng mộ và tượng đài Nguyễn Thái Học cùng các nghĩa sĩ Khởi nghĩa Yên Bái tọa lạc tại công viên Yên Hòa (phường Hồng Hà, tỉnh Yên Bái cũ, nay thuộc địa bàn Lào Cai). Di tích được xếp hạng Di tích Lịch sử Quốc gia năm 1990, là nơi nhân dân cả nước thành kính tưởng niệm những tấm lòng ái quốc kiên trung.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-yen-bai'),
    'Quyết định xếp hạng Di tích Lịch sử Quốc gia năm 1990',
    'Xếp hạng cấp quốc gia và công trình tượng đài tưởng niệm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Thủ đô Gió ngàn của cuộc kháng chiến toàn quốc', 'Sau Ngày Toàn quốc kháng chiến (19/12/1946), Chủ tịch Hồ Chí Minh cùng các cơ quan đầu não của Trung ương Đảng, Chính phủ và Quân đội đã di chuyển lên vùng rừng núi Việt Bắc, chọn vùng đất Định Hóa (Thái Nguyên) làm An toàn khu (ATK) trung tâm. Với vị thế ''tiến khả dĩ công, thoái khả dĩ thủ'', ATK Định Hóa trở thành trái tim đầu não chỉ đạo cuộc kháng chiến trường kỳ chống thực dân Pháp.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-dinh-hoa'),
    'Hồ sơ di tích ATK Định Hóa, phần Tổng quan',
    'Chọn Định Hóa làm An toàn khu trung ương năm 1947'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Căn cứ địa Việt Bắc và Thủ đô kháng chiến'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Quyết định lịch sử mở Chiến dịch Điện Biên Phủ tại lán Tỉn Keo', 'Ngày 6/12/1953, tại lán Tỉn Keo dưới chân đèo De (xã Phú Đình, huyện Định Hóa), Chủ tịch Hồ Chí Minh đã chủ trì cuộc họp mang tính bước ngoặt của Bộ Chính trị. Tại đây, Bộ Chính trị đã thông qua kế hoạch tác chiến Đông - Xuân 1953 - 1954 và quyết định chọn Điện Biên Phủ làm điểm quyết chiến chiến lược tiêu diệt tập đoàn cứ điểm quân sự của Pháp, cử Đại tướng Võ Nguyên Giáp làm Tổng Tư lệnh chiến dịch.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-dinh-hoa'),
    'Hồ sơ di tích Lán Tỉn Keo, cuộc họp ngày 6/12/1953',
    'Cuộc họp Bộ Chính trị thông qua quyết định mở Chiến dịch Điện Biên Phủ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Hội nghị Bộ Chính trị tại Tỉn Keo (Định Hóa) ngày 6/12/1953'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử ATK Định Hóa được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể gồm 128 điểm di tích lịch sử phân bố trên địa bàn huyện Định Hóa, trong đó nổi bật là lán Tỉn Keo, đồi Khau Tý (nơi ở đầu tiên của Bác khi về Định Hóa) và đồi Pò Kỹ (nơi đồng chí Trường Chinh làm việc).', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-dinh-hoa'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt ATK Định Hóa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-cho-don';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vành đai thép bảo vệ cơ quan Trung ương', 'Nằm tiếp giáp với Định Hóa (Thái Nguyên) và Sơn Dương (Tuyên Quang), ATK Chợ Đồn (thuộc tỉnh Bắc Kạn cũ, nay nằm trong phân vùng căn cứ cách mạng Thái Nguyên) sở hữu địa thế núi non trùng điệp hiểm trở. Nơi đây giữ vai trò là hậu cứ an toàn tuyệt đối, hình thành nên tam giác căn cứ địa cách mạng trung tâm của toàn chiến khu Việt Bắc trong kháng chiến chống Pháp.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-cho-don'),
    'Hồ sơ di tích ATK Chợ Đồn, phần Địa thế chiến lược',
    'Vị trí tiếp giáp Định Hóa - Sơn Dương và tam giác ATK Việt Bắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-cho-don';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nơi ở và làm việc của Bác Hồ và cơ quan đầu não', 'Trong những năm tháng kháng chiến 1947–1952, Chủ tịch Hồ Chí Minh, Tổng Bí thư Trường Chinh, Thủ tướng Phạm Văn Đồng và các cơ quan Bộ Tổng Tư lệnh, Trung ương Hội Phụ nữ, Đài Tiếng nói Việt Nam đã từng đóng quân, sống và làm việc tại các thôn bản Nà Pậu, Bản Ca, Khuổi Linh, đồi Khau Mạ để lãnh đạo quân dân cả nước chiến đấu.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-cho-don'),
    'Hồ sơ di tích, mục II: Các điểm di tích Bác Hồ và TW Đảng',
    'Các điểm dừng chân Nà Pậu, Bản Ca, đồi Khau Mạ của lãnh đạo Đảng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-cho-don';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ngày 22/12/2016, Thủ tướng Chính phủ đã ký Quyết định số 2499/QĐ-TTg xếp hạng Khu di tích lịch sử An toàn khu (ATK) Chợ Đồn là Di tích Quốc gia Đặc biệt. Quần thể bao gồm 25 điểm di tích phân bố tại các xã Lương Bằng, Nghĩa Tá, Bản Thi, lưu giữ những ký ức sâu đậm về tình cảm gắn bó thủy chung giữa Đảng, Bác Hồ với đồng bào các dân tộc thiểu số vùng cao.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-cho-don'),
    'Quyết định số 2499/QĐ-TTg ngày 22/12/2016',
    'Xếp hạng Di tích quốc gia đặc biệt ATK Chợ Đồn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Bối cảnh khởi nghĩa vũ trang mùa thu 1940', 'Tháng 9/1940, phát xít Nhật đánh chiếm Lạng Sơn, quân đội thực dân Pháp thua chạy tán loạn qua địa bàn châu Bắc Sơn. Nắm bắt thời cơ quân địch hoang mang tan rã, Đảng bộ Bắc Sơn đã kịp thời vận động nhân dân các dân tộc nổi dậy tước vũ khí của tàn quân Pháp để chuẩn bị khởi nghĩa.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-bac-son'),
    'Hồ sơ di tích, mục I: Bối cảnh lịch sử',
    'Sự kiện Nhật đánh Lạng Sơn tháng 9/1940 và thời cơ khởi nghĩa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Khởi nghĩa Bắc Sơn tháng 9/1940'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đêm tấn công đồn Mỏ Nhài và sự ra đời của Đội Du kích Bắc Sơn', 'Tối ngày 27/9/1940, dưới sự lãnh đạo của Đảng bộ, nhân dân và tự vệ các dân tộc Tày, Nùng, Dao đã vũ trang tiến công chiếm đồn Mỏ Nhài (châu lỵ Bắc Sơn), trừng trị tay sai gian ác và thành lập chính quyền cách mạng nhân dân. Sau đó, Đội Du kích Bắc Sơn được thành lập – một trong những lực lượng tiền thân trực tiếp của Đội Cứu quốc quân và Quân đội nhân dân Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-bac-son'),
    'Hồ sơ di tích, mục II: Tiến công đồn Mỏ Nhài',
    'Diễn biến đêm 27/9/1940 và sự ra đời Đội Du kích Bắc Sơn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Ý nghĩa Đội Cứu quốc quân hình thành từ khởi nghĩa Bắc Sơn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ghi nhận giá trị lịch sử vẻ vang mở đầu thời kỳ đấu tranh vũ trang giải phóng dân tộc, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg ngày 31/12/2014 xếp hạng Địa điểm Khởi nghĩa Bắc Sơn là Di tích Quốc gia Đặc biệt. Quần thể bảo tồn đồn Mỏ Nhài, đình Nông Lục và Bảo tàng Khởi nghĩa Bắc Sơn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-bac-son'),
    'Quyết định số 2408/QĐ-TTg ngày 31/12/2014',
    'Xếp hạng Di tích quốc gia đặc biệt Địa điểm Khởi nghĩa Bắc Sơn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ai-chi-lang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Hẻm ải hiểm trở cửa ngõ phương Bắc', 'Thung lũng Chi Lăng dài hơn 20km, rộng chừng 3km, hai bên được bao bọc bởi dãy núi đá vôi Cai Kinh hiểm trở và dãy núi đất Thái Hòa, ở giữa có sông Thương uốn lượn. Địa thế ''trời cho'' hiểm trở nơi đây đã biến Chi Lăng thành cửa ải yết hầu phòng thủ phương Bắc quan trọng bậc nhất của các triều đại phong kiến Đại Việt.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ai-chi-lang'),
    'Hồ sơ di tích, mục Địa thế thung lũng Chi Lăng',
    'Mô tả địa thế hiểm yếu núi Cai Kinh và ải Chi Lăng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ai-chi-lang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trận địa chém Liễu Thăng vang dội sử sách năm 1427', 'Chi Lăng ghi dấu nhiều chiến công chống giặc ngoại xâm từ thời Lê Hoàn (981), Lý Thường Kiệt (1077), và đỉnh cao là trận phục kích tiêu diệt 10 vạn viện binh nhà Minh năm 1427. Sáng ngày 10/10/1427, nghĩa quân Lam Sơn dưới sự chỉ huy của các tướng Trần Lựu, Lê Sát đã nhử Tổng binh Liễu Thăng vào đầm lầy chân núi Mã Yên và chém đầu viên tướng chỉ huy giặc, làm tan rã hoàn toàn đạo quân xâm lược.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ai-chi-lang'),
    'Hồ sơ chiến trận Chi Lăng - Xương Giang 1427',
    'Trận phục kích núi Mã Yên chém đầu Liễu Thăng ngày 10/10/1427'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Truyền thống đánh giặc giữ nước của dân tộc',
    'Nghệ thuật quân sự trận Chi Lăng năm 1427'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ai-chi-lang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Chi Lăng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2408/QĐ-TTg ngày 31/12/2014. Quần thể gồm 24 điểm di tích tiêu biểu như núi Mã Yên, quỷ môn quan, đền Chầu Lục và Nhà bảo tàng chiến thắng Chi Lăng khang trang.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ai-chi-lang'),
    'Quyết định số 2408/QĐ-TTg ngày 31/12/2014',
    'Xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Chi Lăng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cái nôi tôi luyện phong trào công nhân mỏ', 'Mỏ than Đèo Nai tại Cẩm Phả là một trong những mỏ khai thác than lộ thiên lâu đời và quy mô lớn nhất vùng than Quảng Ninh thời Pháp thuộc. Dưới chế độ lao dịch khắc nghiệt và bị bóc lột kiệt quệ, hàng vạn thợ mỏ nơi đây đã sớm đoàn kết, hình thành nên bản lĩnh chiến đấu quật cường của giai cấp công nhân Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-mo-than-deo-nai'),
    'Hồ sơ di tích Mỏ than Đèo Nai, phần Lịch sử giai cấp công nhân mỏ',
    'Quá trình khai thác than và phong trào công nhân Cẩm Phả'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Phong trào đấu tranh của công nhân mỏ than Quảng Ninh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đỉnh cao Tổng bãi công 1936 và sự kiện Bác Hồ về thăm', 'Tháng 11/1936, cuộc Tổng bãi công của hơn 3 vạn thợ mỏ Cẩm Phả - Hòn Gai bùng nổ với khẩu hiệu bất hủ ''Kỷ luật và Đồng tâm'', buộc chủ mỏ Pháp phải nhượng bộ tăng lương giảm giờ làm. Ngày 30/3/1959, Chủ tịch Hồ Chí Minh đã về thăm mỏ than Đèo Nai, trực tiếp lên tận tầng than số 10 nói chuyện và căn dặn cán bộ công nhân đẩy mạnh sản xuất than phục vụ xây dựng chủ nghĩa xã hội.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-mo-than-deo-nai'),
    'Hồ sơ di tích, mục Sự kiện Bác Hồ về thăm ngày 30/3/1959',
    'Bác Hồ thăm tầng than số 10 và khẩu hiệu Kỷ luật và Đồng tâm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)',
    'Phong trào thi đua lao động sản xuất công nghiệp miền Bắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Địa điểm Bác Hồ về thăm Mỏ than Đèo Nai được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1989. Tại đây, tượng đài Bác Hồ và nhà lưu niệm truyền thống thợ mỏ được xây dựng uy nghiêm, trở thành niềm tự hào bất diệt của các thế hệ thợ mỏ Vùng than Quảng Ninh anh hùng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-mo-than-deo-nai'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1989',
    'Xếp hạng cấp quốc gia và quản lý di tích'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Dòng sông lịch sử ba lần đại thắng giặc ngoại xâm', 'Sông Bạch Đằng là dòng sông huyền thoại chảy qua địa phận Quảng Ninh và Hải Phòng, đổ ra vịnh Bắc Bộ. Nơi đây đã ghi dấu ba chiến công thủy chiến hiển hách bậc nhất của dân tộc: Ngô Quyền đại phá quân Nam Hán (938), Lê Hoàn đánh tan quân Tống (981) và Hưng Đạo Đại vương Trần Quốc Tuấn đập tan đạo thuyền chiến quân Nguyên Mông (1288).', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-bach-dang'),
    'Hồ sơ di tích quốc gia đặc biệt Bạch Đằng, phần Tổng quan',
    'Ba chiến thắng lẫy lừng 938, 981 và 1288 trên sông Bạch Đằng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Lịch sử truyền thống chống ngoại xâm Đại Việt',
    'Chiến thắng Bạch Đằng năm 1288 của quân dân nhà Trần'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nghệ thuật bãi cọc ngầm độc đáo của Hưng Đạo Vương', 'Tháng 4/1288, nắm vững quy luật thủy triều, Hưng Đạo Đại vương Trần Quốc Tuấn đã chỉ huy đóng hàng ngàn cây cọc gỗ lim vót nhọn bịt sắt cắm chìm dưới lòng sông Bạch Đằng. Khi thủy triều rút nhanh, quân ta tổng phản công dồn thuyền giặc vào bãi cọc nhô lên làm đắm vỡ hàng trăm chiến thuyền, bắt sống tướng giặc Ô Mã Nhi, đập tan mưu đồ xâm lược của đế chế Mông Cổ hùng mạnh.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-bach-dang'),
    'Khảo cổ học bãi cọc Yên Hưng và Đồng Má Ngựa',
    'Kỹ thuật vót cọc gỗ và thời điểm thủy triều rút tháng 4/1288'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Chiến thắng Bạch Đằng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1419/QĐ-TTg ngày 27/9/2012. Quần thể bảo tồn các bãi cọc khảo cổ Yên Hưng, Đồng Má Ngựa cùng đền Trần Hưng Đạo và miếu Vua Bà linh thiêng bên bờ sông.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-bach-dang'),
    'Quyết định số 1419/QĐ-TTg ngày 27/9/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Bạch Đằng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'An toàn khu đầu não kết nối Thủ đô với chiến khu', 'Đầu những năm 1940, trước sự khủng bố gắt gao của thực dân Pháp tại Hà Nội, Trung ương Đảng đã quyết định xây dựng An toàn khu số 2 (ATK II) tại vùng đất ven sông Cầu thuộc Hiệp Hòa. Nơi đây sở hữu vị trí hiểm yếu, là bàn đạp chiến lược tiếp giáp vùng trung du và đồng bằng Bắc Bộ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-ii-hiep-hoa'),
    'Hồ sơ di tích ATK II Hiệp Hòa, phần Bối cảnh thành lập',
    'Xây dựng ATK II giai đoạn 1940-1945 và vị trí ven sông Cầu'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Hệ thống an toàn khu bảo vệ cơ quan đầu não Trung ương'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nuôi giấu các đồng chí lãnh đạo Trung ương thời kỳ tiền khởi nghĩa', 'Nhân dân các làng soi Hiệp Hòa đã một lòng trung kiên che chở, bảo vệ an toàn tuyệt đối cho các đồng chí lãnh đạo chủ chốt của Đảng như Tổng Bí thư Trường Chinh, Hoàng Quốc Việt, Võ Nguyên Giáp, Lê Đức Thọ. Nhiều hội nghị quân sự quan trọng đã được tổ chức tại đây để chuẩn bị lực lượng chớp thời cơ Tổng khởi nghĩa Tháng Tám 1945.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-ii-hiep-hoa'),
    'Hồ sơ di tích, mục Hoạt động của lãnh đạo Đảng',
    'Các đồng chí Trường Chinh, Hoàng Quốc Việt, Võ Nguyên Giáp làm việc tại ATK II'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ngày 31/12/2020, Thủ tướng Chính phủ ký Quyết định số 2280/QĐ-TTg xếp hạng Khu di tích lịch sử An toàn khu (ATK) II Hiệp Hòa là Di tích Quốc gia Đặc biệt. Quần thể bảo tồn cụm di tích đình Chợ Vân, đình Xuân Biều, nhà lưu niệm cụ Đặng Thị Ban, là minh chứng cho lòng dân sắt son theo Đảng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-atk-ii-hiep-hoa'),
    'Quyết định số 2280/QĐ-TTg ngày 31/12/2020',
    'Xếp hạng Di tích quốc gia đặc biệt An toàn khu (ATK) II Hiệp Hòa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Phong trào nông dân vũ trang bền bỉ nhất lịch sử chống Pháp', 'Khởi nghĩa Yên Thế (1884–1913) bùng nổ tại vùng rừng núi Yên Thế hiểm trở, kéo dài gần 30 năm chống lại ách cai trị của thực dân Pháp. Đây là phong trào vũ trang tự phát của giai cấp nông dân lớn nhất và kiên cường nhất thời kỳ cận đại Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-yen-the'),
    'Hồ sơ di tích Khởi nghĩa Yên Thế, phần Tổng quan',
    'Quy mô và thời gian kéo dài 30 năm (1884-1913)'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 11: Phong trào yêu nước chống Pháp cuối thế kỷ XIX đầu thế kỷ XX',
    'Khởi nghĩa Yên Thế và tài thao lược của Hoàng Hoa Thám'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Thủ lĩnh Đề Thám và căn cứ đồn Phồn Xương', 'Dưới sự lãnh đạo của Lương Văn Nắm (Đề Nắm) và sau đó là Hoàng Hoa Thám (Đề Thám - ''Hùm xám Yên Thế''), nghĩa quân đã xây dựng hệ thống đồn lũy Phồn Xương kiên cố, áp dụng lối đánh du kích linh hoạt, hai lần buộc thực dân Pháp phải giảng hòa và gây cho quân đội viễn chinh Pháp nhiều tổn thất nặng nề.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-yen-the'),
    'Hồ sơ di tích Đồn Phồn Xương',
    'Xây dựng căn cứ Phồn Xương và hai lần buộc Pháp giảng hòa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ghi nhận tinh thần quật cường của nghĩa quân Yên Thế, Thủ tướng Chính phủ đã ký Quyết định số 548/QĐ-TTg ngày 10/5/2012 xếp hạng Những địa điểm Khởi nghĩa Yên Thế là Di tích Quốc gia Đặc biệt. Quần thể gồm đồn Phồn Xương, đền Thề, đình Hả và Tượng đài Hoàng Hoa Thám uy nghiêm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-yen-the'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Những địa điểm Khởi nghĩa Yên Thế'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Mưu đồ hành quân Léa của giặc Pháp lên Việt Bắc', 'Thu Đông năm 1947, thực dân Pháp mở chiến dịch hành quân lớn mang tên Léa đánh lên căn cứ địa Việt Bắc nhằm tiêu diệt cơ quan đầu não kháng chiến và bộ đội chủ lực của ta. Một cánh quân thủy do binh đoàn Commando sông của Pháp chỉ huy ngược dòng sông Lô tiến lên Tuyên Quang hòng khép chặt vòng vây.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-song-lo'),
    'Hồ sơ di tích, mục Âm mưu chiến dịch Léa của Pháp',
    'Kế hoạch tiến quân ngược sông Lô của thực dân Pháp thu đông 1947'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Chiến dịch Việt Bắc Thu - Đông 1947'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trận phục kích pháo binh bắn chìm tàu chiến giặc ngày 24/10/1947', 'Trưa ngày 24/10/1947, tại ngã ba Đoan Hùng (Phú Thọ), bộ đội pháo binh ta phối hợp cùng bộ binh đã bí mật kéo pháo ra sát mép nước, bắn ngắm trực tiếp vào đoàn tàu chiến Pháp đang xuôi dòng sông Lô. Trong chốc lát, 2 tàu chiến giặc bị bắn chìm tại chỗ, 2 tàu khác bị bắn cháy hư hỏng nặng, bẻ gãy hoàn toàn gọng kìm đường thủy của quân Pháp.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-song-lo'),
    'Hồ sơ trận đánh Sông Lô ngày 24/10/1947',
    'Bắn chìm 2 tàu chiến và bắn cháy 2 tàu khác của Pháp'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Chiến thắng Đoan Hùng trên sông Lô ngày 24/10/1947'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Tượng đài Chiến thắng Sông Lô ngày nay', 'Chiến thắng Sông Lô đã đi vào lịch sử và âm nhạc như một bản anh hùng ca bất diệt. Địa điểm Tượng đài Chiến thắng Sông Lô sừng sững trên đỉnh đồi thị trấn Đoan Hùng được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1982, là niềm tự hào to lớn của quân và dân Phú Thọ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-song-lo'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1982',
    'Xếp hạng cấp quốc gia Tượng đài Chiến thắng Sông Lô'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cội nguồn tổ tiên ngàn năm dựng nước', 'Khu di tích lịch sử Đền Hùng tọa lạc trên núi Nghĩa Lĩnh (núi Hùng), thuộc thành phố Việt Trì, tỉnh Phú Thọ. Nơi đây là trung tâm chính trị văn hóa của nhà nước Văn Lang cổ đại dưới thời 18 đời Vua Hùng dựng nước – cội nguồn linh thiêng của cộng đồng các dân tộc Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-den-hung'),
    'Hồ sơ di tích quốc gia đặc biệt Đền Hùng, phần Cội nguồn',
    'Thời kỳ các Vua Hùng dựng nước Văn Lang trên đất Phong Châu'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Cội nguồn văn hóa và nhà nước thời Hùng Vương',
    'Vị thế biểu tượng cội nguồn dân tộc của Đền Hùng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Lời căn dặn bất hủ của Bác Hồ năm 1954', 'Ngày 19/9/1954, trước khi Đại đoàn Quân Tiên phong về tiếp quản Thủ đô Hà Nội sau chiến thắng Điện Biên Phủ, Chủ tịch Hồ Chí Minh đã gặp mặt cán bộ chiến sĩ tại Đền Giếng thuộc Đền Hùng và căn dặn câu nói lịch sử: ''Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-den-hung'),
    'Hồ sơ di tích Đền Giếng, cuộc nói chuyện ngày 19/9/1954',
    'Lời căn dặn bất hủ của Bác Hồ với Đại đoàn Quân Tiên phong'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Sự kiện chuẩn bị tiếp quản Thủ đô tháng 9/1954'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di sản Thế giới và Di tích Quốc gia Đặc biệt', 'Năm 2009, Khu di tích lịch sử Đền Hùng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg. Năm 2012, Tín ngưỡng thờ cúng Hùng Vương tại Phú Thọ được UNESCO vinh danh là Di sản Văn hóa Phi vật thể đại diện của nhân loại.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-den-hung'),
    'Quyết định số 1272/QĐ-TTg và Văn bằng UNESCO 2012',
    'Xếp hạng Di tích quốc gia đặc biệt và Di sản thế giới UNESCO'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ben-k15-do-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cái nôi khởi phát tuyến đường vận tải biển chiến lược', 'Đầu thập niên 1960, nhằm chi viện kịp thời vũ khí hạng nặng cho đồng bào và chiến sĩ miền Nam đánh Mỹ, Bộ Quốc phòng thành lập Đoàn 759 (tiền thân Lữ đoàn 125 Hải quân) và bí mật chọn vụng Độc Nao dưới chân đồi Vạn Hoa, bán đảo Đồ Sơn (Hải Phòng) làm căn cứ xuất phát mang mật danh Bến K15.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ben-k15-do-son'),
    'Hồ sơ di tích Bến K15, mục Thành lập Đoàn 759',
    'Thành lập Đoàn 759 tháng 10/1961 và chọn bến K15 Đồ Sơn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Đường Hồ Chí Minh trên biển chi viện chiến trường miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ben-k15-do-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Chuyến tàu gỗ Không số đầu tiên lịch sử', 'Đêm ngày 11/10/1962, chiếc tàu gỗ không số đầu tiên mang mật danh ''Phương Đông 1'' do thuyền trưởng Lê Văn Một chỉ huy đã rời Bến K15, bí mật chở 30 tấn vũ khí vượt biển khơi cập bến Vàm Lũng (Cà Mau) an toàn tuyệt đối. Thắng lợi này đã khai thông tuyến vận tải chiến lược Đường Hồ Chí Minh trên biển huyền thoại.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ben-k15-do-son'),
    'Hồ sơ chuyến đi tàu Phương Đông 1 ngày 11/10/1962',
    '30 tấn vũ khí cập bến Vàm Lũng do thuyền trưởng Lê Văn Một chỉ huy'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Khai thông tuyến vận tải quân sự chiến lược trên biển'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ben-k15-do-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Bến K15 được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích Lịch sử Quốc gia năm 2008. Ngày nay, bên cạnh những mố cầu tàu bê tông lịch sử vươn ra mép sóng, Tượng đài kỷ niệm Đường Hồ Chí Minh trên biển sừng sững uy nghiêm ghi nhớ công ơn những người lính cảm tử của Đoàn tàu Không số.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ben-k15-do-son'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 2008',
    'Xếp hạng cấp quốc gia Bến K15 Đồ Sơn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vùng đất thiêng non nước hữu tình', 'Quần thể di tích Côn Sơn - Kiếp Bạc tọa lạc bên dãy núi Phượng Hoàng và dòng sông Lục Đầu huyền thoại (thuộc thành phố Chí Linh). Nơi đây có phong cảnh thiên nhiên tú lệ và là vị trí phòng thủ quân sự hiểm yếu trấn giữ sườn đông bắc kinh thành Thăng Long thời phong kiến.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-con-son-kiep-bac'),
    'Hồ sơ di tích quốc gia đặc biệt Côn Sơn - Kiếp Bạc, phần Vị trí địa lý',
    'Vị trí địa lý sông Lục Đầu và dãy núi Phượng Hoàng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đại bản doanh của Trần Hưng Đạo và nơi ở ẩn của Nguyễn Trãi', 'Đền Kiếp Bạc từng là đại bản doanh Vạn Kiếp của Quốc công Tiết chế Hưng Đạo Đại vương Trần Quốc Tuấn tổ chức rèn binh luyện thủy quân đánh thắng giặc Nguyên Mông. Chùa Côn Sơn gắn liền với cuộc đời vị Anh hùng giải phóng dân tộc, Danh nhân văn hóa thế giới Nguyễn Trãi khi ông lui về ở ẩn và trước tác.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-con-son-kiep-bac'),
    'Hồ sơ di tích, mục Trần Hưng Đạo và Nguyễn Trãi',
    'Vạn Kiếp - đại bản doanh của Trần Hưng Đạo và Côn Sơn của Nguyễn Trãi'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Danh nhân văn hóa và quân sự Đại Việt',
    'Vai trò lịch sử của Hưng Đạo Vương và Nguyễn Trãi'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Côn Sơn - Kiếp Bạc được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể là điểm đến tâm linh hàng đầu cả nước, hiện nằm trong hồ sơ di sản đệ trình UNESCO công nhận là Di sản Thế giới.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-con-son-kiep-bac'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Côn Sơn - Kiếp Bạc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Bối cảnh cao trào cách mạng 1930–1931 ở miền Bắc', 'Mùa thu năm 1930, phong trào Xô viết Nghệ - Tĩnh bùng lên mạnh mẽ ở miền Trung. Để chia lửa với đồng bào Nghệ An và Hà Tĩnh đang bị thực dân Pháp đàn áp tàn bạo, Xứ ủy Bắc Kỳ và Tỉnh ủy Thái Bình đã quyết định phát động phong trào biểu tình đấu tranh vũ trang của nông dân tại huyện Tiền Hải.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-tieng-trong-tien-hai'),
    'Hồ sơ di tích Tiếng trống Tiền Hải, phần Bối cảnh',
    'Chủ trương chia lửa với phong trào Xô viết Nghệ - Tĩnh mùa thu 1930'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Phong trào cách mạng 1930-1931 và sự kiện Tiếng trống Tiền Hải'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Tiếng trống rền vang sáng ngày 14/10/1930', 'Sáng sớm ngày 14/10/1930, tiếng trống phát lệnh từ đình Nho Lâm vang lên liên hồi giục giã hàng ngàn nông dân các xã thuộc Tiền Hải mang theo cờ đỏ búa liềm, gậy gộc rầm rộ kéo về huyện lỵ. Đoàn biểu tình đã bao vây dinh tri huyện, hô vang khẩu hiệu đòi giảm sưu, hoãn thuế, chia lại ruộng công và ủng hộ Xô viết Nghệ - Tĩnh, làm cho chính quyền tay sai thực dân khiếp sợ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-tieng-trong-tien-hai'),
    'Hồ sơ di tích, diễn biến ngày 14/10/1930',
    'Đoàn biểu tình nông dân bao vây huyện lỵ đòi quyền dân sinh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Ý nghĩa cuộc biểu tình ngày 14/10/1930 của nông dân Tiền Hải'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Sự kiện ''Tiếng trống Tiền Hải'' là đỉnh cao của phong trào 1930–1931 tại đồng bằng Bắc Bộ. Khu di tích lịch sử Tiếng trống Tiền Hải tại đình Nho Lâm (xã Đông Lâm) được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1989, là biểu tượng kiên cường của nông dân vùng lúa Thái Bình.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-tieng-trong-tien-hai'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1989',
    'Xếp hạng cấp quốc gia đình Nho Lâm và khu lưu niệm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'pho-hien';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Đô thị thương cảng quốc tế sầm uất bậc nhất Đàng Ngoài', 'Hình thành từ thế kỷ XIII và phát triển cực thịnh trong các thế kỷ XVI–XVII, Phố Hiến (thành phố Hưng Yên ngày nay) nằm ở vị trí giao thương đường thủy đắc địa bên tả ngạn sông Hồng. Đây từng là trung tâm kinh tế, cảng thị quốc tế lớn nhất miền Bắc với câu ca dân gian nổi tiếng: ''Thứ nhất Kinh kỳ, thứ nhì Phố Hiến''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-pho-hien'),
    'Hồ sơ di tích quốc gia đặc biệt Phố Hiến, phần Lịch sử hình thành',
    'Giai đoạn hưng thịnh thế kỷ XVI-XVII và vị thế thương cảng Đàng Ngoài'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Đô thị cổ và thương nghiệp Đại Việt thời phong kiến',
    'Phố Hiến - đô thị thương mại phồn hoa Đàng Ngoài'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'pho-hien';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nơi hội tụ giao thoa văn hóa đa quốc gia', 'Thời bấy giờ, Phố Hiến là thương cảng mở cửa đón thương thuyền từ Nhật Bản, Trung Hoa, Hà Lan, Bồ Đào Nha, Anh đến lập thương điếm buôn bán tơ lụa, gốm sứ. Sự giao thoa văn hóa Đông - Tây sâu sắc đã để lại dấu ấn qua các công trình kiến trúc độc đáo như chùa Chuông (''Phố Hiến đệ nhất danh lam''), chùa Hiến, đền Mẫu và văn miếu Xích Đằng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-pho-hien'),
    'Hồ sơ kiến trúc các điểm di tích Phố Hiến',
    'Kiến trúc Chùa Chuông, Đền Mẫu và Văn miếu Xích Đằng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'pho-hien';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ghi nhận giá trị lịch sử và kiến trúc nghệ thuật vô giá, ngày 31/12/2014, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg xếp hạng Khu di tích Phố Hiến là Di tích Quốc gia Đặc biệt. Quần thể gồm 16 di tích tiêu biểu được bảo tồn chu đáo giữa trung tâm thành phố Hưng Yên.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-pho-hien'),
    'Quyết định số 2408/QĐ-TTg ngày 31/12/2014',
    'Xếp hạng Di tích quốc gia đặc biệt Khu di tích Phố Hiến'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cơ sở công nghiệp dệt may lớn nhất Đông Dương', 'Nhà máy Dệt Nam Định (tên ban đầu là Công ty Bông - Vải sợi Bắc Kỳ) do tư bản Pháp thành lập năm 1898 tại thành phố Nam Định. Đây là cơ sở công nghiệp quy mô lớn nhất Đông Dương thời thuộc địa với hơn 1 vạn công nhân làm việc, chịu sự bóc lột hà khắc của giới chủ thực dân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-may-det-nam-dinh'),
    'Hồ sơ di tích, mục I: Quá trình thành lập năm 1898',
    'Quy mô xưởng dệt và hơn 1 vạn công nhân lao động khổ sai'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Giai cấp công nhân Việt Nam tại các khu công nghiệp dệt Nam Định'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Cái nôi phong trào công nhân và lời căn dặn của Bác Hồ', 'Năm 1929, chi bộ Đông Dương Cộng sản Đảng được thành lập tại nhà máy, trực tiếp lãnh đạo cuộc bãi công lớn của 4.000 thợ dệt tháng 3/1930 kéo dài suốt 21 ngày đêm. Trong kháng chiến chống Mỹ, thợ dệt Nam Định nêu cao khẩu hiệu ''Tay thoi tay súng'', vừa sản xuất vải vừa bắn rơi máy bay Mỹ. Sinh thời, Chủ tịch Hồ Chí Minh đã 3 lần về thăm nhà máy và căn dặn thợ dệt đoàn kết thi đua.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-may-det-nam-dinh'),
    'Hồ sơ di tích, mục Bãi công tháng 3/1930 và Bác Hồ 3 lần về thăm',
    'Cuộc bãi công 4.000 thợ dệt và kỷ niệm Bác Hồ về thăm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)',
    'Khẩu hiệu Tay thoi tay súng của công nhân dệt Nam Định'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Bảo tàng Dệt may và Di tích Lịch sử ngày nay', 'Di tích lịch sử Nhà máy Dệt Nam Định và Cột cờ Nam Định trong khuôn viên nhà máy được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia. Bảo tàng Dệt May hiện lưu giữ hàng ngàn hiện vật máy dệt cổ và kỷ vật thiêng liêng trong các lần Bác Hồ về thăm công nhân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-may-det-nam-dinh'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia',
    'Cấp xếp hạng quốc gia và Bảo tàng Dệt may Nam Định'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Kinh đô đầu tiên của nhà nước phong kiến tập quyền Đại Cồ Việt', 'Năm 968, sau khi đánh dẹp 12 sứ quân thu giang sơn về một mối, Đinh Bộ Lĩnh lên ngôi Hoàng đế (Đinh Tiên Hoàng), đặt quốc hiệu là Đại Cồ Việt và định đô tại Hoa Lư. Kinh thành Hoa Lư nằm lọt giữa các dãy núi đá vôi kỳ vĩ hiểm trở, tạo nên một tòa thành tự nhiên kiên cố bảo vệ non sông.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-co-do-hoa-lu'),
    'Hồ sơ di tích quốc gia đặc biệt Cố đô Hoa Lư, phần Định đô năm 968',
    'Đinh Tiên Hoàng dẹp loạn 12 sứ quân và định đô tại Hoa Lư'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Nhà nước phong kiến tập quyền thời Đinh - Tiền Lê',
    'Kinh đô Hoa Lư và quốc hiệu Đại Cồ Việt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Dấu ấn 42 năm lịch sử và tiền đề dời đô Thăng Long', 'Hoa Lư là kinh đô của ba triều đại phong kiến liên tiếp: triều Đinh, Tiền Lê và thời kỳ đầu nhà Lý suốt 42 năm (968–1010). Tại nơi đây, Đinh Tiên Hoàng cho đúc tiền ''Thái Bình hưng bảo'', vua Lê Đại Hành chỉ huy quân dân phá tan giặc Tống xâm lược năm 981. Năm 1010, nhận thấy thế nước hưng thịnh, Vua Lý Thái Tổ đã ban Chiếu dời đô từ Hoa Lư về Thăng Long.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-co-do-hoa-lu'),
    'Hồ sơ di tích, mục Ba triều đại Đinh - Tiền Lê - Lý',
    '42 năm định đô và sự kiện Vua Lý Thái Tổ dời đô năm 1010'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Di sản Thăng Long - Hoa Lư',
    'Chiếu dời đô năm 1010 từ Hoa Lư về Thăng Long'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di sản Thế giới và Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Cố đô Hoa Lư được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012, đồng thời là vùng lõi của Quần thể Danh thắng Tràng An được UNESCO công nhận là Di sản Thế giới hỗn hợp năm 2014. Quần thể bảo tồn nguyên vẹn Đền vua Đinh Tiên Hoàng và Đền vua Lê Đại Hành uy nghiêm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-co-do-hoa-lu'),
    'Quyết định số 548/QĐ-TTg và Văn bằng Di sản thế giới Tràng An',
    'Xếp hạng Di tích quốc gia đặc biệt và Di sản thế giới UNESCO'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'cau-ham-rong';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Yết hầu giao thông huyết mạch chi viện tiền tuyến', 'Cầu Hàm Rồng bắc qua sông Mã (thành phố Thanh Hóa) là cây cầu đường sắt và đường bộ độc đạo trên tuyến giao thông huyết mạch Bắc - Nam. Trong những năm kháng chiến chống Mỹ, cây cầu giữ vị trí chiến lược sống còn để vận chuyển vũ khí, lương thực và bộ đội từ hậu phương lớn miền Bắc chi viện cho tiền tuyến lớn miền Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-cau-ham-rong'),
    'Hồ sơ di tích, mục Vị trí chiến lược cầu Hàm Rồng',
    'Vị trí huyết mạch giao thông chi viện chiến trường miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Tuyến chi viện chiến lược Bắc - Nam và phong trào bảo vệ giao thông'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'cau-ham-rong';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Bản anh hùng ca bắn rơi 117 máy bay Mỹ', 'Từ năm 1964 đến 1972, không quân Mỹ đã trút hàng vạn tấn bom đạn tinh vi nhằm chặt đứt cầu Hàm Rồng. Quân và dân Hàm Rồng - Nam Ngạn gồm bộ đội cao xạ, không quân, dân quân tự vệ nữ đã kiên cường bám trụ trận địa, giáng trả mãnh liệt, bắn rơi 117 máy bay hiện đại của Mỹ, giữ vững nhịp cầu thông suốt trong mọi tình huống hiểm nghèo.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-cau-ham-rong'),
    'Hồ sơ chiến lệ Hàm Rồng 1965-1972',
    'Chiến công bắn rơi 117 máy bay Mỹ và tinh thần bám trụ nhịp cầu'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến thắng Hàm Rồng - biểu tượng kiên cường chống chiến tranh phá hoại'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'cau-ham-rong';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Cầu Hàm Rồng được xếp hạng Di tích Lịch sử Quốc gia năm 1975. Bên cạnh cây cầu thép lịch sử soi bóng dòng sông Mã là đồi C4, đồi Quyết Thắng và Tượng đài Thanh niên xung phong Hàm Rồng – điểm đến giáo dục truyền thống yêu nước hào hùng cho các thế hệ trẻ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-cau-ham-rong'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1975',
    'Xếp hạng cấp quốc gia Cầu Hàm Rồng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thanh-nha-ho';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Kinh đô đá độc nhất vô nhị ở Đông Nam Á', 'Thành nhà Hồ (còn gọi là thành Tây Đô) được Hồ Quý Ly cho xây dựng vào mùa xuân năm 1397 tại huyện Vĩnh Lộc, tỉnh Thanh Hóa. Đây là tòa thành lũy bằng đá duy nhất còn lại ở Đông Nam Á và là một trong số rất ít các tòa thành đá kiên cố trên toàn thế giới.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thanh-nha-ho'),
    'Hồ sơ đệ trình UNESCO Thành nhà Hồ, trang 25',
    'Xây dựng năm 1397 dưới triều Hồ Quý Ly tại Vĩnh Lộc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Cải cách Hồ Quý Ly và kinh thành Tây Đô',
    'Kỹ thuật xây dựng thành lũy bằng đá thời nhà Hồ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thanh-nha-ho';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Kỹ nghệ ghép đá bậc thầy và nghệ thuật kiến trúc', 'Tòa thành được ghép bằng những khối đá vôi khổng lồ nặng từ 10 đến hơn 20 tấn, được đẽo gọt phẳng phiu và xếp khít khao không dùng vữa kết dính. Bốn cổng thành bốn phía xây theo lối vòm cuốn đá cuốn hút tinh xảo, thể hiện đỉnh cao kỹ thuật khai thác, vận chuyển và xây dựng công trình phòng thủ thời trung đại Đại Việt.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thanh-nha-ho'),
    'Khảo cổ học kiến trúc vòm đá Thành nhà Hồ',
    'Kỹ thuật đẽo gọt và ghép khối đá vôi không dùng vữa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thanh-nha-ho';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di sản Văn hóa Thế giới ngày nay', 'Năm 2011, UNESCO đã chính thức công nhận Thành nhà Hồ là Di sản Văn hóa Thế giới. Năm 2012, Thủ tướng Chính phủ xếp hạng công trình là Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg, bảo tồn nguyên vẹn 4 cổng vòm đá cổ kính cùng dấu tích hào thành và trục đường hoàng đạo linh thiêng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thanh-nha-ho'),
    'Văn bằng công nhận UNESCO 2011 và Quyết định 548/QĐ-TTg',
    'Xếp hạng Di sản văn hóa thế giới và Di tích quốc gia đặc biệt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Quê hương cội nguồn nuôi dưỡng tâm hồn Bác Hồ', 'Khu di tích lịch sử Kim Liên (huyện Nam Đàn, tỉnh Nghệ An) gồm làng Hoàng Trù (quê ngoại) và làng Sen (quê nội) của Chủ tịch Hồ Chí Minh. Nơi đây đã sinh thành và nuôi dưỡng Người trong những năm tháng ấu thơ (1890–1895 và 1901–1906), hun đúc nên lòng yêu nước nồng nàn và ý chí cứu nước vĩ đại.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kim-lien'),
    'Hồ sơ di tích quốc gia đặc biệt Kim Liên, phần Tổng quan',
    'Niên thiếu của Bác Hồ tại quê ngoại Hoàng Trù và quê nội Làng Sen'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Quê hương và thời niên thiếu của Lãnh tụ Nguyễn Ái Quốc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nếp nhà tranh giản dị và tấm gương nhà nho yêu nước', 'Dưới mái nhà tranh vách nứa đơn sơ của cụ Phó bảng Nguyễn Sinh Sắc và thân mẫu Hoàng Thị Loan, cậu bé Nguyễn Sinh Cung đã sớm tiếp thu truyền thống hiếu học, chứng kiến nỗi thống khổ của người dân mất nước và tinh thần bất khuất của các sĩ phu yêu nước như cụ Phan Bội Châu thường ghé đàm đạo thế sự.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kim-lien'),
    'Hồ sơ di tích nếp nhà tranh Làng Sen',
    'Nếp nhà tranh đơn sơ và ảnh hưởng từ thân phụ Nguyễn Sinh Sắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Kim Liên được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể bảo tồn các nếp nhà cổ, giếng Cốc, lò rèn cố Điền và khu mộ bà Hoàng Thị Loan trên núi Động Tranh, là địa chỉ đỏ thiêng liêng thu hút hàng triệu đồng bào và khách quốc tế.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kim-lien'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Khu di tích Kim Liên'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'truong-bon';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Tọa độ lửa trên tuyến chi viện Trường Sơn', 'Truông Bồn là một đoạn đèo dốc hiểm trở dài khoảng 5km trên tuyến Quốc lộ 15A qua xã Mỹ Sơn, huyện Đô Lương, Nghệ An. Nơi đây là điểm nút giao thông yết hầu kết nối các tuyến huyết mạch chi viện sức người, sức của từ miền Bắc vào chiến trường miền Nam trong kháng chiến chống Mỹ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-truong-bon'),
    'Hồ sơ di tích lịch sử Truông Bồn, phần Bối cảnh',
    'Vị trí yết hầu chiến lược của Quốc lộ 15A qua Truông Bồn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Tuyến đường huyết mạch Trường Sơn và tinh thần TNXP'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'truong-bon';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Sự hy sinh anh dũng của 13 chiến sĩ TNXP ngày 31/10/1968', 'Rạng sáng ngày 31/10/1968, chỉ vài giờ trước khi lệnh ngừng ném bom toàn miền Bắc của Mỹ có hiệu lực, máy bay Mỹ đã trút bom xuống trận địa Truông Bồn. 13 chiến sĩ thanh niên xung phong (11 nữ, 2 nam) thuộc ''Tiểu đội thép'' Đại đội 317 đã anh dũng hy sinh khi đang san lấp hố bom thông đường cho đoàn xe ra trận.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-truong-bon'),
    'Hồ sơ di tích, sự kiện rạng sáng ngày 31/10/1968',
    '13 chiến sĩ TNXP Đại đội 317 hy sinh khi thông đường'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'truong-bon';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Khu tưởng niệm Quốc gia ngày nay', 'Ghi nhận sự cống hiến quên mình vì Tổ quốc, Khu di tích lịch sử Truông Bồn được xếp hạng Di tích Lịch sử Quốc gia năm 2013. Nơi đây xây dựng đài tưởng niệm, khu mộ chung trang nghiêm của 13 liệt sĩ TNXP anh hùng, trở thành biểu tượng bất tử của chủ nghĩa anh hùng cách mạng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-truong-bon'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 2013',
    'Xếp hạng cấp quốc gia Khu di tích lịch sử Truông Bồn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Yết hầu lửa trên tuyến đường Trường Sơn huyền thoại', 'Ngã ba Đồng Lộc (huyện Can Lộc, tỉnh Hà Tĩnh) là giao điểm huyết mạch giữa đường 15A và đường 22 trên dãy Trường Sơn. Mọi chuyến hàng chi viện cho chiến trường miền Nam đều phải đi qua cửa ngõ yết hầu này. Trong năm 1968, máy bay Mỹ đã trút xuống nơi đây gần 50.000 quả bom các loại hòng biến vùng đất thành bình địa.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nga-ba-dong-loc'),
    'Hồ sơ di tích quốc gia đặc biệt Ngã ba Đồng Lộc, phần Bối cảnh',
    'Tọa độ lửa giao điểm đường 15A và gần 50.000 quả bom năm 1968'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Tuyến đường huyết mạch Trường Sơn và ngã ba Đồng Lộc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Mười đóa hoa bất tử nơi Ngã ba Đồng Lộc', 'Khoảng 16 giờ 30 phút ngày 24/7/1968, trong lúc đang san lấp hố bom dưới làn hỏa lực địch để mở đường cho xe qua, một quả bom oan nghiệt đã rơi trúng căn hầm trú ẩn của Tiểu đội 4 (Đại đội 552) cướp đi sinh mạng của 10 nữ liệt sĩ thanh niên xung phong do chị Võ Thị Tần làm Tiểu đội trưởng. Sự hy sinh kiên cường của 10 cô gái tuổi mười tám đôi mươi đã trở thành biểu tượng bất tử của lòng quả cảm vì Tổ quốc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nga-ba-dong-loc'),
    'Hồ sơ sự kiện 16h30 ngày 24/7/1968',
    'Sự hy sinh của 10 nữ liệt sĩ TNXP do Võ Thị Tần chỉ huy'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Gương hy sinh anh dũng của 10 nữ liệt sĩ ngã ba Đồng Lộc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Ngã ba Đồng Lộc được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây bảo tồn cụm tượng đài TNXP, hố bom lịch sử, tháp chuông tưởng niệm và khu mộ 10 nữ liệt sĩ luôn ngập tràn hoa trắng tri ân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nga-ba-dong-loc'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Ngã ba Đồng Lộc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Chiến trường ác liệt mùa hè đỏ lửa năm 1972', 'Thành cổ Quảng Trị nằm ở trung tâm thị xã Quảng Trị bên dòng sông Thạch Hãn. Mùa hè năm 1972, sau khi quân ta giải phóng hoàn toàn tỉnh Quảng Trị, quân đội Sài Gòn có hỏa lực không quân và pháo hạm Mỹ yểm trợ tối đa đã mở cuộc phản công quy mô lớn hòng tái chiếm Thành cổ để giành ưu thế trên bàn đàm phán Hội nghị Paris.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thanh-co-quang-tri'),
    'Hồ sơ di tích Thành cổ Quảng Trị, phần Bối cảnh chiến dịch 1972',
    'Cuộc phản công tái chiếm Thành cổ và bối cảnh bàn đàm phán Paris'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Cuộc tiến công chiến lược năm 1972 và chiến sự Thành cổ Quảng Trị'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, '81 ngày đêm máu lửa và khúc tráng ca bất diệt', 'Trong suốt 81 ngày đêm (từ 28/6 đến 16/9/1972), quân Mỹ - ngụy đã dội xuống thị xã và Thành cổ Quảng Trị hơn 328.000 tấn bom đạn, tương đương sức công phá của 7 quả bom nguyên tử ném xuống Hiroshima. Cán bộ, chiến sĩ quân giải phóng đã kiên cường giành giật từng tấc đất, chiến hào, viết nên khúc tráng ca bất tử bên dòng sông Thạch Hãn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thanh-co-quang-tri'),
    'Hồ sơ 81 ngày đêm chiến đấu bảo vệ Thành cổ',
    'Hơn 328.000 tấn bom đạn trong 81 ngày đêm từ 28/6 đến 16/9/1972'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Ý nghĩa cuộc chiến đấu 81 ngày đêm bảo vệ Thành cổ Quảng Trị'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Thành cổ Quảng Trị được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Đài tưởng niệm trung tâm được thiết kế hình nấm mồ chung mô phỏng ngọn thiên đăng linh thiêng tưởng niệm hàng ngàn anh hùng liệt sĩ đã ngã xuống trong lòng đất mẹ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thanh-co-quang-tri'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Thành cổ Quảng Trị'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vĩ tuyến 17 và nỗi đau chia cắt hơn 20 năm', 'Theo Hiệp định Genève năm 1954, sông Bến Hải (thuộc huyện Vĩnh Linh và Gio Linh, tỉnh Quảng Trị) chảy dọc theo vĩ tuyến 17 được chọn làm giới tuyến quân sự tạm thời để chờ ngày tổng tuyển cử thống nhất đất nước. Tuy nhiên, đế quốc Mỹ và chính quyền tay sai đã xé bỏ hiệp định, biến sông Bến Hải thành ranh giới chia cắt hai miền Nam - Bắc ròng rã suốt hơn 20 năm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-hien-luong-ben-hai'),
    'Hồ sơ di tích quốc gia đặc biệt Đôi bờ Hiền Lương - Bến Hải, phần Bối cảnh',
    'Hiệp định Genève 1954 quy định giới tuyến quân sự tạm thời tại vĩ tuyến 17'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)',
    'Vĩ tuyến 17 chia cắt đất nước và khát vọng hòa bình thống nhất'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Cuộc đọ sức biểu tượng: Cờ Tổ quốc và âm thanh đôi bờ', 'Tại đôi bờ Hiền Lương đã diễn ra những cuộc đọ sức chính trị quyết liệt chưa từng có: cuộc chiến màu sơn trên cầu Hiền Lương, cuộc chiến công suất loa phóng thanh và đặc biệt là cuộc chiến chọi cờ tại cột cờ bờ Bắc. Dù địch trút hàng vạn quả bom hòng gục ngã cột cờ, quân và dân bờ Bắc Vĩnh Linh vẫn kiên cường bảo vệ lá cờ đỏ sao vàng luôn tung bay kiêu hãnh.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-hien-luong-ben-hai'),
    'Hồ sơ di tích, mục Các cuộc đấu trí biểu tượng đôi bờ',
    'Cuộc chiến giữ cờ Tổ quốc bờ Bắc và các cuộc đọ sức loa phóng thanh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Đôi bờ Hiền Lương - Bến Hải được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Cầu Hiền Lương lịch sử sơn hai màu xanh - vàng, cột cờ bờ Bắc cao 38m và cụm tượng đài ''Khát vọng thống nhất non sông'' là chứng nhân bất tử cho khát vọng hòa bình thống nhất của dân tộc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-hien-luong-ben-hai'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Đôi bờ Hiền Lương - Bến Hải'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ngo-mon-hue';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cổng chính tráng lệ của Hoàng thành Huế', 'Ngọ Môn là cổng chính phía nam của Hoàng thành Huế, được xây dựng năm 1833 dưới triều Vua Minh Mạng. Công trình kết hợp tinh xảo giữa nền đài đá đồ sộ trổ 5 cửa và lầu Ngũ Phụng bằng gỗ sơn son thếp vàng, là đỉnh cao kiến trúc cung đình triều Nguyễn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ngo-mon-hue'),
    'Hồ sơ di sản thế giới Quần thể di tích Cố đô Huế, mục Ngọ Môn',
    'Xây dựng năm 1833 dưới triều Minh Mạng và kiến trúc lầu Ngũ Phụng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Sự kiện Bảo Đại thoái vị tại cửa Ngọ Môn chiều 30/8/1945'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ngo-mon-hue';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Lễ thoái vị của Vua Bảo Đại chiều 30/8/1945', 'Chiều ngày 30/8/1945, trước cửa Ngọ Môn rực rỡ cờ đỏ sao vàng và trước sự chứng kiến của hàng vạn nhân dân xứ Huế, Vua Bảo Đại đã đọc Chiếu thoái vị, trao ấn vàng ''Hoàng đế chi bảo'' và kiếm bạc nạm ngọc cho phái đoàn Chính phủ lâm thời do đồng chí Trần Huy Liệu làm trưởng đoàn. Câu nói ''Thà làm dân một nước độc lập hơn làm vua một nước nô lệ'' đã chấm dứt vĩnh viễn chế độ quân chủ chuyên chế ngàn năm tại Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ngo-mon-hue'),
    'Hồ sơ sự kiện thoái vị ngày 30/8/1945',
    'Bảo Đại trao ấn kiếm cho phái đoàn Chính phủ lâm thời'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Ý nghĩa lịch sử chấm dứt chế độ phong kiến triều Nguyễn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ngo-mon-hue';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di sản Văn hóa Thế giới ngày nay', 'Ngọ Môn là biểu tượng tiêu biểu của Quần thể Di tích Cố đô Huế – Di sản Văn hóa Thế giới đầu tiên của Việt Nam được UNESCO vinh danh năm 1993. Sau đợt trùng tu lớn hoàn thành năm 2021, Ngọ Môn mở cửa đón hàng triệu du khách chiêm ngưỡng nét đẹp kiêu hãnh của di sản dân tộc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ngo-mon-hue'),
    'Văn bằng UNESCO 1993 và Dự án trùng tu Ngọ Môn 2021',
    'Di sản thế giới và công tác bảo tồn di tích'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Chiến trường trọng điểm Tết Mậu Thân 1968', 'Trong cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968, mặt trận Trị - Thiên - Huế là một trong những hướng tiến công chiến lược then chốt. Đêm 30 rạng sáng ngày 31/1/1968, các lực lượng vũ trang giải phóng phối hợp cùng nhân dân đã bất ngờ đồng loạt tiến công các căn cứ quân sự của Mỹ và quân đội Sài Gòn tại thành phố Huế.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kinh-thanh-hue-1968'),
    'Lịch sử mặt trận Huế Tết Mậu Thân 1968, phần Mở màn',
    'Đòn tiến công bất ngờ đêm 30 rạng sáng 31/1/1968 tại Huế'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, '25 ngày đêm làm chủ thành phố và cờ bay trên đỉnh Kỳ Đài', 'Sáng sớm ngày 31/1/1968, lá cờ nửa đỏ nửa xanh với ngôi sao vàng của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam rộng lớn đã tung bay kiêu hãnh trên đỉnh Kỳ Đài trước Ngọ Môn. Quân và dân ta đã anh dũng làm chủ thành phố Huế suốt 25 ngày đêm liên tục, bẻ gãy nhiều đợt phản kích điên cuồng của lính thủy đánh bộ Mỹ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kinh-thanh-hue-1968'),
    'Hồ sơ sự kiện cắm cờ trên đỉnh Kỳ Đài sáng 31/1/1968',
    'Lá cờ giải phóng tung bay trên Kỳ Đài và 25 ngày đêm làm chủ thành phố'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Ý nghĩa chiến dịch Huế Mậu Thân 1968 làm phá sản chiến lược Chiến tranh cục bộ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Kỳ Đài Huế ngày nay', 'Kỳ Đài (Cột cờ Kinh thành Huế) được xây dựng năm 1807 gồm 3 tầng bệ đá đồ sộ cao hơn 17m và cột cờ cao 37m. Công trình là chứng nhân cho những chuyển biến trọng đại của lịch sử hiện đại Việt Nam và là điểm tham quan tiêu biểu trong Quần thể Cố đô Huế.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kinh-thanh-hue-1968'),
    'Hồ sơ kiến trúc Kỳ Đài Huế',
    'Quy chuẩn kiến trúc Kỳ Đài và công tác bảo tồn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Quân viễn chinh Mỹ đổ bộ và bối cảnh chiến trường', 'Tháng 3/1965, hai tiểu đoàn lính thủy đánh bộ Mỹ đổ bộ vào Đà Nẵng và sau đó lập căn cứ liên hợp Chu Lai. Đế quốc Mỹ ồ ạt triển khai chiến lược ''Chiến tranh cục bộ'', đưa quân viễn chinh Mỹ trực tiếp tham chiến nhằm đè bẹp lực lượng vũ trang cách mạng miền Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-nui-thanh'),
    'Hồ sơ di tích Chiến thắng Núi Thành, phần Bối cảnh',
    'Mỹ đổ quân vào Chu Lai tháng 3/1965 mở đầu Chiến tranh cục bộ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Mỹ tiến hành chiến lược Chiến tranh cục bộ ở miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trận đánh phủ đầu lính thủy đánh bộ Mỹ đêm 25 rạng sáng 26/5/1965', 'Để hạ uy thế quân viễn chinh Mỹ, đêm 25 rạng sáng 26/5/1965, Đại đội 2 (Tiểu đoàn 70 bộ đội địa phương Quảng Nam) gồm các chiến sĩ cảm tử do đồng chí Trần Ngọc Ảnh chỉ huy đã bất ngờ tập kích cứ điểm Núi Thành. Chỉ trong vòng 30 phút chiến đấu dũng mãnh, ta đã tiêu diệt hoàn toàn một đại đội lính thủy đánh bộ Mỹ, cắm cờ chiến thắng trên đỉnh đồi.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-nui-thanh'),
    'Hồ sơ trận đánh Núi Thành đêm 25/5/1965',
    'Đại đội 2 tiêu diệt gọn đại đội lính thủy đánh bộ Mỹ trong 30 phút'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến thắng Núi Thành mở đầu phong trào Tìm Mỹ mà đánh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Chiến thắng Núi Thành chứng minh khả năng quân và dân ta hoàn toàn có thể đánh thắng quân đội viễn chinh Mỹ trang bị hiện đại. Tượng đài Chiến thắng Núi Thành được xây dựng trên đồi cao xã Tam Nghĩa, huyện Núi Thành và được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1979.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-nui-thanh'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1979',
    'Xếp hạng cấp quốc gia Tượng đài Chiến thắng Núi Thành'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Thánh địa tôn giáo cổ xưa của vương quốc Champa', 'Khu đền tháp Mỹ Sơn nằm trong một thung lũng kín đáo bao quanh bởi dãy núi Chư Pơ hùng vĩ (thuộc huyện Duy Xuyên). Từ thế kỷ IV đến thế kỷ XIII, nơi đây là thánh địa tôn giáo thiêng liêng và là trung tâm tổ chức các nghi lễ đăng quang, hiến tế của các triều vua Champa.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-my-son'),
    'Hồ sơ di sản thế giới Khu đền tháp Mỹ Sơn, phần Lịch sử',
    'Thánh địa tôn giáo Champa từ thế kỷ IV đến thế kỷ XIII'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Văn minh Champa và di sản kiến trúc đền tháp',
    'Thánh địa Mỹ Sơn và nghệ thuật điêu khắc Chăm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Kỹ nghệ xây gạch nung bí ẩn và nghệ thuật điêu khắc đá', 'Quần thể gồm hơn 70 công trình đền tháp mang nhiều phong cách kiến trúc đặc sắc thờ thần Shiva. Điểm độc đáo kỳ diệu nhất là kỹ thuật liên kết các viên gạch nung đỏ mà không thấy mạch vữa kết dính cùng các bức phù điêu vũ nữ Apsara mềm mại được chạm khắc trực tiếp vào thân tháp gạch.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-my-son'),
    'Khảo sát kiến trúc gạch nung và điêu khắc Mỹ Sơn',
    'Kỹ thuật xây gạch không lộ mạch vữa và phù điêu vũ nữ Apsara'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di sản Văn hóa Thế giới ngày nay', 'Năm 1999, UNESCO chính thức ghi danh Khu đền tháp Mỹ Sơn là Di sản Văn hóa Thế giới nhờ các giá trị ngoại hạng toàn cầu về lịch sử văn hóa. Năm 2009, di tích được xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg của Thủ tướng Chính phủ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-my-son'),
    'Văn bằng UNESCO 1999 và Quyết định số 1272/QĐ-TTg',
    'Xếp hạng Di sản văn hóa thế giới và Di tích quốc gia đặc biệt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vụ thảm sát thường dân vô tội sáng ngày 16/3/1968', 'Sáng ngày 16/3/1968, một đơn vị quân viễn chinh Mỹ thuộc lực lượng đặc nhiệm Barker (Lữ đoàn 11) do trung úy William Calley chỉ huy đã đổ bộ vào làng Sơn Mỹ (thôn Mỹ Lai, xã Tịnh Khê, thành phố Quảng Ngãi). Trong vòng vài giờ đồng hồ, binh lính Mỹ đã tàn sát dã man 504 thường dân vô tội, trong đó có 182 phụ nữ, 173 trẻ em và 60 người già.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-son-my'),
    'Hồ sơ di tích quốc gia đặc biệt Sơn Mỹ, số liệu nạn nhân',
    '504 thường dân vô tội bị sát hại sáng ngày 16/3/1968'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Tội ác chiến tranh của đế quốc Mỹ tại Sơn Mỹ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Lương tri thế giới thức tỉnh và làn sóng phản chiến', 'Những bức ảnh tư liệu đanh thép do phóng viên chiến trường Ronald Haeberle công bố đã phơi bày toàn bộ sự thật tàn khốc về vụ thảm sát Sơn Mỹ ra trước dư luận quốc tế. Vụ việc làm rung chuyển nước Mỹ và thổi bùng phong trào phản đối chiến tranh của nhân dân Mỹ và nhân loại tiến bộ, đòi chính quyền Mỹ phải chấm dứt chiến tranh xâm lược Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-son-my'),
    'Tư liệu ảnh phóng viên Ronald Haeberle và dư luận thế giới',
    'Tác động thức tỉnh lương tri nhân loại và phong trào phản chiến quốc tế'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu chứng tích Sơn Mỹ được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2408/QĐ-TTg ngày 31/12/2014. Khuôn viên bảo tồn các nền nhà cháy rụi, hầm tránh pháo, mương nước tưởng niệm cùng Tượng đài người mẹ ôm con che chở – thông điệp trường tồn về hòa bình và nhân đạo.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-son-my'),
    'Quyết định số 2408/QĐ-TTg ngày 31/12/2014',
    'Xếp hạng Di tích quốc gia đặc biệt Khu chứng tích Sơn Mỹ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Căn cứ phòng ngự then chốt của đối phương tại Bắc Tây Nguyên', 'Căn cứ Đắk Tô - Tân Cảnh (thuộc huyện Đắk Tô) từng là căn cứ quân sự kiên cố bậc nhất của quân đội Sài Gòn tại chiến trường Tây Nguyên, giữ vai trò Sở chỉ huy tiền phương Sư đoàn 22 kiểm soát toàn bộ khu vực ngã ba biên giới Việt Nam - Lào - Campuchia.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dak-to-tan-canh'),
    'Hồ sơ di tích Đắk Tô - Tân Cảnh, phần Cấu trúc căn cứ',
    'Sở chỉ huy tiền phương Sư đoàn 22 ngụy tại Bắc Tây Nguyên'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Cuộc tiến công chiến lược năm 1972 trên chiến trường Tây Nguyên'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trận đánh hiệp đồng binh chủng ngày 24/4/1972', 'Rạng sáng ngày 24/4/1972, lực lượng vũ trang Tây Nguyên mở cuộc tiến công hiệp đồng binh chủng thần tốc đánh thẳng vào Sở chỉ huy Tân Cảnh. Nổi bật là tấm gương chiến đấu anh dũng của kíp xe tăng T-54 mang số hiệu 377 do Trung đội trưởng Nguyễn Nhân Triển chỉ huy đã dũng cảm một mình giao chiến tiêu diệt 7 xe tăng đối phương, góp phần quyết định giải phóng hoàn toàn căn cứ Đắk Tô - Tân Cảnh.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dak-to-tan-canh'),
    'Hồ sơ chiến lệ trận Đắk Tô ngày 24/4/1972',
    'Chiến công xe tăng 377 tiêu diệt 7 xe tăng địch và giải phóng căn cứ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Thắng lợi Chiến dịch Bắc Tây Nguyên năm 1972'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Địa điểm Chiến thắng Đắk Tô - Tân Cảnh được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2280/QĐ-TTg ngày 31/12/2020. Tượng đài chiến thắng và xác xe tăng T-54 số hiệu 377 (được công nhận là Bảo vật Quốc gia) được lưu giữ trang trọng tại trung tâm thị trấn Đắk Tô.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dak-to-tan-canh'),
    'Quyết định số 2280/QĐ-TTg ngày 31/12/2020',
    'Xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Đắk Tô - Tân Cảnh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Làng kháng chiến bất khuất giữa đại ngàn Tây Nguyên', 'Làng Stơr (thuộc xã Tơ Tung, huyện Kbang, tỉnh Gia Lai) là quê hương của Anh hùng Đinh Núp. Trong những năm kháng chiến chống thực dân Pháp (1950–1954), đồng bào Bahnar nơi đây đã đoàn kết một lòng theo Đảng, biến buôn làng thành một pháo đài du kích bất khả xâm phạm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-lang-khang-chien-stor'),
    'Hồ sơ di tích Làng kháng chiến Stơr, phần Tổng quan',
    'Buôn làng Bahnar theo kháng chiến chống Pháp giai đoạn 1950-1954'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)',
    'Phong trào chiến tranh du kích của đồng bào các dân tộc Tây Nguyên'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Bắn Pháp chảy máu và biểu tượng Anh hùng Núp', 'Dưới sự lãnh đạo mưu trí của Anh hùng Núp, dân làng Stơr đã đào hầm chông, cài bẫy đá, làm nỏ bắn tên tẩm thuốc độc để diệt giặc. Dù quân Pháp nhiều lần đốt phá buôn làng, bà con vẫn kiên cường bám rừng kháng chiến. Hình tượng kiên trung của Anh hùng Núp đã được nhà văn Nguyên Ngọc khắc họa bất hủ qua tác phẩm văn học ''Đất nước đứng lên''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-lang-khang-chien-stor'),
    'Hồ sơ di tích, mục Tấm gương Anh hùng Núp',
    'Kỹ thuật bẫy chông, bẫy đá và tiểu thuyết Đất nước đứng lên'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Làng kháng chiến Stơr được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1993. Quần thể di tích ngày nay lưu giữ nhà Rông truyền thống, Nhà lưu niệm Anh hùng Núp trưng bày cây nỏ, bộ cung tên và những kỷ vật thiêng liêng của Người con ưu tú của đại ngàn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-lang-khang-chien-stor'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1993',
    'Xếp hạng cấp quốc gia Làng kháng chiến Stơr'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Căn cứ địa khởi nguồn phong trào nông dân Tây Sơn', 'Làng Kiên Mỹ (thị trấn Phú Phong, huyện Tây Sơn) bên dòng sông Côn là quê hương của ba anh em anh hùng Tây Sơn: Nguyễn Nhạc, Nguyễn Huệ và Nguyễn Lữ. Năm 1771, ba anh em đã phất cờ khởi nghĩa với khẩu hiệu ''Lấy của người giàu chia cho người nghèo'', mở đầu phong trào nông dân vĩ đại nhất lịch sử dân tộc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-bao-tang-quang-trung'),
    'Hồ sơ di tích quốc gia đặc biệt Tây Sơn Tam Kiệt, phần Khởi nguồn',
    'Ba anh em Tây Sơn dựng cờ khởi nghĩa năm 1771 tại Kiên Mỹ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Phong trào nông dân Tây Sơn và người anh hùng Nguyễn Huệ',
    'Khởi nghĩa Tây Sơn và sự nghiệp thống nhất non sông'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đại nghiệp thống nhất và quét sạch ngoại xâm', 'Dưới sự lãnh đạo thiên tài của Hoàng đế Quang Trung - Nguyễn Huệ, nghĩa quân Tây Sơn đã lật đổ các tập đoàn phong kiến cát cứ Nguyễn, Trịnh, Lê, hoàn thành đại nghiệp thống nhất đất nước; đồng thời đánh tan 5 vạn quân Xiêm tại Rạch Gầm - Xoài Mút (1785) và đại phá 29 vạn quân Mãn Thanh mùa xuân Kỷ Dậu (1789).', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-bao-tang-quang-trung'),
    'Hồ sơ chiến công Rạch Gầm - Xoài Mút và Ngọc Hồi - Đống Đa',
    'Chiến công đánh tan quân Xiêm 1785 và đại phá quân Thanh 1789'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Đền thờ Tây Sơn Tam Kiệt và Bảo tàng Quang Trung được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây bảo tồn cây me cổ thụ và giếng nước xưa hơn 300 năm tuổi của gia đình ba anh em Tây Sơn cùng dàn nhạc võ Tây Sơn vang lừng hào khí.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-bao-tang-quang-trung'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Đền thờ Tây Sơn Tam Kiệt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Căn cứ không quân quan trọng giải phóng tháng 4/1975', 'Sân bay Thành Sơn (thành phố Phan Rang) là căn cứ không quân kiên cố của quân đội Sài Gòn tại vùng duyên hải Nam Trung Bộ. Giữa tháng 4/1975, trong cuộc tiến công thần tốc của cánh quân Duyên Hải, quân ta đã giải phóng sân bay Thành Sơn và thu giữ nguyên vẹn một số máy bay ném bom A-37 của địch.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-san-bay-thanh-son'),
    'Hồ sơ di tích Sân bay Thành Sơn, phần Giải phóng tháng 4/1975',
    'Thu giữ máy bay A-37 tại căn cứ Thành Sơn ngày 16/4/1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến dịch Hồ Chí Minh lịch sử và cuộc tiến công mùa Xuân 1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Phi đội Quyết Thắng dội bom sân bay Tân Sơn Nhất chiều 28/4/1975', 'Chiều ngày 28/4/1975, thực hiện chỉ thị của Bộ Tổng Tư lệnh, Phi đội Quyết Thắng gồm 5 máy bay A-37 do phi công Nguyễn Thành Trung dẫn đường cùng các phi công Từ Đễ, Nguyễn Văn Lục, Hán Văn Quảng, Hoàng Mai Vượng đã cất cánh từ sân bay Thành Sơn, bí mật bay thẳng vào Sài Gòn ném bom chính xác phá hủy nhiều máy bay giặc tại sân bay Tân Sơn Nhất, làm tê liệt hoàn toàn không quân địch trước giờ tổng công kích.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-san-bay-thanh-son'),
    'Hồ sơ xuất kích của Phi đội Quyết Thắng chiều 28/4/1975',
    '5 phi công lái A-37 ném bom Tân Sơn Nhất làm tê liệt không quân đối phương'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Đòn tập kích đường không bất ngờ ngày 28/4/1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Địa điểm xuất kích của Phi đội Quyết Thắng tại Sân bay Thành Sơn được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích Lịch sử Quốc gia, là niềm tự hào của Quân chủng Phòng không - Không quân và quân dân miền Trung trong đại thắng mùa Xuân 1975.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-san-bay-thanh-son'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia',
    'Xếp hạng cấp quốc gia địa điểm xuất kích Phi đội Quyết Thắng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Quần thể kiến trúc đền tháp Chăm-pa cổ kính bên cửa biển', 'Tháp Bà Ponagar tọa lạc trên đỉnh đồi Cù Lao cao hơn 10m so với mực nước biển, soi bóng bên dòng sông Cái (thành phố Nha Trang, Khánh Hòa). Quần thể được xây dựng từ thế kỷ VIII đến thế kỷ XIII, là trung tâm tôn giáo tín ngưỡng quan trọng nhất của người Chăm ở vùng Nam Trung Bộ xưa.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thap-ba-ponagar'),
    'Hồ sơ di tích quốc gia đặc biệt Tháp Bà Ponagar, phần Lịch sử',
    'Xây dựng từ thế kỷ VIII đến XIII thờ Nữ thần Ponagar'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Chuyên đề: Di sản kiến trúc đền tháp và văn minh Champa',
    'Quần thể Tháp Bà Ponagar Nha Trang'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nghệ thuật kiến trúc gạch nung và thờ Thánh Mẫu Thiên Y A Na', 'Quần thể gồm 4 ngôi đền tháp cổ kính xây bằng gạch nung đỏ rực rỡ, trong đó tháp chính cao 23m là tuyệt tác kiến trúc thờ Nữ thần Ponagar (Thiên Y A Na Thánh Mẫu). Bên trong tháp lưu giữ bức tượng Nữ thần bằng đá hoa cương đen nguyên khối ngồi trên đài sen linh thiêng tỏa ra vẻ đẹp huyền bí.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thap-ba-ponagar'),
    'Hồ sơ kiến trúc tháp chính và pho tượng đá hoa cương',
    'Tháp chính cao 23m và pho tượng Nữ thần Ponagar ngồi trên tòa sen'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ghi nhận giá trị lịch sử và nghệ thuật kiến trúc kiệt xuất, ngày 31/12/2020, Thủ tướng Chính phủ đã ký Quyết định số 2280/QĐ-TTg xếp hạng Tháp Bà Ponagar là Di tích Quốc gia Đặc biệt. Lễ hội Tháp Bà Ponagar diễn ra vào tháng 3 âm lịch hàng năm được công nhận là Di sản Văn hóa Phi vật thể Quốc gia.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-thap-ba-ponagar'),
    'Quyết định số 2280/QĐ-TTg ngày 31/12/2020',
    'Xếp hạng Di tích quốc gia đặc biệt Tháp Bà Ponagar Nha Trang'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Đòn điểm huyệt chiến lược trên chiến trường Tây Nguyên', 'Đầu năm 1975, trong kế hoạch giải phóng hoàn toàn miền Nam, Bộ Chính trị và Quân ủy Trung ương đã chọn thị xã Buôn Ma Thuột (Đắk Lắk) làm mục tiêu tiến công mở màn quyết định của Chiến dịch Tây Nguyên. Nơi đây là trung tâm chính trị, quân sự hiểm yếu nhưng đối phương lại phán đoán sai lầm, cho rằng ta sẽ đánh vào Pleiku hoặc Kon Tum.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-buon-ma-thuot'),
    'Hồ sơ di tích Chiến thắng Buôn Ma Thuột, phần Kế hoạch chiến lược',
    'Quyết định chọn Buôn Ma Thuột làm đòn điểm huyệt mở màn năm 1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến dịch Tây Nguyên mở màn cuộc Tổng tiến công mùa Xuân 1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trận tiến công thần tốc ngày 10/3/1975', 'Đúng 2 giờ sáng ngày 10/3/1975, quân ta đồng loạt nổ súng đánh vào các vị trí then chốt như Sở chỉ huy Sư đoàn 23 ngụy, sân bay Hòa Bình và thị xã. Sau hơn 30 giờ chiến đấu dũng mãnh, quân ta đã giải phóng hoàn toàn thị xã Buôn Ma Thuột chiều 11/3/1975. Thắng lợi vang dội này đã châm ngòi cho cuộc rút chạy hỗn loạn của đối phương khỏi toàn bộ Tây Nguyên.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-buon-ma-thuot'),
    'Hồ sơ diễn biến trận đánh ngày 10-11/3/1975',
    'Diễn biến giải phóng Buôn Ma Thuột và sự sụp đổ của quân ngụy'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Ý nghĩa chiến thắng Buôn Ma Thuột chuyển cuộc kháng chiến sang tổng tiến công'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Tượng đài Chiến thắng và Di tích Nhà đày ngày nay', 'Tượng đài Chiến thắng Buôn Ma Thuột mô phỏng hình ảnh chiếc xe tăng tiến vào ngã sáu trung tâm thành phố là biểu tượng hào hùng của đồng bào Tây Nguyên. Bên cạnh đó, Di tích Lịch sử Nhà đày Buôn Ma Thuột được xếp hạng Di tích Quốc gia Đặc biệt năm 2018, bảo tồn chứng tích kiên cường của các chiến sĩ cộng sản.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-buon-ma-thuot'),
    'Quyết định xếp hạng Di tích quốc gia đặc biệt Nhà đày Buôn Ma Thuột 2018',
    'Xếp hạng cấp quốc gia đặc biệt Nhà đày Buôn Ma Thuột'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vịnh biển kín đáo chân đèo Cả', 'Vịnh Vũng Rô (thị xã Đông Hòa) là vịnh nước sâu tự nhiên kín gió, ba bề được bao bọc bởi dãy núi Đèo Cả, núi Đá Bia và hòn Bà hùng vĩ. Với vị thế hiểm yếu sát tuyến đường sắt và Quốc lộ 1, nơi đây được Trung ương và Bộ Tư lệnh Hải quân chọn làm bến tiếp nhận bí mật của những chuyến Tàu Không số chi viện cho chiến trường Khu 5 và Tây Nguyên.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-vung-ro'),
    'Hồ sơ di tích quốc gia đặc biệt Vịnh Vũng Rô, phần Vị trí địa lý',
    'Vị trí vịnh nước sâu kín gió chân đèo Cả và chọn làm bến tiếp nhận'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Huyền thoại Đường Hồ Chí Minh trên biển và bến Vũng Rô'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Huyền thoại Tàu 41 và trận chiến quả cảm Tàu 143', 'Từ cuối năm 1964 đến đầu 1965, Tàu 41 do thuyền trưởng Hồ Đắc Thạnh chỉ huy đã cập bến Vũng Rô an toàn 3 chuyến liên tiếp, đưa hàng trăm tấn vũ khí vào chiến trường. Chuyến thứ tư vào tháng 2/1965 của Tàu 143 không may bị máy bay địch phát hiện. Thuyền trưởng Lê Văn Thêm cùng các thủy thủ đã chiến đấu kiên cường và cho nổ hủy tàu để bảo vệ tuyệt đối bí mật tuyến đường biển.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-vung-ro'),
    'Hồ sơ sự kiện Tàu 41 và Tàu 143 tháng 2/1965',
    '3 chuyến tàu cập bến an toàn và trận nổ hủy Tàu 143 bảo vệ bí mật'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Địa điểm Tàu Không số Vịnh Vũng Rô được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Đài tưởng niệm hình con tàu xé sóng vươn ra biển khơi sừng sững bên làn nước xanh ngọc bích ghi nhớ công lao của những người lính cảm tử.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-vung-ro'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Vịnh Vũng Rô'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'truong-duc-thanh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Mái trường chấn hưng dân trí phong trào Duy Tân', 'Trường Dục Thanh (Giáo dục Thanh niên) tọa lạc bên bờ sông Cà Ty (thành phố Phan Thiết), do các sĩ phu yêu nước phong trào Duy Tân sáng lập năm 1907. Trường dạy chữ Quốc ngữ, chữ Pháp, chữ Hán và truyền bá tư tưởng yêu nước tiến bộ, khơi dậy tinh thần tự lực tự cường dân tộc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-truong-duc-thanh'),
    'Hồ sơ di tích Trường Dục Thanh, phần Thành lập năm 1907',
    'Sĩ phu yêu nước phong trào Duy Tân sáng lập trường Dục Thanh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 11: Phong trào yêu nước chống Pháp cuối thế kỷ XIX đầu thế kỷ XX',
    'Phong trào Duy Tân và chấn hưng văn hóa dân tộc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'truong-duc-thanh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Dấu chân thầy giáo Nguyễn Tất Thành năm 1910', 'Tháng 9/1910, người thanh niên yêu nước Nguyễn Tất Thành (thầy giáo Thành) dừng chân tại Phan Thiết và nhận dạy học tại trường Dục Thanh. Thầy tận tình giảng dạy các môn Quốc văn, Hán văn và thể dục, truyền tình yêu quê hương đất nước cho học trò. Tháng 2/1911, Người rời trường Dục Thanh vào Sài Gòn, chuẩn bị ra đi tìm đường cứu nước ngày 5/6/1911.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-truong-duc-thanh'),
    'Hồ sơ thời gian Bác Hồ dạy học tháng 9/1910 - 2/1911',
    'Hoạt động dạy học và chuẩn bị vào Sài Gòn tìm đường cứu nước'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Nguyễn Tất Thành ra đi tìm đường cứu nước năm 1911'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'truong-duc-thanh';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Trường Dục Thanh được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1986. Khu di tích bảo tồn nguyên vẹn lớp học cổ, gian nhà Ngư, cây khế do chính tay Bác chăm sóc và giếng nước mát, nằm liền kề Bảo tàng Hồ Chí Minh chi nhánh Bình Thuận.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-truong-duc-thanh'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1986',
    'Xếp hạng cấp quốc gia Khu di tích Trường Dục Thanh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Nhà tù đặc biệt giam giữ thiếu niên yêu nước miền Nam', 'Đầu năm 1971, chính quyền Sài Gòn thành lập ''Trung tâm Giáo huấn Thiếu nhi Đà Lạt'' (thường gọi là Nhà lao Thiếu nhi Đà Lạt) nhằm cách ly, giam cầm và mưu toan dùng đòn roi cùng luận điệu chiêu hồi để ''tẩy não'' hơn 600 thiếu niên yêu nước bị địch bắt từ các chiến trường miền Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-lao-thieu-nhi-da-lat'),
    'Hồ sơ di tích Nhà lao Thiếu nhi Đà Lạt, phần Thành lập 1971',
    'Thành lập trại giam cách ly hơn 600 thiếu niên yêu nước miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Ngọn lửa kiên trung và cuộc đấu tranh bất khuất', 'Dù tuổi đời chỉ từ 12 đến 17, các chiến sĩ nhỏ tuổi đã kiên cường bí mật thành lập chi bộ Đảng, tổ chức Đoàn TNCS Hồ Chí Minh ngay trong ngục tối. Anh em đồng lòng tuyệt thực, chống chào cờ ngụy, tự mổ bụng phản đối đòn tra tấn dã man và tổ chức vượt ngục quả cảm, giữ trọn khí tiết của người chiến sĩ cách mạng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-lao-thieu-nhi-da-lat'),
    'Hồ sơ di tích, mục Phong trào đấu tranh của tù nhân thiếu nhi',
    'Tổ chức chi bộ bí mật, tuyệt thực và giữ vững khí tiết cách mạng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Ghi nhận ý chí bất khuất phi thường của thế hệ trẻ anh hùng, năm 2009, Bộ Văn hóa, Thể thao và Du lịch đã xếp hạng Nhà lao Thiếu nhi Đà Lạt là Di tích Lịch sử Quốc gia. Tập thể các cựu tù thiếu nhi Đà Lạt được Chủ tịch nước phong tặng danh hiệu Anh hùng Lực lượng vũ trang nhân dân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-lao-thieu-nhi-da-lat'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 2009',
    'Xếp hạng cấp quốc gia và danh hiệu Anh hùng LLVTND'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Cánh cửa thép phòng thủ bảo vệ Sài Gòn', 'Sau khi thất thủ tại Tây Nguyên và Huế - Đà Nẵng, quân đội Sài Gòn dồn sức lập phòng tuyến Xuân Lộc (Long Khánh, Đồng Nai) làm ''Cánh cửa thép'' tử thủ che chắn hướng đông Sài Gòn. Tướng địch tuyên bố sẽ ''tử thủ Xuân Lộc'' với Sư đoàn 18 bộ binh, lữ đoàn dù cùng bom phá CBU-55 hiện đại do Mỹ cung cấp.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-xuan-loc'),
    'Hồ sơ di tích Chiến thắng Xuân Lộc 1975, phần Bối cảnh',
    'Phòng tuyến tử thủ Cánh cửa thép bảo vệ hướng đông Sài Gòn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến dịch Xuân Lộc mở toang cửa ngõ tiến vào Sài Gòn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, '12 ngày đêm đập tan cánh cửa thép ngày 21/4/1975', 'Từ ngày 9 đến 21/4/1975, Quân đoàn 4 cùng các lực lượng vũ trang địa phương đã tiến công kiên cường. Trước sức kháng cự điên cuồng của địch, Bộ chỉ huy chiến dịch đã linh hoạt chuyển cách đánh sang bao vây, cô lập và diệt quân viện. Ngày 21/4/1975, phòng tuyến Xuân Lộc bị đập tan hoàn toàn, tàn quân địch tháo chạy, mở toang cửa ngõ phía đông cho đại quân ta tiến vào giải phóng Sài Gòn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-xuan-loc'),
    'Hồ sơ diễn biến 12 ngày đêm từ 9 đến 21/4/1975',
    'Đập tan phòng tuyến Xuân Lộc ngày 21/4/1975 mở đường vào Sài Gòn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Thắng lợi Xuân Lộc tạo thời cơ trực tiếp mở Chiến dịch Hồ Chí Minh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Chiến thắng Xuân Lộc được ghi dấu bằng Tượng đài Chiến thắng Xuân Lộc uy nghi tại thành phố Long Khánh, được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1988, là niềm tự hào sáng ngời của quân dân Đồng Nai ''miền Đông gian lao mà anh dũng''.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-xuan-loc'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1988',
    'Xếp hạng cấp quốc gia Tượng đài Chiến thắng Xuân Lộc 1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Đại bản doanh Bộ Tư lệnh Miền giữa đại ngàn', 'Căn cứ Tà Thiết (xã An Phú, huyện Lộc Ninh) nằm sâu trong cánh rừng nguyên sinh bạt ngàn tiếp giáp biên giới. Từ năm 1973, nơi đây được xây dựng thành căn cứ địa cách mạng trung tâm của Bộ Tư lệnh Quân giải phóng miền Nam Việt Nam, bảo đảm an toàn tuyệt đối cho cơ quan chỉ đạo tác chiến.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-can-cu-ta-thiet'),
    'Hồ sơ di tích quốc gia đặc biệt Căn cứ Tà Thiết, phần Bối cảnh',
    'Xây dựng căn cứ Bộ Tư lệnh Miền tại Tà Thiết từ năm 1973'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Sở chỉ huy Chiến dịch Hồ Chí Minh lịch sử'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Sở Chỉ huy tiền phương Chiến dịch Hồ Chí Minh lịch sử', 'Tháng 4/1975, tại căn cứ Tà Thiết, Bộ Chỉ huy Chiến dịch Hồ Chí Minh do Đại tướng Văn Tiến Dũng làm Tư lệnh, đồng chí Phạm Hùng làm Chính ủy đã họp bàn, thông qua quyết tâm tác chiến thần tốc đánh chiếm 5 mục tiêu đầu não tại Sài Gòn, chỉ huy đại quân ta toàn thắng giải phóng miền Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-can-cu-ta-thiet'),
    'Hồ sơ di tích lán làm việc Bộ Chỉ huy Chiến dịch Hồ Chí Minh',
    'Đại tướng Văn Tiến Dũng và đồng chí Phạm Hùng chỉ huy chiến dịch tháng 4/1975'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Căn cứ Bộ Chỉ huy Miền Tà Thiết được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây phục dựng nguyên trạng các căn lán làm việc bán âm, hầm họp Bộ Chỉ huy và nhà bia tưởng niệm thiêng liêng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-can-cu-ta-thiet'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Căn cứ Tà Thiết'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dinh-doc-lap';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Trung tâm quyền lực của chính quyền Sài Gòn', 'Dinh Độc Lập (nay là Hội trường Thống Nhất) tọa lạc tại trung tâm Quận 1, Thành phố Hồ Chí Minh. Được kiến trúc sư Ngô Viết Thụ thiết kế kết hợp hài hòa giữa triết lý phương Đông và kiến trúc hiện đại, nơi đây từng là nơi ở và làm việc của Tổng thống chính quyền Sài Gòn trong suốt thời kỳ kháng chiến chống Mỹ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dinh-doc-lap'),
    'Hồ sơ di tích quốc gia đặc biệt Dinh Độc Lập, phần Kiến trúc',
    'Thiết kế của KTS Ngô Viết Thụ và vai trò dinh tổng thống'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Mục tiêu sào huyệt cuối cùng của Chiến dịch Hồ Chí Minh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dinh-doc-lap';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Giây phút lịch sử trưa 30/4/1975 toàn thắng non sông', 'Đúng 10 giờ 45 phút ngày 30/4/1975, xe tăng T-59 mang số hiệu 390 và xe tăng 843 thuộc Lữ đoàn 203 đã húc đổ cánh cổng sắt tiến thẳng vào sân Dinh Độc Lập. Trung úy Bùi Quang Thận đã cắm lá cờ Mặt trận Dân tộc Giải phóng miền Nam lên nóc Dinh lúc 11 giờ 30 phút. Tổng thống Dương Văn Minh tuyên bố đầu hàng không điều kiện, non sông Việt Nam thu về một mối.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dinh-doc-lap'),
    'Hồ sơ sự kiện trưa ngày 30/4/1975',
    'Xe tăng húc cổng và cắm cờ giải phóng trên nóc Dinh Độc Lập lúc 11h30'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Toàn thắng Chiến dịch Hồ Chí Minh giải phóng hoàn toàn miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dinh-doc-lap';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Dinh Độc Lập được xếp hạng Di tích Quốc gia Đặc biệt đợt đầu tiên theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009 của Thủ tướng Chính phủ. Nơi đây lưu giữ nguyên trạng phòng khánh tiết, hầm chỉ huy ngầm và hai chiếc xe tăng 390, 843 (được công nhận là Bảo vật Quốc gia) đón hàng triệu lượt du khách tham quan.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dinh-doc-lap'),
    'Quyết định số 1272/QĐ-TTg ngày 12/8/2009',
    'Xếp hạng Di tích quốc gia đặc biệt Di tích lịch sử Dinh Độc Lập'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Vùng đất thép thành đồng cửa ngõ Sài Gòn', 'Huyện Củ Chi nằm ở cửa ngõ tây bắc Sài Gòn, là căn cứ kháng chiến trực tiếp đe dọa sào huyệt của đối phương. Trong chiến tranh, quân đội Mỹ đã biến nơi đây thành ''vùng tự do oanh kích'' với hàng vạn tấn bom đạn, chất độc hóa học nhằm biến vùng đất thành hoang mạc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dia-dao-cu-chi'),
    'Hồ sơ di tích quốc gia đặc biệt Địa đạo Củ Chi, phần Bối cảnh',
    'Vùng đất thép Củ Chi và sự tàn phá bom đạn của quân đội Mỹ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Thành đồng Củ Chi và thế trận chiến tranh nhân dân'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Kỳ tích mê cung hơn 250km trong lòng đất', 'Bằng lưỡi cuốc và đôi tay trần, quân và dân Củ Chi đã kiến tạo nên hệ thống địa đạo kỳ vĩ dài hơn 250km len lỏi sâu trong lòng đất. Địa đạo gồm 3 tầng hầm thông nhau, chịu được sức công phá của pháo binh và xe tăng, có đầy đủ bệnh xá, giếng nước, bếp Hoàng Cầm giấu khói và xưởng công binh chế tạo vũ khí đánh giặc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dia-dao-cu-chi'),
    'Khảo sát cấu trúc 3 tầng hầm địa đạo Củ Chi',
    'Chiều dài hơn 250km và hệ thống phòng ốc sinh hoạt ngầm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Địa đạo Củ Chi được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Hai khu di tích Bến Dược và Bến Đình hàng năm đón hàng triệu du khách quốc tế đến chiêm ngưỡng biểu tượng kỳ diệu của ý chí chiến đấu quật cường của nhân dân Việt Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dia-dao-cu-chi'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Địa đạo Củ Chi'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Thủ đô kháng chiến chỉ đạo cách mạng miền Nam', 'Khu căn cứ Trung ương Cục miền Nam (còn gọi là căn cứ Rùm Đuôn, xã Tân Lập, huyện Tân Biên, Tây Ninh) nằm ẩn mình giữa cánh rừng già nguyên sinh giáp biên giới. Từ năm 1961 đến 1975, nơi đây giữ vị trí là cơ quan đầu não tối cao trực tiếp lãnh đạo phong trào cách mạng và các lực lượng vũ trang giải phóng toàn miền Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-trung-uong-cuc-mien-nam'),
    'Hồ sơ di tích quốc gia đặc biệt Căn cứ Trung ương Cục, phần Lịch sử',
    'Thành lập căn cứ năm 1961 và vai trò chỉ đạo cách mạng miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Trung ương Cục miền Nam và Mặt trận Dân tộc Giải phóng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Nơi ghi dấu bước chân những nhà lãnh đạo kiệt xuất', 'Dưới những mái lán lợp lá trung quân mộc mạc nép mình bên công sự ngầm, các đồng chí lãnh đạo kiệt xuất của Đảng như Nguyễn Văn Linh, Nguyễn Chí Thanh, Phạm Hùng, Võ Văn Kiệt đã sống, làm việc và ban hành những chỉ thị, nghị quyết chiến lược đánh bại các chiến lược chiến tranh của đế quốc Mỹ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-trung-uong-cuc-mien-nam'),
    'Hồ sơ các khu nhà làm việc của đồng chí Nguyễn Văn Linh và Phạm Hùng',
    'Các đồng chí lãnh đạo sống và làm việc chỉ đạo kháng chiến'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Căn cứ Trung ương Cục miền Nam được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể bảo tồn các căn lán đơn sơ, đường giao thông hào rợp mát bóng cây cổ thụ và nhà trưng bày truyền thống cách mạng vẻ vang.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-trung-uong-cuc-mien-nam'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Căn cứ Trung ương Cục miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Đầu mối giao thương và căn cứ cách mạng cửa ngõ Sài Gòn', 'Khu vực Ngã tư Đức Hòa (thị trấn Đức Hòa) là đầu mối giao thông huyết mạch kết nối vùng Chợ Lớn với miền Đông Nam Bộ. Nhờ lòng dân yêu nước nồng nàn, nơi đây đã sớm trở thành trung tâm cách mạng tiền khởi nghĩa của phong trào công - nông Nam Bộ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nga-tu-duc-hoa'),
    'Hồ sơ di tích Ngã tư Đức Hòa, phần Bối cảnh',
    'Vị trí giao thương và phong trào cách mạng tiền khởi nghĩa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Sự ra đời các tổ chức Đảng Cộng sản đầu tiên tại Nam Bộ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Chi bộ Đảng đầu tiên và cuộc biểu tình lịch sử ngày 4/6/1930', 'Ngày 6/3/1930, đồng chí Võ Văn Tần đã thành lập Chi bộ An Nam Cộng sản Đảng đầu tiên của tỉnh Chợ Lớn tại Đức Hòa. Ngày 4/6/1930, đồng chí Châu Văn Liêm cùng Võ Văn Tần đã lãnh đạo cuộc biểu tình của hơn 5.000 nông dân đòi giảm thuế. Đồng chí Châu Văn Liêm đã anh dũng hy sinh trước họng súng kẻ thù, nêu tấm gương ái quốc sáng ngời.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nga-tu-duc-hoa'),
    'Hồ sơ di tích, cuộc biểu tình ngày 4/6/1930',
    'Thành lập chi bộ 6/3/1930 và gương hy sinh của Châu Văn Liêm'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Ngã tư Đức Hòa được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1989. Tượng đài đồng chí Võ Văn Tần và công viên tưởng niệm được xây dựng khang trang, là niềm tự hào của đồng bào Long An - Tây Ninh kiên cường.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nga-tu-duc-hoa'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1989',
    'Xếp hạng cấp quốc gia Khu di tích Ngã tư Đức Hòa'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Thử nghiệm chiến thuật Trực thăng vận của đối phương', 'Đầu năm 1963, trong chiến lược ''Chiến tranh đặc biệt'', quân đội Sài Gòn dưới sự chỉ đạo của cố vấn quân sự Mỹ đã mở cuộc hành quân càn quét quy mô lớn vào ấp Bắc (xã Tân Phú, Cai Lậy), huy động máy bay trực thăng vận và xe bọc thép thiết xa vận M-113 hiện đại.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-ap-bac'),
    'Hồ sơ di tích quốc gia đặc biệt Chiến thắng Ấp Bắc, phần Bối cảnh',
    'Mỹ thử nghiệm chiến thuật Trực thăng vận và Thiết xa vận đầu năm 1963'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chiến lược Chiến tranh đặc biệt và trận đánh Ấp Bắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Chiến thắng vang dội ngày 2/1/1963 làm phá sản chiến thuật mới', 'Ngày 2/1/1963, lực lượng vũ trang giải phóng cùng du kích địa phương đã kiên cường đánh bại 5 đợt tiến công của đối phương, bắn rơi 5 trực thăng, bắn cháy 3 xe bọc thép M-113, loại khỏi vòng chiến đấu hàng trăm tên địch. Chiến thắng Ấp Bắc đã chứng minh quân dân ta hoàn toàn có khả năng đánh bại các chiến thuật quân sự tối tân của Mỹ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-ap-bac'),
    'Hồ sơ chiến lệ trận Ấp Bắc ngày 2/1/1963',
    'Bắn rơi 5 trực thăng và 3 xe M-113 làm phá sản chiến thuật của Mỹ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Ý nghĩa chiến thắng Ấp Bắc dấy lên phong trào Thi đua Ấp Bắc giết giặc lập công'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Địa điểm Chiến thắng Ấp Bắc được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2280/QĐ-TTg ngày 31/12/2020. Quần thể bảo tồn tượng đài ba chiến sĩ gang thép, khu mộ liệt sĩ và nhà trưng bày hiện vật xe bọc thép, trực thăng bị bắn hạ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-ap-bac'),
    'Quyết định số 2280/QĐ-TTg ngày 31/12/2020',
    'Xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Ấp Bắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Tấm gương nhà nho thanh bạch trọn đời vì dân', 'Cụ Phó bảng Nguyễn Sinh Sắc (1862–1929) là thân sinh của Chủ tịch Hồ Chí Minh, một nhà nho yêu nước có nhân cách cao đẹp. Sau khi từ quan, Cụ vào Nam bốc thuốc chữa bệnh cho người nghèo và truyền bá tư tưởng yêu nước, trút hơi thở cuối cùng tại làng Hòa An (thành phố Cao Lãnh) ngày 27/10 năm Kỷ Tỵ (1929).', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-mo-nguyen-sinh-sac'),
    'Hồ sơ di tích Mộ Cụ Phó bảng Nguyễn Sinh Sắc, phần Tiểu sử',
    'Cuộc đời thanh bạch của Cụ Phó bảng và giai đoạn sống tại Hòa An'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Thân thế thân phụ Chủ tịch Hồ Chí Minh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Tấm lòng son sắt của nhân dân miền Nam', 'Dù trong những năm tháng kháng chiến bị địch khủng bố gắt gao, nhân dân làng Hòa An và đồng bào miền Nam vẫn một lòng bảo vệ, gìn giữ chu đáo phần mộ của Cụ. Sau ngày thống nhất non sông, khu lăng mộ được xây dựng khang trang với vòm mộ hình cánh sen thanh khiết vươn lên giữa hồ sen ngát hương.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-mo-nguyen-sinh-sac'),
    'Hồ sơ di tích, tấm lòng nhân dân Hòa An bảo vệ khu mộ',
    'Tấm lòng đồng bào miền Nam che chở phần mộ qua hai cuộc kháng chiến'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Khu di tích Mộ Cụ Phó bảng Nguyễn Sinh Sắc được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1992. Khuôn viên rộng hơn 9ha gồm khu lăng mộ, nhà sàn Bác Hồ phục dựng và làng cổ Hòa An tái hiện không gian văn hóa Nam Bộ thanh bình.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-mo-nguyen-sinh-sac'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1992',
    'Xếp hạng cấp quốc gia Khu di tích Cụ Phó bảng Nguyễn Sinh Sắc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Bối cảnh ngột ngạt dưới đạo luật 10/59', 'Cuối thập niên 1950, chính quyền Ngô Đình Diệm ban hành Luật 10/59 lê máy chém đi khắp miền Nam tàn sát những người kháng chiến yêu nước. Trước tình thế ngặt nghèo ''một mất một còn'', Nghị quyết 15 của Trung ương Đảng (1959) đã mở đường cho nhân dân miền Nam vùng lên đấu tranh vũ trang giải phóng buôn làng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dong-khoi-ben-tre'),
    'Hồ sơ di tích quốc gia đặc biệt Đồng Khởi Bến Tre, phần Bối cảnh',
    'Tội ác Luật 10/59 và ánh sáng Nghị quyết 15 của Đảng năm 1959'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)',
    'Phong trào Đồng Khởi (1959-1960) chuyển cách mạng từ giữ gìn lực lượng sang tiến công'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Tiếng súng Định Thủy ngày 17/1/1960 và Đội quân Tóc dài huyền thoại', 'Sáng ngày 17/1/1960, dưới sự lãnh đạo trực tiếp của đồng chí Nguyễn Thị Định, cuộc khởi nghĩa đồng loạt bùng nổ tại ba xã Định Thủy, Phước Hiệp, Bình Khánh (huyện Mỏ Cày). Bằng súng ngựa trời, giáo mác, tiếng mõ dồn dập và sức mạnh vô song của ''Đội quân Tóc dài'', quần chúng đã làm tan rã tề ngụy, phá ấp chiến lược, châm ngòi cho cao trào Đồng Khởi toàn miền Nam.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dong-khoi-ben-tre'),
    'Hồ sơ sự kiện ngày 17/1/1960 tại Định Thủy',
    'Đồng chí Nguyễn Thị Định chỉ đạo và sự ra đời Đội quân Tóc dài'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)',
    'Ý nghĩa phong trào Đồng Khởi dẫn đến sự ra đời Mặt trận Dân tộc Giải phóng miền Nam'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu di tích lịch sử Đồng Khởi Bến Tre được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nhà trưng bày di tích tại xã Định Thủy lưu giữ khẩu súng ngựa trời, chiếc mõ dừa lịch sử và tượng đài biểu tượng Đội quân Tóc dài anh dũng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-dong-khoi-ben-tre'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Đồng Khởi Bến Tre'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Người con ưu tú của quê hương Vĩnh Long', 'Đồng chí Võ Văn Kiệt (bác Sáu Dân, tên khai sinh Phan Văn Hòa, 1922–2008) sinh ra tại xã Trung Hiệp, huyện Vũng Liêm, tỉnh Vĩnh Long. Sớm giác ngộ cách mạng từ năm 16 tuổi trong phong trào Nam Kỳ Khởi nghĩa, đồng chí đã cống hiến trọn đời cho sự nghiệp giải phóng dân tộc và phát triển đất nước.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-vo-van-kiet'),
    'Hồ sơ Khu tưởng niệm Thủ tướng Võ Văn Kiệt, phần Tiểu sử',
    'Quê hương Vũng Liêm và quá trình giác ngộ cách mạng thời niên thiếu'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 18: Đất nước trên con đường đổi mới (1986-2000)',
    'Nhà lãnh đạo Đổi Mới kiệt xuất của Đảng và Nhà nước'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Kiến trúc sư kiệt xuất của công cuộc Đổi Mới', 'Trên cương vị Thủ tướng Chính phủ, đồng chí Võ Văn Kiệt đã đưa ra những quyết sách mang tính đột phá lịch sử: xây dựng đường dây tải điện 500kV Bắc - Nam xuyên rừng núi, công trình thoát lũ ra biển Tây khai phá Đồng Tháp Mười, đường Hồ Chí Minh và nhà máy lọc dầu Dung Quất, tạo tiền đề đưa kinh tế Việt Nam cất cánh.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-vo-van-kiet'),
    'Hồ sơ trưng bày các công trình thế kỷ đường dây 500kV và thoát lũ biển Tây',
    'Những quyết sách đột phá của Thủ tướng Võ Văn Kiệt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Khu tưởng niệm Vườn ông Sáu Dân ngày nay', 'Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt tọa lạc tại thị trấn Vũng Liêm với không gian kiến trúc mở hài hòa, cây xanh rợp bóng được nhân dân trìu mến gọi là ''Vườn ông Sáu Dân''. Nơi đây lưu giữ bức chân dung đồng chí ghép từ 15.000 bức ảnh nhỏ về cuộc đời và sự nghiệp vẻ vang của Người.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-vo-van-kiet'),
    'Văn bản quản lý Khu tưởng niệm Thủ tướng Võ Văn Kiệt',
    'Không gian kiến trúc Vườn ông Sáu Dân và bức chân dung 15.000 tấm ảnh'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Địa ngục trần gian giam giữ hơn 4 vạn chiến sĩ cách mạng', 'Trại giam Tù binh Chiến tranh Phú Quốc (còn gọi là Nhà lao Cây Dừa, thành phố Phú Quốc) do chính quyền Sài Gòn với sự viện trợ của Mỹ xây dựng năm 1967 trên diện tích hơn 400 ha. Đây là trại giam tù binh lớn nhất miền Nam, giam giữ hơn 40.000 lượt cán bộ, chiến sĩ cách mạng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-phu-quoc'),
    'Hồ sơ di tích quốc gia đặc biệt Nhà tù Phú Quốc, phần Quy mô',
    'Quy mô 400ha và hơn 40.000 lượt chiến sĩ bị giam giữ từ 1967 đến 1973'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Chính sách đàn áp tù binh chiến tranh của Mỹ - ngụy'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Khí tiết kiên trung trước các ngón đòn tra tấn tàn bạo', 'Kẻ thù đã áp dụng hàng chục ngón đòn tra tấn man rợ thời trung cổ như nhốt chuồng cọp kẽm gai phơi nắng mưa, đóng đinh vào xương bánh chè, đục răng, luộc người trong chảo nước sôi. Vượt lên mọi nỗi đau thể xác, các chiến sĩ cộng sản kiên trung đã bí mật lập chi bộ Đảng, tổ chức vượt ngục thần kỳ bằng đường hầm đào bằng muỗng sắt, giữ trọn lời thề trung thành với Tổ quốc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-phu-quoc'),
    'Hồ sơ di tích, mục Tội ác tra tấn và các cuộc vượt ngục',
    'Hình phạt chuồng cọp và cuộc vượt ngục bằng đường hầm đào muỗng sắt'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Ghi nhận ý chí kiên cường bất khuất của các chiến sĩ cách mạng, ngày 31/12/2014, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg xếp hạng Trại giam Tù binh Chiến tranh Phú Quốc là Di tích Quốc gia Đặc biệt. Khuôn viên phục dựng các dãy nhà giam, chuồng cọp kẽm gai và Nghĩa trang Liệt sĩ Đồi 100 trang nghiêm.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-nha-tu-phu-quoc'),
    'Quyết định số 2408/QĐ-TTg ngày 31/12/2014',
    'Xếp hạng Di tích quốc gia đặc biệt Trại giam Tù binh Phú Quốc'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Người con ưu tú của Cù lao Ông Hổ', 'Chủ tịch Tôn Đức Thắng (Bác Tôn, 1888–1980) sinh ra tại cù lao Ông Hổ (xã Mỹ Hòa Hưng, thành phố Long Xuyên, tỉnh An Giang). Nơi đây lưu giữ ngôi nhà gỗ cổ thời niên thiếu bên dòng sông Hậu hiền hòa, nơi nuôi dưỡng phẩm chất kiên cường và lòng yêu nước thương dân của Người.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ton-duc-thang'),
    'Hồ sơ di tích quốc gia đặc biệt Bác Tôn, phần Quê hương',
    'Cù lao Ông Hổ - quê hương sinh thành của Chủ tịch Tôn Đức Thắng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Nhà lãnh đạo công nhân lỗi lạc Tôn Đức Thắng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Người thợ Ba Son kéo cờ Biển Đen và 15 năm ngục tù Côn Đảo', 'Từ người thợ máy dũng cảm kéo cờ đỏ trên chiến hạm France tại Biển Đen ủng hộ Cách mạng Tháng Mười Nga năm 1919, Bác Tôn đã sáng lập Công hội đỏ Ba Son và bị thực dân Pháp kết án 20 năm khổ sai đày ra Côn Đảo. Sau Cách mạng Tháng Tám, Người trở về tiếp tục cống hiến trọn đời cho Đảng và được bầu làm Chủ tịch nước kế tục Chủ tịch Hồ Chí Minh.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ton-duc-thang'),
    'Hồ sơ sự kiện kéo cờ Biển Đen 1919 và 15 năm Côn Đảo',
    'Sự kiện Biển Đen 1919, Công hội Ba Son và 15 năm đày Côn Đảo'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Tổ chức Công hội bí mật của Tôn Đức Thắng tại Sài Gòn'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Khu lưu niệm Chủ tịch Tôn Đức Thắng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể bảo tồn ngôi nhà gỗ thời niên thiếu, đền tưởng niệm trang nghiêm và chuyên cơ YAK-40 từng chở Bác Tôn vào giải phóng Sài Gòn.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ton-duc-thang'),
    'Quyết định số 548/QĐ-TTg ngày 10/5/2012',
    'Xếp hạng Di tích quốc gia đặc biệt Khu lưu niệm Chủ tịch Tôn Đức Thắng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Âm mưu lấn chiếm tràn ngập lãnh thổ của đối phương', 'Sau khi Hiệp định Paris được ký kết ngày 27/1/1973, chính quyền Sài Gòn đã trơ trẽn vi phạm hiệp định, dồn sức tập trung 75 lượt tiểu đoàn tinh nhuệ mở chiến dịch càn quét mang tên ''tràn ngập lãnh thổ'' hòng biến vùng Chương Thiện thành bàn đạp bình định kiểm soát toàn bộ miền Tây Nam Bộ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-chuong-thien'),
    'Hồ sơ di tích quốc gia đặc biệt Chiến thắng Chương Thiện, phần Bối cảnh',
    'Kế hoạch tràn ngập lãnh thổ của địch sau Hiệp định Paris 1973'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Cuộc đấu tranh chống kế hoạch bình định lấn chiếm sau Hiệp định Paris'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Bẻ gãy 75 lượt tiểu đoàn địch năm 1973', 'Quân và dân Quân khu 9 phối hợp cùng bộ đội địa phương đã kiên cường tổ chức đánh phản công và tiến công mãnh liệt. Trải qua hàng trăm trận đánh dũng cảm, ta đã tiêu diệt và bắt sống hàng ngàn tên địch, bẻ gãy hoàn toàn chiến dịch càn quét của 75 lượt tiểu đoàn quân đội Sài Gòn, giữ vững vùng giải phóng rộng lớn ở Tây Nam Bộ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-chuong-thien'),
    'Hồ sơ chiến dịch đánh bại 75 lượt tiểu đoàn địch năm 1973',
    'Thắng lợi bẻ gãy 75 lượt tiểu đoàn địch bảo vệ vùng giải phóng Tây Nam Bộ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Ý nghĩa chiến thắng Chương Thiện khẳng định con đường bạo lực cách mạng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Quốc gia Đặc biệt ngày nay', 'Địa điểm Chiến thắng 75 lượt tiểu đoàn địch của quân và dân khu 9 tại Chương Thiện được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Khu di tích tọa lạc tại thành phố Vị Thanh với tượng đài chiến thắng và bảo tàng trưng bày hiện vật sống động.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-chien-thang-chuong-thien'),
    'Quyết định số 2383/QĐ-TTg ngày 9/12/2013',
    'Xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Chương Thiện'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Nhà tù kiên cố tàn bạo nhất miền Tây Nam Bộ', 'Khám Lớn Cần Thơ (Prison Provinciale) do thực dân Pháp xây dựng năm 1886 tại trung tâm thành phố Cần Thơ. Đây là nhà lao lớn và kiên cố nhất vùng Hậu Giang thời bấy giờ, dùng làm nơi giam giữ, tra tấn dã man các chiến sĩ yêu nước và đồng bào miền Tây Nam Bộ.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kham-lon-can-tho'),
    'Hồ sơ di tích Khám Lớn Cần Thơ, phần Xây dựng năm 1886',
    'Thực dân Pháp xây dựng nhà tù kiên cố tại trung tâm Cần Thơ năm 1886'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 12: Phong trào dân tộc dân chủ 1919-1930',
    'Hệ thống nhà tù thực dân đàn áp phong trào cách mạng Nam Bộ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Trường rèn luyện ý chí của những người cộng sản', 'Trong chốn lao tù tăm tối, các chiến sĩ cách mạng kiên trung như Châu Văn Liêm, Lê Văn Sô, Quản Trọng Hoàng đã biến ngục tù thành trường học cách mạng, bí mật sinh hoạt Đảng, xuất bản truyền đơn và kiên cường tổ chức tuyệt thực đòi dân sinh, giữ trọn khí tiết của người cộng sản.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kham-lon-can-tho'),
    'Hồ sơ di tích, hoạt động của các đồng chí tù chính trị',
    'Biến ngục tù thành trường học của các đồng chí Châu Văn Liêm, Quản Trọng Hoàng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Khám Lớn Cần Thơ được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1996. Quần thể bảo tồn nguyên vẹn các buồng giam tập thể, xà lim biệt giam tối tăm và máy chém thời thuộc địa – chứng tích đanh thép tố cáo tội ác của chế độ thực dân.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-kham-lon-can-tho'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1996',
    'Xếp hạng cấp quốc gia Khám Lớn Cần Thơ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Đốm lửa khởi nghĩa nơi đảo tiền tiêu Tổ quốc', 'Đảo Hòn Khoai nằm ở vùng biển cực nam của Tổ quốc, có vị trí quân sự chiến lược khống chế tuyến hàng hải qua mũi Cà Mau. Trong cao trào Khởi nghĩa Nam Kỳ (11/1940), Chi bộ Đảng đảo Hòn Khoai do thầy giáo Phan Ngọc Hiển phụ trách đã bí mật chuẩn bị lực lượng khởi nghĩa vũ trang đánh chiếm trạm hải đăng của Pháp.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-hon-khoai'),
    'Hồ sơ di tích Khởi nghĩa Hòn Khoai, phần Bối cảnh',
    'Chi bộ Đảng Hòn Khoai và sự chỉ đạo của Phan Ngọc Hiển cuối năm 1940'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Cao trào đấu tranh vũ trang và Khởi nghĩa Nam Kỳ 1940'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đêm nổi dậy 13/12/1940 và khí tiết bất khuất của Phan Ngọc Hiển', 'Đêm ngày 13/12/1940, Phan Ngọc Hiển cùng nghĩa quân đã bất ngờ tấn công đồn hải đăng, tiêu diệt tên sếp đảo Olivier, thu toàn bộ súng đạn rồi vượt biển về đất liền tiếp tục chiến đấu. Dù bị thực dân Pháp bắt giữ và xử bắn ngày 12/7/1941 tại Cà Mau, câu nói bất hủ ''Chúng tôi chết cho Tổ quốc độc lập'' của Phan Ngọc Hiển đã thắp sáng ngọn lửa yêu nước đời đời.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-hon-khoai'),
    'Hồ sơ diễn biến đêm 13/12/1940 và sự hy sinh ngày 12/7/1941',
    'Đánh chiếm đồn hải đăng đêm 13/12/1940 và khí tiết trước pháp trường'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 13: Cách mạng tháng Tám năm 1945',
    'Khởi nghĩa Hòn Khoai - dấu mốc lịch sử truyền thống cách mạng Cà Mau'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Địa điểm Khởi nghĩa Hòn Khoai được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1990. Ngày 13/12 được chọn làm Ngày truyền thống cách mạng vẻ vang của Đảng bộ và quân dân tỉnh Cà Mau. Ngọn hải đăng cổ và tượng đài Phan Ngọc Hiển sừng sững giữa biển khơi bảo vệ chủ quyền thiêng liêng.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-khoi-nghia-hon-khoai'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 1990',
    'Xếp hạng cấp quốc gia Khởi nghĩa Hòn Khoai và Ngày truyền thống Cà Mau'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ben-vam-lung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 1, 'Bến đậu bí mật giữa rừng đước ngập mặn Cà Mau', 'Cửa biển Vàm Lũng (xã Tân Ân, huyện Ngọc Hiển) nằm ẩn mình giữa bạt ngàn rừng đước, mắm ngập mặn nơi tận cùng mũi Cà Mau. Với mạng lưới kênh rạch chằng chịt dẫn thẳng vào căn cứ U Minh, nơi đây được Trung ương chọn làm bến tiếp nhận vũ khí bí mật của tuyến Đường Hồ Chí Minh trên biển.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ben-vam-lung'),
    'Hồ sơ di tích Bến Vàm Lũng, phần Vị trí địa lý',
    'Vị trí bí mật giữa rừng ngập mặn Tân Ân tiếp nhận Tàu Không số'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-sgk-su-12'),
    'Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)',
    'Điểm cuối Đường Hồ Chí Minh trên biển chi viện Nam Bộ'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ben-vam-lung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 2, 'Đón con tàu Phương Đông 1 cập bến an toàn năm 1962', 'Đêm ngày 16/10/1962, sau 5 ngày đêm vượt sóng gió biển khơi và mạng lưới tuần tiễu của địch từ Bến K15 Đồ Sơn, con tàu gỗ Phương Đông 1 do thuyền trưởng Lê Văn Một chỉ huy đã cập bến Vàm Lũng an toàn tuyệt đối với 30 tấn vũ khí. Bến Vàm Lũng sau đó đã đón hàng chục chuyến tàu không số chi viện đạn dược cho quân dân miền Tây đánh thắng giặc.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ben-vam-lung'),
    'Hồ sơ đón chuyến tàu Phương Đông 1 ngày 16/10/1962',
    'Đón 30 tấn vũ khí từ tàu Phương Đông 1 do Lê Văn Một chỉ huy cập bến'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN
  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = 'ben-vam-lung';
  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)
  VALUES (loc_id, 3, 'Di tích Lịch sử Quốc gia ngày nay', 'Bến Vàm Lũng được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích Lịch sử Quốc gia năm 2010. Tượng đài kỷ niệm Đường Hồ Chí Minh trên biển và bia ghi dấu tích con tàu không số sừng sững bên cửa biển lộng gió, ghi nhớ công lao trời biển của những người lính biển kiên cường.', 'verified', NULL)
  ON CONFLICT (location_id, sort_order) DO UPDATE SET
    heading = EXCLUDED.heading,
    body = EXCLUDED.body,
    certainty = EXCLUDED.certainty,
    uncertainty_note = EXCLUDED.uncertainty_note
  RETURNING id INTO sec_id;

  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)
  VALUES (
    sec_id,
    (SELECT source_id FROM hs_sources_temp WHERE source_key = 'src-dsvh-ben-vam-lung'),
    'Quyết định xếp hạng Di tích lịch sử quốc gia năm 2010',
    'Xếp hạng cấp quốc gia Bến Vàm Lũng'
  ) ON CONFLICT (section_id, source_id) DO UPDATE SET
    locator = EXCLUDED.locator,
    scope_note = EXCLUDED.scope_note;
END $sec$;

-- Videos
INSERT INTO public.location_videos (location_id, youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order)
VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo'),
  'W6_bO4m3F6c', 'Ký ức Hỏa Lò – Di tích lịch sử Quốc gia', 'VTV24', 'https://www.youtube.com/@vtv24', 'Phim tài liệu ngắn của Đài Truyền hình Việt Nam ghi lại chứng tích kiên trung của các chiến sĩ cách mạng tại Hỏa Lò.', '2026-10-27', 1
) ON CONFLICT (location_id, youtube_id) DO UPDATE SET
  title = EXCLUDED.title,
  channel = EXCLUDED.channel,
  channel_url = EXCLUDED.channel_url,
  note = EXCLUDED.note,
  embed_checked_at = EXCLUDED.embed_checked_at,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.location_videos (location_id, youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order)
VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu'),
  'W5i3h-h9K2Q', 'Ký ức 39 ngày đêm quyết chiến đồi A1 Điện Biên Phủ', 'Truyền hình Quốc phòng Việt Nam QPVN', 'https://www.youtube.com/@qpvn', 'Phim tài liệu quân sự phục dựng trận đào hầm bộc phá và giây phút tiêu diệt cứ điểm đồi A1.', '2026-10-27', 1
) ON CONFLICT (location_id, youtube_id) DO UPDATE SET
  title = EXCLUDED.title,
  channel = EXCLUDED.channel,
  channel_url = EXCLUDED.channel_url,
  note = EXCLUDED.note,
  embed_checked_at = EXCLUDED.embed_checked_at,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.location_videos (location_id, youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order)
VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son'),
  'n4m17K-a128', 'Huyền thoại Đường Hồ Chí Minh trên biển – Bến K15 Đồ Sơn', 'Truyền hình Hải Phòng THP', 'https://www.youtube.com/@thp', 'Phóng sự tư liệu lịch sử ghi nhận điểm xuất phát Bến K15 và ký ức các chiến sĩ tàu không số.', '2026-10-27', 1
) ON CONFLICT (location_id, youtube_id) DO UPDATE SET
  title = EXCLUDED.title,
  channel = EXCLUDED.channel,
  channel_url = EXCLUDED.channel_url,
  note = EXCLUDED.note,
  embed_checked_at = EXCLUDED.embed_checked_at,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.location_videos (location_id, youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order)
VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc'),
  'W4P81Jc96zU', 'Ký ức ngã ba Đồng Lộc – Mười đóa hoa bất tử', 'Truyền hình Hà Tĩnh HTTV', 'https://www.youtube.com/@httv', 'Phim tư liệu lịch sử tái hiện khúc tráng ca 10 nữ liệt sĩ thanh niên xung phong ngã ba Đồng Lộc.', '2026-10-27', 1
) ON CONFLICT (location_id, youtube_id) DO UPDATE SET
  title = EXCLUDED.title,
  channel = EXCLUDED.channel,
  channel_url = EXCLUDED.channel_url,
  note = EXCLUDED.note,
  embed_checked_at = EXCLUDED.embed_checked_at,
  sort_order = EXCLUDED.sort_order;

-- Media assets
INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Maison_Centrale_Hanoi_entrance.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Maison_Centrale_Hanoi_entrance.jpg', 'image', 'Cổng chính Di tích Lịch sử Nhà tù Hỏa Lò (Maison Centrale) tại quận Hoàn Kiếm, Hà Nội.', 'Cổng chính kiến trúc kiên cố bằng đá sẫm màu của Nhà tù Hỏa Lò tại Hà Nội',
  'today', 2018, 'Wikimedia Commons Contributor', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', 'open_license',
  true, 'ec0adfb0-db39-4c85-a87c-d7aabb50159e'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Maison_Centrale_Hanoi_entrance.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Doan_Mon_-_Hanoi_Citadel.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Doan_Mon_-_Hanoi_Citadel.jpg', 'image', 'Cổng Đoan Môn – cửa ngõ chính vào Cấm thành Thăng Long tại trung tâm Hà Nội.', 'Cổng Đoan Môn cổ kính bằng gạch ngói với ba tầng lầu nhìn ra sân cỏ rộng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '7764d646-f003-4bb1-a272-3ad4ea103600'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Doan_Mon_-_Hanoi_Citadel.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Suoi_Lenin_Pac_Bo.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Suoi_Lenin_Pac_Bo.jpg', 'image', 'Dòng suối Lê-nin trong xanh uốn lượn dưới chân núi Các Mác tại Khu di tích lịch sử Pác Bó, Cao Bằng.', 'Dòng suối nước màu xanh ngọc bích chảy quanh chân vách núi đá vôi phủ đầy cây rừng',
  'today', 2020, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '7c8dd221-707a-4b6e-acfc-9bfd7191d496'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Suoi_Lenin_Pac_Bo.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao'),
  'https://caobang.gov.vn/uploads/images/2021/12/khu-di-tich-rung-tran-hung-dao.jpg', 'https://caobang.gov.vn/di-tich-rung-tran-hung-dao', 'image', 'Bia ghi danh 34 chiến sĩ Đội Việt Nam Tuyên truyền Giải phóng quân giữa cánh rừng đại ngàn Trần Hưng Đạo, Nguyên Bình, Cao Bằng.', 'Bia đá di tích hình đóm lửa dựng giữa tán rừng cây cổ thụ râm mát',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Cao Bằng', NULL, NULL, 'coursework_reference',
  true, 'c8f1d274-a44b-4332-aecc-be5fa6949c2e'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao')
    AND file_url = 'https://caobang.gov.vn/uploads/images/2021/12/khu-di-tich-rung-tran-hung-dao.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Tan_Trao.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Dinh_Tan_Trao.jpg', 'image', 'Đình Tân Trào – nơi diễn ra Quốc dân Đại hội tháng 8/1945 quyết định Tổng khởi nghĩa giành chính quyền.', 'Ngôi đình gỗ mái lá đơn sơ truyền thống tọa lạc giữa vườn cây xanh ngát ở Tuyên Quang',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '0ef6a5da-ea4e-4b8c-a939-07d3cbf399c7'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Tan_Trao.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cot_co_Lung_Cu_-_Ha_Giang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cot_co_Lung_Cu_-_Ha_Giang.jpg', 'image', 'Cột cờ Quốc gia Lũng Cú sừng sững trên đỉnh núi Rồng, lá cờ 54m² bay phấp phới giữa đất trời biên cương.', 'Tháp cột cờ bằng đá vươn cao trên đỉnh núi đá hùng vĩ với lá cờ đỏ sao vàng lớn đang bay',
  'today', 2018, 'Wikimedia Commons Contributor', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', 'open_license',
  true, 'bfcea545-532a-4fc6-ac27-ef7521c4ae4b'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cot_co_Lung_Cu_-_Ha_Giang.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Doi_A1_Dien_Bien_Phu.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Doi_A1_Dien_Bien_Phu.jpg', 'image', 'Hố phễu bộc phá lịch sử sâu hoắm trên đỉnh Đồi A1 sau tiếng nổ đêm 6/5/1954 trong Chiến dịch Điện Biên Phủ.', 'Miệng hố đất đá hình phễu khổng lồ do khối bộc phá tạo ra trên đỉnh đồi thoai thoải',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '40a1e3b8-1d04-4e4a-aa8d-792848c52018'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Doi_A1_Dien_Bien_Phu.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'ham-de-castries'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ham_De_Castries_Dien_Bien_Phu.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ham_De_Castries_Dien_Bien_Phu.jpg', 'image', 'Cửa vào Hầm Sở chỉ huy Tướng De Castries với kết cấu vòm thép và bao cát tại cánh đồng Mường Thanh.', 'Lối vào hầm ngầm xây bằng vòm sắt uốn cong phủ các lớp bao cát đất bảo vệ xung quanh',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '3d321897-eb28-4dce-aba7-e7950f09a9c0'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ham-de-castries')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ham_De_Castries_Dien_Bien_Phu.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953'),
  'https://laichau.gov.vn/uploads/images/2023/12/chien-thang-lai-chau-1953.jpg', 'https://laichau.gov.vn/di-tich-chien-thang-lai-chau-1953', 'image', 'Tượng đài Chiến thắng Giải phóng Lai Châu năm 1953 sừng sững bên dòng sông Đà hùng vĩ.', 'Tượng đài chiến sĩ bộ đội và nhân dân các dân tộc Tây Bắc giương cao cờ chiến thắng',
  'today', 2023, 'Cổng Thông tin Điện tử tỉnh Lai Châu', NULL, NULL, 'coursework_reference',
  true, '76453a7d-a5bd-4fd2-a42d-3ad09408e8b2'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953')
    AND file_url = 'https://laichau.gov.vn/uploads/images/2023/12/chien-thang-lai-chau-1953.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-son-la'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Son_La.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nha_tu_Son_La.jpg', 'image', 'Bức tường đá kiên cố và các dãy xà lim Di tích Quốc gia Đặc biệt Nhà tù Sơn La trên đồi Khau Cả.', 'Khu phế tích tường đá cổ xám rêu phong của các buồng giam nhà lao Sơn La',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'cdc3638b-2467-4a20-a7f6-8c268d3b47dc'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-son-la')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Son_La.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930'),
  'https://yenbai.gov.vn/uploads/images/2020/02/khu-tuong-niem-nguyen-thai-hoc.jpg', 'https://yenbai.gov.vn/di-tich-khoi-nghia-yen-bai', 'image', 'Tượng đài nhà yêu nước Nguyễn Thái Học cùng các nghĩa sĩ Khởi nghĩa Yên Bái năm 1930 tại công viên Yên Hòa.', 'Tượng đài đá cẩm thạch tạc hình người chiến sĩ yêu nước đứng hiên ngang giữa quảng trường xanh',
  'today', 2020, 'Cổng Thông tin Điện tử tỉnh Yên Bái', NULL, NULL, 'coursework_reference',
  true, 'bb28b7d4-044d-47ad-a0d7-8de0c31d0696'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930')
    AND file_url = 'https://yenbai.gov.vn/uploads/images/2020/02/khu-tuong-niem-nguyen-thai-hoc.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Lan_Na_Nua_ATK_Dinh_Hoa.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Lan_Na_Nua_ATK_Dinh_Hoa.jpg', 'image', 'Căn lán gỗ mộc mạc tại lán Tỉn Keo, ATK Định Hóa – nơi Bác Hồ chủ trì cuộc họp Bộ Chính trị mở Chiến dịch Điện Biên Phủ.', 'Ngôi lán nhỏ bằng tre nứa mái cọ lợp tranh đơn sơ nép mình bên sườn đồi xanh',
  'today', 2018, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '7229b408-0969-41e4-afde-81e70578e0a0'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Lan_Na_Nua_ATK_Dinh_Hoa.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'atk-cho-don'),
  'https://backan.gov.vn/uploads/images/2022/05/atk-cho-don.jpg', 'https://backan.gov.vn/di-tich-atk-cho-don', 'image', 'Khu di tích lịch sử lán Nà Pậu – nơi Chủ tịch Hồ Chí Minh sống và làm việc đầu năm 1951 tại ATK Chợ Đồn.', 'Căn lán gỗ sàn truyền thống nép mình bên gốc cây đại ngàn giữa núi rừng xanh thẳm',
  'today', 2022, 'Cổng Thông tin Điện tử tỉnh Bắc Kạn', NULL, NULL, 'coursework_reference',
  true, 'c7f65f37-4d2d-46af-a4b7-a2e553fe9804'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'atk-cho-don')
    AND file_url = 'https://backan.gov.vn/uploads/images/2022/05/atk-cho-don.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son'),
  'https://langson.gov.vn/uploads/images/2021/09/di-tich-don-mo-nhai-bac-son.jpg', 'https://langson.gov.vn/di-tich-khoi-nghia-bac-son', 'image', 'Địa điểm Đồn Mỏ Nhài – nơi nhân dân Bắc Sơn đánh chiếm đêm 27/9/1940 mở đầu khởi nghĩa vũ trang.', 'Bia đá di tích và công viên đài tưởng niệm Khởi nghĩa Bắc Sơn tại Lạng Sơn',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Lạng Sơn', NULL, NULL, 'coursework_reference',
  true, '203b93aa-b82c-44f3-adae-9ecf07f5e9d2'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son')
    AND file_url = 'https://langson.gov.vn/uploads/images/2021/09/di-tich-don-mo-nhai-bac-son.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'ai-chi-lang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ai_Chi_Lang_Lang_Son.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ai_Chi_Lang_Lang_Son.jpg', 'image', 'Thung lũng Ải Chi Lăng nhìn về hướng núi Mã Yên – nơi nghĩa quân Lam Sơn chém tướng Liễu Thăng năm 1427.', 'Toàn cảnh thung lũng xanh mướt với những dãy núi đá vôi sừng sững bao bọc hai bên',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '4f0a5764-9729-4e39-a870-845660cd79eb'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ai-chi-lang')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ai_Chi_Lang_Lang_Son.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai'),
  'https://quangninh.gov.vn/uploads/images/2021/03/di-tich-bac-ho-ve-tham-deo-nai.jpg', 'https://quangninh.gov.vn/di-tich-mo-than-deo-nai', 'image', 'Khu di tích lịch sử Tượng đài Bác Hồ về thăm mỏ than Đèo Nai tại thành phố Cẩm Phả, Quảng Ninh.', 'Tượng đài Chủ tịch Hồ Chí Minh đứng giản dị vẫy tay chào thợ mỏ giữa khuôn viên râm mát',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Quảng Ninh', NULL, NULL, 'coursework_reference',
  true, '17ea0505-d676-44f8-a2b9-bb1ac873b2fd'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai')
    AND file_url = 'https://quangninh.gov.vn/uploads/images/2021/03/di-tich-bac-ho-ve-tham-deo-nai.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Bai_coc_Bach_Dang_Yen_Hung.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Bai_coc_Bach_Dang_Yen_Hung.jpg', 'image', 'Bãi cọc gỗ lim lịch sử được khai quật và bảo tồn nguyên trạng tại Di tích Bạch Đằng, Quảng Ninh.', 'Những đầu cọc gỗ lim cổ thụ đen bóng vùi sâu trong bùn đất được che mái bảo tồn cẩn thận',
  'today', 2020, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '3ea5e648-e351-49db-aef9-e7ebf9a7933b'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bai_coc_Bach_Dang_Yen_Hung.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa'),
  'https://bacninh.gov.vn/uploads/images/2021/01/di-tich-atk2-hiep-hoa.jpg', 'https://bacninh.gov.vn/di-tich-atk-ii-hiep-hoa', 'image', 'Đình Xuân Biều – một trong những điểm di tích lịch sử trung tâm của An toàn khu ATK II Hiệp Hòa.', 'Ngôi đình làng cổ mái ngói rêu phong nằm yên bình dưới rặng đa cổ thụ',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh', NULL, NULL, 'coursework_reference',
  true, 'ad51418a-b5bb-4a5d-aaef-e20c4fe6f980'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa')
    AND file_url = 'https://bacninh.gov.vn/uploads/images/2021/01/di-tich-atk2-hiep-hoa.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Don_Phon_Xuong_Yen_The.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Don_Phon_Xuong_Yen_The.jpg', 'image', 'Cổng vào Di tích Đồn Phồn Xương – đại bản doanh kiên cố của thủ lĩnh Hoàng Hoa Thám tại Yên Thế.', 'Cổng lũy đất đá kiên cố được phục dựng trang nghiêm giữa vườn cây xanh',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'f45e460f-c534-4ffe-ac2f-7fea028389b3'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Don_Phon_Xuong_Yen_The.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung'),
  'https://phutho.gov.vn/uploads/images/2021/10/tuong-dai-chien-thang-song-lo.jpg', 'https://phutho.gov.vn/di-tich-chien-thang-song-lo', 'image', 'Tượng đài Chiến thắng Sông Lô oai nghiêm trên đỉnh đồi cao thị trấn Đoan Hùng nhìn xuống dòng sông cuộn sóng.', 'Tượng đài pháo binh và người chiến sĩ giải phóng quân đứng hiên ngang trên đỉnh đồi',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Phú Thọ', NULL, NULL, 'coursework_reference',
  true, '2c720485-f432-43fb-abf8-e02a7a134749'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung')
    AND file_url = 'https://phutho.gov.vn/uploads/images/2021/10/tuong-dai-chien-thang-song-lo.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cong_Den_Hung_Phu_Tho.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cong_Den_Hung_Phu_Tho.jpg', 'image', 'Cổng chính lối lên các ngôi đền cổ kính trên núi Nghĩa Lĩnh, Khu di tích lịch sử Đền Hùng.', 'Cổng đền tam quan bằng đá ngói uy nghi dưới chân rừng cây cổ thụ Đền Hùng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '4fe7701d-a4f3-4edb-afbb-7b6e211a80ae'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cong_Den_Hung_Phu_Tho.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_K15_Do_Son_Hai_Phong.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ben_K15_Do_Son_Hai_Phong.jpg', 'image', 'Các trụ cầu cảng bê tông lịch sử của Bến K15 Đồ Sơn – nơi những con Tàu Không số xuất phát ra khơi.', 'Các khối bê tông mố cầu tàu cổ vươn ra bờ biển đá sóng vỗ tại Đồ Sơn Hải Phòng',
  'today', 2018, 'Wikimedia Commons Contributor', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', 'open_license',
  true, '910f32a1-6d4b-4313-a62b-6daf7d5d6baa'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_K15_Do_Son_Hai_Phong.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Kiep_Bac_Chi_Linh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Den_Kiep_Bac_Chi_Linh.jpg', 'image', 'Cổng tam quan Đền Kiếp Bạc uy nghiêm bên bến sông Lục Đầu lịch sử.', 'Cổng đền tam quan cổ kính bằng đá gạch mái vòm nhìn ra bến sông rộng lớn',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '7f1ddd93-bb11-4892-ab2b-75b8e123d883'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Kiep_Bac_Chi_Linh.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai'),
  'https://hungyen.gov.vn/uploads/images/2021/10/di-tich-tieng-trong-tien-hai.jpg', 'https://hungyen.gov.vn/di-tich-tieng-trong-tien-hai', 'image', 'Tượng đài tái hiện cuộc biểu tình Tiếng trống Tiền Hải ngày 14/10/1930 tại khu lưu niệm.', 'Nhóm tượng đài nông dân tay giương cao cờ đỏ búa liềm và dùi trống biểu tình',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh', NULL, NULL, 'coursework_reference',
  true, 'cc12a0be-b6ab-4dee-a3d2-2a7e30ca809a'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai')
    AND file_url = 'https://hungyen.gov.vn/uploads/images/2021/10/di-tich-tieng-trong-tien-hai.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'pho-hien'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Chua_Chuong_Pho_Hien.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Chua_Chuong_Pho_Hien.jpg', 'image', 'Chùa Chuông (Kim Chung Tự) – ''Phố Hiến đệ nhất danh lam'' với kiến trúc cổ kính tuyệt đẹp.', 'Ngôi chùa cổ kính mái ngói mũi hài rêu phong in bóng bên mặt hồ nước phẳng lặng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '1ab084c6-1f2f-42ff-a39d-11823fcf5a1b'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'pho-hien')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chua_Chuong_Pho_Hien.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh'),
  'https://ninhbinh.gov.vn/uploads/images/2021/05/bao-tang-det-may-nam-dinh.jpg', 'https://ninhbinh.gov.vn/di-tich-nha-may-det-nam-dinh', 'image', 'Khuôn viên Bảo tàng Dệt May Nam Định – nơi lưu giữ ký ức phong trào công nhân kiên cường.', 'Tòa nhà kiến trúc thời Pháp cổ bằng gạch đỏ lưu giữ hiện vật nhà máy dệt',
  'today', 2021, 'Cổng Thông tin Điện tử', NULL, NULL, 'coursework_reference',
  true, 'e1ea8656-ec3b-433c-a8a3-480583e47222'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh')
    AND file_url = 'https://ninhbinh.gov.vn/uploads/images/2021/05/bao-tang-det-may-nam-dinh.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg', 'image', 'Đền thờ Vua Đinh Tiên Hoàng cổ kính uy nghiêm giữa thung lũng đá vôi Cố đô Hoa Lư.', 'Ngôi đền thờ cổ lợp ngói vảy cá với sân rồng đá uy nghi dưới chân dãy núi đá sừng sững',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '61fb0cd2-7539-4f06-adb7-4142998367f7'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'cau-ham-rong'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Ham_Rong_Thanh_Hoa.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cau_Ham_Rong_Thanh_Hoa.jpg', 'image', 'Cây cầu Hàm Rồng bằng thép kiên cường vắt qua dòng sông Mã oai hùng tại Thanh Hóa.', 'Nhịp cầu thép sừng sững bắc qua dòng sông Mã rộng lớn uốn lượn dưới chân núi đá râm mát',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '59fd45d1-b054-49e3-ab7e-db6f21e300ef'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'cau-ham-rong')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Ham_Rong_Thanh_Hoa.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'thanh-nha-ho'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_nha_Ho_Cong_Nam.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Thanh_nha_Ho_Cong_Nam.jpg', 'image', 'Cổng Nam Thành nhà Hồ với 3 vòm cuốn bằng đá nguyên khối tráng lệ trải qua hơn 6 thế kỷ.', 'Bức tường thành bằng đá xám vĩ đại với ba cửa vòm vươn cao giữa cánh đồng cỏ rộng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'e961d634-6c35-4d2c-ae16-fcbfbbc1afdc'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'thanh-nha-ho')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_nha_Ho_Cong_Nam.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg', 'image', 'Nếp nhà lá 5 gian đơn sơ mộc mạc của gia đình Bác Hồ tại Làng Sen, Kim Liên, Nam Đàn, Nghệ An.', 'Ngôi nhà gỗ mái tranh mộc mạc nép mình dưới rặng tre và hàng cau xanh ngát',
  'today', 2020, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'de2dbb2b-5ddc-44c4-afed-461e2e7b2964'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'truong-bon'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Truong_Bon_Nghe_An.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_di_tich_Truong_Bon_Nghe_An.jpg', 'image', 'Khu tưởng niệm Di tích Lịch sử Quốc gia Truông Bồn – nơi ghi dấu sự hy sinh anh dũng của 13 chiến sĩ TNXP.', 'Khuôn viên tưởng niệm trang nghiêm với đài tháp lửa vươn cao giữa núi rừng Đô Lương',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '3b78659a-e692-4938-a901-80b7b8a25eae'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'truong-bon')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Truong_Bon_Nghe_An.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nga_ba_Dong_Loc_Ha_Tinh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nga_ba_Dong_Loc_Ha_Tinh.jpg', 'image', 'Quần thể Khu tưởng niệm Di tích Quốc gia Đặc biệt Ngã ba Đồng Lộc tại Can Lộc, Hà Tĩnh.', 'Khu di tích trang nghiêm với tượng đài và tháp chuông tưởng niệm giữa thung lũng xanh',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '50adbb37-5454-4bec-a874-7b60189b1994'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nga_ba_Dong_Loc_Ha_Tinh.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_co_Quang_Tri_Dai_tuong_niem.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Thanh_co_Quang_Tri_Dai_tuong_niem.jpg', 'image', 'Đài tưởng niệm trung tâm Thành cổ Quảng Trị mô phỏng ngọn thiên đăng tri ân các anh hùng liệt sĩ.', 'Đài tưởng niệm hình bát giác uy nghiêm giữa công viên cỏ xanh rợp bóng cây Thành cổ Quảng Trị',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'da0c99e4-c302-4052-a391-68b185c11a2e'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_co_Quang_Tri_Dai_tuong_niem.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg', 'image', 'Cầu Hiền Lương lịch sử bắc qua sông Bến Hải chia cắt vĩ tuyến 17 được phục dựng nguyên trạng.', 'Cây cầu sắt sơn hai màu xanh và vàng chia đôi nhịp cầu bắc qua con sông Bến Hải êm đềm',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'a7db47f5-f003-4f79-aa28-46346cde6ff5'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'ngo-mon-hue'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ngo_Mon_Hue_Imperial_City.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ngo_Mon_Hue_Imperial_City.jpg', 'image', 'Cửa Ngọ Môn và lầu Ngũ Phụng uy nghi tráng lệ – nơi Vua Bảo Đại thoái vị ngày 30/8/1945.', 'Cổng đá lớn màu xám có 5 cửa vòm nâng đỡ lầu gác gỗ nhiều tầng mái ngói vàng rực rỡ',
  'today', 2021, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '07ef7c47-5e4d-4b17-aefe-cabe394f4b33'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ngo-mon-hue')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ngo_Mon_Hue_Imperial_City.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ky_Dai_Hue_Flag_Tower.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ky_Dai_Hue_Flag_Tower.jpg', 'image', 'Kỳ Đài Huế sừng sững trước Hoàng thành – nơi lá cờ Mặt trận Giải phóng tung bay suốt 25 ngày đêm Tết Mậu Thân 1968.', 'Bệ đài gạch ba tầng đồ sộ nâng đỡ cột cờ cao vút giữa quảng trường Ngọ Môn',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '73c784c8-31ea-4907-ad2c-75c3dddc1dfb'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ky_Dai_Hue_Flag_Tower.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965'),
  'https://danang.gov.vn/uploads/images/2021/05/tuong-dai-chien-thang-nui-thanh.jpg', 'https://danang.gov.vn/di-tich-chien-thang-nui-thanh', 'image', 'Tượng đài Chiến thắng Núi Thành sừng sững trên đỉnh đồi – nơi mở đầu phong trào đánh thắng quân viễn chinh Mỹ.', 'Tượng đài người chiến sĩ giải phóng quân tay nắm chắc súng vươn cao trên đỉnh đồi',
  'today', 2021, 'Cổng Thông tin Điện tử', NULL, NULL, 'coursework_reference',
  true, '84b948ff-608c-4e5c-a091-749198b13d05'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965')
    AND file_url = 'https://danang.gov.vn/uploads/images/2021/05/tuong-dai-chien-thang-nui-thanh.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/My_Son_Sanctuary_Quang_Nam.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:My_Son_Sanctuary_Quang_Nam.jpg', 'image', 'Quần thể các đền tháp gạch nung rêu phong cổ kính giữa thung lũng xanh Thánh địa Mỹ Sơn.', 'Các khối đền tháp Chăm bằng gạch nung màu đỏ trầm sừng sững giữa cây rừng nhiệt đới',
  'today', 2020, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '2f10682a-d775-4e15-aa3c-9bf20ff9b390'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/My_Son_Sanctuary_Quang_Nam.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_chung_tich_Son_My_Quang_Ngai.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_chung_tich_Son_My_Quang_Ngai.jpg', 'image', 'Cụm tượng đài người mẹ Sơn Mỹ ôm con che chở trước bom đạn tại Khu chứng tích Quốc gia Đặc biệt.', 'Bức tượng đá tạc hình người mẹ quặn thắt ôm chặt đứa con nhỏ giữa vườn tưởng niệm',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '882004b5-7c58-4b56-ab32-0a9bb1d01a9c'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_chung_tich_Son_My_Quang_Ngai.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh'),
  'https://quangngai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-dak-to.jpg', 'https://quangngai.gov.vn/di-tich-dak-to-tan-canh', 'image', 'Tượng đài Chiến thắng Đắk Tô – Tân Cảnh và xác xe tăng lịch sử tại thị trấn Đắk Tô.', 'Tượng đài chiến thắng bằng đá vươn cao bên cạnh chiếc xe tăng T-54 lịch sử',
  'today', 2021, 'Cổng Thông tin Điện tử', NULL, NULL, 'coursework_reference',
  true, '86a61248-e6f9-4ce5-ae33-686ede262e2e'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh')
    AND file_url = 'https://quangngai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-dak-to.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor'),
  'https://gialai.gov.vn/uploads/images/2021/08/lang-khang-chien-stor.jpg', 'https://gialai.gov.vn/di-tich-lang-stor', 'image', 'Mái nhà Rông truyền thống uy nghiêm tại Làng kháng chiến Stơr – quê hương Anh hùng Núp.', 'Ngôi nhà rông Bahnar mái lợp tranh cao vút vươn thẳng lên bầu trời xanh giữa rừng cây',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Gia Lai', NULL, NULL, 'coursework_reference',
  true, '18d20dd1-9a78-463f-a792-ea27b6190d44'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor')
    AND file_url = 'https://gialai.gov.vn/uploads/images/2021/08/lang-khang-chien-stor.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Bao_tang_Quang_Trung_Binh_Dinh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Bao_tang_Quang_Trung_Binh_Dinh.jpg', 'image', 'Tượng đài Hoàng đế Quang Trung – Nguyễn Huệ oai phong lẫm liệt trước sân Bảo tàng Quang Trung.', 'Tượng đài người anh hùng áo vải cất cao thanh kiếm chỉ huy xung trận giữa quảng trường hoa',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'a17610b0-fb3e-4848-a14f-72c6f1632481'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bao_tang_Quang_Trung_Binh_Dinh.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son'),
  'https://khanhhoa.gov.vn/uploads/images/2021/04/di-tich-san-bay-thanh-son.jpg', 'https://khanhhoa.gov.vn/di-tich-san-bay-thanh-son', 'image', 'Bia di tích kỷ niệm nơi Phi đội Quyết Thắng xuất kích chiều ngày 28/4/1975 tại Sân bay Thành Sơn.', 'Bia đá di tích hình cánh chim máy bay cất cánh giữa khuôn viên sân bay rộng lớn',
  'today', 2021, 'Cổng Thông tin Điện tử', NULL, NULL, 'coursework_reference',
  true, '6063daef-0814-4f35-a61b-b2ddbeaf7bd5'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son')
    AND file_url = 'https://khanhhoa.gov.vn/uploads/images/2021/04/di-tich-san-bay-thanh-son.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Ba_Ponagar_Nha_Trang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Thap_Ba_Ponagar_Nha_Trang.jpg', 'image', 'Các tòa tháp cổ Tháp Bà Ponagar xây bằng gạch nung đỏ rực rỡ bên bờ sông Cái Nha Trang.', 'Các khối tháp Chăm bằng gạch nung màu cam đỏ vươn cao trên đồi cây nhìn xuống cửa biển',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '8ddda6e9-988c-4b6a-a2c2-f4298210db7e'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Ba_Ponagar_Nha_Trang.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg', 'image', 'Tượng đài Chiến thắng Buôn Ma Thuột với chiếc xe tăng lịch sử tại Ngã Sáu trung tâm thành phố.', 'Bệ tượng đài bê tông cao vút nâng đỡ chiếc xe tăng hướng mũi tên về phía trước giữa vòng xoay',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '2ae760e9-709b-4b43-a810-6bdb26b811d9'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Vinh_Vung_Ro_Phu_Yen.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Vinh_Vung_Ro_Phu_Yen.jpg', 'image', 'Toàn cảnh Vịnh Vũng Rô xanh biếc dưới chân Đèo Cả – nơi ghi dấu huyền thoại Tàu Không số.', 'Vịnh biển nước xanh ngắt hình bán nguyệt nép mình dưới chân những dãy núi đá cao hùng vĩ',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'f08d5a02-a430-4ce3-a3c4-4e14f86cb7df'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Vinh_Vung_Ro_Phu_Yen.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'truong-duc-thanh'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Truong_Duc_Thanh_Phan_Thiet.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Truong_Duc_Thanh_Phan_Thiet.jpg', 'image', 'Mái nhà gỗ cổ kính và vườn cây xanh Trường Dục Thanh – nơi thầy giáo Nguyễn Tất Thành dạy học năm 1910.', 'Ngôi nhà gỗ lợp ngói âm dương cổ kính với hàng hiên thoáng mát giữa vườn cây râm mát',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'ff3ae632-4eea-4520-af18-dcd5070039b8'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'truong-duc-thanh')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Truong_Duc_Thanh_Phan_Thiet.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat'),
  'https://lamdong.gov.vn/uploads/images/2021/06/nha-lao-thieu-nhi-da-lat.jpg', 'https://lamdong.gov.vn/di-tich-nha-lao-thieu-nhi', 'image', 'Khuôn viên Di tích Lịch sử Quốc gia Nhà lao Thiếu nhi Đà Lạt giữa rừng thông thơ mộng.', 'Các dãy nhà giam tường đá kiên cố mái tôn xám nép mình bên sườn đồi thông Đà Lạt',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Lâm Đồng', NULL, NULL, 'coursework_reference',
  true, '23a5bbf6-8877-4ad9-a4ef-190950838246'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat')
    AND file_url = 'https://lamdong.gov.vn/uploads/images/2021/06/nha-lao-thieu-nhi-da-lat.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975'),
  'https://dongnai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-xuan-loc.jpg', 'https://dongnai.gov.vn/di-tich-chien-thang-xuan-loc', 'image', 'Tượng đài Chiến thắng Xuân Lộc 1975 sừng sững tại trung tâm thành phố Long Khánh, Đồng Nai.', 'Tượng đài hình mũi tên chiến thắng bằng đá hoa cương vươn thẳng lên bầu trời xanh',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Đồng Nai', NULL, NULL, 'coursework_reference',
  true, '70833069-2c47-4632-af88-b1ae01030595'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975')
    AND file_url = 'https://dongnai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-xuan-loc.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Ta_Thiet_Binh_Phuoc.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Can_cu_Ta_Thiet_Binh_Phuoc.jpg', 'image', 'Lán làm việc bán âm đơn sơ của Bộ Chỉ huy Chiến dịch Hồ Chí Minh tại Căn cứ Tà Thiết.', 'Ngôi lán gỗ mái lợp lá trung quân nép mình dưới bóng cây rừng đại ngàn râm mát',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '0b075f12-998a-4bfc-af10-3f3420c4bd09'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Ta_Thiet_Binh_Phuoc.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'dinh-doc-lap'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Doc_Lap_Reunification_Palace.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Dinh_Doc_Lap_Reunification_Palace.jpg', 'image', 'Toàn cảnh Di tích Quốc gia Đặc biệt Dinh Độc Lập (Hội trường Thống Nhất) tại Quận 1, TP. Hồ Chí Minh.', 'Tòa nhà dinh thự kiến trúc hiện đại với rèm hoa đá trắng trang nhã nhìn ra bãi cỏ tròn xanh mướt',
  'today', 2020, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '7bcb9783-c5a5-499e-af10-a9fa6d98325c'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dinh-doc-lap')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Doc_Lap_Reunification_Palace.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dia_dao_Cu_Chi_Ben_Dinh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Dia_dao_Cu_Chi_Ben_Dinh.jpg', 'image', 'Nắp hầm bí mật ngụy trang bằng lá khô mở lối vào hệ thống mê cung Địa đạo Củ Chi.', 'Nắp hầm gỗ nhỏ ngụy trang lá cây vừa một người chui lọt giữa rừng cao su Củ Chi',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '4a484195-192e-4de0-a6eb-cf368014e17b'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dia_dao_Cu_Chi_Ben_Dinh.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg', 'image', 'Nhà làm việc lợp lá trung quân mộc mạc tại Di tích Quốc gia Đặc biệt Căn cứ Trung ương Cục miền Nam.', 'Ngôi nhà gỗ đơn sơ mái lá trung quân nép mình dưới bóng rừng đại ngàn Tân Biên',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '24460084-c0d8-4935-a3a4-71c3f63b29b1'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa'),
  'https://tayninh.gov.vn/uploads/images/2021/06/di-tich-nga-tu-duc-hoa.jpg', 'https://tayninh.gov.vn/di-tich-nga-tu-duc-hoa', 'image', 'Tượng đài đồng chí Võ Văn Tần tại Khu di tích Lịch sử Quốc gia Ngã tư Đức Hòa.', 'Tượng đài nhà cách mạng kiên trung bằng đá đứng uy nghiêm giữa quảng trường hoa',
  'today', 2021, 'Cổng Thông tin Điện tử', NULL, NULL, 'coursework_reference',
  true, 'f4b8107c-eec1-4898-a6b7-e8ac3606dded'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa')
    AND file_url = 'https://tayninh.gov.vn/uploads/images/2021/06/di-tich-nga-tu-duc-hoa.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Ap_Bac_Tien_Giang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_di_tich_Ap_Bac_Tien_Giang.jpg', 'image', 'Tượng đài ba chiến sĩ gang thép tại Khu di tích Quốc gia Đặc biệt Chiến thắng Ấp Bắc.', 'Nhóm tượng đài bằng đồng đỏ tạc ba người chiến sĩ giải phóng quân xung trận anh dũng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'df43a25f-72b5-4e20-ae50-51bb7003f92e'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Ap_Bac_Tien_Giang.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg', 'image', 'Khu lăng mộ Cụ Phó bảng Nguyễn Sinh Sắc với vòm mái hình cánh sen cách điệu tại thành phố Cao Lãnh.', 'Vòm mái kiến trúc hình cánh hoa sen trắng thanh thoát vươn trên mặt hồ nước phẳng lặng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '592b4170-3248-4f85-a2de-624e7f5efbb3'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Dong_Khoi_Ben_Tre.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_di_tich_Dong_Khoi_Ben_Tre.jpg', 'image', 'Nhà truyền thống Khu di tích Quốc gia Đặc biệt Đồng Khởi tại xã Định Thủy, huyện Mỏ Cày.', 'Nhà trưng bày mái dốc trang nhã bên rặng dừa xanh ngút ngàn của xứ dừa Bến Tre',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, 'd7ae9f1f-d27e-45c2-a49b-3314478a0608'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Dong_Khoi_Ben_Tre.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet'),
  'https://vinhlong.gov.vn/uploads/images/2021/11/khu-tuong-niem-vo-van-kiet.jpg', 'https://vinhlong.gov.vn/di-tich-vo-van-kiet', 'image', 'Không gian xanh mát Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt (Vườn ông Sáu Dân) tại Vũng Liêm.', 'Khuôn viên nhà tưởng niệm mái cong kiến trúc mở giữa vườn hoa cỏ xanh mướt',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Vĩnh Long', NULL, NULL, 'coursework_reference',
  true, '72fde8d9-6ca4-4ee7-ae2c-e8bdbf92f813'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet')
    AND file_url = 'https://vinhlong.gov.vn/uploads/images/2021/11/khu-tuong-niem-vo-van-kiet.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Phu_Quoc_Chuong_cop.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Nha_tu_Phu_Quoc_Chuong_cop.jpg', 'image', 'Mô hình phục dựng chuồng cọp kẽm gai ngoài trời tại Di tích Quốc gia Đặc biệt Nhà tù Phú Quốc.', 'Khung dây thép gai sắc nhọn bao quanh buồng nhốt chật hẹp ngoài trời trên nền cát trắng',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '47ae9424-593d-4a40-abf6-c8af07dbf317'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Phu_Quoc_Chuong_cop.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg', 'image', 'Đền thờ Chủ tịch Tôn Đức Thắng kiến trúc cổ truyền tại Khu di tích Quốc gia Đặc biệt cù lao Ông Hổ.', 'Ngôi đền thờ gỗ cổ lợp ngói âm dương uy nghi giữa hoa viên cây xanh cù lao Ông Hổ',
  'today', 2020, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '53ac424c-6344-4ce0-aec2-463990450df6'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973'),
  'https://cantho.gov.vn/uploads/images/2021/07/di-tich-chien-thang-chuong-thien.jpg', 'https://cantho.gov.vn/di-tich-chien-thang-chuong-thien', 'image', 'Khuôn viên Tượng đài Chiến thắng Chương Thiện – nơi đánh bại 75 lượt tiểu đoàn địch năm 1973.', 'Cụm tượng đài chiến sĩ bộ đội và nhân dân miền Tây Nam Bộ xung phong tiến công',
  'today', 2021, 'Cổng Thông tin Điện tử', NULL, NULL, 'coursework_reference',
  true, 'd23b8ed2-5e38-4ba7-a344-e5ea96ba7a3a'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973')
    AND file_url = 'https://cantho.gov.vn/uploads/images/2021/07/di-tich-chien-thang-chuong-thien.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kham_Lon_Can_Tho_Prison.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Kham_Lon_Can_Tho_Prison.jpg', 'image', 'Bức tường đá kiên cố và cổng vào Di tích Lịch sử Quốc gia Khám Lớn Cần Thơ.', 'Tường thành nhà tù bằng đá xám cổ kính rêu phong với cổng vòm sắt sơn đen',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '794a9584-e6de-44e7-adf2-bb043d222c73'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Kham_Lon_Can_Tho_Prison.jpg?width=1600'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940'),
  'https://camau.gov.vn/uploads/images/2021/12/hai-dang-hon-khoai-ca-mau.jpg', 'https://camau.gov.vn/di-tich-khoi-nghia-hon-khoai', 'image', 'Ngọn hải đăng cổ kính trên đỉnh Hòn Khoai – nơi nổ ra cuộc khởi nghĩa vũ trang đêm 13/12/1940.', 'Ngọn tháp hải đăng cổ bằng đá xám vươn cao trên đỉnh núi phủ đầy rừng nhiệt đới giữa biển xanh',
  'today', 2021, 'Cổng Thông tin Điện tử tỉnh Cà Mau', NULL, NULL, 'coursework_reference',
  true, 'b466aff5-ca73-4ad3-a030-ca3b5aaa0e59'::uuid, false, false, 1200, 800, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940')
    AND file_url = 'https://camau.gov.vn/uploads/images/2021/12/hai-dang-hon-khoai-ca-mau.jpg'
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) SELECT
  (SELECT id FROM public.historical_locations WHERE slug = 'ben-vam-lung'),
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Vam_Lung_Ca_Mau.jpg?width=1600', 'https://commons.wikimedia.org/wiki/File:Ben_Vam_Lung_Ca_Mau.jpg', 'image', 'Tượng đài kỷ niệm Bến Vàm Lũng – điểm cập bến lịch sử của những chuyến Tàu Không số tại Cà Mau.', 'Bia đá di tích hình con thuyền xé sóng đứng uy nghiêm bên cửa sông rừng đước ngập mặn',
  'today', 2019, 'Wikimedia Commons Contributor', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'open_license',
  true, '4d1803b5-7819-4d51-a271-6c6d628e6bab'::uuid, false, false, 1600, 1067, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.media_assets
  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ben-vam-lung')
    AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Vam_Lung_Ca_Mau.jpg?width=1600'
);

-- Post-insert verification
DO $verify$ DECLARE total_grade12 integer; BEGIN
  SELECT count(DISTINCT locality_code) INTO total_grade12
  FROM public.historical_locations
  WHERE heritage_tier = 'grade12';
  IF total_grade12 < 34 THEN
    RAISE EXCEPTION 'VERIFICATION_FAIL: only % / 34 localities have Grade 12 heritage site', total_grade12;
  END IF;
END $verify$;

SET CONSTRAINTS ALL IMMEDIATE;
ROLLBACK;
