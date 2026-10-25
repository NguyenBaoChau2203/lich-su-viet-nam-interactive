import { Color, Group, InstancedBufferAttribute } from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { cross, dot, geoToVector, length, normalize, scale, add, sub, type Vec3 } from "@/lib/explorer/cinematic/projection";
import { sameJourneyArrival, type HistoryJourney, type JourneyArrival } from "@/lib/explorer/journey";

export type JourneyPathRequest = JourneyArrival & { journey: HistoryJourney };
export type JourneyPathGeometry = {
  positions: Float32Array; progressStart: Float32Array; progressEnd: Float32Array; selectedIndex: number;
};
const MAX_STOPS = 64;
const MAX_SEGMENTS_PER_LEG = 360;

/** Schematic shortest spherical connections, never a reconstructed travel/military route. */
export function buildJourneyPath(journey: HistoryJourney, stopId: string): JourneyPathGeometry | null {
  const selectedIndex = journey.stops.findIndex(stop => stop.id === stopId);
  if (selectedIndex < 0 || journey.stops.length > MAX_STOPS) return null;
  const stops = journey.stops.slice(0, selectedIndex + 1);
  if (stops.some(({ view }) => !Number.isFinite(view.lat) || !Number.isFinite(view.lng)
    || Math.abs(view.lat) > 90 || Math.abs(view.lng) > 180)) return null;
  const positions: number[] = [], progressStart: number[] = [], progressEnd: number[] = [];
  for (let leg = 0; leg < selectedIndex; leg++) {
    const from = geoToVector(stops[leg].view.lat, stops[leg].view.lng);
    const to = geoToVector(stops[leg + 1].view.lat, stops[leg + 1].view.lng);
    // atan2 remains well-conditioned near coincident and antipodal points.
    const angle = Math.atan2(length(cross(from, to)), Math.max(-1, Math.min(1, dot(from, to))));
    if (angle < 1e-10) continue;
    let tangent = sub(to, scale(from, dot(from, to)));
    if (length(tangent) < 1e-10) {
      // Deterministic great circle for an exactly antipodal schematic pair.
      const basis: Vec3 = Math.abs(from[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      tangent = cross(basis, from);
    }
    tangent = normalize(tangent);
    const count = Math.min(MAX_SEGMENTS_PER_LEG, Math.max(1, Math.ceil(angle / (Math.PI / 360))));
    const sample = (t: number): Vec3 => t === 0 ? from : t === 1 ? to
      : normalize(add(scale(from, Math.cos(angle * t)), scale(tangent, Math.sin(angle * t))));
    for (let segment = 0; segment < count; segment++) {
      const start = segment / count, end = (segment + 1) / count;
      positions.push(...sample(start), ...sample(end));
      progressStart.push(leg + start); progressEnd.push(leg + end);
    }
  }
  return { positions: new Float32Array(positions), progressStart: new Float32Array(progressStart),
    progressEnd: new Float32Array(progressEnd), selectedIndex };
}

/** One passive draw batch. Owns GPU resources only: no clock, timer or frame scheduler. */
export function createJourneyPathLayer() {
  const group = new Group();
  // Sort after the transparent Vietnam cap; alpha stays 1 so overlapping caps
  // never accumulate. An opaque-pass line would be tinted over by that cap.
  const material = new LineMaterial({ color: new Color("#f1c481").getHex(), linewidth: 2.25,
    transparent: true, opacity: 1, depthTest: true, depthWrite: false });
  const reveal = { value: 0 }, radius = { value: 1.001 };
  material.uniforms.uRouteReveal = reveal;
  material.uniforms.uRouteRadius = radius;
  material.vertexShader = `attribute float routeStart;
    attribute float routeEnd;
    uniform float uRouteRadius;
    varying float vRouteProgress;
    varying vec3 vRoutePoint;
    ${material.vertexShader}`
    .replace("void main() {", `void main() {
      float routeT = clamp(position.y, 0.0, 1.0);
      vRouteProgress = mix(routeStart, routeEnd, routeT);
      vRoutePoint = (modelMatrix * vec4(normalize(mix(instanceStart, instanceEnd, routeT)) * uRouteRadius, 1.0)).xyz;`)
    .replace("vec4( instanceStart, 1.0 )", "vec4( normalize(instanceStart) * uRouteRadius, 1.0 )")
    .replace("vec4( instanceEnd, 1.0 )", "vec4( normalize(instanceEnd) * uRouteRadius, 1.0 )");
  material.fragmentShader = `uniform float uRouteReveal;
    uniform float uRouteRadius;
    uniform mat4 projectionMatrix;
    varying float vRouteProgress;
    varying vec3 vRoutePoint;
    ${material.fragmentShader}`
    .replace("void main() {", `void main() {
      if (vRouteProgress > uRouteReveal) discard;
      // The Earth uses analytic spherical depth. Match it at every zoom;
      // coarse line chords must not sink below the surface/cap.
      if (dot(normalize(vRoutePoint), cameraPosition) <= uRouteRadius) discard;
      vec3 ray = normalize(vRoutePoint - cameraPosition);
      float b = dot(cameraPosition, ray);
      float discriminant = b * b - dot(cameraPosition, cameraPosition) + uRouteRadius * uRouteRadius;
      if (discriminant < 0.0) discard;
      vec3 surface = cameraPosition + ray * (-b - sqrt(max(0.0, discriminant)));
      vec4 clip = projectionMatrix * viewMatrix * vec4(surface, 1.0);
      gl_FragDepth = 0.5 * (clip.z / clip.w) + 0.5;`);

  let request: JourneyArrival | null = null, lastNonce = -1, selectedIndex = 0;
  let mesh: LineSegments2 | null = null;
  let active = false, disposed = false, segments = 0, bufferBytes = 0;
  const remove = () => {
    if (mesh) { group.remove(mesh); mesh.geometry.dispose(); mesh = null; }
    request = null; active = false; segments = 0; bufferBytes = 0; selectedIndex = 0; reveal.value = 0;
  };
  return {
    group,
    setRequest(next: JourneyPathRequest | null): boolean {
      if (disposed) return false;
      if (!next) { remove(); return true; }
      if (!Number.isSafeInteger(next.nonce) || next.nonce < 0 || next.nonce <= lastNonce) return false;
      lastNonce = next.nonce;
      remove();
      if (next.journeyId !== next.journey.id) return true;
      const data = buildJourneyPath(next.journey, next.stopId);
      if (!data) return true;
      request = { journeyId: next.journeyId, stopId: next.stopId, nonce: next.nonce };
      selectedIndex = data.selectedIndex; reveal.value = selectedIndex;
      segments = data.positions.length / 6;
      bufferBytes = data.positions.byteLength + data.progressStart.byteLength + data.progressEnd.byteLength;
      if (segments) {
        const geometry = new LineSegmentsGeometry();
        geometry.setPositions(data.positions);
        geometry.setAttribute("routeStart", new InstancedBufferAttribute(data.progressStart, 1));
        geometry.setAttribute("routeEnd", new InstancedBufferAttribute(data.progressEnd, 1));
        mesh = new LineSegments2(geometry, material);
        mesh.frustumCulled = false; mesh.renderOrder = 4;
        group.add(mesh);
      }
      return true;
    },
    startFlight(arrival?: JourneyArrival) {
      if (disposed || !sameJourneyArrival(request, arrival)) return;
      active = true; reveal.value = Math.max(0, selectedIndex - 1);
    },
    progressFlight(arrival: JourneyArrival | undefined, progress: number) {
      if (disposed || !active || !Number.isFinite(progress) || !sameJourneyArrival(request, arrival)) return;
      reveal.value = selectedIndex === 0 ? 0
        : Math.max(reveal.value, selectedIndex - 1 + Math.min(1, Math.max(0, progress)));
    },
    finishFlight(arrival?: JourneyArrival) {
      if (disposed || !sameJourneyArrival(request, arrival)) return;
      active = false; reveal.value = selectedIndex;
    },
    updateView(width: number, height: number, surfaceRadius: number) {
      material.resolution.set(width, height);
      radius.value = 1 + (surfaceRadius - 1) * 1.25;
    },
    stats: () => ({ request, segments, bufferBytes, reveal: reveal.value, active }),
    dispose() {
      if (disposed) return;
      disposed = true; remove(); material.dispose();
    },
  };
}
