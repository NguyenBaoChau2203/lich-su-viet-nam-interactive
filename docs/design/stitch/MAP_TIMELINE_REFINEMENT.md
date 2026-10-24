# Stitch refinement — interactive map and timeline

Use this prompt to edit only screens `P04 Dòng thời gian` and `P05 Địa điểm` in the existing **Vietnam History Documentary Archive** project.

```text
Edit the selected P04 Timeline and P05 Places desktop screens. Preserve the existing Cinematic Editorial Archive typography, paper/ink/vermilion palette, square geometry, header proportions and editorial rules. The current screens are visually coherent, but their map and timeline behave like static archive pages. Redesign them as clear interactive exploration tools while keeping the documentary tone.

GLOBAL CORRECTIONS FOR BOTH SCREENS
- Remove the user/avatar icon from the public header. Public learners do not have accounts in this MVP.
- Remove every generated historical photograph, military route, tactical annotation, archive ID, source badge, event count, exact coordinate, quotation and factual paragraph that was not supplied.
- Replace unsupplied imagery with intentional charcoal or warm-gray media placeholders labelled “TƯ LIỆU SẼ BỔ SUNG”.
- Use only these sample years: 1945, 1946, 1950, 1954 and 1975.
- Use only these sample places: Hà Nội, Cao Bằng and Điện Biên Phủ.
- Use only these sample story titles: Cách mạng tháng Tám, Toàn quốc kháng chiến, Chiến dịch Biên giới, Chiến dịch Điện Biên Phủ and Đại thắng mùa Xuân 1975.
- Do not invent summaries. Use “Tóm tắt đã kiểm chứng sẽ được bổ sung”.
- Keep all Vietnamese text legible and correctly accented.

P04 TIMELINE — REDESIGN AS AN INTERACTIVE TEMPORAL EXPLORER
- Replace the current static left-side list with a functional, sticky temporal navigator.
- At the top of the exploration area, create a wide timeline scrubber spanning 1945–1975. Show ticks only for years that have stories: 1945, 1946, 1950, 1954 and 1975.
- Make 1954 the selected state. Use a clearly draggable vermilion handle, a visible focus ring, previous-year and next-year buttons, and the text “Đang xem: 1954”.
- Show two era bands behind or above the scrubber: “1945–1954” and “1954–1975”. These are filters, not decorative labels.
- Directly below, show one focused story stage for “Chiến dịch Điện Biên Phủ”: a 7-column neutral media placeholder, a 3-column title/context area, and a 2-column locator map inset with one marker at Điện Biên Phủ. Do not use a historical photograph.
- Below the focused stage, show the other events as full-width StoryRows so scrolling remains possible.
- Visually explain interaction with concise UI labels: “Kéo để đổi năm”, “← Năm trước”, “Năm sau →”. Do not add instructional paragraphs.
- The intended behavior is: dragging/clicking a year updates the focused story and locator marker; scrolling to a StoryRow updates the active year. Show these relationships through active styling and connector labels.
- Include a compact control “Chỉ hiện câu chuyện có video” and a topic filter. Use rectangular controls, not rounded pills.
- Keep the page visually spacious. Do not revert to a dense document archive or a vertical list of year labels.

P05 PLACES — REDESIGN AS A SYNCHRONIZED MAP + STORY EXPLORER
- Make the map unmistakably central: a 7-column clean vector map canvas on the left and a 5-column synchronized story/location list on the right.
- Use a simplified outline of Vietnam and three approximate markers only: Hà Nội, Cao Bằng and Điện Biên Phủ. Do not show tactical routes, troop movement, district boundaries, road labels or unrelated towns.
- Make Điện Biên Phủ selected. Its marker and matching list row share the same vermilion selected state.
- Clicking/focusing a marker must select and scroll/focus the matching list row. Clicking/focusing a list row must focus the matching marker. Communicate this visually with matching labels and focus states.
- Add map controls: zoom in, zoom out, reset view and “Bản đồ / Danh sách”. Keep every control keyboard accessible.
- Add a horizontal time-range control directly above the map, initially 1945–1975, with two draggable handles. Include the live text “Đang hiển thị câu chuyện từ 1945 đến 1975”. Filtering the year range updates both map markers and story rows.
- The selected preview shows only: year, story title, location-confidence label and “Xem câu chuyện”. Do not invent a description or story count.
- Include the persistent text alternative action “Xem dạng danh sách đầy đủ”.
- Show a small map-failure preview state at the bottom: “Bản đồ chưa tải được” plus the same usable text list. It must read as a component state, not a second full page.

INTERACTION STATES TO COMMUNICATE
- Timeline default: 1954 selected.
- Timeline focus: scrubber handle keyboard-focused.
- Map default: all three markers visible.
- Map selected: Điện Biên Phủ selected and matching row highlighted.
- Map filtered: range 1950–1954, with only matching markers/rows visible.

Do not add analytics, login, quiz, AI chat, favorites, full-screen map, card grid, gradients, glass effects, ornamental dot timelines or generated historical imagery. Keep each edited result as a separate 1440px desktop frame in the same project.
```
