# Nguồn dữ liệu địa lý cho sa bàn Việt Nam 3D (`vietnam-tabletop.geojson`)

- **Ngày lập và truy cập nguồn:** 2026-10-23
- **Tệp dữ liệu đầu ra:** `public/maps/vietnam-tabletop.geojson`
- **Tệp hồ sơ xuất xứ:** `public/maps/vietnam-tabletop.provenance.json`
- **SHA-256 đầu ra (`vietnam-tabletop.geojson`):** `2239001e2c4030421949a760feb4e1ddae5abe192bd7827344848851a431a895`
- **Kích thước tệp:** 105.197 byte (nén gzip: 36.248 byte, nằm trong ngân sách $\le 200\text{ KiB}$)
- **Số lượng tam giác khi đùn khối (`THREE.ExtrudeGeometry`, `steps: 1`, `bevelEnabled: false`):** 17.372 tam giác (nằm trong ngân sách $\le 80.000$ tam giác)

## 1. Lý do không dùng `public/mapfilm/indochina-borders.geojson`

Tệp `public/mapfilm/indochina-borders.geojson` có sẵn trong kho mã chỉ chứa 1 đối tượng `MultiLineString` gồm 12 đoạn đường biên giới rời rạc trên bán đảo Đông Dương (phục vụ lớp nền đường nét của phim bản đồ Điện Biên Phủ). Tệp này không có vòng đa giác khép kín (`Polygon` / `MultiPolygon`), thiếu đường bờ biển khép kín và thiếu hệ thống đảo, quần đảo của Việt Nam nên không thể dùng làm mặt phẳng đùn khối 3D cho sa bàn quốc gia.

## 2. Nguồn dữ liệu địa lý gốc và điều kiện tái sử dụng

Bộ khung đa giác `public/maps/vietnam-tabletop.geojson` được trích xuất trực tiếp từ bộ dữ liệu vector tỷ lệ 1:10.000.000 (**Natural Earth v5.1.2**, phát hành thuộc phạm vi công cộng — **Public Domain / CC0 1.0 Universal** theo [Natural Earth Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/)):

| `sourceId` | Tên lớp dữ liệu gốc | Cơ quan / Tác giả | URL dữ liệu gốc & SHA-256 đầu vào | Trạng thái bằng chứng | Phạm vi sử dụng |
| --- | --- | --- | --- | --- | --- |
| `ne-10m-admin0-vnm-v5.1.2` | Natural Earth 1:10m Admin 0 Countries — Vietnam Point of View (`ne_10m_admin_0_countries_vnm.geojson`, v5.1.2) | Natural Earth (NACIS, Tom Patterson, Nathaniel Vaughn Kelso và cộng sự) | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_0_countries_vnm.geojson` (`sha256: 90067c7f246a7e85a5d501b8f3d7367ad2287816c85ebd8d44634600caf26b64`) | `verified` (dữ liệu vector công cộng tỷ lệ 1:10m) | Đất liền Việt Nam (`mainland`) và các đảo ven bờ chính có sẵn trong lớp Admin 0 (`phu-quoc`, `con-dao`, `cat-ba`, `phu-quy`, `vinh-bac-bo-islands`, `khanh-hoa-islands`, `cuu-long-can-gio-islands`). |
| `ne-10m-disputed-areas-v5.1.2` | Natural Earth 1:10m Admin 0 Breakaway and Disputed Areas (`ne_10m_admin_0_disputed_areas.geojson`, v5.1.2) | Natural Earth (NACIS, Tom Patterson, Nathaniel Vaughn Kelso và cộng sự) | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_0_disputed_areas.geojson` (`sha256: 9cafef8b7dfb6b164dc58f218f981f4ace9f716f6c03795d4c62d1ac9f3d50f5`) | `verified` (hình học đa giác tỷ lệ 1:10m cho hai quần đảo) | Toàn bộ 18 đa giác của Quần đảo Hoàng Sa (`hoang-sa`, `NAME='Paracel Is.'`) và 21 đa giác của Quần đảo Trường Sa (`truong-sa`, `NAME='Spratly Is.'`), bổ sung đầy đủ hơn tập con có sẵn trong lớp `countries_vnm`. |
| `ne-10m-minor-islands-v5.1.2` | Natural Earth 1:10m Minor Islands (`ne_10m_minor_islands.geojson`, v5.1.2) | Natural Earth (NACIS, Tom Patterson, Nathaniel Vaughn Kelso và cộng sự) | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_minor_islands.geojson` (`sha256: 8c933ca7a4760256bdc46408355706e39764b0fa01c160c28888b90b4faec29f`) | `verified` (dữ liệu đảo nhỏ tỷ lệ 1:10m) | Các đảo tiền tiêu và ven bờ tiêu biểu của Việt Nam không tách riêng trong lớp Admin 0: Bạch Long Vĩ (`bach-long-vi`), Cù Lao Chàm (`cu-lao-cham`), Lý Sơn (`ly-son`), Thổ Chu (`tho-chu`), cụm Hòn Khoai – Nam Du – Hòn Sơn (`hon-khoai-nam-du`). |

## 3. Danh mục các bộ phận địa lý (`partId`) trong `vietnam-tabletop.geojson`

| `partId` | Tên hiển thị | Kiểu hình học | Số đa giác | Nguồn (`sourceId`) |
| --- | --- | --- | --- | --- |
| `mainland` | Đất liền Việt Nam | `Polygon` | 1 (3.504 đỉnh) | `ne-10m-admin0-vnm-v5.1.2` |
| `phu-quoc` | Đảo Phú Quốc | `Polygon` | 1 | `ne-10m-admin0-vnm-v5.1.2` |
| `con-dao` | Côn Đảo (Côn Sơn) | `Polygon` | 1 | `ne-10m-admin0-vnm-v5.1.2` |
| `cat-ba` | Đảo Cát Bà | `Polygon` | 1 | `ne-10m-admin0-vnm-v5.1.2` |
| `vinh-bac-bo-islands` | Quần đảo vịnh Bắc Bộ (Vân Đồn, Cô Tô, Cái Bầu) | `MultiPolygon` | 11 | `ne-10m-admin0-vnm-v5.1.2` |
| `bach-long-vi` | Đảo Bạch Long Vĩ | `Polygon` | 1 | `ne-10m-minor-islands-v5.1.2` |
| `cu-lao-cham` | Cù Lao Chàm | `Polygon` | 1 | `ne-10m-minor-islands-v5.1.2` |
| `ly-son` | Đảo Lý Sơn | `Polygon` | 1 | `ne-10m-minor-islands-v5.1.2` |
| `khanh-hoa-islands` | Đảo Hòn Tre và Hòn Lớn (Khánh Hòa) | `MultiPolygon` | 2 | `ne-10m-admin0-vnm-v5.1.2` |
| `phu-quy` | Đảo Phú Quý | `Polygon` | 1 | `ne-10m-admin0-vnm-v5.1.2` |
| `cuu-long-can-gio-islands` | Các cù lao và đảo cửa sông Cửu Long – Cần Giờ | `MultiPolygon` | 7 | `ne-10m-admin0-vnm-v5.1.2` |
| `tho-chu` | Quần đảo Thổ Chu | `Polygon` | 1 | `ne-10m-minor-islands-v5.1.2` |
| `hon-khoai-nam-du` | Cụm đảo Hòn Khoai và Nam Du | `MultiPolygon` | 3 | `ne-10m-minor-islands-v5.1.2` |
| `hoang-sa` | Quần đảo Hoàng Sa | `MultiPolygon` | 18 | `ne-10m-disputed-areas-v5.1.2` |
| `truong-sa` | Quần đảo Trường Sa | `MultiPolygon` | 21 | `ne-10m-disputed-areas-v5.1.2` |

## 4. Quy trình biến đổi và giới hạn phạm vi (`editorial` & `approximate`)

1. **Hệ tọa độ:** Giữ nguyên tọa độ địa lý WGS84 theo thứ tự chuẩn GeoJSON `[longitude, latitude]`, làm tròn đến 6 chữ số thập phân ($\approx 0,11\text{ m}$).
2. **Làm sạch vòng đa giác:** Loại bỏ các đỉnh trùng nhau liên tiếp và đảm bảo mọi vòng (`LinearRing`) đều khép kín (`ring[0]` trùng `ring[ring.length - 1]`), có tối thiểu 4 điểm và diện tích có hướng khác 0. Không áp dụng thuật toán rút gọn làm mất đảo hoặc biến dạng đường bờ biển vì dung lượng nén gzip (36.251 byte) và số tam giác (17.372) đã nằm sâu trong ngân sách hiệu năng.
3. **Giới hạn phạm vi sử dụng (`limitations`):**
   - Dữ liệu ở tỷ lệ bản đồ khái quát 1:10.000.000 phục vụ mô hình sa bàn minh họa tổng quan quốc gia cho học sinh lớp 12; không phải bản đồ đo đạc địa chính, hải đồ chi tiết hay bản đồ biên giới hành chính theo từng thời kỳ lịch sử cụ thể.
   - Ở tỷ lệ 1:10.000.000, các đảo đá và bãi san hô thuộc Quần đảo Hoàng Sa và Quần đảo Trường Sa có kích thước góc thực tế rất nhỏ ($0,002^\circ - 0,021^\circ$), mang tính đại diện vị trí không gian của hai quần đảo trên sa bàn tổng thể.
   - Đế sa bàn nổi (`Y = 0..3`) là cách trình bày minh họa trực quan (`editorial`), không biểu thị độ cao địa hình thực tế của đất liền hay đáy biển.
   - Việc kiểm tra hình học và đối chiếu trực quan trong Task A1 được thực hiện tự động và qua ảnh kết xuất 2D/3D trong quy trình kỹ thuật ngày 2026-10-23; chưa có chữ ký thẩm định bản đồ độc lập từ cơ quan đo đạc bản đồ bên ngoài.
