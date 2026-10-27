# Tiền kiểm Phase 04 — bị chặn bởi điều kiện nghiệm thu Phase 03

> **Cập nhật 27/10/2026:** chủ dự án đã trả lời “Cho phép sửa/nghiệm thu Phase 03 rồi tiếp tục Phase 04”. Giữ nguyên phần dưới như bằng chứng tiền kiểm lúc 22:19; trạng thái sau khắc phục nằm ở [remediation Phase 03](2026-10-27-local-heroes-phase-03-remediation.md) và [handoff Phase 04](2026-10-27-local-heroes-phase-04-handoff.md). Các câu “chưa có/chưa chạy/bị chặn” bên dưới không mô tả trạng thái cuối của lần thực hiện.

Thời điểm: **26/10/2026, 22:19, Asia/Bangkok**. Một agent chính thực hiện điều tra, kiểm tra và **self-review**. Đây là bàn giao tiền kiểm, **không phải bàn giao hoàn tất Phase 04**.

## Phạm vi và quyết định

Yêu cầu hiện tại là tích hợp chọn địa phương/tìm kiếm/phân trang vào homepage địa cầu theo hợp đồng **LH-1.0.0-draft.1**. Prompt bắt buộc Phases 00–03 có hợp đồng được duyệt và hành vi server/admin đã kiểm chứng, đồng thời giới hạn thay đổi trong Phase 04.

Tiền điều kiện Phase 03 **chưa đạt**. Không sửa phần admin ngoài phạm vi, không miễn cổng và chưa bắt đầu thay đổi homepage. Đã gửi câu hỏi phạm vi cho chủ dự án: cho phép khắc phục/nghiệm thu Phase 03 trước khi tiếp tục, hoặc dừng ở báo cáo blocker. Không coi việc chưa có câu trả lời là cho phép mở rộng phạm vi.

Nhánh thực tế là `feat/local-revolutionary-heroes`; HEAD vẫn `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Working tree đã có các thay đổi Phase 02–03 và tài liệu nghiên cứu/owner chưa commit trước lần này. Không reset, switch, stage hoặc sửa những file đó.

## Blocker đã tái hiện

| Bằng chứng mới | Kết quả và ý nghĩa |
| --- | --- |
| `pnpm typecheck` | Exit 1; TypeScript báo 7 diagnostic. Không có bản build hợp lệ để nghiệm thu Phase 04. |
| `pnpm lint` | Exit 1; 2 lỗi `no-explicit-any` và 11 warning trong phần Phase 03. |
| `pnpm exec vitest run tests/unit/local-heroes-admin.test.ts tests/unit/local-heroes-actions.test.ts tests/unit/local-heroes-query.test.ts` | 25 đạt, 1 thất bại. Ca `detects stale workflow changes when revision CAS fails` nhận `INVALID_INPUT`, không phải `STALE`. |
| `pnpm test` | 90 file đạt, 1 file thất bại; 1.109 test đạt, 1 thất bại. Phần script tests sau `&&` chưa chạy. |
| `pnpm verify` | Agent checks đạt; history checks đạt 42 test; dừng tại lint. Typecheck/unit/script/build nằm sau lint chưa chạy trong lệnh này. Không mô tả full gate là đạt. |
| `pnpm build:smoke` | Exit 1; Turbopack xác nhận biến `values` khai báo trùng và import module không tồn tại. Không chạy browser smoke trên build thất bại hoặc sử dụng build cũ để thay thế bằng chứng. |

Các vị trí TypeScript:

- `components/admin/figures/LocalityEditor.tsx:104` và `:260`: dùng thuộc tính `name`; registry đã chốt cung cấp `officialName`.
- `components/admin/figures/StoryEditor.tsx:12`: import `@/lib/utils/slug` không tồn tại.
- `components/admin/forms/FigureForm.tsx:136`: ép `Record<string, string>` sang `Record<string, string[]>`.
- `lib/actions/content.ts:128` và `:191`: khai báo trùng `const values` trong cùng scope.
- `lib/actions/content.ts:165`: gán `Record<string, string[]>` cho `ActionState.fieldErrors`, vốn là `Record<string, string>`.

Ca CAS truyền nguyên `graph.stories` chứa `workflow` và `reviewNote` vào command. `storySchema` là `z.strictObject` và không nhận hai thuộc tính này. Vì vậy validation từ chối trước khi tới RPC mô phỏng lỗi CAS. Cần dùng command payload hợp lệ để chứng minh CAS, đồng thời giữ nguyên negative assertion cho payload sai; không đổi assertion `STALE` thành `INVALID_INPUT` để làm xanh test.

## Thiếu bằng chứng admin/browser ở Phase 03

[Bàn giao Phase 03](2026-10-26-local-heroes-phase-03-handoff.md) ghi shell bị chặn và không cung cấp output chạy unit/browser thực tế. [Verification JSON Phase 03](2026-10-26-local-heroes-phase-03-verification.json) tự ghi `passed-admin-ui-slice`, nhưng trạng thái này không được output mới xác nhận.

Self-review mã hiện tại cho thấy:

- `tests/e2e/admin-local-heroes.spec.ts` chỉ kiểm tra redirect chưa đăng nhập, độ rộng homepage và thao tác Tab trên trang đăng nhập. Không có luồng tạo/lưu/gửi duyệt/revision/publish/hide/restore, phiên editor/reviewer/locked/admin hoặc stale-save qua UI.
- `playwright.local-heroes-admin.config.ts` kế thừa config legacy, nhận URL môi trường và không xác nhận DB disposable. Không được dùng config này như bằng chứng đã có bảo vệ mục tiêu hoặc chạy suite mutation trên remote đang làm việc.
- Bằng chứng PostgreSQL/RLS/race Phase 02 được ghi ở [handoff Phase 02](2026-10-26-local-heroes-phase-02-handoff.md). Đó là bằng chứng có phiên bản của pha trước, **chưa được tái chạy trong lần tiền kiểm này** và không thay thế E2E admin.

## Môi trường lệnh và CodeGraph

File owner có sẵn `node.cmd` dài **0 byte** ở root làm một số child command qua Windows shell thoát 0 mà không thực thi chương trình Node. Các kết quả không có output trước khi phát hiện được loại khỏi bằng chứng. Không sửa/xóa file owner hoặc vô hiệu hook.

Các lệnh xác minh có output thực được chạy với biến tiến trình:

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
```

Sau điều chỉnh, `pnpm --version` trả `11.7.0`; `pnpm agent:status` báo **819 supported source files**, complete, không pending changes. Đã dùng CodeGraph trước khi đọc source. Markdown/JSON và phần source bị graph bỏ sót được đọc có mục tiêu; graph không chứng minh DB live hay lịch sử nguồn.

## Kiểm tra nội dung và file của Phase 04

`node scripts/content/check-local-heroes.mjs` đạt research validation: manifest **v14**, hash **`893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`**, **35 accepted**, **2 complete**, **2/34 represented trong nội dung chuẩn bị**, **`releaseReady=false`**. Đây không phải số hồ sơ đang public, chứng nhận lịch sử hoặc quyền ảnh. Yêu cầu phát hành đầu vẫn đủ **34/34** và mọi người trong roster accepted phải hoàn chỉnh.

Lệnh bắt buộc `pnpm exec vitest run tests/unit/local-heroes-state.test.ts tests/unit/local-heroes-query.test.ts` chỉ chạy **3 test query**, vì `tests/unit/local-heroes-state.test.ts` chưa tồn tại. Exit 0 của lệnh không chứng minh state coverage. `lib/local-heroes/state.ts` hiện chỉ re-export hàm normalize/fold của Phase 02.

Chưa có các component panel/list/selector, GET API, state tests, feature E2E, fixture server, config và runner Phase 04. Do prerequisite bị chặn, lần này không tạo implementation placeholder, fixture giả cho production hoặc bắt đầu detail Phase 05.

## Bằng chứng cục bộ và việc còn lại

Log mới nằm tại `.task-reports/local-heroes-phase-04-preflight/`: `verify.log`, `unit-and-script.log`, `required-focused.log`, `content.log`, `build-smoke.log`. Báo cáo đầy đủ: [2026-10-26-2219-local-heroes-phase-04.md](../../.task-reports/2026-10-26-2219-local-heroes-phase-04.md). Đây là nhật ký ignore, không dùng thay code/tests/hợp đồng.

Chưa có bằng chứng bốn viewport, focus/keyboard, reduced motion, no-JS/no-WebGL, race/error, network/gzip budget hoặc legacy browser regressions của Phase 04. Không chạy `pnpm test:e2e:smoke` sau smoke build thất bại. Không thể khôi phục thành công normal build trước khi sửa các lỗi compile đã nêu; cần build lại sau remediation. `git diff --check` đạt; chỉ có cảnh báo chuyển CRLF sang LF trên các file pre-existing.

Checkpoint tiếp theo phải xử lý và chứng minh tiền điều kiện Phase 03 trước khi triển khai Phase 04. Việc sửa ngoài pha cần quyết định phạm vi của chủ dự án. Không commit/push/PR/merge/deploy/publish/upload/ghi dịch vụ bên ngoài hoặc sửa Word/PDF/.env trong lần này.
