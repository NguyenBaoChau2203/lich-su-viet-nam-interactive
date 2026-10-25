# PostgreSQL Local ERD Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai thật mô hình 10 bảng trong báo cáo trên Supabase PostgreSQL local, kiểm chứng cấu trúc và đưa ERD sinh từ database đang chạy vào bản Word bàn giao.

**Architecture:** Một migration bất biến tạo 10 bảng `public`, ràng buộc, chỉ mục, trigger thời gian, quyền Data API và RLS. Kiểm thử pgTAP xác nhận bảng, khóa ngoại, RLS và chính sách; Supabase local chạy trong Docker. pgAdmin 4 kết nối database local, đọc khóa ngoại để sinh ERD; ảnh ERD được chèn inline vào báo cáo và trạng thái triển khai trong báo cáo/kịch bản được cập nhật theo bằng chứng thực tế.

**Tech Stack:** Supabase CLI 2.111.0, PostgreSQL local, Docker Desktop, pgTAP, pgAdmin 4, Python `python-docx`, Microsoft Word renderer.

**Spec:** `docs/product/MVP-SCOPE.md`

## Global Constraints

- Chỉ triển khai local; không tạo hoặc thay đổi dự án Supabase production.
- Giữ đúng 10 bảng đã mô tả trong báo cáo: `admin_profiles`, `curriculum_topics`, `historical_events`, `historical_figures`, `historical_locations`, `event_figures`, `event_locations`, `sources`, `event_sources`, `media_assets`.
- Không tạo dữ kiện lịch sử giả; kiểm thử dùng dữ liệu kỹ thuật trong transaction rồi rollback.
- Bật RLS cho toàn bộ bảng trong schema `public`; khách chỉ đọc nội dung đã công bố và tài khoản quản trị `active` mới được ghi dữ liệu nội dung.
- Không đưa service-role key hoặc bí mật vào mã nguồn, log hay tài liệu bàn giao.
- Giữ nguyên file Word gốc; bản bàn giao hiện hành được sao lưu vào thư mục `work` trước khi chỉnh sửa.

---

### Task 1: Supabase PostgreSQL schema and security

**Files:**
- Create: `supabase/config.toml` bằng `supabase init`
- Create: `supabase/migrations/<timestamp>_create_history_content_schema.sql`
- Create: `supabase/tests/database/01_history_schema.test.sql`

**Interfaces:**
- Consumes: mô hình 10 bảng và ràng buộc trong báo cáo Word.
- Produces: schema PostgreSQL có thể tái tạo bằng `supabase db reset` và kiểm tra bằng `supabase test db`.

- [ ] **Step 1: Khởi tạo cấu trúc Supabase local**

```powershell
supabase init
supabase migration new create_history_content_schema
```

- [ ] **Step 2: Viết migration đầy đủ**

Migration phải tạo chính xác 10 bảng, UUID mặc định bằng `gen_random_uuid()`, khóa ngoại có hành vi xóa rõ ràng, CHECK cho thời gian/toạ độ/trạng thái, chỉ mục cho khóa ngoại và truy vấn công bố, partial UNIQUE để mỗi sự kiện chỉ có một địa điểm chính, trigger `updated_at`, GRANT tối thiểu và RLS theo vai trò.

- [ ] **Step 3: Viết kiểm thử pgTAP**

Kiểm thử phải xác nhận: đủ 10 bảng; đủ 10 khóa ngoại; RLS bật trên 10 bảng; khóa UNIQUE/PRIMARY/CHECK quan trọng tồn tại; ba bảng liên kết có khóa chính ghép; chính sách đọc công khai và ghi của quản trị viên tồn tại.

### Task 2: Run and verify the local database

**Files:**
- Create: `outputs/nop_thay_2026-09-10/work/database-verification.txt`

**Interfaces:**
- Consumes: migration và pgTAP từ Task 1.
- Produces: PostgreSQL local đã áp dụng migration cùng kết quả kiểm tra có thể đối chiếu.

- [ ] **Step 1: Khởi động Docker Desktop và Supabase local**

```powershell
supabase db start
```

- [ ] **Step 2: Chạy lại database từ migration và chạy pgTAP**

```powershell
supabase db reset --local
supabase test db --local supabase/tests/database
```

- [ ] **Step 3: Xuất bằng chứng schema**

Chạy truy vấn `information_schema.tables`, `pg_constraint`, `pg_policies` và `pg_class.relrowsecurity`; lưu kết quả gồm phiên bản PostgreSQL, 10 bảng, danh sách khóa ngoại và trạng thái RLS vào file bằng chứng.

### Task 3: Generate an ERD from the running database

**Files:**
- Create: `outputs/nop_thay_2026-09-10/work/pgadmin-erd.png`

**Interfaces:**
- Consumes: PostgreSQL local đã chạy và các Foreign Key thật.
- Produces: ảnh ERD được pgAdmin 4 sinh từ database/schema đang tồn tại.

- [ ] **Step 1: Chạy pgAdmin 4 local**

Chạy pgAdmin 4 ở chế độ local/web và chỉ bind vào localhost. Đăng ký kết nối bằng thông tin do `supabase status` cung cấp; không ghi mật khẩu vào repository.

- [ ] **Step 2: Sinh ERD từ schema `public`**

Trong pgAdmin chọn database local, mở `ERD For Database` hoặc `ERD For Schema`, auto-align, hiển thị chi tiết cột và xuất ảnh PNG bằng `Download image`.

- [ ] **Step 3: Đối chiếu ERD**

Ảnh phải có đủ 10 bảng và các đường nối phải xuất phát từ Foreign Key thật; không chấp nhận đường nối vẽ tay.

### Task 4: Update and verify the Word deliverables

**Files:**
- Modify: `outputs/nop_thay_2026-09-10/Bao_cao_nop_thay_den_co_so_du_lieu.docx`
- Modify: `outputs/nop_thay_2026-09-10/Kich_ban_trinh_bay_co_so_du_lieu.docx`
- Create: `outputs/nop_thay_2026-09-10/work/update_postgresql_evidence.py`

**Interfaces:**
- Consumes: ảnh ERD và bằng chứng kiểm thử database.
- Produces: báo cáo/kịch bản không còn nói database chỉ là thiết kế chưa triển khai.

- [ ] **Step 1: Sao lưu và thay ERD trong báo cáo**

Sao lưu hai DOCX vào `work`, thay hình ERD cũ bằng ảnh pgAdmin dạng inline, giữ ảnh và chú thích cùng nhau, và đổi chú thích thành `Hình 2.1. Sơ đồ quan hệ được sinh từ cơ sở dữ liệu PostgreSQL thử nghiệm bằng pgAdmin 4.`

- [ ] **Step 2: Cập nhật trạng thái triển khai**

Ghi rõ database đã được tạo và kiểm thử ở môi trường Supabase local; không tuyên bố đã triển khai production. Cập nhật kịch bản và phần hỏi đáp để câu trả lời thống nhất với trạng thái mới.

- [ ] **Step 3: Cập nhật field và render kiểm tra**

```powershell
python render_docx.py outputs/nop_thay_2026-09-10/Bao_cao_nop_thay_den_co_so_du_lieu.docx --output_dir outputs/nop_thay_2026-09-10/work/report-postgresql-render
python render_docx.py outputs/nop_thay_2026-09-10/Kich_ban_trinh_bay_co_so_du_lieu.docx --output_dir outputs/nop_thay_2026-09-10/work/script-postgresql-render
```

Kiểm tra trực quan toàn bộ trang, đặc biệt trang ERD, chú thích, mục lục và phần trạng thái triển khai; chạy `pnpm verify` trước khi bàn giao.
