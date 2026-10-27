# Bàn giao phát hành Supabase và kiểm thử local cuối — 27/10/2026

Đã hoàn thành phát hành tính năng nhân vật lên **lichsu_12 / ueolfjujjybutyuyfxha** theo yêu cầu rõ ràng của chủ dự án. Thực hiện bằng một agent, điều tra/triển khai/**self-review**/kiểm chứng trực tiếp; không phải review độc lập hay chứng nhận sử học.

## Mở để kiểm thử

- Danh mục: **http://127.0.0.1:3000/?noi-dung=nhan-vat**.
- Trang chủ: **http://127.0.0.1:3000/**; quản trị: **http://127.0.0.1:3000/quan-tri/dang-nhap**.
- Cửa sổ Edge hiển thị đã mở bản cuối. Server loopback do agent khởi động được giữ chạy, dùng bản production cấu hình bình thường và Supabase hệ thống; không dùng fixture công khai hoặc khóa giả.
- Chủ dự án còn thực hiện lần nghiệm thu thủ công cuối. Việc bàn giao không giả nhận kết quả nghiệm thu của chủ dự án.

## Đã sửa và đã phát hành

- Xử lý ba nhân vật canonical đã xuất bản/liên kết sự kiện sẵn: Văn Tiến Dũng, Phạm Văn Đồng, Lê Duẩn. Giữ nguyên UUID/slug và toàn bộ trường gốc, ảnh cover cũ, liên kết sự kiện. Bổ sung dẫn chứng đã mở/đối chiếu cho9 trường tiểu sử/năm sinh/năm mất được giữ lại; không ghi đè lịch sử cũ để ép importer chạy.
- Tạo bộ chuẩn bị phát hành riêng, xác định trước ID/source fingerprint và before image; từ chối nhầm danh tính, nguồn/nội dung đã sửa, liên kết con lạ và phần catalog nháp có sẵn. Import nháp cũ vẫn giữ nguyên cơ chế từ chối legacy.
- Xử lý dữ liệu nguồn bổ sung chưa chuẩn NFC và xung đột cover duy nhất trước phát hành. Hai ảnh đại diện mới của legacy không thay cover cũ.
- Sao lưu schema public và dữ liệu lịch sử liên quan, lập adoption track riêng; không chạy lại các migration cũ của root và không ghi nhận giả rằng chúng từng chạy.
- Gỡ4 biến không dùng, hết3 cảnh báo lint cũ; không chạy lại generator lên ledger lịch sử.
- Sửa dòng giao diện còn báo chờ phát hành thành “Độ phủ hiện có: 34/34 địa phương tham chiếu có hồ sơ đủ điều kiện đọc.”; kiểm tra/rebuild lại và mở lại web.

## Kết quả thực tế trên Supabase

| Nội dung | Quan sát sau giao dịch |
| --- | --- |
| Nhân vật công khai trong catalog |**35**, mỗi người có story/ảnh/claim/quan hệ địa phương đủ điều kiện |
| Câu chuyện chính đã công bố |**35** |
| Địa phương tham chiếu có hồ sơ |**34/34** |
| Tổng canonical figure của hệ thống |**41** =9 cũ giữ nguyên+32 mới;3 cũ được đưa vào catalog |
| Sự kiện/liên kết sự kiện |**46/17**, fingerprint không đổi |
| Sources/media tổng |**106/66**;30 nguồn cũ và6 ảnh figure cũ không đổi |
| Roster |53 ứng viên,35 chọn/18 held;30 story held/24 ảnh held vẫn không xuất bản |
| Schema mới |6 bảng bật RLS;ledger đúng2 phiên bản adoption/feature |

Thời điểm quan sát, đủ34 mã địa phương, ID và hash response được lưu tại [publication JSON](sources/2026-10-27-local-heroes-live-publication.json). Truy vấn công khai được thực hiện với role anon, không suy số liệu live từ fixture/local.

## Artifact và đường hoàn tác

- Research v18 bất biến: `06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416`; snapshot nháp cũ `bc6bdbf6f6fcd6c4259987b9b010514109b5fdffe044c50f0fa52329a5c74a53`.
- Gói metadata phát hành v19: `supabase/content/local-heroes/published-national-v1/`, hash `eece5e9012d40371947fc93687f10478325942e54ef9a19ceabf5edb5db1f9f0`. Tám file lịch sử giống hệt v18; chỉ approval/coverage/public observation đổi. `national-v1/` vẫn là input bất biến để tái tạo bằng chứng/import nháp.
- Artifact đã chạy: `supabase/content/local-heroes/live-release-20261027-v5/`, release hash `0dcfc960010153a91fd3501c0004ed2b9c84138ab9ce45d356555d167c3ba43d`.
- `publish.sql` SHA-256 `98081843e08f589b6b7ebc39e3e3f4b06e7a5ff18fff54694c9e269d7851f69e`; `rollback-content.sql` SHA-256 `0f438056638c84d889083427361e443e39db1aaec8faa9ab4baba8e13a5109e2`.
- Schema backup SHA-256 `852c69884eeb9539c8dc3cc63f4a4a8ed265b97b3ec7496d42237faccd94c78d`; before image public `f61ea0f1d5736af962e0b056a17a91b4331a9afada8167ff0136946b4f0381d5`.
- Track `supabase/releases/local-heroes-20261027/`: adoption `20261027000000`, feature `20261031000001`; không chạy baseline dump đè dữ liệu live.
- Đã thực thi rollback thật rồi republish **trên mirror disposable**. Rollback từ chối sửa đổi/liên kết phát sinh về sau, giữ9 canonical cũ và schema additive. Rollback live hoặc đảo schema cần chỉ thị riêng, preflight/backup mới và artifact cụ thể; không tự chạy khi bàn giao.

## Lệnh và bằng chứng

| Lệnh/thao tác | Exit/kết quả |
| --- | --- |
|`pnpm agent:sync` / `pnpm agent:status`|0;836 source,không pending;Markdown/JSON/SQL/live được đọc có mục tiêu |
|`pnpm exec vitest run tests/unit/local-heroes-live-release.test.ts`|0;5 test,bao gồm từ chối before image/danh tính/evidence/NFC sai |
|`node scripts/content/prepare-local-heroes-live-release.mjs --baseline tests/unit/fixtures/local-heroes-live-baseline.json --evidence docs/audits/sources/2026-10-27-local-heroes-live-legacy-evidence.json --out supabase/content/local-heroes/live-release-20261027-v5`|0;35/34,3 canonical giữ nguyên |
|296 SQL assertions/2 file trên actual-schema mirror|PASS;source/policy/invariant roles thật trên DB disposable,không viết test vào remote |
|`node .task-reports/local-heroes-live-release-20261027/rehearse-publication-v5.mjs`|0;9 trường hợp,rerun không tăng revision;expected refusal exit3 được kiểm chứng;rollback/republish thật |
|`pnpm verify` trước phát hành|0;1189/106+26 script+42 history,lint0 warning,types/build |
|`supabase migration repair 20261027000000 --status applied --linked --workdir supabase/releases/local-heroes-20261027`|0;chỉ adoption baseline thực tế đã kiểm |
|`supabase db push --dry-run --linked --workdir supabase/releases/local-heroes-20261027`|0;chỉ1 feature migration,không seed/role |
|`supabase db push --linked --workdir supabase/releases/local-heroes-20261027 --yes`|0;feature có thật được truy vấn lại;giữ nguyên cảnh báo cache pg-delta |
|`supabase db query --linked --file supabase/content/local-heroes/live-release-20261027-v5/publish.sql --output json`|0;atomic35/34;postflight anon/owner và30 nguồn cũ đều khớp |
|`node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/published-national-v1 --mode release`|0;valid/releaseReady=true,35/35,34/34 |
|`pnpm build:smoke`→`pnpm test:e2e:smoke`→`pnpm build`|0/0/0;8 smoke ở4 desktop;build thường được phục hồi;chạy trước điều chỉnh copy cuối |
|`node .task-reports/local-heroes-live-release-20261027/observe-live-browser.mjs`|0;4 viewport,140 profile,136 chọn địa phương,0 mock/diagnostic/write;pagination/alias/return/reload/Back/forward/nguồn/ảnh/no-JS |
|`pnpm verify` sau copy cuối|0;1189 test/106 file,26 script,42 history,lint0 warning,types/build;build `wOkfmI4t62a6TsntfdikL` |
|`node .task-reports/local-heroes-live-release-20261027/observe-final-copy.mjs`|0;4 viewport,12 hàng/trang,35 options,34/34,focus/axe/no overflow/ảnh giải mã/no-JS/no-WebGL;0 diagnostic/write |
|`git diff --check` / `git status --short`|0/0;không staged;giữ owner Word/PDF/env/node.cmd và công việc có sẵn |
|`supabase db advisors --linked --type all --level info --fail-on error --output json`|**1**;98 notice so89 trước,0 ERROR mới;ERROR cũ donation_wall còn rõ ràng |

Output đầy đủ, target, command hash, exit, release/snapshot/build hash tại [verification](2026-10-27-local-heroes-live-release-verification.json). Logs cục bộ ở `.task-reports/local-heroes-live-release-20261027/`. Đã giữ red test xác nhận ghi đè nháp trước khi sửa, các lần restore/rehearsal hỏng ban đầu, lỗi NFC/cover/timestamp và kết quả sau sửa; không nới assertion.

## Bốn viewport và giới hạn kiểm chứng

| Viewport | Ảnh bản cuối |
| --- | --- |
|1280×720|[catalog cuối](../../output/playwright/local-heroes-live-release/final-catalog-1280x720.png)|
|1366×768|[catalog cuối](../../output/playwright/local-heroes-live-release/final-catalog-1366x768.png)|
|1440×900|[catalog cuối](../../output/playwright/local-heroes-live-release/final-catalog-1440x900.png)|
|1920×1080|[catalog cuối](../../output/playwright/local-heroes-live-release/final-catalog-1920x1080.png)|

`output/playwright/local-heroes-live-release/results.json` lưu toàn luồng35 người×4 trước chỉnh1 dòng copy; `final-build-results.json` lưu4 viewport trên build cuối sau chỉnh. Ảnh detail/axe gốc cũng ở cùng thư mục. Browser/DOM/axe không thay cho thẩm định sử liệu hoặc RLS thật.

72 fixture công khai,8 admin dùng Auth/PostgREST disposable,10 regression địa cầu/journey và performance control là bằng chứng Phase07 trước đó có ngày/command riêng trong [audit local được lưu](2026-10-27-local-heroes-remediation-local-readiness.md), không giả là các phép ghi mới trên remote. Build/copy cuối không thay truy vấn, quyền hay renderer. Mốc performance cũ khác fixture vẫn được nêu; control cùng fixture đạt+5632 gzip bytes<35KiB, ảnh thật70/70 tối đa27394 bytes. Không ghi đè baseline để làm xanh.

## File mới/đổi của đợt phát hành

- Code: `scripts/content/prepare-local-heroes-live-release.mjs`, `local-heroes-live-release-sql.mjs`, `sync-docs.mjs`; `components/explorer/LocalHeroesPanel.tsx` (chỉ copy độ phủ).
- Test/before image: `tests/unit/local-heroes-live-release.test.ts`, `tests/unit/fixtures/local-heroes-live-baseline.json`.
- Schema/artifact: `supabase/releases/local-heroes-20261027/`, `supabase/content/local-heroes/live-release-20261027/`, `live-release-20261027-v2/`…`v5/` (các lần chuẩn bị giữ nguyên,**v5 là bản đã chạy**), `published-national-v1/`.
- Tài liệu: plan live-release, authorization, legacy evidence, publication JSON/MD, advisors delta, verification, audit hiện tại/bản local lưu, handoff này và `docs/agent/CURRENT-STATE.md`.
- Các thay đổi feature Phase00–07 và owner artifacts có trước vẫn được bảo toàn. Branch không đổi; không stage/commit bất cứ file nào.

## Chưa làm/rủi ro còn lại

- Chủ dự án tự kiểm thử/nghiệm thu cuối trên URL ở trên; không giả nhận đã được chấp thuận thủ công.
- `public.donation_wall` đã có advisory ERROR security-definer view từ trước; đây là luồng whitelist ủng hộ/thanh toán ngoài phạm vi, chưa tự sửa. Các Auth/function/index cũ cũng ghi rõ. [Hướng dẫn Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view).
-9 notice mới không có ERROR:6 cảnh báo hiệu năng do policy public/staff/editor/reviewer được hợp theo vai trò,2 INFO cơ hội index phủ FK composite,1 INFO index locality mới chưa dùng. Không xóa policy/index để che notice; role suite/hiệu năng hiện tại đạt. Có thể tối ưu trong task hiệu năng riêng có kiểm chứng tương đương quyền.
- SupabaseCLI cảnh báo lưu cache catalog pg-delta do collate/ctype null; migration ledger/tables/RLS/RPC được truy vấn trực tiếp và công bố thành công. Không sửa collation/platform/CLI để che cảnh báo.
- Thiếu bytes v16 lịch sử vẫn là giới hạn provenance; không bịa hash. V18 nối đúng v17 và graph hiện tại có kiểm tra trực tiếp.
- Quyền ảnh vẫn là coursework/reference đã ghi kèm credit/trang gốc, không tự biến thành license thương mại. Held tiếp tục unpublished.
- Không import Auth/student/payment, không tạo user giả hoặc chạy mutation test trên Supabase hệ thống; không upload asset. Không stage/commit/push/PR/merge hoặc deploy Vercel. Các hành động đó và rollback live/đảo schema cần yêu cầu riêng.

Đã dừng ở đúng phát hành Supabase được yêu cầu và web local đang chạy. Không gọi agent/model/phase khác.

## Báo cáo cục bộ

[Nhật ký task local](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-27-1840-local-heroes-supabase-release.md). File được Git ignore, không stage/commit; gồm phạm vi, công việc, file, bằng chứng, kết quả, việc chưa làm và rủi ro.
