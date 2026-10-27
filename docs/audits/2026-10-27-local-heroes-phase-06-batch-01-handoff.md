# Bàn giao Phase 06 — Batch 1: Hoàn thiện dữ liệu nghiên cứu nhân vật lịch sử, câu chuyện và hình ảnh bối cảnh cấp quốc gia

Ngày 27/10/2026, Asia/Bangkok. Một agent chính; **self-review**. Nhánh `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Không stage/commit/push/PR/deploy hoặc ghi remote.

**Trạng thái cuối:** Hoàn thành Batch 1 (tối đa 10 nhân vật riêng biệt) ưu tiên các địa phương chưa có hồ sơ hoàn chỉnh (`08`, `11`, `12`, `14`, `15`, `19`, `20`, `22`). Kết quả thẩm định độc lập: **8 nhân vật hoàn thiện** hồ sơ nghiên cứu đạt chuẩn (câu chuyện 395–514 từ, trích dẫn từng đoạn `[[cite:...]]`, ảnh bối cảnh minh bạch có nhãn trung thực, kích thước và mã băm SHA-256 thực tế, 56 claims mới); **2 nhân vật giữ lại (`held`)** với lý do thiếu chứng cứ xác đáng (`new:hoang-truong-minh` thiếu ảnh gốc trực tiếp; `new:hoang-van-thu` có mâu thuẫn niên biểu và link ảnh cũ bị hỏng). Bản kê manifest được nâng cấp lên **version 15** với SHA-256 `19c18dacb9543f59389907d290a8f063d22467d54dac02601dde0b2ce6d1a318` (chờ chủ dự án duyệt). Số địa phương sẵn sàng rà soát tăng từ 2 lên **9/34** (`01`, `04`, `08`, `11`, `12`, `14`, `19`, `22`, `33`). Số nhân vật hoàn thiện đạt **10/35**.

---

## 1. Phạm vi thực hiện và thẩm quyền

- Tuân thủ nghiêm ngặt chuẩn prompt `docs/agent/AI-AGENT-PROMPT-STANDARD.md` và kế hoạch Phase 06 trong `docs/superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md`.
- Tuyệt đối không bịa đặt dữ kiện lịch sử, nhân vật, năm sinh/mất, danh hiệu, địa bàn hoạt động hay trích dẫn.
- Giữ vững nguyên tắc minh bạch hình ảnh: Không gán ảnh di tích/tượng đài hay sự kiện làm chân dung nhân vật; tất cả ảnh bối cảnh đều dán nhãn bắt buộc: `"Tư liệu bối cảnh, không phải chân dung."` với tác giả trung thực `"không được ghi"`.
- Không tự tiện giảm mẫu hay gạch tên nhân vật để đạt chỉ tiêu số lượng. Nhân vật chưa đủ bằng chứng được giữ lại công khai với khoảng trống chứng cứ cụ thể (`gaps`).
- Toàn bộ công việc thực hiện trên bản sao cục bộ, không ghi vào database Supabase từ xa, không thực hiện commit hay push lên git repository.

---

## 2. Kết quả chi tiết Batch 1 (10 nhân vật được thẩm tra)

| STT | Mã nhân vật | Tên nhân vật | Địa phương ưu tiên | Kết quả thẩm tra | Minh chứng & Khoảng trống chứng cứ |
| --- | --- | --- | --- | --- | --- |
| 1 | `new:ta-xuan-thu` | Tạ Xuân Thu | `08` (Tuyên Quang) | **complete** | Câu chuyện 514 từ; ảnh lán Nà Nưa (`media-research-ta-xuan-thu-na-nua`, Báo Nhân Dân, 600×413, SHA-256 `685b8fae...`). Không gán nơi sinh Tuyên Quang do bản kế thừa ghi sai; để trống năm sinh/mất chờ đối chiếu. |
| 2 | `new:be-van-dan` | Bế Văn Đàn | `04` (Cao Bằng), `11` (Điện Biên) | **complete** | Câu chuyện 425 từ; ảnh đồ họa tư liệu NVSK TTXVN (`media-research-be-van-dan-nvsk`, 1000×562, SHA-256 `1db621a6...`). Không ghi năm mất cụ thể vào trường định lượng do nguồn ghi khác nhau. |
| 3 | `new:tran-can` | Trần Can | `11` (Điện Biên) | **complete** | Câu chuyện 412 từ; ảnh đồ họa tư liệu NVSK TTXVN cứ điểm Him Lam (`media-research-tran-can-nvsk`, 1000×562, SHA-256 `a05891d4...`). Link ảnh kế thừa bảo tàng trả về 404 đã được thay thế bằng tư liệu TTXVN. |
| 4 | `new:tran-quoc-manh` | Trần Quốc Mạnh | `12` (Lai Châu) | **complete** | Câu chuyện 395 từ; ảnh di tích Bản Lướt (`media-research-tran-quoc-manh-ban-luot`, Báo Lai Châu, 1000×750, SHA-256 `303fa211...`). Thể hiện rõ địa danh xã Bản Bo và di tích lịch sử nơi thành lập Ban Cán sự Đảng Lai Châu. |
| 5 | `new:lo-van-gia` | Lò Văn Giá | `14` (Sơn La) | **complete** | Câu chuyện 431 từ; ảnh bia tưởng niệm Lò Văn Giá (`media-research-lo-van-gia-memorial`, Báo Sơn La, 960×720, SHA-256 `2f54070a...`). Khắc họa vai trò dẫn đường cuộc vượt ngục năm 1943. |
| 6 | `new:to-hieu` | Tô Hiệu | `14` (Sơn La), `33` (Hưng Yên) | **complete** | Câu chuyện 430 từ; ảnh lễ tưởng niệm Tô Hiệu tại Nhà tù Sơn La (`media-research-to-hieu-memorial-ceremony`, Báo Sơn La, 960×720, SHA-256 `d8f4bc76...`). Đáp ứng phủ sóng đồng thời 2 địa phương `14` và `33`. |
| 7 | `new:doi-can` | Đội Cấn | `19` (Thái Nguyên) | **complete** | Câu chuyện 406 từ; ảnh trưng bày 105 năm Khởi nghĩa Thái Nguyên (`media-research-doi-can-exhibition-105`, Báo Thái Nguyên, 1000×667, SHA-256 `8e9f5060...`). Để trống năm sinh và tên thật do tài liệu không thống nhất. |
| 8 | `new:vu-van-hieu` | Vũ Văn Hiếu | `22` (Quảng Ninh) | **complete** | Câu chuyện 441 từ; ảnh tượng đài Vũ Văn Hiếu tại Hạ Long (`media-research-vu-van-hieu-monument`, Báo Quảng Ninh, 1000×667, SHA-256 `2adcf2e3...`). Để trống năm sinh/mất do bài viết có phép tính tuổi không nhất quán. |
| 9 | `new:hoang-truong-minh` | Hoàng Trường Minh | `15` (Lào Cai) | **held** (`needs_evidence`) | Bài viết gốc trên Báo Lào Cai chỉ có ảnh chân dung nhà báo Vũ Văn Thụ (người phỏng vấn); link ảnh thumbnail trên CDN trả về HTTP 404; không có tư liệu ảnh hợp lệ. |
| 10 | `new:hoang-van-thu` | Hoàng Văn Thụ | `20` (Lạng Sơn) | **held** (`needs_evidence`) | Nguồn kế thừa từ cổng Lạng Sơn có một câu bất hợp niên biểu về việc kết nạp Đảng năm 1928 (trước khi Đảng thành lập); link ảnh trên Cổng TTĐT Chính phủ trả về 404 và chuyển thành bài viết nhi khoa; cần đối chiếu nguồn độc lập thứ hai. |

---

## 3. Thống kê sổ bộ nghiên cứu cấp quốc gia (National V1)

- **Manifest:** Version 15, SHA-256 `19c18dacb9543f59389907d290a8f063d22467d54dac02601dde0b2ce6d1a318`. Trạng thái phê duyệt: `pending` (chờ chủ dự án phê duyệt bản kê v15).
- **Tiến độ bao phủ địa phương:**
  - Tổng số địa phương tham chiếu: 34 (`VN-34-2025`).
  - Sẵn sàng rà soát (`ready_for_review`): **9/34** (`01`, `04`, `08`, `11`, `12`, `14`, `19`, `22`, `33`).
  - Đang nghiên cứu (`researching`): **25/34**.
- **Tiến độ nhân vật trong danh mục được chọn:**
  - Tổng số nhân vật được đề xuất chọn: 35.
  - Hoàn thiện đầy đủ (`complete`): **10/35** (Văn Tiến Dũng, Kim Đồng, Tạ Xuân Thu, Bế Văn Đàn, Trần Can, Trần Quốc Mạnh, Lò Văn Giá, Tô Hiệu, Đội Cấn, Vũ Văn Hiếu).
  - Chưa hoàn thiện (`incomplete` / `needs_evidence`): **25/35**.
  - Nhân vật giữ lại xem xét riêng (`held`): 18.
- **Dữ liệu bằng chứng:**
  - Tổng số claims: 269 (221 accepted, 48 held).
  - Tổng số tư liệu media: 20 (10 accepted, 10 held). Toàn bộ 10 ảnh accepted đều có kích thước thực tế, mã băm SHA-256 và cơ sở sử dụng `coursework_reference`.
  - Tổng số câu chuyện: 10 accepted stories (395–514 từ, 100% đoạn văn có trích dẫn nguồn).

---

## 4. Các tệp tin đã thay đổi và cập nhật

### Dữ liệu gói nghiên cứu (`supabase/content/local-heroes/national-v1/`)
- `stories.json`: Thêm 8 câu chuyện lịch sử mới được xác minh chặt chẽ.
- `media.json`: Thêm 8 bản ghi hình ảnh tư liệu bối cảnh có đo kích thước và băm SHA-256.
- `claims.json`: Bổ sung 56 claims (nhân dạng ảnh, tiểu sử, luận cứ từng đoạn câu chuyện).
- `people.json`: Cập nhật `mainStoryId`, `representativeMediaId`, `biography`, `claimIds` cho 8 nhân vật.
- `roster.json`: Cập nhật trạng thái `complete` cho 8 nhân vật; bổ sung khoảng trống chứng cứ (`gaps`) chi tiết cho 2 nhân vật held.
- `coverage.json`: Cập nhật `completePersonKeys` và chuyển 7 địa phương mới sang `ready_for_review`.
- `manifest.json`: Nâng phiên bản lên 15, cập nhật mã băm SHA-256 cho toàn bộ 9 tệp tin.

### Kiểm thử và tài liệu (`tests/` & `docs/`)
- `tests/unit/local-heroes-content.test.ts`: Cập nhật ngưỡng kỳ vọng tương thích với manifest v15 (10 nhân vật hoàn chỉnh, 9 địa phương đại diện, mã băm v15).
- `docs/content/local-heroes/coverage.md`: Cập nhật bảng theo dõi 34 địa phương tham chiếu.
- `docs/content/local-heroes/roster.md`: Cập nhật trạng thái và khoảng trống chứng cứ của 53 danh tính.
- `docs/content/local-heroes/phase-06-queue.md`: Ghi nhận kết quả thực hiện Batch 1 và phân bổ hàng đợi Batch 2, 3, 4.
- `docs/content/local-heroes/media.md`: Lập danh mục chi tiết 10 hình ảnh đã nghiệm thu và 10 hình ảnh đang bảo lưu.
- `docs/content/local-heroes/claims.md`: Lập chỉ mục 269 claims kèm định vị nguồn cụ thể.

---

## 5. Bằng chứng kiểm tra và cổng chất lượng

| Lệnh kiểm thử | Kết quả | Chi tiết chứng minh |
| --- | --- | --- |
| `node scripts/content/check-local-heroes.mjs` | **valid: true, issues: []** (exit 0) | Cấu trúc gói v15, kiểm tra schema, quan hệ đối chiếu, câu chuyện và hình ảnh đều hợp lệ. |
| `node scripts/content/check-local-heroes.mjs --mode release` | **issues: 34 (COVERAGE), 1 (APPROVAL), 1 (ROSTER)** (exit 2) | Cơ chế kiểm soát phát hành hoạt động chính xác: từ chối xuất bản release khi chưa đủ 34 địa phương và chưa có chữ ký duyệt manifest của chủ dự án. |
| `pnpm exec vitest run tests/unit/local-heroes-content.test.ts` | **29/29 passed** (exit 0) | Toàn bộ 29 ca kiểm thử cấu trúc và negative cases đạt chuẩn. |
| `pnpm verify` | **PASSED** (exit 0) | Toàn bộ cổng chất lượng repo: agent check + data check + lint + typecheck + 100 tệp test (1170 unit tests) + production build. |
| `git diff --check` | **PASSED** (exit 0) | Sạch sẽ, không có lỗi whitespace hay conflict markers. |

---

## 6. Hàng đợi thực hiện tiếp theo (Batch 2)

Batch 2 sẽ xử lý tối đa 10 nhân vật tiếp theo theo mã địa phương ưu tiên chưa có hồ sơ hoàn chỉnh:
1. `new:ngo-gia-tu` (Địa phương `24` Bắc Ninh)
2. `new:nguyen-thai-hoc` (Địa phương `25` Phú Thọ)
3. `new:nguyen-duc-canh` (Địa phương `31` Hải Phòng)
4. `new:luong-van-tuy` (Địa phương `37` Ninh Bình)
5. `new:to-vinh-dien` (Địa phương `38` Thanh Hóa)
6. `new:nguyen-thi-minh-khai` (Địa phương `40` Nghệ An)
7. `new:tran-phu` (Địa phương `42` Hà Tĩnh)
8. `figure:dff00764-7ef6-4b82-981e-9f66f080d653` - Lê Duẩn (Địa phương `44` Quảng Trị)
9. `new:nguyen-chi-dieu` (Địa phương `46` Huế)
10. `new:thai-phien` (Địa phương `48` Đà Nẵng)
Kèm theo tiếp tục đối chiếu nguồn bổ sung cho 2 nhân vật held của Batch 1 (`15` Hoàng Trường Minh, `20` Hoàng Văn Thụ).
