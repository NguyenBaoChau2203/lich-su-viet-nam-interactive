# Phạm vi giao diện laptop và PC

**Xác nhận của chủ dự án:** 23/10/2026. Giai đoạn hiện tại chỉ tập trung thiết kế, tối ưu và nghiệm thu giao diện trên laptop và máy tính để bàn. Mobile và tablet được hoãn đến khi có yêu cầu riêng.

## Phạm vi áp dụng

- Áp dụng cho toàn bộ công việc giao diện mới hoặc được sửa: trang chủ địa cầu/bản đồ lịch sử, timeline, thẻ sự kiện, trang chi tiết, mô phỏng, tư liệu 3D và các trang phụ khi có thay đổi.
- Thiết kế bố cục cho màn hình máy tính; tận dụng không gian để bản đồ, bộ chọn thời gian và thông tin liên quan cùng dễ quan sát.
- Tối ưu chuột, con lăn, trackpad và bàn phím. Cử chỉ chạm, pinch và bố cục riêng cho điện thoại/tablet không phải điều kiện nghiệm thu hiện tại.
- Tiếp tục bảo đảm WCAG AA về tương phản, focus rõ, thứ tự đọc, điều hướng bàn phím, phụ đề khi có nội dung nói, `prefers-reduced-motion` và nội dung thay thế khi JavaScript/WebGL lỗi.

## Khung kiểm tra bắt buộc khi thay đổi giao diện

Các giá trị dưới đây là kích thước **viewport theo CSS pixel**, không phải cam kết về độ phân giải vật lý của thiết bị.

| Viewport | Mục đích |
| --- | --- |
| 1280 × 720 | Không gian làm việc thấp, kiểm tra panel và nút điều khiển không che nhau |
| 1366 × 768 | Bố cục laptop |
| 1440 × 900 | Không gian làm việc rộng hơn |
| 1920 × 1080 | Bố cục máy tính để bàn |

Kiểm tra luồng chính ở bốn viewport này; nội dung không tràn ngang, nhãn/nút không bị cắt, panel không che thao tác cần thiết. Cho phép cuộn dọc ở nội dung dài. Canvas phải cập nhật kích thước và camera phải giữ bản đồ trong vùng quan sát khi cửa sổ đổi kích thước trong phạm vi desktop.

Đo hiệu năng 3D trên laptop/PC có tăng tốc phần cứng; ghi thiết bị, trình duyệt và viewport. Phân biệt kết quả đo trên phần cứng thật với kiểm thử hành vi dùng bộ dựng hình phần mềm.

## Những việc hoãn

- Không bắt buộc thiết kế, screenshot hoặc chạy kiểm thử ở 320, 360, 390, 768 hay 1024 px trong giai đoạn này.
- Không cần bổ sung menu mobile, bottom sheet mobile hay điều khiển cảm ứng riêng để hoàn thành lát cắt desktop.
- Giữ các CSS responsive, thành phần và test mobile có sẵn. Không cần xóa hoặc viết lại chúng chỉ để đổi phạm vi. Những test này là coverage bổ sung, không phải bằng chứng bắt buộc cho nghiệm thu desktop.
- Khi chạy E2E, chọn đúng các ca desktop. Một số file test cũ chứa cả viewport nhỏ lẫn desktop; lệnh chạy cả file hoặc cả `pnpm test:e2e` có thể vẫn chạy các ca ngoài phạm vi. Không mô tả một bộ E2E chưa chạy như đã đạt đầy đủ.
- Tiếp tục chạy `pnpm verify` trước khi bàn giao. Quyết định về thiết bị không nới lỏng các cổng dữ liệu, bảo mật, nguồn lịch sử hay quyền ghi dịch vụ bên ngoài.

## Thứ tự ưu tiên

Quyết định này thay thế các yêu cầu mobile-first, kiểm thử mobile/tablet và ma trận 320/768/1024/1440 trong tài liệu hoặc prompt cũ. Mô tả và kết quả kiểm thử cũ vẫn là ghi nhận ở thời điểm trước, không chứng minh giao diện mới đã được tối ưu. Chỉ mở lại phạm vi mobile/tablet khi chủ dự án yêu cầu.

Trang chủ tuân theo [thiết kế địa cầu đã xác nhận](../superpowers/specs/2026-10-23-curated-history-globe-design.md); mô phỏng và tư liệu trong trang chi tiết tiếp tục theo phạm vi đã duyệt riêng. Tài liệu này quy định phạm vi thiết bị; thiết kế địa cầu không mở lại yêu cầu mobile/tablet.
