# Khắc phục và nghiệm thu lại tiền điều kiện Phase 03

Ngày 26–27/10/2026, Asia/Bangkok. Một agent chính thực hiện toàn bộ điều tra, sửa, kiểm tra và **self-review**. Chủ dự án đã trả lời rõ: **“Cho phép sửa/nghiệm thu Phase 03 rồi tiếp tục Phase 04”** sau [tiền kiểm ngày 26/10](2026-10-26-local-heroes-phase-04-preflight.md). Đây là thẩm quyền mở rộng phạm vi; không suy ra quyền ghi remote hay công bố nội dung.

## Sửa lỗi đã tái hiện

- Sửa truy cập `officialName`, import slugify hiện hữu, khai báo `values` trùng và chuyển kiểu lỗi đúng giao diện `ActionState`/form. Không sửa assertion để che lỗi biên dịch.
- Tách projection story từ dữ liệu đọc sang command strict (`catalogStoryInputs`), loại `workflow`/`reviewNote` khỏi payload. Ca CAS trước đó nhận `INVALID_INPUT` đã được chứng minh RED → GREEN với payload hợp lệ và vẫn bắt buộc nhận `STALE`/chỉ một RPC; payload sai tiếp tục bị từ chối.
- Sau lưu, cập nhật revision/serialized graph trả về; form mới dùng revision mới, tab cũ bị từ chối. Giá trị năm sai được giữ và hiển thị lỗi, thay vì âm thầm đổi thành null. Dùng `unstable_rethrow` để giữ điều hướng Next.js.
- Các form submit/review/hide/restore truyền revision quan sát được; submit truyền chính xác truyện đã chọn. Giữ luồng legacy cho nhân vật chưa enroll. Ẩn hard-delete với hồ sơ catalog; readiness nói “đủ điều kiện gửi duyệt”, không gọi nháp là hồ sơ đã công bố.

Các file trực tiếp: `components/admin/figures/{FigureCatalogEditor,LocalityEditor,StoryEditor}.tsx`, `components/admin/forms/FigureForm.tsx`, `components/admin/{SubmitForReviewPanel,AdminContentPanel}.tsx`, `components/admin/review/ReviewPanel.tsx`, ba route nội dung/kiểm duyệt hiện hữu, `lib/actions/{content,admin-content,review,local-heroes}.ts`, `lib/local-heroes/admin-form.ts` và unit/form/workflow/admin E2E liên quan. Giữ nguyên schema Phase 02 và bytes gói nghiên cứu v14.

## Bằng chứng mới, phân biệt theo lớp

| Lớp | Lệnh / kết quả | Điều được chứng minh |
| --- | --- | --- |
| PostgreSQL/RLS thật | `supabase test db --local D:/lich-su-viet-nam-interactive/supabase/tests/local_heroes.sql --workdir .task-reports/local-heroes-phase-02-work/db` — **288 assertions đạt** | Quyền anon/learner/locked/editor/reviewer/admin, nguồn riêng, OLD/NEW ownership, graph workflow, distinct/count/order/search, invariant và rollback. |
| Hai session DB thật | `node tests/rls/local-heroes-concurrency.mjs --target .task-reports/local-heroes-disposable-db.json` — **2/2 đạt**, có chờ advisory lock và cleanup | `publish_vs_source_edit`, `two_last_links`; ca invariant thứ hai cố ý dùng DB-owner session, không giả làm quyền editor. |
| Production build admin | `node scripts/agent/local-heroes-admin-e2e.mjs build` — **đạt** | Build dùng local Auth/API, dist riêng; không phải fixture RPC công khai. |
| Browser/Auth/HTTP thật | `pnpm exec playwright test --config playwright.local-heroes-admin.config.ts` — **7/7 đạt** | Denial thật theo vai trò; form editor/keyboard/scroll ở bốn viewport; lưu hai lần/revision mới; lỗi giữ giá trị; stale tab; editor → yêu cầu sửa → resubmit → publish → hide → republish → admin restore. |
| Next.js → anon RPC → DB thật | Các assertion trong ca workflow cuối | Tổng toàn quốc là một người dù có hai địa phương; địa phương tưởng niệm không tăng coverage; không lộ `PRIVATE_`; profile công khai 200 khi eligible, 404 sau hide, page rỗng sau restore. Cookie reviewer không làm public reader dùng quyền staff. |

Log cuối của browser/build là `.task-reports/local-heroes-phase-04-preflight/admin-final-{build,browser}.log`; DB: `db-roles.log`, `db-races.log`. Kết quả cấu trúc/ảnh form bốn viewport: `output/playwright/local-heroes-admin/`. Các file này được ignore, không chứa service-role key. Auth cookies chỉ ở bộ nhớ; admin trace tắt.

## An toàn môi trường và giới hạn

Runner/config mới bắt buộc đúng descriptor, local Docker transport, cả hai project label, DB port và CLI API. Chỉ project disposable `local-heroes-phase02-disposable` được seed/reset. Cần Auth rỗng trước fixture; không attach server, không nhận URL override, không đọc `.env`, không dùng service role. Dữ liệu browser là giả định có nhãn, không phải người/nguồn/ảnh được phê duyệt.

Các trạng thái `passed-admin-ui-slice` và câu “xác minh độc lập inline” trong handoff cũ không phải bằng chứng chạy lệnh. Bản ghi này thay thế kết luận đó bằng output thật; toàn bộ công việc là **self-review**. Lỗi CLI `pg-delta` khi reset sẽ được ghi cùng kết quả reset và kiểm tra cleanup thực tế trong [bàn giao Phase 04](2026-10-27-local-heroes-phase-04-handoff.md), không được coi warning là bằng chứng xóa sạch.

Cổng repo và trạng thái cleanup cuối được chốt ở bàn giao/verification Phase 04. Không có remote migration/import, công bố người thật, push/PR/deploy hoặc chứng nhận của giáo viên/nhà sử học.

Kết quả chốt 27/10: `pnpm verify` đầy đủ đạt (99 file/1.161 unit, 26 script, normal production build); reset disposable exit 0, direct query xác nhận 0 Auth user/0 synthetic figure/34 locality. Lỗi `pg-delta` CLI vẫn được ghi như giới hạn tooling, không phải lỗi test quyền. Báo cáo local: [2026-10-27-0047-local-heroes-phase-04.md](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-27-0047-local-heroes-phase-04.md).
