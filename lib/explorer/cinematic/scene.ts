/**
 * One Three.js renderer / scene / camera lifecycle for the cinematic globe (browser only).
 *
 * - One WebGL context, one scene, one camera-flight owner, one on-demand render loop.
 * - Everything is disposed explicitly in `dispose()`.
 * - `three-globe` (MIT, Vasco Asturiano) builds the near-surface Vietnam polygon on the sphere; the Earth,
 *   atmosphere and stars are local materials (see materials.ts).
 */
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  LinearMipmapLinearFilter,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { createSurfaceCap, surfaceOutlineSegments, type HighlightCollection } from "@/lib/explorer/cinematic/geography";
export type { HighlightCollection } from "@/lib/explorer/cinematic/geography";
import {
  countryBoundarySegments,
  type CountryBoundaryCollection,
} from "@/lib/explorer/cinematic/country-boundaries";
export type { CountryBoundaryCollection } from "@/lib/explorer/cinematic/country-boundaries";
import {
  PROVINCE_ALTITUDE,
  PROVINCE_SLATE,
  provinceBoundarySegments,
  type ProvinceBoundaryCollection,
} from "@/lib/explorer/cinematic/province-boundaries";
export type { ProvinceBoundaryCollection } from "@/lib/explorer/cinematic/province-boundaries";
import {
  overviewZoomForHeight,
  viewToCameraPose,
  type CameraPose,
  type GlobeStageSize,
} from "@/lib/explorer/cinematic/camera";
import { createCameraFlightDirector } from "@/lib/explorer/cinematic/flight";
import { createJourneyPathLayer, type JourneyPathRequest } from "@/lib/explorer/cinematic/journey-path";
import type { JourneyArrival } from "@/lib/explorer/journey";
import {
  createAtmosphere,
  createEarthGeometry,
  createEarthMaterial,
  createStars,
  createVietnamHighlightMaterial,
  sunDirectionVector,
} from "@/lib/explorer/cinematic/materials";
import { createGlobeViewport, geoToVector, surfaceLayerRadii, type GlobeViewport } from "@/lib/explorer/cinematic/projection";
import type { MapView } from "@/lib/explorer/map-view";

export type CinematicAssets = { day: string; normal: string; specular: string };

export type CinematicSceneOptions = {
  canvas: HTMLCanvasElement;
  assets: CinematicAssets;
  highlight: HighlightCollection;
  coastlines?: HighlightCollection;
  countryBoundaries?: CountryBoundaryCollection;
  provinceBoundaries?: ProvinceBoundaryCollection;
  initialView: MapView;
  /** Pixel ratio cap from the spec's performance budget. */
  pixelRatioCap?: number;
  onContextLost?: () => void;
  signal?: AbortSignal;
};

export type FrameCapture = { intervalsMs: number[]; renderMs: number[]; syncedGpu: boolean };
export type SceneStats = {
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  /** Decoded RGBA8 estimate including a full mip chain (×4/3), in MiB. */
  textureMiB: number;
  pixelRatio: number;
  canvasPixels: { width: number; height: number };
  renderer: string;
  webgl: string;
  countryBorderSegments?: number;
  provinceBorderSegments?: number;
  journeyPath?: ReturnType<ReturnType<typeof createJourneyPathLayer>["stats"]>;
};
export type CinematicScene = {
  setView(view: MapView): void;
  getViewport(): GlobeViewport;
  subscribe(listener: () => void): () => void;
  getView(): MapView;
  flyTo(target: MapView, durationMs: number, arrival?: JourneyArrival): Promise<"arrived" | "cancelled">;
  cancelFlight(): void;
  resize(): void;
  setVisible(visible: boolean): void;
  setCountryBoundaries(data: CountryBoundaryCollection | null): void;
  setProvinceBoundaries(data: ProvinceBoundaryCollection | null): void;
  setJourneyPath(request: JourneyPathRequest | null): void;
  stats(): SceneStats;
  beginFrameCapture(options?: { syncGpu?: boolean }): void;
  endFrameCapture(): FrameCapture;
  /** Debug/verification only: the Three.js camera's own projection of a geographic point. */
  projectGeo(lat: number, lng: number): { x: number; y: number; behind: boolean };
  dispose(): void;
};

const BOUNDARY_ALTITUDE = 1.0002;
const COASTLINE_ALTITUDE = 1.0005;
const OUTLINE_ALTITUDE = 1.0008;
const OUTLINE_GOLD = "#ecc472";
const COASTLINE_SLATE = "#7a8577";
const BOUNDARY_SLATE = "#7c8d81";

function loadTexture(loader: TextureLoader, url: string, colorSpace: string, anisotropy: number): Promise<Texture> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = colorSpace;
        texture.wrapS = RepeatWrapping;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.anisotropy = anisotropy;
        texture.generateMipmaps = true;
        resolve(texture);
      },
      undefined,
      () => reject(new Error(`Không tải được ảnh bề mặt: ${url}`)),
    );
  });
}

export async function createCinematicScene(options: CinematicSceneOptions): Promise<CinematicScene> {
  options.signal?.throwIfAborted();
  const { canvas } = options;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, options.pixelRatioCap ?? 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(new Color("#030910"), 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.01, 100);
  const disposables: { dispose(): void }[] = [];
  const textures: Texture[] = [];
  const listeners = new Set<() => void>();
  let disposed = false;
  let visible = true;
  let frameHandle = 0;
  let view = options.initialView;
  let pose: CameraPose;
  let viewport: GlobeStageSize = { width: 1, height: 1 };
  let cancelCurrentFlight = () => {};
  let removeContextListener = () => {};
  let cleanupBoundaries = () => {};
  let cleanupProvinceBoundaries = () => {};
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    listeners.clear(); cancelCurrentFlight();
    if (frameHandle) cancelAnimationFrame(frameHandle);
    removeContextListener();
    cleanupBoundaries();
    cleanupProvinceBoundaries();
    options.signal?.removeEventListener("abort", dispose);
    for (const item of disposables) item.dispose();
    renderer.dispose(); renderer.forceContextLoss();
  };
  options.signal?.addEventListener("abort", dispose, { once: true });

  try {
    const loader = new TextureLoader();
    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const asset = async (url: string, colorSpace: string, detail: number) => {
      const texture = await loadTexture(loader, url, colorSpace, detail);
      if (disposed) { texture.dispose(); throw new Error("Globe loading cancelled"); }
      disposables.push(texture);
      return texture;
    };
    const [day, normal, specular] = await Promise.all([
      asset(options.assets.day, SRGBColorSpace, anisotropy),
      asset(options.assets.normal, NoColorSpace, 4),
      asset(options.assets.specular, NoColorSpace, 4),
    ]);
    textures.push(day, normal, specular);

    const sunDirection = sunDirectionVector();
    const earthGeometry = createEarthGeometry();
    const earthMaterial = createEarthMaterial({ day, normal, specular, sunDirection });
    const earth = new Mesh(earthGeometry, earthMaterial);
    earth.renderOrder = 0;
    disposables.push(earthGeometry, earthMaterial);

    const atmosphere = createAtmosphere(sunDirection);
    disposables.push(atmosphere.mesh.geometry, atmosphere.material);

    const stars = createStars();
    disposables.push(stars.points.geometry, stars.material);
    stars.material.uniforms.uPixelRatio.value = pixelRatio;

    const capMaterial = createVietnamHighlightMaterial({ day, normal, sunDirection });
    disposables.push(capMaterial);
    const mergedCapGeometry = await createSurfaceCap(options.highlight, capMaterial);
    if (disposed) { mergedCapGeometry.dispose(); throw new Error("Globe loading cancelled"); }
    disposables.push(mergedCapGeometry);
    const highlightMesh = new Mesh(mergedCapGeometry, capMaterial);
    highlightMesh.renderOrder = 2;

    const world = new Group();
    world.add(stars.points, earth, atmosphere.mesh, highlightMesh);
    const journeyPath = createJourneyPathLayer();
    disposables.push(journeyPath);
    world.add(journeyPath.group);

    let coastLines: LineSegments | null = null;
    if (options.coastlines) {
      const coastGeometry = new BufferGeometry();
      coastGeometry.setAttribute("position", new BufferAttribute(surfaceOutlineSegments(options.coastlines, COASTLINE_ALTITUDE, 0.45), 3));
      const coastMaterial = new LineBasicMaterial({
        color: new Color(COASTLINE_SLATE),
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      });
      disposables.push(coastGeometry, coastMaterial);
      coastLines = new LineSegments(coastGeometry, coastMaterial);
      coastLines.renderOrder = 2;
      world.add(coastLines);
    }

    const outlineGeometry = new LineSegmentsGeometry();
    outlineGeometry.setPositions(surfaceOutlineSegments(options.highlight, OUTLINE_ALTITUDE));
    disposables.push(outlineGeometry);
    // Opaque stroke color (opacity 1.0) prevents overlapping LineSegments2 round caps from beading at vertices.
    const outlineMaterial = new LineMaterial({
      color: new Color(OUTLINE_GOLD).getHex(),
      linewidth: 1.5,
      transparent: false,
      depthWrite: false,
    });
    disposables.push(outlineMaterial);
    const outline = new LineSegments2(outlineGeometry, outlineMaterial);
    outline.renderOrder = 3;
    outline.frustumCulled = false;
    world.add(outline);

    // Optional country boundaries
    let boundaryMesh: LineSegments2 | null = null;
    let boundaryGeometry: LineSegmentsGeometry | null = null;
    let boundaryMaterial: LineMaterial | null = null;
    let boundarySegmentsCount = 0;

    const removeCountryBoundaries = () => {
      if (boundaryMesh) {
        world.remove(boundaryMesh);
        boundaryMesh = null;
      }
      if (boundaryGeometry) {
        boundaryGeometry.dispose();
        boundaryGeometry = null;
      }
      if (boundaryMaterial) {
        boundaryMaterial.dispose();
        boundaryMaterial = null;
      }
      boundarySegmentsCount = 0;
    };
    cleanupBoundaries = removeCountryBoundaries;

    const setCountryBoundaries = (data: CountryBoundaryCollection | null) => {
      if (disposed) return;
      removeCountryBoundaries();
      if (!data || !Array.isArray(data.features) || data.features.length === 0) {
        invalidate();
        return;
      }

      const positions = countryBoundarySegments(data, BOUNDARY_ALTITUDE, 0.25, {
        suppressSharedVietnamEdges: true,
      });
      if (positions.length === 0) {
        invalidate();
        return;
      }

      boundarySegmentsCount = positions.length / 6;
      boundaryGeometry = new LineSegmentsGeometry();
      boundaryGeometry.setPositions(positions);

      const overviewZoom = overviewZoomForHeight(viewport.height);
      const relativeZoom = view.zoom - overviewZoom;
      const initialWidth = relativeZoom <= 0
        ? 0.75 + (0.75 - 0.55) * Math.max(-1, relativeZoom / 2.3)
        : Math.min(1.0, 0.75 + 0.1 * relativeZoom);

      boundaryMaterial = new LineMaterial({
        color: new Color(BOUNDARY_SLATE).getHex(),
        linewidth: Number(Math.max(0.55, Math.min(1.0, initialWidth)).toFixed(2)),
        transparent: false,
        depthTest: true,
        depthWrite: false,
      });
      boundaryMaterial.resolution.set(viewport.width, viewport.height);

      boundaryMesh = new LineSegments2(boundaryGeometry, boundaryMaterial);
      boundaryMesh.scale.setScalar(surfaceLayerRadii(viewToCameraPose(view, viewport).distanceToTarget).boundary / BOUNDARY_ALTITUDE);
      boundaryMesh.renderOrder = 2;
      boundaryMesh.frustumCulled = false;
      world.add(boundaryMesh);

      invalidate();
    };

    if (options.countryBoundaries) {
      setCountryBoundaries(options.countryBoundaries);
    }

    // Optional province boundaries
    let provinceMesh: LineSegments2 | null = null;
    let provinceGeometry: LineSegmentsGeometry | null = null;
    let provinceMaterial: LineMaterial | null = null;
    let provinceSegmentsCount = 0;

    const removeProvinceBoundaries = () => {
      if (provinceMesh) {
        world.remove(provinceMesh);
        provinceMesh = null;
      }
      if (provinceGeometry) {
        provinceGeometry.dispose();
        provinceGeometry = null;
      }
      if (provinceMaterial) {
        provinceMaterial.dispose();
        provinceMaterial = null;
      }
      provinceSegmentsCount = 0;
    };
    cleanupProvinceBoundaries = removeProvinceBoundaries;

    const setProvinceBoundaries = (data: ProvinceBoundaryCollection | null) => {
      if (disposed) return;
      removeProvinceBoundaries();
      if (!data || !Array.isArray(data.features) || data.features.length === 0) {
        invalidate();
        return;
      }

      const positions = provinceBoundarySegments(data, PROVINCE_ALTITUDE, 0.25);
      if (positions.length === 0) {
        invalidate();
        return;
      }

      provinceSegmentsCount = positions.length / 6;
      provinceGeometry = new LineSegmentsGeometry();
      provinceGeometry.setPositions(positions);

      const overviewZoom = overviewZoomForHeight(viewport.height);
      const relativeZoom = view.zoom - overviewZoom;
      const initialWidth = relativeZoom <= 0
        ? 0.55 + (0.55 - 0.45) * Math.max(-1, relativeZoom / 2.3)
        : Math.min(0.95, 0.55 + 0.08 * relativeZoom);

      provinceMaterial = new LineMaterial({
        color: new Color(PROVINCE_SLATE).getHex(),
        linewidth: Number(Math.max(0.45, Math.min(0.95, initialWidth)).toFixed(2)),
        transparent: false,
        depthTest: true,
        depthWrite: false,
      });
      provinceMaterial.resolution.set(viewport.width, viewport.height);

      provinceMesh = new LineSegments2(provinceGeometry, provinceMaterial);
      provinceMesh.scale.setScalar(surfaceLayerRadii(viewToCameraPose(view, viewport).distanceToTarget).province / PROVINCE_ALTITUDE);
      provinceMesh.renderOrder = 2; // Above cap fill (renderOrder 2 with smaller radius 1.0004), below gold outline (renderOrder 3, 1.0008)
      provinceMesh.frustumCulled = false;
      world.add(provinceMesh);

      invalidate();
    };

    if (options.provinceBoundaries) {
      setProvinceBoundaries(options.provinceBoundaries);
    }

    scene.add(world);

    // ----- camera / sizing -----
    const applyPose = () => {
      pose = viewToCameraPose(view, viewport);
      const radii = surfaceLayerRadii(pose.distanceToTarget);
      highlightMesh.scale.setScalar(radii.cap / 1.0004);
      capMaterial.uniforms.uSurfaceRadius.value = radii.cap;
      outline.scale.setScalar(radii.outline / OUTLINE_ALTITUDE);
      coastLines?.scale.setScalar(radii.coastline / COASTLINE_ALTITUDE);
      boundaryMesh?.scale.setScalar(radii.boundary / BOUNDARY_ALTITUDE);
      provinceMesh?.scale.setScalar(radii.province / PROVINCE_ALTITUDE);
      journeyPath.updateView(viewport.width, viewport.height, radii.outline);
      camera.position.set(...pose.position);
      camera.up.set(...pose.up);
      camera.lookAt(...pose.target);
      camera.fov = pose.fovDeg;
      camera.near = pose.near;
      camera.far = pose.far;
      camera.aspect = viewport.width / viewport.height;
      // Principal-point shift: the serialized view centre lands on the reading-area anchor.
      camera.setViewOffset(
        viewport.width,
        viewport.height,
        (0.5 - pose.anchor.x) * viewport.width,
        (0.5 - pose.anchor.y) * viewport.height,
        viewport.width,
        viewport.height,
      );
      camera.updateProjectionMatrix();

      if (boundaryMaterial) {
        const overviewZoom = overviewZoomForHeight(viewport.height);
        const relativeZoom = view.zoom - overviewZoom;
        const widthPx = relativeZoom <= 0
          ? 0.75 + (0.75 - 0.55) * Math.max(-1, relativeZoom / 2.3)
          : Math.min(1.0, 0.75 + 0.1 * relativeZoom);
        boundaryMaterial.linewidth = Number(Math.max(0.55, Math.min(1.0, widthPx)).toFixed(2));
      }

      if (provinceMaterial) {
        const overviewZoom = overviewZoomForHeight(viewport.height);
        const relativeZoom = view.zoom - overviewZoom;
        const widthPx = relativeZoom <= 0
          ? 0.55 + (0.55 - 0.45) * Math.max(-1, relativeZoom / 2.3)
          : Math.min(0.95, 0.55 + 0.08 * relativeZoom);
        provinceMaterial.linewidth = Number(Math.max(0.45, Math.min(0.95, widthPx)).toFixed(2));
      }
    };

    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      viewport = { width, height };
      renderer.setSize(width, height, false);
      outlineMaterial.resolution.set(width, height);
      boundaryMaterial?.resolution.set(width, height);
      provinceMaterial?.resolution.set(width, height);
      applyPose();
      invalidate();
    };

    // ----- on-demand render loop and the single flight owner -----
    const director = createCameraFlightDirector({
      getView: () => view,
      applyView: (next) => { view = next; applyPose(); },
      viewport: () => viewport,
      now: () => performance.now(),
      requestFrame: () => invalidate(),
      onFlightStart: arrival => journeyPath.startFlight(arrival),
      onFlightProgress: (arrival, progress) => journeyPath.progressFlight(arrival, progress),
      onFlightEnd: arrival => journeyPath.finishFlight(arrival),
    });
    cancelCurrentFlight = () => director.dispose();
    let capture: { intervals: number[]; render: number[]; last: number; sync: boolean } | null = null;

    const renderFrame = (now: number) => {
      frameHandle = 0;
      if (disposed || !visible) return;
      const flying = director.advance(now);
      const began = performance.now();
      renderer.render(scene, camera);
      for (const listener of listeners) listener();
      if (capture) {
        if (capture.sync) renderer.getContext().finish();
        capture.render.push(performance.now() - began);
        if (capture.last) capture.intervals.push(now - capture.last);
        capture.last = now;
      }
      if (flying) invalidate();
    };
    function invalidate() {
      if (!frameHandle && !disposed && visible) frameHandle = requestAnimationFrame(renderFrame);
    }

    const onContextLost = (event: Event) => {
      event.preventDefault();
      options.onContextLost?.();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    removeContextListener = () => canvas.removeEventListener("webglcontextlost", onContextLost);

    resize();
    renderer.render(scene, camera);

    const api: CinematicScene = {
      getViewport: () => createGlobeViewport(pose, viewport, view.zoom),
      subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
      setView: director.setView,
      getView: () => view,
      flyTo: director.flyTo,
      cancelFlight: director.cancelFlight,
      resize,
      setVisible(next) {
        visible = next;
        director.setVisible(next);
        if (!next && frameHandle) {
          cancelAnimationFrame(frameHandle);
          frameHandle = 0;
        } else if (next) invalidate();
      },
      setCountryBoundaries,
      setProvinceBoundaries,
      setJourneyPath(request) {
        if (!disposed && journeyPath.setRequest(request)) invalidate();
      },
      stats() {
        const gl = renderer.getContext();
        const debug = gl.getExtension("WEBGL_debug_renderer_info");
        let texels = 0;
        for (const texture of textures) {
          const image = texture.image as { width: number; height: number };
          texels += image.width * image.height * 4 * (4 / 3);
        }
        return {
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures,
          textureMiB: Number((texels / 1024 / 1024).toFixed(2)),
          pixelRatio,
          canvasPixels: { width: canvas.width, height: canvas.height },
          renderer: debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "unavailable",
          webgl: String(gl.getParameter(gl.VERSION)),
          countryBorderSegments: boundarySegmentsCount,
          provinceBorderSegments: provinceSegmentsCount,
          journeyPath: journeyPath.stats(),
        };
      },
      beginFrameCapture(captureOptions) {
        capture = { intervals: [], render: [], last: 0, sync: Boolean(captureOptions?.syncGpu) };
      },
      endFrameCapture() {
        const result: FrameCapture = { intervalsMs: capture?.intervals ?? [], renderMs: capture?.render ?? [], syncedGpu: Boolean(capture?.sync) };
        capture = null;
        return result;
      },
      projectGeo(lat, lng) {
        const [x, y, z] = geoToVector(lat, lng);
        const projected = new Vector3(x, y, z).project(camera);
        return { x: ((projected.x + 1) / 2) * viewport.width, y: ((1 - projected.y) / 2) * viewport.height, behind: projected.z > 1 };
      },
      dispose,
    };
    return api;
  } catch (error) {
    dispose();
    throw error;
  }
}
