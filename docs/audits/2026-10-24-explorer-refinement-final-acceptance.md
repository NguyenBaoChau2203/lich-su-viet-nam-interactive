# Explorer refinement — Task 09 final acceptance audit

Ngày kiểm tra: 2026-10-24, Asia/Bangkok. **Kết quả toàn bộ refinement: PARTIAL / BLOCKED tại yêu cầu dữ liệu và lớp 34 tỉnh/thành production.** Các test xanh dưới đây không thay thế cổng này. Đối chiếu chính xác bản in/mục lục/số trang SGK vẫn là `needs_evidence`.

Một agent Codex thực hiện điều tra, sửa lỗi, kiểm thử, đọc nguồn, xem ảnh và **self-review** trong cùng phiên. Không có reviewer độc lập, subagent hay lời gọi model khác. Nhánh local: `codex/refinement-task-09`; giữ nguyên workspace dirty đầu vào, không commit/stage/push/PR/merge/deploy/publish hay ghi dịch vụ ngoài.

## Phạm vi và nguồn sự thật

Đã đọc shared contract, toàn bộ thiết kế/kế hoạch refinement, các handoff 01–08, review baseline, hai ledger lịch sử, ledger/crosswalk/evidence tỉnh, provenance geography và code/test thực tế. CodeGraph được thử trước; truy vấn file cinematic/state hiện tại không có trong index, nên dùng đọc trực tiếp có giới hạn, không reindex.

- [Shared contract](../agent/prompts/explorer-refinement/shared-contract.md), [thiết kế](../superpowers/specs/2026-10-24-explorer-refinement-design.md), [kế hoạch](../superpowers/plans/2026-10-24-explorer-refinement-plan.md).
- [Ledger Hồ Chí Minh](2026-10-23-globe-journey-sources.md), [ledger 13 mốc mới](2026-10-24-additional-journey-sources.md), [provenance tọa độ](sources/2026-10-24-additional-journey-geography.json).
- [Ledger tỉnh](2026-10-24-vietnam-province-source-ledger.md), [34 danh tính/mã chính thức](sources/2026-10-24-vietnam-province-membership.json), [evidence snapshot chưa đủ](sources/2026-10-24-vietnam-province-source-evidence.json).

Phạm vi là refinement hiện tại; không tuyên bố toàn bộ MVP đã hoàn thành. Inventory công khai quan sát được vẫn có 10 sự kiện. Hai mươi mốc biên tập của bốn hành trình không phải 20 sự kiện mới được publish và không chứng minh yêu cầu corpus 25–35 sự kiện của MVP.

## Kết quả theo tính năng

| Yêu cầu | Kết quả hiện tại | Bằng chứng mới và giới hạn |
| --- | --- | --- |
| Earth, country strokes, atmosphere rõ hơn | PASS trong phạm vi ảnh hiện tại | Đọc material/stroke hiện hành; ảnh mới world/Vietnam/card/journey; 4/4 ca tương phản nền composited đạt ngưỡng text 4.5:1, dot/control 3:1. Vietnam outline giữ vai trò chủ đạo. Task 09 không đổi màu/texture/geometry. Ảnh 4K vẫn chỉ là bối cảnh ở zoom gần. |
| Zoom và declustering thật | PASS | Plus/wheel/keyboard tới 11; legacy 18 khôi phục và giảm dần qua 17; 8/10/11 kiểm tra cap/outline và HTML so với camera Three. Hanoi tách được Ba Đình; các anchor Sài Gòn thực sự khác nhau; phần còn chồng được fan-out có leader về anchor gốc. Coincident/multi-location fixture giữ key và không sửa GPS. Hit target ≥32px, không chồng, keyboard/Escape/card/detail/return và focus qua. |
| Bốn hành trình có nguồn | PASS ở phạm vi 20 mốc biên tập; textbook-printing gap còn mở | Registry thực tế có 7/4/5/4 mốc. Bốn hành trình × bốn desktop, đi thủ công mọi mốc, nguồn/keyboard, current state, published-only detail và source-only stops đều qua. Nguồn kiểm tra ở phần dưới; không xác nhận số trang/bản in SGK. |
| Đường nối hữu hạn có vẽ thật | PASS | So sánh canvas cùng camera: route có/không có khác 1,706 pixel; seam gần 358 pixel, phía sau 0. Finite reveal, repeated-city/zero-length/antipodal guards, manual interruption, stale nonce, retry, departure và disposal qua. Route core contrast ở 8/10/11 ≈3.199:1. Không tạo clock/engine/render loop mới. |
| Dwell 2000ms sau arrival | PASS | Fake clock không tiến ở 1999ms, đúng một request tại 2000ms, không có timer trước arrival. Browser đo chuyến bay thật 3,498.4ms rồi dwell 2,004.4ms theo DOM marks. Pause/reader focus/open sources/map input/hidden/seek/switch/exit/departure/last stop được kiểm tra. Browser marks có độ trễ quan sát; mốc chính xác 1999/2000 do unit clock chứng minh. |
| URL/history/cancellation/restoration | PASS trong các ca đã chạy | Pair journey+stop+nonce, wrong/unknown pair, reload paused, back/forward, rapid switch/seek/hidden resume/popstate trong flight; delayed outgoing detail không bị timer/camera/route kéo lại. Snapshot giữ bộ lọc, sự kiện, camera qua nhiều lần đổi hành trình. Khi card được khôi phục focus vào heading card; khi không có card trả về nút Hành trình. |
| Desktop/accessibility/fallback | PASS trong ma trận đã chạy | CSS 1280×720, 1366×768, 1440×900, 1920×1080; all-four chooser/manual/source/route matrix. Axe và focus/hit assertions, reduced motion, native no-JS GET submit/links, bốn lựa chọn khi WebGL bị chặn. Optional country/province lỗi/JSON sai/late/context retry giữ core. Nội dung dài cuộn bên trong; ảnh nguồn mở thể hiện vị trí cuộn sau thao tác focus. |
| 34 tỉnh/thành hiện nay trên production | **FAIL / BLOCKED** | Builder, GeoJSON và provenance production vẫn thiếu; endpoint thật 404. Có renderer, parser và fallback; fixture tổng hợp chỉ kiểm chứng renderer, không phải ranh giới hành chính được duyệt. Tính hiện hành/đầy đủ/topology và ngân sách artifact thực chưa được nghiệm thu. |

## Lỗi được tái hiện và sửa

1. `lib/explorer/cinematic/province-boundaries.ts`: parser nhận cạnh trùng đảo chiều dưới feature/source label khác, timestamp không phải ngày hợp lệ và coordinate ba chiều ngoài envelope `[lng, lat]`. Bốn ca đỏ thực sự không throw; sửa kiểm tra ngày/chiều tọa độ và dedup cạnh vô hướng toàn collection. Test tập trung 84/84 và gate 979 unit đều qua. Parser chỉ xác nhận envelope; chuỗi hash/license đúng hình thức không phải source approval.
2. `components/explorer/cinematic/CinematicGlobeCanvas.tsx`: 25,001 cạnh nguồn hợp lệ về envelope có thể vượt 50,000 đoạn khi subdivision. Trước sửa, browser có unhandled `Boundary segments exceeded safety limit of 50000 segments.` và lớp tỉnh kẹt `loading` dù core `ready`. Bắt lỗi tại bước attach lớp tùy chọn, clear lớp và chuyển `unavailable`; không nới/ngắt cụt ngân sách. Ca đỏ được giữ bằng screenshot/diagnostics; ca xanh chứng minh không unhandled error, core/markers hoạt động và retry thành công với một canvas.

Các thất bại ban đầu khác thuộc harness mới: dùng helper đòi câu trạng thái paused trong reduced motion và đòi focus ở nút mode dù card có sẵn được khôi phục. Sửa kỳ vọng của ca mới theo hành vi đã chốt (reduced-motion status và heading card); không đổi sản phẩm để ép khớp test. Không bỏ test lỗi, nới budget hay viết lại camera/registry/path/timer đã hoàn thành.

## Cổng tỉnh/thành còn thiếu

Chạy lại validator trên snapshot thật trả **exit 2**, `productionReady=false`, `status=needs_evidence`: 34/34 danh tính, 2,326/2,342 way hiện có, thiếu 16 way ở Khánh Hòa, relation `1887959`, mã `56`, gồm inner way `1120240931`. Snapshot Geofabrik ghi `2026-10-23T20:20:51Z`; PBF SHA-256 `c2d0d493638ba152370c89252f9b9a5f0844e7936505f3ab617fadd7023a5c90`, research gzip `5504fab937f8f991a4926334e441da1f9f1b6a9219ec303eff82dd44f41c76d0`; hash được đọc lại từ file thật trong Task 09. Không có builder/artifact production mới.

33 unit được mô tả trong nghiên cứu cũ không làm unit còn thiếu trở thành hợp lệ. Nghiên cứu còn 144,617 interior candidate segments trước simplification. Cần đủ way/node và revision phù hợp, kiểm tra parts/holes/topology, interior-edge dedup, loại coast/national/maritime chưa duyệt, builder deterministic và artifact/provenance/hash được duyệt; sau đó mới nghiệm thu source timestamp/attribution hiển thị và dữ liệu thực ở mọi scale. Parser hiện tại không thay thế pipeline đó.

Disclosure 34 đơn vị là tham chiếu hiện đại, không tái dựng địa giới theo năm sự kiện vẫn còn trong UI. Không dùng lớp cũ 63/64 đơn vị, center list, hình học đoán hay OSM tiles để lấp phần thiếu. Các screenshot `synthetic-*`, `combined-path-province-*` và stress 50,000 đoạn là fixture; không chứng minh đầy đủ các tỉnh hoặc nội địa/coast clipping của dữ liệu thực.

## Nguồn và độ không chắc chắn

Đã mở lại các bài bảo tàng/cơ quan công và đọc đoạn liên quan, không chỉ dựa vào test/metadata: [Tổng khởi nghĩa 1945](https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html), [19-12-1946](https://baotanglichsu.vn/vi/Articles/2002/68312/19-12-1946-ngay-toan-quoc-khang-chien.html), [Biên niên Đảng tập 3](https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-3-176?categoryId=102000083), [Bảo tàng Hồ Chí Minh về Biên giới 1950](https://baotanghochiminh.vn/di-tich-nui-bao-dong-noi-chu-tich-ho-chi-minh-quan-sat-tran-danh-don-dong-khe-chien-dich-bien-gioi-1950.htm), [Điện Biên Phủ](https://baotanglichsu.vn/vi/Articles/2002/67999/tran-quyet-chien-chien-luoc-tieu-diet-tap-djoan-cu-djiem-djien-bien-phu-13-3-7-5-1954-djot-iii-djon-quyet-djinh.html), [Final Declaration 21 July 1954](https://history.state.gov/historicaldocuments/frus1952-54v16/d1038), [HĐND Đắk Lắk](https://dbnd.daklak.gov.vn/chien-thang-buon-ma-thuot-ngay-1031975-mo-man-thang-loi-cho-chien-dich-tay-nguyen-tao-buoc-ngoat-lich-su-quan-trong-cho-dai-thang-mua-xuan-nam-1975-1274.html), [Chính phủ về Tây Nguyên](https://baochinhphu.vn/nho-ve-chien-dich-mang-tinh-buoc-ngoat-cua-mua-xuan-1975-102270035.htm), [Trị Thiên](https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm), [triển lãm bảo tàng 2025](https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html).

- Giữ phân biệt bắt đầu tiến công Buôn Ma Thuột ngày 10/3 với làm chủ ngày 11/3; Huế dùng mốc kết thúc được đối chiếu 26/3; Genève là Final Declaration, không khẳng định mọi văn kiện/đoàn đều ký cùng ngày. Việt Bắc dùng ngày mở đầu, không biến các mốc chiến dịch thành vị trí chính xác.
- Hai nguồn Hồ Chí Minh [cổng chuyên đề](https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013), [Thành ủy TP.HCM](https://hcmcpv.org.vn/tin-tuc/hanh-trinh-di-tim-hinh-cua-nuoc-1491878832) được đọc lại; sáu city records khớp Natural Earth v5.1.2. [PDF Pắc Bó](https://thiennhienviet.org.vn/sourcebook/pdf/Dong%20bac/Pac%20Bo.pdf) giữ đúng phạm vi tọa độ khu vực, không phải cột mốc/hang cụ thể.
- Tải lại Natural Earth populated places: SHA-256 `fd3fa867a320cbd5c5b6bb5bc550afeec2939fb2cef688e508007282a55ac42f`; bốn record mới và sáu city record cũ khớp ledger. [Terms](https://www.naturalearthdata.com/about/terms-of-use/) vẫn nêu public domain. Không nâng city/representative-area thành exact site.
- Web extractor timeout ở bài Biên giới 1950; fetch trực tiếp cùng URL trả HTTP 200, đọc đoạn 16/9/1950 trong HTML thật. Metadata/checksum lưu ở source recheck local; không dùng snippet làm chứng cứ thay thế.
- Xem trực tiếp PDF pages 4–5 QĐ 19/2025/QĐ-TTg, đối chiếu 34 mã/tên; đọc lại [Nghị quyết 202](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-202-2025-qh15-ve-sap-xep-don-vi-hanh-chinh-cap-tinh-119250612174148722.htm) và [OSM terms](https://www.openstreetmap.org/copyright). Việc này xác nhận danh tính/quyền dữ liệu có điều kiện, không xác nhận hình học còn thiếu.
- PDF quyết định NXBGDVN 529 giữ SHA-256 `4e25385e76e3d80956defb60947ef8fb8396285de1f8f99432b654ca4cc9180e`; đã xem trang 8, chỉ hỗ trợ sản phẩm/series 2024–2025. **Bản in/mục lục/trang sách của chủ dự án chưa đối chiếu**; lesson links vẫn chỉ là điều hướng chủ đề.
- Dữ liệu hành trình, tọa độ, nguồn/uncertainty và geography không bị sửa. Hash legacy serialized journey `629469195e68027d1b3b7234d3e28c9282f1d99fcc09b5b666365e3dca7247e6` vẫn được unit test bảo vệ. Source-only stops không tạo draft/publication hay slug giả.

## Production target và kiểm tra mới

Target do Task 09 khởi chạy: `E2E_BASE_URL=http://127.0.0.1:3100`, PID `17120`, build ID `0tTQwPm2Is4l8A6UZNivt`, build tạo bởi gate sau bản sửa optional attach. Target/PID/served asset hashes ở `output/playwright/explorer-refinement/task-09/production-target.json` và `measurements.json`. Không dừng/chạm server của chủ ở 3000.

| Lệnh/check | Kết quả mới |
| --- | --- |
| `pnpm exec vitest run tests/unit/explorer-province-boundaries.test.ts` trước sửa parser | 4 fail, 29 pass: đúng các regression mới |
| `pnpm exec vitest run tests/unit/explorer-province-boundaries.test.ts tests/unit/explorer-journey-playback.test.ts tests/unit/explorer-journey-registry.test.ts tests/unit/explorer-journey-content.test.ts tests/unit/explorer-journey-path.test.ts` | 84/84, exit 0 |
| Overrun browser trước sửa attach | 1 fail: `loading`, có unhandled error |
| Overrun browser sau sửa/fresh build | 1/1; cũng có trong lần 111/111 cuối |
| `pnpm verify` sau sửa cuối | exit 0; agent check, history subset 42/42, lint, strict types, **979 unit / 76 files**, **8 hook/setup**, production build **102 pages** |
| Bảy file đúng yêu cầu, `--workers=1` | **111/111**, 490.177s, 0 skip/flaky/unexpected |
| Path/province/content supplemental, `--workers=1` | **40/40**, 167.033s, 0 skip/flaky/unexpected |
| `pnpm exec eslint` cho harness/measurement/test vừa sửa | exit 0 |
| `node tests/perf/explorer-refinement-task-09.mjs` | exit 0; hai mẫu 10s, combined pixels, bốn no-WebGL journeys, lifecycle và log probe |
| `node scripts/validate-vietnam-province-source.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --report .task-reports/task-09-work/province-source-validation.json` | **exit 2**; cổng production tỉnh còn thất bại |

```powershell
$env:E2E_BASE_URL = 'http://127.0.0.1:3100'
pnpm verify
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-explorer-refinement.spec.ts tests/e2e/home-journey-choices.spec.ts --workers=1
pnpm exec playwright test tests/e2e/home-journey-path.spec.ts tests/e2e/home-province-boundaries.spec.ts tests/e2e/home-journey-content.spec.ts --workers=1
node tests/perf/explorer-refinement-task-09.mjs
git diff --check
git status --short
```

Không chạy unfiltered `pnpm test:e2e`: account/auth/admin/staff/payment/progress và các suite ngoài phạm vi có thể ghi dịch vụ đã kết nối; mobile/tablet bị hoãn. Không tuyên bố coverage ngoài mười file trên. `verification-summary.json` ghi số case từng file: 4/27/15/22/12/21/10 và supplemental 16/15/9.

## Số đo mới, không dùng lại P6/B3

Cửa sổ serial 23:32:55–23:33:31 Asia/Bangkok; không có test/build của agent chạy đồng thời. CPU trước đo 3%. Windows `10.0.26300`, i5-11400H 6 core/12 logical, RAM 15.69GiB; Edge **156.0.4314.42** headless; Intel UHD / ANGLE D3D11; WebGL2, CSS 1440×900, DPR 1. Backend báo phần cứng Intel, không phải SwiftShader/software renderer. Không kiểm soát mọi ứng dụng khác của chủ.

Instrumentation: scene FrameCapture ghi rAF intervals và CPU render submission, không `gl.finish`; hook browser-only vào WebGL `bufferData/deleteBuffer` và draw methods để đếm buffer sống/bytes thực cấp và draw thực. Không thêm debug global hay telemetry vào bundle sản phẩm. Không suy diễn renderMs là thời gian GPU đồng bộ; số đo giới hạn ở thiết bị/viewport này. Visibility được kích hoạt tại DOM visibilitychange boundary; đây không phải chứng nhận chuyển tab/vòng đời OS trên mọi trình duyệt.

| Gate | Số đo | Kết luận |
| --- | ---: | --- |
| Province artifact ≤200KiB gzip | **Không có artifact** | **Chưa đạt / không được tính là 0 byte** |
| Runtime geography ≤800KiB gzip | 586,931 byte gzip = 573.175KiB; 1,777,643 raw | PASS phần đang phục vụ; thiếu province thực. Dùng nghĩa gzip của plan; nếu hiểu 800KiB là raw, baseline hiện có vượt ngưỡng. |
| Added UI/journey JS ≤60KiB gzip | Conservative whole-chunk envelope **52,351 byte = 51.124KiB** | PASS upper bound bốn chunk UI/journey/decluster/scene/parser, kể cả chunk optional chưa load do 404; không gọi đây là delta hai build. Tổng JS load hiện tại 841,890 byte gzip, gồm engine/framework đã có. |
| Province/path ≤3 added calls, ≤6MiB buffers | Route 380 đoạn: +1 call, +12,356 byte GPU buffer; route + synthetic province 50,000 đoạn: **+2 calls, +1,212,552 byte ≈1.156MiB** | PASS capacity fixture; toàn scene 7→9 calls, 7→9 geometries; textures vẫn 3 / decoded estimate 64MiB. Chưa phải phép đo dữ liệu 34 tỉnh thực. |
| Province ≤50,000 segments | Fixture stress đúng 50,000; source artifact chưa có | Renderer/budget guard PASS; artifact gate **outstanding** |
| 10s production flight median ≤33.3ms, p95 ≤50ms | 1,201 rendered frames; median **8.3ms**, p95 **8.5ms** | PASS current production scene/path |
| 10s flight với synthetic ceiling | 1,198 rendered frames; median **8.3ms**, p95 **8.5ms** | PASS fixture capacity; không chứng minh phân bố hình học thực |
| Settled / hidden / unmounted | Mỗi cửa sổ 1s: **0 rendered frames, 0 submitted draws** | PASS; sau React unmount buffer sống 0, geometries 0, textures 0 |

HTTP đo trực tiếp `Accept-Encoding: gzip`, tất cả bốn geographic asset có thật và bốn chunk trong upper bound trả gzip; byte counts khớp gzip nội dung giải nén. 404 body của province không được cộng như một artifact. Khi path và province fixture cùng scene, 8/10/11 có lần lượt **29/251/584 province pixels**, **3,116/3,045/3,046 path pixels** khác biệt sau clear từng lớp; không chỉ dựa vào fetch hay geometry count.

## Console, request và server log

Không phải log sạch. Diagnostic tự động trên page fixture của 151 case ghi **0 pageerror**, **210 HTTP error responses**, **259 console errors**, **5 warnings**, **441 requestfailed**. Context no-JS riêng có kiểm tra navigate/read native nhưng không nằm toàn bộ trong hook page fixture; không suy diễn hook này là log mọi context.

- HTTP: 208 lần province 404 thực tế (một required feature còn thiếu), 1 country 404 và 1 province 503 được chủ động inject cho fallback.
- Requestfailed: 393 local `ERR_ABORTED` trong prefetch/navigation/teardown; 5 `ERR_FAILED` do fault injection (world/texture/country/province); **43 `ERR_CONNECTION_RESET` tới `tile.openstreetmap.org` trên trang chi tiết hiện có**. Browser navigation/detail/return assertions qua; không khẳng định các tile ngoài đó đều tải thành công. Không thêm provider hay mở rộng task để sửa dịch vụ ngoài. Measurement navigation sang detail cũng thấy thêm 4 tile resets.
- Console error breakdown: 209 thông báo 404, 5 injected `ERR_FAILED`, 43 tile reset, 1 injected 503, 1 lỗi tạo WebGL được inject. 5 warnings về `WEBGL_lose_context` trong kiểm tra mất/thiếu context. Raw request bodies/token không ghi vào diagnostic.
- Server riêng ghi **7** lần `The destination stream closed early`, digest **3840477093**, trong scoped acceptance session. Bộ 151 ca xanh không xóa triệu chứng này. Probe riêng thay document ngay sau commit 3 lần không phát sinh thêm lỗi (7→7), cả ba response 200 và title cuối đọc được, không pageerror; chưa xác định được nguyên nhân hoặc testcase tối thiểu tái hiện ổn định. Chưa thấy HTTP500/learner-flow failure trong coverage trên; không suy diễn không có tác động ở các luồng khác. Không sửa framework/SSR ngoài phạm vi khi chưa có reproduction nhân quả.

## File thuộc Task 09 và self-review

- Sản phẩm: `components/explorer/cinematic/CinematicGlobeCanvas.tsx`, `lib/explorer/cinematic/province-boundaries.ts` — hai sửa lỗi nêu trên.
- Regression/acceptance: `tests/unit/explorer-province-boundaries.test.ts`, `tests/e2e/home-explorer-refinement.spec.ts`, `tests/e2e/home-journey-choices.spec.ts`; mới `tests/e2e/refinement-evidence.ts`, `tests/e2e/refinement-test.ts`, `tests/perf/explorer-refinement-task-09.mjs`.
- Bảy E2E còn lại chỉ chuyển sang diagnostic fixture; `home-province-boundaries.spec.ts` còn sửa tên/comment để gọi đúng synthetic fixture, không nhận là verified geography. Không giảm assertion cũ.
- Tài liệu: audit này, progress, trạng thái Task 09 trong kế hoạch tổng và kế hoạch Task 09 riêng. Sửa mô tả handoff 08 cho khớp actual props/state/form; API sản phẩm không thay đổi.

Self-review đối chiếu source/callers, fail→pass, cancellation/optional attach, async abort/disposal, schema versus source approval, source/uncertainty và protected files. Snapshot hash xác nhận journey data/geography/dependency manifests/Word giữ nguyên; tracked diff trước task giữ nguyên byte nội dung. Working tree dirty có từ trước, không coi toàn bộ `git diff` là Task 09. Index rỗng; `.task-reports/` giữ Git ignore. `git diff --check` cuối exit 0; cả 20 file task-owned cũng được kiểm tra whitespace bằng no-index để bao gồm file untracked. Status được giữ trong log local, không stage các thay đổi có từ trước. Không mở/in nội dung secret hay sửa Word/.env.

Đã dừng duy nhất task-owned PID `17120` lúc `2026-10-24T23:54:53+07:00` sau khi chụp/đo; không chạm port 3000. Xác nhận process đã dừng ở `process-cleanup.json`, đối chiếu với ownership check trước khi stop. Production target trong báo cáo là target đã kiểm tra, không phải deployment đang publish.

## Đường dẫn bằng chứng

Root tuyệt đối: `D:/lich-su-viet-nam-interactive/output/playwright/explorer-refinement/task-09/`.

- `measurements.json`, `production-target.json`, `device-before-measurement.json`, `verification-summary.json`, `e2e-selected.json`, `e2e-supplemental.json`, `arrival-dwell-timing.json`, `hash-review.json`.
- `contact-four-journeys-1280.png`, `-1366.png`, `-1440.png`, `-1920.png`: xem trực tiếp cả bốn desktop; 16 ảnh gốc theo `<journey-id>-<width>x<height>.png`.
- `contact-geography-card-cluster.png`, `contact-render-proof.png`: đã mở xem; cùng ảnh gốc `atlas/`, `geometry/`, `country/`, `path/`, `camera/` được copy chỉ từ output mới trong phiên này; metadata ở `fresh-evidence-copies.json`.
- `province-overrun-red.png`, `province-overrun-safe-fallback.png`, `province-overrun-retry.png`; `synthetic-province-z8/10/11.png`, `combined-path-province-z8/10/11.png`; fixture không phải province artifact.
- `no-js-four-journey-reading.png`, bốn `no-webgl-<journey-id>.png`; các diagnostic folder giữ kết quả theo testcase, query/token được loại bỏ.
- Nguồn/local command evidence: `D:/lich-su-viet-nam-interactive/.task-reports/task-09-work/`, gồm validator failing JSON, source recheck và log hẹp. Không đưa full logs vào audit/commit.

**Quyết định:** phần runtime được kiểm tra có bằng chứng mới và hai lỗi đã sửa; yêu cầu 34 tỉnh/thành production cùng các gate artifact thực vẫn **chưa được chấp nhận**. Exact textbook printing/pages và triệu chứng stream-close là các giới hạn còn ghi rõ. **STOP sau 09**, không tự tiếp tục Task 05 hay thực hiện hành động bên ngoài.
