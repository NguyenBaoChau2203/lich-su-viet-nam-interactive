# Giao Gemini bổ sung biên giới quốc gia

Đây là phần bổ sung sau các phase cinematic globe đã chạy, không phải yêu cầu dựng lại trang chủ.

- [Review mã và kết quả hiện tại](../../../audits/2026-10-24-country-boundaries-globe-review.md).
- [Thiết kế đề xuất](../../../superpowers/specs/2026-10-24-country-boundaries-globe-design.md).
- [Plan chi tiết](../../../superpowers/plans/2026-10-24-country-boundaries-globe-plan.md).
- [Ảnh mẫu gốc](../../../design/references/cinematic-history-globe/target.png).

| Thứ tự | Prompt | Kết quả cần nhận |
| --- | --- | --- |
| 0 | [phase-0.md](phase-0.md) | File biên giới đất liền có nguồn, phân loại và test dữ liệu; chưa thay render |
| 1 | [phase-1.md](phase-1.md) | Đường biên giới chạy trên chính quả cầu hiện tại; tải lỗi lớp này vẫn dùng được bản đồ |
| 2 | [phase-2.md](phase-2.md) | Nét mảnh, màu dịu, Việt Nam vẫn nổi bật; bộ ảnh so sánh bốn kích thước desktop |
| 3 | [phase-3.md](phase-3.md) | Kết quả hồi quy, số đo tải/khung hình và báo cáo bàn giao |

Cho Gemini đọc workspace, đính kèm hoặc mở ảnh mẫu, rồi giao **một phase mỗi lượt**. Mỗi prompt yêu cầu đọc `shared-contract.md` và đúng phần plan liên quan. Chưa giao cả bốn phase trong một lệnh tự chạy.

Hướng đề xuất dùng Natural Earth 50m cho biên giới giữa các nước, giữ nguyên viền vàng Việt Nam và bờ biển hiện tại. Không thêm tên nước, tỉnh/thành hàng loạt, đường phố, POI hay đường phân định trên biển.

Plan đề xuất ngân sách địa lý mới tối đa 600 KiB gzip thay cho 500 KiB, vì nguồn 50m dự kiến thêm khoảng 129 KiB. Nếu cần giữ mức 500 KiB, có phương án 110m nhẹ hơn nhưng phải xem lại chất lượng đường nét gần Việt Nam. Đây là lựa chọn được ghi rõ để xét khi thực thi, không phải thay đổi đã áp dụng.

Sau Phase 2, xem kỹ ảnh: đường các nước phải nhìn thấy vừa đủ, không sáng như viền Việt Nam, không đè điểm sự kiện hoặc tạo nét kép dọc biên giới Việt Nam. Ảnh concept không được dùng để vẽ lại hình học địa lý.
