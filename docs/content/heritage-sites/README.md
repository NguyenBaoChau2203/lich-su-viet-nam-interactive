# Hướng dẫn biên soạn và quản lý Địa danh lịch sử theo địa phương (HS-1.0)

Tài liệu này hướng dẫn cách bổ sung, cập nhật và thẩm định nội dung cho chuyên mục **“Địa danh lịch sử theo địa phương”** (`Featured historical places by locality`), liên kết trực tiếp với chương trình Lịch sử 12.

---

## 1. Khung địa phương tham chiếu (VN-34-2025)

Hệ thống sử dụng danh mục chuẩn gồm **34 đơn vị hành chính cấp tỉnh/thành phố** theo Nghị quyết số 202/2025/QH15 của Quốc hội:
- Mỗi địa phương có mã 2 chữ số (từ `"01"` Hà Nội đến `"96"` Cà Mau).
- Mỗi địa phương **bắt buộc** phải có đúng 1 địa danh cốt lõi Lớp 12 (`tier: "grade12"`, `rank: 1`).
- Mỗi địa phương có thể có thêm địa danh mở rộng (`tier: "extended"`, `rank: 2`).

---

## 2. Cấu trúc gói dữ liệu (`supabase/content/heritage-sites/v1/`)

```
supabase/content/heritage-sites/v1/
  manifest.json    # Phiên bản schema, framework, thời gian tạo, mã băm sha256 từng file
  localities.json  # Danh sách 34 địa phương tham chiếu
  sites.json       # Danh sách 64 địa danh lịch sử chi tiết
  sources.json     # 66 nguồn tài liệu chính thức đã được chuẩn hóa
  roster.md        # Bảng danh mục địa danh theo địa phương để tra cứu nhanh
  ledger.md        # Bảng kê khai chi tiết các luận điểm, ảnh và video
```

---

## 3. Quy chuẩn nội dung cho mỗi địa danh

### 3.1 Cấu trúc câu chuyện (3–5 phần)
Mỗi địa danh cần từ 3 đến 5 phần câu chuyện ngắn gọn, chuẩn xác theo bộ tiêu đề khuyến nghị:
1. **“Bối cảnh”**: Lý do địa danh này trở thành tâm điểm trong giai đoạn lịch sử.
2. **“Chuyện ở nơi này”**: Diễn biến sự kiện then chốt, nhân vật, thời gian gắn liền với Lớp 12.
3. **“Ý nghĩa”**: Tầm vóc lịch sử, giá trị bài học.
4. **“Di tích ngày nay”**: Hiện trạng khu di tích, xếp hạng (Di tích quốc gia đặc biệt, Di tích quốc gia), quyết định công nhận và ban quản lý.
5. *(Tùy chọn)* **“Em có biết?”**: Chi tiết tư liệu thú vị, có kiểm chứng.

### 3.2 Quy định trích dẫn nguồn
- **Mỗi phần câu chuyện bắt buộc phải có ít nhất 1 nguồn tham khảo.**
- Mọi con số, ngày tháng, số liệu thương vong, số quyết định xếp hạng hoặc trích dẫn trực tiếp phải có ít nhất 2 nguồn độc lập hoặc gắn nhãn `certainty: "approximate"` kèm ghi chú `uncertaintyNote`.
- Thứ bậc nguồn tin cậy:
  1. Hồ sơ di sản chính thức (Cục Di sản văn hóa `dsvh.gov.vn`, quyết định Thủ tướng/Bộ VHTTDL, ban quản lý di tích).
  2. Viện bảo tàng và trung tâm lưu trữ quốc gia.
  3. Báo chí chính thức của Đảng và Nhà nước (Báo Nhân Dân, Quân đội nhân dân, TTXVN...).
  4. Sách giáo khoa Lịch sử 12 (Kết nối tri thức với cuộc sống).
  *Lưu ý: Không dùng Wikipedia làm nguồn trích dẫn trực tiếp.*

### 3.3 Tọa độ địa lý
- Đo đạc chính xác trên OpenStreetMap (`openstreetmap.org`).
- Ghi nhận `osm` element ID (ví dụ: `way/25261391` hoặc `node/2718291012`).
- Tọa độ làm tròn tối đa 5 chữ số thập phân, nằm trong khung lãnh thổ Việt Nam `[8.0, 23.5] x [102.0, 117.5]`.
- Chọn `accuracy: "exact"` khi điểm đo nằm trúng khuôn viên di tích / bia đài; chọn `"approximate"` nếu chỉ định vị được khu vực chung.

### 3.4 Ảnh và bản quyền
- Ưu tiên Wikimedia Commons với giấy phép tự do (CC BY, CC BY-SA, Public Domain).
- Khi sử dụng ảnh tư liệu báo chí / bảo tàng theo diện trích dẫn giáo dục:
  - Chọn căn cứ `usageBasis: "coursework_reference"`.
  - **Để trống** ô giấy phép (`license = null`) và đường dẫn giấy phép (`licenseUrl = null`).
  - Ghi rõ tác giả hoặc cơ quan lưu trữ vào trường `photographer`.
  - Ghi đường dẫn trang bài viết gốc vào `sourcePageUrl`.
- Mỗi địa danh cần ít nhất 1 ảnh bìa (`isCover: true`).

### 3.5 Video tư liệu
- Chỉ chọn video từ kênh chính thống (VTV, Truyền hình Nhân Dân, Báo Quân đội nhân dân...).
- Kiểm tra tính năng nhúng bằng nút "Kiểm tra nhúng" trong trang Quản trị.
- Ghi nhận ngày kiểm tra `embed_checked_at`.

---

## 4. Các lệnh kiểm tra và thẩm định chất lượng

```bash
# 1. Kiểm tra tính toàn vẹn gói nội dung (chế độ release)
node scripts/content/heritage-sites-validate.mjs --package supabase/content/heritage-sites/v1 --mode release

# 2. Chạy kịch bản diễn tập và kiểm tra 34/34 địa phương
node scripts/agent/heritage-rehearsal.mjs

# 3. Tạo file SQL cập nhật và rollback
node scripts/content/heritage-sites-release-sql.mjs --package supabase/content/heritage-sites/v1 --out supabase/content/heritage-sites/release-v1 --mode publish

# 4. Kiểm tra toàn bộ mã nguồn
pnpm verify
```
