"use client";

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

export function Logo({ className = "h-8 w-auto", inverted = false }: LogoProps) {
  const primaryColor = inverted ? "#FFFFFF" : "#2D4A6F";
  const secondaryColor = inverted ? "#CCCCCC" : "#7A8FA6";
  const buildingDark = inverted ? "#FFFFFF" : "#3D5A80";
  const buildingMid = inverted ? "#DDDDDD" : "#4A6FA5";
  const buildingLight = inverted ? "#EEEEEE" : "#6B8FBF";
  const accentColor = inverted ? "#7CB3F0" : "#4A90D9";

  return (
    <svg
      viewBox="0 0 220 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Building icon - 3D isometric cube */}
      <g transform="translate(2, 5)">
        {/* Back face */}
        <path
          d="M20 8L35 16L35 32L20 24L20 8Z"
          fill={buildingLight}
        />
        {/* Left face */}
        <path
          d="M5 16L20 8L20 24L5 32L5 16Z"
          fill={buildingDark}
        />
        {/* Top face */}
        <path
          d="M5 16L20 8L35 16L20 24L5 16Z"
          fill={buildingMid}
        />
        {/* White stripe details */}
        <path
          d="M8 20L17 15.5L17 18L8 22.5L8 20Z"
          fill="white"
          opacity="0.6"
        />
        <path
          d="M23 15.5L32 20L32 22.5L23 18L23 15.5Z"
          fill="white"
          opacity="0.4"
        />

        {/* Swoosh/genie trail */}
        <path
          d="M3 36C3 36 12 28 22 32C32 36 42 24 42 24"
          stroke={accentColor}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Glowing dot */}
        <circle cx="42" cy="24" r="4" fill={accentColor} />
        <circle cx="42" cy="24" r="2" fill="white" opacity="0.6" />
      </g>

      {/* Text: StrataGenie */}
      <text
        x="54"
        y="33"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="26"
        fontWeight="600"
        letterSpacing="-0.5"
      >
        <tspan fill={primaryColor}>Strata</tspan>
        <tspan fill={secondaryColor}>Genie</tspan>
      </text>
    </svg>
  );
}
