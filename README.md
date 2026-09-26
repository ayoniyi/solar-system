# 🪐 3D Solar System Explorer

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.181-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, photorealistic, real-time 3D simulation of our Solar System built with **React 19**, **Three.js**, **React Three Fiber (R3F)**, and **Vite**. Inspired by **NASA's "Eyes on the Solar System"**, this project combines physically-based rendering, custom GLSL atmospheric shaders, cinematic camera tracking, and a fully responsive glassmorphism UI designed for both mobile and desktop screens.

---

## 🌟 Key Features

### 🌌 1. Physically-Inspired Celestial Rendering
- **Solar Luminescence & Bloom**: Self-illuminated Sun geometry rendered with HDR color values, HDR point lighting with realistic decay, and an `EffectComposer` Bloom pass for a smooth, natural solar corona.
- **Detailed Planetary Surfaces**: High-resolution planetary textures with bump mapping for terrestrial worlds (Mercury, Earth, Mars) to emphasize craters and terrain relief.
- **Atmospheric Scattering (GLSL)**: Custom Fresnel atmospheric shell shaders (`Atmosphere.jsx` and `AtmosphereShader.js`) simulating Rayleigh scattering for Earth, cream haze for Venus, and cyan/azure limb glows for Uranus and Neptune.
- **Procedural Concentric Saturn Rings**: Custom radial UV-mapped `RingGeometry` accurately mapped to ring textures with transparency and double-sided shadow reception.

### 🎥 2. Cinematic Camera Tracking (`CameraController`)
- **Smooth Flight Transitions**: Glides the camera from solar overview to any planet using smooth cubic easing functions.
- **Orbital Following**: Once locked onto a world, the camera seamlessly matches its orbital motion while giving the user full rotational freedom around the planet.
- **Responsive Dynamic Framing**: Automatically calculates aspect ratios on portrait mobile devices, pulling back in overview mode to fit outer planet orbits and offsetting focus targets upward so celestial bodies remain clear of UI panels.

### 📱 3. Fully Responsive & Mobile-First UI
- **Horizontal Scroll Planet Bar**: A pill-shaped quick selector with smooth momentum scrolling, left/right edge fade indicators, color-coded planet dots, and auto-scroll centering.
- **Adaptive Info Panel**: Renders as a glassmorphism floating card on desktop and transforms into a collapsible bottom sheet on mobile screens.
- **Minimizable Drawer**: Mobile users can collapse the bottom sheet to a compact ~50px pill, opening up an unobstructed view of the 3D rotating planet.
- **Ergonomic Touch Controls**: Canvas gestures configured with `touch-action: none` and orbital damping (`dampingFactor: 0.05`) for mobile navigation without page bouncing.

### 🎛️ 4. Interactive Simulation Toggles
- **💫 Orbit Lines Toggle**: Show or hide the elliptical orbit trajectory paths around the Sun.
- **💡 Surrounding Light Toggle**: Toggle between deep-space mode (realistic terminator shadows and dark sides) and full ambient illumination mode (all sides and poles of every world clearly visible).
- **⏸ Pause / Resume**: Freeze orbital trajectories and axial rotations at any moment to study surface topography.
- **Reduced Orbital Speed**: Tuned orbital velocities (halved from initial defaults) allowing relaxed observation of planetary mechanics.

---

## 🪐 Planetary Reference Data

| Planet | Type | Distance from Sun | Orbital Period | Diameter | Key Atmosphere |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mercury** | Terrestrial | 57.9M km (0.39 AU) | 88 Earth days | 4,879 km | Trace exosphere |
| **Venus** | Terrestrial | 108.2M km (0.72 AU) | 225 Earth days | 12,104 km | Dense CO₂ & sulfuric acid |
| **Earth** | Terrestrial | 149.6M km (1.00 AU) | 365.25 Earth days | 12,742 km | 78% N₂, 21% O₂ |
| **Mars** | Terrestrial | 227.9M km (1.52 AU) | 687 Earth days | 6,779 km | Thin CO₂ (1% Earth) |
| **Jupiter** | Gas Giant | 778.5M km (5.20 AU) | 11.86 Earth years | 139,820 km | Hydrogen & Helium |
| **Saturn** | Gas Giant | 1.43B km (9.58 AU) | 29.45 Earth years | 116,460 km | Hydrogen & Helium |
| **Uranus** | Ice Giant | 2.87B km (19.2 AU) | 84 Earth years | 50,724 km | H₂, He & Methane |
| **Neptune** | Ice Giant | 4.50B km (30.1 AU) | 164.8 Earth years | 49,244 km | H₂, He & Methane |

---

## 🕹️ Controls Guide

### 📱 Touch Gestures (Mobile & Tablet)
- **1 Finger Drag**: Orbit and rotate around the Sun or the currently selected planet.
- **2 Finger Pinch**: Zoom in and out.
- **Tap Planet**: Tap directly on any 3D planetary body to fly toward it.
- **Tap Handle / Arrow**: Expand or collapse the bottom info drawer.

### 💻 Mouse & Keyboard (Desktop)
- **Left Click + Drag**: Rotate camera angle.
- **Right Click + Drag**: Pan camera position.
- **Scroll Wheel**: Zoom in and out.
- **Navbar Pills**: Click any planet name to initiate cinematic flight.
- **Overview Button / Close (`✕`)**: Return to the full solar system view.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **3D Graphics Engine**: [Three.js](https://threejs.org/)
- **Three.js React Integration**: [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Helper Components**: [@react-three/drei](https://github.com/pmndrs/drei) (`Stars`, `OrbitControls`)
- **Post-Processing**: [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) (`EffectComposer`, `Bloom`)
- **Styling**: Vanilla CSS with modern custom properties, glassmorphism filters, safe-area insets, and Google Fonts (`Audiowide` & `Poppins`).

---

## 📂 Project Structure

```bash
solar-system/
├── public/
│   ├── icon.svg                     # Browser favicon
│   ├── solar-logo.svg               # Header brand logo
│   └── textures/                    # High-res celestial texture maps
│       ├── sun.jpg
│       ├── mercury.jpg
│       ├── venus.jpg
│       ├── earth.jpg
│       ├── mars.jpg
│       ├── jupiter.jpg
│       ├── saturn.jpg
│       ├── saturn_ring.png          # 1D concentric ring gradient
│       ├── uranus.jpg
│       └── neptune.jpg
├── src/
│   ├── components/
│   │   ├── AnimationController.jsx  # Orbit time delta accumulator
│   │   ├── Atmosphere.jsx           # Fresnel atmospheric glow mesh
│   │   ├── CameraController.jsx     # Cinematic flight & planet tracking
│   │   ├── InfoPanel.jsx            # Responsive bottom sheet / floating HUD
│   │   ├── OrbitLine.jsx            # Orbital trajectory line loops
│   │   ├── Planet.jsx               # General planet renderer with bump map
│   │   ├── PlanetConfigs.js         # Material roughness, bump, & atmo configs
│   │   ├── SaturnGroup.jsx          # Saturn body + procedural ring system
│   │   ├── Sun.jsx                  # Solar surface + HDR pointLight
│   │   └── shaders/
│   │       ├── AtmosphereShader.js  # GLSL vertex & fragment shaders
│   │       └── SunCoronaShader.js   # Solar corona shader
│   ├── App.jsx                      # Main Canvas setup, state, & navigation
│   ├── index.css                    # Responsive CSS design system
│   └── main.jsx                     # React DOM entry point
├── index.html                       # HTML5 template with viewport configuration
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher recommended)
- `npm`, `yarn`, or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ayoniyi/solar-system.git
   cd solar-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` to launch the 3D simulation.

### Production Build

To build the optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## ⚙️ Configuration & Customization

- **Material & Shader Tweaks**: Open [`src/components/PlanetConfigs.js`](file:///Users/mac/Desktop/code/Build/projects/solar-gaden/src/components/PlanetConfigs.js) to fine-tune surface roughness, metalness, bump scale, or atmosphere colors.
- **Orbital Speeds & Distances**: Planetary parameters are structured cleanly in the `planets` array within [`src/App.jsx`](file:///Users/mac/Desktop/code/Build/projects/solar-gaden/src/App.jsx).
- **Lighting Levels**: Modify ambient and hemisphere lighting intensity states in [`src/App.jsx`](file:///Users/mac/Desktop/code/Build/projects/solar-gaden/src/App.jsx).

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute this codebase for personal, educational, or commercial projects.

---

## 🙏 Acknowledgments

- Planetary surface texture maps courtesy of **NASA / JPL-Caltech**, **Solar System Scope**, and **Celestia Motherlode**.
- Inspired by NASA's **[Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/)**.
