import type { ReactNode } from 'react';
import Card from '@/components/common/Card';
import { ANIMATED_UNDERLINE_CLASSES } from '@/lib/animatedUnderline';

interface ExperienceEntryProps {
  id?: string;
  role: string;
  dates: string;
  location?: string;
  organization: {
    name: string;
    url?: string;
  };
  technologies?: string[];
  headingLevel?: 'h2' | 'h3';
  children: ReactNode;
}

const LINK_CLASSES: string[] = ['[&_a]:text-accent', ...ANIMATED_UNDERLINE_CLASSES];

export default function ExperienceEntry({
  id,
  role,
  dates,
  location,
  organization,
  technologies = [],
  headingLevel = 'h2',
  children,
}: ExperienceEntryProps) {
  const HeadingTag = headingLevel;

  return (
    <Card id={id} as="article" className="scroll-mt-24">
      <HeadingTag
        className={['m-0 text-[1.5em] leading-[1.2] font-bold tracking-[0.005em]', ...LINK_CLASSES].join(' ')}
      >
        {role},{' '}
        {organization.url ? (
          <a href={organization.url} target="_blank" rel="noopener">
            {organization.name}
          </a>
        ) : (
          organization.name
        )}
      </HeadingTag>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <span className="inline-block border-2 border-ink bg-accent px-3 py-1 font-heading text-[0.8rem] leading-none font-bold text-bg shadow-[2px_2px_0_0_var(--ink)]">
          {dates}
        </span>
        {location && (
          <span className="inline-block border-2 border-ink bg-bg px-3 py-1 font-mono text-[0.75rem] leading-none font-bold text-ink">
            {location}
          </span>
        )}
      </div>

      <div className={['mt-4 space-y-4 text-ink-soft', ...LINK_CLASSES].join(' ')}>{children}</div>

      {technologies.length > 0 && (
        <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0" aria-label={`${role} technologies`}>
          {technologies.map((tech) => (
            <li
              key={tech}
              className="border-2 border-ink bg-bg px-[0.6rem] py-[0.14rem] font-mono text-[0.7rem] leading-[1.4] font-bold text-ink"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
