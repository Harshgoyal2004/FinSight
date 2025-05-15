import type { SVGProps } from 'react';

export function FinSightLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      aria-label="FinSight Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        d="M20,80 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50"
      />
      <circle cx="50" cy="50" r="18" fill="hsl(var(--background))" />
      <path
        d="M42,60 L42,40 L50,40 Q58,40 58,50 Q58,60 50,60 L42,60 M50,40 L58,40"
        stroke="hsl(var(--primary))"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
