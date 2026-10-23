import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  buildTabletopMesh,
  disposeTabletopMesh,
  TABLETOP_BASE_Y,
  TABLETOP_TOP_Y,
} from "@/components/explorer/tabletop-mesh";
import { createMapProjection, getFootprintBounds } from "@/lib/explorer/projection";
import type {
  CameraView,
  MapFootprint,
  MarkerAnchor,
  ProjectedAnchor,
} from "@/lib/explorer/types";
import { CAMERA_BOUNDS } from "@/lib/explorer/url";

export type TabletopRuntimeOptions = {
  canvas: HTMLCanvasElement;
  footprint: MapFootprint;
  reducedMotion: boolean;
  onViewChange: (view: CameraView) => void;
  onLayout: (anchors: ProjectedAnchor[]) => void;
  onContextLost: () => void;
};

export type TabletopRuntimeStats = {
  frameCount: number;
  triangles: number;
  partCount: number;
  sideFacesVisible: boolean;
  reducedMotion: boolean;
  pixelRatio: number;
};

export type TabletopRuntime = {
  setAnchors: (anchors: readonly MarkerAnchor[]) => void;
  setView: (view: CameraView) => void;
  getView: () => CameraView;
  zoom: (factor: number) => void;
  rotate: (deltaAzimuth: number, deltaPolar: number) => void;
  reset: () => void;
  resize: () => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
  getStats?: () => TabletopRuntimeStats;
  simulateContextLoss?: () => void;
};

const TARGET_Y = (TABLETOP_TOP_Y + TABLETOP_BASE_Y) * 0.5;
const INITIAL_AZIMUTH = -0.24;
const INITIAL_POLAR = 0.86;
const CAMERA_FOV_DEG = 50;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round3(value: number): number {
  const r = Math.round(value * 1000) / 1000;
  return Object.is(r, -0) ? 0 : r;
}

function normalizeAzimuth(rad: number): number {
  let a = ((rad + Math.PI) % (Math.PI * 2));
  if (a < 0) a += Math.PI * 2;
  return a - Math.PI;
}

export async function createTabletopRuntime(
  options: TabletopRuntimeOptions,
): Promise<TabletopRuntime> {
  const { canvas, footprint, reducedMotion, onViewChange, onLayout, onContextLost } = options;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });

  const pixelRatio = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x132232);

  const bounds = getFootprintBounds(footprint);
  const projection = createMapProjection(bounds, 100);
  const tabletopGroup = buildTabletopMesh(footprint, projection);
  scene.add(tabletopGroup);

  tabletopGroup.updateMatrixWorld(true);
  const modelBox = new THREE.Box3().setFromObject(tabletopGroup);
  if (modelBox.isEmpty()) {
    modelBox.set(new THREE.Vector3(-40, 0, -50), new THREE.Vector3(40, 3, 50));
  }

  const spanX = Math.max(modelBox.max.x - modelBox.min.x, 40);
  const spanZ = Math.max(modelBox.max.z - modelBox.min.z, 40);
  const center = modelBox.getCenter(new THREE.Vector3());

  // Add a subtle museum platter beneath the raised Vietnam tabletop so depth & shadow are unmistakable
  const platterGeometry = new THREE.BoxGeometry(spanX + 36, 0.6, spanZ + 36);
  const platterMaterial = new THREE.MeshStandardMaterial({
    color: 0x192d40,
    roughness: 0.92,
    metalness: 0.04,
  });
  const platterMesh = new THREE.Mesh(platterGeometry, platterMaterial);
  platterMesh.position.set(center.x, -0.32, center.z);
  platterMesh.receiveShadow = true;
  scene.add(platterMesh);

  // Add subtle coastline contour lines along the top surface
  const edgeGeometries: THREE.BufferGeometry[] = [];
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x5c3a1e,
    transparent: true,
    opacity: 0.65,
  });
  tabletopGroup.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
      edgeGeometries.push(edges);
      const line = new THREE.LineSegments(edges, edgeMaterial);
      line.position.y = 0.015;
      mesh.add(line);
    }
  });

  // Lighting that highlights both the top plane (Y=3) and the extruded side walls (Y=0..3)
  const hemiLight = new THREE.HemisphereLight(0xfef6e6, 0x243447, 0.95);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
  keyLight.position.set(55, 85, 65);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 10;
  keyLight.shadow.camera.far = 260;
  const shadowExtent = Math.max(spanX, spanZ) * 0.75;
  keyLight.shadow.camera.left = -shadowExtent;
  keyLight.shadow.camera.right = shadowExtent;
  keyLight.shadow.camera.top = shadowExtent;
  keyLight.shadow.camera.bottom = -shadowExtent;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x9bc5e8, 0.85);
  rimLight.position.set(-60, 35, -55);
  scene.add(rimLight);

  const minTargetX = Math.max(-CAMERA_BOUNDS.maxTargetMagnitude, modelBox.min.x - 20);
  const maxTargetX = Math.min(CAMERA_BOUNDS.maxTargetMagnitude, modelBox.max.x + 20);
  const minTargetZ = Math.max(-CAMERA_BOUNDS.maxTargetMagnitude, modelBox.min.z - 20);
  const maxTargetZ = Math.min(CAMERA_BOUNDS.maxTargetMagnitude, modelBox.max.z + 20);

  const camera = new THREE.PerspectiveCamera(CAMERA_FOV_DEG, 16 / 9, 1, 600);
  const controls = new OrbitControls(camera, canvas);
  controls.minPolarAngle = CAMERA_BOUNDS.minPolar;
  controls.maxPolarAngle = CAMERA_BOUNDS.maxPolar;
  controls.minDistance = CAMERA_BOUNDS.minDistance;
  controls.maxDistance = CAMERA_BOUNDS.maxDistance;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.14;
  controls.screenSpacePanning = false;
  controls.rotateSpeed = 0.75;
  controls.zoomSpeed = 0.95;
  controls.panSpeed = 0.85;

  let anchors: readonly MarkerAnchor[] = [];
  let isVisible = true;
  let isDisposed = false;
  let rafId = 0;
  let frameCount = 0;
  let totalTriangles = 0;
  let partCount = 0;

  tabletopGroup.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      partCount += 1;
      const idx = mesh.geometry.getIndex();
      const pos = mesh.geometry.getAttribute("position");
      totalTriangles += idx ? idx.count / 3 : pos.count / 3;
    }
  });

  function computeDefaultView(): CameraView {
    const width = Math.max(canvas.clientWidth || 1280, 320);
    const height = Math.max(canvas.clientHeight || 720, 240);
    const aspect = width / height;
    const tanHalfFov = Math.tan(((CAMERA_FOV_DEG * Math.PI) / 180) * 0.5);
    const verticalDist = (spanZ * 0.64) / tanHalfFov;
    const horizontalDist = (spanX * 0.62) / (tanHalfFov * Math.max(aspect, 0.5));
    const distance = clamp(
      round3(Math.max(verticalDist, horizontalDist, 115)),
      CAMERA_BOUNDS.minDistance,
      CAMERA_BOUNDS.maxDistance,
    );

    return {
      azimuth: INITIAL_AZIMUTH,
      polar: INITIAL_POLAR,
      distance,
      targetX: clamp(round3(center.x), minTargetX, maxTargetX),
      targetZ: clamp(round3(center.z), minTargetZ, maxTargetZ),
    };
  }

  function clampTarget(): void {
    controls.target.x = clamp(controls.target.x, minTargetX, maxTargetX);
    controls.target.y = TARGET_Y;
    controls.target.z = clamp(controls.target.z, minTargetZ, maxTargetZ);
  }

  const spherical = new THREE.Spherical();
  const offset = new THREE.Vector3();

  function getView(): CameraView {
    clampTarget();
    offset.copy(camera.position).sub(controls.target);
    spherical.setFromVector3(offset);
    return {
      azimuth: round3(normalizeAzimuth(spherical.theta)),
      polar: round3(clamp(spherical.phi, CAMERA_BOUNDS.minPolar, CAMERA_BOUNDS.maxPolar)),
      distance: round3(clamp(spherical.radius, CAMERA_BOUNDS.minDistance, CAMERA_BOUNDS.maxDistance)),
      targetX: round3(controls.target.x),
      targetZ: round3(controls.target.z),
    };
  }

  function applyView(view: CameraView, notify: boolean): void {
    if (isDisposed) return;
    const tx = clamp(Number.isFinite(view.targetX) ? view.targetX : 0, minTargetX, maxTargetX);
    const tz = clamp(Number.isFinite(view.targetZ) ? view.targetZ : 0, minTargetZ, maxTargetZ);
    const polar = clamp(
      Number.isFinite(view.polar) ? view.polar : INITIAL_POLAR,
      CAMERA_BOUNDS.minPolar,
      CAMERA_BOUNDS.maxPolar,
    );
    const distance = clamp(
      Number.isFinite(view.distance) ? view.distance : 110,
      CAMERA_BOUNDS.minDistance,
      CAMERA_BOUNDS.maxDistance,
    );
    const azimuth = Number.isFinite(view.azimuth) ? normalizeAzimuth(view.azimuth) : INITIAL_AZIMUTH;

    // Flush any residual OrbitControls damping deltas before applying an explicit camera view
    const prevDamping = controls.enableDamping;
    controls.enableDamping = false;
    controls.update();
    controls.target.set(tx, TARGET_Y, tz);
    spherical.set(distance, polar, azimuth);
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    controls.update();
    controls.enableDamping = prevDamping;
    renderOnce();
    if (notify) {
      onViewChange(getView());
    }
  }

  const tempVec = new THREE.Vector3();

  function projectCurrentAnchors(): ProjectedAnchor[] {
    const width = Math.max(canvas.clientWidth || 1, 1);
    const height = Math.max(canvas.clientHeight || 1, 1);
    camera.updateMatrixWorld();

    return anchors.map((anchor) => {
      tempVec.set(anchor.position.x, TABLETOP_TOP_Y, anchor.position.z);
      tempVec.project(camera);
      const inFrustum =
        tempVec.z >= -1 &&
        tempVec.z <= 1 &&
        tempVec.x >= -1.05 &&
        tempVec.x <= 1.05 &&
        tempVec.y >= -1.05 &&
        tempVec.y <= 1.05;
      const screenX = (tempVec.x * 0.5 + 0.5) * width;
      const screenY = (-tempVec.y * 0.5 + 0.5) * height;

      return {
        ...anchor,
        screenX: round3(screenX),
        screenY: round3(screenY),
        visible: inFrustum,
      };
    });
  }

  function renderOnce(): void {
    if (isDisposed || !isVisible || document.hidden) return;
    clampTarget();
    renderer.render(scene, camera);
    frameCount += 1;
    onLayout(projectCurrentAnchors());
  }

  function scheduleRender(): void {
    if (isDisposed || !isVisible || document.hidden) return;
    if (rafId !== 0) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      renderOnce();
    });
  }

  const handleControlChange = () => {
    if (isDisposed) return;
    clampTarget();
    scheduleRender();
  };

  const handleControlEnd = () => {
    if (isDisposed) return;
    renderOnce();
    onViewChange(getView());
  };

  controls.addEventListener("change", handleControlChange);
  controls.addEventListener("end", handleControlEnd);

  function resize(): void {
    if (isDisposed) return;
    const width = Math.max(canvas.clientWidth || 1, 1);
    const height = Math.max(canvas.clientHeight || 1, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderOnce();
  }

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          resize();
        })
      : null;
  resizeObserver?.observe(canvas);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    } else if (isVisible) {
      renderOnce();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    onContextLost();
  };
  canvas.addEventListener("webglcontextlost", handleContextLost);

  // Initialize size and default camera fit
  const initialWidth = Math.max(canvas.clientWidth || 1280, 1);
  const initialHeight = Math.max(canvas.clientHeight || 720, 1);
  camera.aspect = initialWidth / initialHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(initialWidth, initialHeight, false);
  applyView(computeDefaultView(), false);

  function checkSideFacesVisible(): boolean {
    const view = getView();
    // Side walls span Y=0..3; when polar > 0.15 and distance is finite, side normals face the oblique camera
    const mainMesh = tabletopGroup.children.find(
      (c) => (c as THREE.Mesh).isMesh && c.userData.partId === "mainland",
    ) as THREE.Mesh | undefined;
    if (!mainMesh) return false;
    const norm = mainMesh.geometry.getAttribute("normal");
    const pos = mainMesh.geometry.getAttribute("position");
    if (!norm || !pos) return false;

    const vPos = new THREE.Vector3();
    const vNorm = new THREE.Vector3();
    const toCam = new THREE.Vector3();
    let facingSideVertices = 0;

    for (let i = 0; i < norm.count; i++) {
      vNorm.fromBufferAttribute(norm, i);
      if (Math.abs(vNorm.y) < 0.2) {
        vPos.fromBufferAttribute(pos, i);
        toCam.copy(camera.position).sub(vPos);
        if (toCam.dot(vNorm) > 0) {
          facingSideVertices += 1;
          if (facingSideVertices >= 12) return view.polar >= CAMERA_BOUNDS.minPolar;
        }
      }
    }
    return false;
  }

  return {
    setAnchors(nextAnchors: readonly MarkerAnchor[]) {
      anchors = nextAnchors;
      onLayout(projectCurrentAnchors());
    },
    setView(view: CameraView) {
      applyView(view, true);
    },
    getView,
    zoom(factor: number) {
      if (!Number.isFinite(factor) || factor <= 0) return;
      const current = getView();
      applyView(
        {
          ...current,
          distance: clamp(current.distance * factor, CAMERA_BOUNDS.minDistance, CAMERA_BOUNDS.maxDistance),
        },
        true,
      );
    },
    rotate(deltaAzimuth: number, deltaPolar: number) {
      const current = getView();
      applyView(
        {
          ...current,
          azimuth: normalizeAzimuth(current.azimuth + (Number.isFinite(deltaAzimuth) ? deltaAzimuth : 0)),
          polar: clamp(
            current.polar + (Number.isFinite(deltaPolar) ? deltaPolar : 0),
            CAMERA_BOUNDS.minPolar,
            CAMERA_BOUNDS.maxPolar,
          ),
        },
        true,
      );
    },
    reset() {
      applyView(computeDefaultView(), true);
    },
    resize,
    setVisible(visible: boolean) {
      isVisible = visible;
      if (!visible && rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (visible) {
        renderOnce();
      }
    },
    dispose() {
      if (isDisposed) return;
      isDisposed = true;
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      controls.removeEventListener("change", handleControlChange);
      controls.removeEventListener("end", handleControlEnd);
      controls.dispose();
      for (const eg of edgeGeometries) eg.dispose();
      edgeMaterial.dispose();
      platterGeometry.dispose();
      platterMaterial.dispose();
      disposeTabletopMesh(tabletopGroup);
      renderer.dispose();
    },
    getStats(): TabletopRuntimeStats {
      return {
        frameCount,
        triangles: totalTriangles,
        partCount,
        sideFacesVisible: checkSideFacesVisible(),
        reducedMotion,
        pixelRatio,
      };
    },
    simulateContextLoss() {
      const event = new Event("webglcontextlost", { cancelable: true });
      canvas.dispatchEvent(event);
    },
  };
}
