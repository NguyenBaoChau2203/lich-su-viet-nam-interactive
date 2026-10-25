import type { CameraView, ExplorerLimits, ExplorerState } from "@/lib/explorer/types";
import { formatMapView, parseMapView } from "@/lib/explorer/map-view";
import { parseJourneySelection } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY, type JourneyRegistry } from "@/lib/explorer/journeys/registry";

export const CAMERA_BOUNDS = {
  minPolar: 0.25,
  maxPolar: 1.35,
  minDistance: 25,
  maxDistance: 250,
  maxTargetMagnitude: 70,
  maxParamLength: 80,
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INTEGER_PATTERN = /^-?\d+$/;
const NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;
const ALLOWED_EXPLORER_KEYS = new Set(["tu", "den", "su-kien", "goc", "ban-do", "hanh-trinh", "moc"]);

function round3(value: number): number {
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function parseStrictInt(raw: string | null): number | null {
  if (!raw || !INTEGER_PATTERN.test(raw)) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function parseCameraParam(raw: string | null): CameraView | null {
  if (!raw || raw.length > CAMERA_BOUNDS.maxParamLength) return null;
  const parts = raw.split(",");
  if (parts.length !== 5) return null;

  const nums: number[] = [];
  for (const part of parts) {
    if (!NUMBER_PATTERN.test(part)) return null;
    const val = Number(part);
    if (!Number.isFinite(val)) return null;
    nums.push(val);
  }

  const [azimuth, polar, distance, targetX, targetZ] = nums;
  if (polar < CAMERA_BOUNDS.minPolar || polar > CAMERA_BOUNDS.maxPolar) return null;
  if (distance < CAMERA_BOUNDS.minDistance || distance > CAMERA_BOUNDS.maxDistance) return null;
  if (Math.abs(targetX) > CAMERA_BOUNDS.maxTargetMagnitude) return null;
  if (Math.abs(targetZ) > CAMERA_BOUNDS.maxTargetMagnitude) return null;
  if (Math.abs(azimuth) > Math.PI * 4) return null;

  return {
    azimuth: round3(azimuth),
    polar: round3(polar),
    distance: round3(distance),
    targetX: round3(targetX),
    targetZ: round3(targetZ),
  };
}

export function formatCameraParam(view: CameraView): string {
  return [
    round3(view.azimuth),
    round3(view.polar),
    round3(view.distance),
    round3(view.targetX),
    round3(view.targetZ),
  ].join(",");
}

export function parseExplorerState(params: URLSearchParams, limits: ExplorerLimits): ExplorerState {
  const rawFrom = parseStrictInt(params.get("tu"));
  const rawTo = parseStrictInt(params.get("den"));

  let from = limits.minYear;
  let to = limits.maxYear;

  if (
    rawFrom !== null &&
    rawTo !== null &&
    rawFrom >= limits.minYear &&
    rawFrom <= limits.maxYear &&
    rawTo >= limits.minYear &&
    rawTo <= limits.maxYear &&
    rawFrom <= rawTo
  ) {
    from = rawFrom;
    to = rawTo;
  }

  const rawEvent = params.get("su-kien");
  const knownSlugs = new Set(limits.eventSlugs);
  const selectedEvent =
    rawEvent && SLUG_PATTERN.test(rawEvent) && knownSlugs.has(rawEvent) ? rawEvent : null;

  const view = parseCameraParam(params.get("goc"));

  return {
    from,
    to,
    selectedEvent,
    view,
  };
}

export function buildExplorerUrl(state: ExplorerState): string {
  const parts: string[] = [
    `tu=${encodeURIComponent(String(Math.trunc(state.from)))}`,
    `den=${encodeURIComponent(String(Math.trunc(state.to)))}`,
  ];

  if (state.selectedEvent && SLUG_PATTERN.test(state.selectedEvent)) {
    parts.push(`su-kien=${encodeURIComponent(state.selectedEvent)}`);
  }

  if (state.view) {
    parts.push(`goc=${formatCameraParam(state.view)}`);
  }

  return `/?${parts.join("&")}`;
}

export function buildEventDetailHref(slug: string, state: ExplorerState): string {
  const safeSlug = SLUG_PATTERN.test(slug) ? slug : encodeURIComponent(slug);
  const explorerUrl = buildExplorerUrl(state);
  return `/su-kien/${safeSlug}?kham-pha=${encodeURIComponent(explorerUrl)}`;
}

export function getExplorerReturnHref(value: unknown, fallbackSlug: string, registry: JourneyRegistry = JOURNEY_REGISTRY): string {
  const safeFallback = SLUG_PATTERN.test(fallbackSlug)
    ? `/?su-kien=${fallbackSlug}`
    : "/";

  if (typeof value !== "string" || value.length === 0 || value.length > 240) {
    return safeFallback;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return safeFallback;
  }

  let parsed: URL;
  try {
    parsed = new URL(value, "http://explorer.local");
  } catch {
    return safeFallback;
  }

  if (parsed.origin !== "http://explorer.local" || parsed.pathname !== "/" || parsed.hash !== "") {
    return safeFallback;
  }

  for (const key of parsed.searchParams.keys()) {
    if (!ALLOWED_EXPLORER_KEYS.has(key)) {
      return safeFallback;
    }
  }

  const rebuilt: string[] = [];
  const rawFrom = parsed.searchParams.get("tu");
  const rawTo = parsed.searchParams.get("den");
  if (rawFrom !== null || rawTo !== null) {
    const fromInt = parseStrictInt(rawFrom);
    const toInt = parseStrictInt(rawTo);
    if (fromInt === null || toInt === null || fromInt > toInt) {
      return safeFallback;
    }
    rebuilt.push(`tu=${fromInt}`, `den=${toInt}`);
  }

  const rawEvent = parsed.searchParams.get("su-kien");
  if (rawEvent !== null) {
    if (!SLUG_PATTERN.test(rawEvent)) return safeFallback;
    rebuilt.push(`su-kien=${rawEvent}`);
  }

  const rawGoc = parsed.searchParams.get("goc");
  if (rawGoc !== null) {
    const view = parseCameraParam(rawGoc);
    if (!view) return safeFallback;
    rebuilt.push(`goc=${formatCameraParam(view)}`);
  }

  const rawMap = parsed.searchParams.get("ban-do");
  if (rawMap !== null) {
    const view = parseMapView(rawMap);
    if (!view) return safeFallback;
    rebuilt.push(`ban-do=${formatMapView(view)}`);
  }

  const journeyId = parsed.searchParams.get("hanh-trinh");
  const stopId = parsed.searchParams.get("moc");
  if (journeyId !== null || stopId !== null) {
    const journey = parseJourneySelection(journeyId, stopId, registry);
    if (!journey) return safeFallback;
    rebuilt.push(`hanh-trinh=${journey.id}`, `moc=${journey.stop}`);
  }
  return rebuilt.length > 0 ? `/?${rebuilt.join("&")}` : safeFallback;
}
