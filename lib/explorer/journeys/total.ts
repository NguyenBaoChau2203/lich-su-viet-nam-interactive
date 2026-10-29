import type { HistoryJourney, JourneyStop } from "@/lib/explorer/journey";

export const TOTAL_JOURNEY_ID = "hanh-trinh-tong-hop";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOTAL_NOTE = "Tổng hợp các mốc từ những hành trình hiện có theo thứ tự thời gian. Đường nối là sơ đồ, không phải tuyến di chuyển thực tế.";

function chronology(sortDate: string): readonly [number, number, number] {
  const [year, month, day] = sortDate.split("-");
  return [Number(year), month === undefined ? 0 : Number(month), day === undefined ? 0 : Number(day)];
}

/** Derived reading order. Missing month/day sort before a more precise date in the same year; displayed text is unchanged. */
export function createTotalJourney(baseJourneys: readonly HistoryJourney[]): HistoryJourney {
  const indexed = baseJourneys.flatMap((journey, journeyIndex) => journey.stops.map((stop, stopIndex) => ({
    journey, stop, journeyIndex, stopIndex,
  })));
  if (!indexed.length) throw new Error("A total journey needs at least one source milestone");
  indexed.sort((a, b) => {
    const [ay, am, ad] = chronology(a.stop.sortDate);
    const [by, bm, bd] = chronology(b.stop.sortDate);
    return ay - by || am - bm || ad - bd || a.journeyIndex - b.journeyIndex || a.stopIndex - b.stopIndex;
  });
  const seen = new Set<string>();
  const stops: JourneyStop[] = indexed.map(({ journey, stop }) => {
    const id = `${journey.id}-${stop.id}`;
    if (!SLUG.test(id) || seen.has(id)) throw new Error(`Invalid or duplicate derived journey stop: ${id}`);
    seen.add(id);
    const copy = structuredClone(stop);
    return { ...copy, id, origin: { journeyId: journey.id, stopId: stop.id } };
  });
  const lessonSlugs: string[] = [];
  const lessons = new Set<string>();
  for (const journey of baseJourneys) {
    for (const slug of journey.lessonSlugs) {
      if (lessons.has(slug)) continue;
      lessons.add(slug);
      lessonSlugs.push(slug);
    }
  }
  return {
    id: TOTAL_JOURNEY_ID,
    title: "Hành trình tổng hợp",
    period: `${stops[0].date} — ${stops[stops.length - 1].date}`,
    note: TOTAL_NOTE,
    lessonSlugs,
    stops,
  };
}
