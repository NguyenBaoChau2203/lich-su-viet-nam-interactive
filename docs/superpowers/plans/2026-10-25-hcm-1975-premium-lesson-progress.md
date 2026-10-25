# Tiến độ nâng cấp chuyên đề tương tác: Chiến dịch Hồ Chí Minh (1975)

Kế hoạch gốc: Implementation plan `Premium interactive lesson: Chiến dịch Hồ Chí Minh (26 – 30/4/1975)`.
Nhánh git: `feat/hcm-1975-premium-lesson`
Ngày bắt đầu: 2026-10-25
Thiết bị / Môi trường: Windows 11, Node v24.19.0, pnpm v11.7.0.

---

## 2026-10-25 — Phase 0: Thiết lập và kiểm tra baseline

### 1. Mục tiêu và kết quả
- Tạo và chuyển sang nhánh `feat/hcm-1975-premium-lesson`.
- Kiểm tra môi trường: Node 24.19.0, pnpm 11.7.0.
- Khảo sát các kỹ năng 3D: Đã quét `.agents/skills/`, `.claude/skills/`, `~/.gemini/antigravity/builtin/skills`. Không có kỹ năng 3D nào khác ngoài quy định; tài liệu kỹ thuật sẽ căn cứ chuẩn theo Mục 4 "3D quality playbook" trong kế hoạch.
- Xử lý tương thích đường dẫn Windows trong `scripts/agent/setup.mjs` (chuẩn hóa `realpathSync.native` cho trường hợp đường dẫn ngắn 8.3 `PHUTRO~1` vs tên đầy đủ `Phú Trọng` trên Windows).
- Bổ sung `/.media-work/` và `/.depth-tool/` vào `.gitignore`.
- Chạy toàn bộ cổng chất lượng `pnpm verify`:
  - `pnpm agent:check`: 5 project skills hợp lệ.
  - `pnpm history:data:check`: 42 tests passed.
  - `pnpm lint`: clean (0 errors, 0 warnings).
  - `pnpm typecheck`: route types + TypeScript strict clean.
  - `pnpm test`: 78 test files / 1000 vitest tests passed; 6 test suites / 26 node tests passed.
  - `pnpm build`: 102/102 trang tĩnh xuất thành công.
- Khởi động server production trên cổng 3000 và chụp 15 ảnh chụp màn hình baseline đối sánh ở độ phân giải 1440×900:
  - `/bai-hoc/chien-dich-dien-bien-phu` (hero và 6 chương: diễn biến, kết quả, nhân vật, tư liệu, ôn tập, nguồn).
  - `/bai-hoc/chien-dich-ho-chi-minh-1975` (hero và 6 chương hiện thời).
  - `/ban-do-3d/dien-bien-phu` (cảnh 2 và cảnh 5).
  - `/mo-hinh-3d/luu-phao-105` (mô hình 3D mẫu).
  - Tất cả lưu trong `.task-reports/hcm1975-baseline/`.
- Tạo thư mục tải tài nguyên tạm `.media-work/` (đã được Git ignore).

### 2. Các tệp thay đổi
- `scripts/agent/setup.mjs`: chuẩn hóa đường dẫn gốc bằng `realpathSync.native` trên Windows.
- `.gitignore`: thêm `.media-work/` và `.depth-tool/`.
- `docs/superpowers/plans/2026-10-25-hcm-1975-premium-lesson-progress.md`: tệp theo dõi tiến độ kế hoạch.

### 3. Lệnh và kết quả kiểm chứng
- `pnpm agent:check` -> Exit code 0
- `pnpm history:data:check` -> Exit code 0 (42 passed)
- `pnpm lint` -> Exit code 0
- `pnpm typecheck` -> Exit code 0
- `pnpm test` -> Exit code 0 (1000 vitest tests + 26 node tests passed)
- `pnpm build` -> Exit code 0 (102/102 pages)
- `pnpm verify` -> Exit code 0

### 4. Vấn đề tồn đọng / Ghi chú
- `lib/supabase/proxy.ts` có sẵn sửa đổi fallback cục bộ khi thiếu biến môi trường Supabase URL/KEY để ứng dụng công khai không bị sập. Giữ nguyên thay đổi này.

### 5. Kế hoạch bước tiếp theo (Phase 1)
- Thực hiện khảo sát tư liệu lịch sử và lập Sổ nguồn (Source Ledger) tại `docs/audits/2026-10-25-hcm-1975-lesson-sources.md`.
- Xác minh toàn bộ 23 dữ kiện (F1–F23) và tọa độ.
- Tìm kiếm và kiểm tra giấy phép ảnh Wikimedia Commons, mô hình quét 3D Sketchfab (oEmbed), video YouTube chính thống.
- Dự thảo toàn bộ nội dung tiếng Việt mới.
- Dừng ở cuối Phase 1 để người dùng duyệt nguồn trước khi tải ảnh/tạo bản đồ độ sâu ở Phase 2.


---

## 2026-10-25 — Phase 1: Khảo sát sử liệu và lập Sổ nguồn (Source Ledger)

### 1. Mục tiêu và kết quả
- Hoàn thành Sổ nguồn chi tiết tại `docs/audits/2026-10-25-hcm-1975-lesson-sources.md`.
- Xác minh độc lập 23/23 dữ kiện lịch sử (F1 – F23) qua ít nhất 2 nguồn chính thống (SGK Lịch sử 12 Kết nối tri thức, Hồi ký *Đại thắng mùa Xuân*, Bảo tàng Lịch sử Quốc gia, Bảo tàng Lịch sử Quân sự Việt Nam, Bảo tàng Chiến dịch Hồ Chí Minh, Di tích Dinh Độc Lập, các quyết định Bảo vật Quốc gia của Thủ tướng).
- Thẩm định 15 tọa độ địa lý chiến dịch trên OpenStreetMap (Dinh Độc Lập, Tân Sơn Nhất, Bộ Tổng tham mưu, Biên Hòa, Đồng Dù, Xuân Lộc, cầu Rạch Chiếc, cầu Sài Gòn, Đài phát thanh Sài Gòn, sân bay Thành Sơn, Vũng Tàu, Châu Đốc...).
- Khảo sát và thẩm tra 14 tệp hình ảnh tư liệu trên Wikimedia Commons: đảm bảo giấy phép tự do (Public Domain, CC0, CC BY 4.0, CC BY 2.0, CC BY-SA 3.0), không dùng ảnh báo chí 1975 chưa đủ 75 năm bảo hộ; loại trừ ảnh di tản đại sứ quán khỏi vị trí Hero.
- Tìm kiếm và xác thực qua Sketchfab oEmbed API 4 mô hình 3D xoay 360° có giấy phép CC BY 4.0:
  - Dinh Độc Lập (`2c4905c6a1fd4fb18981886a77ba4fa9` - tác giả Hoàng Huy)
  - Xe tăng T-54 (`6bde9f748c3e472e878d333998b506f9` - tác giả SGAstudio)
  - Trực thăng UH-1 Huey (`29ae1fb161a04128b006089b95ab1017` - tác giả bunnellrl1)
  - Cường kích A-37 Dragonfly (`181dcd131e4342e89df5bafaf96be1b1` - tác giả manilov.ap)
- Xác thực 4 video tư liệu YouTube chính thống qua oEmbed:
  - `TnQYFiXX1Zg`: "Chiến dịch Hồ Chí Minh trong 4 phút" (VTV24)
  - `bPwhnZWX-5k`: "51 năm Ngày Giải phóng miền Nam, thống nhất đất nước" (VTV24)
  - `gzFbBjCbGMY`: "Chiến dịch Hồ Chí Minh bắt đầu" (VTV24)
  - `FM1rvymqyow`: "Đại Thắng Mùa Xuân 1975: Hành Trình Tiến Về Sài Gòn Giải Phóng Miền Nam" (QPVN Digital)
- Dự thảo đầy đủ toàn bộ nội dung tiếng Việt mới: 4 mục tiêu bài học SGK, 10 mốc thời gian, lời dẫn 7 bước bản đồ 2D (> 200 ký tự), 8 hiện vật (kèm 2-4 hotspots), 6 địa danh ngày nay, 4 luận điểm ý nghĩa, thơ chúc Tết Bác Hồ 1969, 4 nhân vật lịch sử, 8 thẻ ghi nhớ, 10 câu trắc nghiệm chất lượng cao, kịch bản phụ đề và phân cảnh 7 cảnh bản đồ 3D (tốc độ đọc ≤ 4.4 từ/giây).

### 2. Các tệp thay đổi
- `docs/audits/2026-10-25-hcm-1975-lesson-sources.md`: Sổ nguồn sử liệu và hồ sơ thẩm tra tư liệu.
- `docs/superpowers/plans/2026-10-25-hcm-1975-premium-lesson-progress.md`: cập nhật tiến độ Phase 1.

### 3. Lệnh và kết quả kiểm chứng
- `pnpm history:data:check` -> Exit code 0 (42 passed)
- `pnpm agent:check` -> Exit code 0
- `pnpm lint` -> Exit code 0
- `pnpm typecheck` -> Exit code 0

### 4. Kế hoạch bước tiếp theo (Phase 2)
- Chuyển giao Sổ nguồn cho chủ dự án rà soát.
- Khi chủ dự án duyệt, bắt đầu Phase 2: Tải các hình ảnh đã thẩm tra vào `.media-work/`, chạy quy trình tối ưu sharp xuất sang `public/lessons/chien-dich-ho-chi-minh/*.webp` (≤ 250 KB), tạo depth maps qua `@huggingface/transformers` (≤ 60 KB), xác định tọa độ hotspots chính xác.


---

## 2026-10-25 — Phase 2: Pipeline Media (Tải ảnh, Nén chuẩn & Bản đồ độ sâu Depth Maps)

### 1. Mục tiêu và kết quả
- Tải 7 ảnh tư liệu mới từ Wikimedia Commons theo Sổ nguồn Phase 1:
  - `cong-dinh-doc-lap.webp`: 1400×788, 234.5 KB (CC BY-SA 2.0)
  - `san-thuong-dinh-doc-lap.webp`: 771×581, 196.2 KB (CC BY-SA 2.0)
  - `ham-chi-huy-dinh-doc-lap.webp`: 1400×788, 119.8 KB (CC BY 2.0)
  - `t54-bao-tang-ha-noi.webp`: 1400×792, 71.6 KB (CC0 1.0)
  - `truc-thang-uh1-bao-tang.webp`: 1400×1053, 240.5 KB (CC BY-SA 2.0)
  - `phao-130mm-bao-tang.webp`: 1400×796, 226.9 KB (CC BY-SA 3.0)
  - `cau-rach-chiec.webp`: 1400×786, 65.6 KB (CC BY 3.0)
- Toàn bộ 15 ảnh tư liệu trong `public/lessons/chien-dich-ho-chi-minh/` đều nằm trong ngân sách ≤ 245 KB (giới hạn tối đa 250 KB).
- Tạo thành công 15 bản đồ độ sâu `-depth.webp` (512 px) bằng mô hình Depth Anything V2 Small qua `@huggingface/transformers` (sử dụng sharp native để xử lý chuẩn color space trên Windows):
  - Kích thước mọi tệp `-depth.webp` đều dao động từ 1.3 KB đến 4.9 KB (đạt chuẩn ≤ 60 KB của unit test).
  - Tỉ lệ khung hình của bản đồ độ sâu hoàn toàn khớp với ảnh gốc.
- Đã chuẩn bị sẵn tọa độ phần trăm (3–97%) và nội dung chú thích (hotspots) cho từng ảnh, sẵn sàng nạp vào dữ liệu bài học ở Phase 3.

### 2. Các tệp thay đổi
- Thêm 7 ảnh `.webp` mới vào `public/lessons/chien-dich-ho-chi-minh/`.
- Thêm 15 tệp bản đồ độ sâu `-depth.webp` vào `public/lessons/chien-dich-ho-chi-minh/`.
- Cập nhật tiến độ: `docs/superpowers/plans/2026-10-25-hcm-1975-premium-lesson-progress.md`.

### 3. Lệnh và kết quả kiểm chứng
- `pnpm verify` -> Exit code 0 (agent:check, history:data:check, lint, typecheck, 1000 vitest + 26 node tests passed, next build 102/102 pages passed).

### 4. Kế hoạch bước tiếp theo (Phase 3)
- Cập nhật toàn diện `lib/lessons/chien-dich-ho-chi-minh.ts` để đạt cấu trúc ngang hàng (parity) với chuyên đề Điện Biên Phủ:
  - Bổ sung `artifacts` (8 hiện vật kèm depthSrc, hotspots, scan 360°).
  - Bổ sung `today` (6 địa danh kèm depthSrc và hotspots).
  - Bổ sung `todayScans`, `resultsScan` (Dinh Độc Lập), `resultsImage`.
  - Bổ sung `quote` (thơ chúc Tết Bác Hồ năm 1969).
  - Bổ sung 4 mục tiêu bài học, 10 mốc thời gian, 8 flashcards, 10 câu trắc nghiệm.
  - Mở rộng unit test `tests/unit/lesson-data.test.ts` kiểm soát nghiêm ngặt bài học Hồ Chí Minh.
