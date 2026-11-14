import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { withoutBase } from '@/lib/paths';

interface TagProps {
  href: string;
  size?: 'sm' | 'lg';
  children: ReactNode;
}

export default function Tag({ href, size = 'sm', children }: TagProps) {
  const sizeClass = size === 'lg' ? 'px-3 py-[0.22rem] text-[0.78rem]' : 'px-[0.6rem] py-[0.14rem] text-[0.7rem]';

  return (
    <Link className={`tag ${sizeClass}`} to={withoutBase(href)}>
      {children}
    </Link>
  );
}
