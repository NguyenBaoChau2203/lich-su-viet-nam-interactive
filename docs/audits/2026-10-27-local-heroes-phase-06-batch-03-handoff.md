# Bàn giao Phase 06 — Batch 3: Hoàn thiện dữ liệu nghiên cứu nhân vật lịch sử, câu chuyện và hình ảnh bối cảnh cấp quốc gia

Ngày 27/10/2026, Asia/Bangkok. Một agent chính; **self-review**. Nhánh `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Không stage/commit/push/PR/deploy hoặc ghi remote.

**Trạng thái cuối:** Hoàn thành Batch 3 (tối đa 10 nhân vật riêng biệt) ưu tiên các địa phương chưa có hồ sơ hoàn chỉnh (`51`, `52`, `56`, `66`, `68`, `75`, `79`, `80`, `82`, `86`). Kết quả thẩm định độc lập: **5 nhân vật hoàn thiện** hồ sơ nghiên cứu đạt chuẩn (câu chuyện 453–485 từ, trích dẫn từng đoạn `[[cite:...]]`, ảnh chân dung / hiện vật lịch sử minh bạch có nguồn gốc chính thức, kích thước và mã băm SHA-256 thực tế, 35 claims mới); **5 nhân vật giữ lại (`held` / `needs_evidence`)** với lý do thiếu tư liệu ảnh chân dung/bối cảnh lịch sử trên nguồn được duyệt (`figure:c6eb511d-898f-4fab-8875-42ddd0700cd4` Phạm Văn Đồng - nguồn `dakbla.quangngai.gov.vn` thiếu ảnh nhân vật; `new:dinh-nup` Đinh Núp - nguồn `baogialai.com.vn` chỉ có ảnh đoàn về nguồn năm 2019; `new:vo-van-ky` Võ Văn Ký - nguồn `namnhatrang.khanhhoa.gov.vn` không có hình ảnh; `new:tran-thi-nhuong` Trần Thị Nhượng - nguồn `baodongthap.vn` chỉ có ảnh Đình Tân Trào và di tích khác; `new:pham-hung` Phạm Hùng - nguồn `baotanglichsu.vn` chỉ có ảnh hội thảo năm 2022). Bản kê manifest được nâng cấp lên **version 17** với SHA-256 `84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb` (chờ chủ dự án duyệt). Số địa phương sẵn sàng rà soát tăng từ 16 lên **21/34** (`01`, `04`, `08`, `11`, `12`, `14`, `19`, `22`, `24`, `31`, `33`, `38`, `40`, `42`, `44`, `46`, `66`, `68`, `75`, `79`, `80`). Số nhân vật hoàn thiện đạt **22/35**.

---

## 1. Phạm vi thực hiện và thẩm quyền

- Tuân thủ nghiêm ngặt chuẩn prompt `docs/agent/AI-AGENT-PROMPT-STANDARD.md` và kế hoạch Phase 06 trong `docs/superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md`.
- Tuyệt đối không bịa đặt dữ kiện lịch sử, nhân vật, năm sinh/mất, danh hiệu, địa bàn hoạt động hay trích dẫn.
- Giữ vững nguyên tắc minh bạch hình ảnh: Không gán ảnh hiện đại (năm 2019, 2022) hoặc di tích nơi khác làm chân dung nhân vật; phân biệt rõ `portrait` và `historical_context`; ảnh bối cảnh/hiện vật dán nhãn bắt buộc: `"Tư liệu bối cảnh, không phải chân dung."`.
- Không tự tiện giảm mẫu hay gạch tên nhân vật để đạt chỉ tiêu số lượng. Nhân vật chưa đủ bằng chứng được giữ lại công khai với khoảng trống chứng cứ cụ thể (`gaps`).
- Toàn bộ công việc thực hiện trên bản sao cục bộ, không ghi vào database Supabase từ xa, không thực hiện commit hay push lên git repository.

---

## 2. Kết quả chi tiết Batch 3 (10 nhân vật được thẩm tra)

| STT | Mã nhân vật | Tên nhân vật | Địa phương ưu tiên | Kết quả thẩm tra | Minh chứng & Khoảng trống chứng cứ |
| --- | --- | --- | --- | --- | --- |
| 1 | `new:y-bloc-eban` | Y Blốk Êban | `66` (Đắk Lắk) | **complete** | Câu chuyện 453 từ; ảnh chân dung Sở VHTTDL Đắk Lắk (`media-research-y-bloc-eban-portrait`, 1280×991, 142456 bytes, SHA-256 `11aee932...`). Khắc họa chỉ huy trung đội lính khố xanh biến cuộc mít tinh ngày 22/8/1945 thành khởi nghĩa giành chính quyền, vị Thiếu tướng đầu tiên của đại ngàn Tây Nguyên. |
| 2 | `new:le-thi-pha` | Lê Thị Pha | `68` (Lâm Đồng) | **complete** | Câu chuyện 456 từ; ảnh chân dung Báo Người Đưa Tin (`media-research-le-thi-pha-portrait`, 640×973, 205186 bytes, SHA-256 `b2834822...`). Khắc họa Chính trị viên nữ pháo binh B83 và Bí thư chi bộ Y2 Đại Lào, anh dũng chiến đấu và hy sinh trên chiến trường B'Lao. |
| 3 | `new:huynh-van-nghe` | Huỳnh Văn Nghệ | `75` (Đồng Nai) | **complete** | Câu chuyện 457 từ; ảnh chân dung Hội VHNT Đồng Nai (`media-research-huynh-van-nghe-portrait`, 500×364, 92622 bytes, SHA-256 `70e48517...`). Khắc họa vai trò sáng lập Chiến khu Đ, chuẩn bị thế trận chiến thắng La Ngà 1948 và thi nhân võ tướng của miền Đông. |
| 4 | `new:nguyen-van-troi` | Nguyễn Văn Trỗi | `79` (TP. Hồ Chí Minh) | **complete** | Câu chuyện 464 từ; ảnh tư liệu pháp trường Chí Hòa BTLSQG (`media-research-nguyen-van-troi-portrait`, 394×480, 149029 bytes, SHA-256 `a8c4eb32...`). Khắc họa người chiến sĩ Biệt động Sài Gòn quả cảm nhận nhiệm vụ gài mìn tại cầu Công Lý và khí phách hiên ngang trước pháp trường. |
| 5 | `new:hoang-le-kha` | Hoàng Lê Kha | `80` (Tây Ninh) | **complete** | Câu chuyện 485 từ; ảnh hiện vật sắc cốt da kháng chiến BTLSQG (`media-research-hoang-le-kha-context`, 480×377, 127269 bytes, SHA-256 `4a06b4b2...`). Khắc họa Thường vụ Tỉnh ủy Tây Ninh bám trụ phong trào cách mạng dưới ách Luật 10/59, hiên ngang trước máy chém quân thù. |
| 6 | `figure:c6eb511d-898f-4fab-8875-42ddd0700cd4` | Phạm Văn Đồng | `51` (Quảng Ngãi) | **held** (`needs_evidence`) | Nguồn `dakbla.quangngai.gov.vn` có bài viết chi tiết nhưng không cung cấp chân dung lịch sử hoặc ảnh bối cảnh của nhân vật; giữ trạng thái chờ tư liệu ảnh kiểm chứng. |
| 7 | `new:dinh-nup` | Đinh Núp | `52` (Gia Lai) | **held** (`needs_evidence`) | Nguồn `baogialai.com.vn` phản ánh chuyến về nguồn năm 2019, các hình ảnh đính kèm là đoàn đại biểu hiện đại, không có ảnh chân dung lịch sử hoặc tư liệu bối cảnh 1858–1975; giữ trạng thái chờ tư liệu ảnh kiểm chứng. |
| 8 | `new:vo-van-ky` | Võ Văn Ký | `56` (Khánh Hòa) | **held** (`needs_evidence`) | Nguồn `namnhatrang.khanhhoa.gov.vn` phản ánh diễn biến trận chiến đấu ga Nha Trang ngày 23/10/1945 nhưng bài viết không có hình ảnh; giữ trạng thái chờ tư liệu ảnh kiểm chứng. |
| 9 | `new:tran-thi-nhuong` | Trần Thị Nhượng | `82` (Đồng Tháp) | **held** (`needs_evidence`) | Nguồn `baodongthap.vn` phản ánh khởi nghĩa Sa Đéc tháng 8/1945 nhưng hình ảnh bài viết là di tích Đình Tân Trào và cơ sở khác, không có ảnh trực tiếp của đồng chí Trần Thị Nhượng; giữ trạng thái chờ tư liệu ảnh kiểm chứng. |
| 10 | `new:pham-hung` | Phạm Hùng | `86` (Vĩnh Long) | **held** (`needs_evidence`) | Nguồn `baotanglichsu.vn` phản ánh hội thảo kỷ niệm 110 năm ngày sinh nhưng các ảnh đính kèm là quang cảnh và đại biểu hội thảo năm 2022, không có chân dung lịch sử hoặc tư liệu thời kỳ 1858–1975; giữ trạng thái chờ tư liệu ảnh kiểm chứng. |

---

## 3. Thống kê sổ bộ nghiên cứu cấp quốc gia (National V1)

- **Manifest:** Version 17, SHA-256 `84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb`. Trạng thái phê duyệt: `pending` (chờ chủ dự án phê duyệt bản kê v17).
- **Tiến độ bao phủ địa phương:**
  - Tổng số địa phương tham chiếu: 34 (`VN-34-2025`).
  - Sẵn sàng rà soát (`ready_for_review`): **21/34** (`01`, `04`, `08`, `11`, `12`, `14`, `19`, `22`, `24`, `31`, `33`, `38`, `40`, `42`, `44`, `46`, `66`, `68`, `75`, `79`, `80`).
  - Đang nghiên cứu (`researching`): **13/34** (`15`, `20`, `25`, `37`, `48`, `51`, `52`, `56`, `82`, `86`, `91`, `92`, `96`).
- **Tiến độ nhân vật trong danh mục được chọn:**
  - Tổng số nhân vật được đề xuất chọn: 35.
  - Hoàn thiện đầy đủ (`complete`): **22/35** (Bế Văn Đàn, Đội Cấn, Hoàng Lê Kha, Huỳnh Văn Nghệ, Kim Đồng, Lê Duẩn, Lê Thị Pha, Lò Văn Giá, Ngô Gia Tự, Nguyễn Chí Diểu, Nguyễn Đức Cảnh, Nguyễn Thị Minh Khai, Nguyễn Văn Trỗi, Tạ Xuân Thu, Tô Hiệu, Tô Vĩnh Diện, Trần Can, Trần Phú, Trần Quốc Mạnh, Văn Tiến Dũng, Vũ Văn Hiếu, Y Blốk Êban).
  - Chưa hoàn thiện (`incomplete` / `needs_evidence`): **13/35**.
  - Nhân vật giữ lại xem xét riêng (`held`): 13.
- **Dữ liệu bằng chứng:**
  - Tổng số claims: 353 (305 accepted, 48 held).
  - Tổng số tư liệu media: 32 (22 accepted, 10 held). Toàn bộ 22 ảnh accepted đều có kích thước thực tế, mã băm SHA-256 và cơ sở sử dụng `coursework_reference`.
  - Tổng số câu chuyện: 22 accepted stories (350–700 words, 100% đoạn văn có trích dẫn nguồn).

---

## 4. Các tệp tin đã thay đổi và cập nhật

### Dữ liệu gói nghiên cứu (`supabase/content/local-heroes/national-v1/`)
- `stories.json`: Thêm 5 câu chuyện lịch sử mới được xác minh chặt chẽ (453–485 từ, trích dẫn từng đoạn).
- `media.json`: Thêm 5 bản ghi hình ảnh tư liệu (4 chân dung, 1 hiện vật bối cảnh lịch sử) có đo kích thước và băm SHA-256.
- `claims.json`: Bổ sung 35 claims mới (5 tiểu sử, 5 nhân dạng ảnh, 25 luận cứ từng đoạn câu chuyện kèm định vị locator cụ thể).
- `people.json`: Cập nhật `mainStoryId`, `representativeMediaId`, `biography`, `contributionSummary`, `claimIds` cho 5 nhân vật.
- `roster.json`: Cập nhật trạng thái `complete` cho 5 nhân vật; ghi nhận khoảng trống chứng cứ (`gaps`) chi tiết cho 5 nhân vật held.
- `coverage.json`: Cập nhật `completePersonKeys` và chuyển 5 địa phương mới sang `ready_for_review`.
- `manifest.json`: Nâng phiên bản lên 17, cập nhật mã băm SHA-256 cho toàn bộ 9 tệp tin component và tính toán `manifestHash` mới.

### Kiểm thử và tài liệu (`tests/` & `docs/`)
- `tests/unit/local-heroes-content.test.ts`: Cập nhật ngưỡng kỳ vọng tương thích với manifest v17 (22 nhân vật hoàn chỉnh, 21 địa phương đại diện, mã băm `84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb`).
- `docs/content/local-heroes/coverage.md`: Cập nhật bảng theo dõi 34 địa phương tham chiếu (21 ready_for_review).
- `docs/content/local-heroes/roster.md`: Cập nhật trạng thái và khoảng trống chứng cứ của 53 danh tính (22 complete).
- `docs/content/local-heroes/phase-06-queue.md`: Ghi nhận kết quả thực hiện Batch 1, 2, 3; phân bổ hàng đợi Batch 4.
- `docs/content/local-heroes/media.md`: Lập danh mục chi tiết 22 hình ảnh đã nghiệm thu và 10 hình ảnh đang bảo lưu.
- `docs/content/local-heroes/claims.md`: Lập chỉ mục 353 claims kèm định vị nguồn cụ thể.

---

## 5. Bằng chứng kiểm tra và cổng chất lượng

| Lệnh kiểm thử | Kết quả | Chi tiết chứng minh |
| --- | --- | --- |
| `node scripts/content/check-local-heroes.mjs` | **valid: true, issues: []** (exit 0) | Cấu trúc gói v17, kiểm tra schema, quan hệ đối chiếu, câu chuyện và hình ảnh đều hợp lệ. |
| `node scripts/content/check-local-heroes.mjs --mode release` | **issues: 34 (COVERAGE), 1 (APPROVAL), 1 (ROSTER)** (exit 1/2) | Cơ chế kiểm soát phát hành hoạt động chính xác: từ chối xuất bản release khi chưa đủ 34 địa phương và chưa có chữ ký duyệt manifest của chủ dự án. |
| `pnpm exec vitest run tests/unit/local-heroes-content.test.ts` | **29/29 passed** (exit 0) | Toàn bộ 29 ca kiểm thử cấu trúc và negative cases đạt chuẩn. |
| `pnpm verify` | **PASSED** (exit 0) | Toàn bộ cổng chất lượng repo: agent check + data check + lint + typecheck + unit tests + production build. |
| `git diff --check` | **PASSED** (exit 0) | Sạch sẽ, không có lỗi whitespace hay conflict markers. |

---

## 6. Hàng đợi thực hiện tiếp theo (Batch 4)

Batch 4 sẽ tập trung giải quyết các địa phương còn thiếu trong 13 địa phương chưa hoàn thiện:
1. `new:nguyen-thi-dinh` (`83` Bến Tre / hoặc ứng viên khu vực Tây Nam Bộ)
2. `new:ung-van-khiem` (`89` An Giang)
3. `new:nam-ky-khoi-nghia` / nhân vật tại Kiên Giang / Cà Mau (`91`, `96`)
4. Tìm kiếm nguồn bổ sung hoặc ảnh tư liệu chính thống được kiểm chứng cho các ứng viên đang tạm giữ (`held`):
   - Quảng Ngãi (`51`): Phạm Văn Đồng (tìm nguồn có ảnh chân dung lịch sử)
   - Gia Lai (`52`): Đinh Núp (tìm nguồn bảo tàng/báo có ảnh chân dung 1954/1955)
   - Khánh Hòa (`56`): Võ Văn Ký (tìm nguồn có ảnh bối cảnh Nha Trang 1945 trực tiếp)
   - Đồng Tháp (`82`): Trần Thị Nhượng (tìm nguồn có ảnh chân dung hoặc hiện vật)
   - Vĩnh Long (`86`): Phạm Hùng (tìm nguồn BTLSQG có ảnh tư liệu thời kỳ kháng chiến)
   - Đà Nẵng (`48`): Thái Phiên / nhân vật khởi nghĩa
   - Ninh Bình (`37`): Lương Văn Tụy (tìm nguồn thay thế cho CDN bị 404)
   - Phú Thọ / Yên Bái (`25`): Nguyễn Thái Học
   - Hà Nam (`20` / `35`): tìm ứng viên địa phương hoàn chỉnh.

Quá trình nghiên cứu sẽ tiếp tục theo từng mẻ hữu hạn cho đến khi đạt đủ 34/34 địa phương trước khi chuyển giao sang Phase 07.
