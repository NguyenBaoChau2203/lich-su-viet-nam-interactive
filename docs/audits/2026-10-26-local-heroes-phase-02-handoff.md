# Bàn giao Phase 02 — dữ liệu, bảo mật và server interfaces

Ngày: **26/10/2026, Asia/Bangkok**. Nhánh: **`feat/local-revolutionary-heroes`**. Hợp đồng: **LH-1.0.0-draft.1**.

Phạm vi bàn giao là backend Phase 02. [Phụ lục implementation contract](2026-10-26-local-heroes-phase-02-contract.md) ghi chính xác các export, RPC, quy tắc tương thích và lệnh dành cho Phase 03–05. [Bản ghi verification](2026-10-26-local-heroes-phase-02-verification.json) lưu kết quả mới nhất và hash bằng chứng; báo cáo cục bộ được dẫn ở cuối tài liệu.

## Kết quả triển khai

- Thêm migration sau `20261031000000`, sáu bảng và registry 34 địa phương, khóa ngoại/chỉ mục/check, grants/RLS, nguồn công khai theo graph hợp lệ và các guard bảo vệ parent/child/source/media.
- Thêm bốn lệnh graph nguyên tử: lưu draft, gửi duyệt, review và khôi phục. Có CAS revision dạng chuỗi, khóa transaction chung, kiểm tra ownership OLD/NEW, thứ tự lưu an toàn với FK và kiểm tra invariant trước khi trả success.
- Thêm public page/profile RPC và server readers: một trang tối đa 12 người, thứ tự ICU tiếng Việt rồi slug, tìm tên/bí danh/đóng góp có và không dấu, wildcard là ký tự thường, tổng người khác biệt và coverage đúng 34 mã. Query trang batch nguồn/ảnh/quan hệ; không gọi profile riêng cho từng thẻ.
- Thêm staff graph reader, strict command/result schemas và structural readiness. Workflow action hiện hữu chuyển hồ sơ catalog qua lệnh nguyên tử; hồ sơ legacy giữ đường xử lý cũ. Mặc định form cũ chọn truyện chính; Phase 03 sẽ truyền lựa chọn truyện và revision rõ ràng.
- Sinh types từ schema local đã chạy, trích slice mới bằng script và ghép với kiểu legacy để giữ các nullable API refinements hiện hữu.
- Thêm validator research/release xác định được lỗi cấu trúc, provenance, danh tính, tham chiếu, câu chuyện/ảnh, hash và coverage bị khai sai. Không dùng research JSON làm fallback cho production.

## Môi trường DB đã xác nhận

Chỉ dùng project Docker **`local-heroes-phase02-disposable`**, container **`supabase_db_local-heroes-phase02-disposable`**, DB **`postgres`**, loopback **`127.0.0.1:55342`**, mục đích **`local-heroes-tests`**. Docker labels và CLI config phải trùng trước khi chạy. PostgreSQL **17.6**, UTF-8, có ICU. CLI **2.111.0**; không dùng `--linked`, remote URL, MCP ghi DB hoặc service-role client.

Config, descriptor và migration snapshot của project này nằm trong thư mục `.task-reports/` được ignore. Đây là môi trường có thể reset; không thay nó bằng project làm việc. Các project Docker đã có không được dùng làm fixture. Test chỉ tạo dữ liệu tổng hợp; không import hoặc công bố hồ sơ nghiên cứu thật.

## Bằng chứng kiểm tra

Các lệnh bắt buộc và kết quả cuối cùng được ghi trong verification JSON. Các nhóm bằng chứng đã có:

| Nhóm | Nội dung được chứng minh |
| --- | --- |
| DB pgTAP | 288 assertions: anon/learner/locked/editor/reviewer/admin; INSERT/UPDATE/DELETE qua các bảng liên quan; source visibility; legacy defaults; forged IDs/ownership; revision; submit/revision/resubmit/publish/hide/republish/restore; last-link và rollback; phân trang 12, người đa địa phương, thứ tự tên/slug và literal search |
| Hai session psql | `publish_vs_source_edit` và `two_last_links`; quan sát thật trạng thái chờ advisory lock; giao dịch không hợp lệ rollback; còn chứng cứ bắt buộc sau race |
| Rehearsal migration | Replay toàn bộ migrations trên local, thử DDL mới trong transaction rồi rollback về baseline trước Phase 02, sau đó replay schema cuối; kiểm tra không còn fixture Auth/người |
| Unit | Public/staff readers, bounded query count, Unicode, malformed/outage results, strict/auth/stale commands, readiness và các negative controls cho validator |
| Research/release gate | v14 giữ nguyên; research hợp lệ, release chưa đủ điều kiện; cả 34 trạng thái địa phương được báo trong release output |
| Cổng repo | `pnpm verify`: agent/history/lint/typecheck/unit/script/build; kết quả mới nhất trong verification JSON |

Lệnh tái chạy phần DB, sau khi xác nhận đúng disposable target:

```powershell
supabase test db --local D:/lich-su-viet-nam-interactive/supabase/tests/local_heroes.sql --workdir .task-reports/local-heroes-phase-02-work/db
node tests/rls/local-heroes-concurrency.mjs --target .task-reports/local-heroes-disposable-db.json
```

`supabase test db --local --workdir .task-reports/local-heroes-phase-02-work/db` cũng đã chạy với bản copy đúng test/fixture của Phase 02 trong project riêng. Không mô tả lệnh này như đã chạy toàn bộ các script SQL legacy của repository. `pnpm verify` không thay thế test DB và không chạy browser E2E.

Kiểm tra bổ sung `supabase db lint` không tìm thấy lỗi trong các hàm catalog mới nhưng báo `42P01` ở hàm luyện thi hiện hữu `public.exam_grade_attempt`, với bảng tạm `pg_temp.exam_graded`. Migration hiện hữu tạo bảng tạm trước khi dùng; static checker không thấy bảng trong phiên lint. Không sửa hàm/migration luyện thi ngoài phạm vi, và không mô tả toàn bộ database lint là sạch.

## Những quyết định cần giữ

- Draft hợp lệ khác với đủ điều kiện gửi duyệt; gửi duyệt khác với public visibility; coverage chuẩn bị khác với số liệu public đã quan sát. Không tạo vòng lặp đòi truyện phải published trước khi parent được gửi duyệt.
- Reviewer chỉ đổi trạng thái theo quy trình, không sửa content qua graph API. Editor không sửa graph bảo vệ hoặc tự publish. Admin phải restore trước khi sửa nội dung; không dùng hạ `is_local_hero` hoặc hard-delete parent đã enroll để né guard.
- `coursework_reference` có thể giữ `license=null` khi đủ chứng cứ/policy/ghi công. Không bịa giấy phép và không suy ra quyền upload hay xuất bản rộng hơn.
- Một claim period approximate trong hồ sơ được chọn nhưng chưa hoàn chỉnh vẫn là dữ liệu nghiên cứu hợp lệ. Runtime pending/public yêu cầu period verified; không nâng certainty hoặc sửa hash để làm xanh test.
- Toàn bộ quyền, review và xác minh là công việc của một agent chính, được gọi đúng là **self-review**, không phải review độc lập hay chứng nhận lịch sử.

## Giới hạn và điểm dừng

Gói đã duyệt vẫn là manifest **v14**, hash **`893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`**. Giữ **35 người được chọn, 2 complete, 33 incomplete, 18 held**; hai địa phương có nội dung chuẩn bị hoàn chỉnh, **34/34 vẫn là yêu cầu bắt buộc của lần phát hành đầu**. `publicSnapshot` vẫn null. Validator và test không chứng nhận tính đúng lịch sử hay quyền ảnh từ JSON.

Chưa làm UI quản trị/home/detail của Phase 03–05, GET route Phase 04, browser/viewport/performance acceptance, nội dung còn thiếu Phase 06 hoặc audit phát hành Phase 07. Chưa kiểm tra Auth/PostgREST HTTP end-to-end cho UI mới; DB role tests là bằng chứng thực về PostgreSQL/RLS, còn HTTP/browser phải làm ở phase sở hữu. Schema chỉ được áp dụng local; phải có kế hoạch triển khai schema trước code khi có yêu cầu rollout riêng.

Không stage/commit/push/PR/merge/deploy, upload ảnh, ghi remote hoặc xuất bản nội dung thật. Giữ các file Word/PDF/ảnh và toàn bộ công việc đang có của chủ dự án. Các nội dung cũ trong CURRENT-STATE và handoff Phase 00 được giữ nguyên, chỉ bổ sung liên kết/checkpoint mới.

Điểm dừng của lần thực hiện này là **bàn giao Phase 02**, không tự bắt đầu Phase 03. Báo cáo local được Git ignore và đường dẫn tuyệt đối của nó được ghi trong verification JSON và phản hồi bàn giao.

Báo cáo cục bộ đầy đủ: [2026-10-26-1917-local-heroes-phase-02.md](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-26-1917-local-heroes-phase-02.md).
