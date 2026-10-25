# Bộ tài liệu giao Gemini: trang chủ địa cầu theo ảnh mẫu

Đây là hướng dẫn dành cho chủ dự án, không phải prompt yêu cầu chạy toàn bộ công việc. Lượt nghiên cứu này chưa sửa giao diện hay cài thư viện mới.

Mở trước:

- [Ảnh đích](../../../design/references/cinematic-history-globe/target.png).
- [Nghiên cứu source và phân tích chênh lệch](../../../audits/2026-10-23-cinematic-globe-source-research.md).
- [Đặc tả hình ảnh và tiêu chí nghiệm thu](../../../superpowers/specs/2026-10-23-cinematic-history-globe-visual-design.md).
- [Plan triển khai chi tiết](../../../superpowers/plans/2026-10-23-cinematic-history-globe-plan.md).

| Thứ tự | Giao Gemini file nào | Kết quả cần xem trước khi đi tiếp |
| --- | --- | --- |
| 0 | [phase-0.md](phase-0.md) | Ảnh hiện trạng, source/texture có nguồn và giấy phép, phương án thư viện được ghi cụ thể |
| 1 | [phase-1.md](phase-1.md) | Bản thử địa cầu đúng góc Việt Nam, thấy độ cong/khí quyển/chất liệu, ảnh đối chiếu thật |
| 2 | [phase-2.md](phase-2.md) | Bản đồ, đảo và điểm địa lý đúng dữ liệu; điểm phía sau địa cầu bị che đúng |
| 3 | [phase-3.md](phase-3.md) | Menu, tiêu đề, thẻ hướng dẫn và timeline nhẹ, gần bố cục ảnh mẫu |
| 4 | [phase-4.md](phase-4.md) | Click/zoom/lọc/thẻ sự kiện/xem chi tiết hoạt động trên địa cầu mới |
| 5 | [phase-5.md](phase-5.md) | Intro và hành trình của Bác Hồ chuyển cảnh mượt, dừng/thoát/quay lại đúng |
| 6 | [phase-6.md](phase-6.md) | Bộ ảnh bốn kích thước laptop/PC, kết quả kiểm tra và số đo hiệu năng |

**Cách dùng:** cho Gemini truy cập đúng workspace này, đính kèm hoặc cho mở `target.png`, rồi dán nội dung **một** file phase vào mỗi lượt giao việc. Mỗi file yêu cầu đọc `shared-contract.md`, spec và phần plan tương ứng. Nếu Gemini không đọc được workspace, chỉ gửi một prompt là chưa đủ: cần cung cấp đúng các file tham chiếu mà phase đó nêu.

Sau Phase 1, xem ảnh thử và quyết định có đạt hình dung hay chưa. Nếu còn là mảng màu phẳng, quả cầu nhỏ giữa màn hình, hoặc không có đường cong khí quyển trong góc nhìn Việt Nam thì yêu cầu chỉnh ngay Phase 1. Chưa cho thay renderer trang chủ ở thời điểm đó. Các phase sau chỉ chạy khi checkpoint trước đã được bàn giao; không giao lệnh “làm hết tất cả các phase”.

Hướng khuyến nghị là tận dụng Three.js đang cài, `three-globe` cho lớp địa lý, và kỹ thuật chất liệu/khí quyển từ demo Earth chính thức. Đây là phương án để thử và đo, chưa phải kết luận đã giống ảnh hay đã tối ưu. Nếu bản thử không đạt, plan có đường quay lại nâng cấp MapLibre hiện tại.

Những phần không thuộc đợt này: thêm sự kiện mới, sửa dữ kiện lịch sử, xây lại mô phỏng Điện Biên Phủ, cơ sở dữ liệu, luyện thi, mobile/tablet, deploy. Tất cả vẫn theo quy tắc một agent của chủ dự án.
