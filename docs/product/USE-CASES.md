# Actor và đặc tả use case cho MVP lịch sử Việt Nam lớp 12

**Trạng thái:** Bản đặc tả trước triển khai, cập nhật ngày 22/09/2026. Bốn vai trò ở mục 1 đã được chủ dự án xác nhận. Những quyết định còn mở nằm ở mục 5.

## 1. Phạm vi và actor

MVP là website cho học sinh lớp 12 và người muốn ôn tập lịch sử Việt Nam. Dữ liệu mục tiêu gồm 25–35 sự kiện đã biên tập, có nguồn kiểm chứng. Trải nghiệm công khai gồm trang chủ, dòng thời gian, bản đồ kèm danh sách văn bản, tra cứu và nội dung chi tiết. Nhân sự quản trị nội dung cần đăng nhập; người dùng công khai không cần tài khoản.

| Actor | Mục tiêu và quyền trong MVP |
| --- | --- |
| **Người dùng** | Xem nội dung đã công bố, khám phá theo thời gian và địa điểm, tìm kiếm, đọc chi tiết và nguồn. Bao gồm học sinh lớp 12, giáo viên hoặc người tra cứu; đây là một actor vì cùng quyền và luồng sử dụng. |
| **Biên tập viên** (`editor`) | Tạo và sửa bản nháp chủ đề, sự kiện, nhân vật, địa điểm, nguồn và media; gửi nội dung chờ kiểm duyệt. Không tự công bố. |
| **Kiểm duyệt viên** (`reviewer`) | Đọc bản nháp, đối chiếu nguồn, yêu cầu sửa, công bố hoặc ẩn nội dung. |
| **Admin quản trị hệ thống** (`system_admin`) | Quản lý hồ sơ/vai trò nhân sự và xử lý quản trị nội dung khi cần. |

Ba vai trò nhân sự là các chuyên biệt của actor **nhân sự đã đăng nhập**. Supabase Auth là hệ thống hỗ trợ xác thực, còn nhà cung cấp tile bản đồ là dịch vụ phụ trợ; chúng không phải người dùng sản phẩm. Không có actor tài khoản học sinh, người chơi quiz hoặc trợ lý AI trong MVP.

**Quy tắc quyền chung:** một tài khoản nhân sự chỉ được thao tác khi `staff_profiles.account_status = active`. Khách chỉ đọc nội dung có `workflow_status = published` và các liên kết được phép công khai. Quyền cần kiểm tra ở server và RLS; việc ẩn nút trên giao diện không đủ để cấp hoặc từ chối quyền. `system_admin` được phép thực hiện thao tác của biên tập viên và kiểm duyệt viên theo migration hiện có.

## 2. Danh mục use case

Các mã UC01–UC09 giữ nguyên từ Chương 2 của báo cáo Word. Các mã có hậu tố hoặc từ UC10 trở đi bổ sung những luồng mà báo cáo có nhắc tới hoặc mô hình bốn vai trò hiện tại cần đến.

| Mã | Use case | Actor chính | Mức độ |
| --- | --- | --- | --- |
| UC00 | Xem trang chủ và chọn lối khám phá | Người dùng | MVP, bổ sung cho báo cáo |
| UC01 | Xem dòng thời gian | Người dùng | MVP, mã gốc |
| UC02 | Khám phá bản đồ | Người dùng | MVP, mã gốc |
| UC03 | Tra cứu và lọc | Người dùng | MVP, mã gốc |
| UC04 | Xem chi tiết sự kiện | Người dùng | MVP, mã gốc |
| UC04a | Xem chi tiết nhân vật hoặc địa điểm | Người dùng | Cần chốt hình thức hiển thị |
| UC05 | Đăng nhập khu vực quản trị | Ba vai trò nhân sự | MVP, mã gốc |
| UC05a | Đăng xuất | Ba vai trò nhân sự | MVP, bổ sung cho báo cáo |
| UC06 | Quản lý chủ đề lớp 12 | Biên tập viên; kiểm duyệt viên; admin | MVP, mã gốc |
| UC07 | Quản lý sự kiện và các liên kết | Biên tập viên; kiểm duyệt viên; admin | MVP, mã gốc |
| UC08 | Quản lý nhân vật và địa điểm | Biên tập viên; kiểm duyệt viên; admin | MVP, mã gốc |
| UC09 | Quản lý nguồn tư liệu và media | Biên tập viên; kiểm duyệt viên; admin | MVP, mã gốc |
| UC10 | Kiểm duyệt, công bố hoặc ẩn nội dung | Kiểm duyệt viên; admin | MVP, bổ sung theo vai trò mới |
| UC11 | Quản lý hồ sơ và vai trò nhân sự | Admin | Cần chốt giao diện MVP |

UC06–UC09 bao gồm thao tác tạo/sửa dữ liệu theo quyền. Quyết định công bố hoặc ẩn được đặc tả riêng ở UC10 để phân biệt rõ trách nhiệm biên tập và kiểm duyệt. UC11 chỉ quản lý hồ sơ của tài khoản đã tồn tại trong Supabase Auth cho đến khi quy trình cấp tài khoản được xác nhận.

## 3. Quy tắc nghiệp vụ dùng chung

1. **Công bố:** Sự kiện công khai phải có các trường bắt buộc, chủ đề hợp lệ, ít nhất một nguồn truy vết được và nội dung được kiểm duyệt. Liên kết tới nhân vật/địa điểm phải hợp lệ. Quy tắc này cần được kiểm tra trong thao tác công bố ở server/database và bằng kiểm thử, vì schema hiện có chưa chứng minh đầy đủ điều kiện này.
2. **Nguồn và độ chắc chắn:** Lưu tiêu đề, tác giả/cơ quan, URL hoặc tài liệu, ngày truy cập khi thích hợp và ghi chú nguồn. Phân biệt trạng thái biên tập (`draft`, `pending_review`, `needs_revision`, `published`, `hidden`) với mức độ chắc chắn của dữ kiện (`verified`, `approximate`, `disputed`, `editorial`). Không suy ra ngày hay tọa độ chính xác từ một giá trị ước lượng.
3. **Tính nhất quán:** Dòng thời gian, bản đồ, tìm kiếm và trang chi tiết đọc từ cùng tập sự kiện đã công bố. Sự kiện bị ẩn không còn xuất hiện trong các luồng công khai; URL chi tiết cũ trả trạng thái không khả dụng/404.
4. **Điều hướng:** Bộ lọc và từ khóa có ý nghĩa nằm trong URL để có thể chia sẻ, tải lại và quay lại bằng lịch sử trình duyệt.
5. **Khả năng truy cập và thiết bị:** Mọi luồng chính dùng được bằng chuột/trackpad và bàn phím tại viewport laptop/PC 1280×720, 1366×768, 1440×900 và 1920×1080 theo [phạm vi thiết bị hiện tại](DESKTOP-UI-SCOPE.md), có focus rõ và tôn trọng `prefers-reduced-motion`. Mobile/tablet được hoãn. Danh sách văn bản của bản đồ vẫn dùng được khi tile hoặc JavaScript bản đồ lỗi.
6. **Bảo mật:** Không đưa service-role key vào trình duyệt. Các thao tác ghi phải xác thực và kiểm tra vai trò ở server, đồng thời có RLS bảo vệ ở database.

## 4. Đặc tả use case

### UC00 — Xem trang chủ và chọn lối khám phá

- **Mục tiêu:** Người dùng hiểu phạm vi lịch sử lớp 12 và đi vào dòng thời gian, bản đồ hoặc tra cứu.
- **Kích hoạt/tiền điều kiện:** Mở trang chủ; không cần đăng nhập hoặc dữ liệu sẵn có.
- **Luồng chính:** (1) Hệ thống hiển thị giới thiệu và các lối điều hướng. (2) Nếu có dữ liệu đã công bố, hiển thị chủ đề/sự kiện nổi bật phù hợp. (3) Người dùng chọn một lối khám phá. (4) Hệ thống mở màn hình tương ứng.
- **Ngoại lệ:** Chưa có nội dung công bố thì trang chủ vẫn hiển thị và giải thích trạng thái trống; không trình bày dữ liệu minh họa như dữ kiện đã kiểm chứng.
- **Hậu điều kiện/kiểm chứng:** Người dùng đi tới UC01, UC02, UC03 hoặc UC04 bằng bàn phím hoặc chuột/trackpad; các liên kết hoạt động trong phạm vi laptop/PC hiện tại.

### UC01 — Xem dòng thời gian

- **Mục tiêu:** Khám phá sự kiện theo thứ tự thời gian, giai đoạn và chủ đề.
- **Kích hoạt/tiền điều kiện:** Mở trang dòng thời gian; không cần đăng nhập.
- **Luồng chính:** (1) Hệ thống lấy sự kiện và chủ đề đã công bố. (2) Sắp xếp theo `start_year`, dùng `start_date` khi có căn cứ. (3) Hiển thị `date_text` và `date_precision` đúng mức chắc chắn. (4) Người dùng lọc giai đoạn/chủ đề. (5) URL và danh sách mốc cập nhật. (6) Chọn mốc để mở UC04.
- **Ngoại lệ:** Không có kết quả thì nêu điều kiện lọc hiện tại và cho phép xóa lọc. Mốc xấp xỉ/tranh luận không được hiển thị thành ngày chính xác giả. Lỗi tải dữ liệu có trạng thái thử lại.
- **Hậu điều kiện/kiểm chứng:** Cùng URL cho cùng tập lọc; thứ tự thời gian ổn định; không lộ sự kiện nháp/ẩn.

### UC02 — Khám phá bản đồ

- **Mục tiêu:** Liên hệ sự kiện với địa điểm có căn cứ vị trí.
- **Kích hoạt/tiền điều kiện:** Mở trang bản đồ; không cần đăng nhập.
- **Luồng chính:** (1) Hệ thống lấy sự kiện, địa điểm và liên kết công khai. (2) Hiển thị marker cho địa điểm có cặp tọa độ hợp lệ. (3) Đồng thời hiển thị danh sách văn bản địa điểm/sự kiện. (4) Người dùng chọn marker hoặc mục danh sách. (5) Hệ thống hiển thị tóm tắt, mức chính xác vị trí và liên kết tới UC04.
- **Ngoại lệ:** Tile không tải hoặc tương tác bản đồ lỗi thì danh sách văn bản vẫn điều hướng được. Địa điểm thiếu tọa độ không có marker giả nhưng vẫn có thể xuất hiện trong danh sách với giải thích phù hợp. Vị trí ước lượng hiển thị `accuracy_level`/`accuracy_note`.
- **Hậu điều kiện/kiểm chứng:** Người dùng có thể đến cùng một sự kiện bằng bản đồ hoặc danh sách; không lộ liên kết nháp/ẩn.

### UC03 — Tra cứu và lọc

- **Mục tiêu:** Tìm sự kiện, nhân vật hoặc địa điểm đã công bố.
- **Kích hoạt/tiền điều kiện:** Mở trang tra cứu hoặc nhập từ khóa từ điểm vào công khai.
- **Luồng chính:** (1) Người dùng nhập từ khóa và chọn giai đoạn/chủ đề/loại nội dung nếu cần. (2) Hệ thống chuẩn hóa và ghi điều kiện vào URL. (3) Truy vấn nội dung công khai phù hợp. (4) Hiển thị kết quả với loại nội dung và ngữ cảnh rõ ràng. (5) Người dùng mở kết quả tương ứng.
- **Ngoại lệ:** Từ khóa rỗng thì hiển thị kết quả theo bộ lọc hoặc hướng dẫn tìm kiếm. Không có kết quả thì cho phép xóa/sửa điều kiện. Tham số URL sai được chuẩn hóa về giá trị hợp lệ.
- **Hậu điều kiện/kiểm chứng:** Tải lại URL giữ điều kiện tra cứu; kết quả không chứa dữ liệu nháp/ẩn; kết quả nhân vật/địa điểm có đích đến xác định theo quyết định ở mục 5.

### UC04 — Xem chi tiết sự kiện

- **Mục tiêu:** Đọc nội dung sự kiện, mốc thời gian, nhân vật, địa điểm, media và nguồn tham khảo.
- **Kích hoạt/tiền điều kiện:** Mở URL sự kiện đã công bố qua timeline, bản đồ, tìm kiếm hoặc liên kết trực tiếp.
- **Luồng chính:** (1) Hệ thống tìm sự kiện theo slug. (2) Kiểm tra trạng thái công bố và lấy các liên kết được phép công khai. (3) Hiển thị nội dung, ghi chú độ chắc chắn của thời gian/địa điểm, nhân vật/địa điểm liên quan và nguồn. (4) Người dùng mở nguồn hoặc nội dung liên quan.
- **Ngoại lệ:** Slug không tồn tại hoặc nội dung đã ẩn trả 404/không khả dụng. Thiếu media hoặc tọa độ vẫn hiển thị nội dung văn bản. Nguồn không truy cập được thì giữ thông tin trích dẫn và không tự tạo nội dung thay thế.
- **Hậu điều kiện/kiểm chứng:** Sự kiện có ít nhất một nguồn truy vết và ghi chú cho dữ kiện còn tranh luận; không hiển thị độ chính xác cao hơn chứng cứ; URL trực tiếp dùng được.

### UC04a — Xem chi tiết nhân vật hoặc địa điểm

- **Mục tiêu:** Cho kết quả tra cứu nhân vật/địa điểm một đích đọc hữu ích.
- **Kích hoạt/tiền điều kiện:** Chọn nhân vật/địa điểm đã công bố trong UC03 hoặc UC04.
- **Luồng chính đề xuất:** (1) Hệ thống mở trang hoặc phần chi tiết tương ứng. (2) Hiển thị thông tin đã công bố, độ chắc chắn vị trí nếu là địa điểm và các sự kiện công khai liên quan. (3) Người dùng mở UC04.
- **Ngoại lệ:** Nội dung đã ẩn hoặc không tồn tại trả 404/không khả dụng; không có sự kiện liên quan thì vẫn hiển thị thông tin đã xác thực.
- **Hậu điều kiện/kiểm chứng:** Người dùng không gặp kết quả tìm kiếm không có đích đến. Hình thức trang riêng hay phần chi tiết cần chốt ở mục 5.

### UC05 — Đăng nhập khu vực quản trị

- **Mục tiêu:** Tạo phiên hợp lệ cho một trong ba vai trò nhân sự.
- **Kích hoạt/tiền điều kiện:** Nhân sự đã có tài khoản Supabase Auth và `staff_profiles` hợp lệ.
- **Luồng chính:** (1) Mở trang đăng nhập. (2) Nhập thông tin xác thực. (3) Supabase Auth xác thực. (4) Server kiểm tra hồ sơ, `account_status = active` và vai trò. (5) Chuyển đến khu vực quản trị phù hợp.
- **Ngoại lệ:** Sai thông tin, không có hồ sơ, tài khoản bị khóa hoặc phiên hết hạn đều từ chối truy cập và báo lỗi phù hợp, không tiết lộ thông tin nhạy cảm. Truy cập URL quản trị trực tiếp cũng phải kiểm tra quyền.
- **Hậu điều kiện/kiểm chứng:** Chỉ nhân sự active được vào; quyền của phiên khớp vai trò trong database.

### UC05a — Đăng xuất

- **Mục tiêu:** Kết thúc phiên quản trị.
- **Kích hoạt/tiền điều kiện:** Nhân sự đã đăng nhập chọn đăng xuất.
- **Luồng chính:** (1) Hệ thống kết thúc phiên. (2) Chuyển về trang công khai hoặc đăng nhập. (3) Các trang và thao tác quản trị tiếp theo yêu cầu đăng nhập lại.
- **Ngoại lệ:** Nếu phiên đã hết hạn, xóa trạng thái giao diện còn sót và chuyển về đăng nhập.
- **Hậu điều kiện/kiểm chứng:** Dùng nút Back hoặc URL cũ không thể đọc nháp hay thực hiện thao tác ghi.

### UC06 — Quản lý chủ đề lớp 12

- **Mục tiêu:** Duy trì các chủ đề phân nhóm sự kiện.
- **Kích hoạt/tiền điều kiện:** Biên tập viên, kiểm duyệt viên hoặc admin active vào khu quản trị; quyền thao tác tuân theo vai trò.
- **Luồng chính:** (1) Xem danh sách và trạng thái chủ đề. (2) Biên tập viên/admin tạo hoặc sửa tên, slug, mô tả, thứ tự ở trạng thái được phép. (3) Hệ thống kiểm tra dữ liệu và lưu. (4) Biên tập viên gửi kiểm duyệt khi hoàn tất; kiểm duyệt viên xử lý qua UC10.
- **Ngoại lệ:** Tên/slug trùng hoặc thiếu dữ liệu bị từ chối. Chủ đề đang có sự kiện được ẩn theo quy trình thay vì xóa tùy tiện. Không đủ quyền thì server/RLS từ chối.
- **Hậu điều kiện/kiểm chứng:** Chủ đề lưu đúng ràng buộc; người dùng chỉ thấy chủ đề đã công bố.

### UC07 — Quản lý sự kiện và các liên kết

- **Mục tiêu:** Tạo và cập nhật sự kiện cùng nhân vật, địa điểm, nguồn và media liên quan.
- **Kích hoạt/tiền điều kiện:** Nhân sự active; chủ đề tham chiếu tồn tại. Biên tập viên tạo/sửa ở trạng thái được phép; admin có quyền xử lý quản trị.
- **Luồng chính:** (1) Mở danh sách hoặc form sự kiện. (2) Nhập tiêu đề, slug, nội dung, mốc thời gian và mức chính xác. (3) Chọn chủ đề và liên kết nhân vật/địa điểm/nguồn. (4) Hệ thống kiểm tra dữ liệu. (5) Lưu bản nháp và các liên kết nhất quán. (6) Gửi chờ kiểm duyệt khi hoàn tất.
- **Ngoại lệ:** Slug trùng, ngày không hợp lệ, tham chiếu sai hoặc thiếu nguồn khi gửi/công bố đều báo lỗi. Nếu một thao tác nhiều bảng thất bại, không để bản ghi và liên kết ở trạng thái nửa chừng. Nhân sự hết phiên hoặc không đủ quyền bị từ chối.
- **Hậu điều kiện/kiểm chứng:** Bản nháp lưu được nhưng không công khai; sự kiện chỉ xuất hiện trong UC01–UC04 sau UC10 thành công.

### UC08 — Quản lý nhân vật và địa điểm

- **Mục tiêu:** Duy trì thông tin nhân vật/địa điểm để liên kết với sự kiện.
- **Kích hoạt/tiền điều kiện:** Nhân sự active với quyền phù hợp.
- **Luồng chính:** (1) Chọn nhân vật hoặc địa điểm. (2) Tạo/sửa thông tin và nguồn liên quan theo quy trình biên tập. (3) Với địa điểm, nhập cặp tọa độ khi có căn cứ, `accuracy_level` và ghi chú. (4) Kiểm tra và lưu. (5) Gửi kiểm duyệt khi hoàn tất.
- **Ngoại lệ:** Một tọa độ thiếu cặp, vượt miền hợp lệ hoặc tạo mức chính xác sai bị từ chối. Bản ghi đang được tham chiếu không bị xóa cứng tùy tiện. Không đủ quyền thì từ chối.
- **Hậu điều kiện/kiểm chứng:** Liên kết còn toàn vẹn; dữ liệu chưa công bố không rò ra luồng công khai.

### UC09 — Quản lý nguồn tư liệu và media

- **Mục tiêu:** Ghi xuất xứ dữ kiện và quản lý tài nguyên minh họa.
- **Kích hoạt/tiền điều kiện:** Nhân sự active; sự kiện liên quan tồn tại khi gắn media.
- **Luồng chính:** (1) Tạo/sửa nguồn gồm tiêu đề, cơ quan/tác giả, trích dẫn, URL hoặc tài liệu, ngày truy cập và ghi chú phạm vi. (2) Liên kết nguồn với sự kiện, ghi chú dữ kiện được nguồn hỗ trợ. (3) Thêm metadata media, chú thích, văn bản thay thế và nguồn sở hữu nếu có. (4) Kiểm tra và lưu.
- **Ngoại lệ:** URL/metadata không hợp lệ bị từ chối. Nguồn đang được dùng không bị xóa làm mất xuất xứ của sự kiện đã công bố. Thiếu media không cản trở trang chi tiết văn bản.
- **Hậu điều kiện/kiểm chứng:** Sự kiện công bố có thể truy vết nguồn; media hiển thị có mô tả phù hợp và xuất xứ khi cần.

### UC10 — Kiểm duyệt, công bố hoặc ẩn nội dung

- **Mục tiêu:** Chỉ đưa nội dung đủ điều kiện đến người dùng công khai.
- **Kích hoạt/tiền điều kiện:** Kiểm duyệt viên hoặc admin active mở nội dung `pending_review` hoặc nội dung đã công bố cần ẩn.
- **Luồng chính:** (1) Xem nội dung, nguồn, liên kết và ghi chú mức chắc chắn. (2) Chọn yêu cầu chỉnh sửa hoặc công bố. (3) Nếu yêu cầu sửa, lưu lý do và chuyển `needs_revision`. (4) Nếu công bố, hệ thống kiểm tra điều kiện công bố chung và chuyển `published`. (5) Nếu cần ngừng hiển thị, chuyển `hidden`.
- **Ngoại lệ:** Thiếu nguồn, chủ đề/quan hệ chưa hợp lệ, dữ kiện chưa được thẩm định hoặc vai trò không đủ quyền thì không công bố. Nếu lưu thất bại, trạng thái công khai không được thay đổi một phần.
- **Hậu điều kiện/kiểm chứng:** Nội dung `published` xuất hiện nhất quán ở mọi màn hình; `hidden` biến mất khỏi các luồng công khai; biên tập viên không thể tự công bố.

### UC11 — Quản lý hồ sơ và vai trò nhân sự

- **Mục tiêu:** Admin cấp vai trò ứng dụng hoặc khóa quyền của tài khoản nhân sự đã tồn tại.
- **Kích hoạt/tiền điều kiện:** `system_admin` active; tài khoản đích đã tồn tại trong Supabase Auth.
- **Luồng chính đề xuất:** (1) Mở danh sách hồ sơ nhân sự. (2) Chọn tài khoản. (3) Gán `editor`, `reviewer` hoặc `system_admin`, hoặc đổi `account_status`. (4) Server kiểm tra quyền và lưu. (5) Phiên của tài khoản bị khóa không còn được phép truy cập quản trị.
- **Ngoại lệ:** Actor khác admin bị từ chối. Không cho thao tác khiến hệ thống không còn admin active nếu đây là phương thức quản trị nhân sự duy nhất.
- **Hậu điều kiện/kiểm chứng:** Quyền thực tế do hồ sơ và RLS quyết định; quy trình tạo tài khoản Auth mới còn cần quyết định ở mục 5.

## 5. Những điểm cần chốt trước khi code giao diện nghiệp vụ

1. **Chi tiết nhân vật/địa điểm:** Báo cáo mô tả tra cứu cả ba loại nội dung nhưng chỉ đặc tả trang chi tiết sự kiện. Chọn trang riêng cho nhân vật và địa điểm, hoặc trang sự kiện liên quan kèm phần thông tin. Quyết định này xác định đích đến của UC03/UC04a.
2. **Quản lý nhân sự:** Migration có `staff_profiles` và chính sách cho `system_admin`, nhưng phạm vi sản phẩm chỉ ghi quản trị nội dung cơ bản. Chốt UC11 có giao diện MVP hay admin cập nhật hồ sơ bằng quy trình nội bộ trong giai đoạn đầu.
3. **Giai đoạn lịch sử:** Phạm vi yêu cầu lọc theo giai đoạn nhưng schema hiện lưu năm và chủ đề, chưa có danh mục giai đoạn/ranh giới niên đại được duyệt. Cần định nghĩa các giai đoạn trước khi xây bộ lọc.
4. **Mức độ chắc chắn của dữ kiện:** `date_precision` và `accuracy_level` đã có, nhưng schema chưa lưu trực tiếp đủ bốn nhãn `verified`, `approximate`, `disputed`, `editorial` cho từng nhận định/sự kiện. Cần chốt cách lưu và hiển thị trước khi nhập 25–35 sự kiện.
5. **Điều kiện công bố:** Cần chốt trường bắt buộc, yêu cầu nguồn đối với nhân vật/địa điểm và cơ chế kiểm tra công bố ở server/database. Migration hiện có phân quyền trạng thái nhưng chưa thay thế bước thẩm định nội dung.
6. **Hồ sơ kiểm duyệt:** UC10 cần lưu lý do yêu cầu sửa và có thể cần biết ai duyệt, lúc nào; schema hiện chưa có các trường này. Cần quyết định dữ liệu tối thiểu trước khi làm form kiểm duyệt.
7. **Danh mục nội dung:** Chưa có danh sách 25–35 sự kiện đã chốt cùng nguồn cho từng sự kiện. Danh sách này cần được biên tập và kiểm chứng trước khi nạp dữ liệu sản phẩm.

## 6. Nguồn đối chiếu và trạng thái hiện thực

- `AGENTS.md` và `docs/product/MVP-SCOPE.md`: phạm vi MVP, tiêu chí dữ liệu, khả năng truy cập và kiểm chứng.
- `Bao_cao_do_an_lich_su_lop_12_da_chinh_sua.docx`, Chương 1 mục 1.6 và Chương 2 mục 2.1–2.2: hai nhóm actor trong báo cáo, 9 use case gốc và luồng nghiệp vụ.
- `supabase/migrations/20260911163308_add_staff_workflow_and_postgis.sql`: ba vai trò nhân sự, `staff_profiles`, các trạng thái biên tập và RLS hiện có. Migration này là công việc local trong cây làm việc hiện tại, chưa phải bằng chứng đã có giao diện quản trị hay dữ liệu sản phẩm.
- `src/app/page.tsx`: hiện mới là trang giới thiệu MVP. Các màn hình nghiệp vụ trong tài liệu này là đặc tả để triển khai, chưa được tuyên bố đã hoạt động.

Tài liệu này không thay đổi báo cáo Word gốc. Khi chốt các quyết định ở mục 5, cập nhật đặc tả và báo cáo để bốn vai trò, mã use case và mô hình dữ liệu nhất quán trước khi triển khai.
