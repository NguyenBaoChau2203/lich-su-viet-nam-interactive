import fs from "node:fs";
import path from "node:path";

const pkgDir = path.resolve("supabase/content/local-heroes/national-v1");
const docsDir = path.resolve("docs/content/local-heroes");

const manifest = JSON.parse(fs.readFileSync(path.join(pkgDir, "manifest.json"), "utf8"));
const people = JSON.parse(fs.readFileSync(path.join(pkgDir, "people.json"), "utf8")).records;
const roster = JSON.parse(fs.readFileSync(path.join(pkgDir, "roster.json"), "utf8")).records;
const coverage = JSON.parse(fs.readFileSync(path.join(pkgDir, "coverage.json"), "utf8")).records;
const media = JSON.parse(fs.readFileSync(path.join(pkgDir, "media.json"), "utf8")).records;
const claims = JSON.parse(fs.readFileSync(path.join(pkgDir, "claims.json"), "utf8")).records;

const peopleMap = new Map(people.map(p => [p.personKey, p]));

// 1. UPDATE coverage.md
const localityNameMap = {
  "01": "Thành phố Hà Nội",
  "04": "Tỉnh Cao Bằng",
  "08": "Tỉnh Tuyên Quang",
  "11": "Tỉnh Điện Biên",
  "12": "Tỉnh Lai Châu",
  "14": "Tỉnh Sơn La",
  "15": "Tỉnh Lào Cai",
  "19": "Tỉnh Thái Nguyên",
  "20": "Tỉnh Lạng Sơn",
  "22": "Tỉnh Quảng Ninh",
  "24": "Tỉnh Bắc Ninh",
  "25": "Tỉnh Phú Thọ",
  "31": "Thành phố Hải Phòng",
  "33": "Tỉnh Hưng Yên",
  "37": "Tỉnh Ninh Bình",
  "38": "Tỉnh Thanh Hóa",
  "40": "Tỉnh Nghệ An",
  "42": "Tỉnh Hà Tĩnh",
  "44": "Tỉnh Quảng Trị",
  "46": "Thành phố Huế",
  "48": "Thành phố Đà Nẵng",
  "51": "Tỉnh Quảng Ngãi",
  "52": "Tỉnh Gia Lai",
  "56": "Tỉnh Khánh Hòa",
  "66": "Tỉnh Đắk Lắk",
  "68": "Tỉnh Lâm Đồng",
  "75": "Tỉnh Đồng Nai",
  "79": "Thành phố Hồ Chí Minh",
  "80": "Tỉnh Tây Ninh",
  "82": "Tỉnh Đồng Tháp",
  "86": "Tỉnh Vĩnh Long",
  "91": "Tỉnh An Giang",
  "92": "Thành phố Cần Thơ",
  "96": "Tỉnh Cà Mau"
};

const localityEvidenceMap = {
  "01": "`clm-research-van-tien-dung-locality-01-birthplace`",
  "04": "`clm-research-be-van-dan-locality-04-home-origin`, `clm-research-kim-dong-locality-04-activity`",
  "08": "`clm-research-ta-xuan-thu-locality-08-activity`",
  "11": "`clm-research-be-van-dan-locality-11-activity`, `clm-research-tran-can-locality-11-activity`",
  "12": "`clm-research-tran-quoc-manh-locality-12-activity`",
  "14": "`clm-research-lo-van-gia-locality-14-activity`, `clm-research-to-hieu-locality-14-activity`",
  "15": "`clm-research-hoang-truong-minh-locality-15-activity`",
  "19": "`clm-research-doi-can-locality-19-activity`",
  "20": "`clm-research-hoang-van-thu-locality-20-activity`",
  "22": "`clm-research-vu-van-hieu-locality-22-activity`",
  "24": "`clm-research-ngo-gia-tu-locality-24-birthplace`",
  "25": "`clm-research-nguyen-thai-hoc-locality-25-home-origin`",
  "31": "`clm-research-nguyen-duc-canh-locality-31-activity`",
  "33": "`clm-research-to-hieu-locality-33-birthplace`",
  "37": "`clm-research-luong-van-tuy-locality-37-activity`",
  "38": "`clm-research-to-vinh-dien-locality-38-birthplace`",
  "40": "`clm-research-nguyen-thi-minh-khai-locality-40-activity`",
  "42": "`clm-research-tran-phu-locality-42-home-origin`",
  "44": "`clm-research-le-duan-locality-44-birthplace`",
  "46": "`clm-research-nguyen-chi-dieu-locality-46-home-origin`",
  "48": "`clm-research-thai-phien-locality-48-home-origin`",
  "51": "`clm-research-pham-van-dong-locality-51-birthplace`",
  "52": "`clm-research-dinh-nup-locality-52-activity`",
  "56": "`clm-research-vo-van-ky-locality-56-activity`",
  "66": "`clm-research-y-bloc-eban-locality-66-activity`",
  "68": "`clm-research-le-thi-pha-locality-68-activity`",
  "75": "`clm-research-huynh-van-nghe-locality-75-activity`",
  "79": "`clm-research-nguyen-van-troi-locality-79-activity`",
  "80": "`clm-research-hoang-le-kha-locality-80-activity`",
  "82": "`clm-research-tran-thi-nhuong-locality-82-activity`",
  "86": "`clm-research-pham-hung-locality-86-birthplace`",
  "91": "`clm-research-ton-duc-thang-locality-91-birthplace`",
  "92": "`clm-research-chau-van-liem-locality-92-birthplace`",
  "96": "`clm-research-bong-van-dia-locality-96-activity`, `clm-research-bong-van-dia-locality-96-home-origin`"
};

const readyCount = coverage.filter(c => c.status === "ready_for_review").length;
const researchingCount = coverage.filter(c => c.status === "researching").length;

let coverageMd = `# National locality research coverage

Research checkpoint 2026-10-27; contract \`LH-1.0.0-draft.1\`, framework \`VN-34-2025\`. Manifest v${manifest.version}, SHA-256 \`${manifest.manifestHash}\` (pending owner approval). Prior manifest v14 was owner-approved on 2026-10-26; see [approval evidence](../../audits/2026-10-26-local-heroes-phase-01-approval.md). Self-review by one main agent; no historian/teacher or independent-review certification. No content was imported or published.

All **34/34** reference localities have a selected candidate with a directly checked qualifying relation. **${readyCount}/34** have a complete research record ready for owner review; **${researchingCount}/34** still block the national release. These are distinct locality sets; adding person/locality links does not increase the denominator. \`ready_for_review\` is a research status, not publication.

| Code | Reference locality | Selected people with verified qualifying relations | Complete research records | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
`;

for (const c of coverage) {
  const locName = localityNameMap[c.code] || `Locality ${c.code}`;
  const selPeople = c.acceptedPersonKeys.map(k => peopleMap.get(k)?.name || k).join("; ");
  const compPeople = c.completePersonKeys.length > 0 ? c.completePersonKeys.map(k => peopleMap.get(k)?.name || k).join("; ") : "0";
  const ev = localityEvidenceMap[c.code] || "";
  coverageMd += `| \`${c.code}\` | ${locName} | ${selPeople} | ${compPeople} | ${c.status} | ${ev} |\n`;
}

coverageMd += `
Candidate leads, including additional nominations without accepted relations, are in [roster](roster.md) and [discovery](discovery.md). They do not inflate the selected/complete sets. Historical labels and modern-mapping explanations remain in \`relations.json\`; their locators are in [claims](claims.md). The exact remaining ${35 - 10} incomplete/held selected people are assigned across Batches 2–4 in [Phase 06 queue](phase-06-queue.md).

Eight inherited relation drafts remain held. A commemoration, a broad regional command, a publisher address or an event mention alone is not used as a qualifying relation.
`;

fs.writeFileSync(path.join(docsDir, "coverage.md"), coverageMd);
console.log("Updated coverage.md");

// 2. UPDATE roster.md
const completeRosterCount = roster.filter(r => r.decision === "accepted" && r.readiness === "complete").length;
const acceptedRosterCount = roster.filter(r => r.decision === "accepted").length;
const incompleteRosterCount = acceptedRosterCount - completeRosterCount;
const heldRosterCount = roster.filter(r => r.decision === "held").length;

let rosterMd = `# Finite national research roster

Research checkpoint 2026-10-27; contract \`LH-1.0.0-draft.1\`, framework \`VN-34-2025\`. Manifest v${manifest.version}, SHA-256 \`${manifest.manifestHash}\` (pending owner approval). Prior manifest v14 was owner-approved on 2026-10-26; see [approval evidence](../../audits/2026-10-26-local-heroes-phase-01-approval.md). Self-review by one main agent; no historian/teacher or independent-review certification. No content was imported or published.

The finite pool contains **53 distinct identities**: 9 matched canonical figures, 31 new identities from discovery pass 1 and 13 new identities from discovery pass 2. **${acceptedRosterCount} are selected in the national roster** (\`accepted\`), **${completeRosterCount}/${acceptedRosterCount} complete**, **${incompleteRosterCount}/${acceptedRosterCount} incomplete**, and **${heldRosterCount} held**. \`accepted\` records selection meeting eligibility in principle. Every selected person remains in the denominator. The decision-reason text below is retained from the research package; it does not establish publication or historian certification.

The inherited 34-person list was checked again. Bế Văn Đàn was retained and mapped to Điện Biên/Cao Bằng; Trần Quốc Mạnh was added for current Lai Châu. Additional pass-2 nominations for already-selected people do not create duplicate identities or accepted relationships.

| # | Person / key | Origin | Nominated codes | Decision | Readiness | Nomination sources | Gaps / reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
`;

roster.forEach((r, idx) => {
  const p = peopleMap.get(r.personKey);
  const name = p?.name || r.personKey;
  const nomCodes = r.nominatedLocalityCodes.length > 0 ? r.nominatedLocalityCodes.join(", ") : "not assigned";
  const nomSources = r.nominationSourceIds.length > 0
    ? r.nominationSourceIds.map(sid => `[${sid}](sources.md#${sid})`).join(", ")
    : "identity snapshot only";
  const gapsReason = r.gaps.join("; ") || r.decisionReason;
  rosterMd += `| ${idx + 1} | ${name}<br>\`${r.personKey}\` | ${r.origin} | ${nomCodes} | ${r.decision} | ${r.readiness} | ${nomSources} | ${gapsReason} |\n`;
});

rosterMd += `
Existing identity matching used a SELECT-only snapshot from project \`lichsu_12\` (\`ueolfjujjybutyuyfxha\`): 9 published \`historical_figures\`, captured file timestamp 2026-10-26T08:03:31.002Z. Exact IDs/slugs are retained in [the research audit](../../audits/sources/2026-10-26-local-heroes-phase-01-research-audit.json). Source-backed alias/person ambiguity remains held, particularly Hoàng Minh Chánh; no automatic merge with a similarly named person is authorized.

Any later selection/addition/removal requires a visible manifest revision. Owner approval must cite the current manifest hash; Phase 00 policy approval does not satisfy this roster checkpoint.
`;

fs.writeFileSync(path.join(docsDir, "roster.md"), rosterMd);
console.log("Updated roster.md");

// 3. UPDATE phase-06-queue.md
let queueMd = `# Phase 06 completion queue

Research checkpoint 2026-10-27; contract \`LH-1.0.0-draft.1\`, framework \`VN-34-2025\`. Manifest v${manifest.version}, SHA-256 \`${manifest.manifestHash}\` (pending owner approval). Prior manifest v14 was owner-approved on 2026-10-26; see [approval evidence](../../audits/2026-10-26-local-heroes-phase-01-approval.md). Self-review by one main agent; no historian/teacher or independent-review certification. No content was imported or published.

**${incompleteRosterCount} selected people remain incomplete** across the national roster. The final required scope is all 35 selected people and all 34 reference localities. Ten complete internal samples do not permit a partial public release.

Execute at most ten distinct people in one Phase 06 invocation and save a new manifest/handoff after that batch. Do not execute this queue before its prerequisites and an owner-approved roster are in place. Story/image gaps remain real gates; held inherited drafts must not be bulk-promoted.

## Batch 1 Execution Summary (Completed in Manifest v15)

Batch 1 addressed 10 distinct people prioritizing previously unrepresented localities:
- **8 completed with accepted stories and context media**:
  - \`new:ta-xuan-thu\` (Locality 08 Tuyên Quang) — story (514 words), media \`media-research-ta-xuan-thu-na-nua\`
  - \`new:be-van-dan\` (Localities 04 Cao Bằng, 11 Điện Biên) — story (425 words), media \`media-research-be-van-dan-nvsk\`
  - \`new:tran-can\` (Locality 11 Điện Biên) — story (412 words), media \`media-research-tran-can-nvsk\`
  - \`new:tran-quoc-manh\` (Locality 12 Lai Châu) — story (395 words), media \`media-research-tran-quoc-manh-ban-luot\`
  - \`new:lo-van-gia\` (Locality 14 Sơn La) — story (431 words), media \`media-research-lo-van-gia-memorial\`
  - \`new:to-hieu\` (Localities 14 Sơn La, 33 Hưng Yên) — story (430 words), media \`media-research-to-hieu-memorial-ceremony\`
  - \`new:doi-can\` (Locality 19 Thái Nguyên) — story (406 words), media \`media-research-doi-can-exhibition-105\`
  - \`new:vu-van-hieu\` (Locality 22 Quảng Ninh) — story (441 words), media \`media-research-vu-van-hieu-monument\`
- **2 held with explicit gaps**:
  - \`new:hoang-truong-minh\` (Locality 15 Lào Cai) — article photos depict Vũ Văn Thụ; CDN thumbnail returns 404; lacks direct authentic portrait/context photo.
  - \`new:hoang-van-thu\` (Locality 20 Lạng Sơn) — 1928 admission claim has anachronistic chronology requiring independent corroboration; inherited image URL returns 404.

## Batch 2 Execution Summary (Completed in Manifest v16)

Batch 2 addressed 10 distinct people prioritizing unrepresented localities:
- **7 completed with accepted stories and context media**:
  - \`new:ngo-gia-tu\` (Locality 24 Bắc Ninh) — story (479 words), media \`media-research-ngo-gia-tu-btls\`
  - \`new:nguyen-duc-canh\` (Locality 31 Hải Phòng) — story (415 words), media \`media-research-nguyen-duc-canh-memorial\`
  - \`new:to-vinh-dien\` (Locality 38 Thanh Hóa) — story (438 words), media \`media-research-to-vinh-dien-btls\`
  - \`new:nguyen-thi-minh-khai\` (Locality 40 Nghệ An) — story (439 words), media \`media-research-nguyen-thi-minh-khai-btls\`
  - \`new:tran-phu\` (Locality 42 Hà Tĩnh) — story (466 words), media \`media-research-tran-phu-btls\`
  - \`figure:dff00764-7ef6-4b82-981e-9f66f080d653\` (Lê Duẩn) (Locality 44 Quảng Trị) — story (456 words), media \`media-research-le-duan-vinh-linh\`
  - \`new:nguyen-chi-dieu\` (Locality 46 Thừa Thiên Huế) — story (483 words), media \`media-research-nguyen-chi-dieu-hue\`
- **3 held with explicit factual gaps**:
  - \`new:luong-van-tuy\` (Locality 37 Ninh Bình) — Báo Ninh Bình article image returns 404; lacks direct authentic portrait/context photo.
  - \`new:nguyen-thai-hoc\` (Locality 25 Phú Thọ) — Cổng TTĐT TX Buôn Hồ source is too brief (130 words); lacks independent data for 350-word story; lacks direct portrait/context photo.
  - \`new:thai-phien\` (Locality 48 Đà Nẵng) — Cổng MTTQ Đà Nẵng only lists name in regional list; lacks detailed local biographical record and authentic portrait/context photo.

## Remaining Completion Queues

| Batch | Priority code | Person | Verified qualifying codes | Exact remaining gaps |
| --- | --- | --- | --- | --- |
| 1 (Held) | \`15\` | Hoàng Trường Minh<br>\`new:hoang-truong-minh\` | 15 | Nguồn bài viết gốc không có ảnh chụp trực tiếp nhân vật hay dấu mốc, ảnh trong bài là nhà báo Vũ Văn Thụ; link ảnh thumbnail trên CDN trả về HTTP 404. Giữ nguyên trạng thái needs_evidence chờ ảnh tư liệu bối cảnh/chân dung đủ điều kiện. |
| 1 (Held) | \`20\` | Hoàng Văn Thụ<br>\`new:hoang-van-thu\` | 20 | Nguồn có câu bất hợp niên biểu về kết nạp năm 1928 cần đối chiếu nguồn độc lập thứ hai; link ảnh kế thừa trên baochinhphu.vn trả về 404. Giữ nguyên trạng thái needs_evidence. |
| 2 (Held) | \`25\` | Nguyễn Thái Học<br>\`new:nguyen-thai-hoc\` | 25 | Cần nguồn độc lập chi tiết hơn (nguồn TX Buôn Hồ chỉ 130 từ); cần ảnh tư liệu/chân dung authentic được kiểm chứng trực tiếp. |
| 2 (Held) | \`37\` | Lương Văn Tụy<br>\`new:luong-van-tuy\` | 37 | Nguồn Báo Ninh Bình ảnh bài viết bị lỗi CDN 404; cần nguồn ảnh thay thế hoặc phục hồi ảnh tư liệu. |
| 2 (Held) | \`48\` | Thái Phiên<br>\`new:thai-phien\` | 48 | Nguồn Mặt trận Đà Nẵng chỉ liệt kê tên; cần nguồn hồ sơ nhân vật chi tiết và ảnh tư liệu kiểm chứng trực tiếp. |
| 3 | \`51\` | Phạm Văn Đồng<br>\`figure:c6eb511d-898f-4fab-8875-42ddd0700cd4\` | 51 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 3 | \`52\` | Đinh Núp<br>\`new:dinh-nup\` | 52 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 3 | \`56\` | Võ Văn Ký<br>\`new:vo-van-ky\` | 56 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 3 | \`66\` | Y Blốk Êban<br>\`new:y-bloc-eban\` | 66 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage; Cần đối chiếu ngày cụ thể trong tháng 8/1945 bằng hai nguồn gốc độc lập; không suy thành ngày giải phóng toàn tỉnh. |
| 3 | \`68\` | Lê Thị Pha<br>\`new:le-thi-pha\` | 68 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage; Ngày thành lập B83 khác nhau giữa các bài; chưa dùng ngày cụ thể. Năm sinh/mất bản kế thừa không được coi là đã xác minh. |
| 3 | \`75\` | Huỳnh Văn Nghệ<br>\`new:huynh-van-nghe\` | 75 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage; Không gán quê Tân Tịch/Bình Dương vào tỉnh Đồng Nai hiện nay. Câu chuyện cần phân biệt chỉ huy khảo sát với chỉ huy trận đánh La Ngà. |
| 3 | \`79\` | Nguyễn Văn Trỗi<br>\`figure:016a56fa-2a90-4bf4-ae8f-6975f0486282\` | 79 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 3 | \`80\` | Hoàng Lê Kha<br>\`new:hoang-le-kha\` | 80 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage; Loại bỏ tên Bùi Văn Tùng bị bản kế thừa gán nhầm; không dùng kết luận về luật 10/59 hoặc người bị máy chém cuối cùng nếu chưa có nguồn đối chiếu. |
| 3 | \`82\` | Trần Thị Nhượng<br>\`new:tran-thi-nhuong\` | 82 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage; Nguồn bảo tàng trực tiếp trả lỗi proxy; đã thay bằng bài Báo Đồng Tháp. Ngày sinh/năm sinh để trống, cần đối chiếu nếu bổ sung. |
| 3 | \`86\` | Phạm Hùng<br>\`new:pham-hung\` | 86 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 4 | \`91\` | Tôn Đức Thắng<br>\`new:ton-duc-thang\` | 91 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage; Không đưa chi tiết Biển Đen, ngày thành lập Công hội hoặc nhận định về Ba Son vào chuyện nếu chưa có đối chiếu theo từng claim. |
| 4 | \`92\` | Châu Văn Liêm<br>\`new:chau-van-liem\` | 92 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 4 | \`96\` | Bông Văn Dĩa<br>\`new:bong-van-dia\` | 96 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 4 | \`01\` | Võ Nguyên Giáp<br>\`figure:01e2955b-8989-4765-95b8-f1f4a0685168\` | 01 | Cần câu chuyện chính 350–700 từ có claim riêng và citation từng đoạn; Cần ảnh lịch sử/ảnh bối cảnh đã kiểm tra bản gốc và usage |
| 4 | \`04\` | Nông Văn Dền (Kim Đồng)<br>\`new:kim-dong\` | 04 | Đã có câu chuyện và ảnh bối cảnh chứng nhận năm 1944; hoàn thiện claim narrative độc lập nếu nâng cấp. |

The 18 held people are a separate review queue in [roster](roster.md). Selection of any of them changes the accepted denominator and requires a visible owner-reviewed revision; their names and source leads must not be silently dropped. Newly nominated localities for already-selected people likewise need their own checked relationship claims before counting them as represented.
`;

fs.writeFileSync(path.join(docsDir, "phase-06-queue.md"), queueMd);
console.log("Updated phase-06-queue.md");

// 4. UPDATE media.md
const acceptedMedia = media.filter(m => m.decision === "accepted");
const heldMedia = media.filter(m => m.decision === "held");

let mediaMd = `# Image identity, context and usage ledger

Research checkpoint 2026-10-27; contract \`LH-1.0.0-draft.1\`, framework \`VN-34-2025\`. Manifest v${manifest.version}, SHA-256 \`${manifest.manifestHash}\` (pending owner approval). Prior manifest v14 was owner-approved on 2026-10-26; see [approval evidence](../../audits/2026-10-26-local-heroes-phase-01-approval.md). Self-review by one main agent; no historian/teacher or independent-review certification. No content was imported or published.

**${acceptedMedia.length} images are accepted** after direct source-page reading, byte download, dimensions/hash measurement and visual inspection. ${heldMedia.length} inherited image drafts remain held; their URLs, captions, identity and reuse fields do not establish authenticity. All accepted images use \`coursework_reference\`; \`license\` is honestly null. The owner policy in [the existing media ledger](../../audits/2026-10-25-journey-popup-media-sources.md) and contract applies only to the coursework reference scope. No asset was uploaded or published.

`;

// Print all media records sorted by id
const sortedMedia = [...media].sort((a, b) => a.id.localeCompare(b.id));
for (const m of sortedMedia) {
  const p = peopleMap.get(m.personKey);
  const personLabel = p ? `${p.name} (\`${m.personKey}\`)` : `\`${m.personKey}\``;
  const dims = m.width && m.height && m.bytes ? `${m.width}×${m.height} / ${m.bytes}` : "not verified";
  const sha = m.sha256 ? `\`${m.sha256}\`` : "not verified";
  const creator = m.creator || "not established";
  const inst = m.institution || "not established";
  const yearTaken = m.yearTaken !== null && m.yearTaken !== undefined ? m.yearTaken : "not established";
  const evClaim = m.identityClaimId ? `\`${m.identityClaimId}\`` : "none accepted";
  const gaps = m.holdReasons && m.holdReasons.length > 0
    ? m.holdReasons.join("; ")
    : (m.decisionReason || "Đã mở trang nguồn, tải byte gốc, đo metadata và xem ảnh trực tiếp. Chấp nhận bối cảnh/tái hiện văn bản lịch sử theo tiền lệ ảnh của đồ án; giới hạn coursework, chưa xuất bản.");

  mediaMd += `## ${m.id}\n\n`;
  mediaMd += `- Person: ${personLabel}.\n`;
  mediaMd += `- Decision: ${m.decision}; depiction: ${m.depictionKind}; era: ${m.era}.\n`;
  mediaMd += `- Original page: [source](<${m.sourcePageUrl}>).\n`;
  mediaMd += `- File: [original bytes](<${m.fileUrl}>).\n`;
  mediaMd += `- Measured dimensions / bytes: ${dims}.\n`;
  mediaMd += `- SHA-256: ${sha}.\n`;
  mediaMd += `- Caption: ${m.caption}\n`;
  mediaMd += `- Creator: ${creator}; institution: ${inst}; year taken: ${yearTaken}.\n`;
  mediaMd += `- Identity/context claim: ${evClaim}.\n`;
  mediaMd += `- Usage: ${m.usageBasis}; license not established. ${m.usageNote || ""}\n`;
  mediaMd += `- Reason/gaps: ${gaps}\n\n`;
}

mediaMd += `All accepted context images are clearly labelled with "Tư liệu bối cảnh, không phải chân dung" in the caption, preventing false portrait attribution. Dimensions and hashes reflect actual downloaded files from official government, museum, or press sources. Neither original was cropped, recolored, generated or otherwise edited.
`;

fs.writeFileSync(path.join(docsDir, "media.md"), mediaMd);
console.log("Updated media.md");

// 5. UPDATE claims.md
const acceptedClaims = claims.filter(c => c.decision === "accepted");
const heldClaims = claims.filter(c => c.decision === "held");

let claimsMd = `# Claim scope and evidence ledger

Research checkpoint 2026-10-27; contract \`LH-1.0.0-draft.1\`, framework \`VN-34-2025\`. Manifest v${manifest.version}, SHA-256 \`${manifest.manifestHash}\` (pending owner approval). Prior manifest v14 was owner-approved on 2026-10-26; see [approval evidence](../../audits/2026-10-26-local-heroes-phase-01-approval.md). Self-review by one main agent; no historian/teacher or independent-review certification. No content was imported or published.

${claims.length} claims: ${acceptedClaims.length} accepted (including 1 approximate period, 2 editorial learning prompts, 8 media identity claims, and 48 story paragraph claims), ${heldClaims.length} inherited claims held. Their original unverified text is quarantined with \`inherited:\` claim keys and is absent from active person evidence. Claim text is stored once in \`claims.json\`; this ledger indexes each scope and exact source locator.

| Claim | Subject kind / owner | Key | Certainty | Decision | Sources and locators |
| --- | --- | --- | --- | --- | --- |
`;

const sortedClaims = [...claims].sort((a, b) => a.id.localeCompare(b.id));
for (const c of sortedClaims) {
  const sourcesText = (c.sourceRefs || []).map(s => `[${s.sourceId}](sources.md#${s.sourceId}) — ${s.locator}`).join("<br>");
  claimsMd += `| \`${c.id}\` | ${c.subjectKind}<br>\`${c.subjectKey}\` | \`${c.key}\` | ${c.certainty} | ${c.decision} | ${sourcesText} |\n`;
}

fs.writeFileSync(path.join(docsDir, "claims.md"), claimsMd);
console.log("Updated claims.md");
