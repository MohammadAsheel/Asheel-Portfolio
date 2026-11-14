import type { CSSProperties } from 'react';

interface Range {
  min: number;
  spread: number;
}

interface Particle {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
  shape: string;
}

interface FallingParticlesProps {
  family: string;
  shapes: Record<string, string>;
  count: number;
  size: Range;
  duration: Range;
  drift: Range;
  delaySpread: number;
  peakOpacity: number;
  colors?: string[];
  shapeColors?: Record<string, string[]>;
  stroke?: boolean;
}

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

export default function FallingParticles({
  family,
  shapes,
  count,
  size,
  duration,
  drift,
  delaySpread,
  peakOpacity,
  colors = ['var(--accent)'],
  shapeColors = {},
  stroke = false,
}: FallingParticlesProps) {
  const shapeNames: string[] = Object.keys(shapes);

  const particles: Particle[] = Array.from({ length: count }, (_, particleIndex: number): Particle => {
    const seed: number = particleIndex + 1;
    const direction: number = seed % 2 === 0 ? 1 : -1;
    const shapeName: string = shapeNames[seed % shapeNames.length];
    const palette: string[] = shapeColors[shapeName] ?? colors;
    return {
      left: (seed * 37) % 100,
      size: size.min + ((seed * 7) % size.spread),
      duration: duration.min + ((seed * 5) % duration.spread),
      delay: -((seed * 3) % delaySpread),
      drift: direction * (drift.min + ((seed * 11) % drift.spread)),
      color: palette[seed % palette.length],
      shape: shapeName,
    };
  });

  const containerStyle: CSSVars = { '--peak-opacity': peakOpacity };

  return (
    <div
      className={['falling-particles', stroke ? 'stroke' : ''].filter(Boolean).join(' ')}
      data-family={family}
      style={containerStyle}
      aria-hidden="true"
    >
      <svg width="0" height="0" className="absolute">
        {shapeNames.map((shapeName: string) => (
          <symbol key={shapeName} id={`${family}-${shapeName}`} viewBox="0 0 24 24">
            <path d={shapes[shapeName]} />
          </symbol>
        ))}
      </svg>
      {particles.map((particle: Particle, index: number) => {
        const particleStyle: CSSVars = {
          '--left': `${particle.left}%`,
          '--size': `${particle.size}px`,
          '--duration': `${particle.duration}s`,
          '--delay': `${particle.delay}s`,
          '--drift': `${particle.drift}px`,
          '--color': particle.color,
        };
        return (
          <svg key={index} className="particle" style={particleStyle}>
            <use href={`#${family}-${particle.shape}`} />
          </svg>
        );
      })}
    </div>
  );
}
