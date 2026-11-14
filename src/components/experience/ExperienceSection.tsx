import { PORTFOLIO_EXPERIENCE } from '@/lib/portfolio';
import ExperienceEntry from './ExperienceEntry';

function renderFormatted(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

interface ExperienceSectionProps {
  headingLevel?: 'h2' | 'h3';
}

export default function ExperienceSection({ headingLevel = 'h2' }: ExperienceSectionProps) {
  return (
    <>
      {PORTFOLIO_EXPERIENCE.map((item) => (
        <ExperienceEntry
          key={item.id}
          id={item.id}
          role={item.role}
          organization={item.organization}
          dates={item.dates}
          location={item.location}
          technologies={item.technologies}
          headingLevel={headingLevel}
        >
          <p className="font-semibold text-ink">{renderFormatted(item.summary)}</p>
          {item.details.map((paragraph) => (
            <p key={paragraph}>{renderFormatted(paragraph)}</p>
          ))}
        </ExperienceEntry>
      ))}
    </>
  );
}
