import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
}

export default function Eyebrow({ children }: EyebrowProps) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.06em] text-muted">
      <span className="inline-block size-2 shrink-0 rounded-full bg-accent" />
      {children}
    </p>
  );
}
