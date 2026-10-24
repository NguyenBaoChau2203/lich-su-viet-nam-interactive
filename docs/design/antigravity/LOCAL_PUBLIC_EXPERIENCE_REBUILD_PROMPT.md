# Prompt cho Antigravity — dựng lại trải nghiệm công khai từ Stitch vào dự án local

## Cách sử dụng

Sao chép toàn bộ nội dung trong khối prompt dưới đây và gửi cho Antigravity khi đang mở workspace:

`D:\lich-su-viet-nam-interactive`

Prompt này cho phép Antigravity thực hiện trọn gói phần giao diện công khai local, gồm lập kế hoạch, viết mã, kiểm thử và sửa lỗi đến khi đạt tiêu chí nghiệm thu. Không cần dừng lại xin xác nhận ở từng bước kỹ thuật.

## Prompt

```text
Bạn đang làm việc trong repository:

D:\lich-su-viet-nam-interactive

Hãy dựng lại bộ trải nghiệm công khai của dự án lịch sử Việt Nam từ mockup Stitch thành mã nguồn local chạy được bằng Next.js. Đồng thời sửa toàn bộ lỗi nội dung, điều hướng, tương tác và accessibility đã phát hiện trong bản Stitch.

Đây là một nhiệm vụ triển khai hoàn chỉnh. Hãy tự đọc repository, lập kế hoạch, thực hiện, kiểm thử trong trình duyệt và sửa lỗi đến khi tất cả tiêu chí nghiệm thu bên dưới đạt. Không dừng lại để hỏi lại những quyết định đã được nêu rõ trong prompt này.

==================================================
1. ĐỌC NGUỒN SỰ THẬT TRƯỚC KHI VIẾT MÃ
==================================================

Đọc theo thứ tự:

1. `AGENTS.md`
2. `.agents/rules/project.md`
3. `docs/product/MVP-SCOPE.md`
4. `docs/product/VIDEO_STORYTELLING_FEASIBILITY.md`
5. `docs/design/stitch/DESIGN.md`
6. `docs/design/stitch/MAP_TIMELINE_REFINEMENT.md`
7. `docs/design/stitch/MAP_TIMELINE_FUNCTIONAL_PASS.md`
8. `docs/design/stitch/MAP_LIST_TOGGLE_FIX.md`
9. `docs/design/stitch/P01_P02_P08_INTEGRITY_FIX.md`
10. Mã hiện tại trong `src/app/` và các test hiện có.

Nếu `.codegraph/` tồn tại, dùng CodeGraph trước khi tìm kiếm hoặc đọc lan man, đúng như `AGENTS.md` yêu cầu.

Repository đang dùng Next.js 16.3.4 và có quy tắc “This is NOT the Next.js you know”. Trước khi sửa route, metadata, font, search params, client navigation hoặc testing, đọc tài liệu tương ứng trong `node_modules/next/dist/docs/`. Không dựa vào API Next.js cũ từ trí nhớ.

Tạo kế hoạch triển khai ngắn tại:

`docs/superpowers/plans/2026-09-24-public-experience-local-rebuild.md`

Sau đó triển khai luôn theo kế hoạch. Prompt này đã phê duyệt phạm vi công việc; không cần chờ thêm xác nhận.

==================================================
2. MỤC TIÊU VÀ PHẠM VI
==================================================

Xây năm route công khai có thể sử dụng thật:

1. `/` — P01 Trang chủ
2. `/kham-pha` — P02 Khám phá, tìm kiếm và lọc
3. `/dong-thoi-gian` — P04 Dòng thời gian tương tác
4. `/dia-diem` — P05 Bản đồ/địa điểm tương tác
5. `/cau-chuyen/chien-dich-dien-bien-phu` — P08 Trang câu chuyện video-first

Tất cả route phải dùng chung:

- PublicHeader;
- PublicFooter;
- design tokens;
- dữ liệu mẫu có kiểu TypeScript;
- component media placeholder;
- trạng thái focus và keyboard nhất quán.

Trọng tâm duyệt hình ảnh là desktop 1440px. Tuy nhiên mã phải responsive và không vỡ tại 320, 768, 1024 và 1440px theo yêu cầu repository. Không cần sáng tác một hệ giao diện mobile khác; hãy chuyển bố cục theo thứ tự đọc hợp lý.

Không triển khai trong nhiệm vụ này:

- đăng nhập hoặc tài khoản người học;
- yêu thích, lịch sử xem;
- quiz, điểm, huy hiệu hoặc game;
- AI chatbot;
- khu quản trị/CMS;
- Supabase hoặc migration mới;
- upload media;
- video thật;
- bản đồ bên thứ ba;
- 3D, GSAP hoặc scrollytelling nâng cao.

Không thêm dependency nếu Web Platform, React, Next.js và Tailwind hiện có đã giải quyết được.

==================================================
3. THAM CHIẾU STITCH
==================================================

Nếu các file sau còn tồn tại, chỉ dùng chúng để tham khảo bố cục và nhịp thị giác:

- `.codex-tmp/stitch-recheck-20260924/8aa7ab024503405e9967d8847b1dd58a.html` — P01
- `.codex-tmp/stitch-recheck-20260924/1c493b3d461044f581ac806f737e5b7f.html` — P02
- `.codex-tmp/stitch-recheck-20260924/17b6581baa7749959c2c0ed04e9d614a.html` — P04
- `.codex-tmp/stitch-recheck-20260924/3cbeb0b1ef8a47dc885ecd19c900876e.html` — P05
- `.codex-tmp/stitch-recheck-20260924/40b3cee181ec4fc8a29b172976c7e3fc.html` — P08

Không chép nguyên HTML, Tailwind CDN, inline script hoặc cấu trúc một-file của Stitch vào ứng dụng. Dựng lại bằng component React/TypeScript có semantics rõ ràng.

Giữ các điểm thị giác tốt của Stitch:

- cảm giác tạp chí tư liệu và phim tài liệu;
- nền giấy ấm, chữ mực đen và vermilion dùng tiết chế;
- vùng xem phim màu đen ở P08;
- hierarchy serif lớn và metadata monospace;
- bố cục bất đối xứng;
- P04 scrubber theo năm;
- P05 map/list đồng bộ.

Sửa các điểm chưa đạt của Stitch:

- link chết `href="#"`;
- tab chỉ đổi gạch chân nhưng không đổi nội dung;
- tab P08 không chạy vì ID và script không khớp;
- thiếu keyboard interaction;
- footer không thống nhất;
- tuyên bố chưa có căn cứ về xuất bản, hội đồng, hồ sơ chính thức và GDPT;
- dữ kiện chi tiết chưa nằm trong tập dữ liệu mẫu;
- design system khuyến khích sinh mã lưu trữ, ngày giải mật và nhãn xác minh giả;
- card grid lặp lại khiến giao diện giống template.

==================================================
4. DESIGN SYSTEM LOCAL
==================================================

Dùng các token cốt lõi:

- `paper`: `#F1EEE6`
- `paperRaised`: `#F8F6F0`
- `ink`: `#121212`
- `inkSoft`: `#56534D`
- `hairline`: `#C8C2B8`
- `vermilion`: `#B12B1E`
- `mapInk`: `#233B45`

Typography:

- heading/editorial: Source Serif 4;
- UI/body: Be Vietnam Pro;
- year/timecode/metadata: IBM Plex Mono.

Dùng giải pháp font phù hợp với Next.js 16 sau khi đọc tài liệu local. Có fallback ổn định nếu font mạng không tải được. Tiếng Việt không được lỗi dấu hoặc bị cắt dấu.

Phong cách:

- nền phẳng, góc vuông hoặc tối đa 2–4px;
- đường kẻ 1px;
- khoảng trắng lớn và có nhịp;
- CTA chữ nhật;
- không gradient;
- không glassmorphism;
- không glow;
- không blob;
- không nền lưới công nghệ;
- không card bo tròn hàng loạt;
- không dashboard;
- không đổ bóng nặng;
- không sepia hoặc hiệu ứng giấy cũ giả;
- không dùng icon lớn để thay nội dung.

Ưu tiên semantic HTML và CSS/Tailwind rõ ràng. Không tạo abstraction chỉ dùng một lần. Các component dùng chung thật sự mới tách riêng.

==================================================
5. QUY TẮC DỮ LIỆU VÀ TÍNH XÁC THỰC
==================================================

Tạo một module dữ liệu mẫu TypeScript dùng chung, ví dụ trong một feature slice như:

`src/features/history/`

Không bắt buộc đúng tên thư mục nếu repository có cấu trúc phù hợp hơn.

Chỉ được dùng các dữ liệu mẫu sau:

Năm:
- 1945
- 1946
- 1950
- 1954
- 1975

Tên câu chuyện:
- Cách mạng tháng Tám
- Toàn quốc kháng chiến
- Chiến dịch Biên giới
- Chiến dịch Điện Biên Phủ
- Đại thắng mùa Xuân 1975

Địa điểm:
- Hà Nội
- Cao Bằng
- Điện Biên Phủ

Chỉ các nhãn trên được dùng để chứng minh layout và interaction. Không tự thêm ngày đầy đủ, đơn vị quân sự, chiến thuật, cứ điểm, tuyến đường, nhân vật, tọa độ, trích dẫn, kết luận hoặc đoạn thuyết minh lịch sử.

Các placeholder được phép:

- `TƯ LIỆU SẼ BỔ SUNG`
- `VIDEO SẼ BỔ SUNG`
- `ẢNH SẼ BỔ SUNG`
- `ÂM THANH SẼ BỔ SUNG`
- `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`
- `NGUỒN ĐANG CẬP NHẬT`
- `CHỜ THẨM ĐỊNH`
- `NỘI DUNG ĐANG BIÊN TẬP`

Không dùng:

- ảnh AI mô phỏng lịch sử;
- stock photo giả làm tư liệu;
- mã lưu trữ tự nghĩ ra;
- ngày giải mật;
- tên nhân chứng hoặc ảnh chân dung giả;
- thời lượng video giả;
- nhãn `ĐÃ KIỂM CHỨNG` khi chưa có source record;
- tuyên bố đã được hội đồng, viện, bảo tàng, trung tâm lưu trữ hoặc cơ quan nào xác nhận;
- câu `chuẩn chương trình GDPT` nếu chưa có hồ sơ đối chiếu;
- câu khẳng định sản phẩm là kho lưu trữ quốc gia hoặc ấn bản chính thức;
- copyright hoặc năm xuất bản giả.

Nếu cần metadata để lọc, đặt tên trung thực, ví dụ `plannedMediaKind` và hiển thị `ĐỊNH DẠNG DỰ KIẾN`, không trình bày như media đã tồn tại.

Định nghĩa type tối thiểu rõ nghĩa, ví dụ:

- `HistoryStorySummary`
- `ContentStatus = "draft" | "pending_review" | "published"`
- `PlannedMediaKind = "video" | "audio" | "visual"`

Không gán `published` hoặc `verified` cho dữ liệu mẫu hiện tại.

==================================================
6. SHELL DÙNG CHUNG
==================================================

PublicHeader chỉ có:

- wordmark `LỊCH SỬ VIỆT NAM` dẫn về `/`;
- `Khám phá` dẫn `/kham-pha`;
- `Dòng thời gian` dẫn `/dong-thoi-gian`;
- `Địa điểm` dẫn `/dia-diem`;
- nút tìm kiếm dẫn tới hoặc mở phần tìm kiếm của `/kham-pha`;
- nút `Aa` điều chỉnh cỡ chữ thật sự hoặc một accessible control có state rõ ràng.

Không có avatar, login, tài khoản, yêu thích hoặc notification.

PublicFooter dùng chung nguyên văn:

- `LỊCH SỬ VIỆT NAM`
- `Dự án học tập lịch sử Việt Nam qua câu chuyện, thời gian và địa điểm.`
- `BẢN MẪU GIAO DIỆN · NỘI DUNG ĐANG BIÊN TẬP`
- các link `Phương pháp biên tập`, `Về dự án`, `Tiêu chuẩn nguồn`.

Nếu ba trang đích cuối chưa thuộc phạm vi, render chúng dưới dạng text hoặc disabled future navigation có giải thích rõ; không dùng `href="#"`.

Mọi route chính phải dùng `next/link` và URL thật. Không được còn primary navigation hoặc CTA dùng `#`.

==================================================
7. P01 TRANG CHỦ `/`
==================================================

Mục tiêu: người học nhận ra ngay đây là trải nghiệm lịch sử bằng video và có thể vào một câu chuyện hoặc một lối khám phá trong tối đa hai hành động.

Hero:

- eyebrow `CÂU CHUYỆN ĐƯỢC CHỌN · 1954`;
- H1 `Chiến dịch Điện Biên Phủ`;
- một media placeholder 16:9 lớn, nhãn `VIDEO SẼ BỔ SUNG`;
- copy `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`;
- CTA `Xem câu chuyện` dẫn đến `/cau-chuyen/chien-dich-dien-bien-phu`;
- secondary status `NGUỒN ĐANG CẬP NHẬT`;
- chỉ báo `01 / 05` chỉ mang nghĩa vị trí trong tập mẫu, ghi chú rõ `CÂU CHUYỆN MẪU`.

Bên dưới có ba lối khám phá nhưng không dùng ba card giống nhau:

1. Theo chủ đề: dải biên tập ngang.
2. Theo thời gian: preview timeline ngắn và link thật đến `/dong-thoi-gian`.
3. Theo địa điểm: preview sơ đồ không gian và link thật đến `/dia-diem`.

Phần `Mới được biên tập` dùng StoryRow, không dùng card grid. Chỉ Điện Biên Phủ có route chi tiết đang tồn tại. Các story khác hiển thị `NỘI DUNG ĐANG BIÊN TẬP` thay cho link giả.

Không tạo carousel giả. Nếu có nút trước/sau thì phải thay đổi story thật; nếu không triển khai thì bỏ nút.

==================================================
8. P02 KHÁM PHÁ `/kham-pha`
==================================================

Mục tiêu: tìm và lọc năm story mẫu theo nhiều chiều, có URL chia sẻ được.

Giao diện:

- H1 `Khám phá câu chuyện`;
- ba mode `Chủ đề`, `Thời gian`, `Địa điểm` dưới dạng tab text với active rule;
- ô tìm kiếm từ khóa;
- filter `Giai đoạn`;
- filter `Chủ đề`;
- filter `Định dạng dự kiến`;
- filter `Địa điểm`;
- kết quả dạng editorial rows xen kẽ, không dùng card grid;
- live count có nhãn `KẾT QUẢ MẪU`;
- empty state và `Xóa bộ lọc`.

Hành vi bắt buộc:

- tìm kiếm không phân biệt hoa thường và xử lý tiếng Việt hợp lý;
- mọi filter kết hợp được với nhau;
- cập nhật query string bằng router API phù hợp Next.js 16;
- tải trực tiếp URL có query phải phục hồi state;
- back/forward của trình duyệt phải đồng bộ state;
- reset xóa mọi filter và query string;
- tab có `role="tablist"`, `role="tab"`, `role="tabpanel"`;
- tab có cặp `aria-controls`/`aria-labelledby` đúng;
- cập nhật `aria-selected` và roving `tabIndex`;
- hỗ trợ ArrowLeft, ArrowRight, Home và End;
- tab phải thực sự đổi cách tổ chức/nhấn mạnh kết quả, không chỉ đổi màu hoặc gạch chân;
- khi không có kết quả, thông báo bằng `aria-live="polite"`;
- không có phân trang giả với chỉ năm item.

Kết quả Điện Biên Phủ dẫn đến route P08. Những kết quả chưa có detail route hiển thị trạng thái biên tập thay cho link chết.

==================================================
9. P04 DÒNG THỜI GIAN `/dong-thoi-gian`
==================================================

Dựng lại hành vi đã được duyệt trong Stitch:

- một `input type="range"` thật có năm rời rạc 1945, 1946, 1950, 1954, 1975;
- mặc định 1954;
- label `Đang xem: 1954`;
- tick và selected state;
- nút năm trước/năm sau;
- ArrowLeft/ArrowRight dùng native range;
- chọn story row cập nhật range và focused story;
- focused story cập nhật năm, tiêu đề, media placeholder và locator label;
- không dùng dot timeline trang trí;
- có text `Kéo hoặc dùng phím mũi tên để đổi năm`;
- có filter chủ đề và filter `Chỉ hiện câu chuyện có video` chỉ khi dữ liệu mẫu mô tả trung thực đây là định dạng dự kiến;
- story detail link chỉ bật cho Điện Biên Phủ.

Không thêm nội dung lịch sử ngoài dữ liệu mẫu.

==================================================
10. P05 ĐỊA ĐIỂM `/dia-diem`
==================================================

Dựng lại hành vi đã được duyệt trong Stitch:

- bố cục desktop 7 cột sơ đồ bản đồ và 5 cột danh sách;
- sơ đồ Việt Nam tối giản, ghi rõ `SƠ ĐỒ MINH HỌA`;
- chỉ ba marker Hà Nội, Cao Bằng, Điện Biên Phủ;
- Điện Biên Phủ được chọn mặc định;
- marker và hàng danh sách đồng bộ hai chiều;
- marker là button hoặc có semantics button, focus được, Enter/Space hoạt động;
- hai range control thật cho năm bắt đầu và kết thúc;
- luôn bảo đảm start <= end;
- range cập nhật marker, danh sách và live status;
- zoom in, zoom out, reset áp dụng transform nhìn thấy được với giới hạn an toàn;
- có toggle thật giữa `Bản đồ` và `Danh sách văn bản`;
- khi chuyển sang danh sách: ẩn map split view, hiển thị textual list, cập nhật `aria-expanded`, chuyển focus tới heading;
- khi quay lại: khôi phục selection/range và focus map heading;
- có state `Bản đồ chưa tải được` nhưng danh sách vẫn dùng được;
- không dùng route quân sự, đường tiến công, tọa độ hoặc ranh giới chi tiết.

==================================================
11. P08 CÂU CHUYỆN `/cau-chuyen/chien-dich-dien-bien-phu`
==================================================

Mục tiêu: video là điểm vào chính; người cần kiểm chứng có thể mở transcript, chuyện bên lề và nguồn.

Phần đầu:

- H1 `Chiến dịch Điện Biên Phủ`;
- year label `1954`;
- vùng cinema màu đen với placeholder `VIDEO SẼ BỔ SUNG`;
- thời gian `--:-- / --:--`;
- status `NỘI DUNG ĐANG BIÊN TẬP`;
- không giả lập video đang phát;
- không tự tạo duration;
- chapter rail dùng `CHƯƠNG 01 · TIÊU ĐỀ SẼ BỔ SUNG` và không có timecode giả.

Tab bắt buộc:

1. Tóm tắt
2. Hình ảnh
3. Chuyện bên lề
4. Bản chép lời
5. Nguồn

Tab phải là React component hoạt động thật:

- click đổi panel;
- `aria-selected`, `aria-controls`, `aria-labelledby`, roving `tabIndex` đúng;
- ArrowLeft, ArrowRight, Home, End hoạt động;
- focus theo tab mới;
- chỉ panel hiện hành xuất hiện;
- trạng thái vẫn đọc được khi animation bị tắt.

Nội dung an toàn:

- Tóm tắt: `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG` và ba slot `LUẬN ĐIỂM ĐANG BIÊN TẬP`;
- Hình ảnh: `ẢNH SẼ BỔ SUNG`;
- Chuyện bên lề: `LỜI KỂ NHÂN CHỨNG SẼ BỔ SUNG`;
- Bản chép lời: `BẢN CHÉP LỜI SẼ BỔ SUNG`;
- Nguồn: khung field rỗng gồm `Tài liệu`, `Tác giả hoặc cơ quan`, `Liên kết hoặc ký hiệu lưu trữ`, `Phạm vi được nguồn hỗ trợ`, `Ngày truy cập`, cùng `NGUỒN ĐANG CẬP NHẬT` và `CHỜ THẨM ĐỊNH`.

Context địa điểm:

- sơ đồ placeholder có `Điện Biên Phủ` và `SƠ ĐỒ VỊ TRÍ ĐANG BIÊN TẬP`;
- link `Xem trong trang Địa điểm` dẫn `/dia-diem`;
- link quay lại `/dong-thoi-gian`;
- không có tọa độ, tuyến, cự ly hoặc vị trí chiến thuật.

Không dùng các câu như:

- `đang được rà soát cùng hội đồng chuyên môn`;
- `theo hồ sơ lưu trữ chính thức`;
- `video tài liệu chính thức`;
- `xuất bản phục vụ nghiên cứu và giảng dạy`;
- `chuẩn chương trình GDPT`.

==================================================
12. KIẾN TRÚC REACT/NEXT.JS
==================================================

- App Router.
- TypeScript strict.
- Server Component mặc định.
- Chỉ thêm `"use client"` cho component thực sự cần state, DOM, keyboard hoặc router client.
- Tách phần tương tác thành client islands nhỏ: Explore filters/tabs, Timeline explorer, Place explorer, Story tabs, Reading-size control.
- Shared shell và phần nội dung tĩnh nên là Server Components.
- Dữ liệu mẫu dùng module TypeScript bất biến, không fetch giả và không setTimeout giả.
- Không dùng inline `<script>`.
- Không dùng `dangerouslySetInnerHTML`.
- Không đưa secrets hoặc biến môi trường vào client.
- Không dùng index làm key khi có slug/id ổn định.
- URL phải giữ state tìm kiếm/lọc có ý nghĩa.
- Không tải media bên ngoài trong bản mẫu này.

Nếu cần CSS phức tạp cho range, map hoặc focus, đặt gần feature/component phù hợp hoặc trong globals khi thật sự là token/base style. Không để `globals.css` trở thành một file khổng lồ chứa toàn bộ chi tiết từng route nếu CSS Modules hoặc component styles rõ ràng hơn.

==================================================
13. ACCESSIBILITY VÀ MOTION
==================================================

- Một H1 mỗi route.
- Heading không nhảy cấp vô lý.
- Landmark header/nav/main/footer rõ ràng.
- Có skip link tới main content.
- Tương phản WCAG AA.
- Focus ring luôn nhìn thấy.
- Không dùng màu làm tín hiệu duy nhất.
- Touch target tối thiểu khoảng 44x44px cho control chính.
- Không có div click thay button.
- Filter có label thật.
- Trạng thái thay đổi có live region phù hợp.
- Map có textual alternative đầy đủ.
- Placeholder media có mô tả trạng thái, không giả alt text lịch sử.
- Tôn trọng `prefers-reduced-motion`.
- Không animation tự chạy.
- Chỉ dùng opacity/transform cho transition nhỏ.
- Giao diện vẫn đọc và điều hướng được nếu transition không chạy.

==================================================
14. TEST BẮT BUỘC
==================================================

Không chỉ sửa snapshot hoặc test copy tĩnh. Viết test có ý nghĩa cho hành vi có rủi ro:

1. P02:
   - kết hợp bộ lọc;
   - cập nhật số kết quả;
   - empty state;
   - reset;
   - serialize/restore query params;
   - keyboard tabs.

2. P04:
   - mapping năm rời rạc;
   - previous/next;
   - chọn row cập nhật focused story.

3. P05:
   - start <= end;
   - lọc marker/list;
   - marker/list selection đồng bộ;
   - map/list toggle bảo toàn state.

4. P08:
   - click tab đổi panel;
   - ARIA state đúng;
   - ArrowLeft/ArrowRight/Home/End;
   - placeholder nguồn không có dữ liệu giả.

5. Content integrity:
   - không có các chuỗi cấm từ bản Stitch;
   - không có `<img>` hoặc URL ảnh ngoài trong sample data;
   - không có primary `href="#"`;
   - dữ liệu mẫu không có trạng thái published/verified.

6. Browser smoke:
   - mở đủ năm route;
   - kiểm tra console không có lỗi;
   - kiểm tra keyboard flow chính;
   - kiểm tra 320, 768, 1024 và 1440px;
   - chụp screenshot desktop vào `.codex-tmp/` để tự soát, không commit ảnh kiểm thử.

Cập nhật test trang chủ hiện có để phản ánh H1 mới. Không xóa test chỉ vì nội dung thay đổi.

==================================================
15. CỔNG NGHIỆM THU
==================================================

Trước khi báo hoàn tất, chạy mới toàn bộ:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`
- `pnpm agent:check`
- `pnpm verify`

Nếu một lệnh thất bại, tìm nguyên nhân và sửa; không báo hoàn tất khi còn lỗi.

Kiểm tra thêm bằng tìm kiếm trong `src/`:

- không còn `href="#"` cho hành động chính;
- không có `person` avatar trong public header;
- không có mã `VN-MIL-01`, `QĐND-1994-T2`, `FR-SHD-09`, `ARCHIVE-VN12`;
- không có `ĐÃ KIỂM CHỨNG HỌC THUẬT`;
- không có `ĐÃ XÁC MINH NGUỒN TƯ LIỆU HỌC THUẬT`;
- không có `phiên bản lưu trữ số hóa quốc gia`;
- không có tuyên bố `hội đồng chuyên môn`, `hồ sơ lưu trữ chính thức`, `video tài liệu chính thức`, `chuẩn chương trình GDPT` trong nội dung mẫu;
- không có ảnh lịch sử sinh hoặc ảnh mạng.

==================================================
16. QUY TẮC AN TOÀN KHI LÀM VIỆC TRONG REPOSITORY
==================================================

- Kiểm tra `git status` trước khi sửa.
- Không reset, xóa hoặc ghi đè thay đổi không liên quan.
- Không sửa, đổi tên, di chuyển hoặc stage các file Word ở thư mục gốc.
- Không sửa `.env` hoặc in secret.
- Không sửa `supabase/`, `outputs/` hoặc tài liệu báo cáo ngoài phạm vi.
- Không thêm build output vào git.
- Không push, merge hoặc tạo PR.
- Nếu tạo commit, dùng commit nhỏ theo Conventional Commits và không đưa file ngoài phạm vi vào commit.

==================================================
17. ĐỊNH NGHĨA HOÀN TẤT
==================================================

Chỉ báo hoàn tất khi:

- năm route đều tồn tại và có thể điều hướng qua lại;
- P01 không còn CTA chết;
- P02 tìm kiếm, bốn filter, URL state, empty/reset và keyboard tabs hoạt động;
- P04 scrubber hoạt động bằng chuột và bàn phím;
- P05 range, marker/list, zoom/reset và text-only toggle hoạt động;
- P08 năm tab hoạt động bằng chuột và bàn phím;
- không có tư liệu lịch sử giả hoặc tuyên bố xác minh giả;
- header/footer thống nhất;
- không có account UI;
- responsive và keyboard flow đạt ở bốn breakpoint;
- test và mọi cổng kiểm tra đều xanh.

Trong báo cáo cuối, nêu:

1. các route và component đã tạo;
2. cấu trúc dữ liệu mẫu;
3. các lỗi Stitch đã được sửa;
4. kết quả từng lệnh kiểm tra;
5. giới hạn còn lại, đặc biệt là media và nội dung lịch sử thật vẫn cần quy trình nguồn/kiểm duyệt riêng.
```

## Kết quả mong đợi

Sau khi Antigravity hoàn thành, local project phải có một lát cắt giao diện công khai chạy được, đủ để duyệt trải nghiệm trước khi nối Supabase, CMS và media thật. Bộ giao diện phải dùng placeholder trung thực, không tạo cảm giác đã có kho tư liệu hoặc nguồn được thẩm định khi dữ liệu đó chưa tồn tại.
