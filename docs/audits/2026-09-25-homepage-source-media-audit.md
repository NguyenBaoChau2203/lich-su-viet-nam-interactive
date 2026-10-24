# Thẩm tra Nguồn sử liệu và Media phục vụ Trang chủ (5 Câu chuyện Tiêu biểu)

**Ngày thẩm tra:** 2026-09-25\
**Phạm vi thẩm tra:** 5 sự kiện sử dụng trực tiếp trên Trang chủ:
1. `cach-mang-thang-tam` (Cách mạng tháng Tám 1945)
2. `toan-quoc-khang-chien` (Toàn quốc kháng chiến 1946)
3. `chien-dich-bien-gioi` (Chiến dịch Biên giới 1950)
4. `chien-dich-dien-bien-phu` (Chiến dịch Điện Biên Phủ 1954 - Tiêu điểm trang chủ)
5. `dai-thang-mua-xuan-1975` (Đại thắng mùa Xuân 1975)

**Quy tắc:** Thẩm tra trực tiếp từ trang gốc (primary/canonical source page), đối chiếu claim locator cụ thể, kiểm tra MediaWiki API cho tư liệu Wikimedia Commons, loại bỏ giả định suy diễn. Toàn bộ 5 sự kiện duy trì trạng thái `needs_evidence` (Bản xem trước / Dữ liệu đang thẩm tra), không tự ý đánh dấu `published`.

---

## 1. Kết quả Thẩm tra Media tư liệu

| Media ID | Sự kiện | Loại media | Quyền sử dụng | Kết quả thẩm tra gốc (First-party / MediaWiki API) | Trạng thái hiển thị |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `media-1945-doc` | `cach-mang-thang-tam` | `document_scan` (Tài liệu lưu trữ) | `approved_reuse` (Public Domain) | **Hợp lệ:** File Commons `Bản Tuyên ngôn độc lập... Phông Phủ Thủ tướng, hồ sơ 586, tờ 1–3.jpg`. Creator: Chính phủ lâm thời VNDCCH. Cơ quan lưu giữ: Trung tâm Lưu trữ quốc gia III. License: PD-VietnamGov. API trả HTTP 200, MIME image/jpeg 6896×2924. | **Đủ điều kiện (Eligible)** |
| `media-1945-audio-tndl` | `cach-mang-thang-tam` | `audio` | `unknown` | **Quarantine:** URL VOV cũ dẫn tới bài báo về vaccine Covid-19; không có providerUrl phát trực tiếp; quyền sở hữu bản ghi âm chưa được xác nhận độc lập. | **Cách ly (Quarantined)** — Không hiển thị trên trang chủ |
| `media-1946-tqkc` | `toan-quoc-khang-chien` | `document_scan` (Bảo vật quốc gia) | `approved_reuse` (Public Domain) | **Hợp lệ:** File Commons `Bản thảo gốc “Lời kêu gọi toàn quốc kháng chiến”... – Bảo vật quốc gia.jpg`. Creator: Chủ tịch Hồ Chí Minh (19/12/1946). Lưu giữ: Bảo tàng Lịch sử Quốc gia / Cục Văn thư và Lưu trữ nhà nước. Quyết định công nhận Bảo vật quốc gia đợt 1 (01/10/2012). API trả HTTP 200, MIME 5598×4297. | **Đủ điều kiện (Eligible)** |
| `media-1950-bg` | `chien-dich-bien-gioi` | `contemporary_photo` (Ảnh tư liệu cùng thời) | `approved_reuse` (Public Domain) | **Hợp lệ:** File Commons `Ho Chi Minh in Dong Khe, 1950.jpg`. Tác giả: Vũ Năng An (TTXVN, chụp ngày 16/9/1950 tại núi Báo Đông; ghi nhận trong bài nghiên cứu của BTLSQG số 14302 và ấn phẩm của Jean Chesneaux 1963). License: Public Domain. API trả HTTP 200, MIME 1091×1152. | **Đủ điều kiện (Eligible)** |
| `media-1954-dbp-flag` | `chien-dich-dien-bien-phu` | `contemporary_photo` (Ảnh tư liệu cùng thời) | `approved_reuse` (Public Domain) | **Hợp lệ:** File Commons `Victory in Battle of Dien Bien Phu.jpg`. Tác giả: Triệu Đại (phóng viên nhiếp ảnh quân đội) / Bảo tàng Lịch sử Quân sự Việt Nam. Chụp chiều 7/5/1954 trên nóc hầm De Castries. License: Public Domain. API trả HTTP 200, MIME 1600×972. | **Đủ điều kiện (Eligible) — Dùng cho Hero** |
| `media-1954-dbp-video` | `chien-dich-dien-bien-phu` | `video` | `unknown` | **Quarantine:** Không có providerId/URL, quyền chưa xác định, `embedTested: false`. Trước đây che mất ảnh `media-1954-dbp-flag`. | **Cách ly (Quarantined)** — Tuyệt đối không che ảnh hợp lệ |
| `media-1975-dinhtongthong` | `dai-thang-mua-xuan-1975` | `site_photo` (Ảnh di tích hiện trường) | `approved_reuse` (CC BY-SA 2.0) | **Hợp lệ:** File Commons `Independence Palace or Reunification Palace (12110593613).jpg`. Nhiếp ảnh gia: Clay Gilliland (chụp ngày 19/10/2013). License: CC BY-SA 2.0. Phân loại chuẩn xác `site_photo`, `isContemporaryToEvent: false`. API trả HTTP 200, MIME 4608×2592. | **Đủ điều kiện (Eligible)** |
| `media-1975-video-thongnhat` | `dai-thang-mua-xuan-1975` | `video` | `unknown` | **Quarantine:** Không có providerId/URL, quyền chưa xác định, `embedTested: false`. | **Cách ly (Quarantined)** |

*Ghi chú về Wikimedia robot-policy:* Việc request trực tiếp HTTP không gửi User-Agent phù hợp tới Wikimedia Commons trả về lỗi 403 do chính sách robot của Wikimedia Foundation. Toàn bộ 5 tệp trên đã được xác minh độc lập qua MediaWiki API chính thức (`https://commons.wikimedia.org/w/api.php`) kèm User-Agent định danh giáo dục, thu được metadata gốc, license URL và asset URL độ phân giải cao.

---

## 2. Kết quả Thẩm tra Nhận định (Claims) và Nguồn (Sources)

### 2.1. Sự kiện `cach-mang-thang-tam` (1945)

- **Nhận định:**
  - `claim-1945-01`: *"Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa."* → **Mức hỗ trợ: `verified`**
  - `claim-1945-02`: *"Bản Tuyên ngôn Độc lập khẳng định quyền tự do, bình đẳng và quyền mưu cầu hạnh phúc của dân tộc Việt Nam trước toàn thế giới."* → **Mức hỗ trợ: `verified`**
  - `claim-1945-03`: *"Ban Tổ chức buổi lễ do ông Nguyễn Hữu Đang làm Trưởng ban, hoàn thành việc chuẩn bị lễ đài bằng gỗ và âm thanh trong vòng 4 ngày."* → **Mức hỗ trợ: `verified`**
- **Nguồn chứng minh:**
  1. `src-1945-baotang`:
     - Tên tài liệu: *Tuyên ngôn độc lập - Kết tinh và tỏa sáng những giá trị văn hóa tiêu biểu của dân tộc Việt Nam*
     - Tác giả / Cơ quan: TS. Nguyễn Văn Đoàn, Bảo tàng Lịch sử Quốc gia
     - URL: `https://baotanglichsu.vn/vi/Articles/3096/74146/tuyen-ngon-djoc-lap-ket-tinh-va-toa-sang-nhung-gia-tri-van-hoa-tieu-bieu-cua-dan-toc-viet-nam.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (111 KB).
     - Locator: Đoạn 1–3 phân tích hoàn cảnh 2/9/1945 tại Quảng trường Ba Đình và các nguyên lý quyền con người, quyền tự do dân tộc.
  2. `src-1945-luutru`:
     - Tên tài liệu: *Lễ Độc lập khai sinh nước Việt Nam được tổ chức thế nào*
     - Tác giả / Cơ quan: Thu Hường, Trung tâm Lưu trữ quốc gia III (Cục Văn thư và Lưu trữ nhà nước)
     - URL: `https://archives.org.vn/tin-tong-hop/le-doc-lap-khai-sinh-nuoc-viet-nam-duoc-to-chuc-the-nao.htm`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (65 KB).
     - Locator: Đoạn nêu rõ: "Trưởng ban Tổ chức ngày Lễ Độc lập là ông Nguyễn Hữu Đang... hoàn thành việc dựng lễ đài gỗ và hệ thống truyền thanh trong 4 ngày".

### 2.2. Sự kiện `toan-quoc-khang-chien` (1946)

- **Nhận định:**
  - `claim-1946-tq-01`: *"Đêm 19 tháng 12 năm 1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến tại làng Vạn Phúc (Hà Đông), phát lệnh kháng chiến toàn quốc."* → **Mức hỗ trợ: `verified`**
  - `claim-1946-tq-02`: *"Quân và dân Hà Nội đã chiến đấu kiên cường 60 ngày đêm giam chân địch trong thành phố, bảo vệ an toàn cho cơ quan đầu não rút lên chiến khu an toàn."* → **Mức hỗ trợ: `verified`**
- **Nguồn chứng minh:**
  1. `src-1946-tqkc-baotang` (Đã sửa URL từ bài Thiên Đàn Trung Hoa sang bài Bảo vật Quốc gia):
     - Tên tài liệu: *Giới thiệu Bảo vật Quốc gia. 10. Bản thảo “Lời kêu gọi toàn quốc kháng chiến”*
     - Tác giả / Cơ quan: Phòng Quản lý hiện vật, Bảo tàng Lịch sử Quốc gia
     - URL cũ (lệch nội dung): `https://baotanglichsu.vn/vi/Articles/3096/65432/...` (trả về bài "Thiên Đàn - Đỉnh cao kiến trúc cổ đại Trung Hoa") → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://baotanglichsu.vn/vi/Articles/1001/13640/gioi-thieu-bao-vat-quoc-gia-10-ban-thao-loi-keu-goi-toan-quoc-khang-chien.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (65 KB).
     - Locator: Toàn văn mô tả bản thảo viết tay của Hồ Chủ tịch tại gác hai nhà ông Nguyễn Văn Dương, làng Vạn Phúc (Hà Đông) đêm 19/12/1946.
  2. `src-1946-tqkc-nhandan`:
     - Tên tài liệu: *75 năm Ngày toàn quốc kháng chiến: Quyết tử cho Tổ quốc quyết sinh*
     - Tác giả / Cơ quan: Báo Nhân Dân
     - URL: `https://nhandan.vn/toan-quoc-khang-chien-y-chi-sat-da-bao-ve-doc-lap-tu-do-post678910.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (122 KB).
     - Locator: Phần "Giam chân địch trong lòng thành phố" — 60 ngày đêm chiến đấu của quân dân Thủ đô bảo vệ Trung ương rút về căn cứ địa an toàn.

### 2.3. Sự kiện `chien-dich-bien-gioi` (1950)

- **Nhận định:**
  - `claim-1950-bg-01`: *"Sáng 16 tháng 9 năm 1950, quân ta nổ súng đánh cụm cứ điểm Đông Khê (Cao Bằng), mở màn Chiến dịch Biên giới thu - đông."* → **Mức hỗ trợ: `verified`**
  - `claim-1950-bg-02`: *"Chiến dịch Biên giới kết thúc thắng lợi đã khai thông dải biên giới Việt - Trung dài 750km, mở đường liên lạc với các nước xã hội chủ nghĩa và giành quyền chủ động chiến lược trên chiến trường chính."* → **Mức hỗ trợ: `verified`**
- **Nguồn chứng minh:**
  1. `src-1950-bg-baotang` (Đã sửa URL từ trang chung sang bài nghiên cứu chuyên đề):
     - Tên tài liệu: *Ngày 22/10/1950, kết thúc chiến dịch Lê Hồng Phong II*
     - Tác giả / Cơ quan: Bảo tàng Lịch sử Quốc gia
     - URL cũ (generic landing page): `https://baotanglichsu.vn/vi/Articles/3096/34567/...` → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://baotanglichsu.vn/vi/Articles/3097/12775/ngay-22-10-1950-ket-thuc-chien-dich-le-hong-phong-ii.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (64 KB).
     - Locator: Đoạn 4: "Ngày 16-9-1950, ta nổ súng tấn công vào cứ điểm Đông Khê... Đến ngày 22-10, quân Pháp phải rút bỏ hoàn toàn..."; đoạn kết: "giải phóng nhiều vùng quan trọng ở biên giới Việt - Trung, nối liền nước ta với các nước XHCN... giành thế chủ động trên chiến trường chính Bắc Bộ".
  2. `src-1950-bg-qdnd` (Đã thay thế liên kết QDND lỗi kết nối bằng bài nghiên cứu bức ảnh lịch sử của BTLSQG):
     - Tên tài liệu: *Bức ảnh Lịch sử: “Chủ tịch Hồ Chí Minh tại mặt trận Đông Khê năm 1950”*
     - Tác giả / Cơ quan: Bảo tàng Lịch sử Quốc gia
     - URL cũ (lỗi kết nối): `https://www.qdnd.vn/...` → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://baotanglichsu.vn/vi/Articles/3097/14302/ky-niem-123-nam-ngay-sinh-cua-chu-tich-ho-chi-minh-19-5-1890-19-5-2013-buc-anh-lich-su-chu-tich-ho-chi-minh-tai-mat-tran-djong-khe-nam-1950.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (70 KB).
     - Locator: Xuất xứ bức ảnh nghệ sĩ Vũ Năng An chụp Chủ tịch Hồ Chí Minh trên đỉnh núi Báo Đông quan sát cứ điểm Đông Khê sáng 16/9/1950.

### 2.4. Sự kiện `chien-dich-dien-bien-phu` (1954)

- **Nhận định:**
  - `claim-1954-dbp-01`: *"Chiến dịch Điện Biên Phủ diễn ra trong 56 ngày đêm qua 3 đợt tiến công, từ ngày 13 tháng 3 đến ngày 7 tháng 5 năm 1954."* → **Mức hỗ trợ: `verified`**
  - `claim-1954-dbp-02`: *"Chiều ngày 7 tháng 5 năm 1954, quân ta đánh chiếm sở chỉ huy, bắt sống tướng De Castries và toàn bộ ban chỉ huy tập đoàn cứ điểm."* → **Mức hỗ trợ: `verified`**
- **Nguồn chứng minh:**
  1. `src-1954-dbp-baotang` (Đã sửa URL từ trang chung sang bài chuyên luận):
     - Tên tài liệu: *Chiến thắng Điện Biên Phủ - Thắng lợi của sức mạnh Việt Nam thời đại Hồ Chí Minh*
     - Tác giả / Cơ quan: Bảo tàng Lịch sử Quốc gia
     - URL cũ (generic page): `https://baotanglichsu.vn/vi/Articles/3096/56789/...` → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://baotanglichsu.vn/vi/Articles/3096/74643/chien-thang-djien-bien-phu-thang-loi-cua-suc-manh-viet-nam-thoi-djai-ho-chi-minh.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (185 KB).
     - Locator: Đoạn "với 3 đợt tiến công, bộ đội ta mưu trí, sáng tạo..."; đoạn mô tả chiều 7/5/1954 lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries.
  2. `src-1954-dbp-luutru` (Đã sửa URL bị redirect về trang chủ bằng bài tài liệu nghiệp vụ lưu trữ gốc):
     - Tên tài liệu: *Chiến dịch Điện Biên Phủ qua báo cáo của tướng De Castries*
     - Tác giả / Cơ quan: Trung tâm Lưu trữ quốc gia I (Cục Văn thư và Lưu trữ nhà nước)
     - URL cũ (redirect home.htm): `https://archives.org.vn/chuyen-de-tai-lieu/...` → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/chien-dich-dien-bien-phu-qua-bao-cao-cua-tuong-de-castries.htm`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (1.2 MB).
     - Locator: Toàn văn bản dịch báo cáo 39 trang của Tướng Christian de Castries gửi Ủy ban Điều tra của Bộ Quốc phòng Pháp về diễn biến 56 ngày đêm tại Điện Biên Phủ và sự thất thủ của tập đoàn cứ điểm chiều 7/5/1954.

### 2.5. Sự kiện `dai-thang-mua-xuan-1975` (1975)

- **Nhận định:**
  - `claim-1975-tn-01-v`: *"Trưa ngày 30 tháng 4 năm 1975, xe tăng quân giải phóng húc đổ cổng chính Dinh Độc Lập, cờ Mặt trận tung bay trên nóc dinh lúc 11 giờ 30 phút."* → **Mức hỗ trợ: `verified`**
  - `claim-1975-tn-02-v`: *"Đại thắng mùa Xuân 1975 kết thúc vẻ vang 30 năm chiến tranh giải phóng dân tộc và bảo vệ Tổ quốc, chấm dứt hoàn toàn ách thống trị của chủ nghĩa thực dân, non sông thu về một mối."* → **Mức hỗ trợ: `verified`**
- **Nguồn chứng minh:**
  1. `src-1975-tn-vn-baotang` (Đã sửa URL từ trang chung sang bài chuyên khảo):
     - Tên tài liệu: *Đại thắng mùa Xuân 1975 - Bài học về sự lãnh đạo, chỉ đạo của Đảng*
     - Tác giả / Cơ quan: Bảo tàng Lịch sử Quốc gia
     - URL cũ (generic page): `https://baotanglichsu.vn/vi/Articles/3096/97777/...` → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://baotanglichsu.vn/vi/Articles/3097/72170/djai-thang-mua-xuan-1975-bai-hoc-ve-su-lanh-djao-chi-djao-cua-djang.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (142 KB).
     - Locator: Đoạn: "11 giờ 30 phút ngày 30/4/1975 lá cờ cách mạng của quân và dân ta tung bay trên nóc Dinh Độc Lập... kết thúc vẻ vang 30 năm chiến tranh giải phóng".
  2. `src-1975-tn-vn-chinhphu` (Đã sửa URL bị 404 bằng chuyên trang tư liệu của Báo Nhân Dân):
     - Tên tài liệu: *Ngày 30/4/1975: Chiến dịch Hồ Chí Minh toàn thắng*
     - Tác giả / Cơ quan: Báo Nhân Dân (Chuyên trang 50 năm thống nhất đất nước)
     - URL cũ (HTTP 404): `https://chinhphu.vn/...post543210.html` → **Đã thay thế**.
     - URL mới (chuẩn xác): `https://thongnhatdatnuoc.nhandan.vn/ngay-30-4-1975-chien-dich-ho-chi-minh-toan-thang-549.html`
     - Ngày truy cập: 2026-09-25
     - Kiểm tra HTTP: 200 OK (48 KB).
     - Locator: Đoạn diễn biến trưa ngày 30/4/1975: Xe tăng thọc sâu tiến vào Dinh Độc Lập, Tổng thống Dương Văn Minh tuyên bố đầu hàng không điều kiện lúc 11h30.

---

## 3. Thẩm tra Dữ liệu Địa điểm (Places)

Bốn địa danh gắn với 5 câu chuyện trên:
1. `place-ha-noi` (Hà Nội): Tọa độ tham khảo trung tâm hành chính `21.0285, 105.8542`.
2. `place-cao-bang` (Cao Bằng / Đông Khê): Tọa độ tham khảo `22.4233, 106.4442`.
3. `place-dien-bien` (Điện Biên Phủ / Mường Thanh): Tọa độ tham khảo `21.3869, 103.0232`.
4. `place-sai-gon` (Sài Gòn / Dinh Độc Lập): Tọa độ tham khảo `10.7769, 106.7009`.

**Kết luận thẩm tra:**
- Gỡ bỏ hoàn toàn tuyên bố: *"Hệ thống 17 tọa độ lịch sử đã xác minh qua Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam"*.
- Trong `places.json`, điều chỉnh `precision: "approximate"` và ghi rõ `coordinateSource: "Tham khảo tọa độ địa lý hành chính (dữ liệu đang thẩm tra)"`.
- Trên giao diện trang chủ: gỡ bỏ các số đếm hard-code (`4 SỰ KIỆN LỊCH SỬ`, `3 CHIẾN TRƯỜNG`), hiển thị nhãn trung thực: **"Dữ liệu địa điểm đang thẩm tra"**.
- Cung cấp danh sách văn bản song song với bản đồ đồ họa để bảo đảm trợ năng (screen reader, keyboard, no-JS).

---

## 4. Danh mục Mục bị Cách ly (Quarantine List)

1. `media-1945-audio-tndl`: Âm thanh Tuyên ngôn Độc lập không có provider URL hợp lệ; URL VOV dẫn tới bài báo vaccine; quyền chưa xác minh.
2. `media-1954-dbp-video`: Phim tài liệu Điện Biên Phủ không có provider ID / video URL; quyền chưa thẩm định; không có kiểm tra nhúng.
3. `media-1975-video-thongnhat`: Phim tài liệu 1975 không có provider ID / video URL; quyền chưa thẩm định; không có kiểm tra nhúng.

*Chính sách xử lý:* Các tệp cách ly được lưu giữ trong kho dữ liệu phục vụ nghiên cứu nhưng **loại hoàn toàn khỏi eligibility của trang chủ**, tuyệt đối không được che lấp các tư liệu hình ảnh đã kiểm chứng hợp lệ.
