import type { ReactNode } from 'react';

type Variant = 'flat' | 'raised' | 'interactive';

interface DemoCardProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

const RAISED_CLASSES = 'border-2 border-ink bg-bg-elevated shadow-[6px_6px_0_0_var(--ink)]';

const VARIANT_CLASSES: Record<Variant, string> = {
  flat: 'border border-line bg-bg-elevated',
  raised: RAISED_CLASSES,
  interactive: `${RAISED_CLASSES} transition-[translate,box-shadow] duration-120 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_var(--ink)]`,
};

export default function DemoCard({ variant = 'interactive', className, children }: DemoCardProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
