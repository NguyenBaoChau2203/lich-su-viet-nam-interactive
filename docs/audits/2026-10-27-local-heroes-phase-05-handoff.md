# Bàn giao Phase 05 — Chi tiết nhân vật, câu chuyện lịch sử, hình ảnh minh bạch và an toàn điều hướng

Ngày 27/10/2026, Asia/Bangkok. Một agent chính; **self-review**. Nhánh `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Không stage/commit/push/PR/deploy hoặc ghi remote.

**Trạng thái cuối:** hoàn tất tích hợp chi tiết nhân vật `/nhan-vat/[slug]`, trình bày đóng góp tiêu biểu, gắn kết địa phương, câu chuyện lịch sử kèm chú thích trích dẫn nguồn, hình ảnh minh bạch kèm nhãn trung thực (`Tư liệu bối cảnh, không phải chân dung`), fallback an toàn khi ảnh hỏng, và cơ chế quay lại trang chủ khôi phục chính xác trạng thái người dùng (filters, search, pagination, map view). Cổng repo đầy đủ (`pnpm verify`), 68 bài kiểm thử Playwright cho 4 độ phân giải desktop, cùng toàn bộ suite unit/component tests đã đạt 100%.

## 1. Phạm vi thực hiện và thẩm quyền

- Thực hiện theo spec `docs/superpowers/specs/2026-10-26-local-revolutionary-heroes-design.md` và plan `docs/superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md` cho Phase 05.
- Không tạo route nhân vật cạnh tranh hay thay đổi kiến trúc địa cầu trang chủ.
- Không bịa đặt dữ liệu lịch sử, không tự ý gán danh hiệu chính thức, không suy diễn liên kết địa phương nếu không có nguồn kiểm chứng.
- Giữ nguyên toàn bộ 34 địa phương tham chiếu trong chuẩn `VN-34-2025`; không giảm phạm vi toàn quốc thành thử nghiệm cục bộ.
- Dừng đúng ranh giới Phase 05; không tự động kích hoạt Phase 06/07.

## 2. Các thành phần và thay đổi đã triển khai

| Tệp | Thay đổi cốt lõi |
| --- | --- |
| `components/local-heroes/StorySections.tsx` | Tạo mới. Trình bày danh sách câu chuyện: huy hiệu "Truyện chính", tóm tắt nổi bật, nội dung câu chuyện với bộ phân giải `[[cite:<claim-key>]]` thành liên kết chú thích `[1]` nhảy thẳng tới `#nguon-<sourceId>`. Hiển thị ghi chú độ không chắc chắn lịch sử khi có. |
| `components/content/SourceList.tsx` | Bổ sung `id={`nguon-${source.id}`}` và `scroll-mt-6` cho từng `<li>` để làm điểm neo cho các liên kết chú thích trích dẫn từ câu chuyện hoặc địa phương. |
| `lib/queries/figures.ts` | Bổ sung nạp `profile` catalog qua `getLocalHeroProfile(slug)`. Tổng hợp, gộp và deduplicate danh mục nguồn từ claims, associations, stories vào `sources`. Gắn nhãn trung thực `Tư liệu bối cảnh, không phải chân dung` cho ảnh có `depictionKind: "historical_context"`. Ngăn chặn portrait fallback không nguồn bằng cách ép `portraitUrl: null` với nhân vật thuộc catalog. Tách bạch ranh giới truy vấn công khai (chỉ nạp published) và reviewer preview (cho phép xem draft/pending). |
| `components/content/detail/FigureDetailView.tsx` | Cập nhật cấu trúc phân cấp tiêu đề chuẩn WCAG: H1 (Tên nhân vật) → H2 (Đóng góp tiêu biểu) → H2 (Gắn với địa phương) → H2 (Câu chuyện lịch sử) → H2 (Tiểu sử) → H2 (Sự kiện liên quan) → H2 (Hình ảnh) → H2 (Nguồn tham khảo). Phân biệt quan hệ địa phương đủ điều kiện phủ sóng (nơi sinh, quê quán, địa bàn) và quan hệ tưởng niệm/bổ sung; hiển thị huy hiệu địa danh ước tính/tranh luận. Tích hợp `MediaLabels`, `MediaCredit` (tác giả, bản quyền, link trang gốc). Liên kết quay về dưới chân trang phân biệt với liên kết đầu trang để đảm bảo tương tác bàn phím và không xung đột tên liên kết. |
| `app/(public)/nhan-vat/[slug]/page.tsx` | Cập nhật sinh metadata tự động sử dụng `figure.contributionSummary ?? figure.biography`. Bảo toàn liên kết trở lại danh sách nhân vật đầu trang với `getLocalHeroReturnHref`. |
| `tests/unit/local-heroes-detail.test.ts` | Tạo mới bộ 9 bài kiểm thử đơn vị: ranh giới truy vấn published/draft, kiểm duyệt viên preview, nhân vật phi catalog legacy, cấu trúc heading h1-h2-h3, phân giải chú thích trích dẫn câu chuyện, định dạng năm sinh/mất không chắc chắn, phân biệt quan hệ địa phương đủ điều kiện vs tưởng niệm, nhãn trung thực ảnh tư liệu bối cảnh, và chuẩn hóa an toàn URL trở lại. |
| `tests/e2e/figure-stories.spec.ts` | Tạo mới bộ 16 bài kiểm thử e2e (4 kịch bản × 4 độ phân giải desktop): (1) Cấu trúc heading, câu chuyện, trích dẫn neo nguồn, vai trò địa phương; (2) Ảnh hỏng vẫn giữ nguyên câu chuyện, ghi công và điều hướng; (3) URL trở lại vô hiệu hóa liên kết ngoài/admin và khôi phục chính xác bộ lọc địa phương/tìm kiếm/bản đồ; (4) Tuân thủ chuẩn tiếp cận WCAG AA (zero axe violations, focus indicator rõ ràng khi điều hướng bằng phím). |

## 3. Bằng chứng kiểm thử và chất lượng

| Lệnh kiểm thử | Kết quả | Chi tiết chứng minh |
| --- | --- | --- |
| `pnpm exec vitest run tests/unit/local-heroes-detail.test.ts tests/unit/media.test.ts tests/unit/local-heroes-state.test.ts` | **56/56 passed** (exit code 0) | Xác minh trích dẫn, boundary staff/public, media labels, và safe return builder. |
| `pnpm exec vitest run` | **100 files, 1170 passed** (exit code 0) | Toàn bộ các bài kiểm thử unit/component trong repo không phát sinh regression. |
| `node --test scripts/agent/*.test.mjs` | **26/26 passed** (exit code 0) | Agent hooks, CodeGraph index, và setup scripts đạt chuẩn. |
| `node scripts/content/check-local-heroes.mjs` | **valid: true, issues: []** (exit code 0) | Kiểm tra cấu trúc gói nghiên cứu lịch sử v14, 34 địa phương tham chiếu. |
| `pnpm lint` | **0 errors, 0 warnings** (exit code 0) | Tuân thủ toàn bộ quy tắc ESLint và TypeScript strict. |
| `pnpm typecheck` | **0 errors** (exit code 0) | Next typegen và TypeScript tsc --noEmit hoàn toàn sạch lỗi. |
| `pnpm exec playwright test --config playwright.local-heroes.config.ts` | **68/68 passed** (exit code 0) | Đầy đủ 68 bài kiểm thử e2e (17 tests × 4 độ phân giải 1280×720, 1366×768, 1440×900, 1920×1080) bao gồm kiểm thử homepage, timeline return, accessibility, và chi tiết câu chuyện. |
| `pnpm verify` | **PASSED** (exit code 0) | Cổng chất lượng toàn diện: agent check + data check + lint + typecheck + test + build. |
| `pnpm build:smoke` → `pnpm test:e2e:smoke` | **PASSED**, 8/8 smoke tests (exit code 0) | Kiểm thử smoke sản phẩm độc lập môi trường với `E2E_CHANNEL=msedge`. |
| `git diff --check` | **PASSED** (exit code 0) | Không có khoảng trắng thừa hay lỗi conflict marker. |

## 4. Ghi nhận về tính trung thực lịch sử và bản quyền hình ảnh

1. **Minh bạch hình ảnh:** Với bất kỳ ảnh nào có `depictionKind === "historical_context"` hoặc ảnh di tích/tượng đài, hệ thống tự động gắn nhãn nổi bật `Tư liệu bối cảnh, không phải chân dung` để người học không nhầm lẫn giữa hình ảnh di tích/công trình tưởng niệm với chân dung lịch sử đích thực của nhân vật.
2. **Loại trừ Portrait không nguồn:** Các nhân vật trong danh mục địa phương không được tự động gán ảnh đại diện cũ (`portraitUrl: null`), ngăn chặn tình trạng sử dụng tranh vẽ hay ảnh truyền miệng chưa qua thẩm định nguồn gốc.
3. **Độ không chắc chắn về niên đại và địa danh:**
   - Năm sinh/mất có độ chắc chắn `disputed` được diễn giải bằng chữ ("Năm sinh chưa thống nhất"), không hiển thị con số giả định.
   - Năm sinh/mất `approximate` có tiền tố "khoảng".
   - Địa danh ước tính hoặc đang tranh luận có huy hiệu cảnh báo rõ ràng.
   - Mối quan hệ địa phương là `commemoration` được dán nhãn `Quan hệ tưởng niệm / bổ sung`, phân biệt rõ ràng với quan hệ đủ điều kiện phủ sóng (nơi sinh, quê quán, địa bàn hoạt động).

## 5. Ranh giới và việc chưa làm (Các giai đoạn tiếp theo)

- **Phase 06:** Hoàn thiện gói dữ liệu nghiên cứu lịch sử và thẩm tra bản quyền/nguồn gốc hình ảnh cho toàn bộ 34 địa phương tham chiếu cấp quốc gia. Hiện tại `check-local-heroes.mjs` xác nhận `completeAcceptedPeople: 2` (Hà Nội và Cao Bằng mẫu), 33 nhân vật còn lại đang ở trạng thái `incomplete` hoặc `held` và chưa được công bố ra môi trường sản xuất.
- **Phase 07:** Nghiệm thu tổng thể trên môi trường thật có xác thực của giáo viên/chuyên gia lịch sử trước khi phát hành.
- **Không tự động triển khai hoặc ghi dữ liệu:** Toàn bộ công việc nằm trên nhánh cục bộ `feat/local-revolutionary-heroes`, không có lệnh commit, merge, push hoặc cập nhật remote DB.
