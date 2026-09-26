/**
 * Fresnel-based atmosphere shader.
 *
 * Creates the thin, glowing limb you see around planets on the
 * NASA Eyes site. The effect is strongest at the edges (high Fresnel)
 * and fades out toward the center, just like real Rayleigh scattering.
 *
 * We also factor in the sun direction so the atmosphere is brightest
 * on the lit side and vanishes into the shadow, matching the
 * directional-lighting look NASA uses.
 */

export const AtmosphereVertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Normal in world space (uniform scaling ensures orthogonality)
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const AtmosphereFragmentShader = /* glsl */ `
  uniform vec3 atmosphereColor;
  uniform float intensity;
  uniform float power;
  uniform vec3 sunPosition;
  uniform float sunInfluence;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    vec3 L = normalize(sunPosition - vWorldPosition);

    // Fresnel view angle: 1.0 at center, 0.0 at outer limb
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - NdotV, power);

    // Soft edge fade: smoothly drops to 0 at the geometric boundary
    // to prevent any hard silhouette ring or cutoff artifacts.
    float edgeFade = smoothstep(0.0, 0.15, NdotV);

    // Sun illumination: atmosphere only glows when lit by the Sun.
    // Shadows are completely dark (no night-side ring).
    float NdotL = dot(N, L);
    float sunFactor = smoothstep(-0.08, 0.35, NdotL);
    sunFactor = mix(1.0, sunFactor, sunInfluence);

    // Sunset / Rayleigh scattering color shift at the terminator:
    // Low-angle sunlight through the atmosphere scatters blue and enriches orange/gold.
    vec3 sunsetColor = vec3(1.0, 0.45, 0.18);
    float sunsetMix = smoothstep(-0.08, 0.25, NdotL);
    vec3 currentAtmoColor = mix(sunsetColor, atmosphereColor, sunsetMix);

    float alpha = fresnel * edgeFade * intensity * sunFactor;

    if (alpha < 0.002) discard;

    gl_FragColor = vec4(currentAtmoColor, alpha);
  }
`;
