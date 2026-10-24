#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const PINNED_SOURCE_SHA256 = "2faac4f6b34386f3d21b6e018cf151f241f00e5c936d44dd17d7d9bfb147fa48";
const EXPECTED_SOURCE_BYTES = 760189;
const EXPECTED_SOURCE_FEATURES = 390;
const EXPECTED_ORDINARY_FEATURES = 357;
const EXPECTED_OMITTED_FEATURES = 33;

const RAW_GITHUB_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_boundary_lines_land.geojson";
const SOURCE_CATALOG_URL =
  "https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-boundary-lines-2/";
const SOURCE_TERMS_URL = "https://www.naturalearthdata.com/about/terms-of-use/";
const SOURCE_POLICY_URL = "https://www.naturalearthdata.com/about/disputed-boundaries-policy/";

const ORDINARY_CLASS = "International boundary (verify)";
const BUDGET_GZIP_MAX = 150 * 1024; // 150 KiB

// Parse CLI flags
const args = process.argv.slice(2);
let inputPath = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && i + 1 < args.length) {
    inputPath = args[i + 1];
    i++;
  }
}

// Fallback search locations if --input not specified
if (!inputPath) {
  const localCandidates = [
    path.resolve(process.cwd(), ".task-reports/country-borders-review-work/ne_50m_admin_0_boundary_lines_land.geojson"),
  ];
  for (const candidate of localCandidates) {
    if (existsSync(candidate)) {
      inputPath = candidate;
      break;
    }
  }
}

let rawBuffer;
if (inputPath && existsSync(inputPath)) {
  console.log(`Reading source from local path: ${inputPath}`);
  rawBuffer = readFileSync(inputPath);
} else {
  console.log(`Fetching pinned source from: ${RAW_GITHUB_URL}`);
  const res = await fetch(RAW_GITHUB_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch source: HTTP ${res.status} ${res.statusText}`);
  }
  rawBuffer = Buffer.from(await res.arrayBuffer());
}

// Verify source hash and size
const sourceHash = createHash("sha256").update(rawBuffer).digest("hex");
if (sourceHash !== PINNED_SOURCE_SHA256) {
  throw new Error(
    `Source SHA-256 hash mismatch!\nExpected: ${PINNED_SOURCE_SHA256}\nReceived: ${sourceHash}\nDo not force counts when source differs.`,
  );
}
if (rawBuffer.length !== EXPECTED_SOURCE_BYTES) {
  console.warn(
    `Warning: source size ${rawBuffer.length} differs from expected ${EXPECTED_SOURCE_BYTES} bytes.`,
  );
}
console.log(`Source verified: SHA-256 = ${sourceHash} (${rawBuffer.length} bytes)`);

const rawData = JSON.parse(rawBuffer.toString("utf8"));
if (rawData.type !== "FeatureCollection" || !Array.isArray(rawData.features)) {
  throw new Error("Invalid raw GeoJSON: expected FeatureCollection");
}

if (rawData.features.length !== EXPECTED_SOURCE_FEATURES) {
  throw new Error(
    `Unexpected feature count: ${rawData.features.length} (expected ${EXPECTED_SOURCE_FEATURES})`,
  );
}

function roundCoord(c) {
  const n = Number(c.toFixed(4));
  return Object.is(n, -0) ? 0 : n;
}

function roundCoords(coords) {
  if (typeof coords[0] === "number") {
    return [roundCoord(coords[0]), roundCoord(coords[1])];
  }
  return coords.map(roundCoords);
}

const selectedFeatures = [];
const omittedFeatures = [];
const omittedSummary = {};
let totalPoints = 0;

for (let i = 0; i < rawData.features.length; i++) {
  const feat = rawData.features[i];
  const props = feat.properties || {};

  const sourceId = props.NE_ID;
  if (typeof sourceId !== "number" || !Number.isInteger(sourceId)) {
    throw new Error(`Feature ${i} lacks integer NE_ID: ${JSON.stringify(sourceId)}`);
  }

  const sourceClass = typeof props.FEATURECLA === "string" ? props.FEATURECLA.trim() : "";
  const fclassVn = typeof props.FCLASS_VN === "string" && props.FCLASS_VN.trim().length > 0 ? props.FCLASS_VN.trim() : null;
  const viewClass = fclassVn ?? sourceClass;

  if (viewClass === ORDINARY_CLASS) {
    if (feat.geometry.type !== "LineString" && feat.geometry.type !== "MultiLineString") {
      throw new Error(`Feature ${sourceId} has unexpected geometry type: ${feat.geometry.type}`);
    }

    const roundedCoordinates = roundCoords(feat.geometry.coordinates);

    if (feat.geometry.type === "LineString") {
      totalPoints += roundedCoordinates.length;
    } else {
      for (const part of roundedCoordinates) {
        totalPoints += part.length;
      }
    }

    selectedFeatures.push({
      type: "Feature",
      properties: {
        sourceId,
        sourceClass,
        viewClass,
      },
      geometry: {
        type: feat.geometry.type,
        coordinates: roundedCoordinates,
      },
    });
  } else {
    omittedSummary[viewClass] = (omittedSummary[viewClass] || 0) + 1;
    omittedFeatures.push({
      sourceId,
      sourceClass,
      viewClass,
    });
  }
}

if (selectedFeatures.length !== EXPECTED_ORDINARY_FEATURES) {
  throw new Error(
    `Selected feature count mismatch: got ${selectedFeatures.length}, expected ${EXPECTED_ORDINARY_FEATURES}`,
  );
}

if (omittedFeatures.length !== EXPECTED_OMITTED_FEATURES) {
  throw new Error(
    `Omitted feature count mismatch: got ${omittedFeatures.length}, expected ${EXPECTED_OMITTED_FEATURES}`,
  );
}

const outputGeoJSON = {
  type: "FeatureCollection",
  features: selectedFeatures,
};

const outputString = JSON.stringify(outputGeoJSON);
const outputBuffer = Buffer.from(outputString, "utf8");
const outputHash = createHash("sha256").update(outputBuffer).digest("hex");
const gzipBytes = gzipSync(outputBuffer).length;

console.log(`Generated GeoJSON:`);
console.log(`- Selected features: ${selectedFeatures.length}`);
console.log(`- Total points: ${totalPoints}`);
console.log(`- Output bytes: ${outputBuffer.length}`);
console.log(`- Gzip bytes: ${gzipBytes} (${(gzipBytes / 1024).toFixed(2)} KiB)`);
console.log(`- SHA-256: ${outputHash}`);

if (gzipBytes > BUDGET_GZIP_MAX) {
  throw new Error(
    `Payload exceeds budget! Gzip size is ${gzipBytes} bytes, max allowed is ${BUDGET_GZIP_MAX} bytes.`,
  );
}

const provenance = {
  title: "Generalized international land boundaries for the curated cinematic globe",
  publisher: "Natural Earth contributors",
  datasetVersion: "5.1.0",
  repositoryTag: "v5.1.2",
  sourceCatalogUrl: SOURCE_CATALOG_URL,
  sourceDataUrl: RAW_GITHUB_URL,
  sourceTermsUrl: SOURCE_TERMS_URL,
  sourcePolicyUrl: SOURCE_POLICY_URL,
  license: "Public domain; Natural Earth terms of use",
  licenseUrl: SOURCE_TERMS_URL,
  accessedAt: "2026-10-24",
  sourceSha256: PINNED_SOURCE_SHA256,
  sourceBytes: rawBuffer.length,
  sourceFeatures: rawData.features.length,
  effectiveClassPolicy: "FCLASS_VN ?? FEATURECLA",
  selectedClass: ORDINARY_CLASS,
  featuresCount: selectedFeatures.length,
  totalPoints,
  omittedSummary,
  omittedFeatures,
  sha256: outputHash,
  bytes: outputBuffer.length,
  gzipBytes,
  processing:
    "Filtered 50m land boundary lines using effective classification policy (FCLASS_VN ?? FEATURECLA). Retained only 'International boundary (verify)'. Normalized properties to { sourceId, sourceClass, viewClass }. Preserved open LineString and disconnected MultiLineString geometry. Rounded coordinates to 4 decimal places.",
  scope:
    "Generalized modern international land boundaries at 1:50,000,000; visual context for neighboring country separation on the cinematic globe.",
  limitations:
    "Modern generalized boundaries; not historical borders for specific years and not legal determinations. Disputed, control, indefinite, indeterminant, subnational, and unrecognized lines are omitted from this solid layer.",
};

const targetGeoJSONPath = path.resolve(process.cwd(), "public/maps/history-country-boundaries.geojson");
const targetProvenancePath = path.resolve(
  process.cwd(),
  "public/maps/history-country-boundaries.provenance.json",
);

const tmpGeoJSONPath = `${targetGeoJSONPath}.tmp`;
const tmpProvenancePath = `${targetProvenancePath}.tmp`;

// Atomic write
writeFileSync(tmpGeoJSONPath, outputString, "utf8");
writeFileSync(tmpProvenancePath, JSON.stringify(provenance, null, 2), "utf8");

renameSync(tmpGeoJSONPath, targetGeoJSONPath);
renameSync(tmpProvenancePath, targetProvenancePath);

console.log(`Successfully written:`);
console.log(`- ${targetGeoJSONPath}`);
console.log(`- ${targetProvenancePath}`);
