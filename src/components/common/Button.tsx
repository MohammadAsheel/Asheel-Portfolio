import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { withoutBase } from '@/lib/paths';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** `primary` is filled with the accent color, `secondary` is outlined on the card background. */
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

const BASE_CLASSES = [
  'inline-flex',
  'min-h-12',
  'items-center',
  'justify-center',
  'gap-2',
  'rounded-none',
  'border-2',
  'border-ink',
  'px-6',
  'py-3',
  'font-heading',
  'text-base',
  'font-bold',
  'shadow-[4px_4px_0_0_var(--ink)]',
  'transition-[translate,box-shadow]',
  'duration-120',
  'ease-[ease]',
  'hover:translate-x-[2px]',
  'hover:translate-y-[2px]',
  'hover:shadow-[2px_2px_0_0_var(--ink)]',
  'active:translate-x-[4px]',
  'active:translate-y-[4px]',
  'active:shadow-none',
];

const VARIANT_CLASSES = {
  primary: ['bg-accent', 'text-bg'],
  secondary: ['bg-bg-elevated', 'text-ink'],
};

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export default function Button({ href, variant = 'primary', className, children, ...rest }: ButtonProps) {
  const classes = [...BASE_CLASSES, ...VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');

  if (isExternalHref(href)) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} to={withoutBase(href)} {...rest}>
      {children}
    </Link>
  );
}
