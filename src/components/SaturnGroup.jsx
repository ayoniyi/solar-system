import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from "react";
import {
  TextureLoader,
  SRGBColorSpace,
  DoubleSide,
  AdditiveBlending,
  BackSide,
  Color,
  RingGeometry,
  Vector3,
} from "three";
import PLANET_CONFIGS from "./PlanetConfigs";
import Atmosphere from "./Atmosphere";

const SATURN_TILT = 26.7; // real axial tilt, in degrees

/**
 * Saturn with realistic rings and atmosphere.
 *
 * The NASA Eyes Saturn has:
 * - Warm beige/gold textured surface with subtle horizontal bands
 * - Prominent ring system with color variation (inner bright, outer transparent)
 * - Ring shadow on the planet surface
 * - Thin atmospheric haze at the limb
 */
const SaturnGroup = ({ onSelect, elapsed, isPaused, speed = 0.15 }) => {
  const saturnTexture = useLoader(TextureLoader, "/textures/saturn.jpg");
  const ringTexture = useLoader(TextureLoader, "/textures/saturn_ring.png");

  const config = PLANET_CONFIGS.Saturn;

  useEffect(() => {
    saturnTexture.colorSpace = SRGBColorSpace;
    ringTexture.colorSpace = SRGBColorSpace;
    saturnTexture.anisotropy = 16;
    ringTexture.anisotropy = 16;
    saturnTexture.needsUpdate = true;
    ringTexture.needsUpdate = true;
  }, [saturnTexture, ringTexture]);

  const orbitRef = useRef();
  const spinRef = useRef();

  useFrame((state, delta) => {
    if (isPaused) return;

    const angle = elapsed * speed;
    orbitRef.current.position.x = Math.cos(angle) * 16;
    orbitRef.current.position.z = Math.sin(angle) * 16;
    spinRef.current.rotation.y += delta * 0.8;
  });

  const ringGeometry = useMemo(() => {
    const innerRadius = 1.25;
    const outerRadius = 2.35;
    const geo = new RingGeometry(innerRadius, outerRadius, 128, 8);
    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;
    const v3 = new Vector3();

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      // Map radial distance to the U coordinate of the 1D ring texture
      const u = (v3.length() - innerRadius) / (outerRadius - innerRadius);
      uvs.setXY(i, u, 0.5);
    }
    uvs.needsUpdate = true;
    return geo;
  }, []);

  return (
    <group ref={orbitRef}>
      <group ref={spinRef} rotation={[0, 0, (SATURN_TILT * Math.PI) / 180]}>
        {/* Saturn body */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect("Saturn");
          }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1.0, 64, 64]} />
          <meshStandardMaterial
            map={saturnTexture}
            roughness={config.roughness}
            metalness={config.metalness}
            envMapIntensity={0.3}
          />
        </mesh>

        {/* Ring system with true concentric radial UV mapping */}
        <mesh
          geometry={ringGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            map={ringTexture}
            side={DoubleSide}
            transparent
            roughness={0.7}
            metalness={0.0}
            opacity={0.92}
          />
        </mesh>

        {/* Atmosphere glow */}
        {config.atmosphere && (
          <Atmosphere
            radius={1.0}
            color={config.atmosphere.color}
            scale={config.atmosphere.scale}
            intensity={config.atmosphere.intensity}
            power={config.atmosphere.power}
            sunInfluence={config.atmosphere.sunInfluence}
          />
        )}
      </group>
    </group>
  );
};

export default SaturnGroup;
