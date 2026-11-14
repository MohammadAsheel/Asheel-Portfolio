import type { ReactNode } from 'react';

interface LedeProps {
  className?: string;
  children: ReactNode;
}

const BASE_CLASSES = [
  'my-[0.67em]',
  'text-[clamp(1.6rem,3.2vw,2.1rem)]',
  'leading-[1.25]',
  'font-bold',
  'tracking-[0.005em]',
  'text-ink',
];

export default function Lede({ className, children }: LedeProps) {
  const classes = [...BASE_CLASSES, className].filter(Boolean).join(' ');
  return <h2 className={classes}>{children}</h2>;
}
