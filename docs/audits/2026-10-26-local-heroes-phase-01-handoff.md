# Bàn giao nghiên cứu nhân vật cách mạng địa phương — Phase 01

Ngày: **26/10/2026, Asia/Bangkok**. Hợp đồng đã duyệt: **`LH-1.0.0-draft.1`**.

**Chủ dự án đã duyệt gói nghiên cứu/roster/hash Phase 01 ngày 26/10/2026; chưa đủ nội dung phát hành toàn quốc.** Gói v14 có ứng viên kèm nguồn quan hệ cho 34/34 địa phương, 53 người được đề cử, 35 người đề xuất chọn, **2 hồ sơ hoàn chỉnh**, **33 hồ sơ được chọn còn thiếu**, **18 người held**. Chủ dự án đã duyệt danh sách/hash thực tế này; `ownerApproval.status` là `approved`. [Bản ghi phê duyệt](2026-10-26-local-heroes-phase-01-approval.md) giữ nguyên lời xác nhận và hash. Có thể bắt đầu Phase 02 trong chat mới; lần cập nhật này chưa triển khai Phase 02.

## Phạm vi và quyền tiếp tục

Chủ dự án duyệt Phase 00 và ban đầu để Phase 01 cho mô hình khác. Sau khi Gemini làm một phần rồi hết usage, chủ dự án yêu cầu agent hiện tại tiếp tục. Yêu cầu mới cho phép tiếp tục Phase 01, thay thế việc dành riêng phase này cho mô hình trước; việc tiếp tục lúc đó chưa phải phê duyệt roster. Quyết định duyệt roster được chủ dự án gửi sau bản bàn giao và đã ghi riêng tại bản ghi phê duyệt ở trên.

Một agent chính thực hiện nghiên cứu, chỉnh sửa, self-review và kiểm tra; không gọi agent, mô hình, chat hay CLI AI thứ hai. Giữ nhánh `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Không sửa ứng dụng/schema, import, upload ảnh, xuất bản, commit, push, PR, merge hay deploy. Word/PDF/ảnh và thay đổi ngoài phạm vi được giữ nguyên.

## Gói dữ liệu đã đóng băng

- [Manifest v14](../../supabase/content/local-heroes/national-v1/manifest.json), `rosterFrozen: true`.
- `manifestHash`: **`893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`**.
- Hash trước: `a8e2f0d3c8dd1608dcefcf6b213e044760f2d907e2c9c06299d2641b5dae0fda`.
- [JSON Schema](2026-10-26-local-heroes-manifest.schema.json) giữ nguyên SHA-256 `a3b90d16f23fa2a368cbb358e0725da63f3c39983ea4dbad457b1a286a8a23a0`.
- Chín hash thành phần tính từ byte thực; hash manifest tính theo canonical algorithm của hợp đồng, loại trường tự băm và phần phê duyệt.
- Khung `VN-34-2025`, đủ 34 cặp mã/tên đã duyệt. PDF hành chính chỉ chứng minh danh mục, không làm nguồn tiểu sử/đóng góp.

| Thành phần | Tổng | Trạng thái bàn giao |
| --- | ---: | --- |
| `localities.json` | 34 | Đủ mã/tên canonical |
| `people.json` / `roster.json` | 53 người | 35 đề xuất chọn (`accepted`), 18 held; selection khác với `complete` |
| Hồ sơ được chọn | 35 | 2 complete, 33 incomplete |
| `coverage.json` | 34 | 2 ready_for_review (01 Hà Nội, 04 Cao Bằng), 32 researching; 0 represented, publicSnapshot null |
| `sources.json` | 81 | 47 accepted, 32 held, 2 excluded vì sai bài |
| `claims.json` | 213 | 165 accepted, 48 held; certainty tách khỏi workflow |
| `relations.json` | 46 | 38 accepted có nguồn/claim quan hệ đủ điều kiện, 8 held kế thừa |
| `stories.json` | 12 | 2 accepted, 10 held kế thừa không phải truyện chính |
| `media.json` | 12 | 2 accepted đã xem/đo ảnh gốc, 10 held kế thừa |

Đây là độ phủ **nghiên cứu**, không phải độ phủ nội dung công khai. Người đa địa phương vẫn chỉ tính một danh tính. Hoàn thành mọi người trong roster được chọn và ít nhất một hồ sơ đầy đủ cho từng địa phương vẫn là điều kiện phát hành toàn quốc.

## Các sửa chữa có bằng chứng

Đã lưu baseline cục bộ trước sửa. Kiểm tra đầu vào ghi **180 lỗi** cấu trúc/tham chiếu/hash; self-review sau đó sửa thêm **18 claim quan hệ** dùng khóa người thay vì ID quan hệ. Kiểm tra phần mềm không chứng nhận sự thật lịch sử.

- Rút lại kết luận kế thừa “10 hồ sơ hoàn chỉnh/10 địa phương represented”. Mười truyện/ảnh ban đầu giữ held; hai hồ sơ hoàn chỉnh hiện tại được viết và kiểm tra lại riêng.
- Sửa 24 tham chiếu người bị thiếu, trường locality ngoài schema, hash sai và claim truyện/ảnh thiếu subject/chứng cứ riêng.
- Dùng snapshot **SELECT-only** chín nhân vật canonical để giữ ID hiện có; tái sử dụng Văn Tiến Dũng, Lê Duẩn và Phạm Văn Đồng thay vì bản sao `new:`. Sáu canonical chưa được chọn vẫn held. Metadata ID không tự chứng minh tiểu sử.
- Sửa Bế Văn Đàn từ Lai Châu gán sai sang Mường Pồn/Điện Biên và quê Cao Bằng; thêm Trần Quốc Mạnh (Nguyễn Bá Lạc) với nguồn riêng cho Lai Châu. Không suy quê quán từ nơi hoạt động của Tạ Xuân Thu/Hoàng Trường Minh.
- Loại alias Bùi Văn Tùng gán nhầm cho Hoàng Lê Kha; tên nguồn nêu là Hoàng Lê Cẩn. Sửa hiển thị Bông Văn Dĩa, giữ slug ổn định. Ngày/năm sinh mất hoặc alias còn mâu thuẫn để trống kèm gap.
- Excluded hai URL kế thừa trả HTTP 200 nhưng sai bài: URL Hoàng Văn Thụ thực tế nói về thuốc nam cho trẻ; URL Kim Đồng thực tế nói về Việt Minh năm 1941.
- Bỏ đề cử held Nguyễn Văn Linh–Cần Thơ vì bài không chứng minh hoạt động ở đó; tên báo không phải bằng chứng địa phương. Thay bằng đầu mối Lê Bình/Cái Răng có nội dung liên quan. Nguyễn Văn Linh vẫn held cho Hưng Yên; không loại/hạ trạng thái người đã chọn.

[Audit JSON](sources/2026-10-26-local-heroes-phase-01-research-audit.json) lưu snapshot chín danh tính, truy vấn, baseline lỗi, lịch sử phiên bản, URL probes và kết quả offline. Chỉ đọc metadata nhân vật của dự án liên kết, không sửa dữ liệu/schema DB.

## Hai hồ sơ mẫu hoàn chỉnh

| Người | Truyện chính | Ảnh được chấp nhận |
| --- | --- | --- |
| Văn Tiến Dũng — canonical `c0bcb4b3-9a6a-4f02-aae5-2d38dbc3c15a` | `story-research-van-tien-dung-1975`, **417 từ** | Điện báo tin thắng lợi Tây Nguyên tháng 3/1975, **480×286**, **36.148 byte**; Bảo tàng Lịch sử quốc gia/Tiền Phong |
| Kim Đồng — `new:kim-dong` | `story-research-kim-dong-na-ma`, **408 từ** | Bản chụp bằng Có công với nước truy tặng năm 1944, **480×322**, **28.810 byte**; Bảo tàng Lịch sử quốc gia |

Số từ đếm sau khi bỏ citation/Markdown. Mỗi đoạn có `[[cite:claim-key]]`, claim thuộc đúng story và có nguồn/locator. Câu hỏi học tập có certainty editorial; không dựng thoại, tâm lý hay trích dẫn. Chỉ dùng phần nguồn đã trực tiếp đọc.

Hai ảnh có caption **“Tư liệu bối cảnh, không phải chân dung”**, claim bối cảnh riêng, SHA-256 byte gốc và alt text. Ảnh Kim Đồng chụp văn bản trong khung trưng bày: historical mô tả **văn bản được tái hiện**, không khẳng định ảnh chụp năm 1944; yearTaken null. Không dùng ảnh di tích hiện đại giả làm ảnh đương thời. Đã xem trực tiếp, không tạo/sửa/crop/tô màu ảnh.

Usage chỉ `coursework_reference` theo hợp đồng và chính sách đồ án đã ghi; license null, không xác lập giấy phép mở hoặc quyền upload/xuất bản rộng hơn. Chưa đưa ảnh vào public asset. [Ledger ảnh](../content/local-heroes/media.md) có URL, byte hash, caption và giới hạn từng ảnh.

## Roster hữu hạn và việc còn lại

[Roster](../content/local-heroes/roster.md) có chín canonical, 31 danh tính mới lượt đầu và 13 danh tính mới lượt hai. Giữ 34 đề xuất ban đầu sau khi sửa bằng chứng, bổ sung Trần Quốc Mạnh: mẫu số được chủ dự án duyệt là **35 người**; 18 người held và 33 hồ sơ được chọn còn thiếu vẫn giữ nguyên.

[Discovery](../content/local-heroes/discovery.md) ghi two-pass-v1: sau khi 01/04 có hồ sơ mẫu hoàn chỉnh, có đúng **32 mục lượt hai**, mỗi địa phương còn thiếu một mục bổ sung, dưới giới hạn ba ứng viên/lượt. Đề cử thêm một địa phương cho người đã có không tự sinh quan hệ accepted. Các đầu mối thiếu chứng cứ/định danh vẫn held.

[Hàng đợi Phase 06](../content/local-heroes/phase-06-queue.md) chia **33 người được chọn còn thiếu** thành bốn đợt **10/10/10/3**, theo mã địa phương đủ điều kiện còn thiếu thấp nhất rồi person key. Mỗi người chỉ xuất hiện một lần, có gap về truyện, ảnh và claim. 18 người held là hàng đợi xem xét riêng; chọn thêm phải sửa mẫu số/version có dấu vết.

**Cổng phê duyệt roster/hash trước Phase 02 đã được đáp ứng.** Chat mới có thể thực hiện prompt Phase 02 sau khi đọc bản ghi phê duyệt và kiểm tra các prerequisite còn lại, đặc biệt DB local/test thực sự disposable. Không cần xin duyệt lại cùng danh sách/hash. Các thay đổi roster sau này cần phiên bản và phê duyệt mới; không chạy Phase 02 hoặc Phase 06 trong lần ghi nhận này.

## Bằng chứng kiểm tra

Kiểm tra mới ngày 26/10/2026, sau khi đóng băng v14; các lệnh dưới đây đều exit 0. Log và JSON kết quả lưu trong `.task-reports/local-heroes-phase-01-resume-work/`.

| Lệnh | Kết quả mới nhất |
| --- | --- |
| `node .task-reports/local-heroes-phase-01-resume-work/check-package.cjs` | Pass, **0 lỗi** schema-keyword/reference/hash/JSON; đủ 34 locality và 34 coverage |
| `node .task-reports/local-heroes-phase-01-resume-work/check-research-semantics.cjs` | Pass **1.539 assertions**, 0 lỗi; cả **5 negative controls** bị từ chối đúng |
| `node .task-reports/local-heroes-phase-01-resume-work/check-handoff-artifacts.cjs` | Pass: 22 file UTF-8/NFC/LF, link local tồn tại, schema hash giữ nguyên, nhánh/HEAD không đổi, không có file staged; báo cáo được ignore |
| `pnpm history:data:check` | Pass **42/42 tests**, hai test files, bắt đầu 16:29:55 Asia/Bangkok |
| `pnpm verify` | Pass: agent check, history check, ESLint, strict TypeScript, **1.046 tests / 83 files**, **26 script tests**, production build **102/102 pages**; bắt đầu 16:30:13 Asia/Bangkok |
| `pnpm agent:status` | CodeGraph complete: **762 supported source files**, không pending; graph không kiểm tra Markdown/JSON/DB live |

`git diff --check` đã pass sau cập nhật kết quả; kiểm tra artifact pass **22 file / 390 link local**, không lỗi UTF-8/NFC/LF, whitespace hoặc link local. [Audit JSON](sources/2026-10-26-local-heroes-phase-01-research-audit.json) ghi kết quả fresh cùng SHA-256 log của cổng repo. Self-review gồm diff tracked và so byte/hash của 16 file kế thừa vì phần lớn gói nghiên cứu vẫn untracked. Không có file staged; báo cáo local được Git ignore.

- `node .task-reports/local-heroes-phase-01-resume-work/check-package.cjs`: kiểm tra keyword thực sự dùng trong schema, duplicate JSON keys, NFC, ID/reference/hash. Checker riêng cho task, **không phải chứng nhận đầy đủ Draft 2020-12** hay validator sản phẩm Phase 02.
- `node .task-reports/local-heroes-phase-01-resume-work/check-research-semantics.cjs`: claim ownership/certainty/workflow, roster/coverage, citation/số từ, canonical ID, byte/dimension ảnh; năm dữ liệu sai có chủ đích phải bị từ chối.
- Cổng repo: `pnpm history:data:check`, `pnpm verify`, `pnpm agent:status`, `git diff --check`; kiểm tra artifact bổ sung vì phần lớn file vẫn untracked.
- `scripts/content/check-local-heroes.mjs` chưa có: đầu ra Phase 02. History gate hiện hữu không tự kiểm tra manifest này.
- Không đổi UI/DB. `pnpm verify` không chạy browser E2E hay test quyền RLS thực; không ghi hai loại bằng chứng đó là pass.

## Giới hạn và rủi ro

47 nguồn accepted được đọc trong phạm vi claim đã ghi. Probe HTTPS không credentials trả 46 HTTP 200; một bài Lương Văn Tụy trả HTTP 500 nhưng response có toàn văn đúng bài và đã đọc qua công cụ web khác. Cần thử lại/bổ sung nguồn ổn định trước xuất bản. HTTP 200 hoặc kết quả tìm kiếm không chứng minh nội dung.

Các gap ghi rõ mâu thuẫn/chất lượng nguồn: câu bất hợp niên biểu trong bài Hoàng Văn Thụ không dùng; Nguyễn Thị Minh Khai cần nguồn lưu trữ đối chiếu; hai bài Lê Thị Pha dẫn cùng một nhân chứng không phải hai bằng chứng độc lập. Không tự nâng tước hiệu, ngày/alias chưa chắc hoặc quan hệ mới được đề cử thành verified.

Đây là **self-review**, chưa được giáo viên/nhà sử học hay reviewer độc lập xác nhận. 33 hồ sơ còn thiếu là việc thực tế cần hoàn thành; không bulk-promote bản kế thừa để đạt số lượng. Tất cả 34 địa phương và mọi người được chọn vẫn bắt buộc hoàn chỉnh trước khi đề xuất phát hành.

## File bàn giao

- Mười JSON: `supabase/content/local-heroes/national-v1/`.
- Bảy ledger: [coverage](../content/local-heroes/coverage.md), [roster](../content/local-heroes/roster.md), [sources](../content/local-heroes/sources.md), [claims](../content/local-heroes/claims.md), [media](../content/local-heroes/media.md), [discovery](../content/local-heroes/discovery.md), [queue](../content/local-heroes/phase-06-queue.md).
- [Audit JSON](sources/2026-10-26-local-heroes-phase-01-research-audit.json), [plan cập nhật](../superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md), checkpoint trong `docs/agent/CURRENT-STATE.md`.
- Báo cáo local được Git ignore: [2026-10-26-1624-local-heroes-phase-01.md](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-26-1624-local-heroes-phase-01.md). Không stage/force-add/commit báo cáo.

Điểm dừng: Phase 01 và phê duyệt roster/hash đã được ghi nhận; sẵn sàng mở chat mới cho Phase 02. Chưa triển khai schema/server/admin/UI phase sau. Xem bản ghi phê duyệt để có lệnh bắt đầu và bằng chứng kiểm tra của lần cập nhật này.
