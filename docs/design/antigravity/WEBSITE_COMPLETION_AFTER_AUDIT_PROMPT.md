# Prompt cho Antigravity — Checkpoint A sau audit dữ liệu

Bạn đang làm việc trong repository `D:\lich-su-viet-nam-interactive`.

## Mục tiêu của lượt này

Chỉ thực hiện **Task 1–3 / Checkpoint A** trong:

- `docs/audits/2026-09-25-history-content-and-feature-audit.md`
- `docs/superpowers/plans/2026-09-25-website-completion-after-content-audit.md`
- `tasks/plan.md`
- `tasks/todo.md`

Mục tiêu là ngăn dữ liệu chưa thẩm tra và media gắn sai tiếp tục xuất hiện như nội dung đã kiểm chứng. Không triển khai toàn bộ roadmap trong một lượt. Sau khi Checkpoint A đạt, dừng và bàn giao để người dùng duyệt.

## Sự thật đã kiểm tra

1. Có 32 event và tất cả đang bị gắn `published`, nhưng nguồn chưa được thẩm tra đủ.
2. Tối thiểu 48/64 URL nguồn không vượt qua cổng công bố vì hỏng, redirect về trang chủ hoặc mở nội dung không liên quan.
3. 32 review hiện là dữ liệu giả lập; một review dùng tên GS. Phan Huy Lê cho quyết định năm 2026, điều không thể xảy ra.
4. Hai record video cùng dùng YouTube ID `UIutoCqw01Y`. Video thật là “Cuộc đời và sự nghiệp cách mạng của Chủ tịch Hồ Chí Minh”, không phải video Điện Biên Phủ hoặc Đại thắng mùa Xuân 1975.
5. Một số ảnh Commons là ảnh địa điểm/hiện vật chụp nhiều thập niên sau, nhưng UI đang gọi chung là “ẢNH TƯ LIỆU GỐC”.
6. 13 chuyện bên lề thiếu `sourceId` và locator, nên không được trình bày như lời chứng đã xác minh.
7. `pnpm verify` và E2E hiện xanh nhưng validator chỉ kiểm tra cấu trúc; video sai vẫn vượt test.

## Quy tắc tuyệt đối

- Không bịa hoặc suy đoán URL, claim, trích dẫn, câu chuyện, reviewer, license, creator, credit, tọa độ hay ngày tháng.
- Không tự thay video/ảnh sai bằng media tìm thấy nhanh trên Internet.
- Không coi HTTP 200 hoặc tên file giống sự kiện là bằng chứng nội dung đúng.
- Không dùng ảnh AI làm tư liệu lịch sử.
- Không đổi/xóa/di chuyển/stage file Word ở thư mục gốc.
- Không đọc/in `.env`, API key hoặc secret.
- Không push, merge hoặc tạo PR.
- Giữ nguyên thay đổi local không liên quan của người dùng.

## Trình tự bắt buộc

### Bước 0 — Baseline

1. Đọc `AGENTS.md` và bốn tài liệu nêu trên.
2. Ghi `git status --short`; không reset tree.
3. Vì repo có `.codegraph/`, dùng `codegraph explore` trước khi đọc lan man. Xác định call path từ:
   - `content/history/*.json`;
   - validator;
   - catalog/public selector;
   - `HistoricalMediaView`;
   - `CinemaBand`;
   - các public route.
4. Chạy test hẹp hiện có để ghi baseline.

### Task 1 — Quarantine catalog

1. Viết test đỏ chứng minh event `published` không được chấp nhận khi review/provenance không hợp lệ.
2. Nếu type chưa đủ, dùng trạng thái rõ ràng như `needs_evidence`, `in_review`, `published`, `rejected`.
3. Hạ cả 32 event hiện tại về `needs_evidence` hoặc trạng thái không công khai tương đương.
4. Xóa hoặc vô hiệu review giả lập. Không thay bằng danh tính khác và không tạo review mới để làm test xanh.
5. Giữ nội dung như draft/preview để tiếp tục biên tập; không xóa corpus.
6. Validator phải từ chối `published` nếu thiếu revision review thật hoặc provenance theo model hiện tại.

### Task 2 — Public preview trung thực

1. Tách selector public và selector preview. Public chỉ được đọc item đủ điều kiện `published`.
2. Không fallback âm thầm sang fixture/draft rồi gắn nhãn nội dung thật.
3. Khi catalog public rỗng, dùng empty state có chủ đích hoặc preview được gắn nhãn **“Dữ liệu đang thẩm tra”**.
4. Gỡ các tuyên bố không có bằng chứng: “đã thẩm định nguồn”, “chuẩn SGK 12”, tên cơ quan/người duyệt suy diễn.
5. Viết test cho catalog và ít nhất một public route để bảo vệ hành vi này.

### Task 3 — Media containment

1. Gỡ YouTube ID `UIutoCqw01Y` khỏi record gắn với Điện Biên Phủ và Đại thắng mùa Xuân 1975.
2. Không chèn URL thay thế. Với event chưa có media đã xác minh, render placeholder trung thực như “Video đang được xác minh”.
3. Bổ sung phân loại media tối thiểu, tương thích dữ liệu hiện có, để phân biệt:
   - ảnh cùng thời với sự kiện;
   - ảnh hiện vật/địa điểm chụp sau;
   - bản đồ;
   - minh họa;
   - video/audio.
4. Gỡ nhãn “ẢNH TƯ LIỆU GỐC” khỏi media chưa chứng minh được điều đó. Nhãn UI phải sinh từ `mediaKind` và mức chắc chắn.
5. Ẩn player control/chapter giả khi không có video/chapter thật. Không để nút giả có vẻ tương tác nhưng không hoạt động.
6. Không tải iframe bên thứ ba khi không có video đã duyệt.
7. Viết component/E2E test chứng minh video sai không còn xuất hiện dưới hai sự kiện.

## Yêu cầu thiết kế

- Giữ ngôn ngữ thiết kế lịch sử hiện tại; không biến empty/preview state thành dashboard hoặc thẻ gradient.
- Nội dung cốt lõi vẫn đọc được khi JavaScript hoặc animation lỗi.
- Focus rõ, dùng bàn phím được, tương phản WCAG AA và tôn trọng `prefers-reduced-motion`.
- Kiểm tra 320, 768, 1024, 1440 px; không tạo horizontal overflow.

## Cổng kiểm tra

Chạy theo thứ tự:

```bash
pnpm history:data:check
pnpm test
pnpm test:e2e
pnpm verify
git diff --check
git status --short
```

Nếu local dev server được dùng, chụp tối thiểu:

- trang chủ desktop + mobile;
- một trang câu chuyện từng chứa video sai;
- trang Khám phá/Dòng thời gian khi catalog public rỗng hoặc ở preview.

Không sửa test để chấp nhận tuyên bố lịch sử sai. Test mới phải kiểm tra hành vi có ý nghĩa, không chỉ snapshot implementation.

## Nội dung bàn giao rồi dừng

1. File đã đổi và lý do.
2. Trạng thái 32 event và review sau sửa.
3. Bằng chứng ID video sai không còn được render dưới Điện Biên Phủ/1975.
4. Ảnh chụp ở các viewport yêu cầu.
5. Output mới của cổng kiểm tra.
6. Rủi ro/câu hỏi còn lại cho Checkpoint B.

**Dừng sau Checkpoint A. Không bắt đầu Task 4–19 khi chưa được người dùng duyệt.**
