import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** Máy chủ Supabase (Auth, REST, Realtime) mà trình duyệt gọi thẳng. */
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();

/**
 * Content-Security-Policy — đang ở chế độ **Report-Only** (chỉ báo vi phạm ở Console, không chặn) cho tới khi kiểm hết
 * mọi trang. Nguồn liệt kê từ mã thật:
 * - ảnh: Wikimedia Commons, Supabase Storage, ảnh đại diện Google (lh3.googleusercontent.com), YouTube / Sketchfab… — chủ
 *   bài có thể dán ảnh từ bất kỳ máy chủ https nào (SafeImage) nên `img-src` mở cho `https:`;
 * - bản đồ: ô ảnh OpenStreetMap (Leaflet → <img>), MapLibre tải bằng fetch (vệ tinh ArcGIS, độ cao AWS), worker ở
 *   /vendor/maplibre-gl/ (cùng nguồn);
 * - nhúng: video youtube-nocookie, mô hình Sketchfab;
 * - form gửi thẳng (trước khi JS chạy) có thể chuyển hướng sang Supabase → Google (đăng nhập) hoặc payOS (thanh toán).
 * `'unsafe-inline'` cho script: Next.js chèn script nội tuyến và script đặt giao diện sáng / tối ở đầu trang.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    supabaseOrigin,
    supabaseOrigin.replace(/^http/, "ws"),
    "https://tile.openstreetmap.org",
    "https://server.arcgisonline.com",
    "https://s3.amazonaws.com",
    isDev ? "ws:" : "",
  ]
    .filter(Boolean)
    .join(" "),
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "frame-src https://www.youtube-nocookie.com https://sketchfab.com",
  `form-action 'self' ${supabaseOrigin} https://accounts.google.com https://*.payos.vn`.replace(/\s+/g, " "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Chống nhúng trang (clickjacking) — nhất là trang đăng nhập / thanh toán. Trình duyệt mới đọc `frame-ancestors` ở CSP.
  { key: "X-Frame-Options", value: "DENY" },
  // Trang "Gần em" dùng vị trí của chính trang → giữ `self`.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  // HSTS chỉ khi chạy production (localhost dùng http).
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  images: { remotePatterns: [
    // Accepted Phase 01 images; adding a new origin requires its media/budget check.
    { protocol: "https", hostname: "baotanglichsu.vn", pathname: "/DataFiles/**" },
    { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
    { protocol: "https", hostname: "commons.wikimedia.org", pathname: "/wiki/Special:FilePath/**" },
    // Phase 07: original pages, actual image identity/hash and DPR 1/2 delivery are audited.
    // Pin exact assets and empty query strings; do not allow either entire host.
    new URL("https://nguoiduatin.mediacdn.vn/thumb_w/640/84137818385850368/2024/8/30/anh-1-le-thi-pha-1725028915427902300767.jpg"),
    new URL("https://vhttdl.daklak.gov.vn/CMS/Content/n%C4%83m2024/thang8/thuy1.jpg"),
    // Phase 07 remediation: exact original assets, with identity/context evidence in the versioned media ledger.
    new URL("https://baocantho.com.vn/image/fckeditor/upload/2018/20181124/images/bong-van-dia.jpg"),
    new URL("https://daknong.1cdn.vn/2018/10/18/caonguyendaknong.baodaknong.org.vn-uploads-image-2018-10-18-_baoanh318-51.jpg"),
    new URL("https://file.qdnd.vn/data/images/13/2017/08/11/tvthuonghuyen/2_igvnjpgashx789122237pm.jpg?w=500"),
    new URL("https://cdnimage.daihoidang.vn/t150x150/Media/Graphic/Profile/2021/04/05/18-87-4474-hoang-tuong-minh.jpg"),
    new URL("https://images.hcmcpv.org.vn/res/news/2021/11/04-11-2021-dong-chi-hoang-van-thu-nguoi-cong-san-kien-cuong-song-mai-voi-non-song-viet-nam-85B3EC11-details.jpg?vs=04112021124646"),
    new URL("https://cly.1cdn.vn/2014/09/12/congly-vn_vanutjpg1410228021.jpg"),
    new URL("https://trungbayonline.hoalo.vn/assets/img/p2/ii-2-4.jpg"),
    new URL("https://vhtt.ninhbinh.gov.vn/public/userfiles/image/8-11-19-1.jpg"),
    new URL("https://imgprofile.vnanet.vn/media/graphic/profile/2023/11/27/ngo-gia-tu-bi-thu-xu-uy-nam-ky-1908.jpg"),
    new URL("https://bna.1cdn.vn/2022/10/24/btxvnt.org.vn-storage-_nguyen-duc-canh.jpg"),
    new URL("https://baotuyenquang.com.vn/file/4028eaa4679b32c401679c0c74382a7e/012026/1766847_20260106081605.jpg"),
    new URL("https://bqn.1cdn.vn/2026/01/03/cbd03ffb.jpg"),
    new URL("https://media.baosonla.org.vn/public/hieupt/2024-03-04/untitled-719.jpg"),
    new URL("https://rachgia.angiang.gov.vn/sites/default/files/inline-images/BACTON1%5D_0.jpg"),
    new URL("https://laichau.dcs.vn/uploads/news/2018_06/tran-quoc-manh.jpg"),
    new URL("https://cdn2.baodongthap.vn/image/news/2025/20250817/fckimage/images2033787-11.jpg"),
    new URL("https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/102026/anh_3_cac_chien_si_trung_doi_trinh_sat_va_biet_dong_doi_cua_tai_nha_trang_nam_1945_20261022152207_copy_20261022201624.jpg"),
    new URL("https://media.quangninh.gov.vn/618ca5c4-79b3-478a-8adb-4184369067f7/Libraries/HinhAnhBaiViet/thu%20huyen/nam%202023/thang%2010/tuan%201/c%C3%A1i%20n%C3%B4i3.jpg"),
    new URL("https://imgprofile.vnanet.vn/media/graphic/profile/2024/05/04/01042024-th-51.jpeg"),
    new URL("https://imgprofile.vnanet.vn/media/graphic/profile/2024/03/19/tran-can-anh-hung-llvtnd.png"),
    ...(process.env.LOCAL_HEROES_E2E === "1" ? [{ protocol: "https" as const, hostname: "example.invalid", pathname: "/local-heroes/**" }] : []),
  ] },
  ...(process.env.LOCAL_HEROES_ADMIN_E2E === "1" ? { distDir: ".next-local-heroes-admin" }
    : process.env.LOCAL_HEROES_E2E === "1" ? { distDir: ".next-local-heroes" } : {}),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
