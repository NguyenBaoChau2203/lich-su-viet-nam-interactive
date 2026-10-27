# Kế hoạch tính năng nhân vật cách mạng theo địa phương

Ngày lập: **26/10/2026**, múi giờ Asia/Bangkok.
Nhánh local: **feat/local-revolutionary-heroes**.
Mốc gốc đã kiểm tra sau fetch: **6a38f58**, local main = origin/main, ahead/behind **0/0** tại thời điểm khảo sát.

**Yêu cầu đã được bạn xác nhận:** lần phát hành đầu tiên phải phủ mọi tỉnh/thành. Kế hoạch dùng hệ 34 địa phương đang có trong dự án; Phase 00 sẽ đối chiếu danh mục chuẩn. Mẫu dữ liệu dùng để phát triển chỉ là kiểm tra nội bộ, không phải lần phát hành giới hạn một số tỉnh.

## Tài liệu chính

- [Thiết kế đề xuất](../../superpowers/specs/2026-10-26-local-revolutionary-heroes-design.md).
- [Plan chi tiết, file map, hợp đồng liên phase và cổng nghiệm thu](../../superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md).
- [Chuẩn prompt của dự án](../../agent/AI-AGENT-PROMPT-STANDARD.md).
- [Template prompt của dự án](../../agent/AI-AGENT-PROMPT-TEMPLATE.md).

Thiết kế hiện là **đề xuất để bạn xem xét**. Chưa có code tính năng, migration, nội dung lịch sử mới hay dữ liệu được công bố từ task lập kế hoạch này. Phạm vi toàn quốc ngay đợt đầu đã được ghi nhận; các lựa chọn như giai đoạn lịch sử, tiêu chí chọn nhân vật và cách dùng ảnh tư liệu thay chân dung sẽ được chốt cụ thể ở Phase 00.

## Trải nghiệm dự kiến

Trang chủ có mục **Nhân vật theo địa phương**. Người dùng chọn tỉnh/thành, tìm tên hoặc bí danh, xem danh sách có ảnh và đóng góp, rồi mở trang nhân vật đang có để đọc câu chuyện, xem tư liệu và kiểm tra nguồn. Quay lại sẽ giữ bộ lọc và trang danh sách.

Địa cầu, timeline và hành trình hiện có được giữ lại. Bộ chọn địa phương có đường dùng bằng bàn phím và HTML thông thường; không phụ thuộc việc bấm vào polygon tỉnh vì dữ liệu địa cầu hiện tại mới là đường ranh giới tham chiếu.

Mỗi địa phương phải có ít nhất một hồ sơ hoàn chỉnh gồm quan hệ với địa phương, đóng góp, câu chuyện, hình ảnh và nguồn để đạt sàn độ phủ. Danh sách phát hành đầu được chốt theo tiêu chí và phải xử lý hết các mục được chấp nhận; **một người/địa phương là sàn kiểm tra độ phủ, không phải giới hạn số nhân vật**.

“Phủ đủ 34 địa phương” và “đã liệt kê mọi nhân vật có công” là hai kết luận khác nhau. Sản phẩm sẽ ghi rõ mức độ bao phủ. Danh hiệu được phong chính thức chỉ xuất hiện khi có nguồn chứng minh.

## Phân việc theo model

| Phase | Model và mức suy luận | Kết quả |
| --- | --- | --- |
| 00 | **GPT-6.1 Sol — Max** | Chốt thiết kế, phạm vi, schema/API, trạng thái trang chủ, tiêu chí nội dung và nghiệm thu |
| 01 | **Gemini 3.8 Flash — High** | Khảo sát danh mục toàn quốc, nghiên cứu nhân vật, câu chuyện, nguồn và ảnh cho đủ địa phương |
| 02 | **GPT-6.1 Sol — Max** | Schema, RLS, truy vấn, thao tác server nguyên tử, validator dữ liệu và kiểm thử quyền |
| 03 | **Gemini 3.8 Flash — High** | Mở rộng màn quản trị nhân vật/câu chuyện/địa phương/nguồn/ảnh theo hợp đồng đã chốt |
| 04 | **GPT-6.1 Sol — Max** | Tích hợp vào trang chủ, URL, phân trang, vòng đời hành trình/địa cầu, hiệu năng và fallback |
| 05 | **Gemini 3.8 Flash — High** | Hoàn thiện trang nhân vật, câu chuyện, gallery, ghi công và điều hướng quay lại |
| 06 | **Gemini 3.8 Flash — High** | Hoàn thiện nội dung phát hành toàn quốc theo từng batch, đóng mọi khoảng trống của 34 địa phương |
| 07 | **GPT-6.1 Sol — Max** | Self-review toàn luồng, kiểm nguồn/ảnh, kiểm quyền DB, browser desktop, import local và báo cáo readiness |

Gemini được giao việc nghiên cứu tài liệu/ảnh và UI có giao diện dữ liệu rõ. GPT được giao các phần ảnh hưởng đồng thời nhiều hệ thống như quyền dữ liệu, trạng thái địa cầu/URL và nghiệm thu. Đây là đề xuất phân việc theo rủi ro và khả năng được tài liệu chính thức mô tả; chưa phải benchmark của hai model trên repository này.

Nguồn model đã đọc ngày 26/10/2026: [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash/), [Gemini thinking](https://ai.google.dev/gemini-api/docs/thinking), [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol). Flash hỗ trợ đầu vào ảnh/PDF nhưng đầu ra là văn bản; phase nghiên cứu ảnh tìm và kiểm chứng tư liệu, không tạo ảnh lịch sử giả.

## File prompt thực thi từng phase

- **Phase 00 — GPT-6.1 Sol Max:** [00-contract-gpt61-sol-max.md](./00-contract-gpt61-sol-max.md).
- **Phase 01 — Gemini 3.8 Flash High:** [01-national-research-gemini38-flash-high.md](./01-national-research-gemini38-flash-high.md).
- **Phase 02 — GPT-6.1 Sol Max:** [02-data-security-gpt61-sol-max.md](./02-data-security-gpt61-sol-max.md).
- **Phase 03 — Gemini 3.8 Flash High:** [03-admin-gemini38-flash-high.md](./03-admin-gemini38-flash-high.md).
- **Phase 04 — GPT-6.1 Sol Max:** [04-homepage-gpt61-sol-max.md](./04-homepage-gpt61-sol-max.md).
- **Phase 05 — Gemini 3.8 Flash High:** [05-stories-media-gemini38-flash-high.md](./05-stories-media-gemini38-flash-high.md).
- **Phase 06 — Gemini 3.8 Flash High:** [06-national-completion-gemini38-flash-high.md](./06-national-completion-gemini38-flash-high.md).
- **Phase 07 — GPT-6.1 Sol Max:** [07-acceptance-gpt61-sol-max.md](./07-acceptance-gpt61-sol-max.md).

Tất cả prompt thực thi viết bằng tiếng Anh theo chuẩn repository; mỗi file có model, mission, sources of truth, trạng thái xuất phát, phạm vi, ràng buộc, công việc, acceptance criteria, verification gate, deliverables và điểm dừng.

## Cách sử dụng

1. Chọn đúng model và High/Max trong ứng dụng thực thi; file Markdown không tự đổi model.
2. Dùng Phase 00 trước để đối chiếu và chốt bản thiết kế cụ thể. Việc yêu cầu lập plan chưa phải phê duyệt mọi chi tiết triển khai.
3. Sau khi thiết kế được duyệt, chạy tuần tự Phase 01 → 07. Mỗi lần dùng đúng một agent thực hiện cả khảo sát, chỉnh sửa, self-review và kiểm tra.
4. Khi chuyển model, cung cấp repository hiện tại, file prompt đầy đủ, contract và báo cáo/handoff của phase trước. Không cần truyền lại toàn bộ lịch sử chat.
5. Phase 01 có thể lưu tiến độ và tiếp tục nghiên cứu; Phase 06 xử lý tối đa 10 nhân vật khác nhau mỗi lần chạy rồi dừng, lặp tuần tự đến khi toàn bộ danh mục phát hành đầu đủ bằng chứng.
6. Chỉ đánh dấu sẵn sàng lần phát hành đầu khi Phase 07 chứng minh đủ 34/34 địa phương và mọi hồ sơ được chấp nhận có câu chuyện, ảnh, nguồn, cùng các cổng code/DB/browser đạt.
7. Mỗi phase tạo báo cáo local trong .task-reports/ và dẫn đường dẫn tuyệt đối. Báo cáo này không stage/commit.
8. Commit, push, PR, merge, thay đổi Supabase remote, upload, công bố và deploy cần yêu cầu riêng của bạn; prompt hiện tại dừng trước các bước đó.

Một phase thiếu nguồn hoặc môi trường kiểm thử phải báo rõ việc còn thiếu. Không đổi tiêu chí để đủ số, không dùng dữ liệu mock làm bằng chứng quyền RLS và không gọi nghiên cứu bằng AI là chứng nhận của giáo viên/hội đồng.

## Trạng thái task lập kế hoạch

- Đã kiểm tra nhánh/main remote bằng fetch mới và tạo nhánh local.
- Đã khảo sát source bằng CodeGraph cùng tài liệu, migration và test liên quan.
- Đã tạo bản thiết kế, plan và tám prompt theo hai model bạn yêu cầu.
- Đã đưa yêu cầu phủ mọi tỉnh/thành ngay đợt đầu vào thiết kế, plan và mọi prompt.
- Các kết quả kiểm tra mới nhất và giới hạn của task nằm trong báo cáo local được dẫn ở phản hồi bàn giao.
