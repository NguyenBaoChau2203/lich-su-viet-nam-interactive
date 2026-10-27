import { loadHeritageCatalog } from "@/lib/heritage/load";

export async function GET(request: Request) {
  const result = await loadHeritageCatalog(request.signal);
  return Response.json(result, {
    status: result.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
