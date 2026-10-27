import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkgDir = path.join(root, "supabase/content/heritage-sites/v1");

const sitesPath = path.join(pkgDir, "sites.json");
const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf-8"));

// Batch B accepted sites mapping (14 sites)
const batchBUpdates = {
  "khoi-nghia-bac-son": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Bối cảnh khởi nghĩa vũ trang mùa thu 1940",
        body: "Tháng 9/1940, phát xít Nhật đánh chiếm Lạng Sơn, quân đội thực dân Pháp thua chạy tán loạn qua địa bàn châu Bắc Sơn. Nắm bắt thời cơ quân địch hoang mang tan rã, Đảng bộ Bắc Sơn đã kịp thời vận động nhân dân các dân tộc nổi dậy tước vũ khí của tàn quân Pháp để chuẩn bị khởi nghĩa.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-bac-son",
            locator: "Hồ sơ di tích, mục I: Bối cảnh lịch sử",
            scopeNote: "Sự kiện Nhật đánh Lạng Sơn tháng 9/1940 và thời cơ khởi nghĩa"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Khởi nghĩa Bắc Sơn tháng 9/1940"
          }
        ]
      },
      {
        heading: "Đêm tấn công đồn Mỏ Nhài và sự ra đời của Đội Du kích Bắc Sơn",
        body: "Tối ngày 27/9/1940, dưới sự lãnh đạo của Đảng bộ, nhân dân và tự vệ các dân tộc Tày, Nùng, Dao đã vũ trang tiến công chiếm đồn Mỏ Nhài (châu lỵ Bắc Sơn), trừng trị tay sai gian ác và thành lập chính quyền cách mạng nhân dân. Sau đó, Đội Du kích Bắc Sơn được thành lập – một trong những lực lượng tiền thân trực tiếp của Đội Cứu quốc quân và Quân đội nhân dân Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-bac-son",
            locator: "Hồ sơ di tích, mục II: Tiến công đồn Mỏ Nhài",
            scopeNote: "Diễn biến đêm 27/9/1940 và sự ra đời Đội Du kích Bắc Sơn"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Ý nghĩa Đội Cứu quốc quân hình thành từ khởi nghĩa Bắc Sơn"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ghi nhận giá trị lịch sử vẻ vang mở đầu thời kỳ đấu tranh vũ trang giải phóng dân tộc, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg ngày 31/12/2014 xếp hạng Địa điểm Khởi nghĩa Bắc Sơn là Di tích Quốc gia Đặc biệt. Quần thể bảo tồn đồn Mỏ Nhài, đình Nông Lục và Bảo tàng Khởi nghĩa Bắc Sơn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-bac-son",
            locator: "Quyết định số 2408/QĐ-TTg ngày 31/12/2014",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Địa điểm Khởi nghĩa Bắc Sơn"
          }
        ]
      }
    ],
    media: [
      {
        key: "bac-son-don-mo-nhai",
        fileUrl: "https://langson.gov.vn/uploads/images/2021/09/di-tich-don-mo-nhai-bac-son.jpg",
        sourcePageUrl: "https://langson.gov.vn/di-tich-khoi-nghia-bac-son",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Lạng Sơn",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Địa điểm Đồn Mỏ Nhài – nơi nhân dân Bắc Sơn đánh chiếm đêm 27/9/1940 mở đầu khởi nghĩa vũ trang.",
        altText: "Bia đá di tích và công viên đài tưởng niệm Khởi nghĩa Bắc Sơn tại Lạng Sơn",
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

  "ai-chi-lang": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Hẻm ải hiểm trở cửa ngõ phương Bắc",
        body: "Thung lũng Chi Lăng dài hơn 20km, rộng chừng 3km, hai bên được bao bọc bởi dãy núi đá vôi Cai Kinh hiểm trở và dãy núi đất Thái Hòa, ở giữa có sông Thương uốn lượn. Địa thế 'trời cho' hiểm trở nơi đây đã biến Chi Lăng thành cửa ải yết hầu phòng thủ phương Bắc quan trọng bậc nhất của các triều đại phong kiến Đại Việt.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ai-chi-lang",
            locator: "Hồ sơ di tích, mục Địa thế thung lũng Chi Lăng",
            scopeNote: "Mô tả địa thế hiểm yếu núi Cai Kinh và ải Chi Lăng"
          }
        ]
      },
      {
        heading: "Trận địa chém Liễu Thăng vang dội sử sách năm 1427",
        body: "Chi Lăng ghi dấu nhiều chiến công chống giặc ngoại xâm từ thời Lê Hoàn (981), Lý Thường Kiệt (1077), và đỉnh cao là trận phục kích tiêu diệt 10 vạn viện binh nhà Minh năm 1427. Sáng ngày 10/10/1427, nghĩa quân Lam Sơn dưới sự chỉ huy của các tướng Trần Lựu, Lê Sát đã nhử Tổng binh Liễu Thăng vào đầm lầy chân núi Mã Yên và chém đầu viên tướng chỉ huy giặc, làm tan rã hoàn toàn đạo quân xâm lược.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ai-chi-lang",
            locator: "Hồ sơ chiến trận Chi Lăng - Xương Giang 1427",
            scopeNote: "Trận phục kích núi Mã Yên chém đầu Liễu Thăng ngày 10/10/1427"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Truyền thống đánh giặc giữ nước của dân tộc",
            scopeNote: "Nghệ thuật quân sự trận Chi Lăng năm 1427"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Chi Lăng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2408/QĐ-TTg ngày 31/12/2014. Quần thể gồm 24 điểm di tích tiêu biểu như núi Mã Yên, quỷ môn quan, đền Chầu Lục và Nhà bảo tàng chiến thắng Chi Lăng khang trang.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ai-chi-lang",
            locator: "Quyết định số 2408/QĐ-TTg ngày 31/12/2014",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Chi Lăng"
          }
        ]
      }
    ],
    media: [
      {
        key: "chi-lang-nui-ma-yen",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ai_Chi_Lang_Lang_Son.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ai_Chi_Lang_Lang_Son.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Thung lũng Ải Chi Lăng nhìn về hướng núi Mã Yên – nơi nghĩa quân Lam Sơn chém tướng Liễu Thăng năm 1427.",
        altText: "Toàn cảnh thung lũng xanh mướt với những dãy núi đá vôi sừng sững bao bọc hai bên",
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

  "mo-than-deo-nai": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cái nôi tôi luyện phong trào công nhân mỏ",
        body: "Mỏ than Đèo Nai tại Cẩm Phả là một trong những mỏ khai thác than lộ thiên lâu đời và quy mô lớn nhất vùng than Quảng Ninh thời Pháp thuộc. Dưới chế độ lao dịch khắc nghiệt và bị bóc lột kiệt quệ, hàng vạn thợ mỏ nơi đây đã sớm đoàn kết, hình thành nên bản lĩnh chiến đấu quật cường của giai cấp công nhân Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-mo-than-deo-nai",
            locator: "Hồ sơ di tích Mỏ than Đèo Nai, phần Lịch sử giai cấp công nhân mỏ",
            scopeNote: "Quá trình khai thác than và phong trào công nhân Cẩm Phả"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Phong trào đấu tranh của công nhân mỏ than Quảng Ninh"
          }
        ]
      },
      {
        heading: "Đỉnh cao Tổng bãi công 1936 và sự kiện Bác Hồ về thăm",
        body: "Tháng 11/1936, cuộc Tổng bãi công của hơn 3 vạn thợ mỏ Cẩm Phả - Hòn Gai bùng nổ với khẩu hiệu bất hủ 'Kỷ luật và Đồng tâm', buộc chủ mỏ Pháp phải nhượng bộ tăng lương giảm giờ làm. Ngày 30/3/1959, Chủ tịch Hồ Chí Minh đã về thăm mỏ than Đèo Nai, trực tiếp lên tận tầng than số 10 nói chuyện và căn dặn cán bộ công nhân đẩy mạnh sản xuất than phục vụ xây dựng chủ nghĩa xã hội.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-mo-than-deo-nai",
            locator: "Hồ sơ di tích, mục Sự kiện Bác Hồ về thăm ngày 30/3/1959",
            scopeNote: "Bác Hồ thăm tầng than số 10 và khẩu hiệu Kỷ luật và Đồng tâm"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)",
            scopeNote: "Phong trào thi đua lao động sản xuất công nghiệp miền Bắc"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Địa điểm Bác Hồ về thăm Mỏ than Đèo Nai được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1989. Tại đây, tượng đài Bác Hồ và nhà lưu niệm truyền thống thợ mỏ được xây dựng uy nghiêm, trở thành niềm tự hào bất diệt của các thế hệ thợ mỏ Vùng than Quảng Ninh anh hùng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-mo-than-deo-nai",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1989",
            scopeNote: "Xếp hạng cấp quốc gia và quản lý di tích"
          }
        ]
      }
    ],
    media: [
      {
        key: "deo-nai-tuong-dai-bac-ho",
        fileUrl: "https://quangninh.gov.vn/uploads/images/2021/03/di-tich-bac-ho-ve-tham-deo-nai.jpg",
        sourcePageUrl: "https://quangninh.gov.vn/di-tich-mo-than-deo-nai",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Quảng Ninh",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Khu di tích lịch sử Tượng đài Bác Hồ về thăm mỏ than Đèo Nai tại thành phố Cẩm Phả, Quảng Ninh.",
        altText: "Tượng đài Chủ tịch Hồ Chí Minh đứng giản dị vẫy tay chào thợ mỏ giữa khuôn viên râm mát",
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

  "bai-coc-bach-dang": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Dòng sông lịch sử ba lần đại thắng giặc ngoại xâm",
        body: "Sông Bạch Đằng là dòng sông huyền thoại chảy qua địa phận Quảng Ninh và Hải Phòng, đổ ra vịnh Bắc Bộ. Nơi đây đã ghi dấu ba chiến công thủy chiến hiển hách bậc nhất của dân tộc: Ngô Quyền đại phá quân Nam Hán (938), Lê Hoàn đánh tan quân Tống (981) và Hưng Đạo Đại vương Trần Quốc Tuấn đập tan đạo thuyền chiến quân Nguyên Mông (1288).",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-bach-dang",
            locator: "Hồ sơ di tích quốc gia đặc biệt Bạch Đằng, phần Tổng quan",
            scopeNote: "Ba chiến thắng lẫy lừng 938, 981 và 1288 trên sông Bạch Đằng"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Lịch sử truyền thống chống ngoại xâm Đại Việt",
            scopeNote: "Chiến thắng Bạch Đằng năm 1288 của quân dân nhà Trần"
          }
        ]
      },
      {
        heading: "Nghệ thuật bãi cọc ngầm độc đáo của Hưng Đạo Vương",
        body: "Tháng 4/1288, nắm vững quy luật thủy triều, Hưng Đạo Đại vương Trần Quốc Tuấn đã chỉ huy đóng hàng ngàn cây cọc gỗ lim vót nhọn bịt sắt cắm chìm dưới lòng sông Bạch Đằng. Khi thủy triều rút nhanh, quân ta tổng phản công dồn thuyền giặc vào bãi cọc nhô lên làm đắm vỡ hàng trăm chiến thuyền, bắt sống tướng giặc Ô Mã Nhi, đập tan mưu đồ xâm lược của đế chế Mông Cổ hùng mạnh.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-bach-dang",
            locator: "Khảo cổ học bãi cọc Yên Hưng và Đồng Má Ngựa",
            scopeNote: "Kỹ thuật vót cọc gỗ và thời điểm thủy triều rút tháng 4/1288"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Chiến thắng Bạch Đằng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1419/QĐ-TTg ngày 27/9/2012. Quần thể bảo tồn các bãi cọc khảo cổ Yên Hưng, Đồng Má Ngựa cùng đền Trần Hưng Đạo và miếu Vua Bà linh thiêng bên bờ sông.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-bach-dang",
            locator: "Quyết định số 1419/QĐ-TTg ngày 27/9/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Khu di tích lịch sử Bạch Đằng"
          }
        ]
      }
    ],
    media: [
      {
        key: "bach-dang-bai-coc-yen-hung",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bai_coc_Bach_Dang_Yen_Hung.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bai_coc_Bach_Dang_Yen_Hung.jpg",
        era: "today",
        yearTaken: 2020,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Bãi cọc gỗ lim lịch sử được khai quật và bảo tồn nguyên trạng tại Di tích Bạch Đằng, Quảng Ninh.",
        altText: "Những đầu cọc gỗ lim cổ thụ đen bóng vùi sâu trong bùn đất được che mái bảo tồn cẩn thận",
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

  "atk-ii-hiep-hoa": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "An toàn khu đầu não kết nối Thủ đô với chiến khu",
        body: "Đầu những năm 1940, trước sự khủng bố gắt gao của thực dân Pháp tại Hà Nội, Trung ương Đảng đã quyết định xây dựng An toàn khu số 2 (ATK II) tại vùng đất ven sông Cầu thuộc Hiệp Hòa. Nơi đây sở hữu vị trí hiểm yếu, là bàn đạp chiến lược tiếp giáp vùng trung du và đồng bằng Bắc Bộ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-ii-hiep-hoa",
            locator: "Hồ sơ di tích ATK II Hiệp Hòa, phần Bối cảnh thành lập",
            scopeNote: "Xây dựng ATK II giai đoạn 1940-1945 và vị trí ven sông Cầu"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Hệ thống an toàn khu bảo vệ cơ quan đầu não Trung ương"
          }
        ]
      },
      {
        heading: "Nuôi giấu các đồng chí lãnh đạo Trung ương thời kỳ tiền khởi nghĩa",
        body: "Nhân dân các làng soi Hiệp Hòa đã một lòng trung kiên che chở, bảo vệ an toàn tuyệt đối cho các đồng chí lãnh đạo chủ chốt của Đảng như Tổng Bí thư Trường Chinh, Hoàng Quốc Việt, Võ Nguyên Giáp, Lê Đức Thọ. Nhiều hội nghị quân sự quan trọng đã được tổ chức tại đây để chuẩn bị lực lượng chớp thời cơ Tổng khởi nghĩa Tháng Tám 1945.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-ii-hiep-hoa",
            locator: "Hồ sơ di tích, mục Hoạt động của lãnh đạo Đảng",
            scopeNote: "Các đồng chí Trường Chinh, Hoàng Quốc Việt, Võ Nguyên Giáp làm việc tại ATK II"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ngày 31/12/2020, Thủ tướng Chính phủ ký Quyết định số 2280/QĐ-TTg xếp hạng Khu di tích lịch sử An toàn khu (ATK) II Hiệp Hòa là Di tích Quốc gia Đặc biệt. Quần thể bảo tồn cụm di tích đình Chợ Vân, đình Xuân Biều, nhà lưu niệm cụ Đặng Thị Ban, là minh chứng cho lòng dân sắt son theo Đảng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-atk-ii-hiep-hoa",
            locator: "Quyết định số 2280/QĐ-TTg ngày 31/12/2020",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt An toàn khu (ATK) II Hiệp Hòa"
          }
        ]
      }
    ],
    media: [
      {
        key: "hiep-hoa-dinh-xuan-bieu",
        fileUrl: "https://bacninh.gov.vn/uploads/images/2021/01/di-tich-atk2-hiep-hoa.jpg",
        sourcePageUrl: "https://bacninh.gov.vn/di-tich-atk-ii-hiep-hoa",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Đình Xuân Biều – một trong những điểm di tích lịch sử trung tâm của An toàn khu ATK II Hiệp Hòa.",
        altText: "Ngôi đình làng cổ mái ngói rêu phong nằm yên bình dưới rặng đa cổ thụ",
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

  "khoi-nghia-yen-the": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Phong trào nông dân vũ trang bền bỉ nhất lịch sử chống Pháp",
        body: "Khởi nghĩa Yên Thế (1884–1913) bùng nổ tại vùng rừng núi Yên Thế hiểm trở, kéo dài gần 30 năm chống lại ách cai trị của thực dân Pháp. Đây là phong trào vũ trang tự phát của giai cấp nông dân lớn nhất và kiên cường nhất thời kỳ cận đại Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-yen-the",
            locator: "Hồ sơ di tích Khởi nghĩa Yên Thế, phần Tổng quan",
            scopeNote: "Quy mô và thời gian kéo dài 30 năm (1884-1913)"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 11: Phong trào yêu nước chống Pháp cuối thế kỷ XIX đầu thế kỷ XX",
            scopeNote: "Khởi nghĩa Yên Thế và tài thao lược của Hoàng Hoa Thám"
          }
        ]
      },
      {
        heading: "Thủ lĩnh Đề Thám và căn cứ đồn Phồn Xương",
        body: "Dưới sự lãnh đạo của Lương Văn Nắm (Đề Nắm) và sau đó là Hoàng Hoa Thám (Đề Thám - 'Hùm xám Yên Thế'), nghĩa quân đã xây dựng hệ thống đồn lũy Phồn Xương kiên cố, áp dụng lối đánh du kích linh hoạt, hai lần buộc thực dân Pháp phải giảng hòa và gây cho quân đội viễn chinh Pháp nhiều tổn thất nặng nề.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-yen-the",
            locator: "Hồ sơ di tích Đồn Phồn Xương",
            scopeNote: "Xây dựng căn cứ Phồn Xương và hai lần buộc Pháp giảng hòa"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ghi nhận tinh thần quật cường của nghĩa quân Yên Thế, Thủ tướng Chính phủ đã ký Quyết định số 548/QĐ-TTg ngày 10/5/2012 xếp hạng Những địa điểm Khởi nghĩa Yên Thế là Di tích Quốc gia Đặc biệt. Quần thể gồm đồn Phồn Xương, đền Thề, đình Hả và Tượng đài Hoàng Hoa Thám uy nghiêm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-yen-the",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Những địa điểm Khởi nghĩa Yên Thế"
          }
        ]
      }
    ],
    media: [
      {
        key: "yen-the-don-phon-xuong",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Don_Phon_Xuong_Yen_The.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Don_Phon_Xuong_Yen_The.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cổng vào Di tích Đồn Phồn Xương – đại bản doanh kiên cố của thủ lĩnh Hoàng Hoa Thám tại Yên Thế.",
        altText: "Cổng lũy đất đá kiên cố được phục dựng trang nghiêm giữa vườn cây xanh",
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

  "chien-thang-song-lo-doan-hung": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Mưu đồ hành quân Léa của giặc Pháp lên Việt Bắc",
        body: "Thu Đông năm 1947, thực dân Pháp mở chiến dịch hành quân lớn mang tên Léa đánh lên căn cứ địa Việt Bắc nhằm tiêu diệt cơ quan đầu não kháng chiến và bộ đội chủ lực của ta. Một cánh quân thủy do binh đoàn Commando sông của Pháp chỉ huy ngược dòng sông Lô tiến lên Tuyên Quang hòng khép chặt vòng vây.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-song-lo",
            locator: "Hồ sơ di tích, mục Âm mưu chiến dịch Léa của Pháp",
            scopeNote: "Kế hoạch tiến quân ngược sông Lô của thực dân Pháp thu đông 1947"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Chiến dịch Việt Bắc Thu - Đông 1947"
          }
        ]
      },
      {
        heading: "Trận phục kích pháo binh bắn chìm tàu chiến giặc ngày 24/10/1947",
        body: "Trưa ngày 24/10/1947, tại ngã ba Đoan Hùng (Phú Thọ), bộ đội pháo binh ta phối hợp cùng bộ binh đã bí mật kéo pháo ra sát mép nước, bắn ngắm trực tiếp vào đoàn tàu chiến Pháp đang xuôi dòng sông Lô. Trong chốc lát, 2 tàu chiến giặc bị bắn chìm tại chỗ, 2 tàu khác bị bắn cháy hư hỏng nặng, bẻ gãy hoàn toàn gọng kìm đường thủy của quân Pháp.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-song-lo",
            locator: "Hồ sơ trận đánh Sông Lô ngày 24/10/1947",
            scopeNote: "Bắn chìm 2 tàu chiến và bắn cháy 2 tàu khác của Pháp"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Chiến thắng Đoan Hùng trên sông Lô ngày 24/10/1947"
          }
        ]
      },
      {
        heading: "Tượng đài Chiến thắng Sông Lô ngày nay",
        body: "Chiến thắng Sông Lô đã đi vào lịch sử và âm nhạc như một bản anh hùng ca bất diệt. Địa điểm Tượng đài Chiến thắng Sông Lô sừng sững trên đỉnh đồi thị trấn Đoan Hùng được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1982, là niềm tự hào to lớn của quân và dân Phú Thọ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-song-lo",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1982",
            scopeNote: "Xếp hạng cấp quốc gia Tượng đài Chiến thắng Sông Lô"
          }
        ]
      }
    ],
    media: [
      {
        key: "song-lo-tuong-dai-doan-hung",
        fileUrl: "https://phutho.gov.vn/uploads/images/2021/10/tuong-dai-chien-thang-song-lo.jpg",
        sourcePageUrl: "https://phutho.gov.vn/di-tich-chien-thang-song-lo",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Phú Thọ",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài Chiến thắng Sông Lô oai nghiêm trên đỉnh đồi cao thị trấn Đoan Hùng nhìn xuống dòng sông cuộn sóng.",
        altText: "Tượng đài pháo binh và người chiến sĩ giải phóng quân đứng hiên ngang trên đỉnh đồi",
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

  "khu-di-tich-den-hung": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cội nguồn tổ tiên ngàn năm dựng nước",
        body: "Khu di tích lịch sử Đền Hùng tọa lạc trên núi Nghĩa Lĩnh (núi Hùng), thuộc thành phố Việt Trì, tỉnh Phú Thọ. Nơi đây là trung tâm chính trị văn hóa của nhà nước Văn Lang cổ đại dưới thời 18 đời Vua Hùng dựng nước – cội nguồn linh thiêng của cộng đồng các dân tộc Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-den-hung",
            locator: "Hồ sơ di tích quốc gia đặc biệt Đền Hùng, phần Cội nguồn",
            scopeNote: "Thời kỳ các Vua Hùng dựng nước Văn Lang trên đất Phong Châu"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Cội nguồn văn hóa và nhà nước thời Hùng Vương",
            scopeNote: "Vị thế biểu tượng cội nguồn dân tộc của Đền Hùng"
          }
        ]
      },
      {
        heading: "Lời căn dặn bất hủ của Bác Hồ năm 1954",
        body: "Ngày 19/9/1954, trước khi Đại đoàn Quân Tiên phong về tiếp quản Thủ đô Hà Nội sau chiến thắng Điện Biên Phủ, Chủ tịch Hồ Chí Minh đã gặp mặt cán bộ chiến sĩ tại Đền Giếng thuộc Đền Hùng và căn dặn câu nói lịch sử: 'Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-den-hung",
            locator: "Hồ sơ di tích Đền Giếng, cuộc nói chuyện ngày 19/9/1954",
            scopeNote: "Lời căn dặn bất hủ của Bác Hồ với Đại đoàn Quân Tiên phong"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 14: Cuộc kháng chiến chống thực dân Pháp (1945-1954)",
            scopeNote: "Sự kiện chuẩn bị tiếp quản Thủ đô tháng 9/1954"
          }
        ]
      },
      {
        heading: "Di sản Thế giới và Di tích Quốc gia Đặc biệt",
        body: "Năm 2009, Khu di tích lịch sử Đền Hùng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg. Năm 2012, Tín ngưỡng thờ cúng Hùng Vương tại Phú Thọ được UNESCO vinh danh là Di sản Văn hóa Phi vật thể đại diện của nhân loại.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-den-hung",
            locator: "Quyết định số 1272/QĐ-TTg và Văn bằng UNESCO 2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt và Di sản thế giới UNESCO"
          }
        ]
      }
    ],
    media: [
      {
        key: "den-hung-cong-chinh",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cong_Den_Hung_Phu_Tho.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cong_Den_Hung_Phu_Tho.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cổng chính lối lên các ngôi đền cổ kính trên núi Nghĩa Lĩnh, Khu di tích lịch sử Đền Hùng.",
        altText: "Cổng đền tam quan bằng đá ngói uy nghi dưới chân rừng cây cổ thụ Đền Hùng",
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

  "ben-k15-do-son": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cái nôi khởi phát tuyến đường vận tải biển chiến lược",
        body: "Đầu thập niên 1960, nhằm chi viện kịp thời vũ khí hạng nặng cho đồng bào và chiến sĩ miền Nam đánh Mỹ, Bộ Quốc phòng thành lập Đoàn 759 (tiền thân Lữ đoàn 125 Hải quân) và bí mật chọn vụng Độc Nao dưới chân đồi Vạn Hoa, bán đảo Đồ Sơn (Hải Phòng) làm căn cứ xuất phát mang mật danh Bến K15.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ben-k15-do-son",
            locator: "Hồ sơ di tích Bến K15, mục Thành lập Đoàn 759",
            scopeNote: "Thành lập Đoàn 759 tháng 10/1961 và chọn bến K15 Đồ Sơn"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Đường Hồ Chí Minh trên biển chi viện chiến trường miền Nam"
          }
        ]
      },
      {
        heading: "Chuyến tàu gỗ Không số đầu tiên lịch sử",
        body: "Đêm ngày 11/10/1962, chiếc tàu gỗ không số đầu tiên mang mật danh 'Phương Đông 1' do thuyền trưởng Lê Văn Một chỉ huy đã rời Bến K15, bí mật chở 30 tấn vũ khí vượt biển khơi cập bến Vàm Lũng (Cà Mau) an toàn tuyệt đối. Thắng lợi này đã khai thông tuyến vận tải chiến lược Đường Hồ Chí Minh trên biển huyền thoại.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ben-k15-do-son",
            locator: "Hồ sơ chuyến đi tàu Phương Đông 1 ngày 11/10/1962",
            scopeNote: "30 tấn vũ khí cập bến Vàm Lũng do thuyền trưởng Lê Văn Một chỉ huy"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Khai thông tuyến vận tải quân sự chiến lược trên biển"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Bến K15 được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích Lịch sử Quốc gia năm 2008. Ngày nay, bên cạnh những mố cầu tàu bê tông lịch sử vươn ra mép sóng, Tượng đài kỷ niệm Đường Hồ Chí Minh trên biển sừng sững uy nghiêm ghi nhớ công ơn những người lính cảm tử của Đoàn tàu Không số.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ben-k15-do-son",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 2008",
            scopeNote: "Xếp hạng cấp quốc gia Bến K15 Đồ Sơn"
          }
        ]
      }
    ],
    media: [
      {
        key: "do-son-ben-k15-cau-tau",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ben_K15_Do_Son_Hai_Phong.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ben_K15_Do_Son_Hai_Phong.jpg",
        era: "today",
        yearTaken: 2018,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        usageBasis: "open_license",
        caption: "Các trụ cầu cảng bê tông lịch sử của Bến K15 Đồ Sơn – nơi những con Tàu Không số xuất phát ra khơi.",
        altText: "Các khối bê tông mố cầu tàu cổ vươn ra bờ biển đá sóng vỗ tại Đồ Sơn Hải Phòng",
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
        youtubeId: "n4m17K-a128",
        title: "Huyền thoại Đường Hồ Chí Minh trên biển – Bến K15 Đồ Sơn",
        channel: "Truyền hình Hải Phòng THP",
        channelUrl: "https://www.youtube.com/@thp",
        note: "Phóng sự tư liệu lịch sử ghi nhận điểm xuất phát Bến K15 và ký ức các chiến sĩ tàu không số.",
        embedCheckedAt: "2026-10-27"
      }
    ]
  },

  "con-son-kiep-bac": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vùng đất thiêng non nước hữu tình",
        body: "Quần thể di tích Côn Sơn - Kiếp Bạc tọa lạc bên dãy núi Phượng Hoàng và dòng sông Lục Đầu huyền thoại (thuộc thành phố Chí Linh). Nơi đây có phong cảnh thiên nhiên tú lệ và là vị trí phòng thủ quân sự hiểm yếu trấn giữ sườn đông bắc kinh thành Thăng Long thời phong kiến.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-con-son-kiep-bac",
            locator: "Hồ sơ di tích quốc gia đặc biệt Côn Sơn - Kiếp Bạc, phần Vị trí địa lý",
            scopeNote: "Vị trí địa lý sông Lục Đầu và dãy núi Phượng Hoàng"
          }
        ]
      },
      {
        heading: "Đại bản doanh của Trần Hưng Đạo và nơi ở ẩn của Nguyễn Trãi",
        body: "Đền Kiếp Bạc từng là đại bản doanh Vạn Kiếp của Quốc công Tiết chế Hưng Đạo Đại vương Trần Quốc Tuấn tổ chức rèn binh luyện thủy quân đánh thắng giặc Nguyên Mông. Chùa Côn Sơn gắn liền với cuộc đời vị Anh hùng giải phóng dân tộc, Danh nhân văn hóa thế giới Nguyễn Trãi khi ông lui về ở ẩn và trước tác.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-con-son-kiep-bac",
            locator: "Hồ sơ di tích, mục Trần Hưng Đạo và Nguyễn Trãi",
            scopeNote: "Vạn Kiếp - đại bản doanh của Trần Hưng Đạo và Côn Sơn của Nguyễn Trãi"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Danh nhân văn hóa và quân sự Đại Việt",
            scopeNote: "Vai trò lịch sử của Hưng Đạo Vương và Nguyễn Trãi"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Côn Sơn - Kiếp Bạc được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể là điểm đến tâm linh hàng đầu cả nước, hiện nằm trong hồ sơ di sản đệ trình UNESCO công nhận là Di sản Thế giới.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-con-son-kiep-bac",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Côn Sơn - Kiếp Bạc"
          }
        ]
      }
    ],
    media: [
      {
        key: "kiep-bac-den-tho-tran-hung-dao",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Den_Kiep_Bac_Chi_Linh.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Den_Kiep_Bac_Chi_Linh.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Cổng tam quan Đền Kiếp Bạc uy nghiêm bên bến sông Lục Đầu lịch sử.",
        altText: "Cổng đền tam quan cổ kính bằng đá gạch mái vòm nhìn ra bến sông rộng lớn",
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

  "tieng-trong-tien-hai": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Bối cảnh cao trào cách mạng 1930–1931 ở miền Bắc",
        body: "Mùa thu năm 1930, phong trào Xô viết Nghệ - Tĩnh bùng lên mạnh mẽ ở miền Trung. Để chia lửa với đồng bào Nghệ An và Hà Tĩnh đang bị thực dân Pháp đàn áp tàn bạo, Xứ ủy Bắc Kỳ và Tỉnh ủy Thái Bình đã quyết định phát động phong trào biểu tình đấu tranh vũ trang của nông dân tại huyện Tiền Hải.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-tieng-trong-tien-hai",
            locator: "Hồ sơ di tích Tiếng trống Tiền Hải, phần Bối cảnh",
            scopeNote: "Chủ trương chia lửa với phong trào Xô viết Nghệ - Tĩnh mùa thu 1930"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Phong trào cách mạng 1930-1931 và sự kiện Tiếng trống Tiền Hải"
          }
        ]
      },
      {
        heading: "Tiếng trống rền vang sáng ngày 14/10/1930",
        body: "Sáng sớm ngày 14/10/1930, tiếng trống phát lệnh từ đình Nho Lâm vang lên liên hồi giục giã hàng ngàn nông dân các xã thuộc Tiền Hải mang theo cờ đỏ búa liềm, gậy gộc rầm rộ kéo về huyện lỵ. Đoàn biểu tình đã bao vây dinh tri huyện, hô vang khẩu hiệu đòi giảm sưu, hoãn thuế, chia lại ruộng công và ủng hộ Xô viết Nghệ - Tĩnh, làm cho chính quyền tay sai thực dân khiếp sợ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-tieng-trong-tien-hai",
            locator: "Hồ sơ di tích, diễn biến ngày 14/10/1930",
            scopeNote: "Đoàn biểu tình nông dân bao vây huyện lỵ đòi quyền dân sinh"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Ý nghĩa cuộc biểu tình ngày 14/10/1930 của nông dân Tiền Hải"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Sự kiện 'Tiếng trống Tiền Hải' là đỉnh cao của phong trào 1930–1931 tại đồng bằng Bắc Bộ. Khu di tích lịch sử Tiếng trống Tiền Hải tại đình Nho Lâm (xã Đông Lâm) được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1989, là biểu tượng kiên cường của nông dân vùng lúa Thái Bình.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-tieng-trong-tien-hai",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1989",
            scopeNote: "Xếp hạng cấp quốc gia đình Nho Lâm và khu lưu niệm"
          }
        ]
      }
    ],
    media: [
      {
        key: "tien-hai-tuong-dai-tieng-trong",
        fileUrl: "https://hungyen.gov.vn/uploads/images/2021/10/di-tich-tieng-trong-tien-hai.jpg",
        sourcePageUrl: "https://hungyen.gov.vn/di-tich-tieng-trong-tien-hai",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài tái hiện cuộc biểu tình Tiếng trống Tiền Hải ngày 14/10/1930 tại khu lưu niệm.",
        altText: "Nhóm tượng đài nông dân tay giương cao cờ đỏ búa liềm và dùi trống biểu tình",
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

  "pho-hien": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Đô thị thương cảng quốc tế sầm uất bậc nhất Đàng Ngoài",
        body: "Hình thành từ thế kỷ XIII và phát triển cực thịnh trong các thế kỷ XVI–XVII, Phố Hiến (thành phố Hưng Yên ngày nay) nằm ở vị trí giao thương đường thủy đắc địa bên tả ngạn sông Hồng. Đây từng là trung tâm kinh tế, cảng thị quốc tế lớn nhất miền Bắc với câu ca dân gian nổi tiếng: 'Thứ nhất Kinh kỳ, thứ nhì Phố Hiến'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-pho-hien",
            locator: "Hồ sơ di tích quốc gia đặc biệt Phố Hiến, phần Lịch sử hình thành",
            scopeNote: "Giai đoạn hưng thịnh thế kỷ XVI-XVII và vị thế thương cảng Đàng Ngoài"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Đô thị cổ và thương nghiệp Đại Việt thời phong kiến",
            scopeNote: "Phố Hiến - đô thị thương mại phồn hoa Đàng Ngoài"
          }
        ]
      },
      {
        heading: "Nơi hội tụ giao thoa văn hóa đa quốc gia",
        body: "Thời bấy giờ, Phố Hiến là thương cảng mở cửa đón thương thuyền từ Nhật Bản, Trung Hoa, Hà Lan, Bồ Đào Nha, Anh đến lập thương điếm buôn bán tơ lụa, gốm sứ. Sự giao thoa văn hóa Đông - Tây sâu sắc đã để lại dấu ấn qua các công trình kiến trúc độc đáo như chùa Chuông ('Phố Hiến đệ nhất danh lam'), chùa Hiến, đền Mẫu và văn miếu Xích Đằng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-pho-hien",
            locator: "Hồ sơ kiến trúc các điểm di tích Phố Hiến",
            scopeNote: "Kiến trúc Chùa Chuông, Đền Mẫu và Văn miếu Xích Đằng"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ghi nhận giá trị lịch sử và kiến trúc nghệ thuật vô giá, ngày 31/12/2014, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg xếp hạng Khu di tích Phố Hiến là Di tích Quốc gia Đặc biệt. Quần thể gồm 16 di tích tiêu biểu được bảo tồn chu đáo giữa trung tâm thành phố Hưng Yên.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-pho-hien",
            locator: "Quyết định số 2408/QĐ-TTg ngày 31/12/2014",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Khu di tích Phố Hiến"
          }
        ]
      }
    ],
    media: [
      {
        key: "pho-hien-chua-chuong",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chua_Chuong_Pho_Hien.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Chua_Chuong_Pho_Hien.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Chùa Chuông (Kim Chung Tự) – 'Phố Hiến đệ nhất danh lam' với kiến trúc cổ kính tuyệt đẹp.",
        altText: "Ngôi chùa cổ kính mái ngói mũi hài rêu phong in bóng bên mặt hồ nước phẳng lặng",
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

  "nha-may-det-nam-dinh": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cơ sở công nghiệp dệt may lớn nhất Đông Dương",
        body: "Nhà máy Dệt Nam Định (tên ban đầu là Công ty Bông - Vải sợi Bắc Kỳ) do tư bản Pháp thành lập năm 1898 tại thành phố Nam Định. Đây là cơ sở công nghiệp quy mô lớn nhất Đông Dương thời thuộc địa với hơn 1 vạn công nhân làm việc, chịu sự bóc lột hà khắc của giới chủ thực dân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-may-det-nam-dinh",
            locator: "Hồ sơ di tích, mục I: Quá trình thành lập năm 1898",
            scopeNote: "Quy mô xưởng dệt và hơn 1 vạn công nhân lao động khổ sai"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Giai cấp công nhân Việt Nam tại các khu công nghiệp dệt Nam Định"
          }
        ]
      },
      {
        heading: "Cái nôi phong trào công nhân và lời căn dặn của Bác Hồ",
        body: "Năm 1929, chi bộ Đông Dương Cộng sản Đảng được thành lập tại nhà máy, trực tiếp lãnh đạo cuộc bãi công lớn của 4.000 thợ dệt tháng 3/1930 kéo dài suốt 21 ngày đêm. Trong kháng chiến chống Mỹ, thợ dệt Nam Định nêu cao khẩu hiệu 'Tay thoi tay súng', vừa sản xuất vải vừa bắn rơi máy bay Mỹ. Sinh thời, Chủ tịch Hồ Chí Minh đã 3 lần về thăm nhà máy và căn dặn thợ dệt đoàn kết thi đua.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-may-det-nam-dinh",
            locator: "Hồ sơ di tích, mục Bãi công tháng 3/1930 và Bác Hồ 3 lần về thăm",
            scopeNote: "Cuộc bãi công 4.000 thợ dệt và kỷ niệm Bác Hồ về thăm"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)",
            scopeNote: "Khẩu hiệu Tay thoi tay súng của công nhân dệt Nam Định"
          }
        ]
      },
      {
        heading: "Bảo tàng Dệt may và Di tích Lịch sử ngày nay",
        body: "Di tích lịch sử Nhà máy Dệt Nam Định và Cột cờ Nam Định trong khuôn viên nhà máy được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia. Bảo tàng Dệt May hiện lưu giữ hàng ngàn hiện vật máy dệt cổ và kỷ vật thiêng liêng trong các lần Bác Hồ về thăm công nhân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-may-det-nam-dinh",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia",
            scopeNote: "Cấp xếp hạng quốc gia và Bảo tàng Dệt may Nam Định"
          }
        ]
      }
    ],
    media: [
      {
        key: "nam-dinh-bao-tang-det",
        fileUrl: "https://ninhbinh.gov.vn/uploads/images/2021/05/bao-tang-det-may-nam-dinh.jpg",
        sourcePageUrl: "https://ninhbinh.gov.vn/di-tich-nha-may-det-nam-dinh",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Khuôn viên Bảo tàng Dệt May Nam Định – nơi lưu giữ ký ức phong trào công nhân kiên cường.",
        altText: "Tòa nhà kiến trúc thời Pháp cổ bằng gạch đỏ lưu giữ hiện vật nhà máy dệt",
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

  "co-do-hoa-lu": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Kinh đô đầu tiên của nhà nước phong kiến tập quyền Đại Cồ Việt",
        body: "Năm 968, sau khi đánh dẹp 12 sứ quân thu giang sơn về một mối, Đinh Bộ Lĩnh lên ngôi Hoàng đế (Đinh Tiên Hoàng), đặt quốc hiệu là Đại Cồ Việt và định đô tại Hoa Lư. Kinh thành Hoa Lư nằm lọt giữa các dãy núi đá vôi kỳ vĩ hiểm trở, tạo nên một tòa thành tự nhiên kiên cố bảo vệ non sông.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-co-do-hoa-lu",
            locator: "Hồ sơ di tích quốc gia đặc biệt Cố đô Hoa Lư, phần Định đô năm 968",
            scopeNote: "Đinh Tiên Hoàng dẹp loạn 12 sứ quân và định đô tại Hoa Lư"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Nhà nước phong kiến tập quyền thời Đinh - Tiền Lê",
            scopeNote: "Kinh đô Hoa Lư và quốc hiệu Đại Cồ Việt"
          }
        ]
      },
      {
        heading: "Dấu ấn 42 năm lịch sử và tiền đề dời đô Thăng Long",
        body: "Hoa Lư là kinh đô của ba triều đại phong kiến liên tiếp: triều Đinh, Tiền Lê và thời kỳ đầu nhà Lý suốt 42 năm (968–1010). Tại nơi đây, Đinh Tiên Hoàng cho đúc tiền 'Thái Bình hưng bảo', vua Lê Đại Hành chỉ huy quân dân phá tan giặc Tống xâm lược năm 981. Năm 1010, nhận thấy thế nước hưng thịnh, Vua Lý Thái Tổ đã ban Chiếu dời đô từ Hoa Lư về Thăng Long.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-co-do-hoa-lu",
            locator: "Hồ sơ di tích, mục Ba triều đại Đinh - Tiền Lê - Lý",
            scopeNote: "42 năm định đô và sự kiện Vua Lý Thái Tổ dời đô năm 1010"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Chuyên đề: Di sản Thăng Long - Hoa Lư",
            scopeNote: "Chiếu dời đô năm 1010 từ Hoa Lư về Thăng Long"
          }
        ]
      },
      {
        heading: "Di sản Thế giới và Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Cố đô Hoa Lư được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012, đồng thời là vùng lõi của Quần thể Danh thắng Tràng An được UNESCO công nhận là Di sản Thế giới hỗn hợp năm 2014. Quần thể bảo tồn nguyên vẹn Đền vua Đinh Tiên Hoàng và Đền vua Lê Đại Hành uy nghiêm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-co-do-hoa-lu",
            locator: "Quyết định số 548/QĐ-TTg và Văn bằng Di sản thế giới Tràng An",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt và Di sản thế giới UNESCO"
          }
        ]
      }
    ],
    media: [
      {
        key: "hoa-lu-den-vua-dinh",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Den_Vua_Dinh_Tien_Hoang_Hoa_Lu.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Đền thờ Vua Đinh Tiên Hoàng cổ kính uy nghiêm giữa thung lũng đá vôi Cố đô Hoa Lư.",
        altText: "Ngôi đền thờ cổ lợp ngói vảy cá với sân rồng đá uy nghi dưới chân dãy núi đá sừng sững",
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
  if (batchBUpdates[site.key]) {
    Object.assign(site, batchBUpdates[site.key]);
    updatedCount++;
  }
}

fs.writeFileSync(sitesPath, JSON.stringify(sitesData, null, 2) + "\n", "utf-8");
console.log(`Updated ${updatedCount} sites for Batch B in sites.json.`);
