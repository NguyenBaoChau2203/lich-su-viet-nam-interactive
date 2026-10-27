import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkgDir = path.join(root, "supabase/content/heritage-sites/v1");

const sitesPath = path.join(pkgDir, "sites.json");
const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf-8"));

// Batch C accepted sites mapping (17 sites)
const batchCUpdates = {
  "cau-ham-rong": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Yết hầu giao thông huyết mạch chi viện tiền tuyến",
        body: "Cầu Hàm Rồng bắc qua sông Mã (thành phố Thanh Hóa) là cây cầu đường sắt và đường bộ độc đạo trên tuyến giao thông huyết mạch Bắc - Nam. Trong những năm kháng chiến chống Mỹ, cây cầu giữ vị trí chiến lược sống còn để vận chuyển vũ khí, lương thực và bộ đội từ hậu phương lớn miền Bắc chi viện cho tiền tuyến lớn miền Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-cau-ham-rong",
            locator: "Hồ sơ di tích, mục Vị trí chiến lược cầu Hàm Rồng",
            scopeNote: "Vị trí huyết mạch giao thông chi viện chiến trường miền Nam"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Tuyến chi viện chiến lược Bắc - Nam và phong trào bảo vệ giao thông"
          }
        ]
      },
      {
        heading: "Bản anh hùng ca bắn rơi 117 máy bay Mỹ",
        body: "Từ năm 1964 đến 1972, không quân Mỹ đã trút hàng vạn tấn bom đạn tinh vi nhằm chặt đứt cầu Hàm Rồng. Quân và dân Hàm Rồng - Nam Ngạn gồm bộ đội cao xạ, không quân, dân quân tự vệ nữ đã kiên cường bám trụ trận địa, giáng trả mãnh liệt, bắn rơi 117 máy bay hiện đại của Mỹ, giữ vững nhịp cầu thông suốt trong mọi tình huống hiểm nghèo.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-cau-ham-rong",
            locator: "Hồ sơ chiến lệ Hàm Rồng 1965-1972",
            scopeNote: "Chiến công bắn rơi 117 máy bay Mỹ và tinh thần bám trụ nhịp cầu"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến thắng Hàm Rồng - biểu tượng kiên cường chống chiến tranh phá hoại"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Cầu Hàm Rồng được xếp hạng Di tích Lịch sử Quốc gia năm 1975. Bên cạnh cây cầu thép lịch sử soi bóng dòng sông Mã là đồi C4, đồi Quyết Thắng và Tượng đài Thanh niên xung phong Hàm Rồng – điểm đến giáo dục truyền thống yêu nước hào hùng cho các thế hệ trẻ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-cau-ham-rong",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1975",
            scopeNote: "Xếp hạng cấp quốc gia Cầu Hàm Rồng"
          }
        ]
      }
    ],
    media: [
      {
        key: "ham-rong-nhip-cau-thep",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Ham_Rong_Thanh_Hoa.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cau_Ham_Rong_Thanh_Hoa.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cây cầu Hàm Rồng bằng thép kiên cường vắt qua dòng sông Mã oai hùng tại Thanh Hóa.",
        altText: "Nhịp cầu thép sừng sững bắc qua dòng sông Mã rộng lớn uốn lượn dưới chân núi đá râm mát",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "thanh-nha-ho": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Kinh đô đá độc nhất vô nhị ở Đông Nam Á",
        body: "Thành nhà Hồ (còn gọi là thành Tây Đô) được Hồ Quý Ly cho xây dựng vào mùa xuân năm 1397 tại huyện Vĩnh Lộc, tỉnh Thanh Hóa. Đây là tòa thành lũy bằng đá duy nhất còn lại ở Đông Nam Á và là một trong số rất ít các tòa thành đá kiên cố trên toàn thế giới.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thanh-nha-ho",
            locator: "Hồ sơ đệ trình UNESCO Thành nhà Hồ, trang 25",
            scopeNote: "Xây dựng năm 1397 dưới triều Hồ Quý Ly tại Vĩnh Lộc"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Cải cách Hồ Quý Ly và kinh thành Tây Đô",
            scopeNote: "Kỹ thuật xây dựng thành lũy bằng đá thời nhà Hồ"
          }
        ]
      },
      {
        heading: "Kỹ nghệ ghép đá bậc thầy và nghệ thuật kiến trúc",
        body: "Tòa thành được ghép bằng những khối đá vôi khổng lồ nặng từ 10 đến hơn 20 tấn, được đẽo gọt phẳng phiu và xếp khít khao không dùng vữa kết dính. Bốn cổng thành bốn phía xây theo lối vòm cuốn đá cuốn hút tinh xảo, thể hiện đỉnh cao kỹ thuật khai thác, vận chuyển và xây dựng công trình phòng thủ thời trung đại Đại Việt.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thanh-nha-ho",
            locator: "Khảo cổ học kiến trúc vòm đá Thành nhà Hồ",
            scopeNote: "Kỹ thuật đẽo gọt và ghép khối đá vôi không dùng vữa"
          }
        ]
      },
      {
        heading: "Di sản Văn hóa Thế giới ngày nay",
        body: "Năm 2011, UNESCO đã chính thức công nhận Thành nhà Hồ là Di sản Văn hóa Thế giới. Năm 2012, Thủ tướng Chính phủ xếp hạng công trình là Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg, bảo tồn nguyên vẹn 4 cổng vòm đá cổ kính cùng dấu tích hào thành và trục đường hoàng đạo linh thiêng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thanh-nha-ho",
            locator: "Văn bằng công nhận UNESCO 2011 và Quyết định 548/QĐ-TTg",
            scopeNote: "Xếp hạng Di sản văn hóa thế giới và Di tích quốc gia đặc biệt"
          }
        ]
      }
    ],
    media: [
      {
        key: "thanh-nha-ho-cong-nam",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_nha_Ho_Cong_Nam.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Thanh_nha_Ho_Cong_Nam.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cổng Nam Thành nhà Hồ với 3 vòm cuốn bằng đá nguyên khối tráng lệ trải qua hơn 6 thế kỷ.",
        altText: "Bức tường thành bằng đá xám vĩ đại với ba cửa vòm vươn cao giữa cánh đồng cỏ rộng",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "khu-di-tich-kim-lien": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Quê hương cội nguồn nuôi dưỡng tâm hồn Bác Hồ",
        body: "Khu di tích lịch sử Kim Liên (huyện Nam Đàn, tỉnh Nghệ An) gồm làng Hoàng Trù (quê ngoại) và làng Sen (quê nội) của Chủ tịch Hồ Chí Minh. Nơi đây đã sinh thành và nuôi dưỡng Người trong những năm tháng ấu thơ (1890–1895 và 1901–1906), hun đúc nên lòng yêu nước nồng nàn và ý chí cứu nước vĩ đại.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kim-lien",
            locator: "Hồ sơ di tích quốc gia đặc biệt Kim Liên, phần Tổng quan",
            scopeNote: "Niên thiếu của Bác Hồ tại quê ngoại Hoàng Trù và quê nội Làng Sen"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Quê hương và thời niên thiếu của Lãnh tụ Nguyễn Ái Quốc"
          }
        ]
      },
      {
        heading: "Nếp nhà tranh giản dị và tấm gương nhà nho yêu nước",
        body: "Dưới mái nhà tranh vách nứa đơn sơ của cụ Phó bảng Nguyễn Sinh Sắc và thân mẫu Hoàng Thị Loan, cậu bé Nguyễn Sinh Cung đã sớm tiếp thu truyền thống hiếu học, chứng kiến nỗi thống khổ của người dân mất nước và tinh thần bất khuất của các sĩ phu yêu nước như cụ Phan Bội Châu thường ghé đàm đạo thế sự.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kim-lien",
            locator: "Hồ sơ di tích nếp nhà tranh Làng Sen",
            scopeNote: "Nếp nhà tranh đơn sơ và ảnh hưởng từ thân phụ Nguyễn Sinh Sắc"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Kim Liên được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể bảo tồn các nếp nhà cổ, giếng Cốc, lò rèn cố Điền và khu mộ bà Hoàng Thị Loan trên núi Động Tranh, là địa chỉ đỏ thiêng liêng thu hút hàng triệu đồng bào và khách quốc tế.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kim-lien",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Khu di tích Kim Liên"
          }
        ]
      }
    ],
    media: [
      {
        key: "kim-lien-nha-tranh-lang-sen",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nha_Bac_Ho_Lang_Sen_Nghe_An.jpg",
        era: "today",
        yearTaken: 2020,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Nếp nhà lá 5 gian đơn sơ mộc mạc của gia đình Bác Hồ tại Làng Sen, Kim Liên, Nam Đàn, Nghệ An.",
        altText: "Ngôi nhà gỗ mái tranh mộc mạc nép mình dưới rặng tre và hàng cau xanh ngát",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "truong-bon": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Tọa độ lửa trên tuyến chi viện Trường Sơn",
        body: "Truông Bồn là một đoạn đèo dốc hiểm trở dài khoảng 5km trên tuyến Quốc lộ 15A qua xã Mỹ Sơn, huyện Đô Lương, Nghệ An. Nơi đây là điểm nút giao thông yết hầu kết nối các tuyến huyết mạch chi viện sức người, sức của từ miền Bắc vào chiến trường miền Nam trong kháng chiến chống Mỹ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-truong-bon",
            locator: "Hồ sơ di tích lịch sử Truông Bồn, phần Bối cảnh",
            scopeNote: "Vị trí yết hầu chiến lược của Quốc lộ 15A qua Truông Bồn"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Tuyến đường huyết mạch Trường Sơn và tinh thần TNXP"
          }
        ]
      },
      {
        heading: "Sự hy sinh anh dũng của 13 chiến sĩ TNXP ngày 31/10/1968",
        body: "Rạng sáng ngày 31/10/1968, chỉ vài giờ trước khi lệnh ngừng ném bom toàn miền Bắc của Mỹ có hiệu lực, máy bay Mỹ đã trút bom xuống trận địa Truông Bồn. 13 chiến sĩ thanh niên xung phong (11 nữ, 2 nam) thuộc 'Tiểu đội thép' Đại đội 317 đã anh dũng hy sinh khi đang san lấp hố bom thông đường cho đoàn xe ra trận.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-truong-bon",
            locator: "Hồ sơ di tích, sự kiện rạng sáng ngày 31/10/1968",
            scopeNote: "13 chiến sĩ TNXP Đại đội 317 hy sinh khi thông đường"
          }
        ]
      },
      {
        heading: "Khu tưởng niệm Quốc gia ngày nay",
        body: "Ghi nhận sự cống hiến quên mình vì Tổ quốc, Khu di tích lịch sử Truông Bồn được xếp hạng Di tích Lịch sử Quốc gia năm 2013. Nơi đây xây dựng đài tưởng niệm, khu mộ chung trang nghiêm của 13 liệt sĩ TNXP anh hùng, trở thành biểu tượng bất tử của chủ nghĩa anh hùng cách mạng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-truong-bon",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 2013",
            scopeNote: "Xếp hạng cấp quốc gia Khu di tích lịch sử Truông Bồn"
          }
        ]
      }
    ],
    media: [
      {
        key: "truong-bon-khu-tuong-niem",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Truong_Bon_Nghe_An.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Khu_di_tich_Truong_Bon_Nghe_An.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Khu tưởng niệm Di tích Lịch sử Quốc gia Truông Bồn – nơi ghi dấu sự hy sinh anh dũng của 13 chiến sĩ TNXP.",
        altText: "Khuôn viên tưởng niệm trang nghiêm với đài tháp lửa vươn cao giữa núi rừng Đô Lương",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "nga-ba-dong-loc": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Yết hầu lửa trên tuyến đường Trường Sơn huyền thoại",
        body: "Ngã ba Đồng Lộc (huyện Can Lộc, tỉnh Hà Tĩnh) là giao điểm huyết mạch giữa đường 15A và đường 22 trên dãy Trường Sơn. Mọi chuyến hàng chi viện cho chiến trường miền Nam đều phải đi qua cửa ngõ yết hầu này. Trong năm 1968, máy bay Mỹ đã trút xuống nơi đây gần 50.000 quả bom các loại hòng biến vùng đất thành bình địa.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nga-ba-dong-loc",
            locator: "Hồ sơ di tích quốc gia đặc biệt Ngã ba Đồng Lộc, phần Bối cảnh",
            scopeNote: "Tọa độ lửa giao điểm đường 15A và gần 50.000 quả bom năm 1968"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Tuyến đường huyết mạch Trường Sơn và ngã ba Đồng Lộc"
          }
        ]
      },
      {
        heading: "Mười đóa hoa bất tử nơi Ngã ba Đồng Lộc",
        body: "Khoảng 16 giờ 30 phút ngày 24/7/1968, trong lúc đang san lấp hố bom dưới làn hỏa lực địch để mở đường cho xe qua, một quả bom oan nghiệt đã rơi trúng căn hầm trú ẩn của Tiểu đội 4 (Đại đội 552) cướp đi sinh mạng của 10 nữ liệt sĩ thanh niên xung phong do chị Võ Thị Tần làm Tiểu đội trưởng. Sự hy sinh kiên cường của 10 cô gái tuổi mười tám đôi mươi đã trở thành biểu tượng bất tử của lòng quả cảm vì Tổ quốc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nga-ba-dong-loc",
            locator: "Hồ sơ sự kiện 16h30 ngày 24/7/1968",
            scopeNote: "Sự hy sinh của 10 nữ liệt sĩ TNXP do Võ Thị Tần chỉ huy"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Gương hy sinh anh dũng của 10 nữ liệt sĩ ngã ba Đồng Lộc"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Ngã ba Đồng Lộc được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây bảo tồn cụm tượng đài TNXP, hố bom lịch sử, tháp chuông tưởng niệm và khu mộ 10 nữ liệt sĩ luôn ngập tràn hoa trắng tri ân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nga-ba-dong-loc",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Ngã ba Đồng Lộc"
          }
        ]
      }
    ],
    media: [
      {
        key: "dong-loc-khu-tuong-niem",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Nga_ba_Dong_Loc_Ha_Tinh.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nga_ba_Dong_Loc_Ha_Tinh.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Quần thể Khu tưởng niệm Di tích Quốc gia Đặc biệt Ngã ba Đồng Lộc tại Can Lộc, Hà Tĩnh.",
        altText: "Khu di tích trang nghiêm với tượng đài và tháp chuông tưởng niệm giữa thung lũng xanh",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: [
      {
        youtubeId: "W4P81Jc96zU",
        title: "Ký ức ngã ba Đồng Lộc – Mười đóa hoa bất tử",
        channel: "Truyền hình Hà Tĩnh HTTV",
        channelUrl: "https://www.youtube.com/@httv",
        note: "Phim tư liệu lịch sử tái hiện khúc tráng ca 10 nữ liệt sĩ thanh niên xung phong ngã ba Đồng Lộc.",
        embedCheckedAt: "2026-10-27"
      }
    ]
  },

  "thanh-co-quang-tri": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Chiến trường ác liệt mùa hè đỏ lửa năm 1972",
        body: "Thành cổ Quảng Trị nằm ở trung tâm thị xã Quảng Trị bên dòng sông Thạch Hãn. Mùa hè năm 1972, sau khi quân ta giải phóng hoàn toàn tỉnh Quảng Trị, quân đội Sài Gòn có hỏa lực không quân và pháo hạm Mỹ yểm trợ tối đa đã mở cuộc phản công quy mô lớn hòng tái chiếm Thành cổ để giành ưu thế trên bàn đàm phán Hội nghị Paris.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thanh-co-quang-tri",
            locator: "Hồ sơ di tích Thành cổ Quảng Trị, phần Bối cảnh chiến dịch 1972",
            scopeNote: "Cuộc phản công tái chiếm Thành cổ và bối cảnh bàn đàm phán Paris"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Cuộc tiến công chiến lược năm 1972 và chiến sự Thành cổ Quảng Trị"
          }
        ]
      },
      {
        heading: "81 ngày đêm máu lửa và khúc tráng ca bất diệt",
        body: "Trong suốt 81 ngày đêm (từ 28/6 đến 16/9/1972), quân Mỹ - ngụy đã dội xuống thị xã và Thành cổ Quảng Trị hơn 328.000 tấn bom đạn, tương đương sức công phá của 7 quả bom nguyên tử ném xuống Hiroshima. Cán bộ, chiến sĩ quân giải phóng đã kiên cường giành giật từng tấc đất, chiến hào, viết nên khúc tráng ca bất tử bên dòng sông Thạch Hãn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thanh-co-quang-tri",
            locator: "Hồ sơ 81 ngày đêm chiến đấu bảo vệ Thành cổ",
            scopeNote: "Hơn 328.000 tấn bom đạn trong 81 ngày đêm từ 28/6 đến 16/9/1972"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Ý nghĩa cuộc chiến đấu 81 ngày đêm bảo vệ Thành cổ Quảng Trị"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Thành cổ Quảng Trị được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Đài tưởng niệm trung tâm được thiết kế hình nấm mồ chung mô phỏng ngọn thiên đăng linh thiêng tưởng niệm hàng ngàn anh hùng liệt sĩ đã ngã xuống trong lòng đất mẹ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thanh-co-quang-tri",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Thành cổ Quảng Trị"
          }
        ]
      }
    ],
    media: [
      {
        key: "quang-tri-thanh-co-dai-tuong-niem",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Thanh_co_Quang_Tri_Dai_tuong_niem.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Thanh_co_Quang_Tri_Dai_tuong_niem.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Đài tưởng niệm trung tâm Thành cổ Quảng Trị mô phỏng ngọn thiên đăng tri ân các anh hùng liệt sĩ.",
        altText: "Đài tưởng niệm hình bát giác uy nghiêm giữa công viên cỏ xanh rợp bóng cây Thành cổ Quảng Trị",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "doi-bo-hien-luong-ben-hai": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vĩ tuyến 17 và nỗi đau chia cắt hơn 20 năm",
        body: "Theo Hiệp định Genève năm 1954, sông Bến Hải (thuộc huyện Vĩnh Linh và Gio Linh, tỉnh Quảng Trị) chảy dọc theo vĩ tuyến 17 được chọn làm giới tuyến quân sự tạm thời để chờ ngày tổng tuyển cử thống nhất đất nước. Tuy nhiên, đế quốc Mỹ và chính quyền tay sai đã xé bỏ hiệp định, biến sông Bến Hải thành ranh giới chia cắt hai miền Nam - Bắc ròng rã suốt hơn 20 năm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-hien-luong-ben-hai",
            locator: "Hồ sơ di tích quốc gia đặc biệt Đôi bờ Hiền Lương - Bến Hải, phần Bối cảnh",
            scopeNote: "Hiệp định Genève 1954 quy định giới tuyến quân sự tạm thời tại vĩ tuyến 17"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)",
            scopeNote: "Vĩ tuyến 17 chia cắt đất nước và khát vọng hòa bình thống nhất"
          }
        ]
      },
      {
        heading: "Cuộc đọ sức biểu tượng: Cờ Tổ quốc và âm thanh đôi bờ",
        body: "Tại đôi bờ Hiền Lương đã diễn ra những cuộc đọ sức chính trị quyết liệt chưa từng có: cuộc chiến màu sơn trên cầu Hiền Lương, cuộc chiến công suất loa phóng thanh và đặc biệt là cuộc chiến chọi cờ tại cột cờ bờ Bắc. Dù địch trút hàng vạn quả bom hòng gục ngã cột cờ, quân và dân bờ Bắc Vĩnh Linh vẫn kiên cường bảo vệ lá cờ đỏ sao vàng luôn tung bay kiêu hãnh.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-hien-luong-ben-hai",
            locator: "Hồ sơ di tích, mục Các cuộc đấu trí biểu tượng đôi bờ",
            scopeNote: "Cuộc chiến giữ cờ Tổ quốc bờ Bắc và các cuộc đọ sức loa phóng thanh"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Đôi bờ Hiền Lương - Bến Hải được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Cầu Hiền Lương lịch sử sơn hai màu xanh - vàng, cột cờ bờ Bắc cao 38m và cụm tượng đài 'Khát vọng thống nhất non sông' là chứng nhân bất tử cho khát vọng hòa bình thống nhất của dân tộc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-hien-luong-ben-hai",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Đôi bờ Hiền Lương - Bến Hải"
          }
        ]
      }
    ],
    media: [
      {
        key: "hien-luong-cau-hien-luong",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cau_Hien_Luong_Ben_Hai_Quang_Tri.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cầu Hiền Lương lịch sử bắc qua sông Bến Hải chia cắt vĩ tuyến 17 được phục dựng nguyên trạng.",
        altText: "Cây cầu sắt sơn hai màu xanh và vàng chia đôi nhịp cầu bắc qua con sông Bến Hải êm đềm",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "ngo-mon-hue": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cổng chính tráng lệ của Hoàng thành Huế",
        body: "Ngọ Môn là cổng chính phía nam của Hoàng thành Huế, được xây dựng năm 1833 dưới triều Vua Minh Mạng. Công trình kết hợp tinh xảo giữa nền đài đá đồ sộ trổ 5 cửa và lầu Ngũ Phụng bằng gỗ sơn son thếp vàng, là đỉnh cao kiến trúc cung đình triều Nguyễn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ngo-mon-hue",
            locator: "Hồ sơ di sản thế giới Quần thể di tích Cố đô Huế, mục Ngọ Môn",
            scopeNote: "Xây dựng năm 1833 dưới triều Minh Mạng và kiến trúc lầu Ngũ Phụng"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Sự kiện Bảo Đại thoái vị tại cửa Ngọ Môn chiều 30/8/1945"
          }
        ]
      },
      {
        heading: "Lễ thoái vị của Vua Bảo Đại chiều 30/8/1945",
        body: "Chiều ngày 30/8/1945, trước cửa Ngọ Môn rực rỡ cờ đỏ sao vàng và trước sự chứng kiến của hàng vạn nhân dân xứ Huế, Vua Bảo Đại đã đọc Chiếu thoái vị, trao ấn vàng 'Hoàng đế chi bảo' và kiếm bạc nạm ngọc cho phái đoàn Chính phủ lâm thời do đồng chí Trần Huy Liệu làm trưởng đoàn. Câu nói 'Thà làm dân một nước độc lập hơn làm vua một nước nô lệ' đã chấm dứt vĩnh viễn chế độ quân chủ chuyên chế ngàn năm tại Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ngo-mon-hue",
            locator: "Hồ sơ sự kiện thoái vị ngày 30/8/1945",
            scopeNote: "Bảo Đại trao ấn kiếm cho phái đoàn Chính phủ lâm thời"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Ý nghĩa lịch sử chấm dứt chế độ phong kiến triều Nguyễn"
          }
        ]
      },
      {
        heading: "Di sản Văn hóa Thế giới ngày nay",
        body: "Ngọ Môn là biểu tượng tiêu biểu của Quần thể Di tích Cố đô Huế – Di sản Văn hóa Thế giới đầu tiên của Việt Nam được UNESCO vinh danh năm 1993. Sau đợt trùng tu lớn hoàn thành năm 2021, Ngọ Môn mở cửa đón hàng triệu du khách chiêm ngưỡng nét đẹp kiêu hãnh của di sản dân tộc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ngo-mon-hue",
            locator: "Văn bằng UNESCO 1993 và Dự án trùng tu Ngọ Môn 2021",
            scopeNote: "Di sản thế giới và công tác bảo tồn di tích"
          }
        ]
      }
    ],
    media: [
      {
        key: "ngo-mon-hue-lau-ngu-phung",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ngo_Mon_Hue_Imperial_City.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ngo_Mon_Hue_Imperial_City.jpg",
        era: "today",
        yearTaken: 2021,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cửa Ngọ Môn và lầu Ngũ Phụng uy nghi tráng lệ – nơi Vua Bảo Đại thoái vị ngày 30/8/1945.",
        altText: "Cổng đá lớn màu xám có 5 cửa vòm nâng đỡ lầu gác gỗ nhiều tầng mái ngói vàng rực rỡ",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "kinh-thanh-hue-1968": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Chiến trường trọng điểm Tết Mậu Thân 1968",
        body: "Trong cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968, mặt trận Trị - Thiên - Huế là một trong những hướng tiến công chiến lược then chốt. Đêm 30 rạng sáng ngày 31/1/1968, các lực lượng vũ trang giải phóng phối hợp cùng nhân dân đã bất ngờ đồng loạt tiến công các căn cứ quân sự của Mỹ và quân đội Sài Gòn tại thành phố Huế.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kinh-thanh-hue-1968",
            locator: "Lịch sử mặt trận Huế Tết Mậu Thân 1968, phần Mở màn",
            scopeNote: "Đòn tiến công bất ngờ đêm 30 rạng sáng 31/1/1968 tại Huế"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968"
          }
        ]
      },
      {
        heading: "25 ngày đêm làm chủ thành phố và cờ bay trên đỉnh Kỳ Đài",
        body: "Sáng sớm ngày 31/1/1968, lá cờ nửa đỏ nửa xanh với ngôi sao vàng của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam rộng lớn đã tung bay kiêu hãnh trên đỉnh Kỳ Đài trước Ngọ Môn. Quân và dân ta đã anh dũng làm chủ thành phố Huế suốt 25 ngày đêm liên tục, bẻ gãy nhiều đợt phản kích điên cuồng của lính thủy đánh bộ Mỹ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kinh-thanh-hue-1968",
            locator: "Hồ sơ sự kiện cắm cờ trên đỉnh Kỳ Đài sáng 31/1/1968",
            scopeNote: "Lá cờ giải phóng tung bay trên Kỳ Đài và 25 ngày đêm làm chủ thành phố"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Ý nghĩa chiến dịch Huế Mậu Thân 1968 làm phá sản chiến lược Chiến tranh cục bộ"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Kỳ Đài Huế ngày nay",
        body: "Kỳ Đài (Cột cờ Kinh thành Huế) được xây dựng năm 1807 gồm 3 tầng bệ đá đồ sộ cao hơn 17m và cột cờ cao 37m. Công trình là chứng nhân cho những chuyển biến trọng đại của lịch sử hiện đại Việt Nam và là điểm tham quan tiêu biểu trong Quần thể Cố đô Huế.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kinh-thanh-hue-1968",
            locator: "Hồ sơ kiến trúc Kỳ Đài Huế",
            scopeNote: "Quy chuẩn kiến trúc Kỳ Đài và công tác bảo tồn"
          }
        ]
      }
    ],
    media: [
      {
        key: "ky-dai-hue-cot-co",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ky_Dai_Hue_Flag_Tower.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ky_Dai_Hue_Flag_Tower.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Kỳ Đài Huế sừng sững trước Hoàng thành – nơi lá cờ Mặt trận Giải phóng tung bay suốt 25 ngày đêm Tết Mậu Thân 1968.",
        altText: "Bệ đài gạch ba tầng đồ sộ nâng đỡ cột cờ cao vút giữa quảng trường Ngọ Môn",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "chien-thang-nui-thanh-1965": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Quân viễn chinh Mỹ đổ bộ và bối cảnh chiến trường",
        body: "Tháng 3/1965, hai tiểu đoàn lính thủy đánh bộ Mỹ đổ bộ vào Đà Nẵng và sau đó lập căn cứ liên hợp Chu Lai. Đế quốc Mỹ ồ ạt triển khai chiến lược 'Chiến tranh cục bộ', đưa quân viễn chinh Mỹ trực tiếp tham chiến nhằm đè bẹp lực lượng vũ trang cách mạng miền Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-nui-thanh",
            locator: "Hồ sơ di tích Chiến thắng Núi Thành, phần Bối cảnh",
            scopeNote: "Mỹ đổ quân vào Chu Lai tháng 3/1965 mở đầu Chiến tranh cục bộ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Mỹ tiến hành chiến lược Chiến tranh cục bộ ở miền Nam"
          }
        ]
      },
      {
        heading: "Trận đánh phủ đầu lính thủy đánh bộ Mỹ đêm 25 rạng sáng 26/5/1965",
        body: "Để hạ uy thế quân viễn chinh Mỹ, đêm 25 rạng sáng 26/5/1965, Đại đội 2 (Tiểu đoàn 70 bộ đội địa phương Quảng Nam) gồm các chiến sĩ cảm tử do đồng chí Trần Ngọc Ảnh chỉ huy đã bất ngờ tập kích cứ điểm Núi Thành. Chỉ trong vòng 30 phút chiến đấu dũng mãnh, ta đã tiêu diệt hoàn toàn một đại đội lính thủy đánh bộ Mỹ, cắm cờ chiến thắng trên đỉnh đồi.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-nui-thanh",
            locator: "Hồ sơ trận đánh Núi Thành đêm 25/5/1965",
            scopeNote: "Đại đội 2 tiêu diệt gọn đại đội lính thủy đánh bộ Mỹ trong 30 phút"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến thắng Núi Thành mở đầu phong trào Tìm Mỹ mà đánh"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Chiến thắng Núi Thành chứng minh khả năng quân và dân ta hoàn toàn có thể đánh thắng quân đội viễn chinh Mỹ trang bị hiện đại. Tượng đài Chiến thắng Núi Thành được xây dựng trên đồi cao xã Tam Nghĩa, huyện Núi Thành và được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1979.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-nui-thanh",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1979",
            scopeNote: "Xếp hạng cấp quốc gia Tượng đài Chiến thắng Núi Thành"
          }
        ]
      }
    ],
    media: [
      {
        key: "nui-thanh-tuong-dai-chien-thang",
        fileUrl: "https://danang.gov.vn/uploads/images/2021/05/tuong-dai-chien-thang-nui-thanh.jpg",
        sourcePageUrl: "https://danang.gov.vn/di-tich-chien-thang-nui-thanh",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài Chiến thắng Núi Thành sừng sững trên đỉnh đồi – nơi mở đầu phong trào đánh thắng quân viễn chinh Mỹ.",
        altText: "Tượng đài người chiến sĩ giải phóng quân tay nắm chắc súng vươn cao trên đỉnh đồi",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1200,
        height: 800,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "khu-den-thap-my-son": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Thánh địa tôn giáo cổ xưa của vương quốc Champa",
        body: "Khu đền tháp Mỹ Sơn nằm trong một thung lũng kín đáo bao quanh bởi dãy núi Chư Pơ hùng vĩ (thuộc huyện Duy Xuyên). Từ thế kỷ IV đến thế kỷ XIII, nơi đây là thánh địa tôn giáo thiêng liêng và là trung tâm tổ chức các nghi lễ đăng quang, hiến tế của các triều vua Champa.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-my-son",
            locator: "Hồ sơ di sản thế giới Khu đền tháp Mỹ Sơn, phần Lịch sử",
            scopeNote: "Thánh địa tôn giáo Champa từ thế kỷ IV đến thế kỷ XIII"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Văn minh Champa và di sản kiến trúc đền tháp",
            scopeNote: "Thánh địa Mỹ Sơn và nghệ thuật điêu khắc Chăm"
          }
        ]
      },
      {
        heading: "Kỹ nghệ xây gạch nung bí ẩn và nghệ thuật điêu khắc đá",
        body: "Quần thể gồm hơn 70 công trình đền tháp mang nhiều phong cách kiến trúc đặc sắc thờ thần Shiva. Điểm độc đáo kỳ diệu nhất là kỹ thuật liên kết các viên gạch nung đỏ mà không thấy mạch vữa kết dính cùng các bức phù điêu vũ nữ Apsara mềm mại được chạm khắc trực tiếp vào thân tháp gạch.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-my-son",
            locator: "Khảo sát kiến trúc gạch nung và điêu khắc Mỹ Sơn",
            scopeNote: "Kỹ thuật xây gạch không lộ mạch vữa và phù điêu vũ nữ Apsara"
          }
        ]
      },
      {
        heading: "Di sản Văn hóa Thế giới ngày nay",
        body: "Năm 1999, UNESCO chính thức ghi danh Khu đền tháp Mỹ Sơn là Di sản Văn hóa Thế giới nhờ các giá trị ngoại hạng toàn cầu về lịch sử văn hóa. Năm 2009, di tích được xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg của Thủ tướng Chính phủ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-my-son",
            locator: "Văn bằng UNESCO 1999 và Quyết định số 1272/QĐ-TTg",
            scopeNote: "Xếp hạng Di sản văn hóa thế giới và Di tích quốc gia đặc biệt"
          }
        ]
      }
    ],
    media: [
      {
        key: "my-son-quan-the-den-thap",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/My_Son_Sanctuary_Quang_Nam.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:My_Son_Sanctuary_Quang_Nam.jpg",
        era: "today",
        yearTaken: 2020,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Quần thể các đền tháp gạch nung rêu phong cổ kính giữa thung lũng xanh Thánh địa Mỹ Sơn.",
        altText: "Các khối đền tháp Chăm bằng gạch nung màu đỏ trầm sừng sững giữa cây rừng nhiệt đới",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "khu-chung-tich-son-my": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vụ thảm sát thường dân vô tội sáng ngày 16/3/1968",
        body: "Sáng ngày 16/3/1968, một đơn vị quân viễn chinh Mỹ thuộc lực lượng đặc nhiệm Barker (Lữ đoàn 11) do trung úy William Calley chỉ huy đã đổ bộ vào làng Sơn Mỹ (thôn Mỹ Lai, xã Tịnh Khê, thành phố Quảng Ngãi). Trong vòng vài giờ đồng hồ, binh lính Mỹ đã tàn sát dã man 504 thường dân vô tội, trong đó có 182 phụ nữ, 173 trẻ em và 60 người già.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-son-my",
            locator: "Hồ sơ di tích quốc gia đặc biệt Sơn Mỹ, số liệu nạn nhân",
            scopeNote: "504 thường dân vô tội bị sát hại sáng ngày 16/3/1968"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Tội ác chiến tranh của đế quốc Mỹ tại Sơn Mỹ"
          }
        ]
      },
      {
        heading: "Lương tri thế giới thức tỉnh và làn sóng phản chiến",
        body: "Những bức ảnh tư liệu đanh thép do phóng viên chiến trường Ronald Haeberle công bố đã phơi bày toàn bộ sự thật tàn khốc về vụ thảm sát Sơn Mỹ ra trước dư luận quốc tế. Vụ việc làm rung chuyển nước Mỹ và thổi bùng phong trào phản đối chiến tranh của nhân dân Mỹ và nhân loại tiến bộ, đòi chính quyền Mỹ phải chấm dứt chiến tranh xâm lược Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-son-my",
            locator: "Tư liệu ảnh phóng viên Ronald Haeberle và dư luận thế giới",
            scopeNote: "Tác động thức tỉnh lương tri nhân loại và phong trào phản chiến quốc tế"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu chứng tích Sơn Mỹ được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2408/QĐ-TTg ngày 31/12/2014. Khuôn viên bảo tồn các nền nhà cháy rụi, hầm tránh pháo, mương nước tưởng niệm cùng Tượng đài người mẹ ôm con che chở – thông điệp trường tồn về hòa bình và nhân đạo.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-son-my",
            locator: "Quyết định số 2408/QĐ-TTg ngày 31/12/2014",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Khu chứng tích Sơn Mỹ"
          }
        ]
      }
    ],
    media: [
      {
        key: "son-my-tuong-dai-tuong-niem",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Khu_chung_tich_Son_My_Quang_Ngai.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Khu_chung_tich_Son_My_Quang_Ngai.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cụm tượng đài người mẹ Sơn Mỹ ôm con che chở trước bom đạn tại Khu chứng tích Quốc gia Đặc biệt.",
        altText: "Bức tượng đá tạc hình người mẹ quặn thắt ôm chặt đứa con nhỏ giữa vườn tưởng niệm",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "dak-to-tan-canh": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Căn cứ phòng ngự then chốt của đối phương tại Bắc Tây Nguyên",
        body: "Căn cứ Đắk Tô - Tân Cảnh (thuộc huyện Đắk Tô) từng là căn cứ quân sự kiên cố bậc nhất của quân đội Sài Gòn tại chiến trường Tây Nguyên, giữ vai trò Sở chỉ huy tiền phương Sư đoàn 22 kiểm soát toàn bộ khu vực ngã ba biên giới Việt Nam - Lào - Campuchia.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dak-to-tan-canh",
            locator: "Hồ sơ di tích Đắk Tô - Tân Cảnh, phần Cấu trúc căn cứ",
            scopeNote: "Sở chỉ huy tiền phương Sư đoàn 22 ngụy tại Bắc Tây Nguyên"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Cuộc tiến công chiến lược năm 1972 trên chiến trường Tây Nguyên"
          }
        ]
      },
      {
        heading: "Trận đánh hiệp đồng binh chủng ngày 24/4/1972",
        body: "Rạng sáng ngày 24/4/1972, lực lượng vũ trang Tây Nguyên mở cuộc tiến công hiệp đồng binh chủng thần tốc đánh thẳng vào Sở chỉ huy Tân Cảnh. Nổi bật là tấm gương chiến đấu anh dũng của kíp xe tăng T-54 mang số hiệu 377 do Trung đội trưởng Nguyễn Nhân Triển chỉ huy đã dũng cảm một mình giao chiến tiêu diệt 7 xe tăng đối phương, góp phần quyết định giải phóng hoàn toàn căn cứ Đắk Tô - Tân Cảnh.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dak-to-tan-canh",
            locator: "Hồ sơ chiến lệ trận Đắk Tô ngày 24/4/1972",
            scopeNote: "Chiến công xe tăng 377 tiêu diệt 7 xe tăng địch và giải phóng căn cứ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Thắng lợi Chiến dịch Bắc Tây Nguyên năm 1972"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Địa điểm Chiến thắng Đắk Tô - Tân Cảnh được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2280/QĐ-TTg ngày 31/12/2020. Tượng đài chiến thắng và xác xe tăng T-54 số hiệu 377 (được công nhận là Bảo vật Quốc gia) được lưu giữ trang trọng tại trung tâm thị trấn Đắk Tô.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dak-to-tan-canh",
            locator: "Quyết định số 2280/QĐ-TTg ngày 31/12/2020",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Đắk Tô - Tân Cảnh"
          }
        ]
      }
    ],
    media: [
      {
        key: "dak-to-tuong-dai-xe-tang",
        fileUrl: "https://quangngai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-dak-to.jpg",
        sourcePageUrl: "https://quangngai.gov.vn/di-tich-dak-to-tan-canh",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài Chiến thắng Đắk Tô – Tân Cảnh và xác xe tăng lịch sử tại thị trấn Đắk Tô.",
        altText: "Tượng đài chiến thắng bằng đá vươn cao bên cạnh chiếc xe tăng T-54 lịch sử",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1200,
        height: 800,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "lang-khang-chien-stor": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Làng kháng chiến bất khuất giữa đại ngàn Tây Nguyên",
        body: "Làng Stơr (thuộc xã Tơ Tung, huyện Kbang, tỉnh Gia Lai) là quê hương của Anh hùng Đinh Núp. Trong những năm kháng chiến chống thực dân Pháp (1950–1954), đồng bào Bahnar nơi đây đã đoàn kết một lòng theo Đảng, biến buôn làng thành một pháo đài du kích bất khả xâm phạm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-lang-khang-chien-stor",
            locator: "Hồ sơ di tích Làng kháng chiến Stơr, phần Tổng quan",
            scopeNote: "Buôn làng Bahnar theo kháng chiến chống Pháp giai đoạn 1950-1954"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Phong trào chiến tranh du kích của đồng bào các dân tộc Tây Nguyên"
          }
        ]
      },
      {
        heading: "Bắn Pháp chảy máu và biểu tượng Anh hùng Núp",
        body: "Dưới sự lãnh đạo mưu trí của Anh hùng Núp, dân làng Stơr đã đào hầm chông, cài bẫy đá, làm nỏ bắn tên tẩm thuốc độc để diệt giặc. Dù quân Pháp nhiều lần đốt phá buôn làng, bà con vẫn kiên cường bám rừng kháng chiến. Hình tượng kiên trung của Anh hùng Núp đã được nhà văn Nguyên Ngọc khắc họa bất hủ qua tác phẩm văn học 'Đất nước đứng lên'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-lang-khang-chien-stor",
            locator: "Hồ sơ di tích, mục Tấm gương Anh hùng Núp",
            scopeNote: "Kỹ thuật bẫy chông, bẫy đá và tiểu thuyết Đất nước đứng lên"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Làng kháng chiến Stơr được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1993. Quần thể di tích ngày nay lưu giữ nhà Rông truyền thống, Nhà lưu niệm Anh hùng Núp trưng bày cây nỏ, bộ cung tên và những kỷ vật thiêng liêng của Người con ưu tú của đại ngàn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-lang-khang-chien-stor",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1993",
            scopeNote: "Xếp hạng cấp quốc gia Làng kháng chiến Stơr"
          }
        ]
      }
    ],
    media: [
      {
        key: "stor-nha-rong-truyen-thong",
        fileUrl: "https://gialai.gov.vn/uploads/images/2021/08/lang-khang-chien-stor.jpg",
        sourcePageUrl: "https://gialai.gov.vn/di-tich-lang-stor",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Gia Lai",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Mái nhà Rông truyền thống uy nghiêm tại Làng kháng chiến Stơr – quê hương Anh hùng Núp.",
        altText: "Ngôi nhà rông Bahnar mái lợp tranh cao vút vươn thẳng lên bầu trời xanh giữa rừng cây",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1200,
        height: 800,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "bao-tang-quang-trung": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Căn cứ địa khởi nguồn phong trào nông dân Tây Sơn",
        body: "Làng Kiên Mỹ (thị trấn Phú Phong, huyện Tây Sơn) bên dòng sông Côn là quê hương của ba anh em anh hùng Tây Sơn: Nguyễn Nhạc, Nguyễn Huệ và Nguyễn Lữ. Năm 1771, ba anh em đã phất cờ khởi nghĩa với khẩu hiệu 'Lấy của người giàu chia cho người nghèo', mở đầu phong trào nông dân vĩ đại nhất lịch sử dân tộc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-bao-tang-quang-trung",
            locator: "Hồ sơ di tích quốc gia đặc biệt Tây Sơn Tam Kiệt, phần Khởi nguồn",
            scopeNote: "Ba anh em Tây Sơn dựng cờ khởi nghĩa năm 1771 tại Kiên Mỹ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Phong trào nông dân Tây Sơn và người anh hùng Nguyễn Huệ",
            scopeNote: "Khởi nghĩa Tây Sơn và sự nghiệp thống nhất non sông"
          }
        ]
      },
      {
        heading: "Đại nghiệp thống nhất và quét sạch ngoại xâm",
        body: "Dưới sự lãnh đạo thiên tài của Hoàng đế Quang Trung - Nguyễn Huệ, nghĩa quân Tây Sơn đã lật đổ các tập đoàn phong kiến cát cứ Nguyễn, Trịnh, Lê, hoàn thành đại nghiệp thống nhất đất nước; đồng thời đánh tan 5 vạn quân Xiêm tại Rạch Gầm - Xoài Mút (1785) và đại phá 29 vạn quân Mãn Thanh mùa xuân Kỷ Dậu (1789).",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-bao-tang-quang-trung",
            locator: "Hồ sơ chiến công Rạch Gầm - Xoài Mút và Ngọc Hồi - Đống Đa",
            scopeNote: "Chiến công đánh tan quân Xiêm 1785 và đại phá quân Thanh 1789"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Đền thờ Tây Sơn Tam Kiệt và Bảo tàng Quang Trung được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây bảo tồn cây me cổ thụ và giếng nước xưa hơn 300 năm tuổi của gia đình ba anh em Tây Sơn cùng dàn nhạc võ Tây Sơn vang lừng hào khí.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-bao-tang-quang-trung",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Đền thờ Tây Sơn Tam Kiệt"
          }
        ]
      }
    ],
    media: [
      {
        key: "quang-trung-tuong-dai-hoang-de",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bao_tang_Quang_Trung_Binh_Dinh.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bao_tang_Quang_Trung_Binh_Dinh.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Tượng đài Hoàng đế Quang Trung – Nguyễn Huệ oai phong lẫm liệt trước sân Bảo tàng Quang Trung.",
        altText: "Tượng đài người anh hùng áo vải cất cao thanh kiếm chỉ huy xung trận giữa quảng trường hoa",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "san-bay-thanh-son": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Căn cứ không quân quan trọng giải phóng tháng 4/1975",
        body: "Sân bay Thành Sơn (thành phố Phan Rang) là căn cứ không quân kiên cố của quân đội Sài Gòn tại vùng duyên hải Nam Trung Bộ. Giữa tháng 4/1975, trong cuộc tiến công thần tốc của cánh quân Duyên Hải, quân ta đã giải phóng sân bay Thành Sơn và thu giữ nguyên vẹn một số máy bay ném bom A-37 của địch.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-san-bay-thanh-son",
            locator: "Hồ sơ di tích Sân bay Thành Sơn, phần Giải phóng tháng 4/1975",
            scopeNote: "Thu giữ máy bay A-37 tại căn cứ Thành Sơn ngày 16/4/1975"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến dịch Hồ Chí Minh lịch sử và cuộc tiến công mùa Xuân 1975"
          }
        ]
      },
      {
        heading: "Phi đội Quyết Thắng dội bom sân bay Tân Sơn Nhất chiều 28/4/1975",
        body: "Chiều ngày 28/4/1975, thực hiện chỉ thị của Bộ Tổng Tư lệnh, Phi đội Quyết Thắng gồm 5 máy bay A-37 do phi công Nguyễn Thành Trung dẫn đường cùng các phi công Từ Đễ, Nguyễn Văn Lục, Hán Văn Quảng, Hoàng Mai Vượng đã cất cánh từ sân bay Thành Sơn, bí mật bay thẳng vào Sài Gòn ném bom chính xác phá hủy nhiều máy bay giặc tại sân bay Tân Sơn Nhất, làm tê liệt hoàn toàn không quân địch trước giờ tổng công kích.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-san-bay-thanh-son",
            locator: "Hồ sơ xuất kích của Phi đội Quyết Thắng chiều 28/4/1975",
            scopeNote: "5 phi công lái A-37 ném bom Tân Sơn Nhất làm tê liệt không quân đối phương"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Đòn tập kích đường không bất ngờ ngày 28/4/1975"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Địa điểm xuất kích của Phi đội Quyết Thắng tại Sân bay Thành Sơn được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích Lịch sử Quốc gia, là niềm tự hào của Quân chủng Phòng không - Không quân và quân dân miền Trung trong đại thắng mùa Xuân 1975.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-san-bay-thanh-son",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia",
            scopeNote: "Xếp hạng cấp quốc gia địa điểm xuất kích Phi đội Quyết Thắng"
          }
        ]
      }
    ],
    media: [
      {
        key: "thanh-son-bia-phi-doi-quyet-thang",
        fileUrl: "https://khanhhoa.gov.vn/uploads/images/2021/04/di-tich-san-bay-thanh-son.jpg",
        sourcePageUrl: "https://khanhhoa.gov.vn/di-tich-san-bay-thanh-son",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Bia di tích kỷ niệm nơi Phi đội Quyết Thắng xuất kích chiều ngày 28/4/1975 tại Sân bay Thành Sơn.",
        altText: "Bia đá di tích hình cánh chim máy bay cất cánh giữa khuôn viên sân bay rộng lớn",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1200,
        height: 800,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  },

  "thap-ba-ponagar": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Quần thể kiến trúc đền tháp Chăm-pa cổ kính bên cửa biển",
        body: "Tháp Bà Ponagar tọa lạc trên đỉnh đồi Cù Lao cao hơn 10m so với mực nước biển, soi bóng bên dòng sông Cái (thành phố Nha Trang, Khánh Hòa). Quần thể được xây dựng từ thế kỷ VIII đến thế kỷ XIII, là trung tâm tôn giáo tín ngưỡng quan trọng nhất của người Chăm ở vùng Nam Trung Bộ xưa.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thap-ba-ponagar",
            locator: "Hồ sơ di tích quốc gia đặc biệt Tháp Bà Ponagar, phần Lịch sử",
            scopeNote: "Xây dựng từ thế kỷ VIII đến XIII thờ Nữ thần Ponagar"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Di sản kiến trúc đền tháp và văn minh Champa",
            scopeNote: "Quần thể Tháp Bà Ponagar Nha Trang"
          }
        ]
      },
      {
        heading: "Nghệ thuật kiến trúc gạch nung và thờ Thánh Mẫu Thiên Y A Na",
        body: "Quần thể gồm 4 ngôi đền tháp cổ kính xây bằng gạch nung đỏ rực rỡ, trong đó tháp chính cao 23m là tuyệt tác kiến trúc thờ Nữ thần Ponagar (Thiên Y A Na Thánh Mẫu). Bên trong tháp lưu giữ bức tượng Nữ thần bằng đá hoa cương đen nguyên khối ngồi trên đài sen linh thiêng tỏa ra vẻ đẹp huyền bí.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thap-ba-ponagar",
            locator: "Hồ sơ kiến trúc tháp chính và pho tượng đá hoa cương",
            scopeNote: "Tháp chính cao 23m và pho tượng Nữ thần Ponagar ngồi trên tòa sen"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ghi nhận giá trị lịch sử và nghệ thuật kiến trúc kiệt xuất, ngày 31/12/2020, Thủ tướng Chính phủ đã ký Quyết định số 2280/QĐ-TTg xếp hạng Tháp Bà Ponagar là Di tích Quốc gia Đặc biệt. Lễ hội Tháp Bà Ponagar diễn ra vào tháng 3 âm lịch hàng năm được công nhận là Di sản Văn hóa Phi vật thể Quốc gia.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-thap-ba-ponagar",
            locator: "Quyết định số 2280/QĐ-TTg ngày 31/12/2020",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Tháp Bà Ponagar Nha Trang"
          }
        ]
      }
    ],
    media: [
      {
        key: "ponagar-quan-the-thap-chinh",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Ba_Ponagar_Nha_Trang.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Thap_Ba_Ponagar_Nha_Trang.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Các tòa tháp cổ Tháp Bà Ponagar xây bằng gạch nung đỏ rực rỡ bên bờ sông Cái Nha Trang.",
        altText: "Các khối tháp Chăm bằng gạch nung màu cam đỏ vươn cao trên đồi cây nhìn xuống cửa biển",
        isCover: true,
        pairKey: "p1",
        isReenactment: false,
        isColorized: false,
        width: 1600,
        height: 1067,
        checkedAt: "2026-10-27"
      }
    ],
    videos: []
  }
};

// Apply updates
let updatedCount = 0;
for (const site of sitesData.sites) {
  if (batchCUpdates[site.key]) {
    Object.assign(site, batchCUpdates[site.key]);
    updatedCount++;
  }
}

fs.writeFileSync(sitesPath, JSON.stringify(sitesData, null, 2) + "\n", "utf-8");
console.log(`Updated ${updatedCount} sites for Batch C in sites.json.`);
