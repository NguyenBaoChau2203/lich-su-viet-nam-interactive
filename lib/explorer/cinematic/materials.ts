/**
 * Earth, atmosphere and star materials for the cinematic globe (classic WebGL2 `ShaderMaterial` pipeline).
 *
 * Adapted techniques (concepts, not copied code), both MIT:
 * - three.js `examples/webgpu_tsl_earth.html` (mrdoob/three.js@bae834d): day albedo + normal relief lit by one
 *   directional sun, Fresnel atmospheric contribution on the surface, and a separate outer atmosphere shell.
 *   That example uses `three/webgpu` TSL node materials; here the same layering is written as classic GLSL so
 *   it stays coherent with `three-globe`'s classic `Object3D`/`WebGLRenderer` pipeline.
 * - three-globe `example/custom-material` (vasturiano/three-globe@99d7cda): custom Earth material on a sphere.
 * Imagery credits live in `public/maps/globe/ATTRIBUTION.md` (Solar System Scope, CC BY 4.0).
 */
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Texture,
} from "three";
import { geoToVector } from "@/lib/explorer/cinematic/projection";

/** Editorial sun: from the east-north-east over the Pacific so the upper-right limb gleams and Biển Đông stays deep navy. */
export const SUN_GEO = { lat: 28, lng: 162 };
export const ATMOSPHERE_SHELL_RADIUS = 1.036;

export type EarthUniforms = {
  day: Texture;
  normal: Texture;
  specular: Texture;
  sunDirection: Vector3;
};

// The coarse global mesh and polygon cap have different triangle sagittas.
// Resolve depth on their actual concentric spheres, rather than allowing a
// shrinking cap lift to intersect the faceted Earth at local/legacy zooms.
// Both materials use the same ray and depth convention as the HTML projection.
const sphereSurface = /* glsl */ `
  uniform float uSurfaceRadius;
  uniform mat4 projectionMatrix;
  vec3 sphereSurfacePoint() {
    // Double-sided polygon caps must not reproject far-side fragments onto
    // the near hemisphere when resolving their spherical depth.
    if (dot(normalize(vWorldPosition), cameraPosition) <= uSurfaceRadius) discard;
    vec3 ray = normalize(vWorldPosition - cameraPosition);
    float b = dot(cameraPosition, ray);
    float discriminant = b * b - dot(cameraPosition, cameraPosition) + uSurfaceRadius * uSurfaceRadius;
    if (discriminant < 0.0) discard;
    vec3 surface = cameraPosition + ray * (-b - sqrt(max(0.0, discriminant)));
    vec4 clip = projectionMatrix * viewMatrix * vec4(surface, 1.0);
    gl_FragDepth = 0.5 * (clip.z / clip.w) + 0.5;
    return surface;
  }
`;

const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const earthFragment = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNormal;
  uniform sampler2D uSpecular;
  uniform vec3 uSunDirection;
  uniform vec3 uOceanColor;
  uniform vec3 uAtmosphereColor;
  uniform float uBump;
  uniform float uAmbient;
  uniform float uRim;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  ${sphereSurface}

  void main() {
    // Local frame from the sphere itself (east/north tangents) so the equirectangular normal map has no seam.
    vec3 surface = sphereSurfacePoint();
    vec3 p = normalize(surface);
    vec3 east = normalize(vec3(p.z, 0.0, -p.x));
    vec3 north = cross(p, east);
    vec3 tangentNormal = texture2D(uNormal, vUv).xyz * 2.0 - 1.0;
    tangentNormal.xy *= uBump;
    vec3 n = normalize(east * tangentNormal.x + north * tangentNormal.y + p * tangentNormal.z);

    vec3 sun = normalize(uSunDirection);
    vec3 view = normalize(cameraPosition - surface);

    vec3 day = texture2D(uDay, vUv).rgb;
    float water = smoothstep(0.35, 0.65, texture2D(uSpecular, vUv).r);
    // Soft-knee highlight roll-off in linear RGB keeps dark forest/river contrast while taming snow/desert peaks.
    float luminance = dot(day, vec3(0.2126, 0.7152, 0.0722));
    float shapedLum = pow(clamp(luminance * 1.8, 0.0, 1.0), 0.85) / (1.0 + luminance * 2.2);
    vec3 landFloor = vec3(0.013, 0.021, 0.023);
    vec3 landPeak = vec3(0.064, 0.088, 0.082);
    vec3 slateBase = mix(landFloor, landPeak, clamp(shapedLum * 2.3, 0.0, 1.0));
    vec3 land = mix(slateBase, day * vec3(0.20, 0.26, 0.22), 0.20);

    vec3 sea = mix(uOceanColor, day * vec3(0.02, 0.05, 0.09), 0.18);
    vec3 albedo = mix(land, sea, water);

    float diffuse = smoothstep(-0.16, 0.62, dot(n, sun));
    // Gentle western twilight keeps the top-left reading region dark and high-contrast.
    float twilight = smoothstep(-0.44, 0.24, dot(p, sun));
    vec3 color = albedo * (uAmbient + (1.0 - uAmbient) * diffuse) * (0.48 + 0.52 * twilight);

    // Subtle ocean sheen near the eastern lit horizon only (never a bright spot in the East Sea).
    vec3 halfway = normalize(sun + view);
    float glint = pow(max(dot(n, halfway), 0.0), 72.0) * water * diffuse;
    color += vec3(0.18, 0.36, 0.68) * glint * 0.05;

    // Fresnel inner limb glow in linear space: tight near the horizon so Biển Đông stays deep navy.
    float ndv = max(dot(p, view), 0.0);
    float fresnelCore = pow(1.0 - ndv, 9.5) * 0.85;
    float fresnelHalo = pow(1.0 - ndv, 5.5) * 0.14;
    float sunSide = smoothstep(-0.28, 0.62, dot(p, sun));
    color += (vec3(0.75, 0.90, 1.0) * fresnelCore + uAtmosphereColor * fresnelHalo) * sunSide * uRim;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createEarthMaterial(uniforms: EarthUniforms): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uDay: { value: uniforms.day },
      uSurfaceRadius: { value: 1 },
      uNormal: { value: uniforms.normal },
      uSpecular: { value: uniforms.specular },
      uSunDirection: { value: uniforms.sunDirection },
      uOceanColor: { value: new Color("#051322") },
      uAtmosphereColor: { value: new Color("#4d94ff") },
      uBump: { value: 1.75 },
      uAmbient: { value: 0.25 },
      uRim: { value: 1.0 },
    },
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
  });
}

const highlightVertex = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const highlightFragment = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNormal;
  uniform vec3 uSunDirection;
  uniform vec3 uGoldTint;
  uniform float uOpacity;
  varying vec3 vWorldPosition;

  ${sphereSurface}

  void main() {
    vec3 p = normalize(sphereSurfacePoint());
    // Equirectangular UV matching SphereGeometry rotated by -PI/2 around Y.
    float u = 0.5 + atan(p.x, p.z) / 6.28318530718;
    float v = 0.5 + asin(clamp(p.y, -1.0, 1.0)) / 3.14159265359;
    vec2 uv = vec2(u, v);

    vec3 day = texture2D(uDay, uv).rgb;
    vec3 tangentNormal = texture2D(uNormal, uv).xyz * 2.0 - 1.0;
    vec3 east = normalize(vec3(p.z, 0.0, -p.x));
    vec3 north = cross(p, east);
    vec3 n = normalize(east * tangentNormal.x * 1.6 + north * tangentNormal.y * 1.6 + p * tangentNormal.z);

    float rawLum = dot(day, vec3(0.2126, 0.7152, 0.0722));
    float diffuse = smoothstep(-0.10, 0.65, dot(n, normalize(uSunDirection)));
    vec3 darkBronze = vec3(0.036, 0.021, 0.007);
    vec3 warmSurface = mix(darkBronze, uGoldTint, clamp(rawLum * 2.4, 0.14, 0.88)) * (0.58 + 0.52 * diffuse);

    gl_FragColor = vec4(warmSurface, uOpacity);
    #include <colorspace_fragment>
  }
`;

export function createVietnamHighlightMaterial(uniforms: Pick<EarthUniforms, "day" | "normal" | "sunDirection">): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uDay: { value: uniforms.day },
      uSurfaceRadius: { value: 1.0004 },
      uNormal: { value: uniforms.normal },
      uSunDirection: { value: uniforms.sunDirection },
      uGoldTint: { value: new Color("#c89a4b") },
      uOpacity: { value: 0.66 },
    },
    vertexShader: highlightVertex,
    fragmentShader: highlightFragment,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

const atmosphereVertex = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

// The back faces of a slightly larger sphere show only where the view ray passes near the limb. The closest
// approach of the ray to the planet centre gives the height above the surface and the limb's sun direction.
const atmosphereFragment = /* glsl */ `
  uniform vec3 uSunDirection;
  uniform vec3 uColor;
  uniform float uShellRadius;
  uniform float uIntensity;
  varying vec3 vWorldPosition;

  void main() {
    vec3 rayDirection = normalize(vWorldPosition - cameraPosition);
    float closestT = -dot(cameraPosition, rayDirection);
    vec3 closest = cameraPosition + rayDirection * closestT;
    float height = clamp((length(closest) - 1.0) / (uShellRadius - 1.0), 0.0, 1.0);
    float core = pow(1.0 - height, 6.8);
    float halo = pow(1.0 - height, 2.4);
    float sunSide = smoothstep(-0.30, 0.58, dot(normalize(closest), normalize(uSunDirection)));
    float directional = 0.05 + 0.95 * sunSide;
    vec3 rimColor = mix(uColor, vec3(0.84, 0.93, 1.0), core * 0.72);
    float amount = (core * 0.95 + halo * 0.52) * directional * uIntensity;
    gl_FragColor = vec4(rimColor, clamp(amount, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

export function createAtmosphere(sunDirection: Vector3): { mesh: Mesh; material: ShaderMaterial } {
  const material = new ShaderMaterial({
    uniforms: {
      uSunDirection: { value: sunDirection },
      uColor: { value: new Color("#6ea8ff") },
      uShellRadius: { value: ATMOSPHERE_SHELL_RADIUS },
      uIntensity: { value: 1.05 },
    },
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    side: BackSide,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new Mesh(createAtmosphereGeometry(), material);
  mesh.renderOrder = 1;
  return { mesh, material };
}

export function sunDirectionVector(): Vector3 {
  const [x, y, z] = geoToVector(SUN_GEO.lat, SUN_GEO.lng);
  return new Vector3(x, y, z).normalize();
}

export function createEarthGeometry(): SphereGeometry {
  const geometry = new SphereGeometry(1, 192, 128);
  // Make longitude 0 face +Z (see projection.ts) so model space equals world space.
  geometry.rotateY(-Math.PI / 2);
  return geometry;
}

export function createAtmosphereGeometry(): SphereGeometry {
  return new SphereGeometry(ATMOSPHERE_SHELL_RADIUS, 128, 96);
}

/** Small deterministic generator so the sparse star field is identical on every load. */
function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const starsVertex = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  uniform float uPixelRatio;
  varying float vBrightness;
  void main() {
    vBrightness = aBrightness;
    // Rotation-only view: the sky never parallaxes and is never clipped by the dynamic near/far planes.
    vec4 clip = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
    gl_Position = clip.xyww;
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const starsFragment = /* glsl */ `
  varying float vBrightness;
  void main() {
    float distanceToCentre = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.05, distanceToCentre) * vBrightness;
    gl_FragColor = vec4(vec3(0.82, 0.88, 1.0), alpha);
    #include <colorspace_fragment>
  }
`;

export function createStars(count = 6000, seed = 20261023): { points: Points; material: ShaderMaterial } {
  const random = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);
  for (let index = 0; index < count; index++) {
    // Uniform on the sphere.
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(1 - z * z);
    positions.set([radius * Math.cos(angle), z, radius * Math.sin(angle)], index * 3);
    const roll = random();
    sizes[index] = roll > 0.985 ? 2.4 : roll > 0.9 ? 1.7 : 1.25;
    brightness[index] = 0.18 + random() ** 2.1 * 0.62;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aBrightness", new BufferAttribute(brightness, 1));
  const material = new ShaderMaterial({
    uniforms: { uPixelRatio: { value: 1 } },
    vertexShader: starsVertex,
    fragmentShader: starsFragment,
    // Drawn before the Earth and tested against depth so the planet occludes background stars.
    blending: AdditiveBlending,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = -10;
  return { points, material };
}
