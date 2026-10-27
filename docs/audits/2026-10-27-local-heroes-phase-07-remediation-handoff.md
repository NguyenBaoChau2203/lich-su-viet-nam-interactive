# Bàn giao Phase 07 remediation — danh mục nhân vật toàn quốc

**Kết quả:** đã hoàn thiện các hồ sơ còn chặn để đủ **35/35 nhân vật được chọn, 35 truyện chính, 35 ảnh đại diện và 34/34 địa phương chuẩn cho nghiệm thu local**. Một agent thực hiện nghiên cứu, sửa, self-review và kiểm chứng trực tiếp; không có reviewer AI thứ hai, review độc lập hay chứng nhận của giáo viên/nhà sử học. Giữ nguyên 53 đề cử: 35 selected, 18 held; không giảm phạm vi phát hành quốc gia.

**Phát hành thật vẫn BLOCKED và chưa thực hiện.** Phê duyệt hash v18 đang pending, publicSnapshot của cả 34 địa phương vẫn null, remote chưa có schema tính năng và ba nhân vật canonical đã công bố/gắn sự kiện cần phương án ghi nhận bổ sung riêng. Quyền hoàn thiện công việc local không được biến thành quyền migration/import/upload/publication hay phê duyệt hash chưa được xem.

## Bản cụ thể để chủ dự án xem

- Manifest **v18**: `06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416`.
- Snapshot draft: `bc6bdbf6f6fcd6c4259987b9b010514109b5fdffe044c50f0fa52329a5c74a53`.
- Acceptance SHA-256: `a3b9a521007c8a86dc2316094b3ee18f5b44ab8418e2f15e4ef63736d01c6790`.
- [Audit hiện hành](local-heroes-release-readiness.md), [bảng tiếp nhận từng người và đủ 34 địa phương](../content/local-heroes/2026-10-27-remediation-acceptance.md), [verification có command/exit/hash](2026-10-27-local-heroes-remediation-verification.json).
- [Draft SQL](../../supabase/content/local-heroes/release-phase-07-remediation/draft-import.sql), [promotion rehearsal chỉ local](../../supabase/content/local-heroes/release-phase-07-remediation/local-promotion-rehearsal.sql), [rollback](../../supabase/content/local-heroes/release-phase-07-remediation/rollback.sql), [snapshot/fingerprints](../../supabase/content/local-heroes/release-phase-07-remediation/snapshot.json). Mặc định là draft và ROLLBACK; không phải script enrollment chạy thẳng lên remote.

## Công việc và file trong lần hoàn thiện này

| Nhóm | File / thay đổi có thể xem |
| --- | --- |
| Nội dung quốc gia | national-v1/ lên v18; snapshots/v17/ giữ nguyên mười file v17; bổ sung/đối chiếu 33 truyện, giữ hai truyện đã tiếp nhận; 368 claim/73 nguồn được tiếp nhận; 30 story và 24 media cũ vẫn held |
| Chấp nhận nguồn/ảnh | sources/2026-10-27-local-heroes-remediation-content-review.json và docs/content/local-heroes/2026-10-27-remediation-acceptance.md; các ledger cũ có nhãn lịch sử và đường dẫn supersession |
| Import | scripts/content/prepare-local-heroes-release.mjs thêm input package/overlay riêng, bắt buộc đủ mười fingerprint, giữ UUIDv5/canonical và từ chối conflict; release-phase-07-remediation/ chứa năm artifact xác định |
| Ảnh/TLS | next.config.ts thêm đúng 20 URL ảnh gốc đã kiểm tra, không mở toàn host mới; package.json dev/start và hai helper isolated dùng --use-system-ca chuẩn Node24, giữ xác minh TLS |
| Browser dữ liệu thật | scripts/agent/local-heroes-national-rehearsal.mjs dùng đúng descriptor/Docker/API local, kiểm tra đủ 35/34 tại bốn desktop rồi guarded reset |
| Hồi quy | tests/unit/local-heroes-remediation-content.test.ts, local-heroes-remediation-artifact.test.ts, local-heroes-image-patterns.test.ts; test artifact/content cũ pin v17; negative fixture chọn đúng ảnh context đang accepted |
| Audit/bàn giao | readiness audit, verification mới, remote preflight JSON/SELECT/plan, CURRENT-STATE và remediation plan; audit đầu Phase07 được giữ ở 2026-10-27-local-heroes-phase-07-initial-readiness.md |

Những sửa UI/SQL/backend của các Phase02–07 trước đã được self-review cùng nhánh và kiểm tra lại bằng gate bên dưới; lần tiếp tục này không viết thêm migration, không thay globe/camera/history owner, không tạo route nhân vật thứ hai hay mở rộng các module học tập/tài khoản/thanh toán. Giữ nguyên UUID/slug và quyết định roster của chủ dự án. Không sửa/stage Word, PDF, env, owner node.cmd, build output hay file ngoài phạm vi. Không thêm dependency; pnpm-lock.yaml không đổi.

## Lệnh và kết quả thực tế

Tất cả chạy với NoDefaultCurrentDirectoryInExePath=1 để tránh node.cmd rỗng có sẵn. Supabase chỉ dùng local-heroes-phase02-disposable (API55341/DB55342), không dùng remote làm fixture. Log đầy đủ, mốc thời gian và SHA nằm trong verification JSON và .task-reports/local-heroes-remediation/.

| Lệnh | Kết quả |
| --- | --- |
| node scripts/content/check-local-heroes.mjs | exit0; valid; 35/35 complete và 34/34 represented; releaseReady=false |
| node scripts/content/check-local-heroes.mjs --mode release | exit2 đúng gate; 34 coverage ready_for_review/publicSnapshot-null và approval pending; không gọi đây là pass phát hành |
| pnpm exec vitest run tests/unit/local-heroes-state.test.ts tests/unit/local-heroes-query.test.ts tests/unit/local-heroes-content.test.ts tests/unit/local-heroes-admin.test.ts tests/unit/local-heroes-detail.test.ts | exit0; 5 file / 93 test |
| pnpm exec vitest run tests/unit/local-heroes-remediation-artifact.test.ts | exit0; 5 test; đối chiếu byte toàn bộ file, 35 graph/34 coverage, v17 tái tạo nguyên byte và từ chối chứng cứ sai |
| node scripts/content/prepare-local-heroes-release.mjs | exit0 cả lượt cuối; hash snapshot giữ nguyên; 35 draft/35 complete graph |
| supabase test db --local --workdir .task-reports/local-heroes-phase-02-work/db | exit0; 296 assertion / 2 file trên PostgreSQL thật; 27 migration + 2 SQL test + 1 fixture khớp hash root |
| node tests/rls/local-heroes-concurrency.mjs --target .task-reports/local-heroes-disposable-db.json | exit0; 2 race có quan sát chờ lock; cleanup xác nhận |
| node tests/rls/local-heroes-import-rehearsal.mjs --target .task-reports/local-heroes-disposable-db.json | exit0; 6 case, 35 người được promote local; rerun/conflict/rollback không hỏng dữ liệu khác |
| node scripts/agent/local-heroes-e2e.mjs build; pnpm exec playwright test --config playwright.local-heroes.config.ts | mỗi lệnh exit0 ở lượt cuối; 72/72 ca public, bốn viewport |
| node scripts/agent/local-heroes-admin-e2e.mjs build; pnpm exec playwright test --config playwright.local-heroes-admin.config.ts | exit0; 8/8 ca, Auth/PostgREST thật, tám role gồm locked staff; cleanup DB về Auth/content0, registry34 |
| node scripts/agent/local-heroes-national-rehearsal.mjs --target .task-reports/local-heroes-disposable-db.json | exit0; bốn viewport, mỗi viewport chọn 34 địa phương và kiểm 35 trang thật: 140 profile check, không mock API/ảnh; cleanup=true |
| pnpm exec playwright test --config playwright.local-heroes-regression.config.ts | exit0; 10/10 ca globe/journey/camera/timeline/history chọn read-only |
| node .task-reports/local-heroes-remediation/image-performance.mjs | exit0; 70/70 lượt optimizer ảnh gốc, DPR1/2; max27.394 byte, width128/256; không mock ảnh |
| node scripts/agent/local-heroes-performance.mjs final | exit0; ngân sách shape/query/idle đạt; phép so sánh với fixture cũ được ghi rõ giới hạn bên dưới |
| node .task-reports/local-heroes-remediation/performance-control/measure-before.mjs baseline; node scripts/agent/local-heroes-performance.mjs final; node .task-reports/local-heroes-remediation/compare-performance-control.mjs | exit0 từng bước đối chứng; cùng fixture hiện tại: 857.611 → 863.243 byte gzip, tăng5.632 <35KiB; baseline lịch sử không đổi |
| pnpm verify | lượt cuối exit0; 42 history test; lint0error/3warning cũ; strict typecheck; 1.184 test/105file; 26 test script; production build |
| pnpm build:smoke rồi pnpm test:e2e:smoke | exit0 theo đúng thứ tự; 8/8 ca smoke public; E2E_BASE_URL không đặt, Edge/loopback |
| pnpm build sau smoke | exit0; khôi phục build cấu hình thông thường, 103 static pages |
| pnpm agent:status; git diff --check; git status --short | exit0; 833 source/no pending; không lỗi whitespace; không staged file; branch/HEAD giữ nguyên |

Không chạy full pnpm test:e2e hỗn hợp vì có helper sửa/xóa dữ liệu; chỉ các config chọn rõ fixture read-only hoặc DB disposable được thực hiện. pnpm verify không được dùng thay thế bằng chứng DB/browser.

## Phát hiện/sửa và giới hạn của bằng chứng

- Test đỏ đầu tiên xác nhận chỉ22/35 hồ sơ kế thừa đầy đủ; các claim/ảnh/truyện lỗi được sửa từ nguồn gốc thay vì nâng hạng cơ học. Các ngày/chi tiết không đủ chứng cứ được bỏ hoặc giữ held, không đoán; ví dụ năm sinh Nguyễn Thái Học để null. Ảnh người khác/bối cảnh được ghi đúng, không giả làm chân dung.
- Lượt build đầu phát hiện lỗi TypeScript trong test mới; đã sửa kiểu rõ ràng. Lượt verify đầu có một test artifact timeout ở15s do deep equality các Buffer lớn; đổi sang Buffer.equals kiểm từng byte, không bớt file/assertion. Lượt focused sau sửa và full verify đều qua.
- Node mặc định ban đầu lỗi chain TLS một ảnh (34/35). Dùng chuẩn --use-system-ca, vẫn kiểm certificate, đã fetch/hash đủ35/35 và optimizer70/70. Không dùng NODE_TLS_REJECT_UNAUTHORIZED=0, không tải lên asset hay tạo chân dung bằng AI.
- **Sửa sai báo cáo trước:** fixture hiện tại có hash e985dfba… còn baseline gốc45e17723…; khẳng định “fixture không đổi” ở audit Phase07 đầu là sai và được rút lại. Giữ nguyên file baseline (SHA86adc2ec…). Đối chứng mới lấy git archive của HEAD trước tính năng, chỉ điều chỉnh Turbopack root cho dependency đã cài, build và chạy cùng fixture/trình duyệt/phần cứng với mã hiện tại. Đây là phép đo mới, không giả là capture cũ. Lượt chuẩn bị control đầu bị pnpm từ chối tự cài/module removal không TTY; không có dependency được thêm. Lượt cold build có timeout; lượt build cache sau cùng và hai lượt browser đều qua, log lỗi vẫn giữ.
- Hình học/globe không được tải lại khi mở danh mục; một page query trả12row, mặc định không gọi danh mục/ảnh; hai khoảng idle600ms không ghi render lặp. Máy i5-11400H/16GiB/IntelUHD D3D11/Edge156, 1440x900 DPR1; không mô tả đây là benchmark GPU đồng bộ/FPS/thiết bị yếu.
- Đã giữ và phân loại80 file diagnostic public/admin: HTTP503 và WebGL failure cố ý, ERR_ABORTED do navigation/prefetch bị thay thế, ảnh synthetic example.invalid không có DNS. Không pageerror; actual-national và actual-image diagnostics rỗng. Lint còn ba unused-variable warning cũ trong sync-docs.mjs. Supabase reset exit0 và khôi phục baseline nhưng có warning pg-delta/Zod khi cache catalog collation; không coi đó là chứng cứ export schema thành công.
- Khoảng trống hash/byte v16 lịch sử còn được ghi rõ; v18 nối đúng snapshot v17 đã bảo toàn và nội dung hiện hành được kiểm tra trực tiếp. Không tái dựng/chứng nhận byte không tìm thấy. Ảnh chỉ có usage coursework_reference; license null không tạo quyền public domain/upload/phát hành rộng.

## Bằng chứng giao diện và đường điều hướng

Các ảnh catalog/detail tại 1280x720, 1366x768, 1440x900, 1920x1080 nằm ở output/playwright/local-heroes-national/; screenshot/axe của editor ở output/playwright/local-heroes-admin/. Từng viewport kiểm chọn đủ34 mã, phân trang12+12+11 người, alias Nong Van Den, reload/Back/forward/return chính xác, đọc story/source không JS và ảnh gốc giải mã. Axe catalog + Kim Đồng detail + editor không có vi phạm A/AA trong phạm vi quét; không gọi đó là chứng nhận WCAG toàn bộ website. Fixture còn kiểm rapid search/loading/empty/error/broken-image/no-WebGL, keyboard/focus và reduced motion.

Bản đồ đã triển khai: / → Nhân vật theo địa phương → địa phương/tên/bí danh/trang → /nhan-vat/[slug]?kham-pha=… → truyện/gallery/nguồn → trở lại đúng trạng thái. HistoryExplorer/playback và adapter camera hiện hữu giữ chủ sở hữu duy nhất; people entry dừng intro/journey và trở về paused. CURRENT-STATE đã cập nhật đúng hành vi đã có.

## Việc còn chặn và bước ngoài hệ thống chưa chạy

1. Chủ dự án xem/duyệt **đúng hash v18 và artifact cụ thể trên** nếu muốn qua checkpoint nội dung phát hành. Roster v14 đã duyệt vẫn được giữ, không xin duyệt lại danh sách tên.
2. Remote đích đã được kiểm kê chỉ đọc bằng CLI: lichsu_12 / ueolfjujjybutyuyfxha, 9 figure công bố/46event/30source/6figure media, chưa có schema tính năng hoặc migration ledger. Văn Tiến Dũng, Phạm Văn Đồng, Lê Duẩn đã có UUID/slug và mỗi người có event link. Import hiện tại đúng thiết kế từ chối toàn transaction khi gặp các bản ghi này. Cần phương án schema-adoption/enrollment bổ sung được duyệt riêng, giữ UUID/slug/publication/event/media, backup/preflight và rehearsal bản sao schema đích; không nới guard để ghi đè.
3. [Remote plan và preflight cụ thể](2026-10-27-local-heroes-remediation-remote-plan.md) ghi từng UUID và thứ tự còn phải làm. Migration/import draft, upload asset, công bố, push/PR/merge/deploy đều cần chỉ thị riêng với đúng target và artifact. Chỉ sau hành động live được cho phép và kiểm tra public thật mới ghi publicSnapshot/coverage công bố.

Không thực hiện remote schema/content/storage write, upload, công bố, stage/commit, push, PR, merge hoặc deploy. Dừng tại checkpoint local của Phase07; không tự gọi phase/model khác.

## Báo cáo local

[Báo cáo bỏ qua bởi Git](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-27-1423-local-heroes-phase-07.md) — dùng giờ Asia/Bangkok; không stage/commit. Raw HTML/ảnh/contact sheet và log được giữ trong .task-reports/local-heroes-remediation; chúng là bằng chứng local, không thay thế manifest/overlay/audit có version.


Kiểm tra toàn vẹn cuối (2026-10-27T07:27:13.471Z): 27 hash bằng chứng, 40 hash log lệnh, 141 hash source/artifact và 92 liên kết local đều khớp; đủ35story/35image/34locality/73source được tiếp nhận; báo cáo được Git ignore và stagedFiles=0. Raw kết quả: .task-reports/local-heroes-remediation/final-integrity-result.json.
