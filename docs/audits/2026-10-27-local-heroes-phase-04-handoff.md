# Bàn giao Phase 04 — Homepage nhân vật theo địa phương

Ngày 27/10/2026, Asia/Bangkok. Một agent chính; **self-review**. Nhánh `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Không stage/commit/push/PR/deploy hoặc ghi remote.

**Trạng thái cuối:** hoàn tất phần tích hợp homepage Phase 04 và khắc phục/nghiệm thu tiền điều kiện Phase 03 theo thẩm quyền chủ dự án. Cổng repo, browser, DB disposable và ngân sách kỹ thuật dưới đây đã có output mới. **Chưa sẵn sàng phát hành toàn quốc**; nội dung Phase 06/07 và phần chi tiết Phase 05 vẫn còn.

## Phạm vi và thẩm quyền

Thực hiện homepage/locality/search/pagination, bounded SSR/GET, URL/return an toàn, focus/lifecycle của explorer, fixture cô lập và ngân sách tăng thêm theo LH-1.0.0-draft.1. Chủ dự án đã cho phép [sửa/nghiệm thu Phase 03](2026-10-27-local-heroes-phase-03-remediation.md) trước khi tiếp tục; [tiền kiểm cũ](2026-10-26-local-heroes-phase-04-preflight.md) là lịch sử lỗi, không phải trạng thái cuối. Không bắt đầu Phase 05 kể chuyện chi tiết.

Manifest v14 giữ nguyên hash `893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`: **35 accepted, 2 complete, 33 incomplete, 18 held, 2/34 địa phương có nội dung chuẩn bị hoàn chỉnh**, `releaseReady=false`. Đây không phải số liệu đang public. Yêu cầu phát hành đầu vẫn **34/34 địa phương và mọi người accepted hoàn chỉnh**, có truyện nguồn và ảnh dùng được; không chuyển thành pilot vùng.

## Hành vi và quyết định

- `lib/local-heroes/state.ts` parse/build đúng bốn key đã chốt, giữ mã locality là chuỗi, Unicode NFC và alias tìm kiếm, chặn return ngoại miền/admin/duplicate/control/encoding sai. Chỉ thay phân trang nhân vật khi đổi bộ lọc; giữ event/journey/cinematic camera và `goc` legacy riêng biệt.
- Homepage SSR chỉ gọi một trang 12 người/count/coverage khi vào people mode; event/people lỗi độc lập. GET no-store trả lỗi cố định 503. SDK không tự retry ngầm, timeout năm giây; hook abort và kiểm tra nonce/filter key. SSR hydrate không fetch lại; không có catalog nghiên cứu/photos quốc gia trong client default.
- `HistoryExplorer` giữ một history writer; reducer lưu snapshot riêng và nested journey exploration. Vào people hủy intro/flight/arrival/dwell/input đang chờ, pause journey và đóng reader cạnh tranh. Close/Escape khôi phục view/selection tức thì, vẫn pause; focus về trigger hoặc entry. Reload/share/Back/forward/detail return giữ bộ lọc và không autoplay. Không thêm camera controller, canvas hoặc renderer.
- Panel là HTML: native selector có đủ 34 lựa chọn, GET search, count/coverage trung thực, distinct rows/ảnh/quan hệ/nguồn, sticky pagination và vùng cuộn. Có loading/empty/no-match/error/retry. Ảnh lazy giữ kích thước; ảnh accepted tải hỏng có fallback riêng, không thay portrait vô căn cứ. Chỉnh vị trí notice/no-JS để không che panel ở desktop; có test RED → GREEN cho hình chữ nhật không chồng nhau.
- Cầu nối `/nhan-vat/[slug]` chỉ đủ để kiểm tra eligibility/ảnh accepted và quay về homepage an toàn. Hồ sơ không eligible không rơi qua legacy portrait; timeline liên quan giữ return context. Kể chuyện/citation/gallery và bộ test profile/story đầy đủ vẫn thuộc Phase 05.

## File thay đổi trong lần này

| Nhóm | File |
| --- | --- |
| Homepage/UI | `app/(public)/page.tsx`, `components/explorer/{HistoryExplorer,LocalHeroesPanel}.tsx`, `components/local-heroes/{LocalHeroList,LocalitySelect}.tsx`, `components/layout/HomeAtlasHeader.tsx`, `components/explorer/explorer-map.css` |
| State/lifecycle/camera | `lib/local-heroes/{state,use-local-hero-page}.ts`, `lib/explorer/{map-state,url,globe-contract}.ts`, `lib/explorer/journeys/playback.ts`, `components/explorer/cinematic/CinematicEventMap.tsx` |
| Server | `app/api/local-heroes/route.ts`, `lib/local-heroes/{load,response}.ts`, `lib/queries/local-heroes.ts` |
| Detail bridge | `app/(public)/nhan-vat/[slug]/page.tsx`, `lib/queries/figures.ts`, `components/content/detail/FigureDetailView.tsx`, `components/content/CompactTimeline.tsx` (giữ phần Phase 03 đã có, chỉ thêm boundary/return cần thiết) |
| Tests/tooling | Unit state/query/lifecycle/public-entry/transport/detail-boundary/timeline-return/list; `tests/e2e/home-local-heroes.spec.ts`, fixture server/fixtures; `playwright.local-heroes{,-regression}.config.ts`, `scripts/agent/local-heroes-{e2e,performance}.mjs` |
| Cấu hình/tài liệu | `.gitignore`, `eslint.config.mjs`, `next.config.ts`, `tsconfig.json` (Next typegen thêm dist riêng); contract addendum, plan, CURRENT-STATE, preflight annotation, remediation/handoff/verification |
| Khắc phục được cho phép | Các file admin/actions/form/workflow, admin config/setup/fixture và tests liệt kê trong remediation Phase 03 |

Không sửa dependencies, gói lịch sử/media v14, Word/PDF, `.env`, `node.cmd` hoặc module học tập/tài khoản/thanh toán ngoài phạm vi. Toàn bộ worktree Phase 00–03 và owner đã có được giữ; không coi mọi file untracked là do Phase 04 tạo.

## Lệnh và bằng chứng

Các lệnh Node/pnpm trên Windows được chạy với `$env:NoDefaultCurrentDirectoryInExePath = '1'`; không sửa file owner `node.cmd` dài 0 byte. Log nằm trong thư mục ignore `.task-reports/local-heroes-phase-04-preflight/`; tên thư mục tiền kiểm được giữ, chỉ các log `*-final*`/lần chạy cuối dưới đây là bằng chứng nghiệm thu. Log đỏ/cổng bị dừng trước sửa vẫn được giữ và không được tính là đạt.

| Lệnh / lớp chứng cứ | Kết quả mới | Assertions / phạm vi được chứng minh |
| --- | --- | --- |
| `pnpm exec vitest run tests/unit/local-heroes-state.test.ts tests/unit/local-heroes-query.test.ts` | **37/37**, exit 0 (`focused-final.log`) | Round-trip bốn key, UTF-8/NFC/alias/literal wildcard, invalid page/locality, bounded query, return URL hostile và giữ event/camera/journey. |
| `node scripts/content/check-local-heroes.mjs` | **valid research**, exit 0 (`content-final.json`) | Hash v14, references/coverage cấu trúc; `releaseReady=false`. Không phải source/history/rights certification. |
| `node scripts/agent/local-heroes-e2e.mjs build` | **đạt** (`public-feature-build.log`) | Production fixture build riêng, fake public env, không seed/remote. |
| `pnpm exec playwright test --config playwright.local-heroes.config.ts` | **52/52**, exit 0; lần cuối 3,1 phút | 13 ca × bốn viewport; toàn bộ luồng và fallback/race/lifecycle bên dưới. `results-four-desktops.json` giữ nguyên kết quả đầy đủ dù chạy bổ sung có thể ghi đè `results.json`. |
| Cùng config, `-g 'default network is deferred'` | **4/4**; sau đó cũng nằm trong 52/52 cuối | SSR active page đúng một page RPC, không fetch lại khi hydrate; `history.state` sentinel vẫn còn sau push. |
| Cùng config, `-g 'keyboard focus, scrolling, contrast and reduced motion'` | **4/4**, **0 axe violations** mỗi viewport | Sau đợt 52 ca, siết assertion thành toàn bộ vi phạm WCAG A/AA (không chỉ serious/critical), lưu JSON `accessibility/<viewport>.json`; production code không đổi. |
| `node scripts/agent/local-heroes-performance.mjs final` | **budgetsPassed=true**, exit 0 (`performance-final.log`) | Browser response bytes, default/open requests, thumbnails, idle scene theo bảng ngân sách. |
| `pnpm exec playwright test --config playwright.local-heroes-regression.config.ts` | **10/10**, exit 0 (`legacy-regressions.log`) | Intro fresh/restored, event detail return, shared journey paused, no-WebGL reading/manual seek, sourced journey/reduced motion, path stale/disposal/idle, inclusive timeline/overlap/same-year/detail return ở bốn viewport. Chỉ các case read-only đã đọc source. |
| `pnpm build:smoke` → `pnpm test:e2e:smoke` | Build **đạt**, browser **8/8**, exit 0; chạy tuần tự | Guide/skip-link và homepage không có event data, địa cầu vẫn sẵn sàng ở bốn viewport; `E2E_CHANNEL=msedge`, fake env và không URL override. |
| `pnpm verify` | **đạt**; 99 file/1.161 unit, 26 script; history 42; lint/types/build đạt | Cổng repo thực sự bao gồm mọi stage; không suy ra DB/browser từ lệnh này. Normal `.next` đã khôi phục sau smoke. |
| `git diff --check` | **đạt**, exit 0 | Chỉ warning CRLF→LF; không có whitespace error. Staging rỗng, branch/HEAD giữ nguyên, dependencies không đổi. |
| DB/Auth/RLS Phase 03 prerequisite | **288 DB assertions, 2 races, 7 admin browser đạt** | Xem remediation riêng; HTTP thật qua Next/anon RPC chứng minh publish/hide/restore và private exclusion trên disposable DB. Fixture public không thay thế lớp này. |

Các assertion lifecycle/transport/detail/list còn được chạy trong cổng unit đầy đủ: deep-copy/nested snapshot và focus nonce khi restore; obsolete arrival không thay state; SDK 503 không tự retry thành bốn request; abort truyền đến fetch; eligible profile null không rơi qua ảnh legacy; timeline giữ return context; năm disputed không xuất thành năm chắc chắn. Những lỗi logic đã được chứng minh RED → GREEN, không hạ assertion. Lỗi notice chồng panel được tái hiện bằng `fallback-overlap-red.log` (exit 1) rồi đạt ở cả bốn ca no-JS của lần chạy cuối.

### Browser matrix và ảnh

Mỗi project **1280×720, 1366×768, 1440×900, 1920×1080** chạy cùng 13 ca. Đã có DOM assertions cho đủ 34 option, ID/count distinct, 12 dòng/page, alias có/không dấu, empty/no-match, clamp, lỗi/retry, ảnh hỏng, pending response cũ, single canvas, history state và view camera thật. Entry/close/Escape có focus rõ; Tab vào selector, vùng cuộn đọc được dòng cuối, pagination không bị chắn, không tràn ngang. Reload/copy URL/Back/forward/detail return giữ meaningful state; chờ thêm sau close vẫn không autoplay. Intro đang chạy và scene sẵn sàng muộn đều bị hủy khi vào people.

Các context không JavaScript dùng form GET và link thật cho toàn tuyến homepage → locality → page 2 → detail → return. Forced WebGL failure vẫn dùng keyboard/search/detail; thông báo fallback không che panel. Có kiểm tra reduced motion và axe WCAG A/AA trong ca keyboard; hồ sơ axe đầy đủ được lưu riêng để tránh chỉ dựa screenshot.

Ảnh trong `output/playwright/local-heroes/screenshots/`: `people-<viewport>.png`, `no-js-<viewport>.png`, `no-webgl-<viewport>.png` cho đủ bốn viewport. Đã mở xem trực tiếp các ảnh chính và fallback sau sửa; dữ liệu “36 người/23 địa phương” trong ảnh **chỉ là fixture tổng hợp**, không phải coverage nội dung thật. Console/pageerror/failed-request diagnostics theo ca nằm trong `diagnostics/`. Không có pageerror ngoài các failure đã phân loại: broken-image HTTP 503, WebGL bị cố ý vô hiệu và profile outage trả lỗi server đã sanitize. Warning NO_COLOR/FORCE_COLOR và Node module-type thuộc tooling.

### Ngân sách đo

Máy Windows, Intel Core i5-11400H, RAM 16 GiB; Edge **156.0.4314.42**, viewport **1440×900**, **DPR 1**, ANGLE Intel UHD/D3D11. Baseline production browser build **`GpatSke11U7x7bSAPzlgO`** được ghi trước sửa Phase 04; final **`7Djb499IJtayC8OYecvPg`**. Cùng fixture hash **`45e17723bc2665f0558eebc0a4d7d57f6281c203eb8dc0a606c23a2631c076e0`**; opt-in legacy event extension không dùng trong phép đo này.

| Chỉ số | Kết quả | Ngưỡng / giới hạn |
| --- | --- | --- |
| Script tải thật, unique URL | 23 baseline / 23 final | Không dùng kiểm kê thư mục build. |
| Gzip từ browser-fetched response bodies | 857.634 → 863.243 byte; tăng **5.609 byte** (~5,48 KiB) | ≤35.840 byte tăng thêm: **đạt**. |
| `encodedBodySize` browser quan sát | 857.931 → 863.539 byte; tăng 5.608 byte | Vài worker nhỏ không gzip; ghi cả encoding trong artifact, không gọi mọi byte on-wire là gzip. |
| Default event mode | **0** people RPC/API, **0** thumbnail | Đạt cả khi có inactive preferences. |
| Mở people | **1** page API/RPC, **12** rows, **0** profile N+1 | Count/coverage cùng page; SSR hydrate không gọi lần hai. |
| Thumbnail fixture | 12 × **401 byte**, width request **128 px** | ≤102.400 byte/ảnh, ≤480 px; intrinsic 120×80, lazy. HTML hỗ trợ candidate 256 cho DPR 2; chưa đo transport DPR 2. |
| Geometry / idle | **0** geometry request tăng thêm; default/open capture 600 ms đều `renderMs=[]`, `intervalsMs=[]` | Không có idle draw loop mới. Baseline không có idle capture; final idle và legacy disposal là chứng cứ riêng. |
| Scene cuối | 8 draw calls, 330.160 triangles, 8 geometries, 3 textures, 64 MiB | Không thêm renderer/geometry; không đo FPS hay GPU-completion time khi scene idle. |

Chi tiết response URL/bytes, request list, hardware và scene stats ở `performance-baseline.json`/`performance-final.json`. **Ảnh fixture không chứng minh ngân sách tải ảnh thật của cả nước**. Hai hồ sơ mẫu được chấp nhận chưa thay thế công việc Phase 06/07; origin mới và ảnh thật cần kiểm tra riêng, không được suy ra CSS resize tiết kiệm bytes.

### Cleanup và self-review

Reset cuối chỉ trên target đã qua descriptor/Docker/CLI guard; CLI exit 0 và query trực tiếp xác nhận **Auth users=0, synthetic figures=0, registry=34** (`disposable-cleanup-counts.json`). CLI 2.111.0 in lỗi compatibility `pg-delta`/Zod khi lấy catalog lúc reset; không che lỗi này và không chỉ dựa câu “finished”: counts sau reset là bằng chứng cleanup. Sau ngắt phiên, Docker từng dừng; guard từ chối trước mọi mutation, rồi mới khởi động lại local Docker và xác nhận đúng project. Không đụng database của các project khác.

Self-review toàn bộ phần thay đổi và đường gọi trực tiếp: strict return allowlist, anonymous public boundary, lỗi không lộ payload, abort/nonce, paused snapshots, focus nonce, no-JS overlay, date certainty, media eligibility, admin CAS và command projection. Không thêm dependency, không service-role trong client/log/fixture, không dùng research JSON runtime, không sửa dữ liệu lịch sử để làm xanh gate. CodeGraph sync báo **821 supported files, không pending**; Markdown/JSON/SQL và JSX bị output graph cắt ngắn được đọc có mục tiêu. Graph không chứng minh source history, DB live hoặc toàn bộ loại file.

Các skill sử dụng inline gồm project browsing/data/verification, TDD/debugging/executing-plans, Playwright, Supabase và React self-review; không spawn/delegate/model khác. Đã đọc installed Next 16.3.8 guide và tài liệu Supabase hiện hành trước phần tích hợp. Đây là **self-review**, không phải review độc lập, chứng nhận giáo viên/nhà sử học hay chứng thực quyền ảnh.

## Tệp bàn giao và báo cáo local

- [Verification có phiên bản](2026-10-27-local-heroes-phase-04-verification.json): command outcomes, build IDs, DB/browser scope, 48 SHA-256 artifact fingerprints và giới hạn.
- [Remediation Phase 03](2026-10-27-local-heroes-phase-03-remediation.md): thẩm quyền owner, lỗi tái hiện và bằng chứng quyền/workflow thật.
- [Contract section 14](2026-10-26-local-heroes-contract.md#14-phase-04-implementation-checkpoint--2026-10-27): fixture/config/commands và interfaces đã triển khai.
- [Báo cáo local cuối — 27/10/2026 00:47](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-27-0047-local-heroes-phase-04.md): Git ignore; không stage/commit; ghi scope, công việc/file, lệnh/outcome, evidence, gaps và risks.

Ảnh chính mở trực tiếp: [1280×720](D:/lich-su-viet-nam-interactive/output/playwright/local-heroes/screenshots/people-1280x720.png), [1366×768](D:/lich-su-viet-nam-interactive/output/playwright/local-heroes/screenshots/people-1366x768.png), [1440×900](D:/lich-su-viet-nam-interactive/output/playwright/local-heroes/screenshots/people-1440x900.png), [1920×1080](D:/lich-su-viet-nam-interactive/output/playwright/local-heroes/screenshots/people-1920x1080.png). Ảnh fallback dùng cùng thư mục với tiền tố `no-js-`/`no-webgl-`.

## Giới hạn và điểm dừng

Không kiểm chứng live remote readiness và không áp schema remote. Schema phải được rollout trước code khi có chỉ thị triển khai riêng. Ngân sách ảnh fixture không chứng minh mọi ảnh thật của 34 địa phương; nội dung/nguồn/ảnh còn thiếu giữ held/unpublished. Phase 05–07 vẫn còn; không có tuyên bố phát hành toàn quốc, teacher/historian certification hoặc review độc lập.

Dừng sau bàn giao Phase 04; không tự gọi pha tiếp theo, model khác, chat khác hoặc công bố/upload tài sản.
