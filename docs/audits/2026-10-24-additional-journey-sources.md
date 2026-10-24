# Task 07 — Additional historical milestone source ledger

Reviewed 2026-10-24 (Asia/Bangkok). Scope: three editorial grade-12 sequences, 13 stops. This is direct passage review and agent self-review, not independent human historical sign-off. No database event, location or publication state is created/changed.

## Acceptance and interpretation

- `verified` below means the bounded date/place/claim is supported by the readable source passages identified here. It does not certify every statement elsewhere on that page.
- Every map anchor remains `approximate`. Precision is separately stated as a venue area, city orientation point or representative campaign area. Decimal digits retain source values; they do not imply survey accuracy.
- Selection, summaries, camera framing and schematic connections are `editorial`. Lines are neither military routes nor one person's itinerary. Dates label individual milestones; a campaign's opening day is not its entire duration.
- All 13 required bounded claims/anchors are accepted at the stated precision. Excluded claims and remaining textbook verification are listed below; no `needs_evidence` candidate enters production.
- The existing Hồ Chí Minh module, claims, coordinates, links and empty lesson mapping remain unchanged. Its regression hash remains the Task 03 contract.

## Curriculum: supported mapping and exact edition gap

Local sources are `lib/sgk/curriculum.ts`, `supabase/seed.sql` (source entry identifying NXBGDVN, Kết nối tri thức, 2024) and `docs/du-lieu-can-kiem-chung.md`. The latter explicitly leaves the owner's printing/reprint year and textbook pages unconfirmed.

| Evidence | Institution / author; publication; accessed | Directly readable scope / limitation |
| --- | --- | --- |
| [Lịch sử 12 — Kết nối tri thức catalogue](https://heid.vn/product/sach-giao-khoa-lich-su-12-ket-noi-tri-thuc/) | HEID; lists NXBGDVN, Vũ Minh Giang and co-authors, publication year **2024**; accessed 2026-10-24 | Product metadata names the series, grade, publisher and year. Confirms that edition exists; does not prove the owner's physical printing, its contents or page numbering. |
| [Official school revision outline, History grade 12, 2025–2026](https://filethpt.hcm.edu.vn/data/doc/2025/thptphuoclong/2025_12/11/hs-de-cuong-k12-cuoi-hk1-2025-2026_1112202510.pdf) | Trường THPT Phước Long, official HCM education file host; 2025–2026 outline, URL dated 2025-12-11; accessed 2026-10-24 | Web extractor returned a readable 12-page copy: printed p.4 heading lesson 6; p.7 heading lesson 7; p.10 heading lesson 8, with Kết nối tri thức citations. Supplementary corroboration only: a later direct local HTTP download returned **404**. These are **outline pages**, not textbook pages; no current publisher lesson verification is claimed. |
| [NXBGDVN training portal](https://taphuan.nxbgd.vn/tap-huan?grade=12&tab=public) | NXBGDVN; accessed 2026-10-24 | Direct fetch timed out. Search output is a lead only. Not used as verified curriculum evidence. |
| [Publisher printing decision 529](https://nxbgd.vn/Attachments/files/PDF/529_Q%C4%90-NXBGDVN.pdf) | NXBGDVN; decision 529/QĐ-NXBGDVN dated **2024-07-19**; accessed 2026-10-24 | Browser retrieval exceeded its size limit, so the original 13,079,613-byte scanned PDF was downloaded locally and rendered with Poppler. PDF p.1 identifies date/issuer; PDF p.8, Gói 09 Phần 03, row 10 names **Lịch sử 12 (Kết nối tri thức với cuộc sống)**, product code G1HHZS003H24, 112 pages. Confirms the publisher's 2024–2025 product/series, not the owner's specific printing or any lesson/page content. Local evidence is under `.task-reports/task-07-work/publisher-pages/`. |

Accepted **topic-level navigation mapping** from the local curriculum. The readable school-outline copy corroborates its labels, with the live-origin availability limitation above:

| Journey | Local lesson navigation | Supported topic |
| --- | --- | --- |
| `mua-thu-doc-lap-1945` | `6-cach-mang-thang-tam-nam-1945` | Cách mạng tháng Tám năm 1945; declaration as its concluding milestone |
| `khang-chien-chong-phap-1946-1954` | `7-khang-chien-chong-phap` | Kháng chiến chống thực dân Pháp (1945–1954); selected milestones begin in 1946, not an assertion that the war began then |
| `mua-xuan-1975` | `8-khang-chien-chong-my-cuu-nuoc` | Kháng chiến chống Mỹ, cứu nước (1954–1975); selected spring-1975 milestones |

**Exact blocker remaining:** no readable publisher contents/imprint for the owner's actual printing has been compared. These `lessonSlugs` link to the existing project's topic grouping; they do not claim a publisher-verified transcription, page alignment, ISBN or reprint year. The original curriculum comments remain. Historical summaries use independent historical evidence below, not unexamined textbook paragraphs.

The locally downloaded publisher decision has SHA-256 `4e25385e76e3d80956defb60947ef8fb8396285de1f8f99432b654ca4cc9180e`. Its selected rendered pages were visually inspected. The school outline's readable extraction remains supplementary evidence with an unavailable live origin, not a substitute for the missing publisher contents page.

## Historical source catalogue

All accepted sources below were opened and their cited passages read on **2026-10-24**. Publication dates are distinguished from access dates. No textbook text or long quotation is reproduced.

| ID | Title and direct URL | Institution / author; publication | Accepted passage locator and scope |
| --- | --- | --- | --- |
| H45 | [Tổng khởi nghĩa Cách mạng tháng Tám năm 1945](https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html) | Bảo tàng Lịch sử Quốc gia; Nguyễn Thị Ngọc Anh, Phòng GDCC; 2015-08-18 | Three sections headed by Hà Nội 19/8, Huế 23/8, Sài Gòn 25/8; Hanoi rally paragraph names Nhà hát Lớn. Conclusion names Ba Đình, declaration and 2/9/1945. No crowd totals or source typographical errors are adopted. No coordinates supplied. |
| H46 | [19-12-1946: Ngày toàn quốc kháng chiến](https://baotanglichsu.vn/vi/Articles/2002/68312/19-12-1946-ngay-toan-quoc-khang-chien.html) | Bảo tàng Lịch sử Quốc gia; Phương Anh (tổng hợp); 2016-12-16 | Paragraph beginning with compliance with the combat order and the 20:00 signal on 19/12/1946 identifies Hanoi's opening fighting. Use only date/opening fighting; do not infer the location of drafting/broadcasting the appeal. |
| H47 | [Lịch sử Biên niên Đảng Cộng sản Việt Nam — Tập 3](https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-3-176?categoryId=102000083) | Tư liệu Văn kiện Đảng, Cổng TTĐT ĐCSVN; catalogue names NXB Chính trị Quốc gia – Sự thật, **2009**; online posting date not established | 1947 entries, heading from 7/10 to 22/12 and the 9/10 / 15/10 entries: French offensive began 7/10/1947, airborne attack at Bắc Kạn, subsequent defensive/counteroffensive action. Stop uses the **opening day**, not a disputed end-date or a specific landing field. |
| H50 | [Di tích Núi Báo Đông … Chiến dịch Biên giới 1950](https://baotanghochiminh.vn/di-tich-nui-bao-dong-noi-chu-tich-ho-chi-minh-quan-sat-tran-danh-don-dong-khe-chien-dich-bien-gioi-1950.htm) | Bảo tàng Hồ Chí Minh; 2023-09-16 | Paragraph naming 16/9/1950 and Đông Khê as the opening battle; following paragraphs discuss French withdrawal from Cao Bằng and 16/9–14/10 campaign. Does not establish a coordinate for Đông Khê or Núi Báo Đông. |
| H54 | [Trận quyết chiến chiến lược … Đợt III: Đòn quyết định](https://baotanglichsu.vn/vi/Articles/2002/67999/tran-quyet-chien-chien-luoc-tieu-diet-tap-djoan-cu-djiem-djien-bien-phu-13-3-7-5-1954-djot-iii-djon-quyet-djinh.html) | Bảo tàng Lịch sử Quốc gia; Huệ – Chính (tổng hợp); 2013-05-03 | Final-attack narrative and concluding paragraph cover victory on 7/5/1954. Use day/result only; do not adopt the article's inconsistent day-count or broad claim that all fighting ended that day. |
| G54 | [The Final Declaration on Indochina, FRUS 1952–1954, XVI, document 1038](https://history.state.gov/historicaldocuments/frus1952-54v16/d1038) | U.S. Department of State, Office of the Historian; document dated **1954-07-21**, IC/43 Rev.2 | Heading: Geneva, 21 July 1954; paragraphs 1–2 take note of cessation-of-hostilities agreements; paragraphs 7/12 address unity and sovereignty. The stop is the **Final Declaration**, not an assertion that every agreement was signed on 21 July or by every delegation. |
| B75 | [Chiến thắng Buôn Ma Thuột ngày 10.3.1975…](https://dbnd.daklak.gov.vn/chien-thang-buon-ma-thuot-ngay-1031975-mo-man-thang-loi-cho-chien-dich-tay-nguyen-tao-buoc-ngoat-lich-su-quan-trong-cho-dai-thang-mua-xuan-nam-1975-1274.html) | Đoàn ĐBQH và HĐND tỉnh Đắk Lắk; Trương Đức Nghị; 2023-03-08 | Opening paragraph starts attack on 10/3; paragraph starting “Trong ngày 10/3/1975” explains incomplete capture; next paragraph places control of targets on **11/3**. Separates town battle, later counterattacks and wider campaign. No hour-level claim used. |
| B75b | [Nhớ về chiến dịch mang tính bước ngoặt của mùa Xuân 1975](https://baochinhphu.vn/nho-ve-chien-dich-mang-tinh-buoc-ngoat-cua-mua-xuan-1975-102270035.htm) | Báo Điện tử Chính phủ; Hà Minh Hồng; 2020-03-24 | Sequence explicitly separates 4–9/3 preparation, **10–11/3** battle and later counterattacks. Independent corroboration of attack/capture distinction; not a coordinate source. |
| H75 | [Nghệ thuật vận dụng thời cơ trong Chiến dịch Trị Thiên](https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm) | Báo Điện tử Chính phủ; attributed to QĐND / Cổng TTĐT Bộ Quốc phòng; 2015-03-16 | Final second-phase paragraph states Huế and Thừa Thiên liberated by **26/3/1975**. The date is a concluding city milestone, not the opening date of the larger campaign. |
| E75 | [Thông tin báo chí trưng bày “Non sông liền một dải”](https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html) | Bảo tàng Lịch sử Quốc gia; 2025-04-18; exhibition April–August 2025 | Part 3, “Tài liệu, hiện vật tiêu biểu”: Huế 26/3, Đà Nẵng 29/3, tanks entering the palace and flag there on **30/4/1975**. Independent museum corroboration of Huế; **not** used for the compressed Buôn Ma Thuột caption, which merges attack/control. No image is redistributed. |

Existing `supabase/content/su-kien/{tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi,tuyen-ngon-doc-lap,toan-quoc-khang-chien-19-12-1946,chien-dich-dien-bien-phu,hiep-dinh-geneve-ve-dong-duong,chien-dich-ho-chi-minh}.md` were read for project compatibility, not treated as independently verified primary evidence. Their extra anecdotes, statistics and interpretations are not imported.

## Coordinate provenance and publication evidence

The machine-readable companion is `docs/audits/sources/2026-10-24-additional-journey-geography.json`. It records the actual published inventory and exact selected geographic records, not synthetic fixtures. Tests enforce consistency with this dated observation; runtime publication still depends on the current server inventory.

**P — Reused public project anchors.** Read the live homepage's server payload from the task-owned app on 2026-10-24. `getExplorerEvents()` filters `historical_events.workflow_status = published` and excludes unpublished locations. Compared with `supabase/seed.sql`'s location records. Coordinate-source links use the actual public `/dia-diem/<slug>` pages; the original notes are acknowledged, not upgraded to survey validation. In particular, the old `exact` label on some records does not become an exact historical-platform/tank/individual position in these journeys.

| Record locator | WGS84 longitude, latitude | Accepted geographical precision |
| --- | --- | --- |
| P1 `nha-hat-lon-ha-noi`; seed location block | 105.8578, 21.0245 | Venue area around Nhà hát Lớn; representative of the rally and city uprising, not the whole uprising's footprint |
| P2 `quang-truong-ba-dinh`; seed location block | 105.8342, 21.0369 | Square area, not the exact 1945 wooden platform |
| P3 `hue`; public secondary location of published Mậu Thân event | 107.5909, 16.4637 | City orientation only; reused for 1945 and 1975, without importing a 1968 historical claim |
| P4 `sai-gon`; same published event, primary city location | 106.7009, 10.7769 | City orientation only; no claim that uprising occurred at the palace or Bến Nhà Rồng |
| P5 `ha-noi-khu-vuc-trung-tam`; published Đại hội VI event location | 105.8542, 21.0285 | Reuse **city orientation only** for 1946; not the 1986 venue, Vạn Phúc meeting house or a specific 1946 gun position |
| P6 `dien-bien-phu`; published campaign location | 103.023, 21.386 | Representative basin/campaign area; not A1 or de Castries' bunker |
| P7 `geneve-thuy-si`; published agreement location | 6.1432, 46.2044 | City orientation only; not a meeting room or Palais des Nations coordinate |
| P8 `dinh-doc-lap`; published campaign location | 106.6953, 10.7772 | Palace area as concluding milestone, not the whole campaign or an exact tank position |

**N — New city orientation points.** Natural Earth contributors, *1:10m Populated Places*, pinned **v5.1.2**, [readable versioned GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_populated_places_simple.geojson), accessed 2026-10-24. SHA-256 of the fetched source: `fd3fa867a320cbd5c5b6bb5bc550afeec2939fb2cef688e508007282a55ac42f`. Match `name` **and** `adm0name = Vietnam`, then retain the source Point geometry without jitter/centroid generation. Natural Earth data is public domain (terms already documented in `2026-10-23-globe-journey-sources.md`); retain attribution/provenance.

| Record locator | WGS84 longitude, latitude | Accepted geographical precision |
| --- | --- | --- |
| N1 `name = Bắc Kạn` | 105.833333, 22.133333 | City point used as representative orientation for the **wider Việt Bắc** area; source H47 connects Bắc Kạn to the opening attack. Not a landing field, headquarters or the extent of Việt Bắc |
| N2 `name = Cao Bằng` | 106.268005, 22.663998 | City point used for the **Cao Bằng–Lạng Sơn campaign area**; H50 connects Cao Bằng to the campaign. Explicitly not Đông Khê or Núi Báo Đông; camera framing stays regional |
| N3 `name = Buon Me Thuot` | 108.049983, 12.667042 | Modern city orientation for the historical town; not Sư bộ 23, an airport, Ngã Sáu or a specific assault axis |
| N4 `name = Da Nang` | 108.249971, 16.060039 | City orientation; not a headquarters, exact battle position or the entire campaign area |

The eight reused records plus four new points yield 12 distinct anchors for 13 stops because Huế is deliberately reused. All modern city/venue coordinates are orientation references, not reconstructed historical boundaries.

## Accepted stop manifest

Every claim/date cell is `verified` at **day** precision. Every geography cell is `approximate` at the named scope. Source metadata in the modules includes institution, URL, access date and passage/record locator. Summary and route copy are original Vietnamese editorial text.

| Journey / stop ID (authored order) | Date / supported claim | Claim evidence | Anchor / geographical precision | Published event link |
| --- | --- | --- | --- | --- |
| 1945 / `ha-noi-1945` | 1945-08-19: rally at Nhà hát Lớn and uprising in Hanoi | H45, Hanoi section | P1 / venue area | `tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi` |
| 1945 / `hue-1945` | 1945-08-23: people take power in Huế | H45, Huế section | P3 / city | None |
| 1945 / `sai-gon-1945` | 1945-08-25: uprising takes power in Sài Gòn | H45, Sài Gòn section | P4 / city | None |
| 1945 / `ba-dinh-1945` | 1945-09-02: declaration at Ba Đình, Hanoi | H45, conclusion | P2 / venue area; **return to Hanoi** | `tuyen-ngon-doc-lap` |
| 1946–1954 / `ha-noi-1946` | 1946-12-19: fighting opens nationwide resistance in Hanoi | H46, signal/fighting paragraph | P5 / city | None; local draft is not published |
| 1946–1954 / `viet-bac-1947` | 1947-10-07: French offensive opens at Việt Bắc including Bắc Kạn | H47, 1947 / 7 October entries | N1 / representative area | None |
| 1946–1954 / `bien-gioi-1950` | 1950-09-16: Đông Khê attack opens Biên giới campaign | H50, opening battle paragraph | N2 / representative area; **not Đông Khê** | None |
| 1946–1954 / `dien-bien-phu-1954` | 1954-05-07: victory at Điện Biên Phủ | H54, final assault/result | P6 / representative basin | `chien-dich-dien-bien-phu` |
| 1946–1954 / `geneve-1954` | 1954-07-21: Final Declaration on Indochina | G54, heading and §§1–2 | P7 / city | `hiep-dinh-geneve-ve-dong-duong` |
| 1975 / `buon-ma-thuot-1975` | 1975-03-10: attack starts; summary distinguishes control on 11/3 | B75; corroboration B75b | N3 / city | None |
| 1975 / `hue-1975` | 1975-03-26: liberation of Huế | H75; corroboration E75 | P3 / city | None |
| 1975 / `da-nang-1975` | 1975-03-29: liberation of Đà Nẵng | E75, Part 3 captions | N4 / city | None |
| 1975 / `sai-gon-1975` | 1975-04-30: troops/tanks enter Dinh Độc Lập and flag raised | E75, Part 3 captions | P8 / venue area | `chien-dich-ho-chi-minh` |

Only **five** new stop links are authored. Each was observed in the ten-event published inventory and has an existing content markdown file. The current reader still checks the server-provided published inventory before rendering a detail link. A future withdrawal must hide the link; the dated snapshot is not a publication override. Huế's 1968 event is not linked from either unrelated milestone.

## Excluded claims / research leads

- **Needs evidence — exact textbook printing/pages:** remains outside verified claims, as explained above. No textbook paragraph is copied and the curriculum is not relabeled fully verified.
- **Not adopted — Việt Bắc ending date:** official accounts use different campaign boundaries (20/22 December). The authored stop uses the directly supported opening day only; it makes no end-date claim.
- **Not adopted — Huế 25 March:** the older museum overview [Chiến dịch Huế–Đà Nẵng](https://baotanglichsu.vn/vi/Articles/3097/13899/chien-dich-hue-dja-nang-213-djen-29-3-1975.html) gives a 25 March city-control narrative. The bounded 26 March liberation milestone follows the Government account and the independent museum's 2025 exhibition; it does not assign all intermediate fighting to 26 March.
- **Not adopted — Buôn Ma Thuột full capture on 10 March:** the museum exhibition's compressed caption is insufficient for that claim. B75's detailed chronology and B75b support the attack/capture distinction. No hour-level assertion or whole-campaign completion date is imported.
- **Not adopted — Genève all parties signed on 21 July:** final-declaration date is supported directly; signatures and cessation-agreement dates are separate questions.
- **Needs evidence — exact new historical sites:** no sourced coordinate for an airborne landing, Đông Khê fort, Sư bộ 23 or an individual assault route was established. None is published or implied. Named city/regional orientation remains the accepted bounded use.
- QĐND candidate pages and the Đắk Lắk education PDF failed direct retrieval in this environment. They remain leads/corroboration candidates only; no production source relies on their snippets. The readable HĐND and Government articles resolve the required Buôn Ma Thuột claim independently.

## Verification boundary

Content/registry tests verify identities, authored dates/order, source metadata, precision disclosures, exact reuse of the reviewed anchors, public-link allowlist and URL pair round trips. They do not fetch the internet or certify historical truth. Browser smoke checks verify real current public inventory, shared-link/reload paused semantics and the return to Hanoi. Fresh command results and the local Task 07 report are recorded in the progress audit at handoff.
