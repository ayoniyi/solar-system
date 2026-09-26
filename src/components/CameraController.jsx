import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * NASA Eyes style Camera Controller with responsive viewport adaptation.
 *
 * Automatically and smoothly glides the camera towards any selected planet,
 * positioning the viewer on its sunlit side with cinematic framing.
 * Responsive framing dynamically adapts camera distance and vertical offset
 * on mobile / portrait screens so planets and orbits remain completely visible
 * and never obscured by mobile bottom sheets.
 */
const CameraController = ({ selected, elapsed, planets, controlsRef }) => {
  const { camera, size } = useThree();
  const isTransitioningRef = useRef(false);
  const transitionProgressRef = useRef(0);
  const startCamPosRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());
  const targetCamPosRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3());
  const prevSelectedRef = useRef(null);

  // Dynamic aspect ratio calculation for responsive framing
  const aspect = size.width / Math.max(size.height, 1);
  const isPortrait = aspect < 1.0;

  // When selection changes or orientation shifts, initiate smooth camera flight
  useEffect(() => {
    if (selected !== prevSelectedRef.current) {
      prevSelectedRef.current = selected;
      isTransitioningRef.current = true;
      transitionProgressRef.current = 0;

      startCamPosRef.current.copy(camera.position);
      if (controlsRef.current) {
        startTargetRef.current.copy(controlsRef.current.target);
      }

      if (selected) {
        const planet = planets.find((p) => p.name === selected);
        if (planet) {
          const angle = elapsed * planet.speed;
          const px = Math.cos(angle) * planet.distance;
          const pz = Math.sin(angle) * planet.distance;

          // On portrait/mobile screens, offset target slightly downward so the planet
          // is framed in the upper half of the screen, safely above the bottom info sheet
          const yOffset = isPortrait ? -planet.radius * 0.9 : 0;
          targetLookAtRef.current.set(px, yOffset, pz);

          // Position camera at an elevated angle facing the illuminated side
          const mobileDistMult = isPortrait ? 1.25 : 1.0;
          const viewDist = (planet.radius * 3.8 + 0.5) * mobileDistMult;
          const sunNormX = px / (planet.distance || 1);
          const sunNormZ = pz / (planet.distance || 1);

          targetCamPosRef.current.set(
            px - sunNormX * viewDist * 0.8 + sunNormZ * viewDist * 0.4,
            planet.radius * 1.6 + 0.4 + (isPortrait ? 0.3 : 0),
            pz - sunNormZ * viewDist * 0.8 - sunNormX * viewDist * 0.4
          );
        }
      } else {
        // Return to full solar system overview:
        // Scale distance dynamically so outer planets (Saturn, Uranus, Neptune)
        // fit comfortably within narrow portrait viewports
        const overviewScale = isPortrait
          ? Math.min(2.3, Math.max(1.0, 0.9 / Math.max(aspect, 0.4)))
          : 1.0;

        targetLookAtRef.current.set(0, 0, 0);
        targetCamPosRef.current.set(
          0,
          12 * overviewScale,
          22 * overviewScale
        );
      }
    }
  }, [selected, camera, controlsRef, elapsed, planets, isPortrait, aspect]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioningRef.current) {
      // Smooth cubic easing for cinematic glide
      transitionProgressRef.current += delta * 1.2;
      const t = Math.min(1.0, transitionProgressRef.current);
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(
        startCamPosRef.current,
        targetCamPosRef.current,
        easeT
      );
      controlsRef.current.target.lerpVectors(
        startTargetRef.current,
        targetLookAtRef.current,
        easeT
      );
      controlsRef.current.update();

      if (t >= 1.0) {
        isTransitioningRef.current = false;
      }
    } else if (selected) {
      // Keep following the moving planet in orbit while preserving user's manual orbit angle
      const planet = planets.find((p) => p.name === selected);
      if (planet) {
        const angle = elapsed * planet.speed;
        const currentTarget = controlsRef.current.target;
        const newX = Math.cos(angle) * planet.distance;
        const newZ = Math.sin(angle) * planet.distance;

        const dx = newX - currentTarget.x;
        const dz = newZ - currentTarget.z;

        // Move both target and camera together so orbital controls remain smooth
        currentTarget.x = newX;
        currentTarget.z = newZ;
        camera.position.x += dx;
        camera.position.z += dz;
        controlsRef.current.update();
      }
    }
  });

  return null;
};

export default CameraController;
