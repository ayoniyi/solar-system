import React, { useState } from "react";

const PLANET_DATA = {
  Mercury: {
    type: "Terrestrial Planet",
    distance: "57.9M km (0.39 AU)",
    orbitalPeriod: "88 Earth days",
    diameter: "4,879 km",
    atmosphere: "Trace exosphere",
    description:
      "The smallest planet in our solar system and nearest to the Sun. Mercury is heavily cratered with dramatic temperature extremes between day and night.",
  },
  Venus: {
    type: "Terrestrial Planet",
    distance: "108.2M km (0.72 AU)",
    orbitalPeriod: "225 Earth days",
    diameter: "12,104 km",
    atmosphere: "Dense CO₂ & sulfuric acid",
    description:
      "Enveloped in thick toxic clouds trapping intense solar heat in a runaway greenhouse effect, making it the hottest planetary surface in the solar system.",
  },
  Earth: {
    type: "Terrestrial Planet",
    distance: "149.6M km (1.00 AU)",
    orbitalPeriod: "365.25 Earth days",
    diameter: "12,742 km",
    atmosphere: "78% N₂, 21% O₂",
    description:
      "Our home planet is the only known world with liquid water oceans on its surface, a protective atmosphere, and flourishing biological life.",
  },
  Mars: {
    type: "Terrestrial Planet",
    distance: "227.9M km (1.52 AU)",
    orbitalPeriod: "687 Earth days",
    diameter: "6,779 km",
    atmosphere: "Thin CO₂ (1% Earth)",
    description:
      "The Red Planet is a dusty desert world home to giant shield volcanoes like Olympus Mons and ancient dry riverbeds testifying to a wet past.",
  },
  Jupiter: {
    type: "Gas Giant",
    distance: "778.5M km (5.20 AU)",
    orbitalPeriod: "11.86 Earth years",
    diameter: "139,820 km",
    atmosphere: "Hydrogen & Helium",
    description:
      "More than twice as massive as all other solar system planets combined, Jupiter features dynamic swirling cloud belts and the iconic Great Red Spot.",
  },
  Saturn: {
    type: "Gas Giant",
    distance: "1.43B km (9.58 AU)",
    orbitalPeriod: "29.45 Earth years",
    diameter: "116,460 km",
    atmosphere: "Hydrogen & Helium",
    description:
      "Adorned with thousands of dazzling concentric ringlets composed of billions of pieces of water ice, dust, and rock, Saturn is a celestial jewel.",
  },
  Uranus: {
    type: "Ice Giant",
    distance: "2.87B km (19.2 AU)",
    orbitalPeriod: "84 Earth years",
    diameter: "50,724 km",
    atmosphere: "H₂, He & Methane",
    description:
      "An ice giant with an extreme 97.8° axial tilt that makes it rotate on its side. Atmospheric methane absorbs red light, giving it a calm cyan hue.",
  },
  Neptune: {
    type: "Ice Giant",
    distance: "4.50B km (30.1 AU)",
    orbitalPeriod: "164.8 Earth years",
    diameter: "49,244 km",
    atmosphere: "H₂, He & Methane",
    description:
      "Dark, frigid, and whipped by supersonic winds exceeding 2,000 km/h, Neptune is the most distant major planet, glowing with deep azure blue.",
  },
};

const InfoPanel = ({ planet, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const data = PLANET_DATA[planet] || {
    type: "Planetary Body",
    distance: "—",
    orbitalPeriod: "—",
    diameter: "—",
    atmosphere: "—",
    description: "Planetary body in the solar system.",
  };

  return (
    <aside
      className={`info-panel-container ${isMinimized ? "minimized" : ""}`}
      aria-label={`${planet} information`}
    >
      {/* Mobile top pull / collapse bar */}
      <div
        className="mobile-sheet-handle"
        onClick={() => setIsMinimized((prev) => !prev)}
        title={isMinimized ? "Expand details" : "Collapse details"}
      />

      <div className="panel-header">
        <div className="panel-header-left">
          <h2 className="planet-title">{planet}</h2>
          <span className="planet-type-badge">{data.type}</span>
        </div>

        <div className="panel-header-actions">
          {/* Collapse / Expand toggle button for mobile */}
          <button
            type="button"
            className="panel-icon-btn"
            onClick={() => setIsMinimized((prev) => !prev)}
            title={isMinimized ? "Expand details" : "Minimize details"}
            aria-label={isMinimized ? "Expand details" : "Minimize details"}
          >
            {isMinimized ? "▲" : "▼"}
          </button>

          {/* Close button returning to overview */}
          <button
            type="button"
            className="panel-icon-btn"
            onClick={onClose}
            title="Return to Solar Overview"
            aria-label="Close planet view"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main body content (collapsible on mobile) */}
      <div className="info-panel-body info-panel-scrollable">
        <p className="panel-description">{data.description}</p>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Diameter</div>
            <div className="stat-value">{data.diameter}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Distance to Sun</div>
            <div className="stat-value">{data.distance}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Orbit Period</div>
            <div className="stat-value">{data.orbitalPeriod}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Atmosphere</div>
            <div className="stat-value" title={data.atmosphere}>
              {data.atmosphere}
            </div>
          </div>
        </div>

        <button type="button" className="btn-overview" onClick={onClose}>
          <span>←</span>
          <span>Return to Overview</span>
        </button>
      </div>
    </aside>
  );
};

export default InfoPanel;
