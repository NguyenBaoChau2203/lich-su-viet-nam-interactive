# Kiểm tra mức sẵn sàng của nội dung và media trang chủ

**Ngày kiểm tra:** 2026-09-25\
**Phạm vi:** Đối chiếu báo cáo Remediation Checkpoint A của Antigravity với code, dữ liệu và giao diện trang chủ hiện tại\
**Trạng thái:** Trang chủ chưa sẵn sàng để coi là hoàn thiện; cần một lát cắt riêng cho nội dung và media trang chủ

## 1. Kết quả kiểm tra báo cáo Antigravity

Báo cáo `.task-reports/2026-09-25-0755-checkpoint-a-remediation.md` mô tả đúng mục tiêu của Checkpoint A: tách public/preview, gỡ metadata suy diễn, sửa một số media mismatch, chặn video chưa xác minh và bổ sung kiểm thử.

Các bằng chứng mới đã chạy lại:

```text
pnpm history:data:check
THÀNH CÔNG: dữ liệu đạt cấu trúc; 32/32 sự kiện vẫn là needs_evidence; 0 published.

pnpm exec vitest run src/app/page.test.tsx src/features/history/data.test.ts src/components/media/HistoricalMediaView.test.tsx tests/content-integrity.test.ts
4 test files passed; 18 tests passed.

pnpm exec playwright test tests/e2e/home.spec.ts --project=chromium
1 test passed.
```

Kết luận: Checkpoint A đã đạt mục tiêu containment có liên quan đến trang chủ. Báo cáo không chứng minh rằng nội dung, nguồn, ảnh và cấu trúc biên tập của trang chủ đã hoàn thiện.

## 2. Ảnh chụp giao diện hiện tại

- Desktop toàn trang: `.codex-tmp/home-audit-1440-full.png`
- Mobile toàn trang: `.codex-tmp/home-audit-320-full.png`
- Bộ ảnh 4 breakpoint do Checkpoint A tạo: `.codex-tmp/screenshots/home-*.png`

Quan sát chính:

- Hero hiện là một khối nền đen “VIDEO ĐANG ĐƯỢC XÁC MINH”, dù sự kiện Điện Biên Phủ đã có một ảnh trong catalog.
- Trang desktop cao khoảng 6.328 px và mobile cao khoảng 13.028 px vì render toàn bộ 32 sự kiện trong mục “Mới được biên tập”.
- Phần lớn trải nghiệm cuối trang là danh sách chữ; ảnh chỉ tập trung ở một cụm nhỏ.
- Khối bản đồ vẫn là placeholder và dùng nội dung khẳng định mức xác minh cao hơn bằng chứng hiện có.

## 3. Phát hiện cần sửa trước khi gọi trang chủ là hoàn thiện

### HP-01 — Hero ưu tiên video bị quarantine thay vì ảnh có thể hiển thị

`HeroStoryStage` truyền `preferVideo={true}`. `HistoricalMediaView` chọn video trước, sau đó mới kiểm tra video có đủ điều kiện nhúng hay không. Vì `media-1954-dbp-video` chưa có nguồn, chưa có quyền và `embedTested: false`, hero kết thúc ở placeholder; `media-1954-dbp-flag` không được dùng.

Yêu cầu: chọn media theo **độ đủ điều kiện hiển thị**, không chỉ theo `kind`. Video chưa xác minh không được che mất ảnh hợp lệ hơn.

### HP-02 — Nhãn media không phản ánh media thật được render

`buildStorySummary` ưu tiên video, rồi audio, rồi phần tử đầu tiên để tạo `plannedMediaLabel`. Cách này có thể ghi “PHIM TƯ LIỆU” hoặc “LỜI KỂ / ÂM THANH TƯ LIỆU” trong khi UI đang render ảnh hoặc placeholder.

Yêu cầu: nhãn, caption, credit và CTA phải được tạo từ cùng media item mà UI thực sự chọn.

### HP-03 — Nhiều nguồn của năm câu chuyện trang chủ không dẫn tới tài liệu đã khai báo

Kiểm tra HTTP và tiêu đề trang vào 2026-09-25 cho thấy:

| ID | Kết quả quan sát |
| --- | --- |
| `media-1945-audio-tndl` | URL VOV chuyển tới bài về vaccine Covid-19, không phải bản ghi Tuyên ngôn Độc lập. |
| `src-1946-tqkc-baotang` | HTTP 200 nhưng tiêu đề trang là “Thiên Đàn - Đỉnh cao kiến trúc cổ đại Trung Hoa”. |
| `src-1950-bg-baotang` | HTTP 200 nhưng chỉ trả trang chung “Bảo tàng Lịch sử Quốc gia”. |
| `src-1950-bg-qdnd` | Chuyển về trang kho tư liệu chung, không tới bài đã khai báo. |
| `src-1954-dbp-baotang` | HTTP 200 nhưng chỉ trả trang chung “Bảo tàng Lịch sử Quốc gia”. |
| `src-1954-dbp-luutru` | Chuyển về trang chủ Trung tâm Lưu trữ quốc gia I. |
| `src-1975-tn-vn-baotang` | HTTP 200 nhưng chỉ trả trang chung “Bảo tàng Lịch sử Quốc gia”. |
| `src-1975-tn-vn-chinhphu` | HTTP 404. |

Hai nguồn của sự kiện 1945 và nguồn Nhân Dân của sự kiện 1946 trả đúng trang dự kiến trong lần kiểm tra này. Kết quả HTTP chỉ chứng minh khả năng truy cập và độ khớp trang sơ bộ; chưa thay thế việc kiểm tra nội dung và claim locator.

Các trang Wikimedia Commons trả 403 do robot policy trong phép thử HTTP tự động. Không được coi 403 này là bằng chứng asset sai; cần kiểm tra bằng MediaWiki API hoặc trình duyệt và đối chiếu creator, ngày, license, mô tả và URL ảnh gốc.

### HP-04 — Nội dung địa điểm đang tạo cảm giác đã thẩm định

`DiscoveryPaths` ghi:

> Hệ thống 17 tọa độ lịch sử đã xác minh qua Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam...

Trong khi báo cáo Antigravity ghi tọa độ vẫn đang thẩm tra. `places.json` lặp tên cơ quan ở `coordinateSource` nhưng chưa đủ bằng chứng để khẳng định toàn bộ 17 tọa độ đã được cơ quan đó xác minh.

Các số “4 SỰ KIỆN LỊCH SỬ” và “3 CHIẾN TRƯỜNG” cũng đang hard-code, không sinh từ catalog.

Yêu cầu: gỡ tuyên bố xác minh và số đếm không có nguồn; hiển thị trạng thái `đang thẩm tra` hoặc `gần đúng` theo dữ liệu thực.

### HP-05 — “Mới được biên tập” không có dữ liệu thời gian biên tập

`RecentStoryRows` render toàn bộ `SAMPLE_STORIES` nhưng model hiện không có `updatedAt` dùng để chứng minh thứ tự “mới”. Tên section gây hiểu nhầm và làm trang chủ quá dài.

Yêu cầu: thay bằng một tập “Sự kiện tiêu biểu” được chọn rõ ràng hoặc bổ sung metadata thời gian biên tập có nguồn gốc thật. Trang chủ không render toàn bộ 32 sự kiện.

### HP-06 — Card ảnh thiếu provenance nhìn thấy được

Các card theo chủ đề gọi `HistoricalMediaView` với `showCaption={false}`. Người dùng thấy ảnh nhưng không thấy ngay ảnh là tư liệu cùng thời, ảnh di tích chụp sau, tài liệu scan hay hiện vật; credit và link nguồn cũng không xuất hiện ở card.

Yêu cầu: mỗi ảnh lịch sử trên trang chủ cần alt text phù hợp, loại tư liệu, caption ngắn, credit và đường dẫn nguồn ở mức đủ để người dùng không hiểu sai bản chất ảnh.

### HP-07 — Trang chủ chưa giải thích ngắn gọn giá trị của sản phẩm

H1 hiện là tên một sự kiện. Người mới vào trang chưa được giải thích rõ rằng họ có thể khám phá lịch sử 1945–1975 qua hình ảnh, video, thời gian, địa điểm và các câu chuyện có nguồn.

Yêu cầu: thêm một lời dẫn sản phẩm ngắn, mang tính biên tập, rồi đặt câu chuyện tiêu điểm bên dưới. Tránh khẩu hiệu khoa trương và tránh dashboard/card grid theo mẫu chung.

## 4. Phạm vi đề xuất cho lát cắt tiếp theo

Chỉ hoàn thiện trang chủ và tập dữ liệu mà trang chủ trực tiếp dùng:

- `cach-mang-thang-tam`
- `toan-quoc-khang-chien`
- `chien-dich-bien-gioi`
- `chien-dich-dien-bien-phu`
- `dai-thang-mua-xuan-1975`

Không mở rộng sang việc làm sạch toàn bộ 32 sự kiện, auth, Supabase, workflow bốn vai trò hay hoàn thiện các route khác. Các sự kiện vẫn ở `needs_evidence` cho tới khi có review thật; trang chủ tiếp tục mang nhãn preview trung thực.

## 5. Quyết định

Thực hiện prompt `docs/design/antigravity/HOMEPAGE_CONTENT_MEDIA_COMPLETION_PROMPT.md`. Chỉ coi checkpoint trang chủ hoàn thành khi năm câu chuyện được audit, media hiển thị đúng eligibility, copy sai được gỡ, danh sách 32 mục được rút gọn, bản đồ/timeline có preview trung thực, và có bằng chứng trình duyệt ở 320/768/1024/1440 px.
