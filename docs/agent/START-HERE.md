# Làm việc với AI Agent trên máy mới

Quy trình chung nằm trong Git; model, tài khoản, plugin cá nhân, lịch sử chat và dữ liệu live không đi cùng một lần clone. Môi trường của nhóm: **Windows; Codex desktop, Antigravity 2.0 và Claude Code**. Không cần cài đủ ba công cụ hay dùng cùng model. Dùng một agent cho mỗi task, bao gồm self-review, theo `AGENTS.md`.

## Thiết lập lần đầu

1. Cài Git for Windows (có Git Bash), Node **24.x** và pnpm **11.7.0**. Mở terminal mới để nhận PATH. Repo khai báo `.node-version`, `engines` và `packageManager`; không tự đổi lockfile hoặc nâng dependency khi chỉ thiết lập máy.
2. Clone repo, mở terminal tại thư mục gốc vừa clone; không dùng đường dẫn máy của người khác.
3. Chạy các lệnh dùng chung trong PowerShell:

```powershell
pnpm install --frozen-lockfile
pnpm agent:setup
pnpm agent:doctor
pnpm agent:check
pnpm verify
```

`agent:setup` chỉ bật Git hooks cục bộ bằng `core.hooksPath=.githooks`; không cài plugin, không tạo API key và không sửa cấu hình agent toàn máy. Chạy lại an toàn. Nếu đã có hook riêng hoặc `core.hooksPath` khác, lệnh dừng và giữ nguyên cấu hình. Tích hợp thủ công lời gọi `node scripts/agent/codegraph.mjs sync --optional` vào các hook post-commit/post-checkout/post-merge hiện hữu, hoặc dùng `pnpm agent:sync`; không vô hiệu hook sẵn có.

CodeGraph là tùy chọn. Nếu muốn dùng, cài CLI phiên bản đã kiểm tra `npm install -g @colbymchenry/codegraph@1.6.0`, sau đó chạy `pnpm agent:index`. Xem [đồng bộ và xử lý lỗi CodeGraph](CODEGRAPH.md). Không cần CLI này để chạy `pnpm verify` hay CI. Python 3 cần cho pipeline province khi sửa dữ liệu nguồn; không phải điều kiện chạy ứng dụng thông thường.

Tạo cấu hình ứng dụng riêng từ `.env.example` khi cần chạy tính năng kết nối database. Nhận thông tin truy cập qua kênh riêng được chủ dự án cho phép; không chia sẻ `.env.local` qua Git/chat. Việc clone code hoặc `pnpm verify` thành công không đồng nghĩa database, Auth, Storage hay payment sandbox đã được chuẩn bị.

## Chọn công cụ

| Công cụ | Những gì repo cung cấp | Kiểm tra trên máy của bạn |
| --- | --- | --- |
| Codex desktop | `AGENTS.md`, năm skill trong `.agents/skills/`, `.codex/hooks.json`, MCP example tùy chọn | Trust workspace và phiên bản hook hiện tại; xem `/hooks` nếu dùng CLI. Mở chat mới/restart MCP sau thay đổi cấu hình; kiểm tra tool catalog thực tế. |
| Antigravity 2.0 | `AGENTS.md`, rule `.agents/rules/project.md` có `trigger: always_on`, skill dùng chung, named hook trong `.agents/hooks.json` | Trong Customizations → Hooks kiểm tra `history-command-guard` được nạp/bật. Phiên bản app/IDE có thể khác launcher `agy`; phải kiểm tra trong đúng ứng dụng đang dùng. |
| Claude Code | `CLAUDE.md` import `@AGENTS.md`, `.claude/settings.json`, năm skill wrapper trong `.claude/skills/` | Trust repo, xem `/hooks` và `/context`; kiểm tra năm skill trong menu `/`. Wrapper đọc skill chuẩn trong `.agents/skills/`, không giữ bản sao quy trình. |

Hook bảo vệ các lệnh shell phổ biến; nó không thay thế sandbox, quyền ứng dụng hay self-review. Bộ test kiểm tra command/payload/exit/JSON contract trực tiếp; không tự khởi chạy thêm phiên AI để kiểm thử. Hook mới hoặc thay đổi có thể cần người dùng trust lại; file tồn tại chưa chứng minh hook đang chạy.

Plugin Superpowers, Context7, Supabase, trình duyệt và Memory là tùy chọn theo task. Không cần sao chép bộ plugin cá nhân của người khác. Skill ngoài repo không được tự tạo subagent hay áp thêm bước xin phép cho local work đã được người dùng giao. Xem [MCP và công cụ trình duyệt](MCP-TOOLS.md).

## Quy trình mỗi task

1. `git status --short`; tạo nhánh theo mục đích: `feat/<task>`, `fix/<task>`, `chore/<task>` hoặc `docs/<task>`. Không dùng tiền tố `codex/`. Giữ nguyên file Word và thay đổi ngoài task.
2. Đọc `AGENTS.md`, [bản đồ code hiện tại](CURRENT-STATE.md), spec/plan liên quan. Prompt cũ là hồ sơ của task cũ; không chạy lại từ đầu.
3. Nếu có CodeGraph: `pnpm agent:sync`, rồi `codegraph explore "<file/symbol/question>"`. Nếu thiếu công cụ, database hoặc file không được index, dùng `rg`/đọc file có mục tiêu và ghi rõ giới hạn.
4. Viết plan ngắn cho thay đổi không nhỏ; thực hiện từng lát cắt, test logic đỏ → xanh, review diff và chạy gate phù hợp.
5. `pnpm verify` trước bàn giao. Với UI, chạy thêm smoke và các hành trình desktop liên quan. Cập nhật tài liệu/chỉ mục sau thay đổi, tạo báo cáo `.task-reports/` theo quy định và dẫn đường dẫn trong bàn giao.
6. Commit/push/PR/deploy chỉ khi có yêu cầu riêng. Trước stage dùng đường dẫn cụ thể; không `git add .` trong workspace có tài liệu riêng, secret hoặc output chưa được phân loại.

Mọi task prompt mới hoặc sửa đáng kể dùng tiếng Anh, theo [standard](AI-AGENT-PROMPT-STANDARD.md) và [template](AI-AGENT-PROMPT-TEMPLATE.md). Model/reasoning là lựa chọn của người dùng; repo không ép một nhà cung cấp hoặc độ reasoning.

## Kiểm tra trình duyệt

```powershell
pnpm exec playwright install chromium
pnpm build:smoke
pnpm test:e2e:smoke
```

`build:smoke` tạo production build với URL/key công khai **giả** vì middleware và browser client hiện cần hai giá trị này ngay cả khi không có phiên đăng nhập. Startup của smoke dùng cùng fixture. Không cần Supabase đang chạy hoặc khóa thật; CI đặt cùng fixture trước bước build. Smoke dùng Chromium của Playwright ở cổng 3100 và kiểm tra public shell ở bốn viewport desktop, bao gồm đường lỗi dữ liệu. Đây là cổng browser của CI, không phải nghiệm thu toàn bộ nội dung có dữ liệu thật. Khi quay lại kiểm tra dữ liệu của môi trường phát triển, chạy `pnpm build`/`pnpm dev` với cấu hình riêng của bạn.

Nếu mạng không tải được Chromium, có thể dùng Edge đã cài trên Windows: đặt `$env:E2E_CHANNEL='msedge'`, chạy smoke, rồi `Remove-Item Env:E2E_CHANNEL`. Ghi rõ trình duyệt thực tế trong báo cáo; CI vẫn dùng Chromium được cài trong workflow.

`pnpm test:e2e` giữ nguyên bộ integration/legacy; nhiều file đọc `.env.local`, đăng nhập, tạo/xóa tài khoản hoặc dữ liệu. Chỉ chạy các ca này trên database thử nghiệm dùng riêng đã được cho phép. Với desktop public feature, chọn file/test liên quan sau khi đọc chúng. Cấu hình legacy mặc định dùng Edge trên Windows; `E2E_CHANNEL` có thể chọn trình duyệt khác. Không dùng `CI=1` chỉ để đổi trình duyệt vì biến này còn đổi hành vi khác.

Giữ WCAG AA, bàn phím/focus và reduced motion. Phạm vi hiện tại là 1280×720, 1366×768, 1440×900, 1920×1080 theo `docs/product/DESKTOP-UI-SCOPE.md`; mobile/tablet được hoãn.

## Sau khi pull hoặc chuyển máy

Chạy lại `pnpm install --frozen-lockfile` nếu dependency đổi, `pnpm agent:setup`, `pnpm agent:doctor`; rebuild CodeGraph tại checkout mới nếu sử dụng. Git hooks có version trong repo nhưng việc kích hoạt là cấu hình Git cục bộ trên từng máy. Trust hook/MCP và xác thực dịch vụ cũng theo từng ứng dụng/người dùng. Chia sẻ trạng thái bền vững bằng code, test, spec và audit đã commit; không dựa vào trí nhớ của một chat.
