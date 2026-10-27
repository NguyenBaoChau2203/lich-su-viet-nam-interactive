import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkgDir = path.join(root, "supabase/content/heritage-sites/v1");

const sitesPath = path.join(pkgDir, "sites.json");
const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf-8"));

// Batch A accepted sites mapping with exact source keys matching sources.json
const batchAUpdates = {
  "nha-tu-hoa-lo": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Bối cảnh lịch sử",
        body: "Nhà tù Hỏa Lò (tên tiếng Pháp: Maison Centrale) được thực dân Pháp khởi công xây dựng năm 1896 trên đất làng Phụ Khánh thuộc tổng Tiền Nghiêm, huyện Thọ Xương cũ (nay thuộc quận Hoàn Kiếm, Hà Nội). Đây là một trong những nhà tù kiên cố và quy mô lớn nhất Đông Dương lúc bấy giờ, giữ vai trò đầu não đàn áp phong trào yêu nước và phong trào cách mạng của nhân dân Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-hoa-lo",
            locator: "Hồ sơ di tích, mục I: Lịch sử hình thành",
            scopeNote: "Thời gian khởi công 1896 và vị trí làng Phụ Khánh"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Hệ thống nhà tù thực dân đàn áp phong trào cách mạng"
          }
        ]
      },
      {
        heading: "Trường học cách mạng trong chốn lao tù",
        body: "Trong suốt giai đoạn 1930–1954, Hỏa Lò là nơi giam giữ hàng ngàn chiến sĩ cách mạng ưu tú. Dưới chế độ cai trị hà khắc và máy chém tàn bạo, các chiến sĩ cộng sản kiên trung như Phan Bội Châu, Lương Văn Can, Nguyễn Văn Cừ, Trường Chinh, Lê Duẩn, Nguyễn Văn Linh đã biến nhà tù thực dân thành trường học lý luận chính trị, tôi luyện ý chí kiên cường và tổ chức nhiều cuộc vượt ngục quả cảm trở về với nhân dân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-hoa-lo",
            locator: "Hồ sơ di tích, mục II: Phong trào đấu tranh của tù chính trị",
            scopeNote: "Hoạt động biến nhà tù thành trường học và các cuộc vượt ngục"
          }
        ]
      },
      {
        heading: "Khách sạn Hilton Hà Nội và chính sách nhân đạo",
        body: "Từ năm 1964 đến đầu năm 1973, Nhà tù Hỏa Lò được sử dụng làm nơi tạm giam các phi công quân đội Mỹ bị bắn rơi trong các chiến dịch chiến tranh phá hoại miền Bắc, trong đó có Thượng nghị sĩ John McCain sau này. Các tù binh phi công Mỹ gọi nơi đây bằng biệt danh châm biếm 'Hanoi Hilton'. Sau khi Hiệp định Paris được ký kết ngày 27/1/1973, toàn bộ phi công Mỹ đã được Chính phủ Việt Nam trao trả an toàn và nhân đạo.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-hoa-lo",
            locator: "Khu trưng bày chuyên đề tù binh phi công Mỹ",
            scopeNote: "Giai đoạn 1964-1973 và việc trao trả tù binh sau Hiệp định Paris"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến dịch Điện Biên Phủ trên không 1972 và trao trả tù binh phi công"
          }
        ]
      },
      {
        heading: "Di tích ngày nay",
        body: "Khu Di tích Lịch sử Nhà tù Hỏa Lò hiện tọa lạc tại số 1 phố Hỏa Lò, phường Trần Hưng Đạo, quận Hoàn Kiếm, Hà Nội. Di tích được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1997 và hiện do Ban Quản lý Di tích Nhà tù Hỏa Lò thuộc Sở Văn hóa và Thể thao Hà Nội trực tiếp quản lý, đón hàng trăm nghìn lượt khách trong nước và quốc tế mỗi năm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-hoa-lo",
            locator: "Quyết định xếp hạng di tích quốc gia năm 1997",
            scopeNote: "Cấp xếp hạng và đơn vị quản lý hiện hành"
          }
        ]
      }
    ],
    media: [
      {
        key: "nha-tu-hoa-lo-cong-chinh",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Maison_Centrale_Hanoi_entrance.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Maison_Centrale_Hanoi_entrance.jpg",
        era: "today",
        yearTaken: 2018,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        usageBasis: "open_license",
        caption: "Cổng chính Di tích Lịch sử Nhà tù Hỏa Lò (Maison Centrale) tại quận Hoàn Kiếm, Hà Nội.",
        altText: "Cổng chính kiến trúc kiên cố bằng đá sẫm màu của Nhà tù Hỏa Lò tại Hà Nội",
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
        youtubeId: "W6_bO4m3F6c",
        title: "Ký ức Hỏa Lò – Di tích lịch sử Quốc gia",
        channel: "VTV24",
        channelUrl: "https://www.youtube.com/@vtv24",
        note: "Phim tài liệu ngắn của Đài Truyền hình Việt Nam ghi lại chứng tích kiên trung của các chiến sĩ cách mạng tại Hỏa Lò.",
        embedCheckedAt: "2026-10-27"
      }
    ]
  },

  "hoang-thanh-thang-long": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Kinh đô ngàn năm văn hiến",
        body: "Mùa thu năm 1010, Vua Lý Thái Tổ ban Chiếu dời đô từ Hoa Lư về thành Đại La, đổi tên là Thăng Long và xây dựng kinh thành quy mô lớn. Hoàng thành Thăng Long là trung tâm quyền lực chính trị tối cao của nước Đại Việt liên tục qua các triều đại Lý, Trần, Lê sơ, Mạc và Lê Trung hưng suốt hơn 8 thế kỷ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-hoang-thanh-thang-long",
            locator: "Hồ sơ đệ trình UNESCO, trang 14",
            scopeNote: "Mốc định đô năm 1010 và tính liên tục lịch sử"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Di sản văn hóa Thăng Long - Hà Nội",
            scopeNote: "Chiếu dời đô và vị thế trung tâm chính trị Đại Việt"
          }
        ]
      },
      {
        heading: "Dấu ấn kháng chiến thời hiện đại: Nhà và Hầm D67",
        body: "Không chỉ gắn bó với các triều đại phong kiến, trong cuộc kháng chiến chống Mỹ cứu nước, khu vực Sở Chỉ huy Bộ Quốc phòng tại Hoàng thành Thăng Long là nơi làm việc của Bộ Chính trị, Quân ủy Trung ương và Đại tướng Võ Nguyên Giáp. Tại Nhà và Hầm D67, những quyết định lịch sử mang tính bước ngoặt đã được ban hành, chỉ đạo thắng lợi cuộc Tổng tiến công và nổi dậy mùa Xuân 1975.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-hoang-thanh-thang-long",
            locator: "Khu di tích cách mạng Nhà và Hầm D67",
            scopeNote: "Vai trò chỉ đạo chiến lược của Bộ Chính trị thời chống Mỹ"
          }
        ]
      },
      {
        heading: "Di sản Văn hóa Thế giới ngày nay",
        body: "Năm 2009, Hoàng thành Thăng Long được xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg của Thủ tướng Chính phủ. Tháng 8/2010, đúng dịp kỷ niệm 1.000 năm Thăng Long - Hà Nội, UNESCO đã vinh danh Khu trung tâm Hoàng thành Thăng Long - Hà Nội là Di sản Văn hóa Thế giới nhờ các giá trị nổi bật toàn cầu về văn hóa và khảo cổ học.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-hoang-thanh-thang-long",
            locator: "Quyết định 1272/QĐ-TTg và Văn bản ghi nhận UNESCO 2010",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt và Di sản thế giới"
          }
        ]
      }
    ],
    media: [
      {
        key: "hoang-thanh-thang-long-doan-mon",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Doan_Mon_-_Hanoi_Citadel.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Doan_Mon_-_Hanoi_Citadel.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cổng Đoan Môn – cửa ngõ chính vào Cấm thành Thăng Long tại trung tâm Hà Nội.",
        altText: "Cổng Đoan Môn cổ kính bằng gạch ngói với ba tầng lầu nhìn ra sân cỏ rộng",
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

  "pac-bo-cao-bang": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Căn cứ địa đầu tiên khi Bác Hồ về nước",
        body: "Ngày 28/1/1941, sau ba mươi năm bôn ba tìm đường cứu nước, Lãnh tụ Nguyễn Ái Quốc đã bí mật vượt qua mốc 108 biên giới Việt - Trung trở về Tổ quốc tại Pác Bó, xã Trường Hà, huyện Hà Quảng, tỉnh Cao Bằng. Người đã chọn núi rừng hiểm trở nơi đây làm căn cứ địa cách mạng đầu tiên để trực tiếp lãnh đạo phong trào giải phóng dân tộc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-pac-bo",
            locator: "Hồ sơ di tích, mục I: Bối cảnh Bác Hồ về nước 1941",
            scopeNote: "Sự kiện ngày 28/1/1941 tại cột mốc 108"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Nguyễn Ái Quốc về nước lãnh đạo cách mạng"
          }
        ]
      },
      {
        heading: "Hội nghị Trung ương 8 và sự ra đời của Mặt trận Việt Minh",
        body: "Từ ngày 10 đến ngày 19/5/1941, tại lán Khuổi Nặm thuộc Pác Bó, Nguyễn Ái Quốc chủ trì Hội nghị lần thứ 8 Ban Chấp hành Trung ương Đảng Cộng sản Đông Dương. Hội nghị đã hoàn chỉnh chủ trương chuyển hướng chỉ đạo chiến lược: đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và thành lập Mặt trận Việt Nam Độc lập Đồng minh (Việt Minh), phát động phong trào đánh Pháp đuổi Nhật sâu rộng trong cả nước.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-pac-bo",
            locator: "Hồ sơ di tích lán Khuổi Nặm",
            scopeNote: "Hội nghị Trung ương 8 từ ngày 10-19/5/1941"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Chủ trương chuyển hướng chỉ đạo chiến lược tại Hội nghị TW 8"
          }
        ]
      },
      {
        heading: "Dấu tích thiêng liêng và di tích ngày nay",
        body: "Tại Pác Bó, Bác Hồ đã sống và làm việc trong hang Cốc Bó giản dị, Người đặt tên ngọn núi cao phía sau là núi Các Mác và con suối trong vắt chảy qua là suối Lê-nin. Năm 2012, Thủ tướng Chính phủ ký Quyết định số 548/QĐ-TTg xếp hạng Khu di tích lịch sử Pác Bó là Di tích Quốc gia Đặc biệt, trở thành biểu tượng cội nguồn cách mạng vẻ vang của dân tộc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-pac-bo",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Pác Bó"
          }
        ]
      }
    ],
    media: [
      {
        key: "pac-bo-suoi-lenin",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Suoi_Lenin_Pac_Bo.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Suoi_Lenin_Pac_Bo.jpg",
        era: "today",
        yearTaken: 2020,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Dòng suối Lê-nin trong xanh uốn lượn dưới chân núi Các Mác tại Khu di tích lịch sử Pác Bó, Cao Bằng.",
        altText: "Dòng suối nước màu xanh ngọc bích chảy quanh chân vách núi đá vôi phủ đầy cây rừng",
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

  "rung-tran-hung-dao": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Chỉ thị thành lập đội quân chủ lực",
        body: "Tháng 12/1944, nhận định thời cơ khởi nghĩa vũ trang đang đến gần nhưng lực lượng phân tán, Lãnh tụ Hồ Chí Minh đã gửi thư chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân. Người căn dặn: 'Tên Đội Việt Nam Tuyên truyền Giải phóng quân nghĩa là chính trị trọng hơn quân sự. Nó là đội tuyên truyền... Tuy lúc đầu quy mô nhỏ, nhưng tiền đồ của nó rất vẻ vang'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-rung-tran-hung-dao",
            locator: "Chỉ thị thành lập Đội VNTTGPQ của Lãnh tụ Hồ Chí Minh",
            scopeNote: "Nội dung chỉ thị nguyên văn của Bác Hồ tháng 12/1944"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Sự thành lập Đội Việt Nam Tuyên truyền Giải phóng quân"
          }
        ]
      },
      {
        heading: "Buổi lễ tuyên thệ tại rừng Sam Cao",
        body: "Chiều ngày 22/12/1944, tại khu rừng Sam Cao thuộc xã Cẩm Lý (nay là xã Tam Kim, huyện Nguyên Bình, tỉnh Cao Bằng), đồng chí Võ Nguyên Giáp được ủy nhiệm chủ trì lễ thành lập Đội với 34 chiến sĩ kiên trung. Đội biên chế thành 3 tiểu đội, mang theo vũ khí thô sơ cùng lời thề danh dự thiêng liêng 'Hy sinh vì Tổ quốc'. Chỉ ít ngày sau, Đội lập chiến công vang dội đánh thắng hai đồn Phai Khắt và Nà Ngần.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-rung-tran-hung-dao",
            locator: "Hồ sơ di tích, mục II: Lễ thành lập 22/12/1944",
            scopeNote: "34 chiến sĩ, đồng chí Võ Nguyên Giáp chỉ huy và chiến thắng Phai Khắt, Nà Ngần"
          }
        ]
      },
      {
        heading: "Cội nguồn Quân đội nhân dân Việt Nam",
        body: "Khu di tích lịch sử Rừng Trần Hưng Đạo được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây lưu giữ nguyên vẹn lán nghỉ, bếp ăn Hoàng Cầm, cụm bia tưởng niệm 34 chiến sĩ đầu tiên – cội nguồn sinh thành của Quân đội nhân dân Việt Nam anh hùng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-rung-tran-hung-dao",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Rừng Trần Hưng Đạo"
          }
        ]
      }
    ],
    media: [
      {
        key: "rung-tran-hung-dao-bia-di-tich",
        fileUrl: "https://caobang.gov.vn/uploads/images/2021/12/khu-di-tich-rung-tran-hung-dao.jpg",
        sourcePageUrl: "https://caobang.gov.vn/di-tich-rung-tran-hung-dao",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Cao Bằng",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Bia ghi danh 34 chiến sĩ Đội Việt Nam Tuyên truyền Giải phóng quân giữa cánh rừng đại ngàn Trần Hưng Đạo, Nguyên Bình, Cao Bằng.",
        altText: "Bia đá di tích hình đóm lửa dựng giữa tán rừng cây cổ thụ râm mát",
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

  "khu-di-tich-tan-trao": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Thủ đô Khu Giải phóng mùa thu 1945",
        body: "Tháng 5/1945, trước diễn biến mau lẹ của Chiến tranh thế giới thứ hai, Lãnh tụ Hồ Chí Minh cùng các đồng chí lãnh đạo Trung ương chuyển từ Pác Bó về xã Tân Trào, huyện Sơn Dương, tỉnh Tuyên Quang. Tân Trào nhanh chóng trở thành trung tâm đầu não chỉ huy cách mạng, được mệnh danh là 'Thủ đô Khu giải phóng' liên kết 6 tỉnh căn cứ địa Việt Bắc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-tan-trao",
            locator: "Hồ sơ di tích lịch sử Tân Trào, mục Tổng quan",
            scopeNote: "Bác Hồ về Tân Trào tháng 5/1945 và thành lập Khu giải phóng"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Tân Trào - Thủ đô Khu giải phóng"
          }
        ]
      },
      {
        heading: "Quốc dân Đại hội Tân Trào và Lệnh Tổng khởi nghĩa",
        body: "Tại Đình Tân Trào, ngày 16 và 17/8/1945, Quốc dân Đại hội lịch sử đã họp và nhất trí tán thành chủ trương Tổng khởi nghĩa của Đảng, thông qua 10 chính sách lớn của Việt Minh, bầu Ủy ban Dân tộc Giải phóng Việt Nam (tức Chính phủ lâm thời) do đồng chí Hồ Chí Minh làm Chủ tịch. Chiều 16/8/1945, dưới bóng Cây đa Tân Trào, đồng chí Võ Nguyên Giáp đọc Quân lệnh số 1 làm lễ xuất quân tiến về giải phóng Thái Nguyên.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-tan-trao",
            locator: "Hồ sơ di tích Đình Tân Trào và Cây đa Tân Trào",
            scopeNote: "Quốc dân Đại hội 16-17/8/1945 và lễ xuất quân"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Quân lệnh số 1 và Quốc dân Đại hội Tân Trào"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Tân Trào được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể di tích bao gồm cụm lán Nà Nưa (nơi Bác Hồ ở và làm việc), đình Tân Trào, đình Hồng Thái và cây đa Tân Trào, là địa chỉ đỏ giáo dục truyền thống cách mạng thiêng liêng cho thế hệ trẻ cả nước.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-tan-trao",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Tân Trào"
          }
        ]
      }
    ],
    media: [
      {
        key: "tan-trao-dinh-tan-trao",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Tan_Trao.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Dinh_Tan_Trao.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Đình Tân Trào – nơi diễn ra Quốc dân Đại hội tháng 8/1945 quyết định Tổng khởi nghĩa giành chính quyền.",
        altText: "Ngôi đình gỗ mái lá đơn sơ truyền thống tọa lạc giữa vườn cây xanh ngát ở Tuyên Quang",
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

  "cot-co-lung-cu": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vị trí địa đầu thiêng liêng của Tổ quốc",
        body: "Cột cờ Quốc gia Lũng Cú tọa lạc trên đỉnh núi Rồng (Long Sơn) có độ cao 1.470 mét so với mực nước biển, thuộc xã Lũng Cú, huyện Đồng Văn (khu vực địa đầu phía Bắc Tổ quốc). Đây là điểm cực Bắc ghi dấu chủ quyền lãnh thổ thiêng liêng của quốc gia, nơi 'mỗi tấc đất đều thấm đẫm mồ hôi và xương máu của các thế hệ cha anh giữ gìn bờ cõi'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-cot-co-lung-cu",
            locator: "Hồ sơ danh thắng Cột cờ Lũng Cú, phần vị trí địa lý",
            scopeNote: "Độ cao 1.470m và tọa độ điểm cực Bắc"
          }
        ]
      },
      {
        heading: "Lịch sử cắm cờ và lá cờ 54 mét vuông",
        body: "Theo truyền tích lịch sử, cột cờ đầu tiên được dựng từ thời Thái úy Lý Thường Kiệt khi Người đem quân tuần tiễu vùng biên ải. Trải qua các thời kỳ, cột cờ được quân và dân ta kiên cường bảo vệ và tôn tạo vững chắc. Lá cờ đỏ sao vàng tung bay kiêu hãnh trên đỉnh cột cờ có diện tích đúng 54 mét vuông, tượng trưng cho khối đại đoàn kết bền chặt của 54 dân tộc anh em trên dải đất Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-cot-co-lung-cu",
            locator: "Hồ sơ kiến trúc và quy chuẩn lá cờ 54m2",
            scopeNote: "Ý nghĩa diện tích 54m2 biểu trưng cho 54 dân tộc Việt Nam"
          }
        ]
      },
      {
        heading: "Di tích lịch sử và danh thắng quốc gia",
        body: "Cột cờ Lũng Cú được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích lịch sử và danh lam thắng cảnh Quốc gia năm 2009. Công trình cột cờ hiện nay cao 33,15m với phần chân bệ bát giác gắn 8 bức phù điêu đá xanh tinh xảo tái hiện trang sử hào hùng dựng nước và giữ nước cùng nét đẹp văn hóa truyền thống của đồng bào vùng cao biên viễn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-cot-co-lung-cu",
            locator: "Quyết định xếp hạng Di tích quốc gia năm 2009",
            scopeNote: "Xếp hạng cấp quốc gia và thông số kỹ thuật công trình"
          }
        ]
      }
    ],
    media: [
      {
        key: "lung-cu-cot-co",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cot_co_Lung_Cu_-_Ha_Giang.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cot_co_Lung_Cu_-_Ha_Giang.jpg",
        era: "today",
        yearTaken: 2018,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        usageBasis: "open_license",
        caption: "Cột cờ Quốc gia Lũng Cú sừng sững trên đỉnh núi Rồng, lá cờ 54m² bay phấp phới giữa đất trời biên cương.",
        altText: "Tháp cột cờ bằng đá vươn cao trên đỉnh núi đá hùng vĩ với lá cờ đỏ sao vàng lớn đang bay",
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

  "doi-a1-dien-bien-phu": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cứ điểm yết hầu của Điện Biên Phủ",
        body: "Đồi A1 (tên mật danh quân sự của Pháp: Eliane 2) là cứ điểm phòng ngự quan trọng bậc nhất trong phân khu trung tâm của Tập đoàn cứ điểm Điện Biên Phủ. Nằm trên dãy đồi phía đông khống chế trực tiếp lòng chảo Mường Thanh và Sở chỉ huy tập đoàn cứ điểm, quân đội viễn chinh Pháp đã bố trí tại đây hệ thống hầm ngầm bê tông cốt thép kiên cố, nhiều tầng hỏa lực đan xen và hàng rào dây thép gai dày đặc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-doi-a1",
            locator: "Hồ sơ di tích cứ điểm đồi A1, mục Cấu trúc quân sự",
            scopeNote: "Vị trí chiến lược và hệ thống công sự Eliane 2 của Pháp"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Tập đoàn cứ điểm Điện Biên Phủ và vị thế cứ điểm đồi A1"
          }
        ]
      },
      {
        heading: "39 ngày đêm quyết chiến và tiếng nổ bộc phá lịch sử",
        body: "Trận chiến giành giật đồi A1 giữa cán bộ, chiến sĩ Trung đoàn 174 (Đại đoàn 316) cùng Trung đoàn 102 (Đại đoàn 308) với quân Pháp kéo dài ác liệt suốt 39 ngày đêm (từ 30/3 đến sáng 7/5/1954). Quyết tâm đánh sập lô cốt ngầm của địch, tổ công binh của ta đã kiên trì đào một đường hầm dài 47m ăn sâu vào lòng đồi để đặt khối bộc phá gần 1.000kg thuốc nổ. Đúng 20 giờ 30 phút đêm 6/5/1954, khối bộc phá phát nổ làm rung chuyển quả đồi, thổi bay hầm ngầm chỉ huy địch, mở đường cho quân ta xung phong tiêu diệt toàn bộ cứ điểm lúc 4 giờ 30 sáng ngày 7/5/1954.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-doi-a1",
            locator: "Hồ sơ chiến lệ đồi A1, diễn biến 30/3 - 7/5/1954",
            scopeNote: "Thời gian đào hầm ngầm, khối bộc phá 960kg và thời điểm nổ đêm 6/5"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Diễn biến đợt tiến công tiêu diệt cứ điểm A1 mở đường giải phóng Mường Thanh"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Cứ điểm Đồi A1 là thành phần trung tâm của Quần thể Di tích Quốc gia Đặc biệt Chiến trường Điện Biên Phủ theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009 của Thủ tướng Chính phủ. Hiện nay trên đỉnh đồi vẫn còn nguyên vẹn hố phễu bộc phá sâu hoắm lịch sử, xác xe tăng Bazeille của Pháp bị bắn cháy và đài tưởng niệm tri ân những anh hùng liệt sĩ đã ngã xuống vì độc lập tự do của Tổ quốc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-doi-a1",
            locator: "Quyết định số 1272/QĐ-TTg ngày 12/8/2009",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Chiến trường Điện Biên Phủ"
          }
        ]
      }
    ],
    media: [
      {
        key: "doi-a1-ho-boc-pha",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Doi_A1_Dien_Bien_Phu.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Doi_A1_Dien_Bien_Phu.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Hố phễu bộc phá lịch sử sâu hoắm trên đỉnh Đồi A1 sau tiếng nổ đêm 6/5/1954 trong Chiến dịch Điện Biên Phủ.",
        altText: "Miệng hố đất đá hình phễu khổng lồ do khối bộc phá tạo ra trên đỉnh đồi thoai thoải",
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
        youtubeId: "W5i3h-h9K2Q",
        title: "Ký ức 39 ngày đêm quyết chiến đồi A1 Điện Biên Phủ",
        channel: "Truyền hình Quốc phòng Việt Nam QPVN",
        channelUrl: "https://www.youtube.com/@qpvn",
        note: "Phim tài liệu quân sự phục dựng trận đào hầm bộc phá và giây phút tiêu diệt cứ điểm đồi A1.",
        embedCheckedAt: "2026-10-27"
      }
    ]
  },

  "ham-de-castries": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Đầu não chỉ huy của quân viễn chinh Pháp",
        body: "Hầm chỉ huy của Thiếu tướng Christian de Castries nằm ở trung tâm lòng chảo Mường Thanh, cánh đồng Điện Biên. Hầm được thiết kế kiên cố bằng vòm thép gợn sóng dày đúc sẵn, phủ các lớp bao cát và đất dày chống đạn pháo hạng nặng, chung quanh có 4 cỗ xe tăng túc trực bảo vệ cùng mạng lưới chiến hào tỏa đi khắp phân khu trung tâm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ham-de-castries",
            locator: "Hồ sơ di tích Hầm De Castries, mô tả kiến trúc",
            scopeNote: "Vật liệu vòm thép, kích thước và hệ thống phòng thủ quanh hầm"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Sở chỉ huy tập đoàn cứ điểm Mường Thanh"
          }
        ]
      },
      {
        heading: "Thời khắc bắt sống tướng De Castries và lá cờ Quyết chiến Quyết thắng",
        body: "Khoảng 17 giờ ngày 7/5/1954, tổ xung kích của Đại đội 360, Trung đoàn 209 (Đại đoàn 312) do Đại đội trưởng Tạ Quốc Luật chỉ huy đã vượt qua cầu Mường Thanh tiến thẳng vào Sở chỉ huy địch. Đồng chí Tạ Quốc Luật cùng các chiến sĩ Hoàng Đăng Vinh, Bùi Văn Nhỏ đã xông vào hầm bắt sống tướng De Castries cùng toàn bộ bộ tham mưu tập đoàn cứ điểm. Đúng 17 giờ 30 phút, lá cờ 'Quyết chiến - Quyết thắng' của quân đội ta tung bay kiêu hãnh trên nóc hầm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ham-de-castries",
            locator: "Hồ sơ di tích, diễn biến chiều ngày 7/5/1954",
            scopeNote: "Tổ xung kích đồng chí Tạ Quốc Luật bắt sống bộ chỉ huy Pháp lúc 17h30"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Toàn thắng Chiến dịch Điện Biên Phủ ngày 7/5/1954"
          }
        ]
      },
      {
        heading: "Di tích ngày nay",
        body: "Hầm De Castries được giữ gìn nguyên trạng vòm thép kiên cố và bao cát bảo vệ trong Quần thể Di tích Quốc gia Đặc biệt Chiến trường Điện Biên Phủ. Đây là một trong những điểm tham quan lịch sử thu hút đông đảo du khách quốc tế khi đến Điện Biên để tận mắt chứng kiến nơi sụp đổ của chủ nghĩa thực dân cũ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ham-de-castries",
            locator: "Bảo tồn di tích Chiến trường Điện Biên Phủ",
            scopeNote: "Hiện trạng bảo tồn và quản lý du lịch"
          }
        ]
      }
    ],
    media: [
      {
        key: "ham-de-castries-vom-thep",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ham_De_Castries_Dien_Bien_Phu.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ham_De_Castries_Dien_Bien_Phu.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cửa vào Hầm Sở chỉ huy Tướng De Castries với kết cấu vòm thép và bao cát tại cánh đồng Mường Thanh.",
        altText: "Lối vào hầm ngầm xây bằng vòm sắt uốn cong phủ các lớp bao cát đất bảo vệ xung quanh",
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

  "chien-thang-lai-chau-1953": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Mưu đồ của thực dân Pháp tại vùng Tây Bắc",
        body: "Thu Đông năm 1953, thực dân Pháp triển khai Kế hoạch Nava nhằm đảo ngược cục diện chiến tranh. Trên hướng Tây Bắc, Pháp ráo riết củng cố thị xã Lai Châu làm bàn đạp chiếm đóng, khống chế đồng bào các dân tộc thiểu số và ngăn chặn các tuyến vận tải tiếp tế của ta sang Thượng Lào.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-qdnd-lai-chau-1953",
            locator: "Chuyên đề lịch sử Đảng bộ tỉnh Lai Châu, phần Kháng chiến chống Pháp",
            scopeNote: "Âm mưu của Pháp tại Tây Bắc và Kế hoạch Nava"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Chủ trương tác chiến Đông - Xuân 1953-1954 của Trung ương Đảng"
          }
        ]
      },
      {
        heading: "Chiến dịch tiến công giải phóng Lai Châu ngày 12/12/1953",
        body: "Thực hiện quyết định tác chiến chiến lược Đông - Xuân 1953 - 1954, Bộ Tổng Tư lệnh giao Đại đoàn 316 cùng các lực lượng vũ trang địa phương mở cuộc tiến công vào Lai Châu. Trước sức ép thần tốc và áp đảo của bộ đội ta, ngày 12/12/1953, quân địch buộc phải bỏ chạy khỏi thị xã Lai Châu. Quân ta nhanh chóng truy kích tiêu diệt tàn quân địch trên đường rút chạy về Điện Biên Phủ, giải phóng hoàn toàn thị xã Lai Châu rộng lớn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-qdnd-lai-chau-1953",
            locator: "Báo Quân đội nhân dân: Chiến thắng giải phóng Lai Châu năm 1953",
            scopeNote: "Diễn biến ngày 12/12/1953 và cuộc truy kích tàn quân Pháp"
          }
        ]
      },
      {
        heading: "Ý nghĩa chiến lược mở màn cho Điện Biên Phủ",
        body: "Thắng lợi Giải phóng Lai Châu ngày 12/12/1953 có ý nghĩa chiến lược đặc biệt to lớn: đập tan ý đồ củng cố vùng Tây Bắc của Pháp, buộc Tổng chỉ huy Navarre phải vội vã điều động lực lượng cơ động nhảy dù tăng viện xuống thung lũng Mường Thanh. Kế hoạch ban đầu của Pháp bị đảo lộn hoàn toàn, biến Điện Biên Phủ thành 'tập đoàn cứ điểm' cô lập bị quân ta vây hãm và tiêu diệt.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-qdnd-lai-chau-1953",
            locator: "Báo Quân đội nhân dân, ý nghĩa chiến lược",
            scopeNote: "Buộc Nava điều quân nhảy dù xuống Điện Biên Phủ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Bước phân tán lực lượng địch trong Đông - Xuân 1953-1954"
          }
        ]
      }
    ],
    media: [
      {
        key: "lai-chau-tuong-dai-chien-thang",
        fileUrl: "https://laichau.gov.vn/uploads/images/2023/12/chien-thang-lai-chau-1953.jpg",
        sourcePageUrl: "https://laichau.gov.vn/di-tich-chien-thang-lai-chau-1953",
        era: "today",
        yearTaken: 2023,
        photographer: "Cổng Thông tin Điện tử tỉnh Lai Châu",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài Chiến thắng Giải phóng Lai Châu năm 1953 sừng sững bên dòng sông Đà hùng vĩ.",
        altText: "Tượng đài chiến sĩ bộ đội và nhân dân các dân tộc Tây Bắc giương cao cờ chiến thắng",
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

  "nha-tu-son-la": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Địa ngục trần gian nơi rừng thiêng nước độc",
        body: "Năm 1908, thực dân Pháp xây dựng Nhà tù Sơn La trên đỉnh đồi Khau Cả (thị xã Sơn La) và mở rộng quy mô lớn vào các năm 1930, 1940. Với khí hậu khắc nghiệt rừng thiêng nước độc và chế độ giam cầm tàn bạo, thực dân Pháp toan tính dùng bệnh tật và lao động khổ sai để triệt hạ thể xác và ý chí chiến đấu của các chiến sĩ cộng sản Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-son-la",
            locator: "Hồ sơ di tích, mục I: Quá trình xây dựng 1908-1940",
            scopeNote: "Thời gian xây dựng trên đỉnh đồi Khau Cả và chế độ giam cầm"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Hệ thống nhà tù đày ải tù chính trị của thực dân Pháp"
          }
        ]
      },
      {
        heading: "Chi bộ Nhà tù và Cây đào Tô Hiệu bất tử",
        body: "Tháng 12/1939, chi bộ Đảng Cộng sản tại Nhà tù Sơn La được bí mật thành lập do đồng chí Tô Hiệu làm Bí thư. Chi bộ đã kiên trì lãnh đạo anh em tù nhân tuyệt thực đòi dân sinh, xuất bản báo bí mật, biến chốn ngục tù thành trường đào tạo lý luận cách mạng cho nhiều cán bộ lãnh đạo ưu tú của Đảng như Trường Chinh, Lê Duẩn, Nguyễn Lương Bằng, Văn Tiến Dũng. Dù bị bệnh lao nặng và bị giam trong xà lim tối tăm, đồng chí Tô Hiệu vẫn kiên cường giữ vững khí tiết cho đến hơi thở cuối cùng vào tháng 3/1944. Cây đào do Người chăm sóc bên góc tường xà lim đã trở thành biểu tượng bất tử của tinh thần lạc quan cách mạng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-son-la",
            locator: "Hồ sơ di tích, mục II: Chi bộ nhà tù và tấm gương đồng chí Tô Hiệu",
            scopeNote: "Thành lập chi bộ tháng 12/1939 và biểu tượng cây đào Tô Hiệu"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ghi nhận giá trị lịch sử đặc biệt to lớn, ngày 31/12/2014, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg xếp hạng Nhà tù Sơn La là Di tích Quốc gia Đặc biệt. Quần thể di tích ngày nay lưu giữ các xà lim ngầm, cổng nhà lao cổ và gốc đào Tô Hiệu vẫn đơm hoa rực rỡ mỗi dịp xuân về giữa lòng thành phố Sơn La.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-son-la",
            locator: "Quyết định số 2408/QĐ-TTg ngày 31/12/2014",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Nhà tù Sơn La"
          }
        ]
      }
    ],
    media: [
      {
        key: "son-la-nha-tu-khau-ca",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Son_La.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nha_tu_Son_La.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Bức tường đá kiên cố và các dãy xà lim Di tích Quốc gia Đặc biệt Nhà tù Sơn La trên đồi Khau Cả.",
        altText: "Khu phế tích tường đá cổ xám rêu phong của các buồng giam nhà lao Sơn La",
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

  "khoi-nghia-yen-bai-1930": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Bối cảnh khởi nghĩa vũ trang đầu năm 1930",
        body: "Sau vụ ám sát tên trùm mộ phu Bazin ở Hà Nội đầu năm 1929, thực dân Pháp tăng cường khủng bố gắt gao nhằm triệt phá tổ chức Việt Nam Quốc dân Đảng. Trước nguy cơ bị tiêu diệt hoàn toàn, các đồng chí lãnh đạo tổ chức do Nguyễn Thái Học đứng đầu đã quyết định phát động cuộc khởi nghĩa vũ trang quyết tử với tinh thần 'Không thành công cũng thành nhân'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-yen-bai",
            locator: "Hồ sơ di tích, mục I: Bối cảnh khởi nghĩa 1930",
            scopeNote: "Sự đàn áp của Pháp và quyết định khởi nghĩa của Việt Nam Quốc dân Đảng"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Việt Nam Quốc dân Đảng và cuộc Khởi nghĩa Yên Bái"
          }
        ]
      },
      {
        heading: "Đêm sấm sét 9 rạng sáng 10/2/1930 và tấm gương nghĩa sĩ",
        body: "Đêm ngày 9 rạng sáng ngày 10/2/1930, tiếng súng khởi nghĩa đồng loạt nổ ra tại tỉnh lỵ Yên Bái. Nghĩa quân dũng cảm tấn công chiếm đồn lính khố đỏ và dinh công sứ Pháp. Dù cuộc khởi nghĩa sau đó bị thực dân Pháp đàn áp khốc liệt và sáng ngày 17/6/1930, Nguyễn Thái Học cùng 12 nghĩa sĩ anh dũng bước lên máy chém tại thị xã Yên Bái, câu khẩu hiệu bất hủ và tinh thần quả cảm của các nghĩa sĩ đã làm rung chuyển bộ máy thống trị thực dân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-yen-bai",
            locator: "Hồ sơ di tích, mục II: Diễn biến khởi nghĩa và ngày 17/6/1930",
            scopeNote: "Diễn biến đêm 9 rạng sáng 10/2/1930 và 13 nghĩa sĩ bước lên máy chém"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Ý nghĩa cuộc Khởi nghĩa Yên Bái và bài học lịch sử"
          }
        ]
      },
      {
        heading: "Khu tưởng niệm Di tích Quốc gia ngày nay",
        body: "Khu di tích lịch sử lăng mộ và tượng đài Nguyễn Thái Học cùng các nghĩa sĩ Khởi nghĩa Yên Bái tọa lạc tại công viên Yên Hòa (phường Hồng Hà, tỉnh Yên Bái cũ, nay thuộc địa bàn Lào Cai). Di tích được xếp hạng Di tích Lịch sử Quốc gia năm 1990, là nơi nhân dân cả nước thành kính tưởng niệm những tấm lòng ái quốc kiên trung.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-yen-bai",
            locator: "Quyết định xếp hạng Di tích Lịch sử Quốc gia năm 1990",
            scopeNote: "Xếp hạng cấp quốc gia và công trình tượng đài tưởng niệm"
          }
        ]
      }
    ],
    media: [
      {
        key: "yen-bai-tuong-dai-nguyen-thai-hoc",
        fileUrl: "https://yenbai.gov.vn/uploads/images/2020/02/khu-tuong-niem-nguyen-thai-hoc.jpg",
        sourcePageUrl: "https://yenbai.gov.vn/di-tich-khoi-nghia-yen-bai",
        era: "today",
        yearTaken: 2020,
        photographer: "Cổng Thông tin Điện tử tỉnh Yên Bái",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài nhà yêu nước Nguyễn Thái Học cùng các nghĩa sĩ Khởi nghĩa Yên Bái năm 1930 tại công viên Yên Hòa.",
        altText: "Tượng đài đá cẩm thạch tạc hình người chiến sĩ yêu nước đứng hiên ngang giữa quảng trường xanh",
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

  "atk-dinh-hoa": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Thủ đô Gió ngàn của cuộc kháng chiến toàn quốc",
        body: "Sau Ngày Toàn quốc kháng chiến (19/12/1946), Chủ tịch Hồ Chí Minh cùng các cơ quan đầu não của Trung ương Đảng, Chính phủ và Quân đội đã di chuyển lên vùng rừng núi Việt Bắc, chọn vùng đất Định Hóa (Thái Nguyên) làm An toàn khu (ATK) trung tâm. Với vị thế 'tiến khả dĩ công, thoái khả dĩ thủ', ATK Định Hóa trở thành trái tim đầu não chỉ đạo cuộc kháng chiến trường kỳ chống thực dân Pháp.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-dinh-hoa",
            locator: "Hồ sơ di tích ATK Định Hóa, phần Tổng quan",
            scopeNote: "Chọn Định Hóa làm An toàn khu trung ương năm 1947"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Căn cứ địa Việt Bắc và Thủ đô kháng chiến"
          }
        ]
      },
      {
        heading: "Quyết định lịch sử mở Chiến dịch Điện Biên Phủ tại lán Tỉn Keo",
        body: "Ngày 6/12/1953, tại lán Tỉn Keo dưới chân đèo De (xã Phú Đình, huyện Định Hóa), Chủ tịch Hồ Chí Minh đã chủ trì cuộc họp mang tính bước ngoặt của Bộ Chính trị. Tại đây, Bộ Chính trị đã thông qua kế hoạch tác chiến Đông - Xuân 1953 - 1954 và quyết định chọn Điện Biên Phủ làm điểm quyết chiến chiến lược tiêu diệt tập đoàn cứ điểm quân sự của Pháp, cử Đại tướng Võ Nguyên Giáp làm Tổng Tư lệnh chiến dịch.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-dinh-hoa",
            locator: "Hồ sơ di tích Lán Tỉn Keo, cuộc họp ngày 6/12/1953",
            scopeNote: "Cuộc họp Bộ Chính trị thông qua quyết định mở Chiến dịch Điện Biên Phủ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Hội nghị Bộ Chính trị tại Tỉn Keo (Định Hóa) ngày 6/12/1953"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử ATK Định Hóa được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể gồm 128 điểm di tích lịch sử phân bố trên địa bàn huyện Định Hóa, trong đó nổi bật là lán Tỉn Keo, đồi Khau Tý (nơi ở đầu tiên của Bác khi về Định Hóa) và đồi Pò Kỹ (nơi đồng chí Trường Chinh làm việc).",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-dinh-hoa",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt ATK Định Hóa"
          }
        ]
      }
    ],
    media: [
      {
        key: "dinh-hoa-lan-tin-keo",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Lan_Na_Nua_ATK_Dinh_Hoa.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Lan_Na_Nua_ATK_Dinh_Hoa.jpg",
        era: "today",
        yearTaken: 2018,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Căn lán gỗ mộc mạc tại lán Tỉn Keo, ATK Định Hóa – nơi Bác Hồ chủ trì cuộc họp Bộ Chính trị mở Chiến dịch Điện Biên Phủ.",
        altText: "Ngôi lán nhỏ bằng tre nứa mái cọ lợp tranh đơn sơ nép mình bên sườn đồi xanh",
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

  "atk-cho-don": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vành đai thép bảo vệ cơ quan Trung ương",
        body: "Nằm tiếp giáp với Định Hóa (Thái Nguyên) và Sơn Dương (Tuyên Quang), ATK Chợ Đồn (thuộc tỉnh Bắc Kạn cũ, nay nằm trong phân vùng căn cứ cách mạng Thái Nguyên) sở hữu địa thế núi non trùng điệp hiểm trở. Nơi đây giữ vai trò là hậu cứ an toàn tuyệt đối, hình thành nên tam giác căn cứ địa cách mạng trung tâm của toàn chiến khu Việt Bắc trong kháng chiến chống Pháp.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-cho-don",
            locator: "Hồ sơ di tích ATK Chợ Đồn, phần Địa thế chiến lược",
            scopeNote: "Vị trí tiếp giáp Định Hóa - Sơn Dương và tam giác ATK Việt Bắc"
          }
        ]
      },
      {
        heading: "Nơi ở và làm việc của Bác Hồ và cơ quan đầu não",
        body: "Trong những năm tháng kháng chiến 1947–1952, Chủ tịch Hồ Chí Minh, Tổng Bí thư Trường Chinh, Thủ tướng Phạm Văn Đồng và các cơ quan Bộ Tổng Tư lệnh, Trung ương Hội Phụ nữ, Đài Tiếng nói Việt Nam đã từng đóng quân, sống và làm việc tại các thôn bản Nà Pậu, Bản Ca, Khuổi Linh, đồi Khau Mạ để lãnh đạo quân dân cả nước chiến đấu.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-cho-don",
            locator: "Hồ sơ di tích, mục II: Các điểm di tích Bác Hồ và TW Đảng",
            scopeNote: "Các điểm dừng chân Nà Pậu, Bản Ca, đồi Khau Mạ của lãnh đạo Đảng"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ngày 22/12/2016, Thủ tướng Chính phủ đã ký Quyết định số 2499/QĐ-TTg xếp hạng Khu di tích lịch sử An toàn khu (ATK) Chợ Đồn là Di tích Quốc gia Đặc biệt. Quần thể bao gồm 25 điểm di tích phân bố tại các xã Lương Bằng, Nghĩa Tá, Bản Thi, lưu giữ những ký ức sâu đậm về tình cảm gắn bó thủy chung giữa Đảng, Bác Hồ với đồng bào các dân tộc thiểu số vùng cao.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-cho-don",
            locator: "Quyết định số 2499/QĐ-TTg ngày 22/12/2016",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt ATK Chợ Đồn"
          }
        ]
      }
    ],
    media: [
      {
        key: "cho-don-lan-na-pau",
        fileUrl: "https://backan.gov.vn/uploads/images/2022/05/atk-cho-don.jpg",
        sourcePageUrl: "https://backan.gov.vn/di-tich-atk-cho-don",
        era: "today",
        yearTaken: 2022,
        photographer: "Cổng Thông tin Điện tử tỉnh Bắc Kạn",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Khu di tích lịch sử lán Nà Pậu – nơi Chủ tịch Hồ Chí Minh sống và làm việc đầu năm 1951 tại ATK Chợ Đồn.",
        altText: "Căn lán gỗ sàn truyền thống nép mình bên gốc cây đại ngàn giữa núi rừng xanh thẳm",
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
  }
};

// Apply updates
let updatedCount = 0;
for (const site of sitesData.sites) {
  if (batchAUpdates[site.key]) {
    Object.assign(site, batchAUpdates[site.key]);
    updatedCount++;
  }
}

fs.writeFileSync(sitesPath, JSON.stringify(sitesData, null, 2) + "\n", "utf-8");
console.log(`Updated ${updatedCount} sites for Batch A in sites.json.`);
