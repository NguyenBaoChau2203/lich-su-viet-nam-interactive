# Stitch prompt — sửa P01, P02 và P08 trước khi duyệt desktop

## Cách dùng

1. Mở project Stitch hiện tại: `Vietnam History Documentary Archive`.
2. Chọn đúng ba frame hiện hành:
   - `P01 Trang chủ - Lịch sử Việt Nam` (`8aa7ab024503405e9967d8847b1dd58a`)
   - `P02 Khám phá - Lịch sử Việt Nam` (`1c493b3d461044f581ac806f737e5b7f`)
   - `P08 Trang câu chuyện: Điện Biên Phủ` (`40b3cee181ec4fc8a29b172976c7e3fc`)
3. Dán toàn bộ prompt trong khối bên dưới vào Stitch.
4. Không chọn hai frame đã đạt:
   - `P04 Dòng thời gian - Tương tác niên đại hoàn chỉnh`
   - `P05 Địa điểm - Bản đồ & Chuyển đổi danh mục thực tế`
5. Yêu cầu Stitch **sửa frame hiện có**, không tạo bản sao mới.

## Prompt dán vào Stitch

```text
EDIT THE THREE SELECTED EXISTING DESKTOP SCREENS ONLY:
- P01 Home
- P02 Explore
- P08 Story: Chiến dịch Điện Biên Phủ

This is a correction pass for content integrity, interaction and product consistency. Edit the selected frames in place. Do not create duplicate screens. Do not modify P04 Timeline or P05 Places. Keep every result at 1440px desktop width. Do not generate tablet or mobile screens in this pass.

PRODUCT PURPOSE
This product helps Vietnamese grade-12 learners understand history primarily through video, images, audio, time and place. It is a curated documentary storytelling experience. It is not a marketing landing page, a SaaS dashboard, a PDF library or a generic news website.

PRESERVE THE APPROVED VISUAL DIRECTION
- Keep the existing Cinematic Editorial Archive direction.
- Preserve Source Serif 4 for editorial headings, Be Vietnam Pro for UI/body and IBM Plex Mono only for years, timecodes and technical metadata.
- Preserve the warm paper, black ink, restrained vermilion and map-ink palette.
- Preserve square geometry, thin editorial rules, asymmetric composition and generous negative space.
- Keep media visually dominant and keep long text behind intentional user actions.
- Do not use gradients, glow, glassmorphism, floating blobs, oversized icons, rounded card grids, pill buttons, generic dashboard widgets or decorative archive textures.
- Do not turn all sections into boxed cards.
- Do not center every section.
- Do not redesign the project or invent another visual system.

HARD CONTENT-INTEGRITY RULES
- Delete every AI-generated or synthetic historical photograph currently shown on P01, P02 and P08.
- Never generate or display simulated soldiers, veterans, crowds, uniforms, battles, weapons, flags, bunkers, tanks, handwritten documents, archival photographs, historical portraits or tactical maps.
- Do not present generated imagery as historical evidence.
- Do not invent quotations, witness names, archive identifiers, source codes, institutions, citations, URLs, dates beyond the permitted sample years, video durations, coordinates, statistics, event counts or verification claims.
- Remove invented identifiers including examples such as `VN-MIL-01`, `QĐND-1994-T2`, `FR-SHD-09` and `ARCHIVE-VN12`.
- Remove claims such as `ĐÃ KIỂM CHỨNG HỌC THUẬT`, `ĐÃ XÁC MINH NGUỒN TƯ LIỆU HỌC THUẬT`, `phiên bản lưu trữ số hóa quốc gia` and any statement claiming that named institutions or witnesses have reviewed the content.
- Remove exact media durations such as `15:10 PHÚT`, `24:30 / 28:40` or any other duration that was not supplied.
- Remove copyright years or publication claims that imply this prototype is an official archive.
- Do not write explanatory historical paragraphs from model knowledge. Historical prose must remain an explicit editorial placeholder until a real source is supplied.

PERMITTED SAMPLE DATA ONLY
You may use these labels only to demonstrate information hierarchy:
- Years: 1945, 1946, 1950, 1954 and 1975.
- Story titles: `Cách mạng tháng Tám`, `Toàn quốc kháng chiến`, `Chiến dịch Biên giới`, `Chiến dịch Điện Biên Phủ`, `Đại thắng mùa Xuân 1975`.
- Places: `Hà Nội`, `Cao Bằng`, `Điện Biên Phủ`.

These labels are navigation examples, not permission to invent supporting facts.

SAFE PLACEHOLDER SYSTEM
Whenever a real approved asset or sourced paragraph is unavailable, use one of these exact visible labels:
- `TƯ LIỆU SẼ BỔ SUNG`
- `VIDEO SẼ BỔ SUNG`
- `ẢNH SẼ BỔ SUNG`
- `ÂM THANH SẼ BỔ SUNG`
- `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`
- `NGUỒN ĐANG CẬP NHẬT`
- `CHỜ THẨM ĐỊNH`
- `NỘI DUNG ĐANG BIÊN TẬP`

Use intentional media placeholders instead of stock or generated historical images:
- charcoal or warm-gray media fields;
- correct 16:9, 4:3 or portrait aspect ratios;
- restrained crop marks, a simple waveform, frame number or neutral play symbol;
- a visible placeholder label;
- no human silhouette that could be mistaken for a real person;
- no fake film damage, fake newspaper clipping or fake official stamp.

SHARED PUBLIC HEADER — APPLY IDENTICALLY TO P01, P02 AND P08
The public header must contain only:
- temporary wordmark `LỊCH SỬ VIỆT NAM`;
- `Khám phá`;
- `Dòng thời gian`;
- `Địa điểm`;
- search control with an accessible label;
- `Aa` reading-size control with an accessible label.

Remove the person icon, avatar, login, register, favorite, notification and account controls. Public learners do not have accounts in this MVP. Use the same header height, grid, type, focus style and active navigation rule as the approved P04 and P05 screens.

SHARED PUBLIC FOOTER — APPLY IDENTICALLY TO P01, P02 AND P08
Replace the current official-archive and verification claims with neutral prototype copy:
- Product label: `LỊCH SỬ VIỆT NAM`.
- Description: `Dự án học tập lịch sử Việt Nam qua câu chuyện, thời gian và địa điểm.`
- Status: `BẢN MẪU GIAO DIỆN · NỘI DUNG ĐANG BIÊN TẬP`.
- Links: `Phương pháp biên tập`, `Về dự án`, `Tiêu chuẩn nguồn`.

Do not name an institution unless one was supplied. Do not show a verified icon. Do not describe the product as a national archive or an official publication.

P01 HOME — CORRECTIONS
Goal: let a learner start a visual story quickly and understand the three discovery paths without reading a long introduction.

1. Opening story stage
- Keep one strong asymmetric opening composition.
- Use `CÂU CHUYỆN ĐƯỢC CHỌN · 1954` as the eyebrow.
- Use `Chiến dịch Điện Biên Phủ` as the H1.
- Replace the current historical image with a large 16:9 neutral video placeholder labelled `VIDEO SẼ BỔ SUNG`.
- Replace the descriptive paragraph with the exact text `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`.
- Keep the primary action `Xem câu chuyện`.
- Keep the secondary text action `Xem nguồn giới thiệu`, but show `NGUỒN ĐANG CẬP NHẬT` if opened.
- Keep a quiet `01 / 05` editorial index only as interface demonstration. Do not imply five published stories.
- Use rectangular controls and visible keyboard focus.

2. Three discovery paths
- Keep three clearly different editorial sections: `Theo chủ đề`, `Theo thời gian`, `Theo địa điểm`.
- Do not render them as three equal rounded cards.
- `Theo thời gian` must visually lead to the existing P04 Timeline frame.
- `Theo địa điểm` must visually lead to the existing P05 Places frame.
- Use abstract placeholders and permitted labels only.
- Keep supporting copy to one short line per path.

3. Newly edited area
- Keep a compact editorial row list.
- Each row may show only year, permitted story title, media placeholder state and `Xem câu chuyện`.
- Remove invented summaries, source counts, media durations and verification badges.

4. Prototype links
- Connect `Xem câu chuyện` to the existing P08 Story frame.
- Connect `Khám phá` to P02, `Dòng thời gian` to P04 and `Địa điểm` to P05.
- Do not leave primary actions as dead `#` links in exported HTML when an existing target frame is available.

P02 EXPLORE — CORRECTIONS AND FUNCTIONAL FILTERS
Goal: let learners narrow the sample story set by topic, time and place without a dense database appearance.

1. Editorial result layout
- Keep H1 `Khám phá câu chuyện`.
- Keep the three modes `Chủ đề`, `Thời gian`, `Địa điểm` as text tabs with a thin active rule. Do not use pills.
- Keep one featured result followed by alternating full-width StoryRows.
- Replace all five generated historical images with neutral media placeholders.
- Each result may show only a permitted year, permitted story title, a short category label, media state and `Xem câu chuyện`.
- For body copy use `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`.
- Do not show `ĐÃ KIỂM CHỨNG` on results without a real source record.
- Do not show exact durations.

2. Real filter behavior in exported HTML
- Implement the mode tabs as real buttons with `role="tab"`, `aria-selected`, `aria-controls` and associated tab panels.
- Support Left/Right arrow navigation between mode tabs.
- Use semantic rectangular controls for `Giai đoạn`, `Chủ đề`, `Loại media` and `Địa điểm`.
- Changing any filter must update the visible result set and a polite live-region result count.
- The result count must be labelled `KẾT QUẢ MẪU`, making clear that it counts prototype rows rather than published archive records.
- Implement `Xóa bộ lọc` so it actually restores every filter and every result.
- Reflect meaningful filter state in the URL query string using `URLSearchParams` and `history.replaceState`.
- Restore filter state from the URL on page load.
- Provide an empty state containing `Không có câu chuyện mẫu phù hợp` and a working `Xóa bộ lọc` action.
- Since this prototype contains only five sample results, remove the fake pagination controls. Do not show page 2, page 3 or a next-page button unless real additional rows exist.
- Keep the JavaScript small and local to this page.

3. Result navigation
- Connect the `Chiến dịch Điện Biên Phủ` result to the existing P08 Story frame.
- Other story links may remain visibly disabled or labelled `NỘI DUNG ĐANG BIÊN TẬP`; do not pretend their detail pages already exist.

P08 STORY — VIDEO-FIRST PAGE WITH HONEST EMPTY STATES
Goal: make the story page the main viewing experience while making transcript, side stories and evidence available on demand.

1. Story heading and media stage
- Keep `Chiến dịch Điện Biên Phủ` as H1 and `1954` as a navigation label.
- Remove every generated historical image from the video poster, gallery, evidence section and witness section.
- Replace the main player with a large black/charcoal 16:9 placeholder labelled `VIDEO SẼ BỔ SUNG`.
- Do not draw a fake player timeline with an invented duration. Show `--:-- / --:--` or a clear unavailable state.
- Keep visible controls or labels for captions and transcript as component states, but do not imply that a real recording is loaded.
- Above or beside the player, show the status `NỘI DUNG ĐANG BIÊN TẬP`.

2. Chapters
- Keep a compact chapter rail to demonstrate information architecture.
- Use neutral entries such as `CHƯƠNG 01 · TIÊU ĐỀ SẼ BỔ SUNG`.
- Do not invent chapter names, timecodes, tactics, quotations or claims.
- Do not highlight a chapter as currently playing while the video is unavailable.

3. Tab system
Create these five tabs:
- `Tóm tắt`
- `Hình ảnh`
- `Chuyện bên lề`
- `Bản chép lời`
- `Nguồn`

Implement them as an accessible tab interface:
- `role="tablist"`, `role="tab"` and `role="tabpanel"`;
- unique `id`, `aria-controls` and `aria-labelledby` pairs;
- update `aria-selected` and `tabindex` when selection changes;
- Left/Right arrow navigation, Home and End support;
- visible keyboard focus;
- only the active panel is displayed.

4. Safe content for each tab
- `Tóm tắt`: one brief placeholder statement and three editorial slots labelled `LUẬN ĐIỂM ĐANG BIÊN TẬP`; do not insert historical claims.
- `Hình ảnh`: empty state `ẢNH SẼ BỔ SUNG`; do not generate a gallery.
- `Chuyện bên lề`: empty state `LỜI KỂ NHÂN CHỨNG SẼ BỔ SUNG`; do not invent a veteran identity, portrait, quotation or testimony.
- `Bản chép lời`: empty state `BẢN CHÉP LỜI SẼ BỔ SUNG`; retain a disabled search/jump-to-video component state only if clearly labelled unavailable.
- `Nguồn`: show an empty evidence structure with field labels `Tài liệu`, `Tác giả hoặc cơ quan`, `Liên kết hoặc ký hiệu lưu trữ`, `Phạm vi được nguồn hỗ trợ`, `Ngày truy cập`, but fill no fictional values. Show `NGUỒN ĐANG CẬP NHẬT` and `CHỜ THẨM ĐỊNH`.

5. Place context
- Replace the current external street map or detailed map screenshot with a quiet schematic locator linked conceptually to P05.
- It may show only the label `Điện Biên Phủ` and `SƠ ĐỒ VỊ TRÍ ĐANG BIÊN TẬP`.
- Do not invent coordinates, routes, distances, battle positions or tactical annotations.
- Provide the text action `Xem trong trang Địa điểm`, targeting the existing P05 frame.

6. Continue exploring
- Replace invented next-story copy with `CÂU CHUYỆN TIẾP THEO SẼ ĐƯỢC BIÊN TẬP`.
- Keep actions back to Timeline and Places.

ACCESSIBILITY AND INTERACTION REQUIREMENTS FOR ALL THREE SCREENS
- Exactly one H1 per screen and logical heading order.
- WCAG AA text and control contrast.
- Every interactive control must be reachable and usable by keyboard.
- Visible focus treatment consistent with P04 and P05.
- Minimum 44 x 44px pointer targets where possible.
- No interaction may rely on hover alone.
- Use semantic `button`, `a`, `input`, `select` and tab elements/roles.
- Add useful `aria-label` text where the visible label is insufficient.
- Use polite live regions for changing result counts or media status.
- Respect `prefers-reduced-motion`; content order and meaning must remain intact when motion is disabled.
- Keep transitions restrained and use only opacity or transform.

CONSISTENCY REQUIREMENTS
- P01, P02 and P08 must use the same header, footer, grid, colors, spacing tokens and focus style as the current approved P04 and P05 screens.
- Reuse the same button and text-link language.
- Do not add account features, quizzes, AI chat, favorites, badges, scores, analytics or admin controls.
- Do not add new public screens.
- Do not alter P04 or P05.

FINAL SELF-AUDIT BEFORE RETURNING THE EDITED FRAMES
Confirm all of the following:
1. Exactly three existing frames were edited and no duplicate frame was created.
2. P04 Timeline and P05 Places are visually and functionally unchanged.
3. P01, P02 and P08 contain no generated historical photographs or simulated historical evidence.
4. The strings `VN-MIL-01`, `QĐND-1994-T2`, `FR-SHD-09`, `ARCHIVE-VN12`, `ĐÃ KIỂM CHỨNG HỌC THUẬT`, `ĐÃ XÁC MINH NGUỒN TƯ LIỆU HỌC THUẬT` and `phiên bản lưu trữ số hóa quốc gia` do not appear anywhere.
5. No unsupplied institution, source, quote, person, coordinate, duration or historical paragraph was introduced.
6. The public header contains no account or avatar icon.
7. P02 filters really change results, reset works, empty state works and URL query state is preserved.
8. P08 tabs work with mouse and keyboard and expose correct ARIA state.
9. Main links connect the five current product screens rather than using dead placeholder links.
10. Every absent asset or fact is represented by an explicit honest placeholder.

Return the three corrected desktop frames and a short audit summary listing what was removed, what interaction was implemented and whether every self-audit item passed. If any item cannot be completed, state which item failed instead of silently inventing content.
```

## Tiêu chí kiểm tra nhanh sau khi Stitch trả kết quả

- P01, P02 và P08 không còn avatar người dùng.
- Không còn ảnh người, chiến trường, bản đồ quân sự hoặc tài liệu “trông như thật” do Stitch sinh.
- Footer không tự nhận là kho lưu trữ quốc gia hoặc đã được cơ quan nào kiểm chứng.
- P02 lọc được kết quả; xóa bộ lọc thực sự hoạt động; không còn phân trang giả.
- P08 dùng placeholder video; năm tab đổi được nội dung và dùng được bằng bàn phím.
- P04 và P05 giữ nguyên.
- Project chỉ giữ một phiên bản cuối cho mỗi màn hình P01, P02, P04, P05 và P08.
