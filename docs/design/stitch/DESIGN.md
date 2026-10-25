# DESIGN.md — Lịch sử Việt Nam tương tác

> **Cách dùng với Stitch**
>
> - Nếu Stitch cho phép nhập `DESIGN.md`, hãy nhập toàn bộ file này vào project mới.
> - Nếu Stitch chỉ nhận prompt, hãy dán lần lượt phần **Prompt 0**, **Prompt 1**, **Prompt 2** và **Prompt 3** ở cuối file vào cùng một project/canvas.
> - Ở giai đoạn này chỉ tạo giao diện **desktop 1440 px**. Chưa tạo tablet hoặc mobile.
> - Tên sản phẩm chưa được chốt. Trong mockup chỉ dùng wordmark tạm thời `LỊCH SỬ VIỆT NAM`; không tự sáng tác tên thương hiệu hoặc slogan.

---

## 1. Vai trò của Stitch

Bạn là product designer và art director phụ trách thiết kế một website kể chuyện lịch sử Việt Nam cho học sinh lớp 12. Hãy tạo một **hệ sản phẩm nhiều màn hình có cùng design system và có thể nối thành prototype**, không tạo các landing page rời rạc.

Thiết kế phải giải quyết đồng thời ba mục tiêu:

1. Người xem tiếp nhận lịch sử chủ yếu qua **video, hình ảnh và âm thanh**.
2. Người xem vẫn có thể kiểm tra nguồn, đọc bản chép lời và hiểu dữ kiện chưa chắc chắn.
3. Chủ đề, thời gian và địa điểm giúp khám phá cùng một kho câu chuyện; chúng không phải ba sản phẩm tách biệt.

Hãy suy nghĩ như đang thiết kế một nền tảng phim tài liệu biên tập, không phải website học thuộc lòng, cổng thông tin hành chính, thư viện PDF hay dashboard dữ liệu.

---

## 2. Bối cảnh và vấn đề sản phẩm

### Người dùng chính

- Học sinh lớp 12 muốn hiểu lịch sử nhưng không muốn đọc những trang văn bản dài.
- Người học thường quen với video ngắn, nội dung nghe nhìn và nhịp kể chuyện trên mạng xã hội.
- Họ cần nội dung hấp dẫn nhưng không được đánh đổi độ chính xác lịch sử.
- Giáo viên và người tra cứu có thể sử dụng sản phẩm nhưng không cần một giao diện riêng trong MVP.

### Vấn đề cần giải quyết

Nội dung lịch sử trên nhiều website hiện nay thường được trình bày dưới dạng bài viết dài, danh sách sự kiện hoặc bản đồ có nhiều điểm đánh dấu. Cách này giúp tra cứu nhưng không tạo được trải nghiệm kể chuyện.

Sản phẩm này biến mỗi sự kiện lịch sử thành một **câu chuyện nghe nhìn đã được biên tập và kiểm chứng**. Người xem bắt đầu bằng video hoặc hình ảnh, sau đó mới mở phần tóm tắt, bản chép lời, chuyện bên lề và nguồn nếu cần.

### Quy mô phiên bản đầu

- 25–35 câu chuyện/sự kiện lịch sử Việt Nam tiêu biểu trong chương trình lớp 12.
- Mỗi câu chuyện có video chính hoặc trạng thái media rõ ràng.
- Có chủ đề, mốc thời gian, địa điểm, nhân vật, media và nguồn liên quan.
- Có trang khám phá, dòng thời gian, địa điểm/bản đồ, tìm kiếm và trang xem câu chuyện.
- Có khu quản trị cơ bản cho biên tập, kiểm duyệt và quản trị hệ thống.

### Định vị trải nghiệm

**Một kho phim tài liệu lịch sử có thể khám phá theo chương trình học, niên đại và không gian.**

Người dùng không phải “đọc một sự kiện”. Họ **bước vào một câu chuyện**, xem phần kể chính, rồi mở những lớp bằng chứng và ký ức ở mức sâu hơn.

---

## 3. Nguyên tắc sản phẩm không được thay đổi

1. **Media trước, chữ sau.** Video, ảnh, âm thanh hoặc sơ đồ trực quan là điểm vào. Văn bản dài chỉ hiện khi người dùng yêu cầu.
2. **Một sự kiện là một câu chuyện.** Không biến sự kiện thành một thẻ dữ liệu khô khan.
3. **Ba lối khám phá dùng chung dữ liệu.** Chủ đề, thời gian và địa điểm đều dẫn đến cùng một trang câu chuyện.
4. **Bản đồ có mục đích.** Bản đồ chỉ xuất hiện khi vị trí, tuyến đường, địa hình hoặc sự thay đổi không gian giúp người học hiểu câu chuyện.
5. **Nguồn luôn truy được.** Người xem có thể đi từ một nhận định hoặc phân đoạn video đến nguồn hỗ trợ nó.
6. **Không giả mạo tư liệu.** Không dùng ảnh AI mô phỏng chiến tranh, nhân vật, tài liệu, hiện vật hoặc bản đồ rồi trình bày như tư liệu thật.
7. **Không ép đăng nhập.** Người xem công khai không cần tài khoản trong MVP.
8. **Không game hóa sớm.** Không điểm số, huy hiệu, bảng xếp hạng, quiz hoặc AI chatbot trong bộ giao diện này.
9. **Nội dung vẫn dùng được khi media lỗi.** Khi video bị gỡ hoặc mạng yếu, trang vẫn có tóm tắt, bản chép lời và nguồn.
10. **Tính tiếp cận là một phần của thiết kế.** Phụ đề, transcript, bàn phím, focus, tương phản và reduced motion phải được thể hiện trong component/state.

---

## 4. Mô hình nội dung Stitch cần hiểu

### Story / Historical event

Đây là đơn vị trung tâm. Một câu chuyện có:

- tiêu đề;
- thời gian và mức chính xác của thời gian;
- tóm tắt rất ngắn;
- video chính;
- các chương của video;
- bản chép lời và phụ đề;
- ảnh, audio hoặc tài liệu liên quan;
- chủ đề chương trình;
- một hoặc nhiều địa điểm;
- nhân vật liên quan;
- chuyện bên lề hoặc lời kể nhân chứng;
- danh sách nguồn;
- ghi chú dữ kiện `verified`, `approximate`, `disputed` hoặc `editorial`.

### Topic

Một tuyển tập câu chuyện có thứ tự xem đề xuất, giống một season phim tài liệu. Topic không phải một bài viết dài.

### Time

Trục thời gian giúp người học hiểu trước–sau và chuyển tiếp giữa các giai đoạn. Không dùng đường timeline trang trí với hàng chục chấm nhỏ khó đọc.

### Place

Địa điểm là một lớp ngữ cảnh nối nhiều câu chuyện. Trang địa điểm trả lời:

- nơi này ở đâu;
- câu chuyện nào gắn với nơi này;
- yếu tố không gian nào thực sự cần để hiểu câu chuyện.

### Source

Nguồn gồm tên tài liệu, tác giả/cơ quan, URL hoặc ký hiệu lưu trữ, ngày truy cập, phạm vi được nguồn hỗ trợ và ghi chú độ chắc chắn.

### Oral history / Side story

Lời kể của nhân chứng hoặc cựu chiến binh là một góc nhìn có bối cảnh, không tự động trở thành sự thật khách quan. UI phải hiển thị rõ người kể, ngày ghi, nguồn video, bản chép lời và trạng thái kiểm chứng.

---

## 5. Actor và quyền

### Người dùng công khai

- Xem nội dung đã công bố.
- Khám phá theo chủ đề, thời gian và địa điểm.
- Tìm kiếm và lọc.
- Xem video, chương, bản chép lời, chuyện bên lề và nguồn.
- Không cần tài khoản.

### Biên tập viên

- Tạo và sửa bản nháp chủ đề, câu chuyện, nhân vật, địa điểm, nguồn và media.
- Gắn từng nhận định/kịch bản với nguồn.
- Gửi nội dung sang trạng thái chờ kiểm duyệt.
- Không tự công bố nội dung.

### Kiểm duyệt viên

- Đọc bản nháp và xem preview.
- Đối chiếu kịch bản, media, quyền sử dụng và nguồn.
- Yêu cầu sửa, công bố hoặc ẩn nội dung.

### Admin quản trị hệ thống

- Quản lý hồ sơ và vai trò nhân sự.
- Xử lý cấu hình và thao tác quản trị khi cần.
- Có thể thao tác nội dung nhưng quyền hệ thống không thay thế bước thẩm định lịch sử.

### Trạng thái nội dung

`draft` → `pending_review` → `needs_revision` hoặc `published` → có thể `hidden`.

Trong khu quản trị, luôn hiển thị rõ trạng thái hiện tại, người sửa gần nhất và hành động tiếp theo hợp lệ. Không dựa riêng vào màu để phân biệt trạng thái.

---

## 6. Kiến trúc thông tin

```text
PUBLIC WEBSITE
├── Trang chủ
├── Khám phá
│   ├── Theo chủ đề
│   ├── Theo thời gian
│   └── Theo địa điểm
├── Chủ đề / tuyển tập
├── Dòng thời gian
├── Địa điểm và bản đồ
├── Tìm kiếm
├── Câu chuyện
│   ├── Xem video
│   ├── Các chương
│   ├── Hình ảnh
│   ├── Chuyện bên lề / lời kể
│   ├── Bản chép lời
│   └── Kiểm chứng / nguồn
├── Nhân vật
└── Phương pháp biên tập và nguồn

STAFF CMS
├── Đăng nhập
├── Hàng đợi nội dung
├── Trình biên tập câu chuyện
├── Không gian kiểm duyệt
├── Thư viện nguồn và media
├── Chủ đề / nhân vật / địa điểm
└── Nhân sự và phân quyền
```

### Điều hướng công khai

Header desktop chỉ có:

- wordmark tạm thời `LỊCH SỬ VIỆT NAM`;
- `Khám phá`;
- `Dòng thời gian`;
- `Địa điểm`;
- biểu tượng tìm kiếm;
- điều khiển đọc `Aa`.

Không đặt `Đăng nhập`, `Đăng ký`, `Yêu thích`, `Quiz`, `AI` hoặc nút quảng cáo trong header công khai.

Khu quản trị đi qua một URL riêng và dùng shell riêng.

---

## 7. Hướng nghệ thuật duy nhất: Cinematic Editorial Archive

### Cảm giác cần tạo

- nghiêm túc nhưng không nặng nề;
- có nhịp phim tài liệu;
- đương đại nhưng không giống sản phẩm SaaS;
- mang bản sắc Việt Nam bằng nhịp chữ, màu và cách biên tập, không dùng họa tiết dân tộc như đồ trang trí;
- tạo tò mò, tin cậy và cảm giác muốn bấm xem tiếp.

### Tham chiếu về tinh thần, không sao chép

- nhịp biên tập của một tạp chí văn hóa cao cấp;
- sự tập trung vào tác phẩm của nền tảng phim tài liệu;
- khả năng khám phá theo kết nối của bảo tàng số;
- độ rõ ràng của một sản phẩm giáo dục có kiểm chứng.

Không sao chép trực tiếp bố cục, logo hoặc component của thương hiệu khác.

### Bảng màu

| Token | Giá trị | Cách dùng |
| --- | --- | --- |
| `paper` | `#F1EEE6` | nền chính, hơi ấm như giấy nhưng không dùng texture cũ giả |
| `paper-raised` | `#F8F6F0` | vùng nội dung nổi rất nhẹ |
| `ink` | `#121212` | chữ chính và vùng cinema |
| `ink-soft` | `#56534D` | metadata và chú thích |
| `hairline` | `#C8C2B8` | rule, không bao quanh mọi khối |
| `vermilion` | `#B12B1E` | hành động, trạng thái đang chọn, mốc quan trọng |
| `map-ink` | `#233B45` | chỉ dùng cho dữ liệu không gian và sơ đồ |
| `verified` | `#315D46` | trạng thái đã kiểm chứng trong CMS |

Không dùng gradient tím/xanh, neon, glow, kính mờ, nền đen toàn bộ website hoặc màu vàng sepia giả cổ.

### Typography

- Display/H1: `Source Serif 4`, Vietnamese, weight 500–600.
- UI/body: `Be Vietnam Pro`, weight 400–600.
- Optional numeric/date face: `IBM Plex Mono`, chỉ dùng cho năm, timecode và mã nguồn.
- Không dùng Inter, Roboto, Arial hoặc font sci-fi.

Desktop scale:

- Display story title: 72–88 px, line-height 0.96–1.02.
- Page H1: 52–64 px.
- Section H2: 32–40 px.
- Story title in list: 24–30 px.
- Body: 17–19 px, line-height 1.55.
- Metadata: 12–14 px, uppercase vừa phải, letter spacing 0.06–0.1 em.

Không viết toàn bộ tiêu đề tiếng Việt bằng chữ in hoa. Giữ dấu tiếng Việt đúng và kiểm tra không bị lỗi font.

### Grid và khoảng trắng

- Frame desktop: 1440 px.
- Content max-width: 1280 px.
- Lề hai bên: 64–80 px.
- Grid 12 cột, gutter 24 px.
- Khoảng trắng cấp section: 96–144 px.
- Khoảng trắng trong nhóm nội dung: 24–48 px.
- Dùng bố cục bất đối xứng có chủ đích: media 7–9 cột, thông tin 3–5 cột.
- Không căn mọi thứ vào giữa. Không lấp đầy mọi khoảng trống.

### Hình dạng và đường kẻ

- Phần lớn bề mặt là phẳng và vuông.
- Bo góc media tối đa 2–4 px.
- Button chính có thể là hình chữ nhật thấp, không phải pill.
- Dùng rule ngang/dọc như cấu trúc biên tập; rule 1 px với độ tương phản nhẹ.
- Không bao mỗi nội dung trong một card có viền và bóng.
- Không dùng lưới ba card bằng nhau làm cấu trúc mặc định.

### Hình ảnh và media placeholder

Khi chưa có asset thật:

- dùng trường màu than/xám có tỷ lệ ảnh chính xác;
- thêm year marker, crop mark, waveform hoặc film frame mang tính trừu tượng;
- ghi rõ `TƯ LIỆU SẼ BỔ SUNG` hoặc `VIDEO SẼ BỔ SUNG`;
- có thể dùng grain rất nhẹ nhưng không làm giả giấy cũ hoặc phim lưu trữ;
- không tạo khuôn mặt, quân phục, trận đánh, cờ, bản đồ chiến thuật, tài liệu viết tay hoặc hiện vật giả.

Khi có asset được tải lên, ưu tiên asset thật và giữ caption/credit ngay cạnh media.

### Icon

- Icon nét mảnh, 1.25–1.5 px.
- Chỉ dùng cho search, play, âm lượng, phụ đề, toàn màn hình, filter, map locator và disclosure.
- Không dùng icon minh họa lớn thay cho nội dung.

### Motion

- Chuyển động phải làm rõ quan hệ giữa câu chuyện, chương và mốc thời gian.
- Hover/focus 160–240 ms; chuyển màn hình hoặc mở panel 280–420 ms.
- Chỉ animate `transform` và `opacity`.
- Không parallax liên tục, không cursor tùy biến, không text chạy ngang vô hạn.
- Khi `prefers-reduced-motion`, bỏ chuyển động và giữ toàn bộ nội dung/điều hướng.

---

## 8. Component system

Stitch phải tạo component dùng chung thay vì vẽ lại từng màn hình:

1. **PublicHeader** — wordmark, nav, search, Aa, active state bằng rule mảnh.
2. **StoryStage** — vùng media lớn + index + tiêu đề + CTA.
3. **MediaFrame** — image/video/audio với ratio, caption, credit, placeholder state và unavailable state.
4. **StoryRow** — số thứ tự/năm + media + title + topic + hành động; không phải card.
5. **TopicRail** — tuyến xem có thứ tự như các tập phim.
6. **YearRail** — bộ điều hướng thời gian có thể kéo/chọn bằng bàn phím, year active, section transition và focused event; không phải một danh sách năm tĩnh.
7. **PlaceExplorer** — bản đồ và danh sách đồng bộ hai chiều, có bộ lọc khoảng năm và textual alternative.
8. **ChapterRail** — chapter đang phát, progress và keyboard focus.
9. **EvidenceDrawer** — nguồn theo chapter/claim, confidence label và citation.
10. **TranscriptPanel** — text có timecode, search và jump-to-video.
11. **OralHistoryPlayer** — chân dung/placeholder, waveform, transcript, attribution và context note.
12. **FilterBar** — URL-shareable filters; trên desktop có thể là một hàng hoặc aside.
13. **StatusLabel** — text + icon + màu; dùng trong CMS.
14. **CMSDataTable** — danh sách nội dung có status, assignee, updated time và action.
15. **ClaimSourceEditor** — câu trong kịch bản ở trái, nguồn hỗ trợ ở phải.

Các trạng thái cần có trong component library:

- default;
- hover;
- keyboard focus;
- selected/current;
- loading skeleton;
- empty;
- error/retry;
- media unavailable;
- disabled khi không đủ quyền.

---

## 9. Màn hình công khai cần thiết kế

### P01 — Trang chủ `/`

**Mục tiêu:** khiến người dùng bắt đầu xem trong vòng vài giây và hiểu ba lối khám phá.

**Bố cục:**

- Header thấp, thoáng, không sticky dạng pill.
- Opening stage chiếm phần lớn viewport đầu tiên. Media 8 cột ở bên phải hoặc phía sau theo bố cục editorial; thông tin 4 cột ở trái.
- Eyebrow nhỏ: `CÂU CHUYỆN ĐƯỢC CHỌN · 1954`.
- H1 mẫu: `Chiến dịch Điện Biên Phủ`.
- Một câu mô tả tối đa 18 từ.
- CTA chính: `Xem câu chuyện`.
- CTA phụ dạng text: `Xem nguồn giới thiệu`.
- Chỉ báo `01 / 05` và điều khiển đổi câu chuyện tinh tế.
- Phần tiếp theo là ba **dải biên tập**: `Theo chủ đề`, `Theo thời gian`, `Theo địa điểm`. Mỗi dải có cấu trúc khác nhau và một preview nhỏ, không phải ba card giống nhau.
- Kết thúc viewport bằng `Mới được biên tập` với StoryRow ngang.

**Không dùng:** slogan lớn, số liệu người dùng, testimonial, logo đối tác, newsletter hoặc hero marketing.

### P02 — Khám phá `/kham-pha`

**Mục tiêu:** duyệt kho câu chuyện theo các facet khác nhau mà không bị choáng.

**Bố cục:**

- H1 `Khám phá câu chuyện`.
- Ba mode text: `Chủ đề`, `Thời gian`, `Địa điểm`; dùng active rule, không dùng pill.
- Một filter bar rõ ràng: giai đoạn, chủ đề, loại media, độ dài; trạng thái nằm trong URL.
- Kết quả có nhịp editorial: một story nổi bật rộng, các story còn lại thành hàng xen kẽ media trái/phải.
- Mỗi result chỉ hiện year, title, topic, media state và một dòng mô tả.
- Có empty state và action `Xóa bộ lọc`.

### P03 — Chủ đề `/chu-de/[slug]`

**Mục tiêu:** tạo cảm giác đây là một season được tuyển chọn và có trình tự xem.

**Bố cục:**

- Intro ngắn, không quá 3 dòng.
- Trailer/topic introduction chiếm 7–8 cột.
- Metadata: số câu chuyện và tổng số chương; không tạo số liệu giả nếu chưa có.
- Primary action: `Bắt đầu từ câu chuyện đầu tiên`.
- Bên dưới là TopicRail theo chiều dọc với số `01`, `02`, `03` cỡ lớn và media theo nhịp xen kẽ.
- `Địa điểm liên quan` và `Nhân vật liên quan` là metadata cuối trang, không cạnh tranh với tuyến xem.

### P04 — Dòng thời gian `/dong-thoi-gian`

**Mục tiêu:** hiểu trình tự và chuyển tiếp giữa các giai đoạn.

**Bố cục:**

- Không dùng đường ngang với nhiều chấm trang trí. Dùng một **temporal navigator có chức năng thật**: thanh scrubber theo khoảng 1945–1975, chỉ đánh dấu các năm có story, có tay nắm kéo, nút năm trước/sau và nhãn giai đoạn.
- Scrubber hỗ trợ click, drag, phím mũi tên và trạng thái focus rõ. Mốc đang chọn phóng lớn vừa phải và hiển thị `Đang xem: 1954`.
- Bên dưới navigator là focused story stage: media 7–8 cột, title/tóm tắt 3–4 cột và một locator map nhỏ cho địa điểm của story đang chọn.
- Tiếp theo là chuỗi StoryRow theo chiều dọc. Khi người dùng cuộn đến story khác, scrubber, năm active và locator map cập nhật đồng bộ.
- Có control `Chỉ hiện sự kiện có video` và filter chủ đề; trạng thái nằm trong URL.
- Reduced motion cập nhật state tức thời, không cuộn hoặc phóng tự động.
- Thiết kế tối thiểu ba state để prototype được tương tác: `1945 selected`, `1954 selected`, `1975 selected`. Các state dùng cùng layout và chỉ thay active year, focused story và marker vị trí.
- Bộ lọc giai đoạn/chủ đề ở đầu và lưu vào URL.
- Mốc `approximate` hoặc `disputed` có nhãn chữ rõ, không trình bày như ngày chính xác.

### P05 — Địa điểm `/dia-diem`

**Mục tiêu:** tìm câu chuyện qua không gian và vẫn dùng được khi bản đồ lỗi.

**Bố cục:**

- Split view 5/7. Bản đồ tương tác 7 cột, danh sách địa điểm/câu chuyện 5 cột; cả hai luôn có quan hệ rõ.
- Trên bản đồ có zoom, reset view và toggle `Bản đồ / Danh sách`; không dùng phong cách ứng dụng gọi xe.
- Ngay dưới header của explorer có **time-range control 1945–1975**. Kéo hai đầu khoảng năm sẽ lọc đồng thời marker và danh sách story. Hiển thị câu mô tả kết quả bằng chữ, ví dụ `Đang hiển thị các câu chuyện từ 1945 đến 1975`.
- Chọn hoặc focus một marker sẽ highlight StoryRow tương ứng và mở preview có year, title, confidence vị trí và action `Xem câu chuyện`.
- Chọn hoặc focus một StoryRow sẽ pan/focus marker tương ứng. Không tự zoom mạnh hoặc gây mất ngữ cảnh.
- Chỉ dùng ba location mẫu đã cho: Hà Nội, Cao Bằng, Điện Biên Phủ. Không vẽ tuyến hành quân, đường chiến dịch, ranh giới lịch sử, khoảng cách hoặc tọa độ khi chưa có dữ liệu đã kiểm chứng.
- Thiết kế tối thiểu ba state để prototype được tương tác: `overview`, `Điện Biên Phủ selected`, `filtered to 1950–1954`.
- Luôn có nút `Xem dạng danh sách` và danh sách văn bản đầy đủ.
- Hiển thị `Vị trí gần đúng` khi dữ liệu không chính xác.
- Khi tile map lỗi, khu vực bên phải chuyển thành message + danh sách vẫn hoạt động.

### P06 — Trang địa điểm `/dia-diem/[slug]`

**Mục tiêu:** nối nhiều lớp câu chuyện tại cùng một nơi.

**Bố cục:**

- Tên hiện tại, tên lịch sử nếu có, vùng hành chính và độ chính xác.
- Locator map nhỏ, không chiến thuật.
- `Những câu chuyện tại đây` là nội dung chính.
- Phần `Địa điểm trong câu chuyện` chỉ hiện sơ đồ/tuyến khi có bằng chứng và giá trị giải thích.

### P07 — Tìm kiếm `/tim-kiem`

**Mục tiêu:** tìm nhanh câu chuyện, nhân vật hoặc địa điểm.

**Bố cục:**

- Search field lớn nhưng không chiếm cả màn hình.
- Group kết quả theo `Câu chuyện`, `Nhân vật`, `Địa điểm`.
- Mỗi kết quả có type label, ngữ cảnh và đích đến rõ ràng.
- Có trạng thái query rỗng, không kết quả và lỗi tải.
- Không dùng chatbot UI.

### P08 — Trang câu chuyện `/cau-chuyen/[slug]`

**Đây là màn hình quan trọng nhất.**

**Mục tiêu:** xem trước, hiểu ý chính nhanh, kiểm tra sâu khi cần.

**Bố cục viewport đầu:**

- Chuyển sang `cinema band` nền `ink`, chiếm khoảng 70–78% chiều cao viewport nhưng không phủ toàn trang.
- Trên band có breadcrumb nhỏ, title, date/confidence và topic.
- Video 8–9 cột; ChapterRail 3–4 cột.
- Player có play, progress, volume, captions, transcript và fullscreen; không autoplay có âm thanh.
- Không hiển thị duration giả.

**Bố cục sau player:**

- Sticky subnav: `Tóm tắt`, `Hình ảnh`, `Chuyện bên lề`, `Bản chép lời`, `Kiểm chứng`.
- `Tóm tắt`: tối đa 3 ý chính, mỗi ý 1–2 dòng.
- `Hình ảnh`: gallery có caption và credit, không masonry ngẫu nhiên.
- `Chuyện bên lề`: các câu chuyện ngắn, audio hoặc video nhân chứng.
- `Bản chép lời`: timecode + jump-to-video + search.
- `Kiểm chứng`: nguồn theo chapter/claim, confidence label và ghi chú biên tập.
- Cuối trang: một hành động tiếp theo duy nhất, ví dụ `Xem câu chuyện tiếp theo`.

**Media failure state:** player trở thành panel giải thích video chưa khả dụng, có link mở nền tảng gốc nếu có, transcript và nguồn vẫn truy cập được.

### P09 — Chuyện bên lề / lời kể `/cau-chuyen/[slug]/chuyen-ben-le/[id]`

**Mục tiêu:** nghe một góc nhìn cá nhân mà không nhầm với kết luận lịch sử đã xác minh.

**Bố cục:**

- Media/audio chiếm ưu thế.
- Người kể, vai trò/liên hệ với sự kiện, ngày và nơi ghi.
- Context note ngắn: `Đây là lời kể cá nhân; các dữ kiện khách quan được kiểm chứng riêng.`
- Transcript theo timecode.
- Nguồn gốc file, đơn vị sở hữu và trạng thái cho phép sử dụng.
- Link quay lại chapter liên quan trong câu chuyện chính.

### P10 — Nhân vật `/nhan-vat/[slug]`

**Mục tiêu:** giúp kết quả tìm kiếm nhân vật có đích đến hữu ích.

**Bố cục:**

- Portrait thật hoặc placeholder rõ ràng; không sinh chân dung lịch sử.
- Tiểu sử ngắn đã xác minh.
- `Xuất hiện trong các câu chuyện` là phần chính.
- Nguồn và tên gọi khác ở phần cuối.

### P11 — Phương pháp và nguồn `/phuong-phap`

**Mục tiêu:** giải thích ngắn gọn cách chọn sự kiện, kiểm chứng và xử lý nội dung chưa chắc chắn.

**Bố cục:**

- Tối đa 5 mục ngắn: chọn nội dung, nguồn, mức chắc chắn, quyền media, sửa sai.
- Có bảng giải thích `verified`, `approximate`, `disputed`, `editorial`.
- Có đường báo sai sót nội dung, nhưng không thiết kế form phức tạp ở vòng này.

---

## 10. Màn hình quản trị cần thiết kế ở phase riêng

CMS sử dụng cùng typography và màu nhưng ưu tiên hiệu quả thao tác. Không mang bố cục cinema của trang công khai vào form quản trị.

### A01 — Đăng nhập

- Chỉ dành cho nhân sự.
- Form ngắn: email, mật khẩu, quên mật khẩu.
- Không có đăng ký tài khoản công khai.

### A02 — Hàng đợi nội dung

- Tabs hoặc filters: `Bản nháp`, `Chờ duyệt`, `Cần chỉnh sửa`, `Đã công bố`, `Đã ẩn`.
- Table/list có title, content type, topic, status, người sửa, updated time.
- Action phụ thuộc vai trò.

### A03 — Trình biên tập câu chuyện

- Cột trái là cấu trúc nội dung: metadata, chapters, transcript, media, locations, people.
- Vùng giữa là editor/preview.
- Cột phải là nguồn, confidence và validation.
- Có save draft, preview và submit for review.
- Hiển thị lỗi thiếu nguồn hoặc thiếu quyền media ngay tại vị trí liên quan.

### A04 — Không gian kiểm duyệt

- Split pane: story/video preview ở trái, checklist và nguồn ở phải.
- Reviewer có thể chọn chapter/claim và thấy citation tương ứng.
- Hành động: `Yêu cầu chỉnh sửa`, `Công bố phiên bản`, `Ẩn nội dung`.
- Mọi hành động quan trọng cần lý do và confirmation rõ.

### A05 — Thư viện nguồn và media

- Phân biệt `Nguồn chứng minh dữ kiện` và `Quyền sử dụng media`.
- Metadata: author/organization, citation, URL/archive ID, accessed date, usage rights, owner, contact, status.
- Không dùng gallery ảnh đẹp mà bỏ metadata.

### A06 — Nhân sự và phân quyền

- Chỉ admin truy cập.
- Table đơn giản: tên, email, role, account status, last activity.
- Không thiết kế hệ thống tổ chức phức tạp hơn ba vai trò staff.

---

## 11. Nội dung mẫu được phép dùng trong mockup

Chỉ dùng một tập nội dung mẫu nhỏ để thể hiện hierarchy:

- `Cách mạng tháng Tám` — 1945.
- `Toàn quốc kháng chiến` — 1946.
- `Chiến dịch Biên giới` — 1950.
- `Chiến dịch Điện Biên Phủ` — 1954.
- `Đại thắng mùa Xuân 1975` — 1975.

Topic mẫu:

- `Cách mạng và giành độc lập`.
- `Kháng chiến chống thực dân Pháp`.
- `Thống nhất đất nước`.

Location mẫu:

- `Hà Nội`.
- `Cao Bằng`.
- `Điện Biên Phủ`.

Không tự viết thêm ngày chi tiết, con số, trích dẫn, tên nhân chứng, tên tài liệu, mô tả chiến thuật hoặc kết luận lịch sử. Nếu cần nội dung để giữ chỗ, dùng:

- `Tóm tắt đã kiểm chứng sẽ được bổ sung`;
- `Tư liệu sẽ được bổ sung`;
- `Nguồn đang được biên tập`;
- `Câu chuyện đang được chuẩn bị`.

---

## 12. Accessibility và hành vi bắt buộc

- WCAG AA cho text và controls.
- Focus ring rõ, dùng được bằng bàn phím.
- Touch target tối thiểu 44 × 44 px dù hiện tại thiết kế desktop.
- Heading theo thứ tự logic.
- Video có phụ đề, transcript và trạng thái caption.
- Media có alt text/caption/credit trong design model.
- Bản đồ có danh sách văn bản thay thế.
- Không truyền đạt trạng thái chỉ bằng màu.
- Reduced motion version không mất nội dung.
- Thiết kế loading, empty, error và offline/media unavailable state cho luồng quan trọng.

---

## 13. Những dấu hiệu khiến thiết kế bị loại

Loại bỏ hoặc thiết kế lại nếu có bất kỳ điểm nào sau:

- giao diện giống landing page SaaS hoặc template AI;
- gradient tím/xanh, glassmorphism, glow, blob hoặc nền lưới công nghệ;
- nhiều card bo tròn giống nhau;
- hero có slogan chung chung;
- dashboard xuất hiện trong trang dành cho người học;
- bản đồ toàn màn hình làm nội dung chính;
- timeline là một đường ngang dài có hàng chục chấm;
- ảnh AI trông như tư liệu lịch sử;
- trích dẫn, số liệu, nhân chứng hoặc thời lượng giả;
- typography quá nhỏ hoặc phần lớn chữ in hoa;
- mọi section đều có icon và CTA;
- thiếu nguồn, transcript hoặc trạng thái media lỗi;
- thêm login, quiz, AI chatbot, huy hiệu hoặc yêu thích vào MVP công khai;
- các màn hình dùng header, màu hoặc component khác nhau;
- thiết kế đẹp như poster nhưng không thể nối thành luồng sử dụng.

---

## 14. Tiêu chí tự kiểm tra của Stitch

Trước khi trả kết quả, tự kiểm tra:

1. Người dùng có nhìn thấy nội dung để xem trước nội dung để đọc không?
2. Từ trang chủ, họ có thể vào một story trong tối đa hai hành động không?
3. Topic, timeline và place có dẫn tới cùng một kiểu Story page không?
4. Màn hình Story có làm video thành trọng tâm mà vẫn thấy được chapter và verification không?
5. Bản đồ có phục vụ hiểu câu chuyện thay vì chỉ tạo hiệu ứng thị giác không?
6. Các source/confidence state có đủ rõ để tạo niềm tin không?
7. Có chỗ nào đang dùng dữ kiện hoặc tư liệu lịch sử giả để làm mockup đẹp hơn không?
8. Giao diện có thể triển khai bằng Next.js, React, TypeScript và Tailwind mà không cần 3D không?
9. Keyboard focus, transcript, captions và reduced motion đã có trong component/state chưa?
10. Năm màn hình anchor có thực sự trông như cùng một sản phẩm không?

Nếu câu trả lời cho bất kỳ câu nào là “không”, hãy sửa trước khi xuất màn hình.

---

# PROMPTS DÁN VÀO STITCH

## Prompt 0 — Khởi tạo project và design system

```text
Read the attached DESIGN.md as the single source of truth for this product.

Create a new desktop-first multi-screen design project for a Vietnamese grade-12 historical documentary platform. Do not generate a marketing landing page. Do not generate mobile screens yet.

First establish one reusable design system named “Cinematic Editorial Archive” and a connected information architecture. The temporary wordmark is “LỊCH SỬ VIỆT NAM”; the final brand name is undecided, so do not invent a brand name or slogan.

Create a design-system canvas containing:
- the exact color tokens from DESIGN.md;
- Source Serif 4, Be Vietnam Pro and IBM Plex Mono typography styles with correct Vietnamese diacritics;
- 12-column desktop grid and spacing scale;
- PublicHeader, StoryStage, MediaFrame, StoryRow, TopicRail, YearRail, PlaceExplorer, ChapterRail, EvidenceDrawer, TranscriptPanel, OralHistoryPlayer, FilterBar and StatusLabel components;
- default, hover, keyboard-focus, selected, loading, empty, error and media-unavailable states.

The visual direction is serious, cinematic, editorial and contemporary. It must feel like a documentary platform and cultural publication, not SaaS, not an education dashboard, not a newspaper article, and not a museum database. Use asymmetrical composition, large media fields, strong Vietnamese typography, disciplined vermilion accents, fine editorial rules and generous negative space.

Use abstract nonrepresentational media placeholders when no real asset is supplied. Never generate fake historical photographs, people, uniforms, battles, documents, artifacts, quotes, statistics, witness names or tactical maps.

After building the system, show a compact style tile and a sitemap before generating product screens.
```

## Prompt 1 — Tạo năm màn hình công khai làm chuẩn

```text
Using the approved design system and the full DESIGN.md context, generate five connected high-fidelity desktop screens at 1440px width:

1. P01 Home `/`
2. P02 Explore `/kham-pha`
3. P04 Timeline `/dong-thoi-gian`
4. P05 Places `/dia-diem`
5. P08 Story `/cau-chuyen/chien-dich-dien-bien-phu`

Follow every screen specification in DESIGN.md exactly. Treat P08 Story as the visual and interaction centerpiece of the product. Make video and visual media dominant, while transcript, side stories and evidence remain easy to open without becoming the first thing the learner sees.

Connect the prototype flow:
- Home featured story → Story
- Home “Theo thời gian” → Timeline
- Home “Theo địa điểm” → Places
- Explore result → Story
- Timeline event → Story
- Place result → Story
- Story chapter → the corresponding chapter state
- Story “Kiểm chứng” → EvidenceDrawer
- Story “Bản chép lời” → TranscriptPanel

Use only the permitted sample labels in DESIGN.md. Use explicit placeholders for all unverified media or copy. Keep one shared PublicHeader, grid, typography, color system and component library across every screen.

Produce each screen as a separate frame on the same canvas. Do not make a collage. Do not produce mobile versions. Do not add features outside the MVP.
```

## Prompt 2 — Bổ sung các màn hình công khai còn lại

```text
Extend the same project without changing the established design system. Add these desktop screens as separate connected frames:

- P03 Topic collection `/chu-de/[slug]`
- P06 Place detail `/dia-diem/[slug]`
- P07 Search `/tim-kiem`
- P09 Oral-history side story `/cau-chuyen/[slug]/chuyen-ben-le/[id]`
- P10 Person detail `/nhan-vat/[slug]`
- P11 Method and sources `/phuong-phap`

Also add the most important alternate states:
- no search results;
- map tiles failed but text list still works;
- story video unavailable but transcript and sources remain available;
- approximate location;
- disputed historical claim;
- no published stories for a topic.

Keep every screen connected to the existing Home, Explore and Story flows. Do not redesign the header or introduce a second visual style.
```

## Prompt 3 — Tạo khu quản trị theo bốn vai trò

```text
Create a separate staff CMS section in the same product project, using the same typography and brand tokens but a denser, task-oriented layout.

Generate desktop screens A01–A06 from DESIGN.md:
- staff login;
- content queue;
- story editor;
- review workspace;
- source and media library;
- staff and role management.

Model exactly four actors: public user, editor, reviewer and system admin. Public users do not have accounts in the MVP. Editors create drafts and submit for review. Reviewers request revisions, publish or hide. System admins manage staff roles and system administration.

Use the exact workflow states: draft, pending_review, needs_revision, published and hidden. For historical confidence use verified, approximate, disputed and editorial. Never combine workflow status and historical confidence into one badge.

The Story Editor must visibly connect script claims, chapters, media rights and sources. The Review Workspace must allow a reviewer to select a claim or chapter and inspect its evidence beside the preview. Do not create a generic analytics dashboard and do not add charts, revenue metrics or engagement KPIs.
```

## Prompt 4 — Audit và sửa thiết kế

```text
Audit the entire project against DESIGN.md. Do not add new features.

Identify and correct every instance of:
- generic AI-generated UI;
- SaaS landing-page structure;
- repeated rounded cards;
- decorative gradients, glow or glassmorphism;
- fake historical imagery or facts;
- map-first design;
- ornamental dot timeline;
- inconsistent header, grid, type or color tokens;
- weak Vietnamese typography;
- inaccessible contrast or missing keyboard focus;
- screens that look good in isolation but do not form a coherent user journey.

Standardize components and preserve intentional asymmetry. Ensure that media is primary, verification is available on demand, and topic/time/place all converge on the same Story experience.

Return a short audit summary and the corrected frames. Keep every frame desktop 1440px. Do not generate mobile or tablet screens in this pass.
```

---

## 15. Kết quả mong đợi từ Stitch

Sau bốn prompt, project Stitch phải có:

- một design system dùng chung;
- sitemap và prototype flow;
- 11 màn hình công khai;
- 6 màn hình quản trị;
- các state quan trọng;
- component có thể tái sử dụng;
- frame desktop riêng, không collage;
- thiết kế có thể export sang Figma hoặc frontend code;
- không có tư liệu lịch sử giả và không thêm tính năng ngoài MVP.
