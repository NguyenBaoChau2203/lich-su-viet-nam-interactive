# Kế hoạch hoàn thiện website sau kiểm tra kho lịch sử

**Ngày:** 2026-09-25

**Trạng thái:** Sẵn sàng thực hiện theo checkpoint

**Đầu vào:** `docs/audits/2026-09-25-history-content-and-feature-audit.md`

## Mục tiêu

Hoàn thiện MVP kể chuyện lịch sử Việt Nam 1945–1975 bằng video, hình ảnh, dòng thời gian và địa điểm, với 25–35 sự kiện có provenance kiểm tra được. Bốn vai trò gồm quản trị hệ thống, kiểm duyệt viên, biên tập viên và người dùng.

Kế hoạch ưu tiên khôi phục độ tin cậy của catalog hiện tại trước khi xây luồng quản trị và hoàn thiện UI. Mỗi checkpoint phải có kết quả có thể xem, test và quyết định tiếp tục.

## Nguyên tắc thực hiện

- Không bịa URL, câu chuyện, trích dẫn, reviewer, credit, license, tọa độ hoặc mối quan hệ lịch sử.
- `published` là kết quả của review thật đối với một phiên bản nội dung cụ thể.
- Mỗi claim công khai phải nối tới nguồn và vị trí đủ cụ thể để người khác kiểm tra.
- Media được mô tả đúng bản chất: ảnh cùng thời, ảnh hiện vật/địa điểm chụp sau, bản đồ, minh họa, video gốc hoặc video tổng hợp.
- Không dùng ảnh AI như tư liệu lịch sử.
- Không thu thập hàng loạt trước khi một lát cắt chuẩn đã đi qua toàn bộ data → review → public UI.
- Chỉ thêm dependency khi dependency hiện có hoặc Web Platform không đáp ứng được.

## Sơ đồ phụ thuộc

```text
Checkpoint A — Chặn công bố sai
  1. Quarantine catalog
  2. Public preview trung thực
  3. Gỡ media gắn sai
        ↓
Checkpoint B — Một lát cắt chuẩn
  4. Validator provenance
  5. Audit URL/media tự động
  6. Điện Biên Phủ end-to-end
  7. Làm sạch catalog theo lô
        ↓
Checkpoint C — Quy trình 4 vai trò
  8. Schema + RLS
  9. Repository/import
 10. Auth + route guard
 11. Biên tập viên
 12. Kiểm duyệt viên
 13. Quản trị hệ thống
        ↓
Checkpoint D — Trải nghiệm công khai
 14. Trang chủ + Khám phá
 15. Dòng thời gian
 16. Bản đồ/địa điểm
 17. Trang câu chuyện video-first
 18. Responsive + a11y + hiệu năng
        ↓
 19. Nghiệm thu phát hành
```

---

## Checkpoint A — Chặn công bố sai

### Task 1: Quarantine 32 sự kiện hiện tại

**Mục đích:** Không để validator hoặc UI tiếp tục gọi dữ liệu chưa xác minh là đã thẩm định.

**File dự kiến:**

- `content/history/events.json`
- `content/history/reviews.json`
- `src/features/history/types.ts`
- `scripts/history/validate-content.mjs`
- test validator liên quan

**Thực hiện:**

1. Viết test đỏ: sự kiện `published` với review giả lập hoặc nguồn chưa qua remote audit phải bị từ chối.
2. Bổ sung trạng thái tối thiểu `needs_evidence`, `in_review`, `published`, `rejected` nếu model chưa có.
3. Hạ 32 sự kiện về `needs_evidence` hoặc trạng thái tương đương.
4. Xóa hoặc vô hiệu 32 review giả lập; tuyệt đối không thay bằng tên người khác.
5. Không xóa nội dung nghiên cứu đang có; giữ nó trong preview để biên tập lại.

**Chấp nhận:** Không sự kiện nào có thể trở thành `published` chỉ nhờ đủ trường JSON.

### Task 2: Tách preview khỏi catalog công khai

**File dự kiến:**

- `src/features/history/catalog.ts`
- `src/features/history/data.ts`
- các route trong `src/app/`
- test catalog/route liên quan

**Thực hiện:**

1. Public selector chỉ trả về `published` hợp lệ.
2. Tạo selector preview riêng, dùng nhãn rõ “Dữ liệu đang thẩm tra”.
3. Trong môi trường chưa có event được duyệt, public route hiển thị empty state có chủ đích hoặc preview có cảnh báo; không fallback âm thầm sang dữ liệu mẫu và gọi nó là thật.
4. Gỡ các cụm “đã thẩm định”, “chuẩn SGK” và tên cơ quan suy diễn khi dữ liệu không chứng minh được.

**Chấp nhận:** Người dùng không thể hiểu nhầm preview là nội dung đã kiểm chứng.

### Task 3: Gỡ video sai và sửa phân loại media tối thiểu

**File dự kiến:**

- `content/history/media.json`
- `src/features/history/HistoricalMediaView.tsx`
- `src/features/home/CinemaBand.tsx`
- test component/E2E liên quan

**Thực hiện:**

1. Viết test đỏ kiểm tra YouTube ID không được gắn cho sự kiện khi metadata không khớp.
2. Gỡ ID `UIutoCqw01Y` khỏi Điện Biên Phủ và Đại thắng mùa Xuân 1975.
3. Không thay bằng URL phỏng đoán; hiển thị trạng thái “video đang được xác minh”.
4. Thêm nhãn media tối thiểu để phân biệt ảnh tư liệu cùng thời, ảnh hiện vật/địa điểm chụp sau, bản đồ và minh họa.
5. Gỡ nhãn “ẢNH TƯ LIỆU GỐC” khỏi media không đủ điều kiện.
6. Ẩn control/chapter giả cho tới khi có video và chapter thật.

**Chấp nhận:** Không route nào còn phát video Hồ Chí Minh dưới nhãn Điện Biên Phủ/1975 và không ảnh hiện đại nào bị gọi là ảnh gốc của sự kiện.

### Cổng A

Chạy:

```bash
pnpm history:data:check
pnpm test
pnpm test:e2e
pnpm verify
```

Dừng và bàn giao screenshot + diff. Chưa thực hiện Task 4–19 nếu cổng A chưa được duyệt.

---

## Checkpoint B — Provenance và lát cắt chuẩn

### Task 4: Nâng validator provenance

**File dự kiến:**

- `scripts/history/validate-content.mjs`
- test fixture hợp lệ/không hợp lệ
- schema/type trong `src/features/history/`

**Quy tắc bắt buộc:**

- Claim công khai có ít nhất một `sourceReference` gồm `sourceId` và `locator` (trang, mục, timecode hoặc đoạn xác định).
- Event công khai có ít nhất hai nguồn phù hợp; ít nhất một nguồn chính thống/học thuật cấp cao theo taxonomy đã định nghĩa.
- Review trỏ tới content revision/hash và reviewer account thật.
- Media có `sourcePageUrl`, `assetUrl/embedUrl`, creator/agency, rights status, checked date và credit.
- `approved_reuse` cần license có thể kiểm tra; `embed_only` chỉ render bằng cơ chế nhúng cho phép; `unknown` không hiện công khai.
- Lời kể có người kể, người ghi/phỏng vấn, thời gian, nguồn và locator; thiếu thì phải là `editorial` hoặc private.
- Tọa độ `exact` cần nguồn tương ứng; không đủ thì dùng `approximate` và mô tả phạm vi.

### Task 5: Tạo audit URL/media lặp lại được

**File dự kiến:**

- `scripts/history/audit-remote-sources.mjs`
- `scripts/history/audit-media-metadata.mjs`
- output báo cáo có ngày trong `docs/audits/`
- script trong `package.json`

**Thực hiện:**

1. Kiểm tra HTTP status, redirect cuối, title/canonical URL và ngày kiểm tra.
2. Với YouTube, đọc oEmbed để so title/channel/video ID.
3. Với Commons, đọc API metadata: title, creator, license, original date, description và canonical page.
4. Tool chỉ gắn cờ; không tự tuyên bố nguồn hỗ trợ claim bằng so khớp từ khóa.
5. Cache/bounded concurrency và báo lỗi mạng là `unverified`, không là `valid`.

### Task 6: Xây lát cắt chuẩn Điện Biên Phủ

Áp dụng skill nội bộ `build-map-timeline-slice`, `research-history-sources` và `design-history-story`.

**Phạm vi:**

- một event;
- claim và source locator;
- một hoặc nhiều địa điểm có nguồn tọa độ;
- media có quyền/phân loại chính xác;
- timeline marker;
- map marker;
- route câu chuyện;
- review thật trong môi trường phát triển bằng tài khoản vai trò hợp lệ.

**Chấp nhận:** Một người kiểm tra độc lập có thể đi từ câu chữ trên UI tới đúng nguồn và đúng vị trí trong nguồn.

### Task 7: Làm sạch 31 sự kiện còn lại

Chia lô tối đa 6 sự kiện, không chạy đồng thời trên cùng file. Mỗi lô:

1. Xác minh tên, khoảng ngày, địa điểm và 2–4 claim cốt lõi.
2. Thay URL sai bằng trang nguồn thật sau khi kiểm tra trực tiếp.
3. Ghi locator và mức chắc chắn `verified`, `disputed`, `approximate` hoặc `editorial`.
4. Kiểm tra media và quyền từ trang gốc.
5. Loại lời kể không truy vết được; không viết lại thành lời nhân chứng mới.
6. Chạy validator, review và báo cáo chênh lệch từng lô.

**Chấp nhận:** Có 25–35 sự kiện đạt chuẩn. Mục không đủ bằng chứng vẫn ở `needs_evidence` và không xuất hiện trong catalog công khai.

### Cổng B

- Một lát cắt chuẩn được duyệt trước khi làm hàng loạt.
- Mỗi lô có audit nguồn/media riêng.
- Không có URL sai đã biết trong tập `published`.
- Test validator có case URL unreachable, mismatch metadata, review stale và media rights thiếu.

---

## Checkpoint C — Supabase và quy trình bốn vai trò

### Task 8: Mở rộng schema và RLS

**File dự kiến:**

- migration mới trong `supabase/migrations/`
- pgTAP trong `supabase/tests/`
- tài liệu ERD/quyền trong `docs/`

**Bảng/quan hệ tối thiểu:**

- `profiles`, `user_roles`;
- `events`, `event_revisions`;
- `claims`, `claim_sources`, `sources`;
- `places`, `event_places`, `coordinate_sources`;
- `media_assets`, `media_rights_checks`, `event_media`;
- `side_stories`, `story_sources`;
- `review_decisions`, `publication_snapshots`.

**RLS:**

- người dùng ẩn danh chỉ `select` snapshot đã publish;
- biên tập viên tạo/sửa draft của mình, gửi review, không tự publish;
- kiểm duyệt viên đọc submission, ghi quyết định, không sửa nội dung để hợp thức hóa review;
- quản trị hệ thống quản lý vai trò/tài khoản; thao tác đặc quyền ở server;
- test cả allow và deny; service role không vào client.

### Task 9: Repository và import có kiểm soát

- Tạo interface repository nhỏ cho query public và staff.
- Viết importer idempotent từ JSON đã làm sạch sang schema.
- Không để client truy cập bảng draft trực tiếp.
- Giữ fixture JSON cho test nếu cần; Supabase là nguồn thật khi tích hợp hoàn tất.

### Task 10: Auth và bảo vệ route nhân sự

- Dùng Supabase SSR theo hướng dẫn phiên bản đang cài.
- Kiểm tra session và role ở server cho mọi action/route quản trị.
- Không tin role gửi từ client.
- Tạo route staff riêng, focus/keyboard đầy đủ và trạng thái hết phiên rõ ràng.

### Task 11: Luồng biên tập viên

- Danh sách draft, trạng thái và lý do trả lại.
- Form event/claim/source/place/media/side story.
- Preview desktop/mobile trước khi gửi.
- Không cho gửi review nếu validator còn lỗi.
- Lưu revision mới thay vì ghi đè bản đã duyệt.

### Task 12: Luồng kiểm duyệt viên

- Hàng đợi review và diff giữa revisions.
- Mỗi claim mở được nguồn + locator.
- Kiểm tra media/right/credit và vị trí bản đồ.
- Quyết định `approve`, `request_changes`, `reject` kèm ghi chú.
- Approval tạo publication snapshot bất biến.

### Task 13: Luồng quản trị hệ thống

- Mời/khóa tài khoản nhân sự và cấp/thu hồi role.
- Xem audit log cơ bản.
- Không cho xóa reviewer/source đang được snapshot công khai tham chiếu; dùng deactivate/retire.

### Cổng C

- Local Supabase chạy được và `supabase test db` xanh.
- Test xác nhận từng role bị từ chối thao tác ngoài quyền.
- Một revision đi trọn editor → reviewer → publication snapshot.
- Key đặc quyền không xuất hiện trong bundle/log/fixture.

---

## Checkpoint D — Hoàn thiện trải nghiệm công khai

### Task 14: Trang chủ và Khám phá

- Trang chủ lấy nội dung nổi bật từ catalog sạch; không iframe video ngoài màn hình khi chưa được người dùng kích hoạt.
- Search chuẩn hóa Unicode, tìm được cả có dấu và không dấu.
- Filter chủ đề/giai đoạn/địa điểm sinh từ catalog, lưu vào URL.
- Mỗi view mode có mục đích rõ: danh sách theo thời gian, theo chủ đề hoặc theo địa điểm.
- Empty state giải thích bộ lọc và cho phép xóa từng điều kiện.

### Task 15: Dòng thời gian tương tác

- URL giữ năm, event, chủ đề và giai đoạn.
- Nhiều sự kiện trong cùng năm dùng lane/stack dễ đọc.
- Mobile dùng danh sách năm hoặc snap phù hợp thay vì ép toàn bộ nhãn lên một trục hẹp.
- Arrow key, Tab, focus visible, reduced motion và back/forward hoạt động.

### Task 16: Bản đồ và địa điểm

- Xóa `MAP_MARKERS` hard-code; marker sinh từ dữ liệu địa điểm đã xác minh.
- URL giữ khoảng năm, địa điểm và event đang chọn.
- Liên kết hai chiều timeline ↔ map ↔ story.
- Có list fallback đầy đủ cho bàn phím, screen reader, JS/animation failure.
- Tọa độ approximate phải được thể hiện như vùng/độ bất định, không ghim exact giả.

### Task 17: Trang câu chuyện video-first

- Loại route tĩnh Điện Biên Phủ trùng route động sau khi parity đạt.
- Hero ưu tiên video/ảnh phù hợp, với click-to-load cho embed bên thứ ba.
- Chapter lấy từ timecode thật; không có chapter thì không render control giả.
- Transcript có nguồn media và cho phép mở theo timecode.
- Claim quan trọng có citation mở tới nguồn/locator.
- Khu “câu chuyện bên lề” phân biệt lời chứng, ký ức hồi cố và ghi chú biên tập.
- Media credit/license/source link luôn nhìn thấy và truy cập bàn phím được.

### Task 18: Responsive, accessibility và performance

- Kiểm tra 320, 768, 1024, 1440 px.
- Sửa header mobile, tap target, heading order, landmark, focus trap và contrast WCAG AA.
- Tôn trọng `prefers-reduced-motion`; nội dung vẫn dùng được khi animation/JS lỗi.
- Lazy-load media, dùng ảnh có kích thước phù hợp, tránh tải iframe/video cho card ngoài viewport.
- Đặt budget hợp lý cho LCP/CLS và bundle route; chỉ tối ưu theo đo đạc.

---

## Task 19: Nghiệm thu phát hành

### Kiểm tra dữ liệu

- 25–35 event `published` có revision + review thật.
- Claim-source coverage 100% với locator.
- Không media `unknown`/`permission_required` xuất hiện công khai.
- Link checker không có URL sai đã biết; lỗi mạng được đưa vào hàng đợi kiểm tra lại.
- Bảng truy vết event → claims → sources → media → reviewer được xuất ra báo cáo.

### Kiểm tra sản phẩm

- Người dùng đi được Explore → Timeline/Map → Story → Source.
- URL share/back/forward phục hồi trạng thái có ý nghĩa.
- Bốn kích thước màn hình và bàn phím/reduced motion đạt.
- Luồng editor/reviewer/admin đạt test quyền.

### Lệnh bắt buộc

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm agent:check
pnpm verify
supabase test db
git diff --check
git status --short
```

Không tuyên bố hoàn tất nếu lệnh tương ứng chưa có output mới hoặc local Supabase chưa chạy. Không stage file Word, `.env`, build output hay thay đổi ngoài phạm vi.

## Ngoài phạm vi của kế hoạch này

Quiz, yêu thích, tài khoản học sinh, AI, 3D, game và scrollytelling nâng cao chỉ được lập kế hoạch riêng sau khi MVP nguồn–timeline–map–story đạt cổng phát hành.
