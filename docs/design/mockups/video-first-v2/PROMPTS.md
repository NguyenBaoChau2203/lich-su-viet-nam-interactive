# Prompt tạo mockup — trải nghiệm lịch sử Việt Nam bằng video và hình ảnh

> **Đã được thay thế:** Bộ prompt theo từng ảnh trong file này chỉ được giữ để đối chiếu. Khi tạo project mới trong Stitch, hãy dùng [`../../stitch/DESIGN.md`](../../stitch/DESIGN.md) để Stitch hiểu toàn bộ sản phẩm, design system và luồng nhiều màn hình.

Tài liệu này dùng được với Stitch, công cụ tạo UI từ prompt hoặc công cụ sinh ảnh giao diện. Mỗi prompt tạo **một màn hình desktop 1440 × 1024**. Khi công cụ hỗ trợ project/reference, hãy dùng ảnh Trang chủ làm style reference cho bốn màn hình sau.

## 1. Nguyên tắc chung

### Mục tiêu sản phẩm

Thiết kế website dành cho học sinh lớp 12 khám phá các câu chuyện lịch sử Việt Nam bằng video, hình ảnh và âm thanh. Câu chuyện là đơn vị nội dung trung tâm. Chủ đề, mốc thời gian và địa điểm là ba cách tìm câu chuyện. Văn bản dài và nguồn học thuật chỉ xuất hiện khi người dùng chủ động mở.

### Hệ thiết kế bắt buộc

- Desktop 1440 × 1024, lưới 12 cột, lề 64–72 px.
- Phong cách bảo tàng số đương đại, rõ ràng, điềm tĩnh và có tính biên tập.
- Nền trắng ngà `#F5F3EE`, chữ than `#181816`, màu nhấn đỏ gạch `#A23A2E`, màu phụ xám `#77736B`, đường kẻ `#D8D3C9`.
- Tiêu đề dùng serif hỗ trợ tiếng Việt như **Source Serif 4**. Giao diện dùng sans hỗ trợ tiếng Việt như **Be Vietnam Pro**.
- Góc vuông hoặc bo tối đa 6 px. Không dùng thẻ bo tròn hàng loạt.
- Header thống nhất: logo chữ `SỬ KỂ`; liên kết `Khám phá`, `Chủ đề`, `Dòng thời gian`, `Địa điểm`; bên phải có tìm kiếm và nút `Aa`.
- Mỗi màn hình có một nhiệm vụ chính và một nút hành động chính.
- Ảnh/video trong mockup phải là **khung giữ chỗ trung tính**, ghi rõ `VIDEO SẼ BỔ SUNG`, `ẢNH TƯ LIỆU SẼ BỔ SUNG` hoặc `BẢN ĐỒ KHÁI QUÁT`. Không tạo ảnh chiến tranh, nhân vật, tài liệu hoặc hiện vật lịch sử giả.
- Dùng hình chữ nhật xám nhạt, filmstrip, waveform hoặc biểu tượng play để biểu diễn media sẽ được bổ sung.
- Tương phản WCAG AA, trạng thái focus rõ, cỡ chữ thân bài ít nhất 16 px.
- Giao diện phải trông như sản phẩm nội dung thực sự có thể lập trình, không phải poster quảng cáo.

### Điều cần tránh

- Không dùng gradient, glassmorphism, neon, glow hoặc nền tím xanh kiểu sản phẩm AI.
- Không dùng slogan trang trí, câu trích dẫn giả, số liệu giả hoặc logo đối tác giả.
- Không dùng ảnh lịch sử sinh bằng AI làm nội dung.
- Không tạo dashboard với nhiều thẻ giống nhau.
- Không biến nguồn tư liệu thành nội dung chính của trang.
- Không đặt bản đồ toàn màn hình khi địa điểm chỉ đóng vai trò metadata.
- Không dùng văn bản dài để lấp khoảng trống.

---

## 2. Prompt 01 — Trang chủ

```text
Create one high-fidelity desktop web UI mockup at 1440x1024 for the homepage of “SỬ KỂ”, a Vietnamese grade-12 history video storytelling website.

Use a contemporary digital museum design, not a marketing landing page. Apply a 12-column grid, 68px side margins, warm ivory background #F5F3EE, charcoal text #181816, brick red accent #A23A2E, muted gray #77736B, fine divider #D8D3C9. Headings use Source Serif 4 with excellent Vietnamese diacritics; UI uses Be Vietnam Pro. Mostly square corners, maximum 6px radius.

Header: wordmark “SỬ KỂ”; navigation “Khám phá”, “Chủ đề”, “Dòng thời gian”, “Địa điểm”; right-side search icon and “Aa”.

Main task: let the learner start watching or choose an exploration path.

Top content is a featured-story module, not a decorative hero. Left 5 columns: eyebrow “CÂU CHUYỆN NỔI BẬT · 1954”, H1 “Chiến dịch Điện Biên Phủ”, one short line “Một câu chuyện được kể bằng video, hình ảnh và ký ức.”, primary button “Xem câu chuyện”, secondary text link “Xem nguồn giới thiệu”. Right 7 columns: large neutral 16:9 media placeholder with simple play icon and exact label “VIDEO SẼ BỔ SUNG”; no generated historical scene.

Below, add heading “Bạn muốn bắt đầu từ đâu?” and three distinct editorial navigation rows, not rounded cards: “Theo chủ đề”, “Theo thời gian”, “Theo địa điểm”. Each row has a short one-line explanation, an abstract structural icon, and an arrow. Add a restrained strip “Câu chuyện mới” with three compact video poster placeholders and titles: “Toàn quốc kháng chiến”, “Chiến dịch Biên giới”, “Điện Biên Phủ”.

Keep hierarchy obvious, content sparse, media-first and codeable. No fake archival imagery, no gradients, no decorative slogans, no metrics, no dashboard card grid.
```

---

## 3. Prompt 02 — Trang khám phá

```text
Create one high-fidelity desktop web UI mockup at 1440x1024 for the “Khám phá” page of the same SỬ KỂ website. Reuse the exact design system, header, colors and typography from the homepage.

Page goal: browse the same history stories through topic, time or place without creating three disconnected websites.

Header navigation is identical; “Khám phá” is active with a thin brick-red underline. Page title “Khám phá câu chuyện”. Under it is a segmented text control with exactly three modes: “Chủ đề”, “Thời gian”, “Địa điểm”. Select “Chủ đề”. Use underline and type weight rather than rounded pills.

Left sidebar, 3 columns: filter heading “Lọc câu chuyện”; groups “Giai đoạn”, “Thời lượng”, “Loại nội dung”; simple checkboxes; clear action “Xóa bộ lọc”.

Main area, 9 columns: a restrained list/grid of six story results. Each result uses a 16:9 neutral media placeholder labeled “VIDEO / ẢNH SẼ BỔ SUNG”, then year, title, topic and duration placeholder “— phút”. Use varied editorial rhythm: one featured wide item followed by smaller two-column items, not six identical rounded cards.

At top right show result count “25 câu chuyện” and a compact sort control “Theo thời gian”. Add a small preview of how the other modes work below the tab labels: time mode uses a horizontal chronological line; place mode uses a list-plus-small-map concept. Do not show them as active content.

No fake historical images, no oversized marketing hero, no gradients, no decorative copy, no dashboard appearance.
```

---

## 4. Prompt 03 — Trang chủ đề

```text
Create one high-fidelity desktop web UI mockup at 1440x1024 for a topic collection page of the same SỬ KỂ website. Keep the exact shared header and design system.

Route concept: /chu-de/khang-chien-chong-phap. Page goal: present an ordered viewing path, like a curated season of history stories.

Top: small breadcrumb “Chủ đề / 1946–1954”; H1 “Kháng chiến chống thực dân Pháp”; one concise two-line introduction; metadata “3 câu chuyện · 1 video giới thiệu”. Right side contains a neutral 16:9 trailer placeholder labeled “VIDEO GIỚI THIỆU SẼ BỔ SUNG” with play icon. Primary button “Bắt đầu câu chuyện đầu tiên”.

Below, heading “Xem theo trình tự”. Create a clear vertical sequence line with three numbered entries: “01 · Toàn quốc kháng chiến · 1946”, “02 · Chiến dịch Biên giới · 1950”, “03 · Chiến dịch Điện Biên Phủ · 1954”. Each entry has a neutral media thumbnail placeholder, title, one short sentence, and a play/link action. Make the third entry visually current using a brick-red marker.

At the right edge or bottom, include a quiet metadata block “Địa điểm liên quan” listing “Hà Nội”, “Cao Bằng”, “Điện Biên” as text links, plus “Xem trên bản đồ”. It must support the collection without competing with the stories.

Avoid a marketing hero, fake archive photos, repeated card grid, long historical essay, fake quotes and ornamental slogans.
```

---

## 5. Prompt 04 — Trang câu chuyện

```text
Create one high-fidelity desktop web UI mockup at 1440x1024 for the primary story-watching page of the same SỬ KỂ website. Reuse the exact shared header, grid, typography and palette.

Route concept: /cau-chuyen/chien-dich-dien-bien-phu. This is the most important page. The learner should watch first and read only when needed.

Compact top line: breadcrumb “Khám phá / 1954”; H1 “Chiến dịch Điện Biên Phủ”; date “13.03 — 07.05.1954”; topic link “Kháng chiến chống thực dân Pháp”. Keep this header under 170px tall.

Main area: 9-column large 16:9 video player placeholder with charcoal background, centered play button, progress bar and accessible controls. Exact label inside: “VIDEO CÂU CHUYỆN SẼ BỔ SUNG”. No synthetic battle scene or tactical map. Right 3-column chapter rail titled “Trong câu chuyện” with four rows and no invented timecodes: “Bối cảnh”, “Quyết định”, “Diễn biến”, “Sau chiến dịch”.

Below the player, use text tabs “Tóm tắt”, “Hình ảnh”, “Chuyện bên lề”, “Kiểm chứng”; select “Tóm tắt”. Show only three short key points and a button “Xem bằng hình ảnh”. Add a collapsed source disclosure “Nguồn của câu chuyện · 4 mục”, not an exposed bibliography.

At the bottom edge preview one related-story row with media placeholder and label “Chuyện bên lề”.

Prioritize the player, keyboard focus, captions, low reading burden and clear next actions. No decorative poster layout, fake archive materials, long article, fake durations, gradients or excessive rounded cards.
```

---

## 6. Prompt 05 — Trang địa điểm

```text
Create one high-fidelity desktop web UI mockup at 1440x1024 for a history location page of the same SỬ KỂ website. Reuse the exact header and design system. “Địa điểm” is active.

Route concept: /dia-diem/dien-bien-phu. Page goal: explain where the place is and lead to stories connected with it. This is not a GIS dashboard and not a long geography article.

Top left: eyebrow “ĐỊA ĐIỂM LỊCH SỬ”; H1 “Điện Biên Phủ”; concise description “Một địa điểm, nhiều lớp câu chuyện.”; metadata “Điện Biên · Tây Bắc Việt Nam”.

Top right: a simple pale locator-map placeholder with a single dot and exact label “BẢN ĐỒ KHÁI QUÁT”; no tactical routes, troop arrows, fake terrain or invented boundaries. Add a small toggle-like text action “Xem danh sách thay thế”.

Below, large heading “Những câu chuyện diễn ra tại đây”. Present three media-led rows with neutral 16:9 placeholders labeled “VIDEO / ẢNH SẼ BỔ SUNG”. First story: “Chiến dịch Điện Biên Phủ · 1954”. The other two rows use safe placeholders “Câu chuyện đang biên tập” rather than invented event facts. Each row shows topic, year when known, and action “Xem câu chuyện”.

Add a small section “Địa điểm trong câu chuyện” explaining visually that maps appear inside a video only when routes, terrain or spatial change help the learner understand. Use a tiny schematic map placeholder and three short labels, no paragraph.

No full-screen map, no fake cartography, no historical AI imagery, no cards with rounded corners, no dashboard filters, no promotional slogans.
```

---

## 7. Prompt kiểm tra tính nhất quán

Dùng prompt sau sau khi đã tạo đủ năm màn hình:

```text
Audit these five UI mockups as one product. Keep the content architecture unchanged. Standardize the header, logo, navigation order, 12-column grid, margins, typography, colors, control shapes, focus treatment and media-placeholder language. Remove any generated historical image, fake quote, fake duration, fake statistic, decorative slogan, gradient, glow, glass panel or excessive rounded card. Ensure every screen has one obvious primary task and that Topic, Time and Place all lead to the same Story page model. Return corrected screens separately, one horizontal screen per image.
```

## 8. Ghi chú khi thay dữ liệu thật

- Chỉ thay khung media bằng ảnh/video đã xác minh nguồn và quyền sử dụng.
- Giữ tỷ lệ khung để tránh làm vỡ bố cục.
- Mỗi media lưu chú thích, nguồn, quyền sử dụng và mô tả tiếp cận.
- Video có phụ đề và bản chép lời; nguồn chi tiết nằm trong phần `Kiểm chứng`.
- Bản đồ dùng khi vị trí giúp hiểu câu chuyện; luôn có danh sách văn bản thay thế.
