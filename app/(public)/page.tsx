import { unstable_rethrow } from "next/navigation";
import { HistoryExplorer } from "@/components/explorer/HistoryExplorer";
import { getExplorerLimits } from "@/lib/explorer/filters";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { parseMapExplorerState } from "@/lib/explorer/map-state";
import { getExplorerEvents } from "@/lib/queries/explorer";
import { parseLocalHeroState } from "@/lib/local-heroes/state";
import { loadLocalHeroPage } from "@/lib/local-heroes/load";
import { loadHeritageCatalog } from "@/lib/heritage/load";
import type { LocalHeroLoadState } from "@/lib/local-heroes/types";
import type { HeritageLoadState } from "@/lib/heritage/types";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function toUrlSearchParams(record: SearchParamsRecord): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      params.set(key, value[0]);
    }
  }
  return params;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParamsRecord>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const urlSearchParams = toUrlSearchParams(resolvedParams);
  const initialPeople = parseLocalHeroState(urlSearchParams);
  // Start only the requested bounded page. Default event mode makes no people or places query.
  const localityCode = initialPeople.filters.localityCode;
  const isOverview = initialPeople.mode === "locality";
  const peopleRequest =
    initialPeople.mode === "people"
      ? loadLocalHeroPage(initialPeople.filters)
      : isOverview && localityCode
        ? loadLocalHeroPage({ localityCode, query: "", page: 1 })
        : null;
  const placesRequest =
    initialPeople.mode === "places" || (isOverview && localityCode)
      ? loadHeritageCatalog()
      : null;

  // Explicit test-only error simulation when ?__test_db_error=1 is passed in local/E2E tests
  const simulateDbError =
    process.env.NODE_ENV !== "production" || process.env.E2E_TEST === "1"
      ? urlSearchParams.get("__test_db_error") === "1"
      : urlSearchParams.get("__test_db_error") === "1";

  let events: ExplorerEvent[] = [];
  let dataError: string | null = null;

  if (simulateDbError) {
    dataError =
      "Chưa tải được dữ liệu sự kiện. Bạn vẫn có thể khám phá bản đồ; hãy tải lại trang sau ít phút.";
  } else {
    try {
      events = await getExplorerEvents();
    } catch (error) {
      unstable_rethrow(error);
      dataError =
        "Chưa tải được dữ liệu sự kiện. Bạn vẫn có thể khám phá bản đồ; hãy tải lại trang sau ít phút.";
    }
  }

  const limits = getExplorerLimits(events);
  const initialState = parseMapExplorerState(urlSearchParams, limits ?? { minYear: 1911, maxYear: 1941, eventSlugs: [] });
  const [peopleResponse, placesResponse] = await Promise.all([peopleRequest, placesRequest]);
  const initialPeopleLoad: LocalHeroLoadState = peopleResponse ? peopleResponse.ok ? { status: "ready", data: peopleResponse.data }
    : { status: "error", filters: initialPeople.filters, error: peopleResponse.error } : { status: "idle" };
  if (peopleResponse?.ok) initialPeople.filters = peopleResponse.data.filters;
  if (placesResponse?.ok && initialPeople.mode === "places" && initialPeople.place) {
    const selected = placesResponse.data.items.find((site) => site.slug === initialPeople.place);
    if (selected) initialPeople.filters = { ...initialPeople.filters, localityCode: selected.locality.code };
  }

  const initialPlacesLoad: HeritageLoadState = placesResponse
    ? placesResponse.ok
      ? { status: "ready", data: placesResponse.data }
      : { status: "error", error: placesResponse.error }
    : { status: "idle" };

  return (
    <HistoryExplorer
      events={events}
      limits={limits}
      initialState={initialState}
      dataError={dataError}
      initialPeople={initialPeople}
      initialPeopleLoad={initialPeopleLoad}
      initialPlacesLoad={initialPlacesLoad}
    />
  );
}
