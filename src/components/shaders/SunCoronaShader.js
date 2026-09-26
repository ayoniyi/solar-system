/**
 * Sun corona glow shader — FrontSide variant.
 *
 * Uses FrontSide rendering so the glow naturally fades to zero at the
 * edges of the sphere (where Fresnel = 1.0) and is strongest near the
 * center-facing surface (where Fresnel → 0). This eliminates the hard
 * circular edge artifacts that BackSide spheres create.
 *
 * The trick: we INVERT the Fresnel so the glow is strongest where
 * the surface faces the camera (center) and fades toward the silhouette
 * (edge). Combined with the sphere being larger than the Sun surface,
 * this creates a halo that smoothly fades into space.
 */

export const SunCoronaVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const SunCoronaFragmentShader = /* glsl */ `
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float falloff;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    // Fresnel: 0 at center (face-on), 1 at edges (silhouette)
    float fresnel = 1.0 - abs(dot(vViewDir, vNormal));

    // For BackSide: stronger at edges → bright ring → hard cutoff
    // For FrontSide: we want glow to fade AT the edges, so we use
    // a bell-curve shape — peak somewhere in the middle, fade at both
    // center and edge. This simulates volumetric scattering.
    float glow = pow(fresnel, falloff) * intensity;

    // Fade out near the pure edge to prevent hard silhouette
    float edgeFade = smoothstep(0.0, 0.15, 1.0 - fresnel);
    glow *= edgeFade;

    glow = clamp(glow, 0.0, 1.0);

    gl_FragColor = vec4(glowColor, glow);
  }
`;
