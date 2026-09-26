import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Subtle orbital path ring matching NASA Eyes on the Solar System.
 * Renders as a crisp, delicate circular trajectory line around the Sun.
 */
const OrbitLine = ({ distance, color = "#6688aa", opacity = 0.18 }) => {
  const lineGeometry = useMemo(() => {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(theta) * distance,
          0,
          Math.sin(theta) * distance
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [distance]);

  return (
    <lineLoop geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </lineLoop>
  );
};

export default OrbitLine;
