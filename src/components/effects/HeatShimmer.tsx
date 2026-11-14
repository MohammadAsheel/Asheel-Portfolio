import type { ReactNode } from 'react';

const FILTER_ID = 'heat-shimmer';

interface HeatShimmerProps {
  children: ReactNode;
}

export default function HeatShimmer({ children }: HeatShimmerProps) {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id={FILTER_ID} x="-2%" y="0" width="104%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.03" numOctaves={1} seed={4} result="noise">
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.004 0.03;0.006 0.045;0.004 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="heat-shimmer" data-shimmer>
        {children}
      </div>
    </>
  );
}
