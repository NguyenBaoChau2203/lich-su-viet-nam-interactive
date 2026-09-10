# Bắt đầu làm dự án với coding AI agent

## 1. Mở dự án

Mở đúng thư mục `D:\lich-su-viet-nam-interactive` trong Codex, Antigravity hoặc terminal chạy OpenCode. Hãy khởi động lại các ứng dụng agent một lần để chúng nhận CodeGraph và hook mới.

Chạy:

```powershell
pnpm install
pnpm agent:doctor
pnpm agent:check
pnpm dev
```

Trang local ở `http://localhost:3000`. Trước khi bàn giao một thay đổi, chạy:

```powershell
pnpm verify
```

Máy Windows hiện tại dùng Chrome đã cài sẵn cho kiểm thử local:

```powershell
pnpm test:e2e
```

GitHub CI tự cài Chromium riêng. Nếu chuyển sang máy không có Chrome, chạy `pnpm exec playwright install chromium` và đặt biến `CI=1` cho lần kiểm tra đó.

### Chrome DevTools MCP

Chrome DevTools MCP đã được cấu hình cho Codex, Antigravity và OpenCode để agent có thể xem DOM, console, network, accessibility tree, ảnh chụp và performance trace trong Chrome thật.

- Codex và OpenCode tự mở một profile Chrome tạm thời, tách khỏi tài khoản và cookie cá nhân.
- Với Antigravity, bấm biểu tượng Chrome ở góc trên bên phải trước khi yêu cầu agent dùng DevTools; MCP kết nối trình duyệt tích hợp qua `127.0.0.1:9222`.
- Không đăng nhập tài khoản cá nhân hoặc mở dữ liệu nhạy cảm trong trình duyệt đang được agent kiểm tra.

Prompt kiểm tra nhanh:

```text
Dùng Chrome DevTools MCP mở http://127.0.0.1:3000. Kiểm tra accessibility tree, console errors, failed network requests và chụp ảnh giao diện ở desktop. Chỉ xem dữ liệu; không sửa DOM hay đọc cookie/localStorage.
```

## 2. Trạng thái từng agent

- **Codex:** GitHub, Superpowers, Supabase, Chrome DevTools MCP và các plugin web đã bật. Project skill nằm trong `.agents/skills/`; hook an toàn nằm trong `.codex/hooks.json`. Chấp nhận/trust project hook khi Codex hỏi ở lần mở workspace đầu tiên.
- **Antigravity:** `agy` đã có Superpowers và Chrome DevTools MCP nối với browser tích hợp. Mở workspace, bật browser và chấp nhận/trust project hook khi IDE hỏi.
- **OpenCode:** `opencode.json` khai báo Superpowers, Chrome DevTools MCP và policy lệnh. Khởi động lại OpenCode sau khi config đổi.
- **CodeGraph:** đã được nối vào các agent và index dự án ở `.codegraph/`. Agent phải dùng `codegraph_explore` hoặc `codegraph explore` trước khi đọc mã lan man.

Trong những ngày đầu, nên dùng **một agent triển khai tại một thời điểm**. Khi đã quen mới chạy song song bằng Git worktree và không giao hai agent sửa cùng file.

## 3. Việc đầu tiên nên làm

Không bắt đầu bằng 3D, game hoặc animation lớn. Lát cắt đầu tiên nên là **một sự kiện đã có nguồn** đi xuyên từ model dữ liệu → timeline → bản đồ/danh sách → trang chi tiết.

### Prompt 1 — lập kế hoạch lát cắt đầu tiên

```text
Đọc AGENTS.md và docs/product/MVP-SCOPE.md. Dùng Superpowers brainstorming/spec trước khi code. Hãy đề xuất lát cắt MVP nhỏ nhất cho một sự kiện lịch sử mẫu đi từ dữ liệu tới timeline, bản đồ có fallback văn bản và trang chi tiết. Chưa dùng Supabase thật, GSAP, Three.js hay game. Nêu acceptance criteria và chờ tôi duyệt thiết kế.
```

### Prompt 2 — nghiên cứu sự kiện

```text
Use $research-history-sources để nghiên cứu một sự kiện phù hợp chương trình Lịch sử lớp 12. Chỉ dùng nguồn chính thống/học thuật, đối chiếu dữ kiện quan trọng, ghi rõ nguồn cho ngày và địa điểm, đánh dấu phần xấp xỉ hoặc còn tranh luận. Chưa viết code.
```

### Prompt 3 — triển khai sau khi duyệt

```text
Thực hiện spec đã duyệt bằng $build-map-timeline-slice. Làm theo TDD, giữ một model sự kiện dùng chung cho mọi view, bảo đảm bàn phím và fallback bản đồ. Chạy kiểm tra hẹp trong lúc làm và $verify-release-slice trước khi báo hoàn tất. Không sửa file Word hoặc phần ngoài phạm vi.
```

## 4. Khi nào thêm các công nghệ đẹp mắt

- Thêm **Motion** khi đã có component tương tác cụ thể cần chuyển trạng thái.
- Thêm **GSAP/ScrollTrigger** cho một route kể chuyện riêng sau khi nội dung tĩnh đã tốt.
- Dùng skill từ `greensock/gsap-skills` theo từng nhu cầu, không cài toàn bộ làm luật luôn bật.
- Không dùng Taste Skill như luật toàn dự án; tham khảo có chọn lọc qua `$design-history-story`.
- Chỉ thử Three.js hoặc mini-game khi MVP cốt lõi ổn định và có mục tiêu học tập đo được.

## 5. Git an toàn

Nhánh chuẩn bị hiện tại là `codex/agent-ready-foundation`. Trước commit luôn xem `git status` và stage file theo đường dẫn cụ thể. Hai file báo cáo Word là tài liệu của bạn, không được agent đưa vào commit nếu bạn chưa yêu cầu.
