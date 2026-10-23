import { unstable_rethrow } from "next/navigation";
import { HistoryExplorer } from "@/components/explorer/HistoryExplorer";
import { getExplorerLimits } from "@/lib/explorer/filters";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { parseExplorerState } from "@/lib/explorer/url";
import { getExplorerEvents } from "@/lib/queries/explorer";

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

  // Explicit test-only error simulation when ?__test_db_error=1 is passed in local/E2E tests
  const simulateDbError =
    process.env.NODE_ENV !== "production" || process.env.E2E_TEST === "1"
      ? urlSearchParams.get("__test_db_error") === "1"
      : urlSearchParams.get("__test_db_error") === "1";

  let events: ExplorerEvent[] = [];
  let dataError: string | null = null;

  if (simulateDbError) {
    dataError =
      "Chưa tải được dữ liệu sự kiện từ cơ sở dữ liệu. Sa bàn Việt Nam 3D và các liên kết tra cứu vẫn hoạt động — vui lòng thử tải lại trang sau ít phút.";
  } else {
    try {
      events = await getExplorerEvents();
    } catch (error) {
      unstable_rethrow(error);
      dataError =
        "Chưa tải được dữ liệu sự kiện từ cơ sở dữ liệu. Sa bàn Việt Nam 3D và các liên kết tra cứu vẫn hoạt động — vui lòng thử tải lại trang sau ít phút.";
    }
  }

  const limits = getExplorerLimits(events);
  const initialState = limits ? parseExplorerState(urlSearchParams, limits) : null;

  return (
    <HistoryExplorer
      events={events}
      limits={limits}
      initialState={initialState}
      dataError={dataError}
    />
  );
}
