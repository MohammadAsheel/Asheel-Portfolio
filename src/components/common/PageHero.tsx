import type { ReactNode } from 'react';
import Eyebrow from '@/components/common/Eyebrow';

interface PageHeroProps {
  title: string;
  hideTitle?: boolean;
  suppressHeading?: boolean;
  eyebrow?: string;
  children?: ReactNode;
}

export default function PageHero({
  title,
  hideTitle = false,
  suppressHeading = false,
  eyebrow,
  children,
}: PageHeroProps) {
  return (
    <section className="mx-auto max-w-(--max) px-5 pt-15 pb-1 max-sm:pt-11 max-sm:pb-7">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {!suppressHeading && (
        <h1
          className={
            hideTitle
              ? 'sr-only'
              : 'm-0 max-w-[14ch] text-[clamp(2.8rem,7vw,6rem)] leading-[0.92] font-bold tracking-[-0.07em] text-ink'
          }
        >
          {title}
        </h1>
      )}
      {children}
    </section>
  );
}
