# Phạm vi MVP — Lịch sử Việt Nam tương tác

Tài liệu này là bản tóm tắt dùng cho coding agent. Tài liệu học thuật gốc vẫn là báo cáo Word ở thư mục gốc; không tự động sửa báo cáo từ file này.

## Người dùng và mục tiêu

Người học chính là học sinh lớp 12. Sản phẩm giúp các bạn nhận biết trình tự thời gian, liên hệ sự kiện với địa điểm, tìm lại nội dung và đọc giải thích có nguồn rõ ràng.

## Bắt buộc trong phiên bản đầu

- 25–35 sự kiện lịch sử Việt Nam tiêu biểu được biên tập và thẩm định.
- Trang chủ/điểm vào rõ ràng.
- Dòng thời gian theo giai đoạn và niên đại.
- Bản đồ liên kết địa điểm với sự kiện, có danh sách văn bản thay thế.
- Tìm kiếm và lọc theo từ khóa/giai đoạn/chủ đề phù hợp.
- Trang chi tiết sự kiện, nhân vật và nguồn tham khảo liên quan.
- Quản trị cơ bản để thêm, sửa, ẩn/hiện nội dung.
- Responsive, bàn phím, tương phản tốt và reduced motion.

## Có thể làm sau

- Tài khoản người học, yêu thích và lịch sử xem.
- Quiz, thành tích hoặc trò chơi tương tác nhỏ.
- AI hỗ trợ học tập.
- Scrollytelling nâng cao, mô hình 3D hoặc tour không gian.

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

Một sự kiện mẫu xuất hiện nhất quán trong dữ liệu, timeline, bản đồ/danh sách thay thế, kết quả tìm kiếm và trang chi tiết; nguồn và độ chắc chắn hiển thị đúng; luồng dùng được trên mobile và bàn phím; kiểm thử liên quan cùng `pnpm verify` đều đạt.
