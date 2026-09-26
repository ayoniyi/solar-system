import { Canvas } from "@react-three/fiber";
import Sun from "./components/Sun";
import { useState, useRef, useMemo, useEffect } from "react";
import Planet from "./components/Planet";
import { Stars, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import AnimationController from "./components/AnimationController";
import SaturnGroup from "./components/SaturnGroup";
import InfoPanel from "./components/InfoPanel";
import OrbitLine from "./components/OrbitLine";
import CameraController from "./components/CameraController";

function App() {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [surroundingLight, setSurroundingLight] = useState(false);
  const controlsRef = useRef();
  const pillRefs = useRef({});

  const planets = useMemo(
    () => [
      {
        name: "Mercury",
        radius: 0.25,
        distance: 3,
        speed: 0.5, // halved from 1.0
        tilt: 0.03,
        color: "#a8a29e",
      },
      {
        name: "Venus",
        radius: 0.45,
        distance: 4.5,
        speed: 0.4, // halved from 0.8
        tilt: 177.4,
        retrograde: true,
        color: "#fde047",
      },
      {
        name: "Earth",
        radius: 0.5,
        distance: 6,
        speed: 0.25, // halved from 0.5
        tilt: 23.4,
        color: "#38bdf8",
      },
      {
        name: "Mars",
        radius: 0.35,
        distance: 8,
        speed: 0.2, // halved from 0.4
        tilt: 25.2,
        color: "#f87171",
      },
      {
        name: "Jupiter",
        radius: 1.2,
        distance: 12,
        speed: 0.1, // halved from 0.2
        tilt: 3.1,
        color: "#f59e0b",
      },
      {
        name: "Uranus",
        radius: 0.7,
        distance: 20,
        speed: 0.05, // halved from 0.1
        tilt: 97.8,
        color: "#22d3ee",
      },
      {
        name: "Neptune",
        radius: 0.7,
        distance: 24,
        speed: 0.0375, // halved from 0.075
        tilt: 28.3,
        color: "#3b82f6",
      },
    ],
    [],
  );

  const allPlanets = useMemo(
    () => [
      ...planets.slice(0, 5),
      {
        name: "Saturn",
        radius: 1.0,
        distance: 16,
        speed: 0.15, // halved from 0.3
        tilt: 26.7,
        color: "#facc15",
      },
      ...planets.slice(5),
    ],
    [planets],
  );

  // Smoothly center the active planet pill in the horizontal scroll list
  useEffect(() => {
    const key = selected || "overview";
    const el = pillRefs.current[key];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selected]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <header className="app-header">
        <div className="header-top-row">
          <div className="brand-badge">
            {/* <span className="brand-title"> </span> */}
            <img src="/solar-logo.svg" alt="logo" />
          </div>

          <div className="header-actions">
            <button
              type="button"
              className={`btn-utility ${showOrbits ? "active" : ""}`}
              onClick={() => setShowOrbits((prev) => !prev)}
              title={showOrbits ? "Hide Orbit Lines" : "Show Orbit Lines"}
              aria-label="Toggle Orbit Lines"
            >
              <span className="btn-text">Orbits</span>
              <span
                className={`status-indicator ${showOrbits ? "on" : "off"}`}
              />
            </button>

            {/* Toggle Surrounding Lighting */}
            <button
              type="button"
              className={`btn-utility ${surroundingLight ? "active-gold" : ""}`}
              onClick={() => setSurroundingLight((prev) => !prev)}
              title={
                surroundingLight
                  ? "Turn Off Surrounding Light (Space Shadows)"
                  : "Turn On Surrounding Light (All Planets Fully Visible)"
              }
              aria-label="Toggle Surrounding Lighting"
            >
              <span className="btn-text">Light</span>
              <span
                className={`status-indicator ${
                  surroundingLight ? "on-gold" : "off"
                }`}
              />
            </button>

            <button
              type="button"
              className={`btn-pause ${isPaused ? "paused" : "running"}`}
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? "Resume simulation" : "Pause simulation"}
            >
              {/* <span>{isPaused ? "▶" : "⏸"}</span> */}
              <span className="btn-text">{isPaused ? "Resume" : "Pause"}</span>
              {/* <span
                className={`status-indicator ${isPaused ? "on-white" : "off"}`}
              /> */}
            </button>
          </div>
        </div>

        <div className="planet-selector-wrapper">
          <nav className="planet-selector-bar" aria-label="Planet Selector">
            <button
              ref={(el) => (pillRefs.current["overview"] = el)}
              type="button"
              className={`planet-pill ${selected === null ? "active" : ""}`}
              onClick={() => setSelected(null)}
            >
              <span className="planet-dot" style={{ background: "#60a5fa" }} />
              <span>Overview</span>
            </button>
            {allPlanets.map((p) => {
              const isSel = selected === p.name;
              return (
                <button
                  key={p.name}
                  ref={(el) => (pillRefs.current[p.name] = el)}
                  type="button"
                  className={`planet-pill ${isSel ? "active" : ""}`}
                  onClick={() => setSelected(p.name)}
                >
                  <span
                    className="planet-dot"
                    style={{ background: p.color || "#94a3b8" }}
                  />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Helpful gestures guidance on mobile/tablet */}
      {!selected && (
        <div className="gesture-hint">
          <span> Drag to orbit</span>
          <span>•</span>
          <span>Pinch to zoom</span>
        </div>
      )}

      {/*  WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 10, 20], fov: 45 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          antialias: true,
        }}
        linear={false}
      >
        <color attach="background" args={["#000000"]} />

        <AnimationController isPaused={isPaused} setElapsed={setElapsed} />

        <CameraController
          selected={selected}
          elapsed={elapsed}
          planets={allPlanets}
          controlsRef={controlsRef}
        />

        {/* Ambient lighting:
            When surroundingLight is OFF: 0.03 intensity for deep space shadows.
            When surroundingLight is ON: 1.2 ambient + 0.9 soft hemisphere light
            so all sides of all planets become fully visible and illuminated. */}
        <ambientLight intensity={surroundingLight ? 1.2 : 0.03} />
        {surroundingLight && (
          <hemisphereLight
            skyColor="#ffffff"
            groundColor="#475569"
            intensity={0.9}
          />
        )}

        <Sun />

        {showOrbits &&
          allPlanets.map((planet) => (
            <OrbitLine key={planet.name} distance={planet.distance} />
          ))}

        {planets.map((planet) => (
          <Planet
            key={planet.name}
            {...planet}
            elapsed={elapsed}
            isPaused={isPaused}
            onSelect={setSelected}
          />
        ))}

        <SaturnGroup
          onSelect={setSelected}
          elapsed={elapsed}
          isPaused={isPaused}
          speed={0.15}
        />

        <Stars
          radius={200}
          depth={80}
          count={10000}
          factor={4}
          saturation={0}
          fade
          speed={0.3}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          panSpeed={1.5}
          rotateSpeed={0.8}
          zoomSpeed={1.0}
          minDistance={selected ? 0.8 : 2}
          maxDistance={1000}
          autoRotate={!isPaused && !selected}
          autoRotateSpeed={0.4}
          enableDamping={true}
          dampingFactor={0.05}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
        />

        {/* Post-processing: Soft solar corona bloom with deep black space */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.85}
            luminanceSmoothing={0.15}
            intensity={1.5}
            radius={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {selected && (
        <InfoPanel planet={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;
