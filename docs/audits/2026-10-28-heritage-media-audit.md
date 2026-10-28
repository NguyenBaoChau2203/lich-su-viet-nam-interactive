# Báo cáo kiểm toán Media địa danh lịch sử (Heritage Media Audit)

- **Thời điểm kiểm toán:** 2026-10-28T17:18:26.977Z
- **Gói nội dung:** `supabase/content/heritage-sites/v1`
- **Kiểm tra Live DB:** Có (`--live`)

## 1. Tổng quan kết quả kiểm toán

| Chỉ số | Số lượng | Tỷ lệ Đạt | Đánh giá |
|---|:---:|:---:|---|
| **Tổng số địa danh** | 64 | — | 34 cốt lõi Lớp 12 + 30 mở rộng |
| **Ảnh hợp lệ (OK)** | 64 / 64 | 100.0% | Đạt |
| **Ảnh lỗi / không tồn tại** | 0 / 64 | 0.0% | Gồm link 404 và portal trả về HTML |
| **Video oEmbed hợp lệ** | 0 / 0 | N/A | Đạt |
| **Nguồn trích dẫn chỉ có domain** | 66 / 66 | — | ⚠ Cần cập nhật URL văn bản cụ thể (Phase 6) |

## 2. Danh sách 10 mẫu ảnh bị gãy / không tồn tại

| # | Địa danh (Slug) | Loại ảnh | URL đã khai báo | Trạng thái phản hồi | Chi tiết lỗi |
|---|---|---|---|:---:|---|

## 3. Bảng tổng hợp theo 34 địa phương

| Mã | Địa phương | Số địa danh | Ảnh OK | Ảnh Lỗi | Video OK | Video Lỗi |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 01 | Thành phố Hà Nội | 2 | 2 | 0 | 0 | 0 |
| 04 | Tỉnh Cao Bằng | 2 | 2 | 0 | 0 | 0 |
| 08 | Tỉnh Tuyên Quang | 2 | 2 | 0 | 0 | 0 |
| 11 | Tỉnh Điện Biên | 2 | 2 | 0 | 0 | 0 |
| 12 | Tỉnh Lai Châu | 1 | 1 | 0 | 0 | 0 |
| 14 | Tỉnh Sơn La | 1 | 1 | 0 | 0 | 0 |
| 15 | Tỉnh Lào Cai | 1 | 1 | 0 | 0 | 0 |
| 19 | Tỉnh Thái Nguyên | 2 | 2 | 0 | 0 | 0 |
| 20 | Tỉnh Lạng Sơn | 2 | 2 | 0 | 0 | 0 |
| 22 | Tỉnh Quảng Ninh | 2 | 2 | 0 | 0 | 0 |
| 24 | Tỉnh Bắc Ninh | 2 | 2 | 0 | 0 | 0 |
| 25 | Tỉnh Phú Thọ | 2 | 2 | 0 | 0 | 0 |
| 31 | Thành phố Hải Phòng | 2 | 2 | 0 | 0 | 0 |
| 33 | Tỉnh Hưng Yên | 2 | 2 | 0 | 0 | 0 |
| 37 | Tỉnh Ninh Bình | 2 | 2 | 0 | 0 | 0 |
| 38 | Tỉnh Thanh Hóa | 2 | 2 | 0 | 0 | 0 |
| 40 | Tỉnh Nghệ An | 2 | 2 | 0 | 0 | 0 |
| 42 | Tỉnh Hà Tĩnh | 1 | 1 | 0 | 0 | 0 |
| 44 | Tỉnh Quảng Trị | 2 | 2 | 0 | 0 | 0 |
| 46 | Thành phố Huế | 2 | 2 | 0 | 0 | 0 |
| 48 | Thành phố Đà Nẵng | 2 | 2 | 0 | 0 | 0 |
| 51 | Tỉnh Quảng Ngãi | 2 | 2 | 0 | 0 | 0 |
| 52 | Tỉnh Gia Lai | 2 | 2 | 0 | 0 | 0 |
| 56 | Tỉnh Khánh Hòa | 2 | 2 | 0 | 0 | 0 |
| 66 | Tỉnh Đắk Lắk | 2 | 2 | 0 | 0 | 0 |
| 68 | Tỉnh Lâm Đồng | 2 | 2 | 0 | 0 | 0 |
| 75 | Tỉnh Đồng Nai | 2 | 2 | 0 | 0 | 0 |
| 79 | Thành phố Hồ Chí Minh | 2 | 2 | 0 | 0 | 0 |
| 80 | Tỉnh Tây Ninh | 2 | 2 | 0 | 0 | 0 |
| 82 | Tỉnh Đồng Tháp | 2 | 2 | 0 | 0 | 0 |
| 86 | Tỉnh Vĩnh Long | 2 | 2 | 0 | 0 | 0 |
| 91 | Tỉnh An Giang | 2 | 2 | 0 | 0 | 0 |
| 92 | Thành phố Cần Thơ | 2 | 2 | 0 | 0 | 0 |
| 96 | Tỉnh Cà Mau | 2 | 2 | 0 | 0 | 0 |

## 4. Kết luận Phase 0

- Bằng chứng kiểm toán kỹ thuật đã xác nhận phát hiện F1–F5 trong kế hoạch: **toàn bộ các đường dẫn ảnh tự suy diễn đều không thể tải về được hoặc trả về 404 / trang HTML báo lỗi**.
- Hệ thống sẵn sàng chuyển sang **Phase 1 (Display Resilience)** để xây dựng giao diện dự phòng thanh lịch, chống vỡ bố cục khi ảnh chưa sẵn sàng.
