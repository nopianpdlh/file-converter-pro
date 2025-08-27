import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#facc15", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#f59e0b", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <path d="M 25 70 L 25 90 L 75 90 L 75 70 Z" fill="#475569" />
      <path d="M 20 50 L 20 70 L 70 70 L 70 50 Z" fill="#64748b" />
      <path d="M 15 30 L 15 50 L 65 50 L 65 15 L 50 15 Z" fill="url(#grad3)" />
      <path
        d="M 50 15 L 65 30 L 65 50"
        fill="none"
        stroke="#fefce8"
        strokeWidth="2"
      />
    </svg>
  );
};
