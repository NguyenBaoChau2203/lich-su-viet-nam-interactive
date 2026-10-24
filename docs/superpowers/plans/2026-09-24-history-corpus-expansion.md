# Kế hoạch mở rộng kho sự kiện, câu chuyện và tư liệu lịch sử

**Ngày lập:** 24/09/2026\
**Trạng thái:** Sẵn sàng bàn giao cho Antigravity\
**Phạm vi đợt đầu:** Việt Nam 1945–1975, từ 5 mục mẫu lên 25–35 sự kiện có nguồn\
**Kế hoạch tác vụ:** `tasks/plan.md` và `tasks/todo.md`\
**Prompt thực thi:** `docs/design/antigravity/HISTORY_CONTENT_EXPANSION_PROMPT.md`

## 1. Mục tiêu

Biến dữ liệu mẫu hiện tại thành một kho nội dung lịch sử dùng được cho ba luồng công khai:

- dòng thời gian có mật độ sự kiện đủ để khám phá theo năm và giai đoạn;
- trang Khám phá có nhiều câu chuyện, chuyện bên lề, ảnh và video để lọc;
- trang sự kiện cho phép lần từng nhận định về đúng nguồn và biết rõ quyền sử dụng tư liệu.

Đợt này tập trung làm dày giai đoạn 1945–1975 trước. Mốc ngoài giai đoạn chỉ được đưa vào backlog sau khi ma trận chương trình lớp 12 chỉ ra nhu cầu và có nguồn phù hợp. Mục tiêu phát hành là **25–35 sự kiện**, đúng phạm vi MVP đã thống nhất. Có thể nghiên cứu nhiều ứng viên hơn, nhưng không dùng số lượng ứng viên thay cho số mục đủ điều kiện xuất bản.

## 2. Hiện trạng và trở ngại phải xử lý trước

Mã hiện tại là prototype trung thực với 5 mục nháp: 1945, 1946, 1950, 1954 và 1975. Các kiểu `SampleYear`, `SamplePlace`, `SampleTopic` đang khóa cứng các giá trị này. `TimelineExplorer` dùng chỉ số của mảng làm vị trí thanh kéo và giả định mỗi mốc chỉ có một câu chuyện. Vì vậy, thêm hàng loạt phần tử vào `SAMPLE_STORIES` sẽ gây các vấn đề sau:

- không biểu diễn được nhiều sự kiện trong cùng một năm;
- nhãn năm chen chúc, đặc biệt ở màn hình nhỏ;
- bộ lọc và địa điểm không tự mở rộng;
- không có bản ghi nguồn, nhận định, quyền ảnh/video hoặc lịch sử duyệt;
- một địa điểm duy nhất cho mỗi sự kiện không đủ cho chiến dịch hay hành trình có nhiều điểm;
- trạng thái nội dung và mức chắc chắn lịch sử đang bị trộn vào chuỗi hiển thị tự do.

Antigravity phải sửa hợp đồng dữ liệu và kiểm thử trước khi nhập đợt nội dung lớn. Không sửa giao diện bằng cách chỉ thêm thêm chấm năm.

## 3. Kết quả định lượng của đợt đầu

| Hạng mục | Mục tiêu |
| --- | --- |
| Ứng viên nghiên cứu | 40–50 mục, lập từ chương trình học và nguồn chính thống |
| Sự kiện đủ điều kiện đưa vào kho MVP | 25–35 |
| Nguồn chứng minh dữ kiện | Ít nhất 2 nguồn độc lập cho mỗi sự kiện; ít nhất 1 nguồn lưu trữ, bảo tàng, cơ quan nhà nước hoặc học thuật |
| Nhận định có thể truy vết | 100% câu mang dữ kiện trong tóm tắt và đoạn kể có `claimId` và nguồn hỗ trợ |
| Ảnh | Tìm 2–4 ứng viên/sự kiện; chỉ hiển thị bản có URL gốc, tác giả/cơ quan, giấy phép hoặc quyền sử dụng rõ |
| Video | Tìm ít nhất 1 đầu mối/sự kiện khi có; chỉ nhúng video còn hoạt động, cho phép nhúng và ghi đúng kênh/chủ sở hữu |
| Chuyện bên lề/lời kể | 12–18 mục trên toàn kho; mỗi mục có người kể/tác giả, xuất xứ, ngày, đoạn hoặc trang tham chiếu và nhãn loại nguồn |
| Giai đoạn | Làm dày 1945–1954, 1954–1965, 1965–1973 và 1973–1975; không đặt quota cứng nếu nguồn không đạt |

Chỉ tiêu tìm kiếm ảnh/video là chỉ tiêu nghiên cứu. Không bắt buộc xuất bản một tư liệu không rõ quyền chỉ để đạt con số.

## 4. Hai sổ nguồn bắt buộc

Mỗi sự kiện phải có hai lớp bằng chứng độc lập:

### 4.1. Sổ nguồn lịch sử

Mỗi nguồn lưu:

- `id`, tên tài liệu, tác giả hoặc cơ quan;
- URL trực tiếp hoặc ký hiệu lưu trữ;
- ngày xuất bản nếu có và ngày truy cập;
- loại nguồn: `archive`, `museum`, `government`, `academic`, `book`, `press`, `oral_history`;
- trang, mục, đoạn hoặc timecode đã đọc/xem;
- danh sách `claimId` mà nguồn thật sự hỗ trợ;
- ghi chú phạm vi, điểm mâu thuẫn và ngôn ngữ;
- ảnh chụp/snapshot chỉ khi điều khoản nguồn cho phép lưu nội bộ.

Kết quả tìm kiếm và đoạn mô tả của công cụ tìm kiếm chỉ dùng để tìm đầu mối. Chúng không được coi là bằng chứng. Antigravity phải mở tài liệu, đọc phần liên quan và ghi vị trí chính xác.

### 4.2. Sổ quyền tư liệu

Mỗi ảnh, audio hoặc video lưu:

- URL trang gốc và URL tệp/ID trình phát nếu được phép;
- tiêu đề, tác giả/người quay, cơ quan lưu giữ, ngày tạo hoặc công bố;
- sự kiện và cảnh/nhận định mà tư liệu minh họa;
- `rightsStatus`: `approved_reuse`, `embed_only`, `link_only`, `permission_required`, `unknown`;
- tên giấy phép, URL giấy phép, credit bắt buộc và bằng chứng cho quyền;
- ngày kiểm tra khả năng truy cập/nhúng;
- ghi chú nếu ảnh chỉ là minh họa, tái dựng hoặc không rõ ngày.

Một nguồn đáng tin về lịch sử không tự động trao quyền dùng ảnh trên trang đó. Một ảnh có giấy phép mở cũng không tự động là nguồn đủ mạnh cho lời kể lịch sử.

## 5. Quy tắc chống bịa đặt

1. Không tạo ngày, địa điểm, tọa độ, tên người, trích dẫn, số liệu, lời kể hoặc quan hệ chỉ từ trí nhớ của mô hình.
2. Không dùng ảnh AI hoặc ảnh “tương tự” làm tư liệu lịch sử.
3. Không lấy chú thích ảnh từ trang tổng hợp rồi gán cho ảnh khác.
4. Không tự nhận một kênh YouTube là chính thức; phải kiểm tra trang kênh và cơ quan sở hữu.
5. Không tải lại, cắt ghép hoặc lưu cục bộ video của bên khác nếu chưa có quyền. Với video cho phép nhúng, dùng trình phát gốc và đường dẫn mở trên nền tảng.
6. Không biến lời kể cá nhân thành kết luận khách quan. Lưu nguyên ngữ cảnh, người kể, người phỏng vấn, ngày ghi nhận và timecode; các chi tiết khách quan phải được đối chiếu riêng.
7. Không dùng tọa độ suy đoán. Mỗi địa điểm có nguồn tọa độ, `precision` và ghi chú về địa giới lịch sử.
8. Không đổi `pending_review` thành `published` chỉ vì đủ trường dữ liệu. Kiểm duyệt viên phải duyệt nhận định và quyền tư liệu.
9. Nếu hai nguồn bất đồng, dùng `disputed`; nếu ngày/vị trí chỉ gần đúng, dùng `approximate`; nội dung kết nối hoặc diễn giải của biên tập dùng `editorial`.
10. Nếu chưa đủ bằng chứng, giữ mục ở `candidate` hoặc `needs_evidence` và nêu rõ phần còn thiếu.

## 6. Nguồn khởi đầu đã kiểm tra tồn tại

Danh sách này là nơi bắt đầu tra cứu, không phải giấy phép sử dụng toàn bộ nội dung trong đó:

- Chương trình môn Lịch sử của Bộ Giáo dục và Đào tạo: `https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1483/vbhn-chuong-trinh-mon-lich-su.pdf`.
- Cục Văn thư và Lưu trữ nhà nước, gồm hồ sơ 1945–1946 và các chuyên đề tài liệu: `https://www.archives.org.vn/`.
- Bảo tàng Lịch sử Quốc gia, mục bài viết, hiện vật, video và chương trình tham quan trực tuyến: `https://baotanglichsu.vn/vi`.
- Viện Phim Việt Nam, tra cứu phim lưu trữ và dịch vụ cung cấp hồ sơ phim: `https://vienphim.org.vn/`.
- Thư viện/ảnh và phim về chiến tranh Việt Nam của National Archives Hoa Kỳ: `https://www.archives.gov/research/vietnam-war`.
- Wikimedia Commons chỉ dùng để tìm file có giấy phép rõ theo từng trang file; phải kiểm tra tác giả, nguồn gốc và license riêng: `https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia`.
- Video YouTube chỉ nhúng theo tùy chọn của chủ video và chính sách trình phát; không xem trạng thái công khai là quyền sao chép: `https://support.google.com/youtube/answer/171780`.

Các báo, kênh truyền hình và nhà xuất bản có thể dùng làm nguồn thứ cấp hoặc đầu mối video. Ưu tiên bản đăng của chính cơ quan sản xuất. Với dữ kiện gây tranh luận, cần tối thiểu hai nguồn độc lập và trình bày phạm vi bất đồng.

## 7. Hợp đồng dữ liệu đề xuất

Không tiếp tục mở rộng các kiểu có tiền tố `Sample`. Tạo kiểu miền ổn định và lưu dữ liệu nghiên cứu ngoài component UI.

```ts
type ClaimConfidence = "verified" | "approximate" | "disputed" | "editorial";
type EditorialStatus =
  | "candidate"
  | "needs_evidence"
  | "researched"
  | "pending_review"
  | "published"
  | "withdrawn";

type DatePrecision = "day" | "month" | "year" | "range" | "approximate";
type RightsStatus =
  | "approved_reuse"
  | "embed_only"
  | "link_only"
  | "permission_required"
  | "unknown";

interface HistoricalDate {
  sortKey: string;       // YYYY-MM-DD, chỉ dùng giá trị đã có nguồn
  display: string;       // cách trình bày đã biên tập
  precision: DatePrecision;
  endSortKey?: string;
}

interface HistoricalEvent {
  id: string;
  slug: string;
  title: string;
  date: HistoricalDate;
  eraId: string;
  topicIds: string[];
  placeIds: string[];
  summary: string;
  learningPurpose: string;
  claimIds: string[];
  mediaIds: string[];
  relatedStoryIds: string[];
  editorialStatus: EditorialStatus;
  reviewerId?: string;
  reviewedAt?: string;
}

interface HistoricalClaim {
  id: string;
  eventId: string;
  text: string;
  confidence: ClaimConfidence;
  sourceIds: string[];
  note?: string;
}

interface MediaAsset {
  id: string;
  kind: "image" | "video" | "audio" | "document";
  sourcePageUrl: string;
  providerUrl?: string;
  providerId?: string;
  title: string;
  creator?: string;
  holdingInstitution?: string;
  createdAt?: string;
  caption: string;
  rightsStatus: RightsStatus;
  licenseName?: string;
  licenseUrl?: string;
  requiredCredit?: string;
  checkedAt: string;
  eventIds: string[];
}
```

Dữ liệu nên đặt tại:

```text
content/history/events.json
content/history/claims.json
content/history/sources.json
content/history/media.json
content/history/side-stories.json
content/history/reviews.json
```

Tạo `scripts/history/validate-content.mjs` để kiểm tra schema, ID tham chiếu, nguồn tối thiểu, trạng thái quyền, URL, ngày truy cập và cổng xuất bản. Ứng dụng đọc dữ liệu qua một adapter có kiểu trong `src/features/history/`; component không đọc JSON trực tiếp.

## 8. Quy trình nghiên cứu theo lô

Mỗi lô tối đa 6–8 sự kiện để tránh mất dấu bằng chứng.

### Cổng A — Lập ứng viên

- Xác định mục tiêu học tập và lý do sự kiện có mặt trong timeline.
- Ghi tên tạm, khoảng thời gian và từ khóa tra cứu.
- Không viết tóm tắt khẳng định khi chưa mở nguồn.

### Cổng B — Kiểm chứng dữ kiện

- Lập 3–7 nhận định nhỏ cho sự kiện.
- Tìm tối thiểu 2 nguồn độc lập, trong đó có ít nhất 1 nguồn cấp cao.
- Ghi trang/mục/timecode hỗ trợ từng nhận định.
- Đánh dấu điểm chưa chắc chắn thay vì làm tròn hoặc suy đoán.

### Cổng C — Tư liệu và quyền

- Tìm ảnh/video theo từng cảnh cần giải thích, không tìm “ảnh cho đẹp”.
- Kiểm tra trang gốc, nguồn ban đầu, quyền và credit.
- Thử nhúng video trong route local; nếu bị chặn, dùng `link_only` và fallback.
- Chỉ `approved_reuse` mới được dùng làm ảnh hiển thị trực tiếp; `embed_only` chỉ dùng trình phát gốc.

### Cổng D — Biên tập câu chuyện

- Viết tóm tắt 80–140 từ cho người học lớp 12.
- Dùng cấu trúc: câu hỏi mở, bối cảnh, diễn biến/lựa chọn, kết quả và ý nghĩa cần thận trọng.
- Viết alt text theo nội dung nhìn thấy; caption nêu xuất xứ và không diễn giải quá ảnh.
- Chuyện bên lề phải có quan hệ rõ với sự kiện và nhãn `oral_history`, `memoir`, `artifact_story` hoặc `archival_fragment`.

### Cổng E — Kiểm duyệt và xuất bản

- Kiểm duyệt viên xem từng nhận định, nguồn, caption và quyền tư liệu.
- Test tự động phải chặn `published` nếu có nguồn hỏng, claim không có nguồn, media `unknown`, thiếu credit bắt buộc hoặc địa điểm không có bằng chứng.
- Sau duyệt, mới xuất hiện trong trang công khai. Mục chưa duyệt chỉ hiện trong chế độ biên tập/local preview có nhãn rõ.

## 9. Điều chỉnh trải nghiệm dòng thời gian

Khi có 25–35 sự kiện, thanh kéo không thể tiếp tục là danh sách 5 phần tử cách đều. Triển khai:

- trục năm thật từ 1945 đến 1975;
- nhãn lớn ở mốc 5 năm và nhãn năm đang chọn;
- marker nhỏ theo năm có nội dung, xếp chồng hoặc gom cụm khi cùng năm;
- bàn phím trái/phải đi giữa các năm có sự kiện;
- vùng kết quả bên dưới liệt kê toàn bộ sự kiện của năm đang chọn;
- nút trước/sau ghi “Sự kiện trước/sau” khi điều hướng từng sự kiện;
- URL lưu `year`, giai đoạn, chủ đề và loại media;
- mobile có danh sách thời gian tuyến tính đầy đủ, không phụ thuộc kéo chính xác;
- `prefers-reduced-motion` không mất nội dung hoặc focus.

Trang Khám phá phải tạo bộ lọc từ dữ liệu, không duy trì danh sách hard-code. Trang Địa điểm phải nhóm sự kiện theo địa điểm và luôn có danh sách văn bản. Một sự kiện có thể có nhiều địa điểm; marker chỉ xuất hiện khi tọa độ và độ chính xác đã có nguồn.

## 10. Kế hoạch triển khai cho Antigravity

### Task 0 — Khóa baseline và bảo vệ cây làm việc

**Files:** không sửa dữ liệu lịch sử.\
**Việc làm:** đọc `AGENTS.md`, xem `git status`, dùng CodeGraph, chạy test hiện có và lưu kết quả. Không reset các thay đổi local của bản UI Antigravity vừa dựng.\
**Đạt khi:** có ghi chú baseline, biết test nào đã lỗi từ trước và không chạm file Word/.env.

### Task 1 — Tạo sổ nghiên cứu và validator trước dữ liệu thật

**Files:** `content/history/*.json`, `scripts/history/validate-content.mjs`, test validator, `package.json`.\
**Việc làm:** định nghĩa cấu trúc, ID và các cổng chặn xuất bản; thêm script `history:data:check` vào `pnpm verify`. Viết fixture giả trong test, không đưa dữ kiện giả vào catalog chạy thật.\
**Đạt khi:** validator từ chối claim không nguồn, nguồn thiếu URL/ngày truy cập, media không rõ quyền trong mục published và tham chiếu ID hỏng.

### Task 2 — Thay mô hình `Sample*` bằng catalog có kiểu

**Files:** `src/features/history/types.ts`, adapter/catalog, test dữ liệu và các caller.\
**Việc làm:** hỗ trợ ngày có precision, nhiều sự kiện/năm, nhiều địa điểm, claim/source/media refs và trạng thái biên tập.\
**Đạt khi:** UI hiện tại vẫn chạy với 5 mục nháp qua adapter; không còn union khóa 5 năm/3 địa điểm.

### Task 3 — Thẩm tra lại 5 mục hiện tại

**Files:** các JSON nội dung và hồ sơ nghiên cứu tương ứng.\
**Việc làm:** kiểm tra lại tên, ngày, phạm vi, địa điểm và chủ đề của 5 mục; không giữ địa điểm chỉ vì đang nằm trong dữ liệu mẫu. Mỗi claim có ít nhất 2 nguồn theo quy tắc trên.\
**Đạt khi:** 5 mục có hồ sơ nguồn hoàn chỉnh hoặc giữ `needs_evidence` với danh sách thiếu sót; không có placeholder giả danh nguồn thật.

### Task 4 — Lập ma trận 40–50 ứng viên

**Files:** `content/history/research-backlog.md` hoặc dữ liệu `candidate`.\
**Việc làm:** đọc chương trình lớp 12 và nguồn tổng quan chính thống, chia theo giai đoạn/chủ đề/địa điểm/mục tiêu học. Xóa mục trùng và mục chỉ khác tên.\
**Đạt khi:** mỗi ứng viên có lý do giáo dục, truy vấn nguồn, trạng thái bằng chứng và không được hiển thị công khai.

### Task 5 — Nghiên cứu ba lô sự kiện

**Lô 1:** 1945–1954, tối đa 8 mục.\
**Lô 2:** 1954–1965, tối đa 8 mục.\
**Lô 3:** 1965–1975, từng nhóm tối đa 8 mục cho đến khi toàn kho đạt 25–35.\
**Việc làm cho từng lô:** hoàn thành Cổng A–D, chạy validator, tạo báo cáo mục đạt/mục bị giữ lại.\
**Đạt khi:** mọi mục có nguồn truy vết; số lượng không được bù bằng dữ liệu yếu.

### Task 6 — Thu thập ảnh, video và chuyện bên lề

**Files:** `media.json`, `side-stories.json`, thành phần media/source.\
**Việc làm:** tìm từ kho chính thống và trang file gốc; ghi quyền riêng từng mục; kiểm tra trình nhúng; thêm credit và fallback.\
**Đạt khi:** giao diện không hiển thị file `unknown`/`permission_required`; link-only không bị render thành ảnh; video không autoplay và có liên kết mở nguồn.

### Task 7 — Nâng cấp Timeline cho dữ liệu dày

**Files:** `src/features/timeline/*`, route, tests.\
**Việc làm:** dùng năm thật, marker cụm, danh sách nhiều sự kiện/năm, URL state và điều hướng bàn phím.\
**Đạt khi:** không chồng nhãn ở 320/768/1024/1440 px; chọn năm luôn đọc được danh sách tương ứng; back/forward phục hồi trạng thái.

### Task 8 — Nối catalog vào Khám phá, Địa điểm và trang sự kiện

**Files:** `src/features/explore/*`, `src/features/places/*`, story routes, tests.\
**Việc làm:** sinh filter động, nhiều địa điểm, nguồn theo claim, media credit và chuyện bên lề. Tạo route động theo slug thay cho chỉ một route Điện Biên Phủ.\
**Đạt khi:** một sự kiện được duyệt xuất hiện nhất quán trong timeline, explore, map/list, tìm kiếm và detail; sự kiện chưa duyệt không lọt vào public selector.

### Task 9 — Kiểm duyệt, kiểm thử và báo cáo

**Việc làm:** chạy validator, unit/component test, Playwright các viewport, kiểm tra link nguồn/media, keyboard, reduced motion, lỗi console và ảnh/video fallback. Chạy `pnpm verify` mới nhất.\
**Đạt khi:** có bảng 25–35 sự kiện cùng trạng thái, số nguồn, số media được phép dùng, các mục bị loại và lý do; `git diff` không chứa file Word, secret hay build output.

## 11. Definition of Done

Một sự kiện chỉ được tính vào 25–35 mục MVP khi:

- có tiêu đề, slug, ngày/độ chính xác, giai đoạn, chủ đề và mục tiêu học tập;
- mọi câu mang dữ kiện trong tóm tắt có claim và nguồn tương ứng;
- có ít nhất hai nguồn độc lập và ít nhất một nguồn cấp cao;
- địa điểm/tọa độ, nếu hiển thị, có nguồn và độ chính xác;
- ảnh/video hiển thị trực tiếp có quyền rõ, credit và URL gốc;
- chuyện bên lề có tư cách nguồn, ngữ cảnh và nhãn rõ;
- kiểm duyệt viên đã duyệt một phiên bản cụ thể;
- xuất hiện đúng trong timeline, explore, map/list, tìm kiếm và detail;
- keyboard, mobile, reduced motion và fallback media hoạt động;
- validator và `pnpm verify` đạt.

## 12. Báo cáo Antigravity phải bàn giao

Antigravity kết thúc mỗi lô bằng bảng:

| Sự kiện | Trạng thái | Claims | Nguồn độc lập | Ảnh được dùng | Video nhúng/link | Chuyện bên lề | Thiếu sót |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |

Ngoài ra phải báo:

- URL đã mở và phần nào của nguồn được dùng;
- media nào bị loại vì sai ngữ cảnh, nguồn gốc hoặc quyền;
- bất đồng sử liệu và cách hiển thị;
- lệnh kiểm thử cùng kết quả mới nhất;
- danh sách file đã đổi và thay đổi local có sẵn đã được giữ nguyên.
