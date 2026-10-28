# Báo cáo thực thi khắc phục media trên cơ sở dữ liệu Live (Phase 5)

**Dự án Supabase:** `lichsu_12` / `ueolfjujjybutyuyfxha`  
**Thời gian thực thi:** 2026-10-28T17:16:08Z  
**Môi trường:** Production / Live Supabase Database & Storage  
**Mã giao dịch / Script:** `scripts/agent/apply-live-media-fix.mjs` & `release-v1-media-fix/apply.sql`

---

## 1. Tóm tắt kết quả thực thi

Toàn bộ 64 địa danh lịch sử trên cơ sở dữ liệu live đã được khắc phục hoàn chỉnh, chuyển đổi 100% sang nguồn ảnh thật đã được tải lên bucket `media` của Supabase Storage, định dạng WebP tối ưu với 3 phiên bản độ phân giải (400, 1200, 2000).

- **Số video giả mạo / unverified bị xóa:** 4 / 4 video (`W6_bO4m3F6c`, `W5i3h-h9K2Q`, `n4m17K-a128`, `W4P81Jc96zU`).
- **Số hàng media lỗi thời bị xóa:** 64 / 64 hàng (toàn bộ các URL `Special:FilePath` và URL chết từ bản release-v1 cũ).
- **Bảo tồn ảnh gốc của địa danh đã ghi danh trước đó:**
  - `pac-bo-cao-bang` (UUID: `f0d2ff65-5110-4bf2-9bda-0697801120f9`): Giữ nguyên ảnh bìa gốc `6931c617-1299-4f78-ab5f-7db9c3eb02d9` (`sort_order = 1`, `is_cover = true`). Thêm ảnh mới làm ảnh bộ sưu tập (`sort_order = 2`, `is_cover = false`).
  - `dinh-doc-lap` (UUID: `2d0c242c-29d9-4b67-9c60-8e100e42f9ae`): Giữ nguyên ảnh bìa gốc `4bb12c15-d48d-4d86-b67a-aebb20c47ba4` (`sort_order = 1`, `is_cover = true`). Thêm ảnh mới làm ảnh bộ sưu tập (`sort_order = 2`, `is_cover = false`).
- **Số hàng media thật được thêm mới:** 64 / 64 hàng.
- **Tổng số media của 64 di tích sau khi áp dụng:** 66 hàng.
- **Tổng số ảnh bìa hợp lệ:** 64 / 64 di tích có chính xác 1 ảnh bìa (`is_cover = true`).
- **Tỷ lệ ảnh lỗi trên live DB:** 0 / 64 (0%).

---

## 2. Nhật ký thực thi chi tiết (Execution Log)

```text
=== KHỞI ĐỘNG ÁP DỤNG FIX MEDIA CHO DATABASE LIVE ===

[1/5] Chạy Preflight Assertions kiểm tra trạng thái live DB...
✓ Preflight hoàn tất: 64 locations khớp, 64 obsolete media khớp, 4 fake videos khớp.

[2/5] Đang xóa 4 fake videos...
✓ Đã xóa thành công 4 fake videos.

[3/5] Đang xóa 64 obsolete media rows...
✓ Đã xóa thành công 64 obsolete media rows.

[4/5] Đang thêm 64 genuine media assets với public Supabase Storage URLs...
✓ Đã thêm thành công 64 genuine media rows.

[5/5] Kiểm tra Post-apply Verification...
Tổng số media assets của 64 di tích: 66 (kỳ vọng: 66)
✓ TẤT CẢ POST-APPLY ASSERTIONS ĐÃ ĐẠT:
  - 64/64 di tích có ít nhất 1 ảnh.
  - 64/64 di tích có chính xác 1 cover.
  - 0 fake videos còn tồn tại.
  - 0 Special:FilePath còn tồn tại.
  - pac-bo-cao-bang & dinh-doc-lap bảo tồn nguyên vẹn ảnh bìa gốc.

=== HOÀN TẤT CẬP NHẬT DATABASE LIVE THÀNH CÔNG RỰC RỠ ===
```

---

## 3. Kiểm toán tự động sau cập nhật (`heritage-media-audit.mjs --live`)

Lệnh kiểm toán toàn diện:
```bash
node scripts/content/heritage-media-audit.mjs --live
```

Kết quả:
- **Số địa danh được chấp nhận:** 64
- **Số video YouTube unverified:** 0
- **Số ảnh Wikimedia Commons trong gói:** 52
- **Tải ảnh trực tiếp & kiểm tra định dạng Sharp:** 64 OK, 0 LỖI trên tổng số 64 ảnh (100% HTTP 200, WebP hợp lệ).
- **Kiểm tra trực tiếp trên Supabase Production (REST API):**
  - Số địa danh đã xuất bản: 64
  - Số ảnh trên Live DB liên kết với di tích: 66
  - Số địa danh không có ảnh bìa: 0 / 64
  - Trạng thái kiểm toán: **PASS (Exit code 0)**.

---

## 4. Xác minh giao diện ứng dụng (E2E Playwright Verification)

Đã chạy kiểm tra headless browser bằng Chromium trên ứng dụng thực tế (`http://localhost:3000`):

1. **Trang khám phá (`/kham-pha`):**
   - Panel di tích hiển thị đầy đủ, không còn biểu tượng fallback hay lỗi ảnh.
   - Ảnh chụp lưu tại: `docs/audits/screenshots/live-repair-kham-pha-panel.png`.

2. **6 trang chi tiết mẫu đa dạng theo vùng miền:**
   - **Nhà tù Hỏa Lò** (`/dia-diem/nha-tu-hoa-lo`): Ảnh bìa tải thành công, kích thước render `1152x648`, `naturalWidth: 1152`, `complete: true`.
     - File ảnh: `docs/audits/screenshots/live-repair-detail-nha-tu-hoa-lo.png`.
   - **Đồi A1 Điện Biên Phủ** (`/dia-diem/doi-a1-dien-bien-phu`): Ảnh bìa tải thành công, kích thước render `1152x864`, `naturalWidth: 1152`, `complete: true`.
     - File ảnh: `docs/audits/screenshots/live-repair-detail-doi-a1-dien-bien-phu.png`.
   - **Cầu Hàm Rồng** (`/dia-diem/cau-ham-rong`): Ảnh bìa tải thành công, kích thước render `1152x864`, `naturalWidth: 1152`, `complete: true`.
     - File ảnh: `docs/audits/screenshots/live-repair-detail-cau-ham-rong.png`.
   - **Ngã ba Đồng Lộc** (`/dia-diem/nga-ba-dong-loc`): Ảnh bìa tải thành công, kích thước render `1152x494`, `naturalWidth: 1152`, `complete: true`.
     - File ảnh: `docs/audits/screenshots/live-repair-detail-nga-ba-dong-loc.png`.
   - **Địa đạo Củ Chi** (`/dia-diem/dia-dao-cu-chi`): Ảnh bìa tải thành công, kích thước render `1152x864`, `naturalWidth: 1152`, `complete: true`.
     - File ảnh: `docs/audits/screenshots/live-repair-detail-dia-dao-cu-chi.png`.
   - **Bến Vàm Lũng** (`/dia-diem/ben-vam-lung`): Ảnh bìa tải thành công, kích thước render `1152x648`, `naturalWidth: 1152`, `complete: true`.
     - File ảnh: `docs/audits/screenshots/live-repair-detail-ben-vam-lung.png`.

Tất cả các trang chi tiết đều hiển thị ảnh thật sắc nét, kèm thông tin tác giả, giấy phép bản quyền rõ ràng, không xuất hiện bất kỳ placeholder hay fallback nào.
