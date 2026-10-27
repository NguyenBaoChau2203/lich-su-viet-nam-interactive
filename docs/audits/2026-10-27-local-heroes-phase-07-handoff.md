# Bàn giao Phase 07 — self-review và nghiệm thu local

Ngày 27/10/2026, Asia/Bangkok. Một main agent thực hiện toàn bộ điều tra, sửa lỗi, self-review và kiểm chứng. Không phải review độc lập hoặc chứng nhận của giáo viên/nhà sử học.

**Kết luận: BLOCKED đối với phát hành toàn quốc.** Các cổng kỹ thuật local đạt, nhưng chưa đủ nội dung cho 35 nhân vật đã chọn và 34 địa phương bắt buộc. Không chuyển phạm vi thành bản thử hai địa phương.

## Trạng thái nội dung và quyết định

- Giữ nguyên byte của 10 file đầu vào v17, hash nội dung `84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb`. Nhãn kế thừa là 22/35 hồ sơ hoàn chỉnh, 21/34 địa phương; không dùng nhãn này làm kết luận thẩm định.
- Đối chiếu lại 54 URL trang nguồn/trang ảnh và thử 22 tệp ảnh từng được chấp nhận; 16 tệp giải mã được đã được xem trực tiếp. Overlay xử lý đủ 53 đề cử, 81 nguồn, 32 story, 32 media và 34 địa phương.
- Chỉ **Văn Tiến Dũng và Kim Đồng** được chấp nhận trọn bộ cho rehearsal local: 2/35 hồ sơ, 2/34 địa phương, hai câu chuyện và 26 claim. 33 hồ sơ còn lại tiếp tục bắt buộc và bị chặn; 18 đề cử held được giữ nguyên, không nhập.
- Sáu ảnh ứng viên được chấp nhận riêng, 26 ảnh held. Trong 22 ảnh từng được chấp nhận, 16 quyết định bị rút lại. Có ảnh diễn giả hội nghị năm 2018 gán cho Huỳnh Văn Nghệ; ảnh quốc huy thay ảnh Nguyễn Đức Cảnh; ảnh đoàn hiện đại gán thành cảnh năm 1945; các bia/nhà tưởng niệm hiện đại bị ghi là tư liệu lịch sử; trang gốc sai chủ đề hoặc tệp không còn là ảnh.
- Hai mươi câu chuyện từng được chấp nhận bị giữ lại vì có mâu thuẫn hoặc chưa đủ đối chiếu từng đoạn/trích dẫn/danh hiệu. Không kết luận cả 20 đều sai, cũng không tuyên bố đã kiểm chứng ngữ nghĩa toàn bộ 305 claim. Ví dụ có sai khác khố đỏ/khố xanh, Hà Phong/Hòa Phong và chi tiết chiến đấu không nằm trong nguồn được dẫn.
- Tên danh mục là phân loại biên tập, không phải danh hiệu được phong tặng. Không điền ngày, quan hệ địa phương, giấy phép hoặc danh hiệu bằng suy đoán.

Xem [audit đầy đủ với bảng 35 hồ sơ/34 địa phương/từng media](local-heroes-release-readiness.md) và [overlay nguồn/ảnh](sources/2026-10-27-local-heroes-phase-07-content-review.json).

## Thay đổi của riêng Phase 07

Các thay đổi Phases 00–06 đã tồn tại trước invocation này. Nhánh vẫn là `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`; không reset, switch, stage hay commit.

| Nhóm | File thay đổi/tạo trong Phase 07 | Mục đích |
| --- | --- | --- |
| Preview | `lib/queries/figures.ts` | Giữ citation story/địa phương, metadata nguồn và certainty khi staff xem trước; báo lỗi an toàn nếu truy vấn con thất bại |
| Form | `components/admin/figures/StoryEditor.tsx`, `MediaEvidenceEditor.tsx` | Gắn label đúng với control và sửa tương phản nhãn accepted |
| Ảnh | `next.config.ts` | Cho phép đúng hai URL portrait đã kiểm tra; không mở toàn bộ host |
| Test đơn vị | `tests/unit/local-heroes-preview-evidence.test.ts`, `local-heroes-release-artifact.test.ts`, `local-heroes-detail.test.ts` | Regression preview, deterministic import và chỉnh mock chain cũ; giữ assertion |
| Browser | `tests/e2e/home-local-heroes.spec.ts`, `admin-local-heroes.spec.ts` | Thực sự chọn đủ 34 địa phương; axe/focus, citation preview, tám vai trò Auth/PostgREST và chờ revision mới cho lần lưu thứ hai |
| SQL | `supabase/tests/local_heroes_claim_groups.sql` | Thêm tám assertion cho claim nhiều nguồn; migration hiện có đã có guard đúng, không sửa schema |
| Artifact/runner | `scripts/content/prepare-local-heroes-release.mjs`, `tests/rls/local-heroes-import-rehearsal.mjs` | Chuẩn bị offline, ID/fingerprint ổn định, từ chối xung đột và rehearsal rollback trên đúng DB dùng một lần |
| Artifact được sinh | `supabase/content/local-heroes/release-phase-07/{snapshot.json,draft-import.sql,local-promotion-rehearsal.sql,rollback.sql,artifact-hashes.json,README.md}` | Snapshot, SQL luôn rollback và hướng dẫn giới hạn local |
| Bằng chứng/tài liệu | Audit, handoff này, verification JSON, overlay, plan `2026-10-27-local-heroes-phase-07-plan.md` | Ghi kết quả, hash, từng blocker và bước ngoài local chưa thực hiện |
| Bản đồ hiện trạng/ledger | `docs/agent/CURRENT-STATE.md`; `docs/content/local-heroes/{coverage,media,roster,claims,sources,phase-06-queue}.md` | Cập nhật đường đi đã triển khai và đánh dấu các kết luận/queue cũ bị thay thế |

Không sửa Word/PDF/env, roster v17, migration nền, module học tập/tài khoản/thanh toán hoặc hiện vật không liên quan của chủ dự án. Không thêm dependency. Báo cáo local và output được Git ignore.

## Bằng chứng kiểm chứng mới

Đặt `NoDefaultCurrentDirectoryInExePath=1` khi chạy Node/pnpm trên checkout này vì owner có `node.cmd` rỗng. Browser dùng Edge 156.0.4314.42. Public fixture cố định chỉ GET/HEAD; admin/DB chỉ dùng `local-heroes-phase02-disposable`, API 55341/DB 55342 trên loopback, có kiểm tra descriptor/nhãn Docker/cấu hình.

| Lệnh | Kết quả |
| --- | --- |
| `node scripts/content/check-local-heroes.mjs` | Exit 0: cấu trúc hợp lệ; `releaseReady=false` |
| `node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode release` | **Exit 2, BLOCKED**: 34 coverage issues, approval và roster chưa hoàn chỉnh |
| `pnpm exec vitest run tests/unit/local-heroes-state.test.ts tests/unit/local-heroes-query.test.ts tests/unit/local-heroes-content.test.ts tests/unit/local-heroes-admin.test.ts tests/unit/local-heroes-detail.test.ts` | Exit 0, 93/93 trong 5 file |
| `pnpm exec vitest run tests/unit/local-heroes-preview-evidence.test.ts tests/unit/local-heroes-release-artifact.test.ts` | Exit 0, 7/7 trong 2 file |
| `supabase test db --local --workdir .task-reports/local-heroes-phase-02-work/db` | Exit 0, **296** assertion / 2 SQL file |
| `node tests/rls/local-heroes-concurrency.mjs --target .task-reports/local-heroes-disposable-db.json` | Exit 0, 2/2 race có lock wait và cleanup |
| `node tests/rls/local-heroes-import-rehearsal.mjs --target .task-reports/local-heroes-disposable-db.json` | Exit 0, 6/6: rerun/UUID/unrelated rows, canonical/slug/source/child conflict, local promotion và rollback |
| `node scripts/agent/local-heroes-e2e.mjs build` → `pnpm exec playwright test --config playwright.local-heroes.config.ts` | Cả hai exit 0, **72/72** trên bốn viewport |
| `node scripts/agent/local-heroes-admin-e2e.mjs build` → `pnpm exec playwright test --config playwright.local-heroes-admin.config.ts` | Cả hai exit 0, **8/8** trên Auth/PostgREST/DB thật dùng một lần |
| `pnpm exec playwright test --config playwright.local-heroes-regression.config.ts` | Exit 0, 10/10 ca globe/journey/timeline chỉ đọc được chọn rõ |
| `node scripts/agent/local-heroes-performance.mjs final` | Exit 0, các budget được đo đạt; renderer Intel UHD D3D11, không phải SwiftShader |
| Kiểm tra browser ảnh gốc qua Next optimizer, không mock ảnh | Exit 0, **12/12** cho sáu ảnh × DPR 1/2; tối đa 11.532 byte, rộng 128/256 |
| `pnpm verify` | Exit 0: agent check, history 42, lint, typecheck, **1.177 tests/102 file + 26 script tests**, build 103 trang |
| `pnpm build:smoke` → `pnpm test:e2e:smoke` | Build exit 0; smoke cuối exit 0, **8/8**, chạy tuần tự trên localhost |
| `pnpm build` sau smoke | Exit 0; khôi phục build cấu hình thông thường |

Các lệnh, UTC start/end, exit, số ca, log và hash được ghi trong [verification JSON](2026-10-27-local-heroes-phase-07-verification.json). Audit có danh sách lệnh đầy đủ, gồm cả lần thất bại. Không chạy full legacy mutation E2E trên remote. File lịch sử `local-heroes-profile.test.ts` không tồn tại; các assertion tương ứng nằm ở detail/boundary suites hiện có, không ghi nhận file thiếu là “pass”.

Đã giữ lại và phân loại lỗi: regression preview trước sửa, mock/type narrowing, slug conflict importer, axe, ảnh HTTP 400, test lần lưu thứ hai dùng lại thông báo success cũ. Lượt smoke đầu do main agent đặt URL thành chuỗi rỗng nên 8 ca lỗi trước navigation; bỏ biến khỏi môi trường tiến trình rồi chạy lại cùng build/assertion đạt 8/8. Không xóa/giảm assertion, tăng timeout hoặc bật retry để đạt.

ESLint còn ba cảnh báo biến chưa dùng trong helper `sync-docs.mjs` của pha trước. Supabase CLI reset còn lỗi cache pg-delta `collate/ctype` nhưng trả exit 0; kiểm tra SQL thực tế sau reset/rehearsal xác nhận auth/staff/content đều 0 và registry 34. Console public chỉ có 503 cố ý và lỗi WebGL cố ý; không có pageerror. Ảnh example.invalid của admin cố ý không phân giải DNS; các abort navigation/prefetch được giữ trong diagnostics.

Bốn viewport 1280×720, 1366×768, 1440×900, 1920×1080 có DOM assertions/screenshot cho public/detail/no-JS/no-WebGL và admin; toàn bộ file axe public/detail/admin không có violation trong trạng thái được kiểm tra. Đã xem trực tiếp bốn ảnh panel và bốn ảnh admin cùng mẫu detail/fallback. Số 36 nhân vật/23 địa phương trong ảnh là dữ liệu giả kiểm thử, không phải coverage quốc gia. [Bảng mở từng ảnh nằm trong audit](local-heroes-release-readiness.md#learneradmin-navigation-and-desktop-evidence).

JS tăng **5.609 byte gzip** so với baseline giữ nguyên; event mode không gọi catalog/ảnh nhân vật; mở panel gọi một page RPC/12 dòng, không thêm geometry. Hai cửa sổ idle 600 ms không ghi interval render. Đây không phải benchmark FPS/GPU đồng bộ, tải production hoặc thiết bị yếu.

## Artifact cụ thể và checkpoint

[Hướng dẫn artifact](../../supabase/content/local-heroes/release-phase-07/README.md) liên kết snapshot/SQL/hash. Snapshot digest:

`4110c2782371654e0f74621036fb680b995aebe1c1ba1795dddd67ed0d43cbc8`

Artifact giữ đủ 35 ID/slug: hai graph đã đối chiếu và 33 identity shell thiếu nội dung, đều nhập dạng draft. Giữ UUID canonical cũ, dùng UUIDv5 cho người mới, có fingerprint nguồn/ảnh, rerun không đổi revision, fail/rollback thay vì overwrite. Mọi SQL rehearsal kết thúc `ROLLBACK`; kiểm tra sau mỗi transaction trở về baseline trống. Hai promotion tạm thời chỉ là rehearsal local, không phải count hoặc công bố remote.

Đường đi đã triển khai: homepage globe → “Nhân vật theo địa phương” → locality/search/alias/page → route nhân vật cũ → story/gallery/source → return URL chính xác. Intro bị hủy khi vào người; journey trở lại vẫn paused; HistoryExplorer/playback và adapter cinematic giữ quyền sở hữu history/camera hiện có. Staff preview có nguồn, public luôn đọc bằng anonymous client.

## Phần chưa đạt và bước bên ngoài chưa thực hiện

1. Hoàn chỉnh và kiểm chứng trọn 35 hồ sơ/34 địa phương; xử lý cả 13 hồ sơ vốn thiếu, 20 story bị giữ lại và 16 ảnh từng được chấp nhận sai/chưa đủ chứng cứ. Không thay roster hoặc dùng mẫu nội bộ thay yêu cầu quốc gia.
2. Khôi phục/đối chiếu đúng chuỗi snapshot: previousManifestHash của v17 lệch hash v16 trong handoff. Tạo phiên bản trung thực và approval nội dung/hash cần thiết; roster v14 đã được owner duyệt không bị yêu cầu duyệt lặp lại.
3. Xác định và inventory chỉ đọc đúng remote. Connector Supabase hiện chỉ trả ba project không liên quan, không thấy working project lịch sử; schema/identity/storage/counts hiện tại chưa được xác minh. Không truy vấn các project không liên quan, không đọc secret để đi đường vòng.
4. Sau khi có chỉ thị riêng nêu target/action: áp dụng schema phù hợp, kiểm tra quyền trên target, xử lý xung đột canonical/legacy bằng workflow được phép, tái sinh/rehearse artifact đầy đủ và import draft nếu được yêu cầu.
5. Công bố toàn bộ graph/kiểm tra coverage thực tế, upload nếu có yêu cầu riêng, rồi deploy/public smoke chỉ theo chỉ thị riêng tương ứng. Artifact hiện tại không đủ để áp dụng live.

Không có remote write/migration/import/storage upload/publication, commit/push/PR/merge/deploy trong invocation này. Dừng ở checkpoint local với readiness toàn quốc bị chặn.

Báo cáo local bị ignore: [D:/lich-su-viet-nam-interactive/.task-reports/2026-10-27-1035-local-heroes-phase-07.md](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-27-1035-local-heroes-phase-07.md). Đây là nhật ký cục bộ, không phải nguồn sự thật thay code/test/audit đã duyệt.
