/**
 * Topology-preserving Douglas–Peucker for province areas.
 * A shared border arc is simplified once and reused, reversed when the neighbor winds the other way.
 * Junctions stay fixed. Islands with no shared vertex keep a closed-ring simplification.
 * Not historical borders.
 */
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const RADIUS_M = 6371008.8;
const COS_ORIGIN = Math.cos((16 * Math.PI) / 180);
const DECIMALS = 4;

const project = (lon, lat) => [
  RADIUS_M * COS_ORIGIN * (((lon - 108) * Math.PI) / 180),
  RADIUS_M * (((lat - 16) * Math.PI) / 180),
];
const unproject = (x, y) => [
  108 + ((x / (RADIUS_M * COS_ORIGIN)) * 180) / Math.PI,
  16 + ((y / RADIUS_M) * 180) / Math.PI,
];
const roundCoord = (value) => {
  const f = 10 ** DECIMALS;
  return Math.round(value * f) / f;
};

function dist2(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function perpendicularDistance2(point, start, end) {
  const [x, y] = point;
  const [x1, y1] = start;
  const [x2, y2] = end;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return dist2(point, start);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return dist2(point, [x1 + t * dx, y1 + t * dy]);
}

function douglasPeucker(points, toleranceM) {
  if (points.length <= 2) return points;
  const tol2 = toleranceM * toleranceM;
  const keep = new Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    let maxDist = 0;
    let maxIndex = -1;
    for (let i = start + 1; i < end; i++) {
      const d = perpendicularDistance2(points[i], points[start], points[end]);
      if (d > maxDist) {
        maxDist = d;
        maxIndex = i;
      }
    }
    if (maxIndex >= 0 && maxDist > tol2) {
      keep[maxIndex] = true;
      stack.push([start, maxIndex], [maxIndex, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function simplifyRing(ring, toleranceM) {
  const open =
    ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring.slice();
  if (open.length < 3) return ring.map(([lon, lat]) => [roundCoord(lon), roundCoord(lat)]);
  const projected = open.map(([lon, lat]) => project(lon, lat));
  let simplified = douglasPeucker(projected, toleranceM);
  if (simplified.length < 3) simplified = projected;
  const out = simplified.map(([x, y]) => {
    const [lon, lat] = unproject(x, y);
    return [roundCoord(lon), roundCoord(lat)];
  });
  if (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1]) out.push([...out[0]]);
  return out;
}

function countPoints(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  let total = 0;
  for (const polygon of polygons) for (const ring of polygon) total += ring.length;
  return total;
}

const KEY_SCALE = 1e7;
const coordKey = (lon, lat) => `${Math.round(lon * KEY_SCALE)},${Math.round(lat * KEY_SCALE)}`;
const polygonList = (geometry) => (geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates);

function simplifyOpen(points, toleranceM) {
  if (points.length <= 2) return points.map(([lon, lat]) => [roundCoord(lon), roundCoord(lat)]);
  const projected = points.map(([lon, lat]) => project(lon, lat));
  let simplified = douglasPeucker(projected, toleranceM);
  if (simplified.length < 2) simplified = [projected[0], projected[projected.length - 1]];
  const out = simplified.map(([x, y]) => {
    const [lon, lat] = unproject(x, y);
    return [roundCoord(lon), roundCoord(lat)];
  });
  out[0] = [roundCoord(points[0][0]), roundCoord(points[0][1])];
  const last = points[points.length - 1];
  out[out.length - 1] = [roundCoord(last[0]), roundCoord(last[1])];
  return out;
}

/** Old per-ring path, kept so tests can show it introduces crossings the shared-arc path does not. */
export function simplifyCollectionIndependent(collection, toleranceM) {
  const features = collection.features.map((feature) => {
    const polygons = polygonList(feature.geometry);
    const next = polygons.map((polygon) => polygon.map((ring) => simplifyRing(ring, toleranceM)));
    return {
      ...feature,
      geometry: next.length === 1 ? { type: "Polygon", coordinates: next[0] } : { type: "MultiPolygon", coordinates: next },
    };
  });
  return { ...collection, features };
}

export function simplifyCollection(collection, toleranceM) {
  const degree = new Map();
  const seenEdges = new Set();
  for (const feature of collection.features) {
    for (const polygon of polygonList(feature.geometry)) {
      for (const ring of polygon) {
        for (let i = 0; i < ring.length - 1; i++) {
          const a = coordKey(ring[i][0], ring[i][1]);
          const b = coordKey(ring[i + 1][0], ring[i + 1][1]);
          if (a === b) continue;
          const edge = a < b ? `${a}|${b}` : `${b}|${a}`;
          if (seenEdges.has(edge)) continue;
          seenEdges.add(edge);
          degree.set(a, (degree.get(a) ?? 0) + 1);
          degree.set(b, (degree.get(b) ?? 0) + 1);
        }
      }
    }
  }
  const isJunction = (lon, lat) => (degree.get(coordKey(lon, lat)) ?? 0) !== 2;
  const arcCache = new Map();
  const simplifiedChain = (points) => {
    const keys = points.map(([lon, lat]) => coordKey(lon, lat));
    const forward = keys.join(">");
    const backward = keys.slice().reverse().join(">");
    const flipped = backward < forward;
    const id = flipped ? backward : forward;
    let simplified = arcCache.get(id);
    if (!simplified) {
      simplified = simplifyOpen(flipped ? points.slice().reverse() : points, toleranceM);
      arcCache.set(id, simplified);
    }
    return flipped ? simplified.slice().reverse() : simplified;
  };
  const openOf = (ring) => {
    const first = ring[0];
    const last = ring[ring.length - 1];
    return first[0] === last[0] && first[1] === last[1] ? ring.slice(0, -1) : ring.slice();
  };
  const chainsOf = (ring) => {
    const open = openOf(ring);
    const junctions = [];
    for (let i = 0; i < open.length; i++) if (isJunction(open[i][0], open[i][1])) junctions.push(i);
    if (!junctions.length) return null;
    const chains = [];
    for (let j = 0; j < junctions.length; j++) {
      const start = junctions[j];
      const end = junctions[(j + 1) % junctions.length];
      const points = [open[start]];
      let i = start;
      do {
        i = (i + 1) % open.length;
        points.push(open[i]);
      } while (i !== end);
      if (points.length >= 2) chains.push(points);
    }
    return chains;
  };
  const simplifyTopologyRing = (ring) => {
    const chains = chainsOf(ring);
    if (!chains) return simplifyRing(ring, toleranceM);
    const out = [];
    for (const chain of chains) {
      for (const point of simplifiedChain(chain)) {
        const prev = out[out.length - 1];
        if (prev && prev[0] === point[0] && prev[1] === point[1]) continue;
        out.push(point);
      }
    }
    if (out.length < 4) return simplifyRing(ring, toleranceM);
    const first = out[0];
    const last = out[out.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) out.push([...first]);
    return out;
  };
  const features = collection.features.map((feature) => {
    const polygons = polygonList(feature.geometry);
    const next = polygons.map((polygon) => polygon.map((ring) => simplifyTopologyRing(ring)));
    return {
      ...feature,
      geometry: next.length === 1 ? { type: "Polygon", coordinates: next[0] } : { type: "MultiPolygon", coordinates: next },
    };
  });
  const before = collection.features.reduce((sum, f) => sum + countPoints(f.geometry), 0);
  const after = features.reduce((sum, f) => sum + countPoints(f.geometry), 0);
  const screenPx = [4, 5, 6, 8].map((zoom) => ({
    zoom,
    pixels: Number(toleranceScreenPixels(toleranceM, zoom).toFixed(3)),
  }));
  return {
    collection: {
      ...collection,
      coverageStatus: features.length === 34 ? "complete" : collection.coverageStatus,
      admittedCount: features.length,
      blockedCount: 0,
      features,
      simplification: {
        toleranceM,
        coordinateDecimals: DECIMALS,
        pointsBefore: before,
        pointsAfter: after,
        sharedArcs: arcCache.size,
        algorithm: "shared-arc-douglas-peucker",
        screenPixelsAtZoom: screenPx,
        sharedBorderNote:
          "Each shared arc is simplified once and written identically into every neighboring ring. Junctions stay fixed. Max planar error is the tolerance.",
      },
    },
    metrics: { toleranceM, pointsBefore: before, pointsAfter: after, sharedArcs: arcCache.size },
  };
}

function orient(p, q, r) {
  const value = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  if (Math.abs(value) < 1e-12) return 0;
  return value > 0 ? 1 : -1;
}

function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-18) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function buildInteriorSamples(source, output) {
  const units = [];
  for (const feature of source.features) {
    const code = feature.properties.code;
    const points = [];
    for (const polygon of polygonList(feature.geometry)) {
      const ring = polygon[0];
      const unique = ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
        ? ring.slice(0, -1)
        : ring;
      if (!unique.length) continue;
      let lon = 0;
      let lat = 0;
      for (const point of unique) {
        lon += point[0];
        lat += point[1];
      }
      const centroid = [lon / unique.length, lat / unique.length];
      const candidates = [centroid];
      const step = Math.max(1, Math.floor(unique.length / 8));
      for (let i = 0; i < unique.length; i += step) {
        for (const weight of [0.2, 0.45, 0.7]) {
          candidates.push([
            centroid[0] * (1 - weight) + unique[i][0] * weight,
            centroid[1] * (1 - weight) + unique[i][1] * weight,
          ]);
        }
      }
      for (const [x, y] of candidates) {
        if (points.length >= 2) break;
        if (ownersAt(source, x, y).join() !== code) continue;
        if (ownersAt(output, x, y).join() !== code) continue;
        if (points.some((point) => Math.hypot(point.lng - x, point.lat - y) < 1e-4)) continue;
        points.push({ lng: x, lat: y });
      }
      if (points.length >= 2) break;
    }
    units.push({ code, slug: feature.properties.officialName, points });
  }
  return units;
}

export function ownersAt(collection, lon, lat) {
  const owners = [];
  for (const feature of collection.features) {
    for (const polygon of polygonList(feature.geometry)) {
      if (!pointInRing(lon, lat, polygon[0])) continue;
      let hole = false;
      for (let index = 1; index < polygon.length; index++) if (pointInRing(lon, lat, polygon[index])) hole = true;
      if (!hole) {
        owners.push(feature.properties.code);
        break;
      }
    }
  }
  return owners;
}

function samePoint(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function onSegment(p, a, b) {
  return orient(a, b, p) === 0
    && p[0] >= Math.min(a[0], b[0]) - 1e-12 && p[0] <= Math.max(a[0], b[0]) + 1e-12
    && p[1] >= Math.min(a[1], b[1]) - 1e-12 && p[1] <= Math.max(a[1], b[1]) + 1e-12;
}

/** Proper crossings and collinear interior overlaps between different province codes. Identical shared edges are allowed. */
export function countBorderDefects(collection) {
  const segments = [];
  for (const feature of collection.features) {
    for (const polygon of polygonList(feature.geometry)) {
      for (const ring of polygon) {
        for (let i = 0; i < ring.length - 1; i++) {
          segments.push({ a: ring[i], b: ring[i + 1], code: feature.properties.code });
        }
      }
    }
  }
  const cell = 0.2;
  const grid = new Map();
  const cellsFor = (segment) => {
    const minX = Math.min(segment.a[0], segment.b[0]);
    const maxX = Math.max(segment.a[0], segment.b[0]);
    const minY = Math.min(segment.a[1], segment.b[1]);
    const maxY = Math.max(segment.a[1], segment.b[1]);
    const ids = [];
    for (let x = Math.floor(minX / cell); x <= Math.floor(maxX / cell); x++) {
      for (let y = Math.floor(minY / cell); y <= Math.floor(maxY / cell); y++) ids.push(`${x},${y}`);
    }
    return ids;
  };
  for (let index = 0; index < segments.length; index++) {
    for (const id of cellsFor(segments[index])) {
      const bucket = grid.get(id);
      if (bucket) bucket.push(index);
      else grid.set(id, [index]);
    }
  }
  const seen = new Set();
  let crossings = 0;
  let overlaps = 0;
  const crossingPairs = new Set();
  for (const bucket of grid.values()) {
    for (let i = 0; i < bucket.length; i++) {
      for (let j = i + 1; j < bucket.length; j++) {
        const left = bucket[i];
        const right = bucket[j];
        const pair = left < right ? `${left}:${right}` : `${right}:${left}`;
        if (seen.has(pair)) continue;
        seen.add(pair);
        const s = segments[left];
        const t = segments[right];
        if (s.code === t.code) continue;
        const sameEdge = (samePoint(s.a, t.a) && samePoint(s.b, t.b)) || (samePoint(s.a, t.b) && samePoint(s.b, t.a));
        if (sameEdge) continue;
        const o1 = orient(s.a, s.b, t.a);
        const o2 = orient(s.a, s.b, t.b);
        const o3 = orient(t.a, t.b, s.a);
        const o4 = orient(t.a, t.b, s.b);
        if (o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0 && o1 !== o2 && o3 !== o4) {
          crossings += 1;
          crossingPairs.add([s.code, t.code].sort().join("-"));
          continue;
        }
        if (o1 !== 0 || o2 !== 0) continue;
        const interior = [t.a, t.b].some((point) => !samePoint(point, s.a) && !samePoint(point, s.b) && onSegment(point, s.a, s.b))
          || [s.a, s.b].some((point) => !samePoint(point, t.a) && !samePoint(point, t.b) && onSegment(point, t.a, t.b));
        if (interior) overlaps += 1;
      }
    }
  }
  return { crossings, overlaps, segments: segments.length, pairs: crossingPairs.size };
}

/** Meters of border error as CSS pixels at the legacy zoom scale (512 px tiles). */
export function toleranceScreenPixels(toleranceM, zoom) {
  const pixelsPerDegree = (512 * 2 ** zoom) / 360;
  return (toleranceM / 111_320) * pixelsPerDegree;
}

function parseArgs(argv) {
  const values = { "--tolerance-m": "200" };
  for (let i = 0; i < argv.length; i += 2) {
    if (!["--input", "--out", "--tolerance-m"].includes(argv[i]) || argv[i + 1] == null) {
      throw new Error("Usage: --input areas.geojson --out out.geojson [--tolerance-m 200]");
    }
    values[argv[i]] = argv[i + 1];
  }
  if (!values["--input"] || !values["--out"]) throw new Error("--input and --out are required");
  return values;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = resolve(args["--input"]);
  const outPath = resolve(args["--out"]);
  const toleranceM = Number(args["--tolerance-m"]);
  const input = JSON.parse(readFileSync(inputPath, "utf8"));
  const attempts = [];
  let chosen = null;
  for (const trial of [toleranceM, 400, 800, 1600]) {
    const { collection, metrics } = simplifyCollection(input, trial);
    const defects = countBorderDefects(collection);
    const body = Buffer.from(`${JSON.stringify(collection)}\n`, "utf8");
    const gzip = gzipSync(body, { level: 9 });
    const row = {
      ...metrics,
      rawBytes: body.length,
      gzipBytes: gzip.length,
      featureCount: collection.features.length,
      crossings: defects.crossings,
      overlaps: defects.overlaps,
      topologyOk: defects.crossings === 0 && defects.overlaps === 0 && collection.features.length === input.features.length,
    };
    attempts.push(row);
    if (!row.topologyOk) continue;
    if (gzip.length <= 400 * 1024) {
      chosen = { collection, body, gzip, row, defects };
      break;
    }
    if (!chosen || gzip.length < chosen.gzip.length) chosen = { collection, body, gzip, row, defects };
  }
  if (!chosen) {
    console.error(JSON.stringify({ ok: false, reason: "no topology-valid simplification", attempts }, null, 2));
    process.exitCode = 2;
    process.exit();
  }
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, chosen.body);
  const samples = buildInteriorSamples(input, chosen.collection);
  const samplePath = resolve("docs/audits/sources/2026-10-29-province-area-interior-samples.json");
  mkdirSync(dirname(samplePath), { recursive: true });
  writeFileSync(samplePath, `${JSON.stringify({
    schemaVersion: 1,
    toleranceM: chosen.row.toleranceM,
    units: samples,
    shortUnits: samples.filter((unit) => unit.points.length < 2).map((unit) => unit.code),
  }, null, 2)}\n`);
  writeFileSync(
    outPath.replace(/\.geojson$/i, ".provenance.json"),
    `${JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        inputPath: inputPath.replaceAll("\\", "/"),
        inputSha256: createHash("sha256").update(readFileSync(inputPath)).digest("hex"),
        outputSha256: createHash("sha256").update(chosen.body).digest("hex"),
        gzipSha256: createHash("sha256").update(chosen.gzip).digest("hex"),
        gzipBytes: chosen.gzip.length,
        rawBytes: chosen.body.length,
        coverageStatus: chosen.collection.coverageStatus,
        admittedCount: chosen.collection.features.length,
        admittedCodes: chosen.collection.features.map((f) => f.properties.code),
        sourceTimestamp: chosen.collection.sourceTimestamp,
        sourceSnapshotSha256: chosen.collection.sourceSnapshotSha256,
        license: chosen.collection.license,
        simplification: chosen.collection.simplification,
        attempts,
        topology: chosen.defects,
        budgetGzipKiB: 400,
        budgetMet: chosen.gzip.length <= 400 * 1024,
        note: "Modern OSM-derived VN-34-2025 reference areas. Not historical administrative borders.",
      },
      null,
      2,
    )}\n`,
  );
  console.log(
    JSON.stringify(
      {
        outPath,
        gzipKiB: Number((chosen.gzip.length / 1024).toFixed(1)),
        budgetMet: chosen.gzip.length <= 400 * 1024,
        pointsAfter: chosen.row.pointsAfter,
        crossings: chosen.defects.crossings,
        overlaps: chosen.defects.overlaps,
        attempts,
      },
      null,
      2,
    ),
  );
  process.exitCode = chosen.collection.features.length === 34 && chosen.gzip.length <= 400 * 1024 ? 0 : 2;
}
