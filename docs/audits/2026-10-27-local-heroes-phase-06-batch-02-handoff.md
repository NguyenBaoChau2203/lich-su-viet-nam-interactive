# Bàn giao Phase 06 — Batch 2: Hoàn thiện dữ liệu nghiên cứu nhân vật lịch sử, câu chuyện và hình ảnh bối cảnh cấp quốc gia

Ngày 27/10/2026, Asia/Bangkok. Một agent chính; **self-review**. Nhánh `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Không stage/commit/push/PR/deploy hoặc ghi remote.

**Trạng thái cuối:** Hoàn thành Batch 2 (tối đa 10 nhân vật riêng biệt) ưu tiên các địa phương chưa có hồ sơ hoàn chỉnh (`24`, `25`, `31`, `37`, `38`, `40`, `42`, `44`, `46`, `48`). Kết quả thẩm định độc lập: **7 nhân vật hoàn thiện** hồ sơ nghiên cứu đạt chuẩn (câu chuyện 415–483 từ, trích dẫn từng đoạn `[[cite:...]]`, ảnh bối cảnh minh bạch có nhãn trung thực, kích thước và mã băm SHA-256 thực tế, 49 claims mới); **3 nhân vật giữ lại (`held`)** với lý do thiếu chứng cứ xác đáng (`new:luong-van-tuy` ảnh bài viết gốc bị lỗi CDN 404; `new:nguyen-thai-hoc` văn bản nguồn TX Buôn Hồ quá ngắn chỉ 130 từ và thiếu ảnh; `new:thai-phien` nguồn Mặt trận Đà Nẵng chỉ liệt kê tên, thiếu dữ liệu tiểu sử chi tiết và thiếu ảnh). Bản kê manifest được nâng cấp lên **version 16** với SHA-256 `89b6a8aa36b2f152114e36a84d363fe67b46ebd82065a85aee34a98f1bb8d2c7` (chờ chủ dự án duyệt). Số địa phương sẵn sàng rà soát tăng từ 9 lên **16/34** (`01`, `04`, `08`, `11`, `12`, `14`, `19`, `22`, `24`, `31`, `33`, `38`, `40`, `42`, `44`, `46`). Số nhân vật hoàn thiện đạt **17/35**.

---

## 1. Phạm vi thực hiện và thẩm quyền

- Tuân thủ nghiêm ngặt chuẩn prompt `docs/agent/AI-AGENT-PROMPT-STANDARD.md` và kế hoạch Phase 06 trong `docs/superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md`.
- Tuyệt đối không bịa đặt dữ kiện lịch sử, nhân vật, năm sinh/mất, danh hiệu, địa bàn hoạt động hay trích dẫn.
- Giữ vững nguyên tắc minh bạch hình ảnh: Không gán ảnh di tích/tượng đài hay sự kiện làm chân dung nhân vật; tất cả ảnh bối cảnh đều dán nhãn bắt buộc: `"Tư liệu bối cảnh, không phải chân dung."` với tác giả trung thực `null` và institution rõ ràng.
- Không tự tiện giảm mẫu hay gạch tên nhân vật để đạt chỉ tiêu số lượng. Nhân vật chưa đủ bằng chứng được giữ lại công khai với khoảng trống chứng cứ cụ thể (`gaps`).
- Toàn bộ công việc thực hiện trên bản sao cục bộ, không ghi vào database Supabase từ xa, không thực hiện commit hay push lên git repository.

---

## 2. Kết quả chi tiết Batch 2 (10 nhân vật được thẩm tra)

| STT | Mã nhân vật | Tên nhân vật | Địa phương ưu tiên | Kết quả thẩm tra | Minh chứng & Khoảng trống chứng cứ |
| --- | --- | --- | --- | --- | --- |
| 1 | `new:ngo-gia-tu` | Ngô Gia Tự | `24` (Bắc Ninh) | **complete** | Câu chuyện 479 từ; ảnh tư liệu BTLSQG (`media-research-ngo-gia-tu-btls`, 320×246, 12253 bytes, SHA-256 `7c19b1bd...`). Khắc họa vai trò khởi xướng phong trào vô sản hóa năm 1928 và Bí thư Xứ ủy Nam Kỳ. |
| 2 | `new:nguyen-duc-canh` | Nguyễn Đức Cảnh | `31` (Hải Phòng) | **complete** | Câu chuyện 415 từ; ảnh di tích đền thờ Cổng TTĐT TP Hải Phòng (`media-research-nguyen-duc-canh-memorial`, 640×427, 41785 bytes, SHA-256 `088a5e83...`). Khắc họa vai trò Bí thư đầu tiên Đảng bộ Hải Phòng và sáng lập Tổng Công hội Đỏ Bắc Kỳ. |
| 3 | `new:to-vinh-dien` | Tô Vĩnh Diện | `38` (Thanh Hóa) | **complete** | Câu chuyện 438 từ; ảnh tư liệu BTLSQG (`media-research-to-vinh-dien-btls`, 232×310, 16707 bytes, SHA-256 `56b32dc5...`). Khắc họa tấm gương lấy thân chèn pháo đêm 1/2/1954 trên dốc Chuối trong chiến dịch Điện Biên Phủ. |
| 4 | `new:nguyen-thi-minh-khai` | Nguyễn Thị Minh Khai | `40` (Nghệ An) | **complete** | Câu chuyện 439 từ; ảnh tư liệu BTLSQG (`media-research-nguyen-thi-minh-khai-btls`, 300×432, 34684 bytes, SHA-256 `0a852d7d...`). Khắc họa bài tham luận tại Đại hội VII Quốc tế Cộng sản năm 1935 và vai trò Bí thư Thành ủy Sài Gòn - Chợ Lớn. |
| 5 | `new:tran-phu` | Trần Phú | `42` (Hà Tĩnh) | **complete** | Câu chuyện 466 từ; ảnh tư liệu BTLSQG (`media-research-tran-phu-btls`, 480×419, 44622 bytes, SHA-256 `48a37d8a...`). Khắc họa việc soạn thảo Luận cương Chính trị tháng 10/1930 và lời căn dặn bất hủ: "Hãy giữ vững chí khí chiến đấu!". |
| 6 | `figure:dff00764-7ef6-4b82-981e-9f66f080d653` | Lê Duẩn | `44` (Quảng Trị) | **complete** | Câu chuyện 456 từ; ảnh tư liệu Cổng TTĐT huyện Vĩnh Linh (`media-research-le-duan-vinh-linh`, 607×458, 43364 bytes, SHA-256 `593a0082...`). Khắc họa Đề cương cách mạng miền Nam năm 1956 và 26 năm lãnh đạo kháng chiến giải phóng dân tộc. |
| 7 | `new:nguyen-chi-dieu` | Nguyễn Chí Diểu | `46` (Thừa Thiên Huế) | **complete** | Câu chuyện 483 từ; ảnh tư liệu Sở VHTT Thừa Thiên Huế (`media-research-nguyen-chi-dieu-hue`, 2560×1703, 1055744 bytes, SHA-256 `e9abc3b0...`). Khắc họa vai trò Ủy viên Trung ương Đảng khóa I và lãnh đạo phong trào Mặt trận Dân chủ tại Trung Kỳ 1936–1939. |
| 8 | `new:luong-van-tuy` | Lương Văn Tụy | `37` (Ninh Bình) | **held** (`needs_evidence`) | Ảnh đính kèm trong bài viết gốc Báo Ninh Bình trả về HTTP 404 do máy chủ đã thanh lọc tệp tải lên năm 2012; thiếu ảnh tư liệu bối cảnh hoặc chân dung được kiểm chứng trực tiếp. |
| 9 | `new:nguyen-thai-hoc` | Nguyễn Thái Học | `25` (Phú Thọ) | **held** (`needs_evidence`) | Văn bản nguồn trên trang Cổng thông tin thị xã Buôn Hồ quá ngắn (130 từ), không đủ dữ kiện độc lập để biên soạn câu chuyện 350 từ có trích dẫn mà không suy diễn; trang nguồn không có ảnh chân dung hay ảnh bối cảnh. |
| 10 | `new:thai-phien` | Thái Phiên | `48` (Đà Nẵng) | **held** (`needs_evidence`) | Văn bản nguồn trên trang Mặt trận Đà Nẵng chỉ liệt kê tên trong danh sách chí sĩ khởi nghĩa năm 1916; thiếu hồ sơ tiểu sử chi tiết để xác lập câu chuyện độc lập; thiếu ảnh chân dung hoặc tư liệu bối cảnh. |

---

## 3. Thống kê sổ bộ nghiên cứu cấp quốc gia (National V1)

- **Manifest:** Version 16, SHA-256 `89b6a8aa36b2f152114e36a84d363fe67b46ebd82065a85aee34a98f1bb8d2c7`. Trạng thái phê duyệt: `pending` (chờ chủ dự án phê duyệt bản kê v16).
- **Tiến độ bao phủ địa phương:**
  - Tổng số địa phương tham chiếu: 34 (`VN-34-2025`).
  - Sẵn sàng rà soát (`ready_for_review`): **16/34** (`01`, `04`, `08`, `11`, `12`, `14`, `19`, `22`, `24`, `31`, `33`, `38`, `40`, `42`, `44`, `46`).
  - Đang nghiên cứu (`researching`): **18/34**.
- **Tiến độ nhân vật trong danh mục được chọn:**
  - Tổng số nhân vật được đề xuất chọn: 35.
  - Hoàn thiện đầy đủ (`complete`): **17/35** (Bế Văn Đàn, Đội Cấn, Kim Đồng, Lê Duẩn, Lò Văn Giá, Ngô Gia Tự, Nguyễn Chí Diểu, Nguyễn Đức Cảnh, Nguyễn Thị Minh Khai, Tạ Xuân Thu, Tô Hiệu, Tô Vĩnh Diện, Trần Can, Trần Phú, Trần Quốc Mạnh, Văn Tiến Dũng, Vũ Văn Hiếu).
  - Chưa hoàn thiện (`incomplete` / `needs_evidence`): **18/35**.
  - Nhân vật giữ lại xem xét riêng (`held`): 18.
- **Dữ liệu bằng chứng:**
  - Tổng số claims: 318 (270 accepted, 48 held).
  - Tổng số tư liệu media: 27 (17 accepted, 10 held). Toàn bộ 17 ảnh accepted đều có kích thước thực tế, mã băm SHA-256 và cơ sở sử dụng `coursework_reference`.
  - Tổng số câu chuyện: 17 accepted stories (350–700 words, 100% đoạn văn có trích dẫn nguồn).

---

## 4. Các tệp tin đã thay đổi và cập nhật

### Dữ liệu gói nghiên cứu (`supabase/content/local-heroes/national-v1/`)
- `stories.json`: Thêm 7 câu chuyện lịch sử mới được xác minh chặt chẽ (415–483 từ, trích dẫn từng đoạn).
- `media.json`: Thêm 7 bản ghi hình ảnh tư liệu bối cảnh có đo kích thước và băm SHA-256.
- `claims.json`: Bổ sung 49 claims mới (7 tiểu sử, 7 nhân dạng ảnh, 35 luận cứ từng đoạn câu chuyện; cập nhật 1 claim thời kỳ sang verified).
- `people.json`: Cập nhật `mainStoryId`, `representativeMediaId`, `biography`, `claimIds` cho 7 nhân vật.
- `roster.json`: Cập nhật trạng thái `complete` cho 7 nhân vật; ghi nhận khoảng trống chứng cứ (`gaps`) chi tiết cho 3 nhân vật held.
- `coverage.json`: Cập nhật `completePersonKeys` và chuyển 7 địa phương mới sang `ready_for_review`.
- `manifest.json`: Nâng phiên bản lên 16, cập nhật mã băm SHA-256 cho toàn bộ 9 tệp tin.

### Kiểm thử và tài liệu (`tests/` & `docs/`)
- `tests/unit/local-heroes-content.test.ts`: Cập nhật ngưỡng kỳ vọng tương thích với manifest v16 (17 nhân vật hoàn chỉnh, 16 địa phương đại diện, mã băm v16).
- `scripts/content/sync-docs.mjs`: Sửa lỗi hiển thị `manifest.version`, đồng bộ hàng đợi Batch 2 và phân bổ Batch 3–4.
- `docs/content/local-heroes/coverage.md`: Cập nhật bảng theo dõi 34 địa phương tham chiếu (16 ready_for_review).
- `docs/content/local-heroes/roster.md`: Cập nhật trạng thái và khoảng trống chứng cứ của 53 danh tính (17 complete).
- `docs/content/local-heroes/phase-06-queue.md`: Ghi nhận kết quả thực hiện Batch 1 và Batch 2; phân bổ hàng đợi Batch 3, 4.
- `docs/content/local-heroes/media.md`: Lập danh mục chi tiết 17 hình ảnh đã nghiệm thu và 10 hình ảnh đang bảo lưu.
- `docs/content/local-heroes/claims.md`: Lập chỉ mục 318 claims kèm định vị nguồn cụ thể.

---

## 5. Bằng chứng kiểm tra và cổng chất lượng

| Lệnh kiểm thử | Kết quả | Chi tiết chứng minh |
| --- | --- | --- |
| `node scripts/content/check-local-heroes.mjs` | **valid: true, issues: []** (exit 0) | Cấu trúc gói v16, kiểm tra schema, quan hệ đối chiếu, câu chuyện và hình ảnh đều hợp lệ. |
| `node scripts/content/check-local-heroes.mjs --mode release` | **issues: 34 (COVERAGE), 1 (APPROVAL), 1 (ROSTER)** (exit 1/2) | Cơ chế kiểm soát phát hành hoạt động chính xác: từ chối xuất bản release khi chưa đủ 34 địa phương và chưa có chữ ký duyệt manifest của chủ dự án. |
| `pnpm exec vitest run tests/unit/local-heroes-content.test.ts` | **29/29 passed** (exit 0) | Toàn bộ 29 ca kiểm thử cấu trúc và negative cases đạt chuẩn. |
| `pnpm verify` | **PASSED** (exit 0) | Toàn bộ cổng chất lượng repo: agent check + data check + lint + typecheck + unit tests + production build. |
| `git diff --check` | **PASSED** (exit 0) | Sạch sẽ, không có lỗi whitespace hay conflict markers. |

---

## 6. Hàng đợi thực hiện tiếp theo (Batch 3)

Batch 3 sẽ xử lý tối đa 10 nhân vật tiếp theo theo mã địa phương ưu tiên chưa có hồ sơ hoàn chỉnh:
1. `new:pham-van-dong` (`51` Quảng Ngãi)
2. `new:dinh-nup` (`52` Gia Lai)
3. `new:vo-van-ky` (`56` Khánh Hòa)
4. `new:y-bloc-eban` (`66` Đắk Lắk)
5. `new:le-thi-pha` (`68` Lâm Đồng)
6. `new:huynh-van-nghe` (`75` Đồng Nai)
7. `figure:016a56fa-2a90-4bf4-ae8f-6975f0486282` - Nguyễn Văn Trỗi (`79` TP. Hồ Chí Minh)
8. `new:hoang-le-kha` (`80` Tây Ninh)
9. `new:tran-thi-nhuong` (`82` Đồng Tháp)
10. `new:pham-hung` (`86` Vĩnh Long)
Kèm theo tiếp tục đối chiếu nguồn bổ sung cho 5 nhân vật held của Batch 1 & 2 (`15` Hoàng Trường Minh, `20` Hoàng Văn Thụ, `25` Nguyễn Thái Học, `37` Lương Văn Tụy, `48` Thái Phiên).
