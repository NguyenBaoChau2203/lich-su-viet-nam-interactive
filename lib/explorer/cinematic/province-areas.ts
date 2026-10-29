import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  type Camera,
  type InterleavedBuffer,
  type Object3D,
} from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type { LinearRing } from "@/lib/explorer/types";
import { createSurfaceCap, surfaceOutlineSegments, type HighlightCollection } from "@/lib/explorer/cinematic/geography";
import { add, geoToVector, length, normalize, scale, surfaceLayerRadii } from "@/lib/explorer/cinematic/projection";
import {
  provinceAreaPolygons,
  type ProvinceAreaCollection,
  type ProvinceAreaFeature,
} from "@/lib/locality/province-areas";

export const PROVINCE_AREA_BASE_RADIUS = 1.0004;
export const PROVINCE_AREA_LIFT = 0.006;
export const PROVINCE_AREA_LIFT_MS = 280;

/** Same close-view shell as the national cap. Far cameras keep the nominal base. */
export function provinceAreaSurfaceRadius(distanceToSurface: number): number {
  if (!Number.isFinite(distanceToSurface)) return PROVINCE_AREA_BASE_RADIUS;
  return surfaceLayerRadii(Math.max(0, distanceToSurface)).cap;
}

/** Keep raised caps below the camera and beyond the near plane at supported views. */
export function cameraSafeProvinceLift(options: {
  cameraRadius: number;
  near: number;
  baseRadius?: number;
  requestedLift?: number;
}): number {
  const base = options.baseRadius ?? PROVINCE_AREA_BASE_RADIUS;
  const requested = options.requestedLift ?? PROVINCE_AREA_LIFT;
  if (![options.cameraRadius, options.near, base, requested].every(Number.isFinite)) return 0;
  if (options.cameraRadius <= base || options.near <= 0 || requested <= 0) return 0;
  const clearance = 1e-4;
  const maxByCamera = Math.max(0, options.cameraRadius - base - clearance);
  // Depth from camera to a radial surface point near the view centre ≈ cameraRadius - raisedRadius.
  const maxByNear = Math.max(0, options.cameraRadius - options.near * 1.15 - base);
  return Math.min(requested, maxByCamera, maxByNear);
}

export type ProvinceSelectionGeometry = {
  code: LocalityCode;
  nonce: number;
  baseRadius: number;
  currentRadius: number;
  targetRadius: number;
  capVertexCount: number;
  wallVertexCount: number;
  partCount: number;
  holeCount: number;
  status: "admitted" | "unavailable";
  /** Present for an admitted visual. Derived from cap/wall positions, not from the animation clock alone. */
  capMinRadius?: number;
  capMaxRadius?: number;
  nonFinite?: number;
  wallBaseHits?: number;
  wallTopHits?: number;
  wallOtherHits?: number;
  wallBaseRadius?: number;
  wallTopRadius?: number;
  outlineBytes?: number;
};

export type ProvinceAreaLayer = {
  group: Group;
  setSelected(code: LocalityCode | null, options: { nonce: number; instant: boolean }): void;
  setCameraClearance(options: { cameraRadius: number; near: number; distanceToTarget?: number }): void;
  update(nowMs: number): boolean;
  pick(raycaster: Raycaster, earthDistance: number): LocalityCode | null;
  getSelectedGeometry(): ProvinceSelectionGeometry | null;
  /** Stable outline interleaved storage for the current visual, if any. */
  getOutlinePositionBuffer(): InterleavedBuffer | null;
  getFeature(code: LocalityCode): ProvinceAreaFeature | undefined;
  setResolution(width: number, height: number): void;
  stats(): { admitted: number; selected: LocalityCode | null; animating: boolean; drawMeshes: number };
  dispose(): void;
};

type BuiltUnit = {
  code: LocalityCode;
  feature: ProvinceAreaFeature;
  pickMesh: Mesh;
  unitDirs: Float32Array;
  wallTemplate: Float32Array;
  outlineTemplate: Float32Array;
};

type SelectionState = {
  code: LocalityCode;
  feature: ProvinceAreaFeature;
  nonce: number;
  fromHeight: number;
  toHeight: number;
  startMs: number;
  durationMs: number;
  capMesh: Mesh;
  wallMesh: Mesh;
  outline: LineSegments2;
  capGeometry: BufferGeometry;
  wallGeometry: BufferGeometry;
  outlineGeometry: LineSegmentsGeometry;
  outlineTemplate: Float32Array;
  unitDirs: Float32Array;
  wallPositions: Float32Array;
  /** Owner intent. Null while a visual is only departing. Camera updates must not raise it. */
  departing: boolean;
};

function asHighlight(feature: ProvinceAreaFeature): HighlightCollection {
  return {
    type: "FeatureCollection",
    features: [{ type: "Feature", properties: feature.properties, geometry: feature.geometry }],
  };
}

function wallPositionsFromRings(
  polygons: readonly (readonly LinearRing[])[],
  baseRadius: number,
  raisedRadius: number,
  target?: Float32Array,
): Float32Array {
  let count = 0;
  for (const polygon of polygons) {
    for (const ring of polygon) count += Math.max(0, ring.length - 1) * 6 * 3;
  }
  const positions = target && target.length === count ? target : new Float32Array(count);
  let o = 0;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (let i = 0; i < ring.length - 1; i++) {
        const [lngA, latA] = ring[i];
        const [lngB, latB] = ring[i + 1];
        const a = geoToVector(latA, lngA);
        const b = geoToVector(latB, lngB);
        const a0 = scale(a, baseRadius);
        const a1 = scale(a, raisedRadius);
        const b0 = scale(b, baseRadius);
        const b1 = scale(b, raisedRadius);
        for (const v of [a0, b0, b1, a0, b1, a1]) {
          positions[o++] = v[0];
          positions[o++] = v[1];
          positions[o++] = v[2];
        }
      }
    }
  }
  return positions;
}

function applyCapRadius(geometry: BufferGeometry, unitDirs: Float32Array, radius: number) {
  const position = geometry.getAttribute("position");
  for (let i = 0; i < position.count; i++) {
    position.setXYZ(i, unitDirs[i * 3] * radius, unitDirs[i * 3 + 1] * radius, unitDirs[i * 3 + 2] * radius);
  }
  position.needsUpdate = true;
  geometry.computeBoundingSphere();
}

function outlineBuffer(geometry: LineSegmentsGeometry): InterleavedBuffer | null {
  const start = geometry.getAttribute("instanceStart") as { data?: InterleavedBuffer } | undefined;
  return start?.data ?? null;
}

/** Scale one allocated outline around the globe origin. Does not call setPositions. */
function writeOutlineRadius(geometry: LineSegmentsGeometry, template: Float32Array, radius: number) {
  const buffer = outlineBuffer(geometry);
  const array = buffer?.array;
  if (!buffer || !(array instanceof Float32Array) || array.length !== template.length) {
    const scaled = new Float32Array(template.length);
    for (let i = 0; i < template.length; i++) scaled[i] = template[i] * radius;
    geometry.setPositions(scaled);
    return;
  }
  for (let i = 0; i < template.length; i++) array[i] = template[i] * radius;
  buffer.needsUpdate = true;
  geometry.computeBoundingSphere();
}

function meshAudit(state: SelectionState, height: number, baseRadius: number) {
  const current = baseRadius + height;
  const position = state.capGeometry.getAttribute("position");
  let capMin = Number.POSITIVE_INFINITY;
  let capMax = 0;
  let nonFinite = 0;
  for (let i = 0; i < position.count; i++) {
    const radius = Math.hypot(position.getX(i), position.getY(i), position.getZ(i));
    if (!Number.isFinite(radius)) nonFinite += 1;
    else {
      capMin = Math.min(capMin, radius);
      capMax = Math.max(capMax, radius);
    }
  }
  const wall = state.wallPositions;
  let baseHits = 0;
  let topHits = 0;
  let other = 0;
  let baseSum = 0;
  let topSum = 0;
  for (let i = 0; i + 2 < wall.length; i += 3) {
    const radius = Math.hypot(wall[i], wall[i + 1], wall[i + 2]);
    if (!Number.isFinite(radius)) {
      nonFinite += 1;
      continue;
    }
    if (Math.abs(radius - baseRadius) < 2e-4) {
      baseHits += 1;
      baseSum += radius;
    } else if (Math.abs(radius - current) < 2e-4) {
      topHits += 1;
      topSum += radius;
    } else other += 1;
  }
  const outline = outlineBuffer(state.outlineGeometry)?.array;
  return {
    capMinRadius: Number.isFinite(capMin) ? capMin : 0,
    capMaxRadius: capMax,
    nonFinite,
    wallBaseHits: baseHits,
    wallTopHits: topHits,
    wallOtherHits: other,
    wallBaseRadius: baseHits ? baseSum / baseHits : 0,
    wallTopRadius: topHits ? topSum / topHits : 0,
    outlineBytes: outline?.byteLength ?? 0,
  };
}

function currentHeight(state: SelectionState, nowMs: number): number {
  if (state.durationMs <= 0) return state.toHeight;
  const elapsed = Math.min(1, (nowMs - state.startMs) / state.durationMs);
  const eased = 1 - (1 - elapsed) ** 3;
  return state.fromHeight + (state.toHeight - state.fromHeight) * eased;
}

async function buildPickMesh(
  feature: ProvinceAreaFeature,
  material: MeshBasicMaterial,
): Promise<{ mesh: Mesh; unitDirs: Float32Array; wallTemplate: Float32Array; outlineTemplate: Float32Array } | null> {
  const geometry = await createSurfaceCap(asHighlight(feature), material);
  const position = geometry.getAttribute("position");
  const unitDirs = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i++) {
    const v = normalize([position.getX(i), position.getY(i), position.getZ(i)]);
    unitDirs[i * 3] = v[0];
    unitDirs[i * 3 + 1] = v[1];
    unitDirs[i * 3 + 2] = v[2];
    position.setXYZ(i, v[0] * PROVINCE_AREA_BASE_RADIUS, v[1] * PROVINCE_AREA_BASE_RADIUS, v[2] * PROVINCE_AREA_BASE_RADIUS);
  }
  position.needsUpdate = true;
  geometry.computeBoundingSphere();
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  // Keep visible for Raycaster; meshes live on an off-scene pick root so they are not drawn.
  mesh.visible = true;
  mesh.userData.provinceCode = feature.properties.code;
  const polygons = provinceAreaPolygons(feature);
  const wallTemplate = wallPositionsFromRings(polygons, PROVINCE_AREA_BASE_RADIUS, PROVINCE_AREA_BASE_RADIUS);
  const outlineTemplate = new Float32Array(surfaceOutlineSegments(asHighlight(feature), 1));
  return { mesh, unitDirs, wallTemplate, outlineTemplate };
}

export async function createProvinceAreaLayer(
  collection: ProvinceAreaCollection,
  options: { resolution: { width: number; height: number } },
): Promise<ProvinceAreaLayer> {
  const group = new Group();
  group.name = "province-areas";
  const pickRoot = new Group();
  pickRoot.name = "province-area-picks";
  const pickMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false,
    side: DoubleSide,
  });
  const capMaterial = new MeshBasicMaterial({
    color: 0xd8b36b,
    transparent: true,
    opacity: 0.55,
    depthWrite: true,
    side: FrontSide,
  });
  const wallMaterial = new MeshBasicMaterial({
    color: 0x6b5230,
    transparent: true,
    opacity: 0.85,
    depthWrite: true,
    side: FrontSide,
  });
  const outlineMaterial = new LineMaterial({
    color: 0xf0d9a0,
    linewidth: 1.4,
    transparent: true,
    opacity: 0.95,
    depthTest: true,
    depthWrite: false,
  });
  outlineMaterial.resolution.set(options.resolution.width, options.resolution.height);

  const units = new Map<LocalityCode, BuiltUnit>();
  for (const feature of collection.features) {
    const built = await buildPickMesh(feature, pickMaterial);
    if (!built) continue;
    pickRoot.add(built.mesh);
    units.set(feature.properties.code, {
      code: feature.properties.code,
      feature,
      pickMesh: built.mesh,
      unitDirs: built.unitDirs,
      wallTemplate: built.wallTemplate,
      outlineTemplate: built.outlineTemplate,
    });
  }

  let selection: SelectionState | null = null;
  let unavailable: { code: LocalityCode; nonce: number } | null = null;
  let animating = false;
  let cameraRadius = Number.POSITIVE_INFINITY;
  let cameraNear = 0.01;
  let distanceToTarget = Number.POSITIVE_INFINITY;
  let surfaceRadius = PROVINCE_AREA_BASE_RADIUS;
  let effectiveLift = PROVINCE_AREA_LIFT;

  const disposeSelectionVisuals = () => {
    if (!selection) return;
    group.remove(selection.capMesh, selection.wallMesh, selection.outline);
    selection.capGeometry.dispose();
    selection.wallGeometry.dispose();
    selection.outlineGeometry.dispose();
    selection = null;
    animating = false;
  };

  const applyHeight = (state: SelectionState, height: number) => {
    const radius = surfaceRadius + height;
    applyCapRadius(state.capGeometry, state.unitDirs, radius);
    wallPositionsFromRings(
      provinceAreaPolygons(state.feature),
      surfaceRadius,
      radius,
      state.wallPositions,
    );
    const wallAttr = state.wallGeometry.getAttribute("position") as BufferAttribute;
    wallAttr.needsUpdate = true;
    state.wallGeometry.computeVertexNormals();
    state.wallGeometry.computeBoundingSphere();

    writeOutlineRadius(state.outlineGeometry, state.outlineTemplate, radius);
  };

  const remountOrRetarget = (unit: BuiltUnit, nonce: number, instant: boolean) => {
    unavailable = null;
    if (selection?.code === unit.code) {
      selection.nonce = nonce;
      selection.departing = false;
      selection.fromHeight = currentHeight(selection, performance.now());
      selection.toHeight = effectiveLift;
      selection.startMs = performance.now();
      selection.durationMs = instant ? 0 : PROVINCE_AREA_LIFT_MS;
      if (instant) {
        applyHeight(selection, effectiveLift);
        animating = false;
      } else {
        animating = true;
      }
      return;
    }
    disposeSelectionVisuals();
    const capGeometry = unit.pickMesh.geometry.clone();
    applyCapRadius(capGeometry, unit.unitDirs, surfaceRadius);
    const wallPositions = unit.wallTemplate.slice();
    const wallGeometry = new BufferGeometry();
    wallGeometry.setAttribute("position", new BufferAttribute(wallPositions, 3));
    wallGeometry.computeVertexNormals();
    const outlineGeometry = new LineSegmentsGeometry();
    writeOutlineRadius(outlineGeometry, unit.outlineTemplate, surfaceRadius);
    const capMesh = new Mesh(capGeometry, capMaterial);
    const wallMesh = new Mesh(wallGeometry, wallMaterial);
    const outline = new LineSegments2(outlineGeometry, outlineMaterial);
    for (const mesh of [capMesh, wallMesh, outline]) mesh.frustumCulled = false;
    capMesh.renderOrder = 3;
    wallMesh.renderOrder = 2.8;
    outline.renderOrder = 3.1;
    group.add(capMesh, wallMesh, outline);
    selection = {
      code: unit.code,
      feature: unit.feature,
      nonce,
      fromHeight: 0,
      toHeight: effectiveLift,
      startMs: performance.now(),
      durationMs: instant ? 0 : PROVINCE_AREA_LIFT_MS,
      capMesh,
      wallMesh,
      outline,
      capGeometry,
      wallGeometry,
      outlineGeometry,
      outlineTemplate: unit.outlineTemplate,
      unitDirs: unit.unitDirs,
      wallPositions,
      departing: false,
    };
    if (instant) {
      applyHeight(selection, effectiveLift);
      animating = false;
    } else {
      animating = true;
    }
  };

  const recomputeLift = () => {
    const nextBase = provinceAreaSurfaceRadius(distanceToTarget);
    const baseChanged = Math.abs(nextBase - surfaceRadius) > 1e-9;
    surfaceRadius = nextBase;
    effectiveLift = cameraSafeProvinceLift({ cameraRadius, near: cameraNear, baseRadius: surfaceRadius });
    if (baseChanged) {
      for (const unit of units.values()) applyCapRadius(unit.pickMesh.geometry, unit.unitDirs, surfaceRadius);
    }
    if (!selection) return;
    const now = performance.now();
    // A cleared or replaced visual keeps its zero target. Camera safety may only
    // clamp the current height downward so the departing cap stays outside the camera.
    if (selection.departing) {
      const height = currentHeight(selection, now);
      if (height > effectiveLift + 1e-6) {
        selection.fromHeight = effectiveLift;
        selection.toHeight = 0;
        selection.departing = true;
        selection.startMs = now;
        selection.durationMs = PROVINCE_AREA_LIFT_MS;
        applyHeight(selection, effectiveLift);
        animating = true;
      } else if (baseChanged) {
        applyHeight(selection, height);
      }
      return;
    }
    if (!baseChanged && Math.abs(selection.toHeight - effectiveLift) < 1e-9) return;
    selection.fromHeight = currentHeight(selection, now);
    selection.toHeight = effectiveLift;
    selection.startMs = now;
    selection.durationMs = 0;
    applyHeight(selection, effectiveLift);
    animating = false;
  };

  return {
    group,
    setCameraClearance({ cameraRadius: nextRadius, near, distanceToTarget: nextDistance }) {
      cameraRadius = nextRadius;
      cameraNear = near;
      if (nextDistance !== undefined) distanceToTarget = nextDistance;
      recomputeLift();
    },
    setSelected(code, { nonce, instant }) {
      if (!code) {
        unavailable = null;
        if (!selection) return;
        selection.departing = true;
        if (selection.nonce === nonce && selection.toHeight === 0 && !animating) return;
        if (instant) {
          disposeSelectionVisuals();
          return;
        }
        selection.nonce = nonce;
        selection.fromHeight = currentHeight(selection, performance.now());
        selection.toHeight = 0;
        selection.startMs = performance.now();
        selection.durationMs = PROVINCE_AREA_LIFT_MS;
        animating = true;
        return;
      }
      const unit = units.get(code);
      if (!unit) {
        // R1: never keep province A's mesh while cards/URL show province B.
        disposeSelectionVisuals();
        unavailable = { code, nonce };
        return;
      }
      if (selection?.code === code && !selection.departing && selection.nonce === nonce && Math.abs(selection.toHeight - effectiveLift) < 1e-9) {
        return;
      }
      remountOrRetarget(unit, nonce, instant);
    },
    update(nowMs) {
      if (!selection || !animating) return false;
      const height = currentHeight(selection, nowMs);
      applyHeight(selection, height);
      const done = selection.durationMs <= 0 || nowMs - selection.startMs >= selection.durationMs;
      if (done) {
        animating = false;
        applyHeight(selection, selection.toHeight);
        // A close camera can settle at zero lift. Only a departing clear removes the cap.
        if (selection.departing && selection.toHeight === 0) disposeSelectionVisuals();
      }
      return animating;
    },
    pick(raycaster, earthDistance) {
      pickRoot.updateMatrixWorld(true);
      const meshes = [...units.values()].map((unit) => unit.pickMesh);
      const hits = raycaster.intersectObjects(meshes, false);
      for (const hit of hits) {
        if (!(hit.object instanceof Mesh)) continue;
        if (hit.distance > earthDistance + 1e-4) continue;
        const code = hit.object.userData.provinceCode as LocalityCode | undefined;
        if (code && units.has(code)) return code;
      }
      return null;
    },
    getSelectedGeometry() {
      if (unavailable) {
        return {
          code: unavailable.code,
          nonce: unavailable.nonce,
          baseRadius: surfaceRadius,
          currentRadius: surfaceRadius,
          targetRadius: surfaceRadius,
          capVertexCount: 0,
          wallVertexCount: 0,
          partCount: 0,
          holeCount: 0,
          status: "unavailable",
        };
      }
      if (!selection) return null;
      const height = currentHeight(selection, performance.now());
      return {
        code: selection.code,
        nonce: selection.nonce,
        baseRadius: surfaceRadius,
        currentRadius: surfaceRadius + height,
        targetRadius: surfaceRadius + selection.toHeight,
        capVertexCount: selection.capGeometry.getAttribute("position").count,
        wallVertexCount: selection.wallGeometry.getAttribute("position").count,
        partCount: selection.feature.properties.partCount,
        holeCount: selection.feature.properties.holeCount,
        status: "admitted",
        ...meshAudit(selection, height, surfaceRadius),
      };
    },
    getOutlinePositionBuffer() {
      return selection ? outlineBuffer(selection.outlineGeometry) : null;
    },
    getFeature(code) {
      return units.get(code)?.feature;
    },
    setResolution(width, height) {
      outlineMaterial.resolution.set(width, height);
    },
    stats() {
      return {
        admitted: units.size,
        selected: selection?.code ?? unavailable?.code ?? null,
        animating,
        drawMeshes: selection ? 3 : 0,
      };
    },
    dispose() {
      disposeSelectionVisuals();
      unavailable = null;
      for (const unit of units.values()) {
        pickRoot.remove(unit.pickMesh);
        unit.pickMesh.geometry.dispose();
      }
      units.clear();
      pickMaterial.dispose();
      capMaterial.dispose();
      wallMaterial.dispose();
      outlineMaterial.dispose();
      group.clear();
      pickRoot.clear();
    },
  };
}

export function pointerToNdc(clientX: number, clientY: number, rect: DOMRect): { x: number; y: number } {
  return {
    x: ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
    y: 1 - ((clientY - rect.top) / Math.max(1, rect.height)) * 2,
  };
}

export function earthHitDistance(raycaster: Raycaster, earth: Object3D | null): number {
  if (!earth) return Number.POSITIVE_INFINITY;
  const hits = raycaster.intersectObject(earth, true);
  return hits[0]?.distance ?? Number.POSITIVE_INFINITY;
}

export function createProvinceRaycaster(_camera: Camera): Raycaster {
  return new Raycaster();
}

export function meanRadius(geometry: BufferGeometry): number {
  const position = geometry.getAttribute("position");
  let total = 0;
  for (let i = 0; i < position.count; i++) {
    total += length([position.getX(i), position.getY(i), position.getZ(i)]);
  }
  return total / Math.max(1, position.count);
}

export function ringWallSample(ring: LinearRing, base: number, raised: number) {
  const [lng, lat] = ring[0];
  const bottom = scale(geoToVector(lat, lng), base);
  const top = scale(geoToVector(lat, lng), raised);
  return { bottom: length(bottom), top: length(top), delta: length(add(top, scale(bottom, -1))) };
}
