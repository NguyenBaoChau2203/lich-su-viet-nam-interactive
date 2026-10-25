# Phạm vi MVP — Lịch sử Việt Nam tương tác

Tài liệu này là bản tóm tắt dùng cho coding agent. Tài liệu học thuật gốc vẫn là báo cáo Word ở thư mục gốc; không tự động sửa báo cáo từ file này.

**Phạm vi thiết bị được chủ dự án cập nhật ngày 23/10/2026:** chỉ tập trung laptop/PC. Áp dụng [phạm vi giao diện desktop](DESKTOP-UI-SCOPE.md); mobile/tablet được hoãn.

## Người dùng và mục tiêu

Người học chính là học sinh lớp 12. Sản phẩm giúp các bạn nhận biết trình tự thời gian, liên hệ sự kiện với địa điểm, tìm lại nội dung và đọc giải thích có nguồn rõ ràng.

## Bắt buộc trong phiên bản đầu

- 25–35 sự kiện lịch sử Việt Nam tiêu biểu được biên tập và thẩm định.
- Trang chủ/điểm vào rõ ràng.
- Dòng thời gian theo giai đoạn và niên đại.
- Trang chủ là địa cầu tối giản trên nền tối, xoay/tiến về Việt Nam khi vào lần đầu, kéo/phóng to để chọn điểm sự kiện theo thời gian, mở thẻ tóm tắt rồi trang chi tiết. Chỉ gắn nhãn địa danh Việt Nam được chọn lọc và địa điểm nước ngoài liên quan. Theo thiết kế địa cầu đã duyệt `docs/superpowers/specs/2026-10-23-curated-history-globe-design.md`, có danh sách văn bản thay thế và hành trình chọn lọc của Chủ tịch Hồ Chí Minh với nguồn/độ chính xác từng mốc. Yêu cầu này thay thế nền OSM ở trang chủ; mô phỏng trong trang chi tiết giữ phạm vi riêng đã duyệt.
- Tìm kiếm và lọc theo từ khóa/giai đoạn/chủ đề phù hợp.
- Trang chi tiết sự kiện, nhân vật và nguồn tham khảo liên quan.
- Quản trị cơ bản để thêm, sửa, ẩn/hiện nội dung.
- Bố cục laptop/PC thích ứng với viewport desktop, bàn phím, tương phản tốt và reduced motion theo `DESKTOP-UI-SCOPE.md`.

## Có thể làm sau

- Tài khoản người học, yêu thích và lịch sử xem.
- Quiz, thành tích hoặc trò chơi tương tác nhỏ.
- AI hỗ trợ học tập.
- Scrollytelling nâng cao, các tour khác ngoài hành trình đã duyệt hoặc các mô hình 3D ngoài phạm vi trang chi tiết sự kiện đã duyệt.

Các mục này chỉ được bắt đầu sau khi luồng timeline–map–detail của MVP hoàn chỉnh và có thiết kế riêng được duyệt.

## Tiêu chí dữ liệu tối thiểu cho một sự kiện

- Tiêu đề, slug, mô tả ngắn và nội dung phù hợp trình độ lớp 12.
- Mốc bắt đầu/kết thúc có kiểu chính xác hoặc xấp xỉ.
- Giai đoạn/chủ đề.
- Địa điểm và tọa độ kèm ghi chú độ chính xác.
- Nhân vật/sự kiện liên quan khi có nguồn.
- Ít nhất một nguồn; trạng thái `verified`, `approximate`, `disputed` hoặc `editorial`.
- Trạng thái biên tập: nháp, đã thẩm định hoặc đã xuất bản.

## Definition of Done cho một lát cắt

Một sự kiện mẫu xuất hiện nhất quán trong dữ liệu, timeline, bản đồ/danh sách thay thế, kết quả tìm kiếm và trang chi tiết; nguồn và độ chắc chắn hiển thị đúng; luồng dùng được bằng chuột/trackpad và bàn phím ở các viewport laptop/PC trong `DESKTOP-UI-SCOPE.md`; kiểm thử liên quan cùng `pnpm verify` đều đạt. Mobile/tablet không phải điều kiện nghiệm thu hiện tại.
