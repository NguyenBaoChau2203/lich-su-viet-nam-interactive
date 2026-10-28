-- Heritage Sites release (HS-1.0) — Rollback script
-- Removes content added by this release; preserves enrolled locations and original fields.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';
SET LOCAL TIME ZONE 'UTC';
SET standard_conforming_strings = on;
SELECT pg_advisory_xact_lock(18012, 3402);
SET CONSTRAINTS ALL DEFERRED;

DELETE FROM public.media_assets
WHERE location_id IN (
  SELECT id FROM public.historical_locations WHERE slug IN ('nha-tu-hoa-lo', 'hoang-thanh-thang-long', 'rung-tran-hung-dao', 'khu-di-tich-tan-trao', 'cot-co-lung-cu', 'doi-a1-dien-bien-phu', 'ham-de-castries', 'chien-thang-lai-chau-1953', 'nha-tu-son-la', 'khoi-nghia-yen-bai-1930', 'atk-dinh-hoa', 'atk-cho-don', 'khoi-nghia-bac-son', 'ai-chi-lang', 'mo-than-deo-nai', 'bai-coc-bach-dang', 'atk-ii-hiep-hoa', 'khoi-nghia-yen-the', 'chien-thang-song-lo-doan-hung', 'khu-di-tich-den-hung', 'ben-k15-do-son', 'con-son-kiep-bac', 'tieng-trong-tien-hai', 'pho-hien', 'nha-may-det-nam-dinh', 'co-do-hoa-lu', 'cau-ham-rong', 'thanh-nha-ho', 'khu-di-tich-kim-lien', 'truong-bon', 'nga-ba-dong-loc', 'thanh-co-quang-tri', 'doi-bo-hien-luong-ben-hai', 'ngo-mon-hue', 'kinh-thanh-hue-1968', 'chien-thang-nui-thanh-1965', 'khu-den-thap-my-son', 'khu-chung-tich-son-my', 'dak-to-tan-canh', 'lang-khang-chien-stor', 'bao-tang-quang-trung', 'san-bay-thanh-son', 'thap-ba-ponagar', 'buon-ma-thuot-1975', 'vung-ro-phu-yen', 'truong-duc-thanh', 'nha-lao-thieu-nhi-da-lat', 'chien-thang-xuan-loc-1975', 'can-cu-ta-thiet', 'dia-dao-cu-chi', 'can-cu-trung-uong-cuc-mien-nam', 'nga-tu-duc-hoa', 'chien-thang-ap-bac-1963', 'mo-cu-pho-bang-nguyen-sinh-sac', 'dong-khoi-ben-tre-1960', 'khu-tuong-niem-vo-van-kiet', 'nha-tu-phu-quoc', 'khu-luu-niem-ton-duc-thang', 'chien-thang-chuong-thien-1973', 'kham-lon-can-tho', 'khoi-nghia-hon-khoai-1940', 'ben-vam-lung')
)
  OR file_url IN ('storage:locations/heritage/pac-bo-cao-bang/suoi-lenin-nui-cac-mac-1200.webp', 'storage:locations/heritage/dinh-doc-lap/mat-tien-dinh-doc-lap-1200.webp')
;

DELETE FROM public.location_videos
WHERE location_id IN (
  SELECT id FROM public.historical_locations WHERE slug IN ('nha-tu-hoa-lo', 'hoang-thanh-thang-long', 'pac-bo-cao-bang', 'rung-tran-hung-dao', 'khu-di-tich-tan-trao', 'cot-co-lung-cu', 'doi-a1-dien-bien-phu', 'ham-de-castries', 'chien-thang-lai-chau-1953', 'nha-tu-son-la', 'khoi-nghia-yen-bai-1930', 'atk-dinh-hoa', 'atk-cho-don', 'khoi-nghia-bac-son', 'ai-chi-lang', 'mo-than-deo-nai', 'bai-coc-bach-dang', 'atk-ii-hiep-hoa', 'khoi-nghia-yen-the', 'chien-thang-song-lo-doan-hung', 'khu-di-tich-den-hung', 'ben-k15-do-son', 'con-son-kiep-bac', 'tieng-trong-tien-hai', 'pho-hien', 'nha-may-det-nam-dinh', 'co-do-hoa-lu', 'cau-ham-rong', 'thanh-nha-ho', 'khu-di-tich-kim-lien', 'truong-bon', 'nga-ba-dong-loc', 'thanh-co-quang-tri', 'doi-bo-hien-luong-ben-hai', 'ngo-mon-hue', 'kinh-thanh-hue-1968', 'chien-thang-nui-thanh-1965', 'khu-den-thap-my-son', 'khu-chung-tich-son-my', 'dak-to-tan-canh', 'lang-khang-chien-stor', 'bao-tang-quang-trung', 'san-bay-thanh-son', 'thap-ba-ponagar', 'buon-ma-thuot-1975', 'vung-ro-phu-yen', 'truong-duc-thanh', 'nha-lao-thieu-nhi-da-lat', 'chien-thang-xuan-loc-1975', 'can-cu-ta-thiet', 'dinh-doc-lap', 'dia-dao-cu-chi', 'can-cu-trung-uong-cuc-mien-nam', 'nga-tu-duc-hoa', 'chien-thang-ap-bac-1963', 'mo-cu-pho-bang-nguyen-sinh-sac', 'dong-khoi-ben-tre-1960', 'khu-tuong-niem-vo-van-kiet', 'nha-tu-phu-quoc', 'khu-luu-niem-ton-duc-thang', 'chien-thang-chuong-thien-1973', 'kham-lon-can-tho', 'khoi-nghia-hon-khoai-1940', 'ben-vam-lung')
);

DELETE FROM public.location_story_sections
WHERE location_id IN (
  SELECT id FROM public.historical_locations WHERE slug IN ('nha-tu-hoa-lo', 'hoang-thanh-thang-long', 'pac-bo-cao-bang', 'rung-tran-hung-dao', 'khu-di-tich-tan-trao', 'cot-co-lung-cu', 'doi-a1-dien-bien-phu', 'ham-de-castries', 'chien-thang-lai-chau-1953', 'nha-tu-son-la', 'khoi-nghia-yen-bai-1930', 'atk-dinh-hoa', 'atk-cho-don', 'khoi-nghia-bac-son', 'ai-chi-lang', 'mo-than-deo-nai', 'bai-coc-bach-dang', 'atk-ii-hiep-hoa', 'khoi-nghia-yen-the', 'chien-thang-song-lo-doan-hung', 'khu-di-tich-den-hung', 'ben-k15-do-son', 'con-son-kiep-bac', 'tieng-trong-tien-hai', 'pho-hien', 'nha-may-det-nam-dinh', 'co-do-hoa-lu', 'cau-ham-rong', 'thanh-nha-ho', 'khu-di-tich-kim-lien', 'truong-bon', 'nga-ba-dong-loc', 'thanh-co-quang-tri', 'doi-bo-hien-luong-ben-hai', 'ngo-mon-hue', 'kinh-thanh-hue-1968', 'chien-thang-nui-thanh-1965', 'khu-den-thap-my-son', 'khu-chung-tich-son-my', 'dak-to-tan-canh', 'lang-khang-chien-stor', 'bao-tang-quang-trung', 'san-bay-thanh-son', 'thap-ba-ponagar', 'buon-ma-thuot-1975', 'vung-ro-phu-yen', 'truong-duc-thanh', 'nha-lao-thieu-nhi-da-lat', 'chien-thang-xuan-loc-1975', 'can-cu-ta-thiet', 'dinh-doc-lap', 'dia-dao-cu-chi', 'can-cu-trung-uong-cuc-mien-nam', 'nga-tu-duc-hoa', 'chien-thang-ap-bac-1963', 'mo-cu-pho-bang-nguyen-sinh-sac', 'dong-khoi-ben-tre-1960', 'khu-tuong-niem-vo-van-kiet', 'nha-tu-phu-quoc', 'khu-luu-niem-ton-duc-thang', 'chien-thang-chuong-thien-1973', 'kham-lon-can-tho', 'khoi-nghia-hon-khoai-1940', 'ben-vam-lung')
);

UPDATE public.historical_locations SET
  locality_code = NULL,
  heritage_tier = NULL,
  heritage_rank = NULL,
  heritage_period = NULL,
  heritage_teaser = NULL,
  lesson_slug = NULL
WHERE slug IN ('pac-bo-cao-bang', 'dinh-doc-lap');

DELETE FROM public.historical_locations
WHERE slug IN ('nha-tu-hoa-lo', 'hoang-thanh-thang-long', 'rung-tran-hung-dao', 'khu-di-tich-tan-trao', 'cot-co-lung-cu', 'doi-a1-dien-bien-phu', 'ham-de-castries', 'chien-thang-lai-chau-1953', 'nha-tu-son-la', 'khoi-nghia-yen-bai-1930', 'atk-dinh-hoa', 'atk-cho-don', 'khoi-nghia-bac-son', 'ai-chi-lang', 'mo-than-deo-nai', 'bai-coc-bach-dang', 'atk-ii-hiep-hoa', 'khoi-nghia-yen-the', 'chien-thang-song-lo-doan-hung', 'khu-di-tich-den-hung', 'ben-k15-do-son', 'con-son-kiep-bac', 'tieng-trong-tien-hai', 'pho-hien', 'nha-may-det-nam-dinh', 'co-do-hoa-lu', 'cau-ham-rong', 'thanh-nha-ho', 'khu-di-tich-kim-lien', 'truong-bon', 'nga-ba-dong-loc', 'thanh-co-quang-tri', 'doi-bo-hien-luong-ben-hai', 'ngo-mon-hue', 'kinh-thanh-hue-1968', 'chien-thang-nui-thanh-1965', 'khu-den-thap-my-son', 'khu-chung-tich-son-my', 'dak-to-tan-canh', 'lang-khang-chien-stor', 'bao-tang-quang-trung', 'san-bay-thanh-son', 'thap-ba-ponagar', 'buon-ma-thuot-1975', 'vung-ro-phu-yen', 'truong-duc-thanh', 'nha-lao-thieu-nhi-da-lat', 'chien-thang-xuan-loc-1975', 'can-cu-ta-thiet', 'dia-dao-cu-chi', 'can-cu-trung-uong-cuc-mien-nam', 'nga-tu-duc-hoa', 'chien-thang-ap-bac-1963', 'mo-cu-pho-bang-nguyen-sinh-sac', 'dong-khoi-ben-tre-1960', 'khu-tuong-niem-vo-van-kiet', 'nha-tu-phu-quoc', 'khu-luu-niem-ton-duc-thang', 'chien-thang-chuong-thien-1973', 'kham-lon-can-tho', 'khoi-nghia-hon-khoai-1940', 'ben-vam-lung');

SET CONSTRAINTS ALL IMMEDIATE;
COMMIT;
