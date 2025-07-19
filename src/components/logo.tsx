import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#logoGradient)"
      d="M50,5 C74.85,5 95,25.15 95,50 C95,74.85 74.85,95 50,95 C25.15,95 5,74.85 5,50 C5,25.15 25.15,5 50,5 Z M50,15 C30.67,15 15,30.67 15,50 C15,69.33 30.67,85 50,85 C69.33,85 85,69.33 85,50 C85,30.67 69.33,15 50,15 Z"
    />
    <path
      fill="hsl(var(--background))"
      d="M50,30 C58.28,30 65,36.72 65,45 C65,53.28 58.28,60 50,60 C41.72,60 35,53.28 35,45 C35,36.72 41.72,30 50,30 Z"
    />
    <path
      fill="url(#logoGradient)"
      d="M50,35 C55.52,35 60,39.48 60,45 C60,50.52 55.52,55 50,55 C44.48,55 40,50.52 40,45 C40,39.48 44.48,35 50,35 Z"
    />
  </svg>
);
