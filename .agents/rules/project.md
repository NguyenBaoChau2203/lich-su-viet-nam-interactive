# Quy tắc workspace

Luôn đọc và tuân theo `../../AGENTS.md` trước khi lập kế hoạch, sửa mã hoặc báo hoàn tất.

- Giữ đúng MVP 25–35 sự kiện, timeline, bản đồ, tìm kiếm, chi tiết và quản trị cơ bản.
- Giao diện hiện chỉ tập trung laptop/PC theo `../../docs/product/DESKTOP-UI-SCOPE.md`: kiểm tra 1280×720, 1366×768, 1440×900 và 1920×1080; mobile/tablet và cử chỉ cảm ứng được hoãn. Giữ yêu cầu bàn phím, tương phản và reduced motion.
- Không bịa dữ kiện lịch sử và không sửa các file Word nếu chưa được yêu cầu rõ ràng.
- Không đưa secret vào client, log hoặc commit.
- Chủ động dùng mọi skill, MCP, plugin, browser tool và CLI đã cài khi phù hợp; không cần hỏi lại cho thao tác chỉ đọc, local, có thể hoàn tác hoặc kiểm thử. Các giới hạn về secret, lệnh phá hủy và hành động bên ngoài vẫn áp dụng theo `../../AGENTS.md`.
- Dùng skill trong `../skills/` khi nhiệm vụ khớp mô tả.
- Chạy `pnpm verify` trước khi tuyên bố hoàn tất tính năng.
- Mọi task prompt mới hoặc sửa đáng kể phải viết bằng tiếng Anh và theo `../../docs/agent/AI-AGENT-PROMPT-STANDARD.md`; bắt đầu từ `../../docs/agent/AI-AGENT-PROMPT-TEMPLATE.md`.
- Sau mỗi task/prompt có thao tác trong repository, tạo báo cáo theo mục “Báo cáo công việc cục bộ” trong `../../AGENTS.md`; lưu tại `../../.task-reports/` và tuyệt đối không stage/commit báo cáo này.
