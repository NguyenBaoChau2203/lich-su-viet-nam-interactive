# Kiểm tra kho lịch sử và tính năng website — 2026-09-25

## Phạm vi kiểm tra

Đợt kiểm tra này đánh giá bốn lớp: dữ liệu lịch sử, nguồn và quyền media, hành vi giao diện công khai, cùng mức sẵn sàng của luồng quản trị. Kiểm tra không tự sửa nội dung lịch sử vì mỗi thay đổi cần được đối chiếu nguồn.

## Kết luận

Mã nguồn đang build và test thành công, nhưng kho nội dung chưa đủ điều kiện để công bố với nhãn **“đã thẩm định”**. Cổng kiểm tra hiện tại chủ yếu xác nhận cấu trúc JSON và liên kết ID; nó chưa chứng minh URL đúng nội dung, media đúng sự kiện, giấy phép đúng hoặc người duyệt có thật.

Quyết định phát hành:

- Giữ website ở trạng thái bản xem trước trong lúc làm sạch dữ liệu.
- Hạ toàn bộ 32 sự kiện về `needs_evidence` cho đến khi được thẩm tra lại.
- Không hiển thị hai video hiện tại như video của Điện Biên Phủ hoặc Đại thắng mùa Xuân 1975.
- Không hiển thị lời kể ngôi thứ nhất như lời chứng lịch sử nếu thiếu nguồn định vị được.
- Hoàn thiện một lát cắt chuẩn trước, sau đó xử lý các sự kiện còn lại theo lô nhỏ.

## 1. Kiểm kê dữ liệu

| Loại dữ liệu | Số lượng | Ghi chú |
| --- | ---: | --- |
| Sự kiện | 32 | Tất cả đang bị gắn `published` |
| Mốc năm khác nhau | 17 | Từ 1945 đến 1975; 6 sự kiện cùng thuộc năm 1975 |
| Claim | 65 | Có liên kết ID nguồn nhưng chưa bảo đảm nguồn hỗ trợ claim |
| Nguồn | 64 | Nhiều URL sai nội dung, hỏng hoặc không xác minh được |
| Media | 34 | 31 ảnh, 2 video, 1 audio |
| Chuyện bên lề | 13 | Cả 13 thiếu `sourceId` định vị được |
| Review | 32 | Tất cả cùng ngày 2026-09-24; danh tính/quy trình duyệt không có bằng chứng |
| Địa điểm | 17 | Nguồn tọa độ chỉ là chuỗi chung, chưa truy vết tới URL/tài liệu |

## 2. Phát hiện nghiêm trọng về nguồn

### 2.1 URL nguồn lịch sử

Đã kiểm tra tự động cả trạng thái HTTP, URL sau chuyển hướng và tiêu đề trang. **Tối thiểu 48/64 nguồn không vượt qua cổng công bố** vì URL hỏng, chuyển về trang chủ hoặc mở nội dung không liên quan tới tiêu đề đã khai báo.

Các nhóm lỗi nổi bật:

- 30/31 URL của Bảo tàng Lịch sử Quốc gia không khớp hoặc không chứng minh được mô tả đã ghi. Chỉ nguồn `src-1945-baotang` khớp rõ ràng trong đợt kiểm tra.
- 5 URL lưu trữ chuyển về trang chủ; chỉ `src-1945-luutru` khớp rõ ràng.
- 5 URL nguồn Đảng trả về 404.
- 4/5 URL Báo Nhân Dân mở bài không liên quan; một URL về Toàn quốc kháng chiến có liên quan.
- 2 URL Bộ Ngoại giao, 1 URL Chính phủ và 1 URL Mặt trận trả về 404.
- Nhóm URL QĐND/Đoàn gặp lỗi truy cập trong đợt kiểm tra; trạng thái này phải là `unverified`, không được suy ra là hợp lệ.

Ví dụ sai lệch:

- URL được ghi cho “Hiệp định Sơ bộ 6/3/1946” mở bài về bảo tàng kỷ vật chiến tranh của một cựu chiến binh.
- URL được ghi cho “Lời kêu gọi toàn quốc kháng chiến” mở bài về kiến trúc cổ đại Trung Hoa.
- URL được ghi cho Đồng Khởi mở bài về COVID-19.
- URL được ghi cho Vạn Tường mở bài về thiếu giáo viên.

### 2.2 Review và trạng thái công bố

- 32/32 sự kiện có review cùng ngày 2026-09-24 nhưng không có tài khoản, dấu vết thao tác hoặc bằng chứng người duyệt.
- Một review ghi “GS. Phan Huy Lê chủ trì phản biện” vào năm 2026. GS. Phan Huy Lê đã qua đời năm 2018 theo thông tin của Trường Đại học Khoa học Xã hội và Nhân văn, ĐHQGHN; bản ghi này không thể là review thật.
- Trạng thái `published` hiện chỉ vượt qua validator cấu trúc. Nó không tương đương với thẩm định sử liệu.

Hành động bắt buộc: xóa/đánh dấu vô hiệu các review giả lập và chỉ cho phép `published` sau một quyết định duyệt có tài khoản thật, thời gian thật và tập claim/media đã khóa phiên bản.

## 3. Phát hiện nghiêm trọng về media

### 3.1 Video

Hai bản ghi video dùng cùng YouTube ID `UIutoCqw01Y`. Metadata oEmbed của YouTube xác định đây là video **“Cuộc đời và sự nghiệp cách mạng của Chủ tịch Hồ Chí Minh”** do **Hội Liên hiệp Phụ nữ Thành phố Hồ Chí Minh** đăng tải.

Video này đang bị gắn nhầm thành:

- phim tư liệu Chiến dịch Điện Biên Phủ;
- phim tư liệu Đại thắng mùa Xuân 1975.

Đây là lỗi nội dung nhìn thấy trực tiếp ở trang chủ và trang câu chuyện. Phải gỡ hai liên kết khỏi các sự kiện đó trước khi tiếp tục phát triển trải nghiệm video.

### 3.2 Ảnh Wikimedia Commons

31 trang tệp Commons tồn tại, nhưng nhiều mô tả, năm, tác giả, cơ quan lưu giữ hoặc giấy phép trong JSON không khớp metadata gốc. Một số ví dụ:

| Media ID | Website đang mô tả | Nội dung tệp thực tế |
| --- | --- | --- |
| `media-1960-dkbt` | “Đội quân tóc dài” | Ảnh Nhà truyền thống Đồng Khởi chụp năm 2011 |
| `media-1972-tcqt` | “Nụ cười chiến thắng” | Ảnh Thành cổ Quảng Trị chụp năm 2012 |
| `media-1975-buonmathuot` | Xe tăng tiến vào Buôn Ma Thuột | Ảnh Bảo tàng Chiến dịch Hồ Chí Minh chụp năm 2012 |
| `media-1975-danang` | Quân giải phóng Đà Nẵng năm 1975 | Ảnh tàu LST của Hoa Kỳ tại Đà Nẵng năm 1967 |
| `media-1975-dinhtongthong` | Xe tăng 390 tại cổng Dinh | Ảnh Dinh Độc Lập hiện đại chụp năm 2013 |

Giao diện hiện gắn mọi ảnh là **“ẢNH TƯ LIỆU GỐC”**. Nhãn này sai với ảnh hiện vật, công trình chụp lại, bản đồ hoặc ảnh địa điểm hiện đại. Cần lưu `mediaKind`, `depictedAt`, `capturedAt`, `isContemporaryToEvent` và render nhãn trung thực theo dữ liệu.

### 3.3 Chuyện bên lề, audio và transcript

- 13 chuyện bên lề dùng giọng kể nhân chứng nhưng không có `sourceId`, trang, timecode hoặc hồ sơ phỏng vấn.
- Transcript hiện là nội dung giữ chỗ, chưa phải bản chép lời từ media.
- Không được biến ghi chú biên tập thành trích dẫn trực tiếp. Khi chưa đủ bằng chứng, chuyển nội dung sang `editorial` hoặc ẩn khỏi public.

## 4. Địa điểm và bản đồ

- Dữ liệu địa điểm ghi tọa độ “exact” nhưng `coordinateSource` chỉ là mô tả chung, không có URL/tài liệu, cơ quan, ngày truy cập hay phạm vi.
- `PlaceMapSvg.tsx` đang hard-code vị trí marker riêng với dữ liệu địa điểm. Hai nguồn sự thật có thể lệch nhau.
- Bộ lọc khoảng năm và địa điểm đang chọn chưa được giữ đầy đủ trong URL.

Hướng sửa: tạo một dữ liệu địa điểm duy nhất, lưu nguồn tọa độ có thể truy vết, sinh marker từ dữ liệu và giữ trạng thái tương tác trong URL.

## 5. Kiểm tra tính năng hiện tại

### Đã hoạt động

- Catalog JSON được đưa vào trang chủ, Khám phá, Dòng thời gian, Địa điểm và route câu chuyện động.
- Dòng thời gian hỗ trợ nhiều sự kiện trong một năm và có trạng thái năm trong URL.
- Public selector lọc theo `published`; vấn đề nằm ở trạng thái dữ liệu đầu vào.
- Không phát hiện tràn ngang ở 320, 768, 1024 và 1440 px trên các route chính.
- Build tạo được 39 trang tĩnh.

### Còn thiếu hoặc chưa hoàn chỉnh

- Tìm kiếm chưa bỏ dấu tiếng Việt, vì vậy truy vấn không dấu cho kết quả kém.
- Chế độ xem ở Khám phá chưa tạo ra cách tổ chức nội dung khác biệt rõ ràng.
- Dòng thời gian mobile có nhãn mốc dày; URL chưa giữ sự kiện và bộ lọc đang chọn.
- Bản đồ vẫn là SVG thủ công và chưa đồng bộ hoàn toàn với catalog.
- Trang câu chuyện chỉ hiển thị số nguồn, chưa nối từng claim tới đúng nguồn và vị trí trong nguồn.
- Player/chapter ở trang chủ có điều khiển giả, chapter chung và iframe tải ngay.
- Có route tĩnh Điện Biên Phủ trùng với route động.
- Header ở 320 px không tràn nhưng chật và phân cấp điều hướng chưa tốt.
- Chưa có giao diện/quy trình thật cho biên tập viên, kiểm duyệt viên và quản trị hệ thống.

## 6. Khoảng cách giữa JSON và Supabase

Migration Supabase hiện chưa biểu diễn đầy đủ:

- claim và liên kết claim–source;
- phiên bản nội dung đã được review;
- quyết định review bất biến và lịch sử trạng thái;
- phân loại media, quyền tái sử dụng/nhúng, credit và bằng chứng giấy phép;
- chuyện bên lề, người kể, hồ sơ phỏng vấn, trang/timecode;
- khoảng ngày và mức chính xác của ngày/địa điểm.

RLS và kiểm tra policy phải hoàn thành trước khi dùng dữ liệu người dùng hoặc luồng nhân sự. Service role chỉ được dùng ở server và không được đưa vào client/log/fixture.

## 7. Bằng chứng kỹ thuật

Đã chạy trong ngày 2026-09-25:

- `pnpm verify`: đạt; 9 file test/47 test ứng dụng và 7 test agent đạt; lint, typecheck và production build đạt.
- `pnpm test:e2e`: 8/8 test đạt.
- Kiểm tra responsive route chính ở 320, 768, 1024 và 1440 px: không có horizontal overflow.
- `supabase status`: không chạy được local stack vì Docker Desktop chưa hoạt động; chưa có bằng chứng pgTAP mới.

Kết quả xanh hiện tại chứng minh ứng dụng nhất quán với dữ liệu đang có. Nó chưa chứng minh dữ liệu lịch sử là đúng; video sai vẫn vượt qua E2E.

## 8. Thứ tự xử lý được duyệt cho kế hoạch

1. Ngăn nội dung chưa thẩm tra tiếp tục xuất hiện dưới nhãn đã kiểm chứng.
2. Nâng validator từ kiểm tra cấu trúc lên kiểm tra provenance và tính nhất quán media.
3. Xây một lát cắt chuẩn Điện Biên Phủ từ nguồn tới UI.
4. Làm sạch 31 sự kiện còn lại theo lô nhỏ.
5. Đồng bộ mô hình Supabase, RLS và luồng 4 vai trò.
6. Hoàn thiện Khám phá, Dòng thời gian, Bản đồ, trang câu chuyện và responsive trên catalog sạch.
