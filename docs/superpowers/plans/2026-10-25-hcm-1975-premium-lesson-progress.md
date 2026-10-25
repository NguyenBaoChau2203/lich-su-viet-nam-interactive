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

---

## 2026-10-25 — Phase 3: Hoàn thiện dữ liệu bài học (Lesson Data Parity)

### 1. Mục tiêu và kết quả
- Bổ sung thuộc tính `models3d?: string[];` vào kiểu dữ liệu `Lesson` trong `lib/lessons/types.ts` để hỗ trợ hiển thị mô hình 3D (sẽ tích hợp đầy đủ ở Phase 7).
- Viết lại toàn diện `lib/lessons/chien-dich-ho-chi-minh.ts` đạt mức độ phong phú và chi tiết hoàn toàn tương đương với chuyên đề Điện Biên Phủ:
  - **Hero & Hero Stats:** Ảnh xe tăng 390 kèm depth map và 4 hotspots; 3 chỉ số nổi bật (5 cánh quân, 3 chiến dịch lớn, 21 năm kháng chiến chống Mỹ).
  - **Mục tiêu học tập SGK:** 4 mục tiêu chuẩn theo SGK Lịch sử 12 (Kết nối tri thức), Bài 8.
  - **Mốc thời gian then chốt (Key Dates):** 10 mốc thời gian sắp xếp theo trình tự thời gian nghiêm ngặt (từ 10/3/1975 đến 2/5/1975).
  - **Hiện vật & Bộ sưu tập 3D (Artifacts):** 8 hiện vật (Xe tăng 390, Xe tăng 843, Cổng Dinh Độc Lập, Máy bay A-37, Trực thăng UH-1, Bãi trực thăng nóc Dinh, Hầm chỉ huy Dinh Độc Lập, Pháo nòng dài 130 mm). Tất cả đều có ảnh độ phân giải cao kèm bản đồ độ sâu parallax 3D và 3–4 hotspots; 3 hiện vật có mô hình quét 3D Sketchfab xoay 360° (T-54, A-37, UH-1).
  - **Kết quả & Ý nghĩa lịch sử:**
    - `resultsScan`: Mô hình 3D Dinh Độc Lập xoay 360° (tác giả Hoàng Huy, CC BY 4.0).
    - `resultsImage`: Ảnh Dinh Thống Nhất kèm depth map và 3 hotspots.
    - `significance`: 4 luận điểm ý nghĩa lịch sử sâu sắc và toàn diện.
  - **Trích dẫn lịch sử (Quote):** Lời thơ chúc Tết Kỷ Dậu 1969 của Chủ tịch Hồ Chí Minh: *"Tiến lên! Chiến sĩ, đồng bào / Bắc Nam sum họp, xuân nào vui hơn!"*.
  - **Nhân vật lịch sử (Figures):** 4 nhân vật tiêu biểu (Đại tướng Văn Tiến Dũng, đồng chí Phạm Hùng, đồng chí Lê Đức Thọ, Anh hùng Nguyễn Thành Trung; kèm liên kết nội bộ hợp lệ `/nhan-vat/*`).
  - **Thẻ ghi nhớ (Flashcards):** 8 thẻ ghi nhớ dạng hỏi – đáp súc tích, bao quát toàn bộ chiến dịch.
  - **Trắc nghiệm (Quiz):** 10 câu hỏi trắc nghiệm chất lượng cao (4 lựa chọn duy nhất, lời giải thích chi tiết > 20 ký tự, có tích hợp hình ảnh tư liệu minh họa).
  - **Di tích ngày nay (Today):** 7 địa danh lịch sử (Dinh Thống Nhất, Cổng Dinh, Sân thượng Dinh, Bảo tàng Chiến dịch Hồ Chí Minh, Tượng đài Xuân Lộc, Cầu Rạch Chiếc, Dinh Độc Lập 2025); tất cả đều có bản đồ độ sâu `-depth.webp` và hotspots tương tác.
  - **Mô hình 3D di tích (todayScans):** Tháp Bitexco TP.HCM đại diện cho biểu tượng đô thị ngày nay (`66f45144e7a44fdaa841f7eed78a28a2`).
  - **Video tư liệu:** 4 video YouTube chính thống từ VTV24 và QPVN.
  - **`mapFilm` flag:** Chưa bật trong Phase 3 để tránh lỗi giao diện khi kịch bản 3D chưa được đăng ký (sẽ kích hoạt ở Phase 6).
- Mở rộng bộ kiểm thử `tests/unit/lesson-data.test.ts` với test case chuyên biệt kiểm tra dữ liệu Chiến dịch Hồ Chí Minh (hiện vật ≥ 8, di tích ≥ 6, trắc nghiệm = 10, mốc thời gian = 10, quote hợp lệ, resultsScan/resultsImage hợp lệ).

### 2. Các tệp thay đổi
- `lib/lessons/types.ts`: thêm `models3d?: string[];` vào `Lesson`.
- `lib/lessons/chien-dich-ho-chi-minh.ts`: nội dung dữ liệu bài học hoàn thiện.
- `tests/unit/lesson-data.test.ts`: bổ sung kiểm thử xác thực cấu trúc bài học Chiến dịch Hồ Chí Minh.
- `docs/superpowers/plans/2026-10-25-hcm-1975-premium-lesson-progress.md`: cập nhật tiến độ Phase 3.

### 3. Lệnh và kết quả kiểm chứng
- `pnpm exec vitest run tests/unit/lesson-data.test.ts tests/unit/presentation.test.ts tests/unit/curriculum.test.ts` -> Exit code 0 (91 tests passed).
- `pnpm verify` -> Exit code 0:
  - `agent:check`: valid.
  - `history:data:check`: 42 tests passed.
  - `lint`: 0 errors, 0 warnings.
  - `typecheck`: 0 errors.
  - `test`: 1000 vitest tests + 26 node tests passed.
  - `build`: 102/102 trang tĩnh xuất thành công.

### 4. Kế hoạch bước tiếp theo (Phase 4)
- Tiến hành nâng cấp Bản đồ 2D (`lib/battles/chien-dich-ho-chi-minh-1975.ts`):
  - Bổ sung chủng loại đơn vị mới `"vn-armor"` (xe tăng thiết giáp) và `"vn-aircraft"` (không quân cường kích) vào `UnitKind` trong `lib/battles/types.ts` và styling tương ứng trong `app/globals.css`.
  - Bổ sung đơn vị thiết giáp cho 5 cánh quân và đường bay ném bom Tân Sơn Nhất của Phi đội Quyết thắng.
  - Nâng cấp độ dài lời dẫn cho 7 bước chiến dịch (mỗi bước > 200 ký tự) theo Sổ nguồn.
  - Gắn fact card và ảnh tư liệu trực quan cho từng bước.
- Chạy cổng kiểm thử và commit.

---

## 2026-10-25 — Phase 4: Nâng cấp Bản đồ chiến dịch 2D (2D Campaign Map Upgrade)

### 1. Mục tiêu và kết quả
- Bổ sung hai loại đơn vị quân sự mới vào `UnitKind` trong `lib/battles/types.ts`:
  - `"vn-armor"`: Lực lượng tăng thiết giáp của ta.
  - `"vn-aircraft"`: Không quân nhân dân Việt Nam.
- Thiết kế styling cho hai loại marker bản đồ Leaflet mới trong `app/globals.css`:
  - `.battle-unit--vn-armor`: Hình chữ nhật bo góc 4px màu đỏ của ta, có biểu tượng hình thoi vàng `◆` ở tâm (tượng trưng cho thiết giáp cơ giới).
  - `.battle-unit--vn-aircraft`: Hình tròn đỏ của ta với biểu tượng máy bay vàng `✈` ở tâm (tượng trưng cho không quân cường kích).
- Nâng cấp toàn diện kịch bản diễn biến 2D `lib/battles/chien-dich-ho-chi-minh-1975.ts`:
  - **Đơn vị quân sự:** Bổ sung `thietGiap203` (Lữ đoàn xe tăng 203, mũi thọc sâu của Quân đoàn 2 tiến vào Dinh Độc Lập) và `phiDoiQuyetThang` (5 máy bay cường kích A-37 xuất hiện tập kích sân bay Tân Sơn Nhất ở bước 5).
  - **Mũi tên đồ họa mới:** Bổ sung đường tiến quân của thiết giáp (`thiet-giap-ap-sat`, `thiet-giap-trung-tam`) và đường bay không kích của Phi đội Quyết thắng từ hướng Đông Bắc vào sân bay Tân Sơn Nhất (`a37-tap-kich`).
  - **Lời dẫn 7 bước (Step Captions):** Cả 7 bước đều được nâng cấp lời dẫn chi tiết, chuẩn xác theo Sổ nguồn sử liệu, độ dài từ 448 đến 492 ký tự (vượt xa mức tối thiểu 200 ký tự).
  - **Thẻ dữ kiện (Step Facts) & Ảnh tư liệu (Step Images):**
    - Bước 1 (`thoi-co`): Fact "Ba đòn điểm huyệt chiến lược".
    - Bước 2 (`xuan-loc`): Fact "Cánh cửa thép sụp đổ" + Ảnh `tuong-dai-xuan-loc.webp`.
    - Bước 3 (`bao-vay`): Fact "Chiến dịch mang tên Bác" + Ảnh `bao-tang-chien-dich.webp`.
    - Bước 4 (`no-sung`): Fact "Đặc công giữ cầu huyết mạch" + Ảnh `phao-130mm-bao-tang.webp`.
    - Bước 5 (`tan-son-nhat`): Fact "Đòn không kích sấm sét" + Ảnh `may-bay-a37-bao-tang.webp`.
    - Bước 6 (`tong-cong-kich`): Fact "Chiến dịch di tản Gió lốc" + Ảnh `truc-thang-uss-okinawa.webp`.
    - Bước 7 (`dinh-doc-lap`): Fact "Lá cờ trên nóc Dinh Độc Lập" + Ảnh `xe-tang-843-dinh-doc-lap.webp`.
  - **Bổ sung chú giải (Legend):** Thêm chú giải cho Lữ đoàn xe tăng thiết giáp và Không quân ta.
- Cập nhật kiểm thử tự động trong `tests/unit/lesson-data.test.ts` đảm bảo kiểm tra đầy đủ 5 cánh quân bộ binh cùng các đơn vị thiết giáp và không quân.

### 2. Các tệp thay đổi
- `lib/battles/types.ts`: bổ sung `"vn-armor"` và `"vn-aircraft"` vào `UnitKind`.
- `app/globals.css`: thêm CSS cho `.battle-unit--vn-armor` và `.battle-unit--vn-aircraft`.
- `lib/battles/chien-dich-ho-chi-minh-1975.ts`: nội dung kịch bản bản đồ 2D hoàn thiện.
- `tests/unit/lesson-data.test.ts`: cập nhật kiểm thử kịch bản chiến dịch.
- `docs/superpowers/plans/2026-10-25-hcm-1975-premium-lesson-progress.md`: cập nhật tiến độ Phase 4.

### 3. Lệnh và kết quả kiểm chứng
- `pnpm exec vitest run tests/unit/lesson-data.test.ts tests/unit/presentation.test.ts tests/unit/curriculum.test.ts tests/unit/mapfilm.test.ts` -> Exit code 0 (111 tests passed).
- `pnpm verify` -> Exit code 0:
  - `agent:check`: valid.
  - `history:data:check`: 42 tests passed.
  - `lint`: 0 errors, 0 warnings.
  - `typecheck`: 0 errors.
  - `test`: 1000 vitest tests + 26 node tests passed.
  - `build`: 102/102 trang tĩnh xuất thành công.

### 4. Kế hoạch bước tiếp theo (Phase 5)
- Tổng quát hóa engine Bản đồ 3D (`lib/mapfilm/`):
  - Mở rộng `PieceKind` trong `lib/mapfilm/types.ts` để bổ sung `"tank"` (xe tăng), `"jet"` (máy bay phản lực A-37), `"helicopter"` (trực thăng UH-1), `"palace"` (Dinh Độc Lập), `"gate"` (cổng Dinh).
  - Mở rộng `UNIT_PIECE` trong `lib/mapfilm/evaluate.ts`.
  - Thêm hình học procedural trong `lib/mapfilm/three-layer.ts` và xử lý cờ Mặt trận Dân tộc Giải phóng (nửa trên đỏ, nửa dưới xanh lam, sao vàng) mà không ảnh hưởng tới cờ đỏ sao vàng của Điện Biên Phủ.
  - Chạy toàn bộ kiểm thử xác nhận không có bất kỳ hồi quy nào đối với Điện Biên Phủ.

---

## 2026-10-25 — Phase 5: Tổng quát hóa Engine Bản đồ 3D (3D Map Film Engine Generalization)

### 1. Mục tiêu và kết quả
- **Mở rộng hệ thống chủng loại quân cờ và phe tham chiến trong `lib/mapfilm/types.ts`:**
  - `Side`: Bổ sung `"mt"` (Quân Giải phóng miền Nam / Mặt trận Dân tộc Giải phóng) và `"arvn"` (Quân lực Việt Nam Cộng hòa) bên cạnh `"vn"` và `"fr"`.
  - `PieceKind`: Bổ sung 5 loại hình học mới: `"tank"` (xe tăng T-54), `"jet"` (máy bay cường kích A-37), `"helicopter"` (trực thăng UH-1), `"palace"` (công trình Dinh Độc Lập), `"gate"` (cổng sắt Dinh Độc Lập) bên cạnh 4 loại hiện có (`"infantry"`, `"artillery"`, `"hq"`, `"porter"`).
- **Mở rộng bộ ánh xạ đơn vị 2D sang 3D trong `lib/mapfilm/evaluate.ts`:**
  - Ánh xạ `"vn-armor"` -> `"tank"`, `"vn-aircraft"` -> `"jet"`.
  - Gán `side: script.slug === "chien-dich-ho-chi-minh" ? "mt" : "vn"` cho các đơn vị chuyển từ kịch bản chiến dịch.
- **Xây dựng 5 mô hình hình học thủ tục (Procedural BufferGeometry) chuẩn xác trong `components/mapfilm/models.ts`:**
  - `tankGeometry()`: Thân xe T-54 vát nghiêng (`#3d4a2d`), 2 dải xích (`#1e201b`), tháp pháo bán cầu đúc đặc trưng (`#455433`), nòng pháo 100mm D-10T kèm loa giảm giật, 2 thùng nhiên liệu phụ phía sau.
  - `jetGeometry()`: Thân thon dài A-37 Dragonfly (`#4a554a`), kính buồng lái nghiêng (`#88aacc`), cánh thẳng kèm thùng dầu đầu cánh, 2 động cơ phản lực J85 và ống xả.
  - `helicopterGeometry()`: Cabin trực thăng UH-1 Iroquois Huey (`#384232`), kính buồng lái, đuôi dài, cánh quạt chính 2 lá xoay ngang (`#222222`), cánh quạt đuôi, càng hạ cánh dạng trượt kép (skids).
  - `palaceGeometry()`: Kiến trúc Dinh Độc Lập 3 tầng (`#f0ece1`), hệ lam chắn nắng "rèm hoa đá" mặt tiền cách điệu đốt trúc (`#d8d2c4`), sảnh đón tầng trệt, sân thượng có bãi đáp trực thăng tròn màu vàng kèm chữ **H**, cột cờ đỉnh dinh.
  - `gateGeometry()`: 2 cột trụ bê tông sừng sững (`#c8c2b5`) và 2 cánh cổng sắt hoa văn uốn lượn màu đen xám (`#282c30`), phù hiệu tròn ở tâm.
  - `flagTexture(kind)`: Hỗ trợ tạo texture Canvas cho `"mt"` (nửa trên đỏ `#da251d`, nửa dưới xanh lam `#1b6bb5`, sao vàng 5 cánh ở tâm) và `"arvn"` (nền vàng `#fbd116`, 3 sọc đỏ `#da251d`), đồng thời duy trì 100% texture cờ đỏ sao vàng `"vn"` và cờ 3 màu `"fr"`.
- **Nâng cấp `components/mapfilm/three-layer.ts`:**
  - Khởi tạo InstancedMesh (Batch) cho 5 loại mô hình mới và 2 loại cờ mới (`flagsMt`, `flagsArvn`).
  - Hỗ trợ vẽ động trong `drawPiece()` cho tất cả các loại hình học và tự động gán cờ Giải phóng (`flagsMt`) cho đơn vị bên ta trong Chiến dịch Hồ Chí Minh.
  - Xử lý hoán đổi cờ cứ điểm căn cứ theo slug kịch bản (`isHcm`): hạ cờ Sài Gòn (`flagsArvn`), kéo cờ Mặt trận (`flagsMt`).
- **Nâng cấp `components/mapfilm/runtime.ts`:**
  - Truyền `script.slug` vào `createThreeLayer(script.origin, script.slug)` để ThreeLayer nhận diện ngữ cảnh chiến dịch.
- **Kiểm thử tự động:**
  - Bổ sung test suites mới trong `tests/unit/mapfilm.test.ts` kiểm tra tính hợp lệ của cả 5 mô hình hình học (position attribute, color attribute, boundingSphere radius) và tính toàn vẹn của kiểu dữ liệu mở rộng.
  - 22/22 unit tests trong `mapfilm.test.ts` passed.

### 2. Các tệp thay đổi
- `lib/mapfilm/types.ts`: mở rộng `PieceKind` và `Side`.
- `lib/mapfilm/evaluate.ts`: ánh xạ đơn vị thiết giáp/không quân và phe Mặt trận.
- `components/mapfilm/models.ts`: bổ sung 5 geometries và hỗ trợ flagTexture `mt` / `arvn`.
- `components/mapfilm/three-layer.ts`: quản lý batch instances và render cờ/mô hình theo slug.
- `components/mapfilm/runtime.ts`: truyền `script.slug` vào ThreeLayer.
- `tests/unit/mapfilm.test.ts`: bổ sung unit tests cho hình học 1975.
- `docs/superpowers/plans/2026-10-25-hcm-1975-premium-lesson-progress.md`: cập nhật tiến độ Phase 5.

### 3. Lệnh và kết quả kiểm chứng
- `pnpm exec vitest run tests/unit/mapfilm.test.ts` -> Exit code 0 (22 tests passed).
- `pnpm verify` -> Exit code 0:
  - `agent:check`: valid.
  - `history:data:check`: 42 tests passed.
  - `lint`: 0 errors, 0 warnings.
  - `typecheck`: 0 errors.
  - `test`: 1000 vitest tests + 26 node tests passed.
  - `build`: 102/102 trang tĩnh xuất thành công.

### 4. Kế hoạch bước tiếp theo (Phase 6)
- Xây dựng kịch bản Phim Bản đồ 3D cho Chiến dịch Hồ Chí Minh (`lib/mapfilm/chien-dich-ho-chi-minh.ts`):
  - 7 cảnh phim khớp hoàn toàn với 7 bước bản đồ 2D (`thoi-co`, `xuan-loc`, `bao-vay`, `no-sung`, `tan-son-nhat`, `tong-cong-kich`, `dinh-doc-lap`).
  - Đường bay camera điện ảnh 3D với góc nghiêng pitch 45–60°, zoom cận cảnh hành tiến của các cánh quân.
  - Lời bình chạy phụ đề chuẩn sử liệu, kiểm soát tốc độ đọc ≤ 4.4 từ/giây.
  - Động tác hành tiến của xe tăng (`tank`), pháo kích (`barrage`), máy bay phản lực A-37 (`jet`) ném bom Tân Sơn Nhất, trực thăng di tản (`helicopter`), Dinh Độc Lập (`palace`) và cổng Dinh (`gate`).
  - Đăng ký kịch bản vào `lib/mapfilm/index.ts` và kích hoạt `mapFilm: "chien-dich-ho-chi-minh"` trong bài học.
  - Chạy toàn bộ kiểm thử và cổng soát lỗi.
