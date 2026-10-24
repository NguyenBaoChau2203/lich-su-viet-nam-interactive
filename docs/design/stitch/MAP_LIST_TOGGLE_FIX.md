# Stitch refinement — map/list toggle correction

```text
Edit only the selected P05 Places screen. Preserve every current visual and interaction except the map/list view toggle.

The current “Xem dạng danh sách đầy đủ (Text-only)” control only scrolls to a table, so it is not a real toggle. Correct it:

- Default state: show the synchronized map + story list split view; hide the full text-only table from visual layout but keep the toggle available.
- When activated: hide the split-view map region, show the full text-only list in its place, update the control text to “Quay lại bản đồ”, set `aria-expanded=true`, and move keyboard focus to the text-list heading.
- When activated again: restore the synchronized map + story list, hide the full text-only view, set `aria-expanded=false`, update the label, move focus back to the map explorer heading, and preserve the selected year range and location.
- Do not use smooth scrolling as a substitute for switching views.
- Keep all other verified range, marker, keyboard, zoom and reset interactions unchanged.
```
