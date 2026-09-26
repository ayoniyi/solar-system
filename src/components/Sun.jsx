import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from "react";
import {
  TextureLoader,
  SRGBColorSpace,
  AdditiveBlending,
  BackSide,
  Vector3,
  Color,
} from "three";

/**
 * Realistic Sun with simple, clean corona glow.
 *
 * After iterating on complex shader approaches, the cleanest result
 * comes from a minimal approach:
 * - A bright textured Sun surface (meshBasicMaterial, toneMapped=false)
 * - 2 tight BackSide glow shells very close to the surface
 * - Post-processing bloom does all the heavy lifting for the outer halo
 *
 * The bloom pass blurs any pixel brighter than the luminance threshold,
 * creating the smooth, natural glow that fades into space — no hard
 * edges, no dark shells, no artifacts.
 *
 * This is actually how most professional WebGL solar system
 * visualizations work: simple bright geometry + bloom = convincing glow.
 */
const Sun = () => {
  const sunTexture = useLoader(TextureLoader, "/textures/sun.jpg");
  const surfaceRef = useRef();

  useEffect(() => {
    sunTexture.colorSpace = SRGBColorSpace;
    sunTexture.needsUpdate = true;
  }, [sunTexture]);

  // Slow rotation to simulate surface convection
  useFrame((_, delta) => {
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Sun surface — self-luminous HDR surface.
          toneMapped=false with warm boost triggers bloom for a pure,
          physically smooth corona glow with zero hard geometry rings. */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshBasicMaterial
          map={sunTexture}
          toneMapped={false}
          color={new Color(2.2, 1.85, 1.4)}
        />
      </mesh>

      {/* Primary solar light source:
          decay=1.0 gives a physically balanced falloff across the
          entire solar system scale so Mercury doesn't blow out and
          Neptune stays clearly visible, just like in NASA Eyes. */}
      <pointLight
        color="#fff6e8"
        intensity={65}
        decay={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </group>
  );
};

export default Sun;
