import React, { useMemo } from "react";
import * as THREE from "three";
import {
  AtmosphereVertexShader,
  AtmosphereFragmentShader,
} from "./shaders/AtmosphereShader";

/**
 * Fresnel atmosphere shell.
 *
 * Renders as a slightly-larger-than-the-planet transparent sphere
 * using a custom shader that:
 *   1. Glows brightest at the limb (edges) via Fresnel
 *   2. Dims on the shadow side using sun direction
 *
 * This is the same technique NASA Eyes uses for Earth's blue haze,
 * Venus's thick yellow glow, Neptune's deep blue rim, etc.
 */
const Atmosphere = ({
  radius,
  color = [0.3, 0.6, 1.0],
  scale = 1.07,
  intensity = 1.0,
  power = 4.0,
  sunInfluence = 0.8,
}) => {
  const uniforms = useMemo(
    () => ({
      atmosphereColor: { value: new THREE.Vector3(...color) },
      intensity: { value: intensity },
      power: { value: power },
      sunPosition: { value: new THREE.Vector3(0, 0, 0) },
      sunInfluence: { value: sunInfluence },
    }),
    // Re-create only when the config identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color[0], color[1], color[2], intensity, power, sunInfluence]
  );

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        vertexShader={AtmosphereVertexShader}
        fragmentShader={AtmosphereFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default Atmosphere;
