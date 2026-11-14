import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import Icon from '@/components/common/Icon';
import { ANIMATED_UNDERLINE_CLASSES } from '@/lib/animatedUnderline';
import { withoutBase } from '@/lib/paths';
import { PROJECT_LINK_DEFINITIONS, type ProjectLink } from '@/lib/projects';

export interface ProjectCardProps {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  category?: string;
  year?: string;
  isCooking?: boolean;
  headingLevel?: 'h2' | 'h3';
  activeTechnology?: string | null;
  onSelectTechnology?: (technology: string) => void;
}

function isExternalUrl(url: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(url);
}

export default function ProjectCard({
  id,
  name,
  description,
  technologies,
  links,
  category,
  year,
  isCooking = false,
  headingLevel: Heading = 'h2',
  activeTechnology = null,
  onSelectTechnology,
}: ProjectCardProps) {
  return (
    <Card id={id} as="article" hoverable className="flex scroll-mt-24 flex-col">
      {(category || year || isCooking) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="border-2 border-ink bg-bg px-[0.55rem] py-[0.12rem] font-mono text-[0.7rem] leading-[1.4] font-bold tracking-[0.04em] text-muted uppercase">
                {category}
              </span>
            )}
            {isCooking && (
              <span className="border-2 border-ink bg-accent px-[0.6rem] py-[0.14rem] font-mono text-[0.7rem] leading-[1.4] font-bold text-bg">
                In Progress
              </span>
            )}
          </div>
          {year && <span className="font-mono text-[0.78rem] font-bold text-muted">{year}</span>}
        </div>
      )}

      <Heading className="m-0 text-[1.5em] leading-[1.2] font-bold tracking-[0.005em] text-ink">{name}</Heading>

      <p className="mt-3 leading-[1.55] text-ink-soft">{description}</p>

      {technologies.length > 0 && (
        <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0" aria-label={`${name} technologies`}>
          {technologies.map((technology) => {
            const isActive = activeTechnology === technology;
            const badgeClasses = [
              'border-2 border-ink px-[0.6rem] py-[0.14rem] font-mono text-[0.7rem] leading-[1.4] font-bold transition-colors duration-120',
              isActive ? 'bg-accent text-bg' : 'bg-bg text-ink',
              onSelectTechnology ? 'cursor-pointer hover:bg-accent hover:text-bg' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li key={technology}>
                {onSelectTechnology ? (
                  <button
                    type="button"
                    className={badgeClasses}
                    aria-pressed={isActive}
                    onClick={() => onSelectTechnology(technology)}
                  >
                    {technology}
                  </button>
                ) : (
                  <span className={badgeClasses}>{technology}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div
        className={[
          'mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5 font-heading font-medium text-accent',
          ...ANIMATED_UNDERLINE_CLASSES,
        ].join(' ')}
      >
        {links.map((link) => {
          const definition = PROJECT_LINK_DEFINITIONS[link.kind];
          const label = link.label || definition.label;
          if (isExternalUrl(link.url)) {
            return (
              <a
                key={`${link.kind}-${link.url}`}
                className="inline-flex items-center gap-2"
                href={link.url}
                target="_blank"
                rel="noopener"
                aria-label={definition.getAriaLabel(name)}
              >
                <Icon icon={definition.icon} />
                {label}
              </a>
            );
          }

          return (
            <Link
              key={`${link.kind}-${link.url}`}
              className="inline-flex items-center gap-2"
              to={withoutBase(link.url)}
              aria-label={definition.getAriaLabel(name)}
            >
              <Icon icon={definition.icon} />
              {label}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
