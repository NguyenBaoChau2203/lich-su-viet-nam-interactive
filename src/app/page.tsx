const productPillars = [
  {
    index: "01",
    title: "Dòng thời gian",
    detail: "Theo dõi sự kiện theo niên đại và từng giai đoạn lịch sử.",
  },
  {
    index: "02",
    title: "Bản đồ sự kiện",
    detail: "Kết nối câu chuyện với địa danh và không gian diễn ra.",
  },
  {
    index: "03",
    title: "Nguồn minh bạch",
    detail: "Mỗi dữ kiện đều có xuất xứ và mức độ chắc chắn rõ ràng.",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="masthead" aria-label="Thông tin dự án">
        <span className="brand-mark" aria-hidden="true">
          SỬ
        </span>
        <p>Dự án học tập tương tác · Lịch sử lớp 12</p>
        <span className="status">Nền tảng MVP</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">ĐỒ ÁN CƠ SỞ NGÀNH</p>
          <h1 id="page-title">Khám phá lịch sử Việt Nam</h1>
          <p className="lede">
            Một cách học trực quan để lần theo các dấu mốc, địa danh và nhân vật
            đã tạo nên dòng chảy lịch sử dân tộc.
          </p>
          <a className="text-link" href="#pham-vi">
            Xem phạm vi phiên bản đầu
            <span aria-hidden="true"> ↓</span>
          </a>
        </div>

        <div className="era-figure" aria-label="Phác thảo dòng thời gian">
          <p className="era-label">DÒNG CHẢY LỊCH SỬ</p>
          <ol>
            <li>
              <span>1858</span>
              <strong>Khởi đầu thời cận đại</strong>
            </li>
            <li>
              <span>1945</span>
              <strong>Kỷ nguyên độc lập</strong>
            </li>
            <li>
              <span>1975</span>
              <strong>Đất nước thống nhất</strong>
            </li>
          </ol>
          <p className="figure-note">Dữ liệu minh họa · sẽ được thẩm định nguồn</p>
        </div>
      </section>

      <section className="scope" id="pham-vi" aria-labelledby="scope-title">
        <div className="scope-heading">
          <p className="eyebrow">PHIÊN BẢN ĐẦU TIÊN</p>
          <h2 id="scope-title">Tập trung vào trải nghiệm học cốt lõi</h2>
          <p>
            25–35 sự kiện tiêu biểu, đủ sâu để hữu ích và đủ gọn để hoàn thiện
            tốt trong phạm vi môn học.
          </p>
        </div>

        <ol className="pillar-list">
          {productPillars.map((pillar) => (
            <li key={pillar.index}>
              <span>{pillar.index}</span>
              <div>
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer>
        <p>Đang chuẩn bị nội dung · Không dùng dữ kiện chưa kiểm chứng</p>
        <p>2026</p>
      </footer>
    </main>
  );
}
