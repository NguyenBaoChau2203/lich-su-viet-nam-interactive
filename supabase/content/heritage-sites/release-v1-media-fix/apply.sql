-- Heritage Sites Media Corrective Release (release-v1-media-fix)
-- Mode: publish (ROLLBACK)
-- Generated: 2026-10-28T17:14:50.998Z
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';
SET LOCAL TIME ZONE 'UTC';
SET standard_conforming_strings = on;
SELECT pg_advisory_xact_lock(18012, 3402);
SET CONSTRAINTS ALL DEFERRED;

-- 1. Preflight Assertions: Verify locations and assert un-drifted state against before.json
DO $assert$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nha-tu-hoa-lo';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'hoang-thanh-thang-long';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'pac-bo-cao-bang';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'rung-tran-hung-dao';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-di-tich-tan-trao';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'cot-co-lung-cu') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'cot-co-lung-cu';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'doi-a1-dien-bien-phu';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'ham-de-castries') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'ham-de-castries';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'chien-thang-lai-chau-1953';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nha-tu-son-la') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nha-tu-son-la';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khoi-nghia-yen-bai-1930';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'atk-dinh-hoa') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'atk-dinh-hoa';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'atk-cho-don') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'atk-cho-don';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khoi-nghia-bac-son';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'ai-chi-lang') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'ai-chi-lang';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'mo-than-deo-nai') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'mo-than-deo-nai';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'bai-coc-bach-dang';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'atk-ii-hiep-hoa';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khoi-nghia-yen-the';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'chien-thang-song-lo-doan-hung';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-di-tich-den-hung';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'ben-k15-do-son') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'ben-k15-do-son';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'con-son-kiep-bac') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'con-son-kiep-bac';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'tieng-trong-tien-hai';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'pho-hien') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'pho-hien';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nha-may-det-nam-dinh';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'co-do-hoa-lu') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'co-do-hoa-lu';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'cau-ham-rong') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'cau-ham-rong';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'thanh-nha-ho') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'thanh-nha-ho';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-di-tich-kim-lien';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'truong-bon') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'truong-bon';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nga-ba-dong-loc';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'thanh-co-quang-tri';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'doi-bo-hien-luong-ben-hai';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'ngo-mon-hue') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'ngo-mon-hue';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'kinh-thanh-hue-1968';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'chien-thang-nui-thanh-1965';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-den-thap-my-son';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-chung-tich-son-my';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'dak-to-tan-canh') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'dak-to-tan-canh';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'lang-khang-chien-stor';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'bao-tang-quang-trung';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'san-bay-thanh-son') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'san-bay-thanh-son';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'thap-ba-ponagar') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'thap-ba-ponagar';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'buon-ma-thuot-1975';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'vung-ro-phu-yen';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'truong-duc-thanh') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'truong-duc-thanh';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nha-lao-thieu-nhi-da-lat';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'chien-thang-xuan-loc-1975';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'can-cu-ta-thiet';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'dinh-doc-lap') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'dinh-doc-lap';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'dia-dao-cu-chi';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'can-cu-trung-uong-cuc-mien-nam';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nga-tu-duc-hoa';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'chien-thang-ap-bac-1963';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'mo-cu-pho-bang-nguyen-sinh-sac';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'dong-khoi-ben-tre-1960';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-tuong-niem-vo-van-kiet';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'nha-tu-phu-quoc';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khu-luu-niem-ton-duc-thang';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'chien-thang-chuong-thien-1973';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'kham-lon-can-tho') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'kham-lon-can-tho';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'khoi-nghia-hon-khoai-1940';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = 'ben-vam-lung') THEN
    RAISE EXCEPTION 'heritage location missing: %', 'ben-vam-lung';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '788efc9c-c9b1-4c76-ad18-51740f1f0f79' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Doan_Mon_-_Hanoi_Citadel.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'hoang-thanh-thang-long', '788efc9c-c9b1-4c76-ad18-51740f1f0f79';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '9f86bd65-6097-457c-bab9-22c464ac3b66' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_nha_Ho_Cong_Nam.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'thanh-nha-ho', '9f86bd65-6097-457c-bab9-22c464ac3b66';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'b8cc55c9-18ce-4cb3-9257-22f88c16afdb' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Maison_Centrale_Hanoi_entrance.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nha-tu-hoa-lo', 'b8cc55c9-18ce-4cb3-9257-22f88c16afdb';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '383b7e6c-378b-4742-b993-8e19fd4aa9d2' AND file_url = 'https://caobang.gov.vn/uploads/images/2021/12/khu-di-tich-rung-tran-hung-dao.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'rung-tran-hung-dao', '383b7e6c-378b-4742-b993-8e19fd4aa9d2';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'f608e946-2407-4196-8b56-1fbbba38f0d0' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Tan_Trao.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-di-tich-tan-trao', 'f608e946-2407-4196-8b56-1fbbba38f0d0';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '284b2009-d6f6-44c8-bb69-20627fbc272c' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cot_co_Lung_Cu_-_Ha_Giang.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'cot-co-lung-cu', '284b2009-d6f6-44c8-bb69-20627fbc272c';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '4a3d854b-b792-42ab-a8ed-9dfda2692be3' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/My_Son_Sanctuary_Quang_Nam.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-den-thap-my-son', '4a3d854b-b792-42ab-a8ed-9dfda2692be3';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '74cfeed9-0c1b-45e2-8201-207b16a5ff79' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Doi_A1_Dien_Bien_Phu.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'doi-a1-dien-bien-phu', '74cfeed9-0c1b-45e2-8201-207b16a5ff79';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '62cc1be4-8776-43b5-aa7b-bf0d1f64a8e2' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ham_De_Castries_Dien_Bien_Phu.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'ham-de-castries', '62cc1be4-8776-43b5-aa7b-bf0d1f64a8e2';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '7bd20f07-9c22-4e10-87f5-e0709fa42656' AND file_url = 'https://laichau.gov.vn/uploads/images/2023/12/chien-thang-lai-chau-1953.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'chien-thang-lai-chau-1953', '7bd20f07-9c22-4e10-87f5-e0709fa42656';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '25bb0ec1-afc6-40d9-95aa-54593153d02f' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Son_La.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nha-tu-son-la', '25bb0ec1-afc6-40d9-95aa-54593153d02f';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'd41f5dfc-cc39-45f1-9b1d-cd5985bd27b6' AND file_url = 'https://yenbai.gov.vn/uploads/images/2020/02/khu-tuong-niem-nguyen-thai-hoc.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khoi-nghia-yen-bai-1930', 'd41f5dfc-cc39-45f1-9b1d-cd5985bd27b6';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'eab40afa-ab78-4dcb-b578-75c6bb8f09ff' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Lan_Na_Nua_ATK_Dinh_Hoa.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'atk-dinh-hoa', 'eab40afa-ab78-4dcb-b578-75c6bb8f09ff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '02e4a1ea-a25f-430b-a563-5de021c7e5b0' AND file_url = 'https://backan.gov.vn/uploads/images/2022/05/atk-cho-don.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'atk-cho-don', '02e4a1ea-a25f-430b-a563-5de021c7e5b0';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '92d25f85-2d5d-4b5e-a40d-df00cbf63d45' AND file_url = 'https://langson.gov.vn/uploads/images/2021/09/di-tich-don-mo-nhai-bac-son.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khoi-nghia-bac-son', '92d25f85-2d5d-4b5e-a40d-df00cbf63d45';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '148d4502-9bcb-4fe8-bd57-9310d026bbe5' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ai_Chi_Lang_Lang_Son.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'ai-chi-lang', '148d4502-9bcb-4fe8-bd57-9310d026bbe5';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '1468b1ac-6586-4388-8c75-2a5880b0a193' AND file_url = 'https://quangninh.gov.vn/uploads/images/2021/03/di-tich-bac-ho-ve-tham-deo-nai.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'mo-than-deo-nai', '1468b1ac-6586-4388-8c75-2a5880b0a193';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'a338a171-ea01-4407-8a58-4251633dee43' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bai_coc_Bach_Dang_Yen_Hung.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'bai-coc-bach-dang', 'a338a171-ea01-4407-8a58-4251633dee43';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'ef5ea1a9-1116-437b-86d9-4d31a3a274bf' AND file_url = 'https://bacninh.gov.vn/uploads/images/2021/01/di-tich-atk2-hiep-hoa.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'atk-ii-hiep-hoa', 'ef5ea1a9-1116-437b-86d9-4d31a3a274bf';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'f130b771-7a8c-4170-a442-69eb8041acaa' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Don_Phon_Xuong_Yen_The.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khoi-nghia-yen-the', 'f130b771-7a8c-4170-a442-69eb8041acaa';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '15323e78-37cb-451b-91e0-4e9504cc8b8d' AND file_url = 'https://phutho.gov.vn/uploads/images/2021/10/tuong-dai-chien-thang-song-lo.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'chien-thang-song-lo-doan-hung', '15323e78-37cb-451b-91e0-4e9504cc8b8d';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'ec0cb811-1181-4021-8050-be7614657eb2' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cong_Den_Hung_Phu_Tho.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-di-tich-den-hung', 'ec0cb811-1181-4021-8050-be7614657eb2';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '76e54387-386c-4d53-81f3-cc0e77aaf671' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_K15_Do_Son_Hai_Phong.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'ben-k15-do-son', '76e54387-386c-4d53-81f3-cc0e77aaf671';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '7ab39638-a397-4769-9bbe-db4f3f15d003' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Kiep_Bac_Chi_Linh.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'con-son-kiep-bac', '7ab39638-a397-4769-9bbe-db4f3f15d003';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'b6d20340-cf17-46f7-8f09-c5527edfee05' AND file_url = 'https://hungyen.gov.vn/uploads/images/2021/10/di-tich-tieng-trong-tien-hai.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'tieng-trong-tien-hai', 'b6d20340-cf17-46f7-8f09-c5527edfee05';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '39d0e0d1-28b5-46e3-bd26-fc7512d56a18' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chua_Chuong_Pho_Hien.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'pho-hien', '39d0e0d1-28b5-46e3-bd26-fc7512d56a18';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'ef7f5ad2-8f68-49a7-8ef9-e84e57ca3486' AND file_url = 'https://ninhbinh.gov.vn/uploads/images/2021/05/bao-tang-det-may-nam-dinh.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nha-may-det-nam-dinh', 'ef7f5ad2-8f68-49a7-8ef9-e84e57ca3486';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'bf474e18-11c1-4b95-8d95-de29a2344a41' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'co-do-hoa-lu', 'bf474e18-11c1-4b95-8d95-de29a2344a41';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'bc64b3f9-e9db-423a-9571-55cc33c17cf4' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Ham_Rong_Thanh_Hoa.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'cau-ham-rong', 'bc64b3f9-e9db-423a-9571-55cc33c17cf4';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '90ae4451-1f34-48ef-8b9c-95afd54d6218' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-di-tich-kim-lien', '90ae4451-1f34-48ef-8b9c-95afd54d6218';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '25e34de1-f255-4db8-a149-3e1fe32c633c' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Truong_Bon_Nghe_An.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'truong-bon', '25e34de1-f255-4db8-a149-3e1fe32c633c';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'dfe44165-3544-41c8-ab5c-67ffa1d63dbd' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nga_ba_Dong_Loc_Ha_Tinh.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nga-ba-dong-loc', 'dfe44165-3544-41c8-ab5c-67ffa1d63dbd';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '09a9df77-9fd6-45a8-b041-f99c2671606d' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_co_Quang_Tri_Dai_tuong_niem.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'thanh-co-quang-tri', '09a9df77-9fd6-45a8-b041-f99c2671606d';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '0c4da11c-d9d1-46cc-9bae-e697a0119250' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'doi-bo-hien-luong-ben-hai', '0c4da11c-d9d1-46cc-9bae-e697a0119250';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '61004769-5064-40b7-8bfb-62878e311dc9' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ngo_Mon_Hue_Imperial_City.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'ngo-mon-hue', '61004769-5064-40b7-8bfb-62878e311dc9';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'e3f6b25e-78fa-49a0-ac88-565984ce82ac' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ky_Dai_Hue_Flag_Tower.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'kinh-thanh-hue-1968', 'e3f6b25e-78fa-49a0-ac88-565984ce82ac';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '6f9f0d0b-fc7b-41d2-9d05-d8abf0c4e099' AND file_url = 'https://danang.gov.vn/uploads/images/2021/05/tuong-dai-chien-thang-nui-thanh.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'chien-thang-nui-thanh-1965', '6f9f0d0b-fc7b-41d2-9d05-d8abf0c4e099';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '0ff7735e-33c8-42e5-96f7-5e9e11afbcb2' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_chung_tich_Son_My_Quang_Ngai.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-chung-tich-son-my', '0ff7735e-33c8-42e5-96f7-5e9e11afbcb2';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '4a20030b-75bc-4817-9871-d3cb547bc1bc' AND file_url = 'https://quangngai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-dak-to.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'dak-to-tan-canh', '4a20030b-75bc-4817-9871-d3cb547bc1bc';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'f28c7e02-70f0-4a6b-8267-c36eeccb772d' AND file_url = 'https://gialai.gov.vn/uploads/images/2021/08/lang-khang-chien-stor.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'lang-khang-chien-stor', 'f28c7e02-70f0-4a6b-8267-c36eeccb772d';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '32cf8f15-4068-4af1-b839-15c453ca4036' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Bao_tang_Quang_Trung_Binh_Dinh.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'bao-tang-quang-trung', '32cf8f15-4068-4af1-b839-15c453ca4036';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '04712de9-a030-44b8-a1a5-45a9e7f6538f' AND file_url = 'https://khanhhoa.gov.vn/uploads/images/2021/04/di-tich-san-bay-thanh-son.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'san-bay-thanh-son', '04712de9-a030-44b8-a1a5-45a9e7f6538f';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'f123ee15-f494-4edc-bc50-2a7ea30bea56' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Ba_Ponagar_Nha_Trang.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'thap-ba-ponagar', 'f123ee15-f494-4edc-bc50-2a7ea30bea56';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '19506177-71d0-44c0-adf6-48f9fd17ea29' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'buon-ma-thuot-1975', '19506177-71d0-44c0-adf6-48f9fd17ea29';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'f739d546-bece-4af3-996b-7f695d2e90ed' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Vinh_Vung_Ro_Phu_Yen.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'vung-ro-phu-yen', 'f739d546-bece-4af3-996b-7f695d2e90ed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'aea4c68b-b61e-4d85-86a2-4be4dfd3706f' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Truong_Duc_Thanh_Phan_Thiet.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'truong-duc-thanh', 'aea4c68b-b61e-4d85-86a2-4be4dfd3706f';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'a4e8c2a8-a84e-4c43-85a8-057c0e8b6551' AND file_url = 'https://lamdong.gov.vn/uploads/images/2021/06/nha-lao-thieu-nhi-da-lat.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nha-lao-thieu-nhi-da-lat', 'a4e8c2a8-a84e-4c43-85a8-057c0e8b6551';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '9f91075e-a5a5-4076-a923-ff87a167c7ef' AND file_url = 'https://dongnai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-xuan-loc.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'chien-thang-xuan-loc-1975', '9f91075e-a5a5-4076-a923-ff87a167c7ef';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'c2de2b7c-03d7-42d1-aca6-68efdc9104ba' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Ta_Thiet_Binh_Phuoc.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'can-cu-ta-thiet', 'c2de2b7c-03d7-42d1-aca6-68efdc9104ba';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '579406a5-7caf-4874-b867-a1ae7dde08c3' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dia_dao_Cu_Chi_Ben_Dinh.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'dia-dao-cu-chi', '579406a5-7caf-4874-b867-a1ae7dde08c3';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '2cbe2204-a57d-4cd5-9d52-1c6bb7af2fbb' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'can-cu-trung-uong-cuc-mien-nam', '2cbe2204-a57d-4cd5-9d52-1c6bb7af2fbb';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'fda09b6d-ff03-4060-b457-2962f38febcf' AND file_url = 'https://tayninh.gov.vn/uploads/images/2021/06/di-tich-nga-tu-duc-hoa.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nga-tu-duc-hoa', 'fda09b6d-ff03-4060-b457-2962f38febcf';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '323d8814-3d4a-48a6-8b12-afcfc00fa7fd' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Ap_Bac_Tien_Giang.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'chien-thang-ap-bac-1963', '323d8814-3d4a-48a6-8b12-afcfc00fa7fd';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'b4fed9b1-f028-4df5-9e96-0c2e7a12f782' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'mo-cu-pho-bang-nguyen-sinh-sac', 'b4fed9b1-f028-4df5-9e96-0c2e7a12f782';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '21fd0e40-3587-4f54-bdc4-a8b9bfab137a' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Dong_Khoi_Ben_Tre.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'dong-khoi-ben-tre-1960', '21fd0e40-3587-4f54-bdc4-a8b9bfab137a';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '0394812e-70d8-4511-bf7e-722c06270b1e' AND file_url = 'https://vinhlong.gov.vn/uploads/images/2021/11/khu-tuong-niem-vo-van-kiet.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-tuong-niem-vo-van-kiet', '0394812e-70d8-4511-bf7e-722c06270b1e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '4139a5a7-1b17-46a0-bd20-bfa35a8613ce' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Phu_Quoc_Chuong_cop.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'nha-tu-phu-quoc', '4139a5a7-1b17-46a0-bd20-bfa35a8613ce';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '2168d110-6806-4c24-a528-428e6b2825c2' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khu-luu-niem-ton-duc-thang', '2168d110-6806-4c24-a528-428e6b2825c2';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '21f18486-3f7d-4f3c-800f-d98ba2555ab3' AND file_url = 'https://cantho.gov.vn/uploads/images/2021/07/di-tich-chien-thang-chuong-thien.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'chien-thang-chuong-thien-1973', '21f18486-3f7d-4f3c-800f-d98ba2555ab3';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'f1b2e2d7-577f-43cb-b380-0d16e4670abc' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Kham_Lon_Can_Tho_Prison.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'kham-lon-can-tho', 'f1b2e2d7-577f-43cb-b380-0d16e4670abc';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = 'e5ae2c04-4370-4a79-9d01-7eab1e5b7c39' AND file_url = 'https://camau.gov.vn/uploads/images/2021/12/hai-dang-hon-khoai-ca-mau.jpg') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'khoi-nghia-hon-khoai-1940', 'e5ae2c04-4370-4a79-9d01-7eab1e5b7c39';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '74dbc826-7cb1-4e14-a522-c204ae54e771' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Vam_Lung_Ca_Mau.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'ben-vam-lung', '74dbc826-7cb1-4e14-a522-c204ae54e771';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '5e35a38d-3f65-49f7-a075-9c631bf69d03' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Suoi_Lenin_Pac_Bo.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'pac-bo-cao-bang', '5e35a38d-3f65-49f7-a075-9c631bf69d03';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = '1235ccda-2036-4e2c-a788-a4e5ac841fec' AND file_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Doc_Lap_Reunification_Palace.jpg?width=1600') THEN
    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', 'dinh-doc-lap', '1235ccda-2036-4e2c-a788-a4e5ac841fec';
  END IF;
END $assert$;

-- 2. Delete obsolete / broken media rows from release-v1
DELETE FROM public.media_assets WHERE id IN (
  '788efc9c-c9b1-4c76-ad18-51740f1f0f79',
  '9f86bd65-6097-457c-bab9-22c464ac3b66',
  'b8cc55c9-18ce-4cb3-9257-22f88c16afdb',
  '383b7e6c-378b-4742-b993-8e19fd4aa9d2',
  'f608e946-2407-4196-8b56-1fbbba38f0d0',
  '284b2009-d6f6-44c8-bb69-20627fbc272c',
  '4a3d854b-b792-42ab-a8ed-9dfda2692be3',
  '74cfeed9-0c1b-45e2-8201-207b16a5ff79',
  '62cc1be4-8776-43b5-aa7b-bf0d1f64a8e2',
  '7bd20f07-9c22-4e10-87f5-e0709fa42656',
  '25bb0ec1-afc6-40d9-95aa-54593153d02f',
  'd41f5dfc-cc39-45f1-9b1d-cd5985bd27b6',
  'eab40afa-ab78-4dcb-b578-75c6bb8f09ff',
  '02e4a1ea-a25f-430b-a563-5de021c7e5b0',
  '92d25f85-2d5d-4b5e-a40d-df00cbf63d45',
  '148d4502-9bcb-4fe8-bd57-9310d026bbe5',
  '1468b1ac-6586-4388-8c75-2a5880b0a193',
  'a338a171-ea01-4407-8a58-4251633dee43',
  'ef5ea1a9-1116-437b-86d9-4d31a3a274bf',
  'f130b771-7a8c-4170-a442-69eb8041acaa',
  '15323e78-37cb-451b-91e0-4e9504cc8b8d',
  'ec0cb811-1181-4021-8050-be7614657eb2',
  '76e54387-386c-4d53-81f3-cc0e77aaf671',
  '7ab39638-a397-4769-9bbe-db4f3f15d003',
  'b6d20340-cf17-46f7-8f09-c5527edfee05',
  '39d0e0d1-28b5-46e3-bd26-fc7512d56a18',
  'ef7f5ad2-8f68-49a7-8ef9-e84e57ca3486',
  'bf474e18-11c1-4b95-8d95-de29a2344a41',
  'bc64b3f9-e9db-423a-9571-55cc33c17cf4',
  '90ae4451-1f34-48ef-8b9c-95afd54d6218',
  '25e34de1-f255-4db8-a149-3e1fe32c633c',
  'dfe44165-3544-41c8-ab5c-67ffa1d63dbd',
  '09a9df77-9fd6-45a8-b041-f99c2671606d',
  '0c4da11c-d9d1-46cc-9bae-e697a0119250',
  '61004769-5064-40b7-8bfb-62878e311dc9',
  'e3f6b25e-78fa-49a0-ac88-565984ce82ac',
  '6f9f0d0b-fc7b-41d2-9d05-d8abf0c4e099',
  '0ff7735e-33c8-42e5-96f7-5e9e11afbcb2',
  '4a20030b-75bc-4817-9871-d3cb547bc1bc',
  'f28c7e02-70f0-4a6b-8267-c36eeccb772d',
  '32cf8f15-4068-4af1-b839-15c453ca4036',
  '04712de9-a030-44b8-a1a5-45a9e7f6538f',
  'f123ee15-f494-4edc-bc50-2a7ea30bea56',
  '19506177-71d0-44c0-adf6-48f9fd17ea29',
  'f739d546-bece-4af3-996b-7f695d2e90ed',
  'aea4c68b-b61e-4d85-86a2-4be4dfd3706f',
  'a4e8c2a8-a84e-4c43-85a8-057c0e8b6551',
  '9f91075e-a5a5-4076-a923-ff87a167c7ef',
  'c2de2b7c-03d7-42d1-aca6-68efdc9104ba',
  '579406a5-7caf-4874-b867-a1ae7dde08c3',
  '2cbe2204-a57d-4cd5-9d52-1c6bb7af2fbb',
  'fda09b6d-ff03-4060-b457-2962f38febcf',
  '323d8814-3d4a-48a6-8b12-afcfc00fa7fd',
  'b4fed9b1-f028-4df5-9e96-0c2e7a12f782',
  '21fd0e40-3587-4f54-bdc4-a8b9bfab137a',
  '0394812e-70d8-4511-bf7e-722c06270b1e',
  '4139a5a7-1b17-46a0-bd20-bfa35a8613ce',
  '2168d110-6806-4c24-a528-428e6b2825c2',
  '21f18486-3f7d-4f3c-800f-d98ba2555ab3',
  'f1b2e2d7-577f-43cb-b380-0d16e4670abc',
  'e5ae2c04-4370-4a79-9d01-7eab1e5b7c39',
  '74dbc826-7cb1-4e14-a522-c204ae54e771',
  '5e35a38d-3f65-49f7-a075-9c631bf69d03',
  '1235ccda-2036-4e2c-a788-a4e5ac841fec'
);

-- 3. Delete unverified / fake location videos
DELETE FROM public.location_videos WHERE id IN (
  '5499857d-0cdf-4dc3-8592-71a41d584a07',
  '8b1baa34-8339-4343-8632-43fff0ecf56c',
  '5a611332-5706-424f-87bd-7d770d262713',
  '98e081d5-0c82-4caa-ba29-303ff12440e9'
);

-- 4. Insert new evidence-backed media assets
INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nha-tu-hoa-lo/cong-chinh-maison-centrale-1200.webp', 'https://commons.wikimedia.org/wiki/File:Hoa_Lo_Prison_(Maison_Centrale),_Hanoi_(6923115824).jpg', 'image', 'Cổng vào Di tích Nhà tù Hỏa Lò (Maison Centrale), phố Hỏa Lò, Hà Nội', 'Cổng vào Di tích Nhà tù Hỏa Lò với dòng chữ Maison Centrale nổi bật',
  'today', 2012, 'David McKelvey from Brisbane, Australia', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-hoa-lo') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 675, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/hoang-thanh-thang-long/doan-mon-hoang-thanh-1200.webp', 'https://commons.wikimedia.org/wiki/File:%C4%90oan_M%C3%B4n,_Ho%C3%A0ng_th%C3%A0nh_Th%C4%83ng_Long,_H%C3%A0_N%E1%BB%99i_001.JPG', 'image', 'Cổng Đoan Môn – cổng chính phía Nam dẫn vào Cấm thành Thăng Long, Hà Nội', 'Toàn cảnh di tích cổng Đoan Môn cổ kính với các vòm cuốn bằng đá',
  'today', 2014, 'Phan Minh Tuấn', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'hoang-thanh-thang-long') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/pac-bo-cao-bang/suoi-lenin-nui-cac-mac-1200.webp', 'https://commons.wikimedia.org/wiki/File:P%C3%A1c_B%C3%B3.jpg', 'image', 'Suối Lê-nin và núi Các Mác tại Khu di tích lịch sử Pác Bó, xã Trường Hà, huyện Hà Quảng, tỉnh Cao Bằng', 'Dòng suối Lê-nin nước trong xanh như ngọc bích chảy dưới chân vách núi Các Mác',
  'today', 2016, '[Tycho] talk , http://shansov.net', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 675, COALESCE((SELECT max(sort_order) FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'pac-bo-cao-bang')), 0) + 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/rung-tran-hung-dao/nha-trung-bay-rung-tran-hung-dao-1200.webp', 'https://www.vietnamplus.vn/bao-ton-va-phat-huy-gia-tri-khu-di-tich-lich-su-rung-tran-hung-dao-post292417.vnp', 'image', 'Khu nhà đón tiếp và trưng bày truyền thống tại Khu di tích Quốc gia đặc biệt Rừng Trần Hưng Đạo, huyện Nguyên Bình, tỉnh Cao Bằng', 'Khu nhà trưng bày truyền thống mái ngói đỏ giữa rừng nguyên sinh Trần Hưng Đạo',
  'today', 2014, 'TTXVN', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'rung-tran-hung-dao') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 600, 450, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-di-tich-tan-trao/dinh-tan-trao-1200.webp', 'https://commons.wikimedia.org/wiki/File:%C4%90%C3%ACnh_T%C3%A2n_Tr%C3%A0o.jpg', 'image', 'Đình Tân Trào, nơi diễn ra Quốc dân Đại hội tháng 8 năm 1945, xã Tân Trào, huyện Sơn Dương, tỉnh Tuyên Quang', 'Toàn cảnh mái đình Tân Trào lợp lá cọ truyền thống giữa cây cối xanh tươi',
  'today', 2013, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-tan-trao') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/cot-co-lung-cu/cot-co-lung-cu-dinh-nui-rong-1200.webp', 'https://commons.wikimedia.org/wiki/File:C%E1%BB%99t_c%E1%BB%9D_L%C5%A9ng_C%C3%BA_-_H%C3%A0_Giang.JPG', 'image', 'Cột cờ Quốc gia Lũng Cú trên đỉnh núi Rồng, xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang', 'Cột cờ Lũng Cú với lá cờ đỏ sao vàng tung bay trên nền trời biên cương',
  'today', 2011, 'vi:User:Leminhel', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'cot-co-lung-cu') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/doi-a1-dien-bien-phu/dai-tuong-niem-dinh-doi-a1-1200.webp', 'https://commons.wikimedia.org/wiki/File:Monument_to_Vietminh_Assault_-_Hill_A1_(Eliane_2)_-_Dien_Bien_Phu_-_Vietnam_(48168816427).jpg', 'image', 'Đài tưởng niệm các chiến sĩ tại đỉnh cứ điểm Đồi A1 (Eliane 2), thành phố Điện Biên Phủ', 'Đài tưởng niệm trên đồi A1 với bia đá và hàng rào phòng thủ của quân Pháp',
  'today', 2019, 'Adam Jones from Kelowna, BC, Canada', 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'doi-a1-dien-bien-phu') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'ham-de-castries'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/ham-de-castries/ham-chi-huy-de-castries-1200.webp', 'https://commons.wikimedia.org/wiki/File:H%E1%BA%A7m_ch%E1%BB%89_huy_t%E1%BA%ADp_%C4%91o%C3%A0n_c%E1%BB%A9_%C4%91i%E1%BB%83m_%C4%90i%E1%BB%87n_Bi%C3%AAn_Ph%E1%BB%A7_(2022).jpg', 'image', 'Hầm chỉ huy của tướng De Castries tại trung tâm tập đoàn cứ điểm Điện Biên Phủ', 'Nóc hầm chỉ huy De Castries với các tấm thép uốn lượn và bao cát phòng thủ',
  'today', 2022, 'Ioe2015', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ham-de-castries') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/chien-thang-lai-chau-1953/tuong-dai-quang-truong-lai-chau-1200.webp', 'https://commons.wikimedia.org/wiki/File:Lai_Ch%C3%A2u_Town_Square_Monument_(2014).jpg', 'image', 'Tượng đài Bác Hồ với đồng bào các dân tộc Lai Châu tại Quảng trường thành phố Lai Châu', 'Cụm tượng đài Bác Hồ giữa trung tâm quảng trường thành phố Lai Châu',
  'today', 2014, 'Idan Robbins', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-lai-chau-1953') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 675, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-son-la'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nha-tu-son-la/nha-tu-son-la-khu-giam-cam-1200.webp', 'https://commons.wikimedia.org/wiki/File:Nh%C3%A0_t%C3%B9_S%C6%A1n_La_-_panoramio.jpg', 'image', 'Khu di tích Quốc gia đặc biệt Nhà tù Sơn La trên đồi Khau Cả, thành phố Sơn La', 'Tường đá cổ và những song sắt kiên cố của các xà lim Nhà tù Sơn La',
  'today', 2011, 'ChieuTimViet', 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-son-la') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 797, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khoi-nghia-yen-bai-1930/chan-dung-13-liet-si-khoi-nghia-yen-bai-1200.webp', 'https://commons.wikimedia.org/wiki/File:Portraits_of_13_nationalists_executed_in_Yen-Bay_on_17_June_1930.png', 'image', 'Chân dung 13 nghĩa sĩ Việt Nam Quốc dân Đảng hy sinh tại Yên Bái ngày 17 tháng 6 năm 1930', 'Tài liệu lịch sử năm 1930 in ảnh chân dung 13 chiến sĩ Khởi nghĩa Yên Bái trước máy chém',
  'historical', 1930, 'Báo chí đương thời (1930)', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-bai-1930') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 1800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/atk-dinh-hoa/nha-tuong-niem-bac-ho-deo-de-1200.webp', 'https://commons.wikimedia.org/wiki/File:ATK_DINH_HOA.JPG', 'image', 'Nhà tưởng niệm Chủ tịch Hồ Chí Minh tại Đèo De, xã Phú Đình, huyện Định Hóa, tỉnh Thái Nguyên (ATK Định Hóa)', 'Khu nhà tưởng niệm kiến trúc mái ngói cổ truyền tọa lạc trang nghiêm trên đỉnh Đèo De',
  'today', 2009, 'Minhminh284', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'atk-dinh-hoa') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'atk-cho-don'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/atk-cho-don/di-tich-deo-so-cho-don-1200.webp', 'https://commons.wikimedia.org/wiki/File:%C4%90%C3%A8o_So.jpg', 'image', 'Đèo So, cửa ngõ lịch sử nối liền ATK Định Hóa và ATK Chợ Đồn, xã Yên Nhuận, huyện Chợ Đồn, tỉnh Bắc Kạn', 'Con đèo uốn lượn qua các dãy núi rừng xanh mướt của chiến khu Việt Bắc',
  'today', 2016, 'Gió Đông', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'atk-cho-don') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 679, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khoi-nghia-bac-son/bao-tang-khoi-nghia-bac-son-1200.webp', 'http://langsontourism.com.vn/vi/khoinghiabacson', 'image', 'Bảo tàng Khởi nghĩa Bắc Sơn tại thôn Long Đống, xã Bắc Quỳnh, lưu giữ các hiện vật tiêu biểu của cuộc khởi nghĩa 1940.', 'Tòa nhà Bảo tàng Khởi nghĩa Bắc Sơn hai tầng kiến trúc truyền thống nép mình bên những dãy núi đá vôi hùng vĩ',
  'today', 2021, 'Trung tâm Thông tin Xúc tiến Du lịch Lạng Sơn', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-bac-son') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1024, 682, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'ai-chi-lang'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/ai-chi-lang/thung-lung-ai-chi-lang-1200.webp', 'https://commons.wikimedia.org/wiki/File:Chi_L%C4%83ng_2.jpg', 'image', 'Núi Mã Yên và thung lũng Ải Chi Lăng, nơi ghi dấu chiến thắng Chi Lăng – Xương Giang năm 1427.', 'Núi Mã Yên nhấp nhô giữa thung lũng xanh ngát của khu di tích Ải Chi Lăng Lạng Sơn',
  'today', 2013, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ai-chi-lang') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 858, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/mo-than-deo-nai/bia-bac-ho-ve-tham-mo-deo-nai-1200.webp', 'https://baoquangninh.vn/di-tich-noi-bac-ho-ve-tham-mo-deo-nai-post2342565.html', 'image', 'Bia lưu niệm tại tầng than mỏ Đèo Nai ghi dấu ngày Bác Hồ về thăm công nhân vùng mỏ (30/3/1959).', 'Bia đá tưởng niệm Bác Hồ về thăm mỏ than Đèo Nai bên khai trường khai thác than lộ thiên Cẩm Phả',
  'today', 2022, 'Báo Quảng Ninh', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'mo-than-deo-nai') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 800, 530, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/bai-coc-bach-dang/bai-coc-yen-giang-1200.webp', 'https://commons.wikimedia.org/wiki/File:C%E1%BB%8Dc_B%E1%BA%A1ch_%C4%90%E1%BA%B1ng.jpg', 'image', 'Dấu tích những hàng cọc gỗ lim dưới lòng sông tại bãi cọc Yên Giang (Quảng Ninh) trong chiến thắng Bạch Đằng 1288.', 'Những thân cọc gỗ đen thẫm cắm thẳng đứng nhô lên khỏi bùn lầy tại bãi cọc Bạch Đằng Yên Giang',
  'today', 2012, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'bai-coc-bach-dang') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/atk-ii-hiep-hoa/cay-da-cho-van-atk-ii-1200.webp', 'https://commons.wikimedia.org/wiki/File:HiepHoaCayDa.JPG', 'image', 'Cây đa Chợ Vân, một trong những địa điểm lịch sử thuộc An toàn khu II (ATK II) Hiệp Hòa, Bắc Giang thời kỳ tiền khởi nghĩa.', 'Cây đa cổ thụ Chợ Vân cành lá xum xuê bên đường làng thuộc di tích ATK II Hiệp Hòa',
  'today', 2009, 'Bùi Thế Tâm', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'atk-ii-hiep-hoa') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khoi-nghia-yen-the/hoang-hoa-tham-tren-ngua-1200.webp', 'https://commons.wikimedia.org/wiki/File:Ho%C3%A0ng_Hoa_Th%C3%A1m_riding_a_horse.png', 'image', 'Thủ lĩnh khởi nghĩa Yên Thế Hoàng Hoa Thám (Đề Thám) trên lưng ngựa tại đồn Phồn Xương.', 'Bức ảnh tư liệu lịch sử chụp Đề Thám Hoàng Hoa Thám trang nghiêm trên lưng ngựa trong phong trào khởi nghĩa Yên Thế',
  'historical', 1905, 'unknown', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-yen-the') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1127, 2037, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/chien-thang-song-lo-doan-hung/tuong-dai-song-lo-1200.webp', 'https://commons.wikimedia.org/wiki/File:T%C6%B0%E1%BB%A3ng_%C4%91%C3%A0i_chi%E1%BA%BFn_th%E1%BA%AFng_S%C3%B4ng_L%C3%B4.jpg', 'image', 'Tượng đài Chiến thắng Sông Lô trên đỉnh núi Đồn (thị trấn Đoan Hùng, Phú Thọ) ghi dấu chiến công thu đông 1947.', 'Tượng đài Chiến thắng Sông Lô vươn cao trên đồi nhìn xuống dòng sông Lô lịch sử',
  'today', 2021, 'Vhung1214', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-song-lo-doan-hung') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1024, 768, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-di-tich-den-hung/cong-vao-den-hung-1200.webp', 'https://commons.wikimedia.org/wiki/File:%C4%90%E1%BB%81n_H%C3%B9ng.JPG', 'image', 'Cổng vào Khu di tích lịch sử quốc gia đặc biệt Đền Hùng trên núi Nghĩa Lĩnh, Phú Thọ.', 'Cổng vào Đền Hùng uy nghi với mái ngói cổ kính rợp bóng cây cổ thụ trên núi Nghĩa Lĩnh',
  'today', 2011, 'Hoangvantoanajc', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-den-hung') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 860, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/ben-k15-do-son/tuong-dai-ben-k15-do-son-1200.webp', 'https://chinhsachcuocsong.vnanet.vn/ben-tau-khong-so-k15-dia-chi-do-nhac-nho-the-he-tre-ve-gia-tri-cua-hoa-binh-doc-lap/83591.html', 'image', 'Tượng đài Di tích lịch sử quốc gia đặc biệt Đường Hồ Chí Minh trên biển tại Bến K15 Đồ Sơn, Hải Phòng.', 'Tượng đài cánh buồm bằng đá vươn cao tại di tích Bến K15 Đồ Sơn nơi xuất phát của các đoàn tàu không số',
  'today', 2026, 'Thông tấn xã Việt Nam (TTXVN)', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ben-k15-do-son') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1024, 684, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/con-son-kiep-bac/cong-nghi-mon-den-kiep-bac-1200.webp', 'https://commons.wikimedia.org/wiki/File:Den_kiep_bac.jpg', 'image', 'Đền Kiếp Bạc thờ Hưng Đạo Đại Vương Trần Quốc Tuấn tại thành phố Chí Linh, Hải Dương.', 'Cổng nghi môn và sân tiền tế Đền Kiếp Bạc uy nghiêm bên dòng sông Lục Đầu',
  'today', 2008, 'Handyhuy ( thảo luận ) 14:20, ngày 21 tháng 4 năm 2008 (UTC)', 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'con-son-kiep-bac') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/tieng-trong-tien-hai/dinh-lang-nho-lam-le-ky-niem-1200.webp', 'https://dongchau.hungyen.gov.vn/dinh-lang-nho-lam-to-chuc-le-ky-niem-ngay-truyen-thong-cach-mang-c260.html', 'image', 'Đình làng Nho Lâm ghi dấu sự kiện Tiếng trống Tiền Hải ngày 14/10/1930 trong ngày hội truyền thống cách mạng.', 'Mặt tiền di tích lịch sử Đình làng Nho Lâm với mái ngói cổ truyền trong ngày kỷ niệm truyền thống cách mạng',
  'today', 2025, 'Cổng Thông tin Điện tử xã Đông Châu', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'tieng-trong-tien-hai') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 899, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'pho-hien'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/pho-hien/tam-quan-van-mieu-xich-dang-1200.webp', 'https://commons.wikimedia.org/wiki/File:V%C4%83n_mi%E1%BA%BFu_X%C3%ADch_%C4%90%E1%BA%B1ng_01.JPG', 'image', 'Cổng tam quan Văn miếu Xích Đằng, biểu tượng văn hiến nghìn năm của đất Phố Hiến, Hưng Yên.', 'Cổng tam quan hai tầng mái ngói cổ kính rêu phong của Văn miếu Xích Đằng Phố Hiến',
  'today', 2011, 'Nguyễn Thanh Quang', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'pho-hien') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nha-may-det-nam-dinh/so-do-nha-may-det-nam-dinh-1200.webp', 'https://commons.wikimedia.org/wiki/File:S%C6%A1_%C4%91%E1%BB%93_Nh%C3%A0_m%C3%A1y_D%E1%BB%87t_Nam_%C4%90%E1%BB%8Bnh_(B%E1%BA%A3o_t%C3%A0ng_t%E1%BB%89nh_Nam_%C4%90%E1%BB%8Bnh).jpg', 'image', 'Sơ đồ lịch sử Nhà máy Dệt Nam Định thời kỳ phong trào công nhân đấu tranh lưu giữ tại Bảo tàng tỉnh Nam Định.', 'Bản đồ sơ đồ kiến trúc và quy hoạch Nhà máy Dệt Nam Định lưu giữ tại Bảo tàng tỉnh Nam Định',
  'historical', 1925, 'The government of the French protectorate of Annam and Tonkin, French Indo-China.', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-may-det-nam-dinh') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 606, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/co-do-hoa-lu/cong-vao-co-do-hoa-lu-1200.webp', 'https://commons.wikimedia.org/wiki/File:Gate_at_Hoa_Lu_-_Vietnam_-_August_2023.jpg', 'image', 'Cổng vào Cố đô Hoa Lư, kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam dưới triều Đinh - Tiền Lê.', 'Cổng thành bằng đá với mái ngói cong truyền thống soi bóng nước thanh bình tại Cố đô Hoa Lư Ninh Bình',
  'today', 2023, 'Anass Sedrati', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'co-do-hoa-lu') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'cau-ham-rong'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/cau-ham-rong/cau-ham-rong-song-ma-1200.webp', 'https://commons.wikimedia.org/wiki/File:Ham_Rong_Bridge.jpg', 'image', 'Cầu Hàm Rồng bắc qua sông Mã, biểu tượng ý chí kiên cường của quân dân Thanh Hóa trong kháng chiến chống Mỹ.', 'Cầu thép Hàm Rồng vững chãi bắc ngang dòng sông Mã uốn lượn dưới chân núi Rồng',
  'today', 2012, 'Rolers.FTU', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'cau-ham-rong') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'thanh-nha-ho'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/thanh-nha-ho/cong-nam-thanh-nha-ho-1200.webp', 'https://commons.wikimedia.org/wiki/File:Tay_Do_castle_South_gate.JPG', 'image', 'Cổng Nam Thành nhà Hồ (Tây Đô) xây bằng những khối đá lớn độc đáo thế kỷ XIV, Di sản văn hóa thế giới.', 'Cổng Nam thành đá nhà Hồ với ba vòm cuốn đồ sộ bằng đá xanh nguyên khối sừng sững giữa trời',
  'today', 2008, 'vi:Thành viên:Silviculture', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'thanh-nha-ho') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-di-tich-kim-lien/den-tuong-niem-kim-lien-1200.webp', 'https://commons.wikimedia.org/wiki/File:Kim_Lien_Monuments_Park.JPG', 'image', 'Cụm đền tưởng niệm và cây đa tại Khu di tích Quốc gia đặc biệt Kim Liên, Nam Đàn, Nghệ An.', 'Đền tưởng niệm mái ngói truyền thống soi bóng bên cây cổ thụ râm mát tại Khu di tích Kim Liên',
  'today', 2009, 'Liftold at Vietnamese Wikipedia', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-di-tich-kim-lien') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'truong-bon'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/truong-bon/toan-canh-di-tich-truong-bon-1200.webp', 'https://nhandan.vn/truong-bon-mot-bieu-tuong-cua-tinh-than-viet-nam-post721703.html', 'image', 'Toàn cảnh Khu di tích Lịch sử Quốc gia Truông Bồn tại xã Mỹ Sơn, huyện Đô Lương, tỉnh Nghệ An.', 'Toàn cảnh quảng trường, đài tưởng niệm và các công trình di tích Truông Bồn nhìn từ trên cao giữa thung lũng xanh',
  'today', 2022, 'Báo Nhân Dân', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'truong-bon') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1000, 617, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nga-ba-dong-loc/tuong-dai-nga-ba-dong-loc-1200.webp', 'https://commons.wikimedia.org/wiki/File:Nga_Ba_Dong_Loc.jpg', 'image', 'Quần thể tượng đài và khu tưởng niệm 10 cô gái thanh niên xung phong tại Ngã ba Đồng Lộc, Hà Tĩnh.', 'Cụm tượng đài chiến thắng và hồ nước trong khuôn viên di tích lịch sử Ngã ba Đồng Lộc',
  'today', 2013, 'Khoitran1957', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nga-ba-dong-loc') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 515, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/thanh-co-quang-tri/dai-tuong-niem-thanh-co-quang-tri-1200.webp', 'https://commons.wikimedia.org/wiki/File:Th%C3%A0nh_c%E1%BB%95_Qu%E1%BA%A3ng_Tr%E1%BB%8B_4.jpg', 'image', 'Đài tưởng niệm trung tâm Thành cổ Quảng Trị, biểu tượng tưởng niệm 81 ngày đêm rực lửa năm 1972.', 'Đài tưởng niệm hình nấm mồ chung và biểu tượng bát hương khổng lồ giữa trung tâm Thành cổ Quảng Trị',
  'today', 2013, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'thanh-co-quang-tri') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/doi-bo-hien-luong-ben-hai/cau-hien-luong-song-ben-hai-1200.webp', 'https://commons.wikimedia.org/wiki/File:Benhai03.JPG', 'image', 'Cầu Hiền Lương lịch sử bắc qua sông Bến Hải, vĩ tuyến 17 chia cắt hai miền Nam - Bắc suốt 20 năm.', 'Cầu Hiền Lương sơn hai màu xanh vàng tượng trưng cho giới tuyến quân sự tạm thời trên dòng sông Bến Hải',
  'today', 2007, 'Đỗ Tuấn Hưng', 'CC BY-SA 3.0', 'http://creativecommons.org/licenses/by-sa/3.0/', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'doi-bo-hien-luong-ben-hai') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'ngo-mon-hue'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/ngo-mon-hue/ngo-mon-hoang-thanh-hue-1200.webp', 'https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_Meridian_Gate_-_Ng%E1%BB%8D_M%C3%B4n_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)_-_img_02.jpg', 'image', 'Cửa Ngọ Môn – cổng chính phía Nam của Hoàng thành Huế, Di sản Văn hóa Thế giới.', 'Toàn cảnh cổng Ngọ Môn bằng đá uy nghi với Lầu Ngũ Phụng mái ngói thanh lưu ly và hoàng lưu ly',
  'today', 2024, 'Chainwit.', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ngo-mon-hue') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/kinh-thanh-hue-1968/ky-dai-kinh-thanh-hue-1200.webp', 'https://commons.wikimedia.org/wiki/File:K%E1%BB%B3_%C4%90%C3%A0i_(Kinh_th%C3%A0nh_Hu%E1%BA%BF).jpg', 'image', 'Kỳ Đài Kinh thành Huế – nơi lá cờ Mặt trận Dân tộc Giải phóng miền Nam tung bay trong chiến dịch Tết Mậu Thân 1968.', 'Cột cờ Kỳ Đài xây bằng gạch ba tầng sừng sững trước Ngọ Môn và Đại Nội Huế',
  'today', 2014, 'Vdongold', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'kinh-thanh-hue-1968') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/chien-thang-nui-thanh-1965/tuong-dai-chien-thang-nui-thanh-1200.webp', 'https://baoquangnam.vn/di-tich-quoc-gia-chien-thang-nui-thanh-nang-tam-va-lan-toa-3027374.html', 'image', 'Tượng đài Chiến thắng Núi Thành trên đồi Phú Huề (Quảng Nam), ghi dấu trận đầu đánh Mỹ và thắng Mỹ ngày 26/5/1965.', 'Tượng đài chiến sĩ Núi Thành giương cao súng trên đỉnh đài cao với bậc thang kỳ vĩ dẫn lên đồi',
  'today', 2020, 'Báo Quảng Nam', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-nui-thanh-1965') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 873, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-den-thap-my-son/quan-the-thap-my-son-1200.webp', 'https://commons.wikimedia.org/wiki/File:2024_-_M%E1%BB%B9_S%C6%A1n_Group_B,_C_and_D_-_img_23.jpg', 'image', 'Quần thể tháp gạch cổ Chăm Pa tại Thung lũng thánh địa Mỹ Sơn, Di sản Văn hóa Thế giới tại Quảng Nam.', 'Các tòa tháp Chăm bằng gạch đỏ cổ kính rêu phong nằm giữa thung lũng Mỹ Sơn được bao bọc bởi đồi núi',
  'today', 2024, 'Chainwit.', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-den-thap-my-son') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-chung-tich-son-my/tuong-dai-chung-tich-son-my-1200.webp', 'https://commons.wikimedia.org/wiki/File:Monument_of_the_My_Lai_Massacre_(2).jpg', 'image', 'Tượng đài tưởng niệm nạn nhân vụ thảm sát Mỹ Lai tại Khu chứng tích Sơn Mỹ, Tịnh Khê, Quảng Ngãi.', 'Tượng đài người phụ nữ bế con tay nắm chặt căm hờn tại Khu chứng tích Sơn Mỹ Quảng Ngãi',
  'today', 2018, '-JvL- from Netherlands', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-chung-tich-son-my') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 674, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/dak-to-tan-canh/tuong-dai-dak-to-tan-canh-1200.webp', 'https://commons.wikimedia.org/wiki/File:T%C6%B0%E1%BB%A3ng_%C4%91%C3%A0i_Chi%E1%BA%BFn_th%E1%BA%AFng_%C4%90%C4%83k_T%C3%B4_-_T%C3%A2n_C%E1%BA%A3nh_(40022454161).jpg', 'image', 'Tượng đài Chiến thắng Đắk Tô – Tân Cảnh ghi dấu chiến công giải phóng cứ điểm Tân Cảnh năm 1972.', 'Tượng đài và xe tăng chiến thắng Đắk Tô - Tân Cảnh sừng sững bên quốc lộ 14 Kon Tum',
  'today', 2018, 'Vinnie Cartabiano', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dak-to-tan-canh') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 1800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/lang-khang-chien-stor/nha-luu-niem-anh-hung-nup-1200.webp', 'https://gialai.gov.vn/du-khach/di-tich-lich-su-van-hoa/lang-khang-chien-stor.html', 'image', 'Nhà lưu niệm Anh hùng Núp tại Làng kháng chiến Stơr, xã Tơ Tung, huyện Kbang, tỉnh Gia Lai.', 'Nhà rông lưu niệm truyền thống cách điệu thờ Anh hùng Núp giữa khung cảnh núi rừng Kbang Gia Lai',
  'today', 2025, 'Cổng Thông tin Điện tử tỉnh Gia Lai', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'lang-khang-chien-stor') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/bao-tang-quang-trung/bao-tang-quang-trung-tay-son-1200.webp', 'https://commons.wikimedia.org/wiki/File:B%E1%BA%A3o_T%C3%A0ng_Quang_Trung.JPG', 'image', 'Khu di tích Điện thờ Tây Sơn Tam Kiệt và Bảo tàng Quang Trung tại thị trấn Phú Phong, Tây Sơn, Bình Định.', 'Điện thờ Tây Sơn Tam Kiệt với kiến trúc cổ truyền trang nghiêm tại Bảo tàng Quang Trung Bình Định',
  'today', 2009, 'Original uploader was Liftold at vi.wikipedia', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'bao-tang-quang-trung') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/san-bay-thanh-son/san-bay-phan-rang-thanh-son-1969-1200.webp', 'https://commons.wikimedia.org/wiki/File:Douglas_A-1H_Skyraider_of_the_1st_SOS_at_Phan_Rang_Air_Base,_Vietnam,_circa_in_1969_(VA065677).jpg', 'image', 'Căn cứ không quân Phan Rang (Sân bay Thành Sơn) nơi Phi đội Quyết thắng cất cánh ném bom sân bay Tân Sơn Nhất tháng 4/1975.', 'Máy bay trên đường băng căn cứ không quân Phan Rang (Sân bay Thành Sơn) Ninh Thuận năm 1969',
  'historical', 1969, 'U.S. Air Force', 'Public domain', NULL, 'public_domain',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'san-bay-thanh-son') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 785, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/thap-ba-ponagar/thap-ba-ponagar-nha-trang-1200.webp', 'https://commons.wikimedia.org/wiki/File:Th%C3%A1p_b%C3%A0_Ponagar.JPG', 'image', 'Quần thể Tháp Bà Ponagar trên đồi Cù Lao nhìn ra cửa sông Cái, Nha Trang, Khánh Hòa.', 'Các tháp gạch nung cổ kính trầm mặc của quần thể di tích Tháp Bà Ponagar Nha Trang',
  'today', 2010, 'Nguyễn Đông Sơn at Vietnamese Wikipedia', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'thap-ba-ponagar') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/buon-ma-thuot-1975/tuong-dai-chien-thang-buon-ma-thuot-1200.webp', 'https://commons.wikimedia.org/wiki/File:Bu%C3%B4n_Ma_Thu%E1%BB%99t_city_square.jpg', 'image', 'Tượng đài Chiến thắng Buôn Ma Thuột tại Ngã Sáu trung tâm thành phố Buôn Ma Thuột, Đắk Lắk.', 'Tượng đài Chiến thắng Buôn Ma Thuột với biểu tượng xe tăng và hoa tiêu thép giữa vòng xoay Ngã Sáu',
  'today', 2011, 'Rdavout', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'buon-ma-thuot-1975') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 796, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/vung-ro-phu-yen/vinh-vung-ro-ben-tau-khong-so-1200.webp', 'https://commons.wikimedia.org/wiki/File:V%E1%BB%8Bnh_V%C5%A9ng_R%C3%B4.jpg', 'image', 'Vịnh Vũng Rô – Di tích Quốc gia đặc biệt nơi gắn liền với huyền thoại Tàu Không số Đường Hồ Chí Minh trên biển, thị xã Đông Hòa, Phú Yên.', 'Vịnh biển Vũng Rô với làn nước xanh ngắt được che chắn bởi các dãy núi non hùng vĩ',
  'today', 2011, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'vung-ro-phu-yen') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'truong-duc-thanh'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/truong-duc-thanh/khu-di-tich-truong-duc-thanh-1200.webp', 'https://commons.wikimedia.org/wiki/File:Tr%C6%B0%E1%BB%9Dng_D%E1%BB%A5c_Thanh.jpg', 'image', 'Khu di tích Lịch sử Trường Dục Thanh, nơi thầy giáo Nguyễn Tất Thành từng dạy học năm 1910 trước khi ra đi tìm đường cứu nước, thành phố Phan Thiết, Bình Thuận.', 'Dãy nhà cổ bằng gỗ mái ngói rêu phong của Trường Dục Thanh bên dòng sông Cà Ty',
  'today', 2012, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'truong-duc-thanh') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nha-lao-thieu-nhi-da-lat/cong-vao-nha-lao-thieu-nhi-da-lat-1200.webp', 'https://commons.wikimedia.org/wiki/File:Da_Lat_Children%27s_Prison_02.jpg', 'image', 'Cổng vào Di tích Lịch sử Nhà lao Thiếu nhi Đà Lạt trên đồi Chi Lăng, thành phố Đà Lạt, Lâm Đồng.', 'Cổng vào di tích Nhà lao Thiếu nhi Đà Lạt với bia di tích lịch sử quốc gia',
  'today', 2012, 'Diane Selwyn', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-lao-thieu-nhi-da-lat') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/chien-thang-xuan-loc-1975/dap-tan-canh-cua-thep-xuan-loc-1200.webp', 'https://www.vietnamplus.vn/khoanh-khac-va-su-kien-ngay-2141975-dap-tan-canh-cua-thep-xuan-loc-post1034024.vnp', 'image', 'Quân giải phóng tiến công đập tan ''cánh cửa thép'' Xuân Lộc ngày 21/4/1975, mở toang cửa ngõ phía Đông Bắc tiến vào Sài Gòn.', 'Hình ảnh lịch sử quân giải phóng tiến công giải phóng Xuân Lộc năm 1975',
  'historical', 1975, 'Tư liệu TTXVN / VietnamPlus', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-xuan-loc-1975') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 800, 450, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/can-cu-ta-thiet/can-cu-ta-thiet-loc-ninh-1200.webp', 'https://www.vietnamplus.vn/50-nam-thu-do-khang-chien-vung-dat-do-loc-ninh-o-binh-phuoc-post780152.vnp', 'image', 'Vùng đất đỏ Lộc Ninh – Căn cứ Tà Thiết, nơi đặt Sở Chỉ huy Chiến dịch Hồ Chí Minh lịch sử năm 1975, tỉnh Bình Phước.', 'Vùng đất lịch sử Lộc Ninh nơi tọa lạc Căn cứ Quân giải phóng miền Nam Tà Thiết',
  'today', 2022, 'Sỹ Tuyên / TTXVN', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-ta-thiet') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 674, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'dinh-doc-lap'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/dinh-doc-lap/mat-tien-dinh-doc-lap-1200.webp', 'https://commons.wikimedia.org/wiki/File:Palacio_de_la_Reunificaci%C3%B3n,_Ciudad_Ho_Chi_Minh,_Vietnam,_2013-08-14,_DD_03.JPG', 'image', 'Mặt tiền Di tích Quốc gia đặc biệt Dinh Độc Lập (Hội trường Thống Nhất), Quận 1, Thành phố Hồ Chí Minh.', 'Mặt tiền kiến trúc Dinh Độc Lập với thảm cỏ xanh và đài phun nước phía trước',
  'today', 2013, 'Diego Delso', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dinh-doc-lap') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 511, COALESCE((SELECT max(sort_order) FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dinh-doc-lap')), 0) + 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/dia-dao-cu-chi/cua-ham-dia-dao-cu-chi-1200.webp', 'https://commons.wikimedia.org/wiki/File:Cu_Chi_Tunnel_Entry_(1).jpg', 'image', 'Cửa hầm ngụy trang bí mật tại Di tích Quốc gia đặc biệt Địa đạo Củ Chi, huyện Củ Chi, Thành phố Hồ Chí Minh.', 'Miệng nắp hầm địa đạo Củ Chi được ngụy trang khéo léo bằng lá cây khô giữa rừng',
  'today', 2004, 'Thomas Schoch', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dia-dao-cu-chi') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/can-cu-trung-uong-cuc-mien-nam/duong-vao-can-cu-trung-uong-cuc-1200.webp', 'https://commons.wikimedia.org/wiki/File:Ng%C3%A3_Ba_v%C3%A0o_Trung_%C6%B0%C6%A1ng_C%E1%BB%A5c_mi%E1%BB%81n_Nam_-_panoramio.jpg', 'image', 'Đường vào Khu di tích Quốc gia đặc biệt Căn cứ Trung ương Cục miền Nam (Rừng Rùm Đuôn), huyện Tân Biên, tỉnh Tây Ninh.', 'Con đường rợp bóng cây cổ thụ dẫn vào khu di tích Căn cứ Trung ương Cục miền Nam',
  'today', 2010, 'Lam Tr Th', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'can-cu-trung-uong-cuc-mien-nam') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nga-tu-duc-hoa/cong-vien-tuong-dai-vo-van-tan-1200.webp', 'https://commons.wikimedia.org/wiki/File:CongVienVoVanTan.JPG', 'image', 'Công viên và Tượng đài đồng chí Võ Văn Tần tại Khu di tích Lịch sử Ngã tư Đức Hòa, thị trấn Đức Hòa, huyện Đức Hòa, Long An.', 'Tượng đài đồng chí Võ Văn Tần uy nghi giữa công viên tại Ngã tư Đức Hòa',
  'today', 2017, 'Myhanh ( thảo luận )', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nga-tu-duc-hoa') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 802, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/chien-thang-ap-bac-1963/tuong-dai-chien-thang-ap-bac-1200.webp', 'https://www.vietnamplus.vn/chien-thang-ap-bac-buoc-ngoat-trong-cuoc-khang-chien-chong-my-post839211.vnp', 'image', 'Cụm tượng đài Ba chiến sĩ gang thép tại Khu di tích Quốc gia đặc biệt Chiến thắng Ấp Bắc, thị xã Cai Lậy, tỉnh Tiền Giang.', 'Tượng đài ba chiến sĩ gang thép sừng sững tại di tích Chiến thắng Ấp Bắc',
  'today', 2023, 'Minh Trí / TTXVN', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-ap-bac-1963') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/mo-cu-pho-bang-nguyen-sinh-sac/lang-mo-cu-pho-bang-nguyen-sinh-sac-1200.webp', 'https://commons.wikimedia.org/wiki/File:M%E1%BB%99_Nguy%E1%BB%85n_Sinh_S%E1%BA%AFc_%E1%BB%9F_Cao_L%C3%A3nh.jpg', 'image', 'Khu lăng mộ Cụ Phó bảng Nguyễn Sinh Sắc – thân sinh Chủ tịch Hồ Chí Minh tại phường 4, thành phố Cao Lãnh, Đồng Tháp.', 'Mái vòm hình cánh sen cách điệu che chở phần mộ Cụ Phó bảng Nguyễn Sinh Sắc',
  'today', 2012, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'mo-cu-pho-bang-nguyen-sinh-sac') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/dong-khoi-ben-tre-1960/nha-truyen-thong-dong-khoi-1200.webp', 'https://commons.wikimedia.org/wiki/File:Nha_truyen_thong_Dong_Khoi.JPG', 'image', 'Nhà truyền thống Khu di tích Quốc gia đặc biệt Đồng Khởi tại xã Định Thủy, huyện Mỏ Cày Nam, tỉnh Bến Tre.', 'Nhà truyền thống Đồng Khởi Bến Tre với kiến trúc hình khối hiện đại và biểu tượng ngọn lửa thiêng',
  'today', 2011, 'Hoangvantoanajc', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'dong-khoi-ben-tre-1960') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 799, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-tuong-niem-vo-van-kiet/phu-dieu-khu-tuong-niem-vo-van-kiet-1200.webp', 'https://commons.wikimedia.org/wiki/File:Ph%C3%B9_%C4%91i%C3%AAu_V%C3%B5_V%C4%83n_Ki%E1%BB%87t.jpg', 'image', 'Bức phù điêu khắc họa chân dung và cuộc đời Cố Thủ tướng Võ Văn Kiệt tại Khu tưởng niệm ở thị trấn Vũng Liêm, Vĩnh Long.', 'Bức phù điêu nghệ thuật bằng gốm đỏ tái hiện hình ảnh Thủ tướng Võ Văn Kiệt gắn bó với nhân dân Nam Bộ',
  'today', 2021, 'Quốc Anh Võ', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-tuong-niem-vo-van-kiet') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/nha-tu-phu-quoc/trai-giam-tu-binh-phu-quoc-1200.webp', 'https://commons.wikimedia.org/wiki/File:Phu_Quoc_Prison_02.jpg', 'image', 'Khu di tích Quốc gia đặc biệt Trại giam Tù binh Chiến tranh Phú Quốc (Nhà lao Cây Dừa), thành phố Phú Quốc, Kiên Giang.', 'Các dãy nhà giam mái tôn, hàng rào thép gai và chòi canh gác tại Nhà tù Phú Quốc',
  'today', 2015, 'Frank Fox', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'nha-tu-phu-quoc') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khu-luu-niem-ton-duc-thang/nha-tuong-niem-chu-tich-ton-duc-thang-1200.webp', 'https://commons.wikimedia.org/wiki/File:Le_m%C3%A9morial_du_Pr%C3%A9sident_Ton_Duc_Thang_(%C3%AEle_du_Tigre,_Vietnam)_(6635518367).jpg', 'image', 'Đền tưởng niệm Chủ tịch Tôn Đức Thắng tại Khu lưu niệm ở Cù lao Ông Hổ, xã Mỹ Hòa Hưng, thành phố Long Xuyên, An Giang.', 'Đền tưởng niệm Chủ tịch Tôn Đức Thắng với kiến trúc đền cổ truyền thống giữa vườn cây râm mát',
  'today', 2012, 'Jean-Pierre Dalbéra from Paris, France', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khu-luu-niem-ton-duc-thang') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 800, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/chien-thang-chuong-thien-1973/tuong-dai-chien-thang-75-luot-tieu-doan-chuong-thien-1200.webp', 'https://commons.wikimedia.org/wiki/File:ChuongThien2-73.jpg', 'image', 'Tượng đài Chiến thắng 75 lượt tiểu đoàn ngụy tại Di tích Quốc gia đặc biệt Chiến thắng Chương Thiện, thành phố Vị Thanh, Hậu Giang.', 'Cụm tượng đài chiến thắng Chương Thiện vươn cao với các phù điêu tái hiện khí thế tiến công của quân dân miền Tây',
  'today', 2021, 'Huongdb', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'chien-thang-chuong-thien-1973') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 1599, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/kham-lon-can-tho/di-tich-kham-lon-can-tho-1200.webp', 'https://commons.wikimedia.org/wiki/File:Kh%C3%A1m_l%E1%BB%9Bn_C%E1%BA%A7n_Th%C6%A1.jpg', 'image', 'Di tích Lịch sử Khám Lớn Cần Thơ, nơi thực dân Pháp và chính quyền Sài Gòn giam cầm những chiến sĩ cách mạng kiên trung tại Cần Thơ.', 'Tường thành kiên cố và cổng sắt của Di tích Khám Lớn Cần Thơ',
  'today', 2012, 'Bùi Thụy Đào Nguyên', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'kham-lon-can-tho') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 900, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/khoi-nghia-hon-khoai-1940/hon-khoai-noi-khoi-nghia-nam-1940-1200.webp', 'https://commons.wikimedia.org/wiki/File:Hon_Khoai_Island.jpg', 'image', 'Đảo Hòn Khoai – Di tích Lịch sử nơi nổ ra cuộc Khởi nghĩa Hòn Khoai năm 1940 do thầy giáo Phan Ngọc Hiển lãnh đạo, huyện Ngọc Hiển, Cà Mau.', 'Đảo Hòn Khoai xanh mướt nổi bật giữa biển trời mênh mông cực Nam Tổ quốc',
  'today', 2016, 'Sgnpkd', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0', 'open_license',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'khoi-nghia-hon-khoai-1940') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 963, 1
);

INSERT INTO public.media_assets (
  location_id, file_url, source_page_url, media_type, caption, alt_text,
  era, year_taken, photographer, license, license_url, usage_basis,
  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order
) VALUES (
  (SELECT id FROM public.historical_locations WHERE slug = 'ben-vam-lung'),
  'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/ben-vam-lung/tuong-dai-ben-vam-lung-duong-ho-chi-minh-tren-bien-1200.webp', 'https://www.vietnamplus.vn/ca-mau-bao-ton-di-tich-ben-vam-lung-diem-cuoi-duong-ho-chi-minh-tren-bien-post1034895.vnp', 'image', 'Bến Vàm Lũng – Điểm cuối đường Hồ Chí Minh trên biển, Di tích Lịch sử Quốc gia đặc biệt tại xã Tân Ân, huyện Ngọc Hiển, Cà Mau.', 'Tượng đài kỷ niệm chiến công Tàu Không số tại bến Vàm Lũng giữa rừng ngập mặn Cà Mau',
  'today', 2021, 'Huỳnh Anh / TTXVN', NULL, NULL, 'coursework_reference',
  CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = 'ben-vam-lung') AND is_cover = true) THEN false ELSE true END, NULL, false, false, 1200, 675, 1
);

-- 5. Post-apply Verification: Assert each heritage site has >= 1 image and <= 1 cover
DO $verify$ DECLARE
  loc RECORD;
  cover_count int;
  media_count int;
BEGIN
  FOR loc IN SELECT id, slug FROM public.historical_locations WHERE heritage_tier IS NOT NULL LOOP
    SELECT count(*) INTO media_count FROM public.media_assets WHERE location_id = loc.id;
    IF media_count < 1 THEN
      RAISE EXCEPTION 'POST_VERIFY_FAIL: location % has no media assets', loc.slug;
    END IF;
    SELECT count(*) INTO cover_count FROM public.media_assets WHERE location_id = loc.id AND is_cover = true;
    IF cover_count != 1 THEN
      RAISE EXCEPTION 'POST_VERIFY_FAIL: location % has % covers (must be exactly 1)', loc.slug, cover_count;
    END IF;
  END LOOP;
END $verify$;

SET CONSTRAINTS ALL IMMEDIATE;
ROLLBACK;
