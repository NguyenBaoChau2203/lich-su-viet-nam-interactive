import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkgDir = path.join(root, "supabase/content/heritage-sites/v1");

const sitesPath = path.join(pkgDir, "sites.json");
const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf-8"));

// Batch D accepted sites mapping (20 sites)
const batchDUpdates = {
  "buon-ma-thuot-1975": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Đòn điểm huyệt chiến lược trên chiến trường Tây Nguyên",
        body: "Đầu năm 1975, trong kế hoạch giải phóng hoàn toàn miền Nam, Bộ Chính trị và Quân ủy Trung ương đã chọn thị xã Buôn Ma Thuột (Đắk Lắk) làm mục tiêu tiến công mở màn quyết định của Chiến dịch Tây Nguyên. Nơi đây là trung tâm chính trị, quân sự hiểm yếu nhưng đối phương lại phán đoán sai lầm, cho rằng ta sẽ đánh vào Pleiku hoặc Kon Tum.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-buon-ma-thuot",
            locator: "Hồ sơ di tích Chiến thắng Buôn Ma Thuột, phần Kế hoạch chiến lược",
            scopeNote: "Quyết định chọn Buôn Ma Thuột làm đòn điểm huyệt mở màn năm 1975"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến dịch Tây Nguyên mở màn cuộc Tổng tiến công mùa Xuân 1975"
          }
        ]
      },
      {
        heading: "Trận tiến công thần tốc ngày 10/3/1975",
        body: "Đúng 2 giờ sáng ngày 10/3/1975, quân ta đồng loạt nổ súng đánh vào các vị trí then chốt như Sở chỉ huy Sư đoàn 23 ngụy, sân bay Hòa Bình và thị xã. Sau hơn 30 giờ chiến đấu dũng mãnh, quân ta đã giải phóng hoàn toàn thị xã Buôn Ma Thuột chiều 11/3/1975. Thắng lợi vang dội này đã châm ngòi cho cuộc rút chạy hỗn loạn của đối phương khỏi toàn bộ Tây Nguyên.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-buon-ma-thuot",
            locator: "Hồ sơ diễn biến trận đánh ngày 10-11/3/1975",
            scopeNote: "Diễn biến giải phóng Buôn Ma Thuột và sự sụp đổ của quân ngụy"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Ý nghĩa chiến thắng Buôn Ma Thuột chuyển cuộc kháng chiến sang tổng tiến công"
          }
        ]
      },
      {
        heading: "Tượng đài Chiến thắng và Di tích Nhà đày ngày nay",
        body: "Tượng đài Chiến thắng Buôn Ma Thuột mô phỏng hình ảnh chiếc xe tăng tiến vào ngã sáu trung tâm thành phố là biểu tượng hào hùng của đồng bào Tây Nguyên. Bên cạnh đó, Di tích Lịch sử Nhà đày Buôn Ma Thuột được xếp hạng Di tích Quốc gia Đặc biệt năm 2018, bảo tồn chứng tích kiên cường của các chiến sĩ cộng sản.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-buon-ma-thuot",
            locator: "Quyết định xếp hạng Di tích quốc gia đặc biệt Nhà đày Buôn Ma Thuột 2018",
            scopeNote: "Xếp hạng cấp quốc gia đặc biệt Nhà đày Buôn Ma Thuột"
          }
        ]
      }
    ],
    media: [
      {
        key: "bmt-tuong-dai-nga-sau",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Tuong_dai_Chien_thang_Buon_Ma_Thuot.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Tượng đài Chiến thắng Buôn Ma Thuột với chiếc xe tăng lịch sử tại Ngã Sáu trung tâm thành phố.",
        altText: "Bệ tượng đài bê tông cao vút nâng đỡ chiếc xe tăng hướng mũi tên về phía trước giữa vòng xoay",
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

  "vung-ro-phu-yen": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vịnh biển kín đáo chân đèo Cả",
        body: "Vịnh Vũng Rô (thị xã Đông Hòa) là vịnh nước sâu tự nhiên kín gió, ba bề được bao bọc bởi dãy núi Đèo Cả, núi Đá Bia và hòn Bà hùng vĩ. Với vị thế hiểm yếu sát tuyến đường sắt và Quốc lộ 1, nơi đây được Trung ương và Bộ Tư lệnh Hải quân chọn làm bến tiếp nhận bí mật của những chuyến Tàu Không số chi viện cho chiến trường Khu 5 và Tây Nguyên.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-vung-ro",
            locator: "Hồ sơ di tích quốc gia đặc biệt Vịnh Vũng Rô, phần Vị trí địa lý",
            scopeNote: "Vị trí vịnh nước sâu kín gió chân đèo Cả và chọn làm bến tiếp nhận"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Huyền thoại Đường Hồ Chí Minh trên biển và bến Vũng Rô"
          }
        ]
      },
      {
        heading: "Huyền thoại Tàu 41 và trận chiến quả cảm Tàu 143",
        body: "Từ cuối năm 1964 đến đầu 1965, Tàu 41 do thuyền trưởng Hồ Đắc Thạnh chỉ huy đã cập bến Vũng Rô an toàn 3 chuyến liên tiếp, đưa hàng trăm tấn vũ khí vào chiến trường. Chuyến thứ tư vào tháng 2/1965 của Tàu 143 không may bị máy bay địch phát hiện. Thuyền trưởng Lê Văn Thêm cùng các thủy thủ đã chiến đấu kiên cường và cho nổ hủy tàu để bảo vệ tuyệt đối bí mật tuyến đường biển.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-vung-ro",
            locator: "Hồ sơ sự kiện Tàu 41 và Tàu 143 tháng 2/1965",
            scopeNote: "3 chuyến tàu cập bến an toàn và trận nổ hủy Tàu 143 bảo vệ bí mật"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Địa điểm Tàu Không số Vịnh Vũng Rô được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Đài tưởng niệm hình con tàu xé sóng vươn ra biển khơi sừng sững bên làn nước xanh ngọc bích ghi nhớ công lao của những người lính cảm tử.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-vung-ro",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Vịnh Vũng Rô"
          }
        ]
      }
    ],
    media: [
      {
        key: "vung-ro-dai-tuong-niem-tau",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Vinh_Vung_Ro_Phu_Yen.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Vinh_Vung_Ro_Phu_Yen.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Toàn cảnh Vịnh Vũng Rô xanh biếc dưới chân Đèo Cả – nơi ghi dấu huyền thoại Tàu Không số.",
        altText: "Vịnh biển nước xanh ngắt hình bán nguyệt nép mình dưới chân những dãy núi đá cao hùng vĩ",
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

  "truong-duc-thanh": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Mái trường chấn hưng dân trí phong trào Duy Tân",
        body: "Trường Dục Thanh (Giáo dục Thanh niên) tọa lạc bên bờ sông Cà Ty (thành phố Phan Thiết), do các sĩ phu yêu nước phong trào Duy Tân sáng lập năm 1907. Trường dạy chữ Quốc ngữ, chữ Pháp, chữ Hán và truyền bá tư tưởng yêu nước tiến bộ, khơi dậy tinh thần tự lực tự cường dân tộc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-truong-duc-thanh",
            locator: "Hồ sơ di tích Trường Dục Thanh, phần Thành lập năm 1907",
            scopeNote: "Sĩ phu yêu nước phong trào Duy Tân sáng lập trường Dục Thanh"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 11: Phong trào yêu nước chống Pháp cuối thế kỷ XIX đầu thế kỷ XX",
            scopeNote: "Phong trào Duy Tân và chấn hưng văn hóa dân tộc"
          }
        ]
      },
      {
        heading: "Dấu chân thầy giáo Nguyễn Tất Thành năm 1910",
        body: "Tháng 9/1910, người thanh niên yêu nước Nguyễn Tất Thành (thầy giáo Thành) dừng chân tại Phan Thiết và nhận dạy học tại trường Dục Thanh. Thầy tận tình giảng dạy các môn Quốc văn, Hán văn và thể dục, truyền tình yêu quê hương đất nước cho học trò. Tháng 2/1911, Người rời trường Dục Thanh vào Sài Gòn, chuẩn bị ra đi tìm đường cứu nước ngày 5/6/1911.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-truong-duc-thanh",
            locator: "Hồ sơ thời gian Bác Hồ dạy học tháng 9/1910 - 2/1911",
            scopeNote: "Hoạt động dạy học và chuẩn bị vào Sài Gòn tìm đường cứu nước"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Nguyễn Tất Thành ra đi tìm đường cứu nước năm 1911"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Trường Dục Thanh được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1986. Khu di tích bảo tồn nguyên vẹn lớp học cổ, gian nhà Ngư, cây khế do chính tay Bác chăm sóc và giếng nước mát, nằm liền kề Bảo tàng Hồ Chí Minh chi nhánh Bình Thuận.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-truong-duc-thanh",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1986",
            scopeNote: "Xếp hạng cấp quốc gia Khu di tích Trường Dục Thanh"
          }
        ]
      }
    ],
    media: [
      {
        key: "duc-thanh-lop-hoc-xua",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Truong_Duc_Thanh_Phan_Thiet.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Truong_Duc_Thanh_Phan_Thiet.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Mái nhà gỗ cổ kính và vườn cây xanh Trường Dục Thanh – nơi thầy giáo Nguyễn Tất Thành dạy học năm 1910.",
        altText: "Ngôi nhà gỗ lợp ngói âm dương cổ kính với hàng hiên thoáng mát giữa vườn cây râm mát",
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

  "nha-lao-thieu-nhi-da-lat": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Nhà tù đặc biệt giam giữ thiếu niên yêu nước miền Nam",
        body: "Đầu năm 1971, chính quyền Sài Gòn thành lập 'Trung tâm Giáo huấn Thiếu nhi Đà Lạt' (thường gọi là Nhà lao Thiếu nhi Đà Lạt) nhằm cách ly, giam cầm và mưu toan dùng đòn roi cùng luận điệu chiêu hồi để 'tẩy não' hơn 600 thiếu niên yêu nước bị địch bắt từ các chiến trường miền Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-lao-thieu-nhi-da-lat",
            locator: "Hồ sơ di tích Nhà lao Thiếu nhi Đà Lạt, phần Thành lập 1971",
            scopeNote: "Thành lập trại giam cách ly hơn 600 thiếu niên yêu nước miền Nam"
          }
        ]
      },
      {
        heading: "Ngọn lửa kiên trung và cuộc đấu tranh bất khuất",
        body: "Dù tuổi đời chỉ từ 12 đến 17, các chiến sĩ nhỏ tuổi đã kiên cường bí mật thành lập chi bộ Đảng, tổ chức Đoàn TNCS Hồ Chí Minh ngay trong ngục tối. Anh em đồng lòng tuyệt thực, chống chào cờ ngụy, tự mổ bụng phản đối đòn tra tấn dã man và tổ chức vượt ngục quả cảm, giữ trọn khí tiết của người chiến sĩ cách mạng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-lao-thieu-nhi-da-lat",
            locator: "Hồ sơ di tích, mục Phong trào đấu tranh của tù nhân thiếu nhi",
            scopeNote: "Tổ chức chi bộ bí mật, tuyệt thực và giữ vững khí tiết cách mạng"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Ghi nhận ý chí bất khuất phi thường của thế hệ trẻ anh hùng, năm 2009, Bộ Văn hóa, Thể thao và Du lịch đã xếp hạng Nhà lao Thiếu nhi Đà Lạt là Di tích Lịch sử Quốc gia. Tập thể các cựu tù thiếu nhi Đà Lạt được Chủ tịch nước phong tặng danh hiệu Anh hùng Lực lượng vũ trang nhân dân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-lao-thieu-nhi-da-lat",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 2009",
            scopeNote: "Xếp hạng cấp quốc gia và danh hiệu Anh hùng LLVTND"
          }
        ]
      }
    ],
    media: [
      {
        key: "da-lat-nha-lao-thieu-nhi",
        fileUrl: "https://lamdong.gov.vn/uploads/images/2021/06/nha-lao-thieu-nhi-da-lat.jpg",
        sourcePageUrl: "https://lamdong.gov.vn/di-tich-nha-lao-thieu-nhi",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Lâm Đồng",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Khuôn viên Di tích Lịch sử Quốc gia Nhà lao Thiếu nhi Đà Lạt giữa rừng thông thơ mộng.",
        altText: "Các dãy nhà giam tường đá kiên cố mái tôn xám nép mình bên sườn đồi thông Đà Lạt",
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

  "chien-thang-xuan-loc-1975": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Cánh cửa thép phòng thủ bảo vệ Sài Gòn",
        body: "Sau khi thất thủ tại Tây Nguyên và Huế - Đà Nẵng, quân đội Sài Gòn dồn sức lập phòng tuyến Xuân Lộc (Long Khánh, Đồng Nai) làm 'Cánh cửa thép' tử thủ che chắn hướng đông Sài Gòn. Tướng địch tuyên bố sẽ 'tử thủ Xuân Lộc' với Sư đoàn 18 bộ binh, lữ đoàn dù cùng bom phá CBU-55 hiện đại do Mỹ cung cấp.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-xuan-loc",
            locator: "Hồ sơ di tích Chiến thắng Xuân Lộc 1975, phần Bối cảnh",
            scopeNote: "Phòng tuyến tử thủ Cánh cửa thép bảo vệ hướng đông Sài Gòn"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến dịch Xuân Lộc mở toang cửa ngõ tiến vào Sài Gòn"
          }
        ]
      },
      {
        heading: "12 ngày đêm đập tan cánh cửa thép ngày 21/4/1975",
        body: "Từ ngày 9 đến 21/4/1975, Quân đoàn 4 cùng các lực lượng vũ trang địa phương đã tiến công kiên cường. Trước sức kháng cự điên cuồng của địch, Bộ chỉ huy chiến dịch đã linh hoạt chuyển cách đánh sang bao vây, cô lập và diệt quân viện. Ngày 21/4/1975, phòng tuyến Xuân Lộc bị đập tan hoàn toàn, tàn quân địch tháo chạy, mở toang cửa ngõ phía đông cho đại quân ta tiến vào giải phóng Sài Gòn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-xuan-loc",
            locator: "Hồ sơ diễn biến 12 ngày đêm từ 9 đến 21/4/1975",
            scopeNote: "Đập tan phòng tuyến Xuân Lộc ngày 21/4/1975 mở đường vào Sài Gòn"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Thắng lợi Xuân Lộc tạo thời cơ trực tiếp mở Chiến dịch Hồ Chí Minh"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Chiến thắng Xuân Lộc được ghi dấu bằng Tượng đài Chiến thắng Xuân Lộc uy nghi tại thành phố Long Khánh, được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1988, là niềm tự hào sáng ngời của quân dân Đồng Nai 'miền Đông gian lao mà anh dũng'.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-xuan-loc",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1988",
            scopeNote: "Xếp hạng cấp quốc gia Tượng đài Chiến thắng Xuân Lộc 1975"
          }
        ]
      }
    ],
    media: [
      {
        key: "xuan-loc-tuong-dai-chien-thang",
        fileUrl: "https://dongnai.gov.vn/uploads/images/2021/04/tuong-dai-chien-thang-xuan-loc.jpg",
        sourcePageUrl: "https://dongnai.gov.vn/di-tich-chien-thang-xuan-loc",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Đồng Nai",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài Chiến thắng Xuân Lộc 1975 sừng sững tại trung tâm thành phố Long Khánh, Đồng Nai.",
        altText: "Tượng đài hình mũi tên chiến thắng bằng đá hoa cương vươn thẳng lên bầu trời xanh",
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

  "can-cu-ta-thiet": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Đại bản doanh Bộ Tư lệnh Miền giữa đại ngàn",
        body: "Căn cứ Tà Thiết (xã An Phú, huyện Lộc Ninh) nằm sâu trong cánh rừng nguyên sinh bạt ngàn tiếp giáp biên giới. Từ năm 1973, nơi đây được xây dựng thành căn cứ địa cách mạng trung tâm của Bộ Tư lệnh Quân giải phóng miền Nam Việt Nam, bảo đảm an toàn tuyệt đối cho cơ quan chỉ đạo tác chiến.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-can-cu-ta-thiet",
            locator: "Hồ sơ di tích quốc gia đặc biệt Căn cứ Tà Thiết, phần Bối cảnh",
            scopeNote: "Xây dựng căn cứ Bộ Tư lệnh Miền tại Tà Thiết từ năm 1973"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Sở chỉ huy Chiến dịch Hồ Chí Minh lịch sử"
          }
        ]
      },
      {
        heading: "Sở Chỉ huy tiền phương Chiến dịch Hồ Chí Minh lịch sử",
        body: "Tháng 4/1975, tại căn cứ Tà Thiết, Bộ Chỉ huy Chiến dịch Hồ Chí Minh do Đại tướng Văn Tiến Dũng làm Tư lệnh, đồng chí Phạm Hùng làm Chính ủy đã họp bàn, thông qua quyết tâm tác chiến thần tốc đánh chiếm 5 mục tiêu đầu não tại Sài Gòn, chỉ huy đại quân ta toàn thắng giải phóng miền Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-can-cu-ta-thiet",
            locator: "Hồ sơ di tích lán làm việc Bộ Chỉ huy Chiến dịch Hồ Chí Minh",
            scopeNote: "Đại tướng Văn Tiến Dũng và đồng chí Phạm Hùng chỉ huy chiến dịch tháng 4/1975"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Căn cứ Bộ Chỉ huy Miền Tà Thiết được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nơi đây phục dựng nguyên trạng các căn lán làm việc bán âm, hầm họp Bộ Chỉ huy và nhà bia tưởng niệm thiêng liêng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-can-cu-ta-thiet",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Căn cứ Tà Thiết"
          }
        ]
      }
    ],
    media: [
      {
        key: "ta-thiet-lan-bo-chi-huy",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Ta_Thiet_Binh_Phuoc.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Can_cu_Ta_Thiet_Binh_Phuoc.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Lán làm việc bán âm đơn sơ của Bộ Chỉ huy Chiến dịch Hồ Chí Minh tại Căn cứ Tà Thiết.",
        altText: "Ngôi lán gỗ mái lợp lá trung quân nép mình dưới bóng cây rừng đại ngàn râm mát",
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

  "dinh-doc-lap": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Trung tâm quyền lực của chính quyền Sài Gòn",
        body: "Dinh Độc Lập (nay là Hội trường Thống Nhất) tọa lạc tại trung tâm Quận 1, Thành phố Hồ Chí Minh. Được kiến trúc sư Ngô Viết Thụ thiết kế kết hợp hài hòa giữa triết lý phương Đông và kiến trúc hiện đại, nơi đây từng là nơi ở và làm việc của Tổng thống chính quyền Sài Gòn trong suốt thời kỳ kháng chiến chống Mỹ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dinh-doc-lap",
            locator: "Hồ sơ di tích quốc gia đặc biệt Dinh Độc Lập, phần Kiến trúc",
            scopeNote: "Thiết kế của KTS Ngô Viết Thụ và vai trò dinh tổng thống"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Mục tiêu sào huyệt cuối cùng của Chiến dịch Hồ Chí Minh"
          }
        ]
      },
      {
        heading: "Giây phút lịch sử trưa 30/4/1975 toàn thắng non sông",
        body: "Đúng 10 giờ 45 phút ngày 30/4/1975, xe tăng T-59 mang số hiệu 390 và xe tăng 843 thuộc Lữ đoàn 203 đã húc đổ cánh cổng sắt tiến thẳng vào sân Dinh Độc Lập. Trung úy Bùi Quang Thận đã cắm lá cờ Mặt trận Dân tộc Giải phóng miền Nam lên nóc Dinh lúc 11 giờ 30 phút. Tổng thống Dương Văn Minh tuyên bố đầu hàng không điều kiện, non sông Việt Nam thu về một mối.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dinh-doc-lap",
            locator: "Hồ sơ sự kiện trưa ngày 30/4/1975",
            scopeNote: "Xe tăng húc cổng và cắm cờ giải phóng trên nóc Dinh Độc Lập lúc 11h30"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Toàn thắng Chiến dịch Hồ Chí Minh giải phóng hoàn toàn miền Nam"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Dinh Độc Lập được xếp hạng Di tích Quốc gia Đặc biệt đợt đầu tiên theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009 của Thủ tướng Chính phủ. Nơi đây lưu giữ nguyên trạng phòng khánh tiết, hầm chỉ huy ngầm và hai chiếc xe tăng 390, 843 (được công nhận là Bảo vật Quốc gia) đón hàng triệu lượt du khách tham quan.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dinh-doc-lap",
            locator: "Quyết định số 1272/QĐ-TTg ngày 12/8/2009",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Di tích lịch sử Dinh Độc Lập"
          }
        ]
      }
    ],
    media: [
      {
        key: "dinh-doc-lap-toan-canh",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Dinh_Doc_Lap_Reunification_Palace.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Dinh_Doc_Lap_Reunification_Palace.jpg",
        era: "today",
        yearTaken: 2020,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Toàn cảnh Di tích Quốc gia Đặc biệt Dinh Độc Lập (Hội trường Thống Nhất) tại Quận 1, TP. Hồ Chí Minh.",
        altText: "Tòa nhà dinh thự kiến trúc hiện đại với rèm hoa đá trắng trang nhã nhìn ra bãi cỏ tròn xanh mướt",
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

  "dia-dao-cu-chi": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Vùng đất thép thành đồng cửa ngõ Sài Gòn",
        body: "Huyện Củ Chi nằm ở cửa ngõ tây bắc Sài Gòn, là căn cứ kháng chiến trực tiếp đe dọa sào huyệt của đối phương. Trong chiến tranh, quân đội Mỹ đã biến nơi đây thành 'vùng tự do oanh kích' với hàng vạn tấn bom đạn, chất độc hóa học nhằm biến vùng đất thành hoang mạc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dia-dao-cu-chi",
            locator: "Hồ sơ di tích quốc gia đặc biệt Địa đạo Củ Chi, phần Bối cảnh",
            scopeNote: "Vùng đất thép Củ Chi và sự tàn phá bom đạn của quân đội Mỹ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Thành đồng Củ Chi và thế trận chiến tranh nhân dân"
          }
        ]
      },
      {
        heading: "Kỳ tích mê cung hơn 250km trong lòng đất",
        body: "Bằng lưỡi cuốc và đôi tay trần, quân và dân Củ Chi đã kiến tạo nên hệ thống địa đạo kỳ vĩ dài hơn 250km len lỏi sâu trong lòng đất. Địa đạo gồm 3 tầng hầm thông nhau, chịu được sức công phá của pháo binh và xe tăng, có đầy đủ bệnh xá, giếng nước, bếp Hoàng Cầm giấu khói và xưởng công binh chế tạo vũ khí đánh giặc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dia-dao-cu-chi",
            locator: "Khảo sát cấu trúc 3 tầng hầm địa đạo Củ Chi",
            scopeNote: "Chiều dài hơn 250km và hệ thống phòng ốc sinh hoạt ngầm"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Địa đạo Củ Chi được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Hai khu di tích Bến Dược và Bến Đình hàng năm đón hàng triệu du khách quốc tế đến chiêm ngưỡng biểu tượng kỳ diệu của ý chí chiến đấu quật cường của nhân dân Việt Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dia-dao-cu-chi",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Địa đạo Củ Chi"
          }
        ]
      }
    ],
    media: [
      {
        key: "cu-chi-mieng-dia-dao",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Dia_dao_Cu_Chi_Ben_Dinh.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Dia_dao_Cu_Chi_Ben_Dinh.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Nắp hầm bí mật ngụy trang bằng lá khô mở lối vào hệ thống mê cung Địa đạo Củ Chi.",
        altText: "Nắp hầm gỗ nhỏ ngụy trang lá cây vừa một người chui lọt giữa rừng cao su Củ Chi",
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

  "can-cu-trung-uong-cuc-mien-nam": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Thủ đô kháng chiến chỉ đạo cách mạng miền Nam",
        body: "Khu căn cứ Trung ương Cục miền Nam (còn gọi là căn cứ Rùm Đuôn, xã Tân Lập, huyện Tân Biên, Tây Ninh) nằm ẩn mình giữa cánh rừng già nguyên sinh giáp biên giới. Từ năm 1961 đến 1975, nơi đây giữ vị trí là cơ quan đầu não tối cao trực tiếp lãnh đạo phong trào cách mạng và các lực lượng vũ trang giải phóng toàn miền Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-trung-uong-cuc-mien-nam",
            locator: "Hồ sơ di tích quốc gia đặc biệt Căn cứ Trung ương Cục, phần Lịch sử",
            scopeNote: "Thành lập căn cứ năm 1961 và vai trò chỉ đạo cách mạng miền Nam"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Trung ương Cục miền Nam và Mặt trận Dân tộc Giải phóng"
          }
        ]
      },
      {
        heading: "Nơi ghi dấu bước chân những nhà lãnh đạo kiệt xuất",
        body: "Dưới những mái lán lợp lá trung quân mộc mạc nép mình bên công sự ngầm, các đồng chí lãnh đạo kiệt xuất của Đảng như Nguyễn Văn Linh, Nguyễn Chí Thanh, Phạm Hùng, Võ Văn Kiệt đã sống, làm việc và ban hành những chỉ thị, nghị quyết chiến lược đánh bại các chiến lược chiến tranh của đế quốc Mỹ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-trung-uong-cuc-mien-nam",
            locator: "Hồ sơ các khu nhà làm việc của đồng chí Nguyễn Văn Linh và Phạm Hùng",
            scopeNote: "Các đồng chí lãnh đạo sống và làm việc chỉ đạo kháng chiến"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Căn cứ Trung ương Cục miền Nam được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể bảo tồn các căn lán đơn sơ, đường giao thông hào rợp mát bóng cây cổ thụ và nhà trưng bày truyền thống cách mạng vẻ vang.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-trung-uong-cuc-mien-nam",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Căn cứ Trung ương Cục miền Nam"
          }
        ]
      }
    ],
    media: [
      {
        key: "tw-cuc-nha-la-trung-quan",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Can_cu_Trung_uong_Cuc_Tay_Ninh.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Nhà làm việc lợp lá trung quân mộc mạc tại Di tích Quốc gia Đặc biệt Căn cứ Trung ương Cục miền Nam.",
        altText: "Ngôi nhà gỗ đơn sơ mái lá trung quân nép mình dưới bóng rừng đại ngàn Tân Biên",
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

  "nga-tu-duc-hoa": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Đầu mối giao thương và căn cứ cách mạng cửa ngõ Sài Gòn",
        body: "Khu vực Ngã tư Đức Hòa (thị trấn Đức Hòa) là đầu mối giao thông huyết mạch kết nối vùng Chợ Lớn với miền Đông Nam Bộ. Nhờ lòng dân yêu nước nồng nàn, nơi đây đã sớm trở thành trung tâm cách mạng tiền khởi nghĩa của phong trào công - nông Nam Bộ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nga-tu-duc-hoa",
            locator: "Hồ sơ di tích Ngã tư Đức Hòa, phần Bối cảnh",
            scopeNote: "Vị trí giao thương và phong trào cách mạng tiền khởi nghĩa"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Sự ra đời các tổ chức Đảng Cộng sản đầu tiên tại Nam Bộ"
          }
        ]
      },
      {
        heading: "Chi bộ Đảng đầu tiên và cuộc biểu tình lịch sử ngày 4/6/1930",
        body: "Ngày 6/3/1930, đồng chí Võ Văn Tần đã thành lập Chi bộ An Nam Cộng sản Đảng đầu tiên của tỉnh Chợ Lớn tại Đức Hòa. Ngày 4/6/1930, đồng chí Châu Văn Liêm cùng Võ Văn Tần đã lãnh đạo cuộc biểu tình của hơn 5.000 nông dân đòi giảm thuế. Đồng chí Châu Văn Liêm đã anh dũng hy sinh trước họng súng kẻ thù, nêu tấm gương ái quốc sáng ngời.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nga-tu-duc-hoa",
            locator: "Hồ sơ di tích, cuộc biểu tình ngày 4/6/1930",
            scopeNote: "Thành lập chi bộ 6/3/1930 và gương hy sinh của Châu Văn Liêm"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Ngã tư Đức Hòa được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1989. Tượng đài đồng chí Võ Văn Tần và công viên tưởng niệm được xây dựng khang trang, là niềm tự hào của đồng bào Long An - Tây Ninh kiên cường.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nga-tu-duc-hoa",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1989",
            scopeNote: "Xếp hạng cấp quốc gia Khu di tích Ngã tư Đức Hòa"
          }
        ]
      }
    ],
    media: [
      {
        key: "duc-hoa-tuong-dai-vo-van-tan",
        fileUrl: "https://tayninh.gov.vn/uploads/images/2021/06/di-tich-nga-tu-duc-hoa.jpg",
        sourcePageUrl: "https://tayninh.gov.vn/di-tich-nga-tu-duc-hoa",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Tượng đài đồng chí Võ Văn Tần tại Khu di tích Lịch sử Quốc gia Ngã tư Đức Hòa.",
        altText: "Tượng đài nhà cách mạng kiên trung bằng đá đứng uy nghiêm giữa quảng trường hoa",
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

  "chien-thang-ap-bac-1963": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Thử nghiệm chiến thuật Trực thăng vận của đối phương",
        body: "Đầu năm 1963, trong chiến lược 'Chiến tranh đặc biệt', quân đội Sài Gòn dưới sự chỉ đạo của cố vấn quân sự Mỹ đã mở cuộc hành quân càn quét quy mô lớn vào ấp Bắc (xã Tân Phú, Cai Lậy), huy động máy bay trực thăng vận và xe bọc thép thiết xa vận M-113 hiện đại.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-ap-bac",
            locator: "Hồ sơ di tích quốc gia đặc biệt Chiến thắng Ấp Bắc, phần Bối cảnh",
            scopeNote: "Mỹ thử nghiệm chiến thuật Trực thăng vận và Thiết xa vận đầu năm 1963"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chiến lược Chiến tranh đặc biệt và trận đánh Ấp Bắc"
          }
        ]
      },
      {
        heading: "Chiến thắng vang dội ngày 2/1/1963 làm phá sản chiến thuật mới",
        body: "Ngày 2/1/1963, lực lượng vũ trang giải phóng cùng du kích địa phương đã kiên cường đánh bại 5 đợt tiến công của đối phương, bắn rơi 5 trực thăng, bắn cháy 3 xe bọc thép M-113, loại khỏi vòng chiến đấu hàng trăm tên địch. Chiến thắng Ấp Bắc đã chứng minh quân dân ta hoàn toàn có khả năng đánh bại các chiến thuật quân sự tối tân của Mỹ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-ap-bac",
            locator: "Hồ sơ chiến lệ trận Ấp Bắc ngày 2/1/1963",
            scopeNote: "Bắn rơi 5 trực thăng và 3 xe M-113 làm phá sản chiến thuật của Mỹ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Ý nghĩa chiến thắng Ấp Bắc dấy lên phong trào Thi đua Ấp Bắc giết giặc lập công"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Địa điểm Chiến thắng Ấp Bắc được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2280/QĐ-TTg ngày 31/12/2020. Quần thể bảo tồn tượng đài ba chiến sĩ gang thép, khu mộ liệt sĩ và nhà trưng bày hiện vật xe bọc thép, trực thăng bị bắn hạ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-ap-bac",
            locator: "Quyết định số 2280/QĐ-TTg ngày 31/12/2020",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Ấp Bắc"
          }
        ]
      }
    ],
    media: [
      {
        key: "ap-bac-tuong-dai-gang-thep",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Ap_Bac_Tien_Giang.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Khu_di_tich_Ap_Bac_Tien_Giang.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Tượng đài ba chiến sĩ gang thép tại Khu di tích Quốc gia Đặc biệt Chiến thắng Ấp Bắc.",
        altText: "Nhóm tượng đài bằng đồng đỏ tạc ba người chiến sĩ giải phóng quân xung trận anh dũng",
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

  "mo-cu-pho-bang-nguyen-sinh-sac": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Tấm gương nhà nho thanh bạch trọn đời vì dân",
        body: "Cụ Phó bảng Nguyễn Sinh Sắc (1862–1929) là thân sinh của Chủ tịch Hồ Chí Minh, một nhà nho yêu nước có nhân cách cao đẹp. Sau khi từ quan, Cụ vào Nam bốc thuốc chữa bệnh cho người nghèo và truyền bá tư tưởng yêu nước, trút hơi thở cuối cùng tại làng Hòa An (thành phố Cao Lãnh) ngày 27/10 năm Kỷ Tỵ (1929).",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-mo-nguyen-sinh-sac",
            locator: "Hồ sơ di tích Mộ Cụ Phó bảng Nguyễn Sinh Sắc, phần Tiểu sử",
            scopeNote: "Cuộc đời thanh bạch của Cụ Phó bảng và giai đoạn sống tại Hòa An"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Thân thế thân phụ Chủ tịch Hồ Chí Minh"
          }
        ]
      },
      {
        heading: "Tấm lòng son sắt của nhân dân miền Nam",
        body: "Dù trong những năm tháng kháng chiến bị địch khủng bố gắt gao, nhân dân làng Hòa An và đồng bào miền Nam vẫn một lòng bảo vệ, gìn giữ chu đáo phần mộ của Cụ. Sau ngày thống nhất non sông, khu lăng mộ được xây dựng khang trang với vòm mộ hình cánh sen thanh khiết vươn lên giữa hồ sen ngát hương.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-mo-nguyen-sinh-sac",
            locator: "Hồ sơ di tích, tấm lòng nhân dân Hòa An bảo vệ khu mộ",
            scopeNote: "Tấm lòng đồng bào miền Nam che chở phần mộ qua hai cuộc kháng chiến"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Khu di tích Mộ Cụ Phó bảng Nguyễn Sinh Sắc được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1992. Khuôn viên rộng hơn 9ha gồm khu lăng mộ, nhà sàn Bác Hồ phục dựng và làng cổ Hòa An tái hiện không gian văn hóa Nam Bộ thanh bình.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-mo-nguyen-sinh-sac",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1992",
            scopeNote: "Xếp hạng cấp quốc gia Khu di tích Cụ Phó bảng Nguyễn Sinh Sắc"
          }
        ]
      }
    ],
    media: [
      {
        key: "sinh-sac-vom-mo-canh-sen",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Mo_Cu_Nguyen_Sinh_Sac_Dong_Thap.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Khu lăng mộ Cụ Phó bảng Nguyễn Sinh Sắc với vòm mái hình cánh sen cách điệu tại thành phố Cao Lãnh.",
        altText: "Vòm mái kiến trúc hình cánh hoa sen trắng thanh thoát vươn trên mặt hồ nước phẳng lặng",
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

  "dong-khoi-ben-tre-1960": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Bối cảnh ngột ngạt dưới đạo luật 10/59",
        body: "Cuối thập niên 1950, chính quyền Ngô Đình Diệm ban hành Luật 10/59 lê máy chém đi khắp miền Nam tàn sát những người kháng chiến yêu nước. Trước tình thế ngặt nghèo 'một mất một còn', Nghị quyết 15 của Trung ương Đảng (1959) đã mở đường cho nhân dân miền Nam vùng lên đấu tranh vũ trang giải phóng buôn làng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dong-khoi-ben-tre",
            locator: "Hồ sơ di tích quốc gia đặc biệt Đồng Khởi Bến Tre, phần Bối cảnh",
            scopeNote: "Tội ác Luật 10/59 và ánh sáng Nghị quyết 15 của Đảng năm 1959"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)",
            scopeNote: "Phong trào Đồng Khởi (1959-1960) chuyển cách mạng từ giữ gìn lực lượng sang tiến công"
          }
        ]
      },
      {
        heading: "Tiếng súng Định Thủy ngày 17/1/1960 và Đội quân Tóc dài huyền thoại",
        body: "Sáng ngày 17/1/1960, dưới sự lãnh đạo trực tiếp của đồng chí Nguyễn Thị Định, cuộc khởi nghĩa đồng loạt bùng nổ tại ba xã Định Thủy, Phước Hiệp, Bình Khánh (huyện Mỏ Cày). Bằng súng ngựa trời, giáo mác, tiếng mõ dồn dập và sức mạnh vô song của 'Đội quân Tóc dài', quần chúng đã làm tan rã tề ngụy, phá ấp chiến lược, châm ngòi cho cao trào Đồng Khởi toàn miền Nam.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dong-khoi-ben-tre",
            locator: "Hồ sơ sự kiện ngày 17/1/1960 tại Định Thủy",
            scopeNote: "Đồng chí Nguyễn Thị Định chỉ đạo và sự ra đời Đội quân Tóc dài"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 15: Miền Bắc xây dựng CNXH và chi viện miền Nam (1954-1965)",
            scopeNote: "Ý nghĩa phong trào Đồng Khởi dẫn đến sự ra đời Mặt trận Dân tộc Giải phóng miền Nam"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu di tích lịch sử Đồng Khởi Bến Tre được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Nhà trưng bày di tích tại xã Định Thủy lưu giữ khẩu súng ngựa trời, chiếc mõ dừa lịch sử và tượng đài biểu tượng Đội quân Tóc dài anh dũng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-dong-khoi-ben-tre",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Đồng Khởi Bến Tre"
          }
        ]
      }
    ],
    media: [
      {
        key: "dong-khoi-dinh-thuy",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Khu_di_tich_Dong_Khoi_Ben_Tre.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Khu_di_tich_Dong_Khoi_Ben_Tre.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Nhà truyền thống Khu di tích Quốc gia Đặc biệt Đồng Khởi tại xã Định Thủy, huyện Mỏ Cày.",
        altText: "Nhà trưng bày mái dốc trang nhã bên rặng dừa xanh ngút ngàn của xứ dừa Bến Tre",
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

  "khu-tuong-niem-vo-van-kiet": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Người con ưu tú của quê hương Vĩnh Long",
        body: "Đồng chí Võ Văn Kiệt (bác Sáu Dân, tên khai sinh Phan Văn Hòa, 1922–2008) sinh ra tại xã Trung Hiệp, huyện Vũng Liêm, tỉnh Vĩnh Long. Sớm giác ngộ cách mạng từ năm 16 tuổi trong phong trào Nam Kỳ Khởi nghĩa, đồng chí đã cống hiến trọn đời cho sự nghiệp giải phóng dân tộc và phát triển đất nước.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-vo-van-kiet",
            locator: "Hồ sơ Khu tưởng niệm Thủ tướng Võ Văn Kiệt, phần Tiểu sử",
            scopeNote: "Quê hương Vũng Liêm và quá trình giác ngộ cách mạng thời niên thiếu"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 18: Đất nước trên con đường đổi mới (1986-2000)",
            scopeNote: "Nhà lãnh đạo Đổi Mới kiệt xuất của Đảng và Nhà nước"
          }
        ]
      },
      {
        heading: "Kiến trúc sư kiệt xuất của công cuộc Đổi Mới",
        body: "Trên cương vị Thủ tướng Chính phủ, đồng chí Võ Văn Kiệt đã đưa ra những quyết sách mang tính đột phá lịch sử: xây dựng đường dây tải điện 500kV Bắc - Nam xuyên rừng núi, công trình thoát lũ ra biển Tây khai phá Đồng Tháp Mười, đường Hồ Chí Minh và nhà máy lọc dầu Dung Quất, tạo tiền đề đưa kinh tế Việt Nam cất cánh.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-vo-van-kiet",
            locator: "Hồ sơ trưng bày các công trình thế kỷ đường dây 500kV và thoát lũ biển Tây",
            scopeNote: "Những quyết sách đột phá của Thủ tướng Võ Văn Kiệt"
          }
        ]
      },
      {
        heading: "Khu tưởng niệm Vườn ông Sáu Dân ngày nay",
        body: "Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt tọa lạc tại thị trấn Vũng Liêm với không gian kiến trúc mở hài hòa, cây xanh rợp bóng được nhân dân trìu mến gọi là 'Vườn ông Sáu Dân'. Nơi đây lưu giữ bức chân dung đồng chí ghép từ 15.000 bức ảnh nhỏ về cuộc đời và sự nghiệp vẻ vang của Người.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-vo-van-kiet",
            locator: "Văn bản quản lý Khu tưởng niệm Thủ tướng Võ Văn Kiệt",
            scopeNote: "Không gian kiến trúc Vườn ông Sáu Dân và bức chân dung 15.000 tấm ảnh"
          }
        ]
      }
    ],
    media: [
      {
        key: "vo-van-kiet-khu-tuong-niem",
        fileUrl: "https://vinhlong.gov.vn/uploads/images/2021/11/khu-tuong-niem-vo-van-kiet.jpg",
        sourcePageUrl: "https://vinhlong.gov.vn/di-tich-vo-van-kiet",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Vĩnh Long",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Không gian xanh mát Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt (Vườn ông Sáu Dân) tại Vũng Liêm.",
        altText: "Khuôn viên nhà tưởng niệm mái cong kiến trúc mở giữa vườn hoa cỏ xanh mướt",
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

  "nha-tu-phu-quoc": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Địa ngục trần gian giam giữ hơn 4 vạn chiến sĩ cách mạng",
        body: "Trại giam Tù binh Chiến tranh Phú Quốc (còn gọi là Nhà lao Cây Dừa, thành phố Phú Quốc) do chính quyền Sài Gòn với sự viện trợ của Mỹ xây dựng năm 1967 trên diện tích hơn 400 ha. Đây là trại giam tù binh lớn nhất miền Nam, giam giữ hơn 40.000 lượt cán bộ, chiến sĩ cách mạng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-phu-quoc",
            locator: "Hồ sơ di tích quốc gia đặc biệt Nhà tù Phú Quốc, phần Quy mô",
            scopeNote: "Quy mô 400ha và hơn 40.000 lượt chiến sĩ bị giam giữ từ 1967 đến 1973"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Chính sách đàn áp tù binh chiến tranh của Mỹ - ngụy"
          }
        ]
      },
      {
        heading: "Khí tiết kiên trung trước các ngón đòn tra tấn tàn bạo",
        body: "Kẻ thù đã áp dụng hàng chục ngón đòn tra tấn man rợ thời trung cổ như nhốt chuồng cọp kẽm gai phơi nắng mưa, đóng đinh vào xương bánh chè, đục răng, luộc người trong chảo nước sôi. Vượt lên mọi nỗi đau thể xác, các chiến sĩ cộng sản kiên trung đã bí mật lập chi bộ Đảng, tổ chức vượt ngục thần kỳ bằng đường hầm đào bằng muỗng sắt, giữ trọn lời thề trung thành với Tổ quốc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-phu-quoc",
            locator: "Hồ sơ di tích, mục Tội ác tra tấn và các cuộc vượt ngục",
            scopeNote: "Hình phạt chuồng cọp và cuộc vượt ngục bằng đường hầm đào muỗng sắt"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Ghi nhận ý chí kiên cường bất khuất của các chiến sĩ cách mạng, ngày 31/12/2014, Thủ tướng Chính phủ đã ký Quyết định số 2408/QĐ-TTg xếp hạng Trại giam Tù binh Chiến tranh Phú Quốc là Di tích Quốc gia Đặc biệt. Khuôn viên phục dựng các dãy nhà giam, chuồng cọp kẽm gai và Nghĩa trang Liệt sĩ Đồi 100 trang nghiêm.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-nha-tu-phu-quoc",
            locator: "Quyết định số 2408/QĐ-TTg ngày 31/12/2014",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Trại giam Tù binh Phú Quốc"
          }
        ]
      }
    ],
    media: [
      {
        key: "phu-quoc-chuong-cop-kem-gai",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Nha_tu_Phu_Quoc_Chuong_cop.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nha_tu_Phu_Quoc_Chuong_cop.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Mô hình phục dựng chuồng cọp kẽm gai ngoài trời tại Di tích Quốc gia Đặc biệt Nhà tù Phú Quốc.",
        altText: "Khung dây thép gai sắc nhọn bao quanh buồng nhốt chật hẹp ngoài trời trên nền cát trắng",
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

  "khu-luu-niem-ton-duc-thang": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Người con ưu tú của Cù lao Ông Hổ",
        body: "Chủ tịch Tôn Đức Thắng (Bác Tôn, 1888–1980) sinh ra tại cù lao Ông Hổ (xã Mỹ Hòa Hưng, thành phố Long Xuyên, tỉnh An Giang). Nơi đây lưu giữ ngôi nhà gỗ cổ thời niên thiếu bên dòng sông Hậu hiền hòa, nơi nuôi dưỡng phẩm chất kiên cường và lòng yêu nước thương dân của Người.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ton-duc-thang",
            locator: "Hồ sơ di tích quốc gia đặc biệt Bác Tôn, phần Quê hương",
            scopeNote: "Cù lao Ông Hổ - quê hương sinh thành của Chủ tịch Tôn Đức Thắng"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Nhà lãnh đạo công nhân lỗi lạc Tôn Đức Thắng"
          }
        ]
      },
      {
        heading: "Người thợ Ba Son kéo cờ Biển Đen và 15 năm ngục tù Côn Đảo",
        body: "Từ người thợ máy dũng cảm kéo cờ đỏ trên chiến hạm France tại Biển Đen ủng hộ Cách mạng Tháng Mười Nga năm 1919, Bác Tôn đã sáng lập Công hội đỏ Ba Son và bị thực dân Pháp kết án 20 năm khổ sai đày ra Côn Đảo. Sau Cách mạng Tháng Tám, Người trở về tiếp tục cống hiến trọn đời cho Đảng và được bầu làm Chủ tịch nước kế tục Chủ tịch Hồ Chí Minh.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ton-duc-thang",
            locator: "Hồ sơ sự kiện kéo cờ Biển Đen 1919 và 15 năm Côn Đảo",
            scopeNote: "Sự kiện Biển Đen 1919, Công hội Ba Son và 15 năm đày Côn Đảo"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Tổ chức Công hội bí mật của Tôn Đức Thắng tại Sài Gòn"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Khu lưu niệm Chủ tịch Tôn Đức Thắng được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 548/QĐ-TTg ngày 10/5/2012. Quần thể bảo tồn ngôi nhà gỗ thời niên thiếu, đền tưởng niệm trang nghiêm và chuyên cơ YAK-40 từng chở Bác Tôn vào giải phóng Sài Gòn.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ton-duc-thang",
            locator: "Quyết định số 548/QĐ-TTg ngày 10/5/2012",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Khu lưu niệm Chủ tịch Tôn Đức Thắng"
          }
        ]
      }
    ],
    media: [
      {
        key: "ton-duc-thang-nha-luu-niem",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Khu_luu_niem_Ton_Duc_Thang_An_Giang.jpg",
        era: "today",
        yearTaken: 2020,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Đền thờ Chủ tịch Tôn Đức Thắng kiến trúc cổ truyền tại Khu di tích Quốc gia Đặc biệt cù lao Ông Hổ.",
        altText: "Ngôi đền thờ gỗ cổ lợp ngói âm dương uy nghi giữa hoa viên cây xanh cù lao Ông Hổ",
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

  "chien-thang-chuong-thien-1973": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Âm mưu lấn chiếm tràn ngập lãnh thổ của đối phương",
        body: "Sau khi Hiệp định Paris được ký kết ngày 27/1/1973, chính quyền Sài Gòn đã trơ trẽn vi phạm hiệp định, dồn sức tập trung 75 lượt tiểu đoàn tinh nhuệ mở chiến dịch càn quét mang tên 'tràn ngập lãnh thổ' hòng biến vùng Chương Thiện thành bàn đạp bình định kiểm soát toàn bộ miền Tây Nam Bộ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-chuong-thien",
            locator: "Hồ sơ di tích quốc gia đặc biệt Chiến thắng Chương Thiện, phần Bối cảnh",
            scopeNote: "Kế hoạch tràn ngập lãnh thổ của địch sau Hiệp định Paris 1973"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Cuộc đấu tranh chống kế hoạch bình định lấn chiếm sau Hiệp định Paris"
          }
        ]
      },
      {
        heading: "Bẻ gãy 75 lượt tiểu đoàn địch năm 1973",
        body: "Quân và dân Quân khu 9 phối hợp cùng bộ đội địa phương đã kiên cường tổ chức đánh phản công và tiến công mãnh liệt. Trải qua hàng trăm trận đánh dũng cảm, ta đã tiêu diệt và bắt sống hàng ngàn tên địch, bẻ gãy hoàn toàn chiến dịch càn quét của 75 lượt tiểu đoàn quân đội Sài Gòn, giữ vững vùng giải phóng rộng lớn ở Tây Nam Bộ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-chuong-thien",
            locator: "Hồ sơ chiến dịch đánh bại 75 lượt tiểu đoàn địch năm 1973",
            scopeNote: "Thắng lợi bẻ gãy 75 lượt tiểu đoàn địch bảo vệ vùng giải phóng Tây Nam Bộ"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Ý nghĩa chiến thắng Chương Thiện khẳng định con đường bạo lực cách mạng"
          }
        ]
      },
      {
        heading: "Di tích Quốc gia Đặc biệt ngày nay",
        body: "Địa điểm Chiến thắng 75 lượt tiểu đoàn địch của quân và dân khu 9 tại Chương Thiện được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 2383/QĐ-TTg ngày 9/12/2013. Khu di tích tọa lạc tại thành phố Vị Thanh với tượng đài chiến thắng và bảo tàng trưng bày hiện vật sống động.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-chien-thang-chuong-thien",
            locator: "Quyết định số 2383/QĐ-TTg ngày 9/12/2013",
            scopeNote: "Xếp hạng Di tích quốc gia đặc biệt Địa điểm Chiến thắng Chương Thiện"
          }
        ]
      }
    ],
    media: [
      {
        key: "chuong-thien-tuong-dai-75-tieu-doan",
        fileUrl: "https://cantho.gov.vn/uploads/images/2021/07/di-tich-chien-thang-chuong-thien.jpg",
        sourcePageUrl: "https://cantho.gov.vn/di-tich-chien-thang-chuong-thien",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Khuôn viên Tượng đài Chiến thắng Chương Thiện – nơi đánh bại 75 lượt tiểu đoàn địch năm 1973.",
        altText: "Cụm tượng đài chiến sĩ bộ đội và nhân dân miền Tây Nam Bộ xung phong tiến công",
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

  "kham-lon-can-tho": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Nhà tù kiên cố tàn bạo nhất miền Tây Nam Bộ",
        body: "Khám Lớn Cần Thơ (Prison Provinciale) do thực dân Pháp xây dựng năm 1886 tại trung tâm thành phố Cần Thơ. Đây là nhà lao lớn và kiên cố nhất vùng Hậu Giang thời bấy giờ, dùng làm nơi giam giữ, tra tấn dã man các chiến sĩ yêu nước và đồng bào miền Tây Nam Bộ.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kham-lon-can-tho",
            locator: "Hồ sơ di tích Khám Lớn Cần Thơ, phần Xây dựng năm 1886",
            scopeNote: "Thực dân Pháp xây dựng nhà tù kiên cố tại trung tâm Cần Thơ năm 1886"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 12: Phong trào dân tộc dân chủ 1919-1930",
            scopeNote: "Hệ thống nhà tù thực dân đàn áp phong trào cách mạng Nam Bộ"
          }
        ]
      },
      {
        heading: "Trường rèn luyện ý chí của những người cộng sản",
        body: "Trong chốn lao tù tăm tối, các chiến sĩ cách mạng kiên trung như Châu Văn Liêm, Lê Văn Sô, Quản Trọng Hoàng đã biến ngục tù thành trường học cách mạng, bí mật sinh hoạt Đảng, xuất bản truyền đơn và kiên cường tổ chức tuyệt thực đòi dân sinh, giữ trọn khí tiết của người cộng sản.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kham-lon-can-tho",
            locator: "Hồ sơ di tích, hoạt động của các đồng chí tù chính trị",
            scopeNote: "Biến ngục tù thành trường học của các đồng chí Châu Văn Liêm, Quản Trọng Hoàng"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Khám Lớn Cần Thơ được Bộ Văn hóa - Thông tin xếp hạng Di tích Lịch sử Quốc gia năm 1996. Quần thể bảo tồn nguyên vẹn các buồng giam tập thể, xà lim biệt giam tối tăm và máy chém thời thuộc địa – chứng tích đanh thép tố cáo tội ác của chế độ thực dân.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-kham-lon-can-tho",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1996",
            scopeNote: "Xếp hạng cấp quốc gia Khám Lớn Cần Thơ"
          }
        ]
      }
    ],
    media: [
      {
        key: "can-tho-kham-lon-buong-giam",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Kham_Lon_Can_Tho_Prison.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kham_Lon_Can_Tho_Prison.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Bức tường đá kiên cố và cổng vào Di tích Lịch sử Quốc gia Khám Lớn Cần Thơ.",
        altText: "Tường thành nhà tù bằng đá xám cổ kính rêu phong với cổng vòm sắt sơn đen",
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

  "khoi-nghia-hon-khoai-1940": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Đốm lửa khởi nghĩa nơi đảo tiền tiêu Tổ quốc",
        body: "Đảo Hòn Khoai nằm ở vùng biển cực nam của Tổ quốc, có vị trí quân sự chiến lược khống chế tuyến hàng hải qua mũi Cà Mau. Trong cao trào Khởi nghĩa Nam Kỳ (11/1940), Chi bộ Đảng đảo Hòn Khoai do thầy giáo Phan Ngọc Hiển phụ trách đã bí mật chuẩn bị lực lượng khởi nghĩa vũ trang đánh chiếm trạm hải đăng của Pháp.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-hon-khoai",
            locator: "Hồ sơ di tích Khởi nghĩa Hòn Khoai, phần Bối cảnh",
            scopeNote: "Chi bộ Đảng Hòn Khoai và sự chỉ đạo của Phan Ngọc Hiển cuối năm 1940"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Cao trào đấu tranh vũ trang và Khởi nghĩa Nam Kỳ 1940"
          }
        ]
      },
      {
        heading: "Đêm nổi dậy 13/12/1940 và khí tiết bất khuất của Phan Ngọc Hiển",
        body: "Đêm ngày 13/12/1940, Phan Ngọc Hiển cùng nghĩa quân đã bất ngờ tấn công đồn hải đăng, tiêu diệt tên sếp đảo Olivier, thu toàn bộ súng đạn rồi vượt biển về đất liền tiếp tục chiến đấu. Dù bị thực dân Pháp bắt giữ và xử bắn ngày 12/7/1941 tại Cà Mau, câu nói bất hủ 'Chúng tôi chết cho Tổ quốc độc lập' của Phan Ngọc Hiển đã thắp sáng ngọn lửa yêu nước đời đời.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-hon-khoai",
            locator: "Hồ sơ diễn biến đêm 13/12/1940 và sự hy sinh ngày 12/7/1941",
            scopeNote: "Đánh chiếm đồn hải đăng đêm 13/12/1940 và khí tiết trước pháp trường"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 13: Cách mạng tháng Tám năm 1945",
            scopeNote: "Khởi nghĩa Hòn Khoai - dấu mốc lịch sử truyền thống cách mạng Cà Mau"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Địa điểm Khởi nghĩa Hòn Khoai được Bộ Văn hóa xếp hạng Di tích Lịch sử Quốc gia năm 1990. Ngày 13/12 được chọn làm Ngày truyền thống cách mạng vẻ vang của Đảng bộ và quân dân tỉnh Cà Mau. Ngọn hải đăng cổ và tượng đài Phan Ngọc Hiển sừng sững giữa biển khơi bảo vệ chủ quyền thiêng liêng.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-khoi-nghia-hon-khoai",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 1990",
            scopeNote: "Xếp hạng cấp quốc gia Khởi nghĩa Hòn Khoai và Ngày truyền thống Cà Mau"
          }
        ]
      }
    ],
    media: [
      {
        key: "hon-khoai-hai-dang-co",
        fileUrl: "https://camau.gov.vn/uploads/images/2021/12/hai-dang-hon-khoai-ca-mau.jpg",
        sourcePageUrl: "https://camau.gov.vn/di-tich-khoi-nghia-hon-khoai",
        era: "today",
        yearTaken: 2021,
        photographer: "Cổng Thông tin Điện tử tỉnh Cà Mau",
        license: null,
        licenseUrl: null,
        usageBasis: "coursework_reference",
        caption: "Ngọn hải đăng cổ kính trên đỉnh Hòn Khoai – nơi nổ ra cuộc khởi nghĩa vũ trang đêm 13/12/1940.",
        altText: "Ngọn tháp hải đăng cổ bằng đá xám vươn cao trên đỉnh núi phủ đầy rừng nhiệt đới giữa biển xanh",
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

  "ben-vam-lung": {
    decision: "accepted",
    decisionNote: "",
    sections: [
      {
        heading: "Bến đậu bí mật giữa rừng đước ngập mặn Cà Mau",
        body: "Cửa biển Vàm Lũng (xã Tân Ân, huyện Ngọc Hiển) nằm ẩn mình giữa bạt ngàn rừng đước, mắm ngập mặn nơi tận cùng mũi Cà Mau. Với mạng lưới kênh rạch chằng chịt dẫn thẳng vào căn cứ U Minh, nơi đây được Trung ương chọn làm bến tiếp nhận vũ khí bí mật của tuyến Đường Hồ Chí Minh trên biển.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ben-vam-lung",
            locator: "Hồ sơ di tích Bến Vàm Lũng, phần Vị trí địa lý",
            scopeNote: "Vị trí bí mật giữa rừng ngập mặn Tân Ân tiếp nhận Tàu Không số"
          },
          {
            sourceKey: "src-sgk-su-12",
            locator: "Bài 16: Cuộc kháng chiến chống Mỹ, cứu nước (1954-1975)",
            scopeNote: "Điểm cuối Đường Hồ Chí Minh trên biển chi viện Nam Bộ"
          }
        ]
      },
      {
        heading: "Đón con tàu Phương Đông 1 cập bến an toàn năm 1962",
        body: "Đêm ngày 16/10/1962, sau 5 ngày đêm vượt sóng gió biển khơi và mạng lưới tuần tiễu của địch từ Bến K15 Đồ Sơn, con tàu gỗ Phương Đông 1 do thuyền trưởng Lê Văn Một chỉ huy đã cập bến Vàm Lũng an toàn tuyệt đối với 30 tấn vũ khí. Bến Vàm Lũng sau đó đã đón hàng chục chuyến tàu không số chi viện đạn dược cho quân dân miền Tây đánh thắng giặc.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ben-vam-lung",
            locator: "Hồ sơ đón chuyến tàu Phương Đông 1 ngày 16/10/1962",
            scopeNote: "Đón 30 tấn vũ khí từ tàu Phương Đông 1 do Lê Văn Một chỉ huy cập bến"
          }
        ]
      },
      {
        heading: "Di tích Lịch sử Quốc gia ngày nay",
        body: "Bến Vàm Lũng được Bộ Văn hóa, Thể thao và Du lịch xếp hạng Di tích Lịch sử Quốc gia năm 2010. Tượng đài kỷ niệm Đường Hồ Chí Minh trên biển và bia ghi dấu tích con tàu không số sừng sững bên cửa biển lộng gió, ghi nhớ công lao trời biển của những người lính biển kiên cường.",
        certainty: "verified",
        uncertaintyNote: null,
        sources: [
          {
            sourceKey: "src-dsvh-ben-vam-lung",
            locator: "Quyết định xếp hạng Di tích lịch sử quốc gia năm 2010",
            scopeNote: "Xếp hạng cấp quốc gia Bến Vàm Lũng"
          }
        ]
      }
    ],
    media: [
      {
        key: "vam-lung-tuong-dai-tau-khong-so",
        fileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Vam_Lung_Ca_Mau.jpg?width=1600",
        sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ben_Vam_Lung_Ca_Mau.jpg",
        era: "today",
        yearTaken: 2019,
        photographer: "Wikimedia Commons Contributor",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        usageBasis: "open_license",
        caption: "Tượng đài kỷ niệm Bến Vàm Lũng – điểm cập bến lịch sử của những chuyến Tàu Không số tại Cà Mau.",
        altText: "Bia đá di tích hình con thuyền xé sóng đứng uy nghiêm bên cửa sông rừng đước ngập mặn",
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
  if (batchDUpdates[site.key]) {
    Object.assign(site, batchDUpdates[site.key]);
    updatedCount++;
  }
}

fs.writeFileSync(sitesPath, JSON.stringify(sitesData, null, 2) + "\n", "utf-8");
console.log(`Updated ${updatedCount} sites for Batch D in sites.json.`);
