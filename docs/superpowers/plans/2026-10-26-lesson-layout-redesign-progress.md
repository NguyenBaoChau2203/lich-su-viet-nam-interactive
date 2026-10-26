# Tiến độ thực hiện: Lesson Page Layout Redesign (Điện Biên Phủ & HCM 1975)

Ngày bắt đầu: 2026-10-26  
Mục tiêu: Sắp xếp lại bố cục trang chuyên đề bài học (`/bai-hoc/chien-dich-dien-bien-phu` và `/bai-hoc/chien-dich-ho-chi-minh-1975`), bảo vệ 4 bài học còn lại và các trang dùng chung. Đảm bảo nguyên tắc **Zero Content Loss** (bảo toàn 100% nội dung, media, tương tác).

---

## Danh mục vấn đề gốc (P1 - P14)

| Mã | Nội dung vấn đề | Giải pháp thiết kế | Trạng thái |
|---|---|---|---|
| P1 | Content column hẹp (~864px trên màn 1440px), lề thừa lớn, các block thụt thò không thẳng mép do `max-w-3xl` | Tăng page frame lên 1280px (`max-w-[80rem]`), content column ≥ 900px, bỏ `max-w-3xl` trên block elements | Đã giải quyết (Phase 1) |
| P2 | Khoảng cách dọc quá lớn (gap-16 khắp nơi), thiếu phân tách rõ ràng giữa các chương | `gap-20` giữa các chương, `gap-12` trong chương, thêm primitive `ChapterLabel` có vạch chỉ vàng | Đã giải quyết (Phase 1) |
| P3 | Hero stats co cụm bên trái, để trống 40% bên phải; credit ảnh bị ngắt dòng khó chịu | Chia grid 2 cột `[7fr_5fr]`, stats xếp dọc bên phải với viền phân tách mỏng, credit chuyển xuống hàng phụ | Đã giải quyết (Phase 2) |
| P4 | 10 mốc thời gian HCM để lại 2 ô trống ở hàng cuối; GoalBox 1 cột kéo dài | Timeline track ngang với dot viền trên, `balancedColumns`; GoalBox chia 2 cột khi ≥ 4 mục | Đã giải quyết (Phase 3) |
| P5 | Khoảng trống khổng lồ 400-600px dưới bản đồ 2D do map cuộn mất khi duyệt các bước | Cột trái sticky (`lg:sticky lg:top-24`), map responsive clamp, bước diễn biến gọn gàng ngày/tiêu đề | Đã giải quyết (Phase 4) |
| P6 | Khung callout cảnh báo bản đồ hẹp hơn map; toggle 2D/3D & hướng dẫn rời rạc | Hợp nhất thanh điều khiển trên 1 hàng flex; callout căng đều chiều rộng content | Đã giải quyết (Phase 4) |
| P7 | Kết quả & ý nghĩa trông như dashboard rời rạc với nhiều card hộp | Băng kết quả số liệu nguyên khối có viền; ý nghĩa 2 cột với số thứ tự `01`, `02`; quote căn giữa | Đã giải quyết (Phase 5) |
| P8 | FlipCard cố định `h-72` gây cắt chữ (như De Castries); credit/link lủng lẳng | Grid stacking fix (`grid-area: 1/1`), CSS Subgrid căn đáy thẻ và footer hoàn hảo, chiều cao thích ứng nội dung | Đã giải quyết (Phase 5) |
| P9 | Phim tư liệu video chính cao chênh lệch so với danh sách phụ gây khoảng trống lớn | Grid video cân bằng (`balancedColumns`), figcaption 3 hàng căn chân đều | Đã giải quyết (Phase 6) |
| P10 | Tabs Hiện vật / Sa bàn / Mô hình thanh cuộn ngang bị khuất nút; stage quá cao đẩy chú thích xuống xa | Split 2 pane (`[minmax(0,1fr)_20rem]`), stage cao chuẩn `min(72vh, 40rem)`, bộ chọn danh sách dọc persistent | Đã giải quyết (Phase 6) |
| P11 | Tiêu đề và lời dẫn lặp lại nhiều tầng trong phần Tư liệu | Chuẩn hóa SectionIntro, làm gọn tiêu đề con | Đã giải quyết (Phase 6) |
| P12 | Thẻ ghi nhớ flashcard cố định `h-52` có nguy cơ cắt chữ; 8 thẻ HCM bị lẻ 1 ô; nút làm trắc nghiệm rớt dòng | `balancedColumns`, min-h dynamic, nút trắc nghiệm single line (`shrink-0 whitespace-nowrap` height <= 56px) | Đã giải quyết (Phase 7) |
| P13 | Nguồn tham khảo danh sách hẹp, nút bấm trôi nổi | Bố cục 2 cột `[2fr_1fr]` với hộp điều hướng "Đi tiếp" gom nhóm bên phải | Đã giải quyết (Phase 7) |
| P14 | Sa bàn HCM mang nhãn "Sa bàn lòng chảo" và lời dẫn Điện Biên Phủ (khiếm khuyết nội dung) | Đã xác định là khiếm khuyết dữ liệu gốc; giao diện hỗ trợ trường linh hoạt, đề xuất biên tập viên cập nhật ở backlog dữ liệu | Đã giải quyết (Phase 6) |

---

## Bảng theo dõi các Phase

- [x] **Phase 0: Baseline & Safety Net**
  - Branch: `feat/lesson-layout-redesign`
  - 23 baseline screenshots: Đã lưu tại `.task-reports/lesson-layout-baseline/`
  - Inventory crawler & fixtures: 6 bài học đã tạo tại `tests/e2e/fixtures/lesson-inventory/`
  - Content parity test compare mode: Đang chạy
  - Báo cáo: `.task-reports/2026-10-26-1400-lesson-layout-phase-0.md`
- [x] **Phase 1: Frame, Spacing & Primitives**
  - `lib/lessons/layout.ts` (`balancedColumns`, `COLS`)
  - Unit tests: `tests/unit/lesson-layout.test.ts` (4 passed)
  - Layout e2e tests (L1, L2): `tests/e2e/lesson-layout.spec.ts` (12 passed)
  - Primitives: `ChapterLabel`, `SectionIntro` trong `components/lesson/sections/shared.tsx`
  - Container 1280px, grid `[13.5rem_minmax(0,1fr)]`, gap-20 trong `LessonView.tsx` & `ChapterShell.tsx`
  - Parity test verify (6/6 passed) & L1/L2 verify (100% green)
  - Báo cáo: `.task-reports/2026-10-26-1415-lesson-layout-phase-1.md`
- [x] **Phase 2: Hero Section**
  - Tái cấu trúc grid 2 cột `[minmax(0,7fr)_minmax(0,5fr)]`
  - Stats chuyển sang cột phải xếp dọc với viền phân tách mỏng
  - Credit ảnh chuyển xuống hàng riêng ở đáy cột trái
  - Chiều cao `min-h-[min(80vh,38rem)]`, CTA buttons hiển thị trọn vẹn ở 1280x720
  - Parity test verify (6/6 passed) & L3 verify (16/16 passed)
  - Báo cáo: `.task-reports/2026-10-26-1430-lesson-layout-phase-2.md`
- [x] **Phase 3: Chương 1 - Mở đầu & Mốc thời gian**
  - GoalBox: chia 2 cột khi >= 4 mục tiêu (`lg:grid-cols-2`)
  - KeyDates: thay thế thẻ bằng `.lesson-timeline` track ngang có dot 10px trên đường viền
  - `balancedColumns`: 10 mốc HCM chia 5 cột (2 hàng đều), 8 mốc DBP chia 4 cột (2 hàng đều)
  - Hỗ trợ in ấn với `break-inside: avoid` và `print-color-adjust: exact`
  - Parity test verify (6/6 passed) & L4 verify (18/18 passed)
  - Báo cáo: `.task-reports/2026-10-26-1435-lesson-layout-phase-3.md`
- [x] **Phase 4: Chương 2 - Diễn biến trên bản đồ**
  - BattleMapSection: hợp nhất thanh 2D/3D và nút "Cách dùng bản đồ" trên cùng một hàng flex
  - BattleReenactment: grid `[minmax(0,1fr)_23.75rem]`, cột trái sticky `lg:sticky lg:top-24`, chiều cao responsive `sm:h-[clamp(24rem,56vh,36rem)]`
  - Nút chọn bước tinh gọn `p-2.5`, mốc ngày tháng căn phải
  - Callout cảnh báo căng đều độ rộng cột nội dung
  - Parity test verify (6/6 passed) & L5, L6 verify (22/22 passed)
  - Regression check Bạch Đằng (`battle.spec.ts` 7/7 passed) & Bản đồ 3D (`mapfilm.spec.ts` 8/8 passed)
  - Báo cáo: `.task-reports/2026-10-26-1445-lesson-layout-phase-4.md`
- [x] **Phase 5: Chương 3 & 4 - Kết quả & Nhân vật**
  - ResultsSection: Băng số liệu thống kê đơn viền liền khối, ý nghĩa 2 cột với số `01`, `02`, trích dẫn căn giữa 2 dải viền vàng
  - FiguresSection: `balancedColumns`, chân dung 4:3, CSS Subgrid (`row-span-2 grid grid-rows-subgrid gap-2`) căn đáy thẻ 100% thẳng hàng
  - FlipCard CSS: Grid stacking `grid-area: 1/1` cho front và back, loại bỏ tràn chữ khi lật thẻ
  - Parity test verify (6/6 passed) & L7, L8 verify (26/26 passed)
  - Báo cáo: `.task-reports/2026-10-26-1455-lesson-layout-phase-5.md`
- [x] **Phase 6: Chương 5 - Tư liệu**
  - VideoEmbed & ResourceSection: Lưới video cân đối `balancedColumns(videos.length, 2, 3)`, figcaption 3 hàng căn chân đều
  - DepthPhotoGallery: Bố cục 2 cột `[minmax(0,1fr)_20rem]`, Stage cao tối đa `min(72vh, 40rem)`, bộ chọn danh sách dọc persistent với nhãn 360°, chi tiết hiện vật và credit đầy đủ
  - ScanViewer: Giới hạn chiều cao stage `min(72vh, 40rem)` đồng bộ, hỗ trợ hiển thị credit
  - ModelGallery: Bố cục 2 cột đồng bộ, bộ chọn danh sách kèm biểu tượng Box, tiêu đề, tóm tắt và phím điều hướng
  - Parity test verify (6/6 passed) & L9, L10, L11 verify (32/32 passed)
  - Báo cáo: `.task-reports/2026-10-26-1530-lesson-layout-phase-6.md`
- [x] **Phase 7: Chương 6 & 7 - Ôn tập & Nguồn tham khảo**
  - ReviewSection: Thẻ ghi nhớ `balancedColumns`, nút CTA "Làm bài trắc nghiệm" `shrink-0 whitespace-nowrap` với height <= 56px
  - SourcesSection: Bố cục 2 cột `[2fr_1fr]`, cột trái tài liệu và EditorNotes, cột phải hộp "Đi tiếp" với nút điều hướng full-width
  - Parity test verify (6/6 passed) & L12 verify (34/34 passed)
  - Báo cáo: `.task-reports/2026-10-26-1545-lesson-layout-phase-7.md`
- [x] **Phase 8: Cross-checks & Polish**
  - Kiểm tra 4 bài học còn lại không bị tràn ngang ở 1280x720 và 1440x900
  - Kiểm tra các trang dùng chung: `battle.spec.ts` (7/7 passed), `mapfilm.spec.ts` (8/8 passed), `presentation.spec.ts` (6/6 passed), `models3d.spec.ts` (4/4 passed), `photo3d.spec.ts` (7/7 passed)
  - Bổ sung test L13 (Axe accessibility dark theme ở 1440x900, 0 lỗi serious/critical)
  - Khắc phục lỗi ESLint trong `DepthPhotoGallery.tsx`
  - Toàn bộ `pnpm verify` (lint + typecheck + tests) đạt 100% GREEN
- [x] **Phase 9: Final Verification & Handoff**
  - Thu thập đầy đủ 23 ảnh chụp màn hình nghiệm thu tại `.task-reports/lesson-layout-final/`
  - Kiểm tra toàn diện bộ test hồi quy `tests/e2e/lesson-layout.spec.ts` (36/36 passed)
  - Kiểm tra parity bảo toàn dữ liệu `tests/e2e/lesson-content-parity.spec.ts` (6/6 passed)
  - Kiểm tra tính nguyên vẹn của dữ liệu: 0 file dữ liệu bị thay đổi
  - Hoàn tất tài liệu và báo cáo tổng kết `.task-reports/2026-10-26-lesson-layout-final.md`
