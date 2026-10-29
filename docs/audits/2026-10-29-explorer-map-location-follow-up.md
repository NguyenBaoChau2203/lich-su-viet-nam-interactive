# Explorer map location follow-up — 2026-10-29

Local content queue only. This file does not publish coordinates, restore removed associations, or change Supabase. A fresh anonymous homepage read at `http://127.0.0.1:3000/` on 2026-10-29 still returned **32 public events: 10 with at least one eligible coordinate (11 location records) and 22 with `locations: []`**. Those 22 slugs match `supabase/content/timeline-review-2026-10-26/approved-events.json` exactly. The 2026-10-26 review recorded that no new coordinates were added and four uncertified event/place associations were removed. That removal stays in force.

Journey coordinates below are research leads. A journey milestone that mentions a similar city, or that links a different `eventSlug`, does not establish a public location for one of these events. No canonical repair artifact was prepared, because none of the 22 rows has a directly supported event/place association in the current public response or in the authored journey `eventSlug` links.

| Event slug | Public state on 2026-10-29 | Sourced candidate / origin | Event/place association | Uncertainty | Next action |
| --- | --- | --- | --- | --- | --- |
| `phong-trao-dong-du` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | A multi-year movement is not a single pin | `needs_evidence` |
| `nguyen-ai-quoc-dai-hoi-tours-1920` | `locations: []`; summary-only | Journey stop `ho-chi-minh-1911-1941/tours-1920` has an approximate city coordinate and no `eventSlug` | Not the same record | City orientation for the journey milestone is not this event's public place | `needs_evidence` |
| `thanh-lap-dang-cong-san-viet-nam-1930` | `locations: []`; summary-only | No journey stop uses this event. The 1920 Tours stop is a different milestone | Unsupported | Do not infer a founding venue from the title or from Tours | `needs_evidence` |
| `thanh-lap-viet-minh-1941` | `locations: []`; summary-only | `ho-chi-minh-1911-1941/pac-bo-1941` links `nguyen-ai-quoc-ve-nuoc-lanh-dao-cach-mang`, which already has a public location | Different event | The return milestone and the Việt Minh founding event stay separate | `needs_evidence` |
| `hue-gianh-chinh-quyen-1945` | `locations: []`; summary-only | `mua-thu-doc-lap-1945/hue-1945` has a city-orientation coordinate and no `eventSlug` | Not established | The journey note says the coordinate is not a specific office or the abdication ceremony | `needs_evidence` |
| `sai-gon-gianh-chinh-quyen-1945` | `locations: []`; summary-only | `mua-thu-doc-lap-1945/sai-gon-1945` has a city-orientation coordinate and no `eventSlug` | Not established | Distinct from the 1911 and 1975 Sài Gòn journey anchors | `needs_evidence` |
| `chien-dich-viet-bac-1947` | `locations: []`; summary-only | `khang-chien-chong-phap-1946-1954/viet-bac-1947` has a representative-area coordinate and no `eventSlug` | Not established | The journey calls this an opening milestone, not a whole campaign map | `needs_evidence` |
| `chien-dich-bien-gioi-1950` | `locations: []`; summary-only | `khang-chien-chong-phap-1946-1954/bien-gioi-1950` has a representative-area coordinate and no `eventSlug` | Not established | Opening date only; campaign extent is not one pin | `needs_evidence` |
| `phong-trao-dong-khoi-1960` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | The approved scope names communes in Bến Tre, but this queue has no certified public place link | `needs_evidence` |
| `chien-thang-ap-bac-1963` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Battle identity is not a coordinate | `needs_evidence` |
| `chien-thang-van-tuong-1965` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Battle identity is not a coordinate | `needs_evidence` |
| `tien-cong-chien-luoc-1972` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Approved scope is an opening milestone and a main direction, not one point | `needs_evidence` |
| `chien-thang-buon-ma-thuot-1975` | `locations: []`; summary-only | `mua-xuan-1975/buon-ma-thuot-1975` has an urban-orientation coordinate and no `eventSlug` | Not established | Journey text separates 10/3 and 11/3; the coordinate is not a battlefield survey | `needs_evidence` |
| `giai-phong-hue-1975` | `locations: []`; summary-only | `mua-xuan-1975/hue-1975` has a city-orientation coordinate and no `eventSlug` | Not established | Distinct from the 1945 Huế journey stop | `needs_evidence` |
| `giai-phong-da-nang-1975` | `locations: []`; summary-only | `mua-xuan-1975/da-nang-1975` has a city-orientation coordinate and no `eventSlug` | Not established | City orientation is not a line of attack | `needs_evidence` |
| `bao-ve-chu-quyen-gac-ma-1988` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Do not invent a maritime coordinate from the name | `needs_evidence` |
| `nghi-quyet-khoan-10-1988` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | A policy decision can remain summary-only | `needs_evidence` |
| `binh-thuong-hoa-quan-he-viet-my-1995` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Diplomatic act; one pin would need its own sourced place | `needs_evidence` |
| `viet-nam-gia-nhap-asean-1995` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Membership act; one pin would need its own sourced place | `needs_evidence` |
| `dai-hoi-dang-lan-thu-viii-1996` | `locations: []`; summary-only | No journey stop uses this event. The published Đại hội VI event is a different record and already has a location | Different event | Do not copy the Đại hội VI place onto Đại hội VIII | `needs_evidence` |
| `viet-nam-gia-nhap-wto-2007` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Accession act; one pin would need its own sourced place | `needs_evidence` |
| `cptpp-co-hieu-luc-voi-viet-nam-2019` | `locations: []`; summary-only | No journey stop uses this event | Unsupported | Entry-into-force act; one pin would need its own sourced place | `needs_evidence` |

## Coverage that did not change

The 10 events that already expose eligible public coordinates are outside this queue. They include the journey-linked records `nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc`, `nguyen-ai-quoc-ve-nuoc-lanh-dao-cach-mang`, `tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi`, `tuyen-ngon-doc-lap`, `chien-dich-dien-bien-phu`, `hiep-dinh-geneve-ve-dong-duong`, `tong-tien-cong-va-noi-day-tet-mau-than-1968` (two locations), `hiep-dinh-paris-ve-viet-nam`, `chien-dich-ho-chi-minh` and `dai-hoi-dang-lan-thu-vi`.

`Hành trình tổng hợp` contains the existing 20 journey milestones from 05/06/1911 through 30/04/1975. It does not add these 22 events as milestones and does not give them map pins.

## Held publication

Applying any row above to live Supabase, publishing a location, or changing RLS needs a separate owner request and direct evidence for that specific event/place pair. Until then the explorer explains the gap and leaves the previous camera view unchanged.
