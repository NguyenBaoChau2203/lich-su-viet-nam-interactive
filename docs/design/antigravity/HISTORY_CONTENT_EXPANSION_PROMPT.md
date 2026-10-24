# Prompt cho Antigravity — mở rộng kho sự kiện, ảnh, video và chuyện lịch sử

## Cách dùng

Mở workspace `D:\lich-su-viet-nam-interactive`, sau đó gửi toàn bộ khối prompt dưới đây cho Antigravity. Prompt cho phép Antigravity nghiên cứu và triển khai theo từng lô, nhưng không cho phép tự xuất bản dữ liệu yếu hoặc tư liệu chưa rõ quyền.

## Prompt

```text
Bạn đang làm việc trong repository:

D:\lich-su-viet-nam-interactive

Hãy mở rộng kho nội dung lịch sử 1945–1975 từ 5 mục mẫu hiện tại lên 25–35 sự kiện đủ nguồn cho MVP. Đồng thời thu thập ảnh, video và chuyện bên lề có xuất xứ/quyền rõ, rồi nối catalog mới vào dòng thời gian, trang Khám phá, Địa điểm và trang câu chuyện.

Đây là nhiệm vụ lớn theo nhiều lô. Hãy tự tiến hành các lựa chọn kỹ thuật đã nêu trong tài liệu, viết test, triển khai, chạy kiểm tra và sửa lỗi. Không dừng lại hỏi lại các quyết định đã ghi rõ. Tuy nhiên tuyệt đối không tự coi dữ liệu thiếu bằng chứng là đã duyệt hoặc đã xuất bản.

==================================================
1. ĐỌC NGUỒN SỰ THẬT
==================================================

Đọc theo thứ tự:

1. `AGENTS.md`
2. `.agents/skills/research-history-sources/SKILL.md`
3. `docs/product/MVP-SCOPE.md`
4. `docs/product/VIDEO_STORYTELLING_FEASIBILITY.md`
5. `docs/superpowers/plans/2026-09-24-history-corpus-expansion.md`
6. `tasks/plan.md`
7. `tasks/todo.md`
8. Mã và test hiện tại trong `src/features/history`, `timeline`, `explore`, `places`, `story`.

Nếu `.codegraph/` tồn tại, dùng CodeGraph trước khi grep hoặc đọc lan man. Repository có thay đổi local từ lần dựng UI trước; không reset, xóa hoặc ghi đè thay đổi không thuộc nhiệm vụ. Không sửa, stage hoặc commit file Word, `.env`, secret, output build.

Next.js trong repo là 16.3.4. Trước khi sửa API Next, đọc tài liệu tương ứng trong `node_modules/next/dist/docs/` theo `AGENTS.md`.

==================================================
2. NGUYÊN TẮC TUYỆT ĐỐI
==================================================

- Không bịa nguồn, URL, ngày, địa điểm, tọa độ, nhân vật, trích dẫn, con số, lời kể hoặc mô tả ảnh.
- Không dùng trí nhớ của mô hình làm nguồn.
- Không dùng search snippet làm bằng chứng. Phải mở nguồn và ghi trang/mục/đoạn/timecode thực sự hỗ trợ claim.
- Không dùng ảnh AI hoặc ảnh “gần giống” làm tư liệu lịch sử.
- Không đưa ảnh/video vào trang nếu chưa biết nguồn gốc và quyền sử dụng.
- Không tải lại, sao chép hoặc cắt ghép video bên khác chỉ vì video đang công khai.
- Không tự nhận một tài khoản/kênh là chính thức khi chưa kiểm tra.
- Không biến lời kể nhân chứng/hồi ký thành kết luận khách quan. Kiểm chứng riêng các chi tiết dùng trong lời dẫn.
- Nếu nguồn bất đồng, dùng `disputed`; nếu ngày/vị trí gần đúng, dùng `approximate`; diễn giải biên tập dùng `editorial`.
- Nếu thiếu bằng chứng, giữ `candidate` hoặc `needs_evidence` và ghi rõ thiếu gì.
- Chỉ mục đã qua review mới có `published` và xuất hiện trong public selector.

Tách hai sổ:

1. nguồn chứng minh dữ kiện lịch sử;
2. bằng chứng quyền sử dụng ảnh/audio/video.

Một nguồn tốt về lịch sử không tự động cấp quyền dùng ảnh. Một ảnh giấy phép mở không tự động là nguồn đủ mạnh cho lời kể.

==================================================
3. MỤC TIÊU VÀ CÁCH CHIA LÔ
==================================================

Mục tiêu cuối đợt:

- 40–50 ứng viên nghiên cứu;
- chọn 25–35 sự kiện đạt Definition of Done cho MVP 1945–1975;
- ít nhất 2 nguồn độc lập/sự kiện và ít nhất 1 nguồn lưu trữ, bảo tàng, cơ quan nhà nước hoặc học thuật;
- 100% claim trong tóm tắt/nội dung kể có source refs;
- tìm 2–4 ảnh ứng viên/sự kiện và ít nhất 1 đầu mối video khi có, nhưng chỉ xuất bản media đủ quyền;
- 12–18 chuyện bên lề/lời kể có xuất xứ trên toàn kho.

Làm mỗi lô tối đa 6–8 sự kiện:

- audit 5 mục mẫu trước;
- lô 1945–1954;
- lô 1954–1965;
- lô 1965–1973;
- lô 1973–1975 nếu cần để đạt 25–35 mục.

Kết thúc mỗi lô, chạy validator/test và tạo bảng báo cáo. Không nghiên cứu hàng chục mục rồi mới kiểm tra.

==================================================
4. NGUỒN KHỞI ĐẦU
==================================================

Ưu tiên:

1. chương trình/sách giáo khoa để xác định mục tiêu học;
2. lưu trữ nhà nước, bảo tàng, thư viện và hồ sơ gốc;
3. công trình học thuật/ấn phẩm nghiên cứu;
4. báo chí/kênh truyền hình chính chủ làm nguồn thứ cấp hoặc video;
5. hồi ký/lời kể cho góc nhìn cá nhân, luôn ghi tư cách nguồn.

Các đầu mối đã kiểm tra tồn tại ngày 24/09/2026:

- https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1483/vbhn-chuong-trinh-mon-lich-su.pdf
- https://www.archives.org.vn/
- https://baotanglichsu.vn/vi
- https://vienphim.org.vn/
- https://www.archives.gov/research/vietnam-war
- https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- https://support.google.com/youtube/answer/171780

Đây là đầu mối tra cứu, không phải tuyên bố mọi nội dung đều được phép tái sử dụng. Với Wikimedia Commons phải mở từng trang file và kiểm tra license/attribution. Với YouTube chỉ nhúng khi chủ video cho phép; dùng privacy-enhanced mode phù hợp, không autoplay, có link mở nguồn và fallback.

==================================================
5. TRIỂN KHAI KỸ THUẬT
==================================================

Thực hiện đúng Tasks 0–9 trong plan đầy đủ. Các yêu cầu chính:

1. Ghi baseline trước khi sửa và bảo vệ thay đổi local.
2. Viết test đỏ cho validator trước.
3. Tạo:
   - `content/history/events.json`
   - `content/history/claims.json`
   - `content/history/sources.json`
   - `content/history/media.json`
   - `content/history/side-stories.json`
   - `content/history/reviews.json`
   - `scripts/history/validate-content.mjs`
4. Thêm `pnpm history:data:check` vào cổng verify.
5. Thay các type `Sample*` khóa cứng bằng model trong plan; component đọc qua adapter typed.
6. Audit lại cả 5 mục hiện tại; đặc biệt không giữ địa điểm/chủ đề cũ nếu nguồn không hỗ trợ.
7. Timeline phải hỗ trợ nhiều sự kiện/năm, marker cụm, danh sách tuyến tính trên mobile, keyboard và URL state.
8. Explore sinh filter từ catalog. Place chỉ hiển thị tọa độ có nguồn và có text list. Story route động theo slug, hiển thị nguồn theo claim, credit media và chuyện bên lề.
9. Public selector chỉ lấy `published`. Nội dung nghiên cứu có thể xem trong local editorial preview với nhãn rõ.

Không thêm dependency nếu Node, TypeScript, React, Next.js và Web Platform hiện có đủ dùng.

==================================================
6. CỔNG XUẤT BẢN
==================================================

Validator phải từ chối một event `published` nếu có bất kỳ điều nào sau:

- thiếu hai nguồn độc lập hoặc thiếu một nguồn cấp cao;
- claim không có source refs hoặc source không ghi phần hỗ trợ;
- URL nguồn, ngày truy cập hoặc cơ quan/tác giả bị thiếu;
- media hiển thị trực tiếp có `rightsStatus` là `unknown`, `permission_required` hoặc `link_only`;
- media thiếu source page, credit bắt buộc hoặc license evidence;
- video embed chưa kiểm tra hoặc không có fallback link;
- địa điểm/tọa độ không có nguồn hoặc precision;
- story bên lề thiếu xuất xứ/ngữ cảnh;
- thiếu review record cho đúng phiên bản nội dung.

Không viết kiểm thử chỉ so khớp với chính mảng triển khai. Test phải chứng minh cổng trên thật sự từ chối fixture xấu và chấp nhận fixture hợp lệ.

==================================================
7. DEFINITION OF DONE
==================================================

Một sự kiện chỉ được tính vào 25–35 mục khi:

- có metadata, ngày/precision, chủ đề, địa điểm có nguồn và mục tiêu học;
- mọi câu mang dữ kiện được truy về claim/source;
- có ít nhất 2 nguồn độc lập, gồm ít nhất 1 nguồn cấp cao;
- media hiển thị có quyền/credit rõ; không có media thì dùng trạng thái trung thực;
- story bên lề giữ đúng tư cách nguồn;
- kiểm duyệt viên đã duyệt một phiên bản cụ thể;
- xuất hiện nhất quán trong timeline, explore, place/list, search và detail;
- dùng được ở 320, 768, 1024, 1440 px, bằng bàn phím và reduced motion;
- test hẹp, E2E và `pnpm verify` đều đạt với output mới.

==================================================
8. BÁO CÁO BẮT BUỘC
==================================================

Sau mỗi lô, cập nhật `tasks/todo.md` và báo bảng:

| Sự kiện | Trạng thái | Claims | Nguồn độc lập | Ảnh được dùng | Video nhúng/link | Chuyện bên lề | Thiếu sót |

Khi hoàn tất, báo:

- số ứng viên, số đạt, số bị giữ lại và lý do;
- URL nguồn đã mở và phần được dùng;
- media bị loại vì sai ngữ cảnh/quyền;
- điểm còn tranh luận;
- file đã đổi;
- kết quả các lệnh kiểm thử;
- xác nhận không chạm file Word, secret, `.env`, build output hoặc thay đổi local ngoài phạm vi.
```
