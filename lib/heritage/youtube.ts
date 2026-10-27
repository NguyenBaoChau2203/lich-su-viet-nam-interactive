/**
 * Phân tích chuỗi đầu vào (URL YouTube hoặc ID) để trích xuất mã 11 ký tự.
 */
export function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.slice(1).split("/")[0].split("?")[0];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      const paths = url.pathname.split("/");
      const embedIdx = paths.findIndex((p) => p === "embed" || p === "v" || p === "shorts");
      if (embedIdx !== -1 && paths[embedIdx + 1] && /^[A-Za-z0-9_-]{11}$/.test(paths[embedIdx + 1])) {
        return paths[embedIdx + 1];
      }
    }
  } catch {
    // Không phải URL hợp lệ
  }
  return null;
}
