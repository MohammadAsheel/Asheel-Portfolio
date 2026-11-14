import { useMemo, useState } from 'react';
import Card from '@/components/common/Card';
import Icon from '@/components/common/Icon';
import { getIcon } from '@/lib/icons';
import { PORTFOLIO_PROJECTS, PROJECT_CATEGORIES, type ProjectCategory } from '@/lib/portfolio';
import ProjectCard from './ProjectCard';

interface ProjectsSectionProps {
  featuredOnly?: boolean;
  enableFilters?: boolean;
  cardHeadingLevel?: 'h2' | 'h3';
  sectionClassName?: string;
}

export default function ProjectsSection({
  featuredOnly = false,
  enableFilters = true,
  cardHeadingLevel = 'h2',
  sectionClassName = 'section',
}: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const sourceProjects = useMemo(
    () => (featuredOnly ? PORTFOLIO_PROJECTS.filter((project) => project.featured) : PORTFOLIO_PROJECTS),
    [featuredOnly],
  );

  const availableCategories = useMemo(
    () =>
      PROJECT_CATEGORIES.filter(
        (category) => category === 'All' || sourceProjects.some((project) => project.category === category),
      ),
    [sourceProjects],
  );

  const availableTechnologies = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of sourceProjects) {
      if (selectedCategory !== 'All' && project.category !== selectedCategory) continue;
      for (const tech of project.technologies) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [...counts.keys()];
  }, [sourceProjects, selectedCategory]);

  const filteredProjects = useMemo(
    () =>
      sourceProjects.filter((project) => {
        if (selectedCategory !== 'All' && project.category !== selectedCategory) return false;
        if (selectedTech && !project.technologies.includes(selectedTech)) return false;
        return true;
      }),
    [sourceProjects, selectedCategory, selectedTech],
  );

  const hasActiveFilters = selectedCategory !== 'All' || selectedTech !== null;

  const handleCategoryClick = (category: 'All' | ProjectCategory): void => {
    setSelectedCategory(category);
    if (selectedTech) {
      const stillMatches = sourceProjects.some(
        (project) =>
          (category === 'All' || project.category === category) && project.technologies.includes(selectedTech),
      );
      if (!stillMatches) {
        setSelectedTech(null);
      }
    }
  };

  const handleTechToggle = (tech: string): void => {
    setSelectedTech((prev) => (prev === tech ? null : tech));
  };

  const resetFilters = (): void => {
    setSelectedCategory('All');
    setSelectedTech(null);
  };

  return (
    <section className={sectionClassName} aria-label={featuredOnly ? 'Featured projects' : 'Projects'}>
      {enableFilters && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter projects by category">
              {availableCategories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    data-project-category={category}
                    aria-pressed={isSelected}
                    onClick={() => handleCategoryClick(category)}
                    className={[
                      'cursor-pointer border-2 border-ink px-3.5 py-1.5 font-heading text-[0.9rem] font-bold shadow-[3px_3px_0_0_var(--ink)] transition-[translate,box-shadow,background-color,color] duration-120',
                      isSelected
                        ? 'translate-x-[1px] translate-y-[1px] bg-accent text-bg shadow-[2px_2px_0_0_var(--ink)]'
                        : 'bg-bg-elevated text-ink hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--ink)]',
                    ].join(' ')}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 font-mono text-[0.8rem] font-bold text-muted">
              <span>
                {filteredProjects.length} / {sourceProjects.length} shown
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex cursor-pointer items-center gap-1 border-2 border-ink bg-bg px-2.5 py-1 text-ink shadow-[2px_2px_0_0_var(--ink)] transition-colors hover:bg-accent hover:text-bg"
                >
                  <Icon icon={getIcon('x')} className="size-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by technology">
            <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[0.75rem] font-bold tracking-[0.04em] text-muted uppercase">
              <Icon icon={getIcon('filter')} className="size-3.5" />
              Tech:
            </span>
            {availableTechnologies.map((tech) => {
              const isSelected = selectedTech === tech;
              return (
                <button
                  key={tech}
                  type="button"
                  data-project-tech={tech}
                  aria-pressed={isSelected}
                  onClick={() => handleTechToggle(tech)}
                  className={[
                    'cursor-pointer border-2 border-ink px-2.5 py-0.5 font-mono text-[0.75rem] font-bold transition-colors duration-120',
                    isSelected ? 'bg-accent text-bg' : 'bg-bg-elevated text-ink hover:bg-accent hover:text-bg',
                  ].join(' ')}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-8">
          <p className="m-0 font-heading text-[1.05rem] font-semibold text-ink">
            No projects match the current category and technology filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="cursor-pointer border-2 border-ink bg-accent px-4 py-2 font-heading text-[0.9rem] font-bold text-bg shadow-[3px_3px_0_0_var(--ink)]"
          >
            Show all projects
          </button>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              technologies={project.technologies}
              links={project.links}
              category={project.category}
              year={project.year}
              isCooking={project.isCooking}
              headingLevel={cardHeadingLevel}
              activeTechnology={selectedTech}
              onSelectTechnology={enableFilters ? handleTechToggle : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
