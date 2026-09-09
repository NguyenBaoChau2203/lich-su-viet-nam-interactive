# Hướng dẫn làm việc với dự án

## Mục tiêu sản phẩm

Xây dựng trải nghiệm web tương tác giúp học sinh lớp 12 khám phá lịch sử Việt Nam qua dòng thời gian, bản đồ và trang chi tiết có nguồn kiểm chứng.

Phạm vi bắt buộc của phiên bản đầu:

- 25–35 sự kiện tiêu biểu.
- Dòng thời gian, bản đồ, tìm kiếm/lọc và trang chi tiết sự kiện.
- Quản trị nội dung ở mức cơ bản.
- Giao diện responsive, truy cập được bằng bàn phím và có chế độ giảm chuyển động.

Tài khoản học sinh, yêu thích, quiz, AI, 3D, scrollytelling nâng cao và game là phạm vi tùy chọn. Không thêm chúng khi chưa có yêu cầu và thiết kế riêng.

## Nguồn sự thật

Ưu tiên theo thứ tự:

1. Yêu cầu mới nhất đã được người dùng xác nhận.
2. Tài liệu phạm vi trong `docs/product/` và thiết kế đã duyệt trong `docs/superpowers/specs/`.
3. File Word báo cáo ở thư mục gốc là tài liệu học thuật gốc.
4. Mã nguồn và kiểm thử hiện hành.

Không sửa, đổi tên, di chuyển hoặc đưa file Word vào commit trừ khi người dùng yêu cầu rõ ràng. Không sửa nội dung ngoài phạm vi nhiệm vụ.

## Quy tắc lịch sử

- Không bịa ngày, địa điểm, nhân vật, trích dẫn, quan hệ hay kết luận lịch sử.
- Mỗi sự kiện phải có ít nhất một nguồn đáng tin cậy trước khi được đánh dấu đã thẩm định.
- Lưu URL/tài liệu, cơ quan hoặc tác giả, ngày truy cập và ghi chú phạm vi nguồn.
- Phân biệt `verified`, `disputed`, `approximate` và `editorial` khi dữ kiện không chắc chắn.
- Ưu tiên nguồn chính thống, tài liệu học thuật và bảo tàng/thư viện; đối chiếu nguồn khi có tranh luận.
- Nếu chưa đủ bằng chứng, hiển thị sự không chắc chắn thay vì đoán.

## Kiến trúc và mã nguồn

- Next.js App Router, React, TypeScript strict và Tailwind CSS.
- Mặc định dùng Server Component; chỉ thêm `"use client"` cho tương tác thật sự cần trình duyệt.
- Tổ chức theo lát cắt tính năng; đặt dữ liệu, kiểu, UI và test liên quan gần nhau.
- Giữ các module nhỏ, tên rõ nghĩa và API tối thiểu. Không tạo abstraction cho một trường hợp dùng duy nhất.
- URL phải lưu được trạng thái lọc/tìm kiếm có ý nghĩa để chia sẻ và quay lại.
- Không thêm dependency khi Web Platform hoặc dependency hiện có giải quyết tốt bài toán.

## Giao diện, chuyển động và hiệu năng

- Thiết kế theo nội dung lịch sử, tránh giao diện dashboard hoặc thẻ bo tròn/gradient mang tính mẫu AI.
- Bảo đảm tương phản WCAG AA, thứ tự heading hợp lý, focus rõ và thao tác bàn phím đầy đủ.
- Mobile-first; kiểm tra tối thiểu ở 320, 768, 1024 và 1440 px.
- Dùng Motion cho vi tương tác thông thường. Chỉ dùng GSAP/ScrollTrigger trong route kể chuyện đã được duyệt.
- Không dùng Motion và GSAP điều khiển cùng một thuộc tính trên cùng phần tử.
- Tôn trọng `prefers-reduced-motion`; nội dung vẫn đọc và điều hướng được khi JavaScript/animation thất bại.
- Chỉ đưa Three.js hoặc game engine vào sau khi đã chứng minh giá trị học tập và đo ngân sách hiệu năng.

## Dữ liệu và bảo mật

- Chỉ biến môi trường có tiền tố `NEXT_PUBLIC_` mới được phép vào bundle trình duyệt.
- Tuyệt đối không dùng Supabase service-role key ở client, log, test fixture hay commit.
- Mọi bảng Supabase có dữ liệu người dùng phải bật RLS và có test policy trước khi dùng.
- Xác thực và kiểm tra quyền ở server; không tin dữ liệu từ client.
- Không đọc hay in nội dung `.env`, khóa riêng tư hoặc token vào transcript nếu không thật sự cần.

## Quy trình thực hiện

1. Đọc yêu cầu, phạm vi và mã liên quan. Nếu `.codegraph/` tồn tại, dùng CodeGraph trước khi `rg` hoặc đọc lan man.
2. Với thay đổi không nhỏ, viết hoặc cập nhật spec/plan trước khi code.
3. Thực hiện theo lát cắt nhỏ có thể kiểm chứng. Dùng test đỏ → xanh → refactor cho logic/bug.
4. Chạy kiểm tra hẹp trong lúc làm, sau đó chạy `pnpm verify` trước khi tuyên bố hoàn tất.
5. Xem `git diff` và `git status`; không stage file Word, `.env`, output build hoặc thay đổi không liên quan.
6. Báo cáo file đã đổi, bằng chứng kiểm tra và việc cố ý chưa làm.

## Git và nhiều agent

- Tạo nhánh ngắn cho từng tính năng; nhánh do Codex tạo dùng tiền tố `codex/`.
- Một agent sở hữu một lát cắt tại một thời điểm. Dùng worktree riêng nếu chạy song song.
- Không để nhiều agent sửa cùng file. Agent triển khai không tự coi kết quả của mình là review độc lập.
- Commit nhỏ, một mục đích, theo dạng `feat:`, `fix:`, `test:`, `docs:` hoặc `chore:`.
- Không push, merge, tạo PR hoặc thay đổi dịch vụ bên ngoài khi người dùng chưa yêu cầu.

## Cổng chất lượng

- `pnpm lint` — ESLint.
- `pnpm typecheck` — TypeScript strict.
- `pnpm test` — unit/component tests.
- `pnpm test:e2e` — smoke test trình duyệt.
- `pnpm build` — production build.
- `pnpm agent:check` — cấu trúc agent, skill và hook.
- `pnpm verify` — cổng đầy đủ trước khi bàn giao.

Không tuyên bố “đã xong” nếu chưa có output mới nhất của lệnh chứng minh tương ứng.

<!-- CODEGRAPH_START -->
## CodeGraph

Trong repository có thư mục `.codegraph/`, dùng CodeGraph trước `rg`/`find` hoặc đọc nhiều file khi cần hiểu hay định vị mã:

- Nếu có MCP `codegraph_explore`, hỏi bằng tên symbol/file hoặc câu hỏi kiến trúc để lấy source và call path.
- Nếu không có MCP, chạy `codegraph explore "<symbol hoặc câu hỏi>"`.

Chỉ quay lại `rg` hoặc đọc file trực tiếp khi graph không chứa thông tin cần thiết.
<!-- CODEGRAPH_END -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
