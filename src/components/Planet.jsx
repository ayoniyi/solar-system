import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useMemo } from "react";
import {
  TextureLoader,
  SRGBColorSpace,
  Color,
} from "three";
import PLANET_CONFIGS from "./PlanetConfigs";
import Atmosphere from "./Atmosphere";

/**
 * Realistic planet component.
 *
 * Each planet gets its own material configuration (roughness, metalness,
 * bump-scale, emissive) plus a Fresnel atmosphere shell when applicable.
 *
 * The config data lives in PlanetConfigs.js so it's easy to tweak
 * individual planets without touching rendering code.
 */
const Planet = ({
  name,
  radius,
  distance,
  speed,
  elapsed,
  isPaused,
  onSelect,
  tilt = 0,
  retrograde = false,
  // Legacy props — kept so App.jsx doesn't break, but we now
  // read atmosphere config from PlanetConfigs instead.
  atmosphereColor: _legacyAtmoColor,
}) => {
  const config = PLANET_CONFIGS[name] || {
    roughness: 0.8,
    metalness: 0,
    bumpScale: 0,
    atmosphere: null,
    emissiveIntensity: 0,
  };

  const texture = useLoader(
    TextureLoader,
    `/textures/${name.toLowerCase()}.jpg`
  );

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  }, [texture]);

  // Emissive color (city lights for Earth, etc.)
  const emissiveColor = useMemo(
    () => (config.emissiveColor ? new Color(config.emissiveColor) : new Color(0x000000)),
    [config.emissiveColor]
  );

  const orbitRef = useRef();
  const spinRef = useRef();

  useFrame((state, delta) => {
    if (isPaused) return;

    spinRef.current.rotation.y += delta * 0.8 * (retrograde ? -1 : 1);

    const angle = elapsed * speed;
    orbitRef.current.position.x = Math.cos(angle) * distance;
    orbitRef.current.position.z = Math.sin(angle) * distance;
  });

  return (
    <group ref={orbitRef}>
      <group ref={spinRef} rotation={[0, 0, (tilt * Math.PI) / 180]}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(name);
          }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={config.roughness}
            metalness={config.metalness}
            // Use the texture itself as a bump map to add surface relief.
            // This is a common trick when you only have a color map:
            // the luminance variations create convincing bumps for
            // craters (Mercury), terrain (Earth/Mars), etc.
            bumpMap={config.bumpScale > 0 ? texture : null}
            bumpScale={config.bumpScale}
            emissive={emissiveColor}
            emissiveIntensity={config.emissiveIntensity}
            envMapIntensity={0.4}
          />
        </mesh>

        {/* Fresnel atmosphere shell — only for planets that have one */}
        {config.atmosphere && (
          <Atmosphere
            radius={radius}
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

export default Planet;
