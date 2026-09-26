/**
 * Per-planet visual configuration matching the NASA Eyes on the Solar
 * System rendering style.
 *
 * Key differences from a naive approach:
 *
 * - Mercury: very rough, no atmosphere, slightly metallic (iron core)
 * - Venus: thick hazy atmosphere, smooth cloud-top surface
 * - Earth: moderate roughness, specular ocean highlights, vivid blue atmo
 * - Mars: very rough dusty surface, thin wisps of atmosphere
 * - Jupiter: smooth gas bands, slight sheen, no solid surface
 * - Saturn: similar to Jupiter but warmer tones, ring system handled separately
 * - Uranus: smooth icy surface, cyan-tinted atmosphere
 * - Neptune: deep blue, smooth, vivid blue atmosphere
 */

const PLANET_CONFIGS = {
  Mercury: {
    roughness: 0.95,
    metalness: 0.1,
    bumpScale: 0.02,
    atmosphere: null,
    emissiveIntensity: 0,
  },
  Venus: {
    roughness: 0.65,
    metalness: 0.0,
    bumpScale: 0.002,
    atmosphere: {
      color: [0.95, 0.88, 0.72], // pale cream cloud haze
      scale: 1.018,
      intensity: 0.5,
      power: 3.5,
      sunInfluence: 1.0,
    },
    emissiveIntensity: 0,
  },
  Earth: {
    roughness: 0.6,
    metalness: 0.05,
    bumpScale: 0.015,
    atmosphere: {
      color: [0.25, 0.55, 1.0], // vibrant Rayleigh blue
      scale: 1.02,
      intensity: 1.1,
      power: 3.5,
      sunInfluence: 1.0,
    },
    emissiveIntensity: 0,
  },
  Mars: {
    roughness: 0.95,
    metalness: 0.0,
    bumpScale: 0.025,
    atmosphere: {
      color: [0.75, 0.5, 0.35], // subtle dusty haze
      scale: 1.015,
      intensity: 0.3,
      power: 4.0,
      sunInfluence: 1.0,
    },
    emissiveIntensity: 0,
  },
  Jupiter: {
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.0,
    atmosphere: null, // Gas giant - atmosphere is the planet surface
    emissiveIntensity: 0,
  },
  Saturn: {
    roughness: 0.6,
    metalness: 0.0,
    bumpScale: 0.0,
    atmosphere: null, // Gas giant - atmosphere is the planet surface
    emissiveIntensity: 0,
  },
  Uranus: {
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.0,
    atmosphere: {
      color: [0.45, 0.85, 0.9], // subtle cyan limb haze
      scale: 1.018,
      intensity: 0.35,
      power: 3.5,
      sunInfluence: 1.0,
    },
    emissiveIntensity: 0,
  },
  Neptune: {
    roughness: 0.5,
    metalness: 0.0,
    bumpScale: 0.0,
    atmosphere: {
      color: [0.18, 0.38, 1.0], // deep azure limb haze
      scale: 1.018,
      intensity: 0.45,
      power: 3.5,
      sunInfluence: 1.0,
    },
    emissiveIntensity: 0,
  },
};

export default PLANET_CONFIGS;
