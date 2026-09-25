# Kế hoạch Triển khai: Bản đồ GIS Lịch sử, Dòng thời gian & Diễn biến Chiến dịch GSAP

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay thế toàn bộ giao diện chính thành Bản đồ GIS Vector tương tác toàn cảnh Việt Nam (1945–1975) kết hợp Trục dòng thời gian, Pop-up tóm tắt khảo chứng và Trình tái hiện diễn biến tiến công chiến dịch bằng GSAP (Flagship: Điện Biên Phủ 1954).

**Architecture:** Kiến trúc Canvas bản đồ đơn nhất (Single SVG Canvas) điều phối bằng GSAP camera tweening giữa chế độ toàn quốc và chế độ sa bàn thung lũng Mường Thanh. Dữ liệu địa lý lấy trực tiếp từ `places.json` qua hàm chuyển đổi GPS; diễn biến chiến dịch 3 đợt công kích được điều phối bằng GSAP Master Timeline có đầy đủ Play/Pause, tua tự do (scrubbing) và nhảy nhanh từng đợt.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, GSAP 3, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-25-gis-map-timeline-battle-design.md`

## Global Constraints

- Tuân thủ quy tắc lịch sử của `AGENTS.md`: Không bịa đặt ngày, tọa độ, tướng lĩnh hay mối quan hệ lịch sử; mọi claim có nguồn đối chiếu.
- Sử dụng GSAP cho hoạt cảnh chiến dịch và camera tweening; không dùng Three.js hay game engine.
- Tôn trọng `prefers-reduced-motion`: Cho phép học sinh xem ngay trạng thái chiến dịch khi tắt hiệu ứng chuyển động.
- Cung cấp bảng diễn biến văn bản song hành (Accessible Narrative Alternative).
- Vượt qua cổng kiểm tra `pnpm verify` trước khi hoàn tất (lint, typecheck, tests, build).

---

### Task 1: Cài đặt GSAP & Xây dựng Hàm Tiện ích Tọa độ GIS (`geoUtils`) cùng Dữ liệu Chiến dịch

**Files:**
- Modify: `package.json`
- Create: `src/features/map/geoUtils.ts`
- Create: `src/features/battle/battleData.ts`
- Test: `tests/features/map/geoUtils.test.ts`
- Test: `tests/features/battle/battleData.test.ts`

**Interfaces:**
- Produces:
  - `geoToSvg(lat: number, lng: number): { x: number; y: number }`
  - `DIEN_BIEN_PHU_CAMPAIGN: TacticalCampaignData`
  - `GEO_BOUNDS: { minLng, maxLng, minLat, maxLat, svgWidth, svgHeight }`

- [ ] **Step 1: Cài đặt dependency `gsap` và `@types/gsap`**

Run: `pnpm add gsap`

- [ ] **Step 2: Viết test thất bại (Red Test) cho `geoUtils.test.ts` và `battleData.test.ts`**

```typescript
// tests/features/map/geoUtils.test.ts
import { describe, it, expect } from "vitest";
import { geoToSvg, GEO_BOUNDS } from "@/features/map/geoUtils";

describe("geoToSvg", () => {
  it("converts Hanoi coordinates accurately to SVG viewBox", () => {
    // Ha Noi: lat 21.0285, lng 105.8542
    const pt = geoToSvg(21.0285, 105.8542);
    expect(pt.x).toBeGreaterThan(400);
    expect(pt.x).toBeLessThan(600);
    expect(pt.y).toBeGreaterThan(150);
    expect(pt.y).toBeLessThan(300);
  });

  it("converts Dien Bien Phu coordinates accurately to SVG viewBox", () => {
    // Dien Bien Phu: lat 21.3869, lng 103.0232
    const pt = geoToSvg(21.3869, 103.0232);
    expect(pt.x).toBeLessThan(250);
    expect(pt.y).toBeLessThan(250);
  });
});
```

```typescript
// tests/features/battle/battleData.test.ts
import { describe, it, expect } from "vitest";
import { DIEN_BIEN_PHU_CAMPAIGN } from "@/features/battle/battleData";

describe("DIEN_BIEN_PHU_CAMPAIGN", () => {
  it("contains 3 distinct historical attack phases", () => {
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases).toHaveLength(3);
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[0].phaseId).toBe("dot-1");
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[1].phaseId).toBe("dot-2");
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[2].phaseId).toBe("dot-3");
  });

  it("has valid enemy strongholds and attack vectors", () => {
    expect(DIEN_BIEN_PHU_CAMPAIGN.strongholds.length).toBeGreaterThanOrEqual(6);
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[0].vectors.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Chạy test kiểm tra lỗi mong đợi**

Run: `pnpm test`
Expected: FAIL với lỗi missing module `geoUtils` và `battleData`.

- [ ] **Step 4: Hiện thực `geoUtils.ts` và `battleData.ts`**

Tạo `src/features/map/geoUtils.ts` với hàm chiếu tọa độ chuẩn xác và `src/features/battle/battleData.ts` chứa dữ liệu các cứ điểm (Him Lam, Độc Lập, Bản Kéo, A1, C1, Hầm De Castries), các mũi tiến công của Đại đoàn 312, 308, 316, 304, 351 theo 3 đợt.

- [ ] **Step 5: Chạy lại test để đảm bảo pass**

Run: `pnpm test`
Expected: PASS 100%.

- [ ] **Step 6: Commit code**

```bash
git add package.json pnpm-lock.yaml src/features/map/geoUtils.ts src/features/battle/battleData.ts tests/features/map/geoUtils.test.ts tests/features/battle/battleData.test.ts
git commit -m "feat(gis): add gsap, geo coordinate projection utils and battle dataset"
```

---

### Task 2: Xây dựng Bản đồ SVG Vector GIS Chuẩn hóa (`VietnamGisMapSvg` & `MapMarkerLayer`)

**Files:**
- Create: `src/features/map/VietnamGisMapSvg.tsx`
- Create: `src/features/map/MapMarkerLayer.tsx`
- Test: `tests/features/map/VietnamGisMapSvg.test.tsx`

**Interfaces:**
- Consumes: `geoToSvg`, `placesCatalog`, `HistoricalPlace`
- Produces:
  - `<VietnamGisMapSvg viewBox={viewBox} onMarkerClick={...} />`
  - `<MapMarkerLayer places={...} activePlaceId={...} onSelectPlace={...} />`

- [ ] **Step 1: Viết test cho `VietnamGisMapSvg.test.tsx`**

```typescript
// tests/features/map/VietnamGisMapSvg.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VietnamGisMapSvg } from "@/features/map/VietnamGisMapSvg";

describe("VietnamGisMapSvg", () => {
  it("renders SVG with accessible label and sovereignty elements (Hoàng Sa, Trường Sa)", () => {
    render(<VietnamGisMapSvg viewBox="0 0 1000 1200" onSelectPlace={vi.fn()} selectedPlaceId={null} />);
    expect(screen.getByRole("region", { name: /bản đồ/i })).toBeInTheDocument();
    expect(screen.getByText(/hoàng sa/i)).toBeInTheDocument();
    expect(screen.getByText(/trường sa/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Chạy test kiểm tra lỗi**

Run: `pnpm test tests/features/map/VietnamGisMapSvg.test.tsx`
Expected: FAIL với missing component.

- [ ] **Step 3: Hiện thực `VietnamGisMapSvg.tsx` & `MapMarkerLayer.tsx`**

Xây dựng bản đồ SVG vector địa hình Việt Nam (dải đất chữ S, đường bờ biển, biên giới đất liền, quần đảo Hoàng Sa và Trường Sa), lớp ghim địa danh với tọa độ ánh xạ từ `places.json` qua `geoToSvg`, hiệu ứng pulse vòng tròn khi được kích hoạt và hỗ trợ bàn phím (tabIndex, Enter, Space).

- [ ] **Step 4: Chạy lại test**

Run: `pnpm test tests/features/map/VietnamGisMapSvg.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit code**

```bash
git add src/features/map/VietnamGisMapSvg.tsx src/features/map/MapMarkerLayer.tsx tests/features/map/VietnamGisMapSvg.test.tsx
git commit -m "feat(map): implement standardized Vietnam GIS SVG map and interactive markers"
```

---

### Task 3: Xây dựng Thanh Dòng thời gian Toàn cảnh (`PanoramicTimelineBar`)

**Files:**
- Create: `src/features/timeline/PanoramicTimelineBar.tsx`
- Test: `tests/features/timeline/PanoramicTimelineBar.test.tsx`

**Interfaces:**
- Consumes: `eventsCatalog`, `HistoricalEvent`
- Produces:
  - `<PanoramicTimelineBar selectedYear={...} onSelectYear={...} onSelectEvent={...} activeEventId={...} />`

- [ ] **Step 1: Viết test cho `PanoramicTimelineBar.test.tsx`**

```typescript
// tests/features/timeline/PanoramicTimelineBar.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PanoramicTimelineBar } from "@/features/timeline/PanoramicTimelineBar";

describe("PanoramicTimelineBar", () => {
  it("renders 1945-1975 era segments and allows year selection", () => {
    const handleSelectYear = vi.fn();
    render(
      <PanoramicTimelineBar
        selectedYear={1954}
        onSelectYear={handleSelectYear}
        onSelectEvent={vi.fn()}
        activeEventId={null}
      />
    );
    expect(screen.getByText("1945–1954")).toBeInTheDocument();
    expect(screen.getByText("1954–1975")).toBeInTheDocument();
    
    const year1954Btn = screen.getByRole("button", { name: /1954/i });
    fireEvent.click(year1954Btn);
    expect(handleSelectYear).toHaveBeenCalledWith(1954);
  });
});
```

- [ ] **Step 2: Chạy test kiểm tra lỗi**

Run: `pnpm test tests/features/timeline/PanoramicTimelineBar.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Hiện thực `PanoramicTimelineBar.tsx`**

Thiết kế thanh timeline đáy màn hình theo phong cách thư tịch lịch sử:
- 2 phân kỳ: 1945–1954 và 1954–1975.
- Các vạch mốc năm tiêu biểu và badge các sự kiện lịch sử (1945, 1946, 1950, 1954, 1960, 1968, 1972, 1975).
- Tương tác mượt mà, hỗ trợ bàn phím mũi tên Trái / Phải để lùi / tiến mốc năm.

- [ ] **Step 4: Chạy lại test**

Run: `pnpm test tests/features/timeline/PanoramicTimelineBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit code**

```bash
git add src/features/timeline/PanoramicTimelineBar.tsx tests/features/timeline/PanoramicTimelineBar.test.tsx
git commit -m "feat(timeline): implement panoramic timeline bar for 1945-1975"
```

---

### Task 4: Xây dựng Pop-up Thẻ bài Tóm tắt Lịch sử (`EventDetailPopup`)

**Files:**
- Create: `src/features/map/EventDetailPopup.tsx`
- Test: `tests/features/map/EventDetailPopup.test.tsx`

**Interfaces:**
- Consumes: `HistoricalEvent`, `HistoricalPlace`, `sourcesCatalog`
- Produces:
  - `<EventDetailPopup event={...} place={...} onClose={...} onTriggerBattle={...} />`

- [ ] **Step 1: Viết test cho `EventDetailPopup.test.tsx`**

```typescript
// tests/features/map/EventDetailPopup.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventDetailPopup } from "@/features/map/EventDetailPopup";

describe("EventDetailPopup", () => {
  const mockEvent = {
    id: "event-chien-dich-dien-bien-phu",
    slug: "chien-dich-dien-bien-phu",
    title: "Chiến dịch Điện Biên Phủ",
    date: { sortKey: "1954-05-07", display: "13/03/1954 – 07/05/1954", precision: "range" as const },
    eraId: "1945-1954" as const,
    topicIds: ["khang-chien-chong-phap"],
    placeIds: ["place-dien-bien"],
    summary: "Đòn quyết chiến chiến lược đập tan tập đoàn cứ điểm Pháp.",
    learningPurpose: "Nắm vững 3 đợt tiến công và ý nghĩa lịch sử.",
    claimIds: [],
    mediaIds: [],
  };

  it("renders event details and triggers battle action when clicked", () => {
    const handleTriggerBattle = vi.fn();
    render(
      <EventDetailPopup
        event={mockEvent}
        place={{ id: "place-dien-bien", name: "Điện Biên Phủ" }}
        onClose={vi.fn()}
        onTriggerBattle={handleTriggerBattle}
      />
    );

    expect(screen.getByText("Chiến dịch Điện Biên Phủ")).toBeInTheDocument();
    expect(screen.getByText(/13\/03\/1954/)).toBeInTheDocument();
    
    const battleBtn = screen.getByRole("button", { name: /tái hiện diễn biến tiến công/i });
    fireEvent.click(battleBtn);
    expect(handleTriggerBattle).toHaveBeenCalledWith(mockEvent.id);
  });
});
```

- [ ] **Step 2: Chạy test kiểm tra lỗi**

Run: `pnpm test tests/features/map/EventDetailPopup.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Hiện thực `EventDetailPopup.tsx`**

Tạo popup thẻ bài lịch sử:
- Hiển thị tiêu đề sự kiện, ngày tháng, tên địa bàn, bản tóm tắt, huy hiệu khảo chứng nguồn.
- Nếu là sự kiện trận đánh (như Điện Biên Phủ), hiển thị nút CTA nổi bật: *"⚔️ Tái hiện diễn biến tiến công (GSAP)"*.
- Hỗ trợ phím `Esc` để đóng.

- [ ] **Step 4: Chạy lại test**

Run: `pnpm test tests/features/map/EventDetailPopup.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit code**

```bash
git add src/features/map/EventDetailPopup.tsx tests/features/map/EventDetailPopup.test.tsx
git commit -m "feat(map): implement historical event detail popup with battle trigger CTA"
```

---

### Task 5: Xây dựng Sa bàn Chiến thuật Điện Biên Phủ với GSAP Master Timeline

**Files:**
- Create: `src/features/battle/DienBienPhuTacticalLayer.tsx`
- Create: `src/features/battle/BattlePlaybackBar.tsx`
- Create: `src/features/battle/useBattleGsapTimeline.ts`
- Test: `tests/features/battle/BattlePlaybackBar.test.tsx`

**Interfaces:**
- Consumes: `DIEN_BIEN_PHU_CAMPAIGN`, `gsap`
- Produces:
  - `<DienBienPhuTacticalLayer campaign={...} currentPhase={...} />`
  - `<BattlePlaybackBar control={...} onClose={...} />`
  - `useBattleGsapTimeline(campaign, containerRef): BattleTimelineControl`

- [ ] **Step 1: Viết test cho `BattlePlaybackBar.test.tsx`**

```typescript
// tests/features/battle/BattlePlaybackBar.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BattlePlaybackBar } from "@/features/battle/BattlePlaybackBar";

describe("BattlePlaybackBar", () => {
  it("renders play/pause, scrub slider and 3 attack phase buttons", () => {
    const playMock = vi.fn();
    const jumpMock = vi.fn();
    const control = {
      timeline: null,
      progress: 0.3,
      isPlaying: false,
      activePhase: "dot-1" as const,
      currentDateDisplay: "15/03/1954",
      play: playMock,
      pause: vi.fn(),
      seek: vi.fn(),
      jumpToPhase: jumpMock,
    };

    render(<BattlePlaybackBar control={control} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: /phát diễn biến/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /thời gian diễn biến/i })).toBeInTheDocument();
    
    const dot2Btn = screen.getByRole("button", { name: /đợt 2/i });
    fireEvent.click(dot2Btn);
    expect(jumpMock).toHaveBeenCalledWith("dot-2");
  });
});
```

- [ ] **Step 2: Chạy test kiểm tra lỗi**

Run: `pnpm test tests/features/battle/BattlePlaybackBar.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Hiện thực `useBattleGsapTimeline.ts`, `DienBienPhuTacticalLayer.tsx`, `BattlePlaybackBar.tsx`**

- `useBattleGsapTimeline.ts`: Khởi tạo `gsap.timeline({ paused: true })`. Sử dụng tweening `strokeDashoffset` cho các vector mũi tên, `scale` và `fill` cho các cứ điểm bị tiêu diệt, sóng nổ bộc phá đồi A1 ở đợt 3. Tự động kiểm tra `prefers-reduced-motion` để hạ duration về 0 khi người dùng bật chế độ giảm chuyển động.
- `DienBienPhuTacticalLayer.tsx`: Render các cứ điểm (Him Lam, Độc Lập, Bản Kéo, A1, C1, De Castries), các mũi tên tiến công và chiến hào bao vây.
- `BattlePlaybackBar.tsx`: Render bộ điều khiển thời gian nổi ở đáy màn hình với các nút Play/Pause, scrubber, 3 mốc đợt và hộp thuyết minh quân sự thời gian thực.

- [ ] **Step 4: Chạy lại test**

Run: `pnpm test tests/features/battle/BattlePlaybackBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit code**

```bash
git add src/features/battle/DienBienPhuTacticalLayer.tsx src/features/battle/BattlePlaybackBar.tsx src/features/battle/useBattleGsapTimeline.ts tests/features/battle/BattlePlaybackBar.test.tsx
git commit -m "feat(battle): implement Dien Bien Phu tactical GSAP layer and playback controller"
```

---

### Task 6: Tích hợp Toàn diện vào Giao diện Trang chủ (`InteractiveMapStage` & `app/page.tsx`)

**Files:**
- Create: `src/features/map/InteractiveMapStage.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: All components from Tasks 2, 3, 4, 5
- Produces: The complete map-first homepage experience

- [ ] **Step 1: Viết test cho `page.test.tsx`**

Cập nhật test trang chủ để xác minh rằng khi người dùng truy cập trang chủ:
- Bản đồ GIS toàn màn hình hiển thị.
- Thanh timeline 1945–1975 sẵn sàng tương tác.
- Có nút điều khiển chuyển chế độ văn bản (accessible view).

- [ ] **Step 2: Chạy test kiểm tra lỗi**

Run: `pnpm test src/app/page.test.tsx`
Expected: FAIL do giao diện cũ khác với giao diện bản đồ mới.

- [ ] **Step 3: Hiện thực `InteractiveMapStage.tsx` và gắn vào `src/app/page.tsx`**

`InteractiveMapStage.tsx` quản lý:
- State `mapMode`: `"overview"` | `"tactical-battle"`.
- State `selectedPlaceId`, `selectedYear`, `activeEventId`.
- GSAP Camera Zoom: Gọi `gsap.to(svgRef.current, { attr: { viewBox: "..." } })` mượt mà khi chuyển đổi giữa toàn cảnh Việt Nam và Thung lũng Mường Thanh.
- Nút "Quay lại bản đồ toàn cảnh" trên thanh công cụ góc trên khi đang ở chế độ chiến trường.
- Bảng văn bản song hành (Accessible Alternative Drawer) cho người dùng cần đọc thuần text.

- [ ] **Step 4: Chạy lại test**

Run: `pnpm test src/app/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit code**

```bash
git add src/features/map/InteractiveMapStage.tsx src/app/page.tsx src/app/page.test.tsx
git commit -m "feat(home): integrate full interactive GIS map, timeline and battle player into homepage"
```

---

### Task 7: Kiểm thử Tổng thể, Khả năng Tiếp cận (A11y) & Cổng Chất lượng `pnpm verify`

**Files:**
- Run & Verify toàn bộ test suite

- [ ] **Step 1: Chạy linter**

Run: `pnpm lint`
Expected: 0 lỗi lint.

- [ ] **Step 2: Chạy kiểm tra kiểu strict**

Run: `pnpm typecheck`
Expected: 0 lỗi TypeScript.

- [ ] **Step 3: Chạy toàn bộ unit & component tests**

Run: `pnpm test`
Expected: 100% tests PASS.

- [ ] **Step 4: Chạy kiểm tra tính toàn vẹn dữ liệu lịch sử**

Run: `pnpm history:data:check`
Expected: Pass kiểm tra toàn vẹn nguồn và dữ liệu lịch sử.

- [ ] **Step 5: Chạy production build**

Run: `pnpm build`
Expected: Build thành công trang tĩnh và dynamic routes.

- [ ] **Step 6: Chạy cổng kiểm tra tổng thể `pnpm verify`**

Run: `pnpm verify`
Expected: Tất cả 6 cổng kiểm tra (agent:check, history:data:check, lint, typecheck, test, build) đều PASS màu xanh.

- [ ] **Step 7: Commit hoàn thành nghiệm thu**

```bash
git commit --allow-empty -m "chore: complete verification gate for interactive GIS map and battle timeline"
```
