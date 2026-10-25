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
