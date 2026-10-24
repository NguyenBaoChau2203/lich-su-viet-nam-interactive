# Stitch refinement — functional interaction pass

```text
Edit the selected revised P04 Timeline and P05 Places screens. Preserve their current visual composition, typography, palette and safe placeholder content. This pass is specifically about making the exported HTML interactions real and accessible. Do not redesign the pages.

P04 TIMELINE FUNCTIONAL REQUIREMENTS
- Implement the temporal scrubber with a real visible HTML `<input type="range">`, not a decorative div-only rail.
- The range has five discrete positions mapped to 1945, 1946, 1950, 1954 and 1975. Initial value is 1954.
- Give it `aria-label="Chọn mốc thời gian"`, visible keyboard focus and normal pointer events.
- On `input` and `change`, update all of these in the page: `Đang xem: YEAR`, selected tick, focused story year/title, media placeholder label and locator marker label.
- Previous and next buttons decrement/increment the range and update the same state.
- Clicking a story row sets the range to that story and updates the focused stage.
- Arrow Left/Right works through the native range control. Do not create a fake “Kéo để đổi năm” instruction unless dragging actually works.

P05 MAP FUNCTIONAL REQUIREMENTS
- Implement start year and end year as two real visible range controls with pointer interaction enabled. Add `aria-label="Năm bắt đầu"` and `aria-label="Năm kết thúc"`.
- On `input`, update the live range sentence, the highlighted range track, visible markers and visible story/location rows.
- Enforce start year <= end year without freezing either control.
- Preset buttons 1945–1954, 1954–1975 and 1945–1975 must set both range controls and run the same update function.
- Make every map marker keyboard reachable with `tabindex="0"`, `role="button"`, an accessible label, Enter and Space handlers.
- Selecting a marker updates the selected preview and matching list row. Selecting a list row updates the marker. Keep Điện Biên Phủ selected initially.
- Zoom in, zoom out and reset buttons must apply a visible transform to the map drawing and maintain safe limits. They must have accessible labels.
- Implement the “Bản đồ / Danh sách” control as a real toggle that can switch to a full textual list and back. The list view must not depend on the SVG map.
- Keep the map schematic and do not add roads, routes, coordinates, boundaries, counts or new historical content.

TECHNICAL ACCEPTANCE
- No interactive control may use `pointer-events: none`.
- No primary interaction may rely on hover only.
- Every control has a visible focus style.
- Use semantic button/input elements where possible.
- Keep JavaScript small and local to the exported page.
- The output must remain two separate desktop frames in the same project.
```
