import { parseLocalHeroState } from "@/lib/local-heroes/state";
import { loadLocalHeroPage } from "@/lib/local-heroes/load";
export async function GET(request: Request) {
  const result = await loadLocalHeroPage(parseLocalHeroState(new URL(request.url).searchParams).filters, request.signal);
  return Response.json(result, { status: result.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
