import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Element to render, e.g. `article` for standalone content. */
  as?: 'div' | 'article' | 'section' | 'li' | 'aside';
  /** Animates the card (shifts toward its shadow) on hover. */
  hoverable?: boolean;
  children: ReactNode;
}

const CARD_CLASSES = [
  'rounded-none',
  'border-2',
  'border-ink',
  'bg-bg-elevated',
  'p-6',
  'shadow-[6px_6px_0_0_var(--ink)]',
];

const HOVERABLE_CLASSES = [
  'transition-[translate,box-shadow]',
  'duration-120',
  'ease-[ease]',
  'hover:translate-x-[3px]',
  'hover:translate-y-[3px]',
  'hover:shadow-[3px_3px_0_0_var(--ink)]',
];

export default function Card({ as: Element = 'div', hoverable = false, className, children, ...rest }: CardProps) {
  const classes = [...CARD_CLASSES, ...(hoverable ? HOVERABLE_CLASSES : []), className].filter(Boolean).join(' ');

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
}
