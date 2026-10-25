# Bộ prompt nâng cấp explorer — dùng xen kẽ hai model

Đây là bộ task mới sau phần cinematic globe và biên giới quốc gia. Không yêu cầu dựng lại trang chủ. Lượt lập plan chưa sửa mã ứng dụng.

- [Plan chi tiết](../../../superpowers/plans/2026-10-24-explorer-refinement-plan.md).
- [Thiết kế và tiêu chí đạt](../../../superpowers/specs/2026-10-24-explorer-refinement-design.md).
- [Review lỗi và nguồn](../../../audits/2026-10-24-explorer-refinement-review.md).
- [Lý do phân model](../../../audits/2026-10-24-explorer-model-routing.md).
- [Bản bàn giao liên tục giữa các task](../../../audits/2026-10-24-explorer-refinement-progress.md).

| Thứ tự | Task/prompt | Độ phức tạp | Model đề xuất |
| --- | --- | :---: | --- |
| 01 | [Làm sáng đường biên, bề mặt và khí quyển](task-01.md) | 2/5 | Gemini 3.8 Flash high |
| 02 | [Sửa zoom và tách điểm sự kiện](task-02.md) | 5/5 | GPT-6.1 Sol max |
| 03 | [Nhiều hành trình và nhịp dừng 2 giây](task-03.md) | 5/5 | GPT-6.1 Sol max |
| 04 | [Khôi phục đường nối có hiệu ứng](task-04.md) | 4/5 | GPT-6.1 Sol max |
| 05 | [Kiểm chứng và tạo dữ liệu 34 tỉnh/thành](task-05.md) | 5/5 | GPT-6.1 Sol max |
| 06 | [Tích hợp đường ranh giới tỉnh](task-06.md) | 3/5 | Gemini 3.8 Flash high |
| 07 | [Thêm ba hành trình lịch sử có nguồn](task-07.md) | 4/5 | GPT-6.1 Sol max |
| 08 | [Giao diện chọn và đọc hành trình](task-08.md) | 3/5 | Gemini 3.8 Flash high |
| 09 | [Tích hợp và kiểm tra cuối](task-09.md) | 5/5 | GPT-6.1 Sol max |

Bạn chọn model trong công cụ đang dùng, rồi dán nội dung **một prompt**. Cho model truy cập đúng workspace, spec và bản bàn giao; không cần dán lại toàn bộ lịch sử chat. Các prompt yêu cầu một agent hoạt động tại một thời điểm và không gọi model khác tự động.

Sau mỗi task, xem ảnh/kết quả kiểm tra rồi chuyển sang task tiếp. Không giao một lệnh làm cả chín task. Thứ tự mặc định là 01–09; nếu task 05 bị chặn vì nguồn tỉnh chưa đủ bằng chứng, task 07 vẫn có thể làm sau task 03, còn task 06 phải chờ dữ liệu đạt. Không đánh dấu toàn bộ nâng cấp hoàn tất khi phần tỉnh còn thiếu.

Các điểm đã chốt: dùng **34 tỉnh/thành hiện nay** làm lớp tham chiếu; giữ tọa độ sự kiện thật; dừng **2 giây sau khi camera tới mốc** rồi chuyển tiếp; khôi phục đường nối trực tiếp trên địa cầu; giữ hành trình Bác Hồ và thêm ba hành trình được đề xuất trong plan. Địa giới hiện đại không được trình bày như địa giới của năm đang xem.

Đây là phân bổ theo rủi ro công việc, không phải benchmark hai model hoặc cam kết tỷ lệ tiết kiệm. Những phần cần kiểm chứng lịch sử/nguồn và thay đổi trạng thái nhiều module được giao GPT; chỉnh sáng và giao diện theo hợp đồng đã cố định được giao Gemini để giảm vòng lặp tốn kém không cần thiết.
