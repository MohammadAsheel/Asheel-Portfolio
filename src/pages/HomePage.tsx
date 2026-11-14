import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Highlight from '@/components/common/Highlight';
import Icon from '@/components/common/Icon';
import PageHero from '@/components/common/PageHero';
import TerminalPolaroid from '@/components/common/TerminalPolaroid';
import CopyEmailButton from '@/components/contact/CopyEmailButton';
import FallingPetals from '@/components/effects/FallingPetals';
import FallingSnow from '@/components/effects/FallingSnow';
import HeatShimmer from '@/components/effects/HeatShimmer';
import Sunlight from '@/components/effects/Sunlight';
import Layout from '@/components/layout/Layout';
import ProjectsSection from '@/components/projects/ProjectsSection';
import { ANIMATED_UNDERLINE_CLASSES } from '@/lib/animatedUnderline';
import { getIcon, type IconSource } from '@/lib/icons';
import { withBase } from '@/lib/paths';
import { CAPABILITY_PILLARS, PORTFOLIO_EXPERIENCE, PORTFOLIO_PROFILE, type CapabilityIconKey } from '@/lib/portfolio';
import { AUTHOR_NAME, GITHUB_URL, JOB_TITLE, LINKEDIN_URL, SITE_NAME, SITE_URL } from '@/lib/site';

function getCapabilityIcon(key: CapabilityIconKey): IconSource {
  switch (key) {
    case 'security':
      return getIcon('shield-lock');
    case 'python-sql':
      return getIcon('database');
    case 'frontend':
      return getIcon('device-desktop');
  }
}

export default function HomePage() {
  const baseSite = import.meta.env.VITE_SITE_URL || SITE_URL;
  const personSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    jobTitle: JOB_TITLE,
    email: PORTFOLIO_PROFILE.email,
    knowsAbout: [
      'Cybersecurity',
      'Ethical Hacking',
      'Penetration Testing',
      'Kali Linux',
      'Burp Suite',
      'Python',
      'SQL',
      'Frontend Development',
    ],
    url: new URL(withBase('/'), baseSite).toString(),
    sameAs: [GITHUB_URL, LINKEDIN_URL],
  }).replace(/</g, '\\u003c');

  return (
    <Layout
      title="Asheel Mohammad — Cyber Security & Frontend Portfolio"
      description="Portfolio of Asheel Mohammad — B.Tech Computer Science student specializing in Cyber Security, penetration testing, Python, SQL, and modern frontend development."
      canonicalPath="/"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
      <FallingSnow />
      <FallingPetals />
      <Sunlight />
      <HeatShimmer>
        <main className="content-shell">
          <PageHero title={SITE_NAME} suppressHeading eyebrow={PORTFOLIO_PROFILE.availability}>
            <div className="flex items-center justify-between gap-12 max-md:flex-col max-md:items-start max-md:gap-8">
              <div className="flex flex-col items-start gap-7">
                <h1 className="m-0 text-[clamp(2.7rem,4.4vw,4.1rem)] leading-[1.08] tracking-[-0.03em]">
                  {PORTFOLIO_PROFILE.headlineLead}{' '}
                  <Highlight handDrawn>{PORTFOLIO_PROFILE.headlineAccentName}</Highlight>
                  {PORTFOLIO_PROFILE.headlineMiddle}{' '}
                  <Highlight handDrawn>{PORTFOLIO_PROFILE.headlineAccentWork}</Highlight>{' '}
                  {PORTFOLIO_PROFILE.headlineJoin}{' '}
                  <Highlight handDrawn>{PORTFOLIO_PROFILE.headlineAccentApis}</Highlight>.
                </h1>

                <p className="m-0 max-w-[56ch] text-[1.12rem] leading-[1.65] text-ink-soft">
                  {PORTFOLIO_PROFILE.heroSummary}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button href={withBase('/projects/')}>
                    View projects
                    <Icon icon={getIcon('arrow-right')} />
                  </Button>
                  <Button href={withBase('/contact/')} variant="secondary">
                    Get in touch
                  </Button>
                </div>

                <dl className="m-0 grid w-full grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                  {PORTFOLIO_PROFILE.quickStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="border-2 border-ink bg-bg-elevated px-3.5 py-2.5 shadow-[3px_3px_0_0_var(--ink)]"
                    >
                      <dt className="font-mono text-[0.7rem] font-bold tracking-[0.05em] text-muted uppercase">
                        {stat.label}
                      </dt>
                      <dd className="m-0 mt-1 font-heading text-[0.9rem] font-bold text-ink">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <TerminalPolaroid className="w-full max-w-72 shrink-0 sm:max-w-96 md:max-w-72 max-md:self-center" />
            </div>
          </PageHero>

          <section className="section" aria-labelledby="about-heading">
            <h2
              id="about-heading"
              className="mt-8 mb-6 text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1] tracking-[-0.03em]"
            >
              About <Highlight handDrawn>me</Highlight>
            </h2>

            <Card>
              <div className="about-prose">
                {PORTFOLIO_PROFILE.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Card>

            <h2
              id="skills-heading"
              className="mt-16 mb-8 text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1] tracking-[-0.03em]"
            >
              What I <Highlight handDrawn>focus on</Highlight>
            </h2>

            <ul aria-labelledby="skills-heading" className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
              {CAPABILITY_PILLARS.map((pillar) => (
                <Card key={pillar.id} as="li" className="flex flex-col p-7">
                  <span className="inline-flex size-13 items-center justify-center border-2 border-ink bg-accent text-bg shadow-[3px_3px_0_0_var(--ink)]">
                    <Icon icon={getCapabilityIcon(pillar.iconKey)} className="size-6" />
                  </span>
                  <h3 className="m-0 mt-5 text-[1.35em] leading-[1.2] font-bold tracking-[0.005em] text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[1rem] leading-[1.55] text-ink-soft">{pillar.description}</p>
                  <ul
                    className="m-0 mt-auto flex list-none flex-wrap gap-2 pt-5 p-0"
                    aria-label={`${pillar.title} stack`}
                  >
                    {pillar.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border-2 border-ink bg-bg px-[0.55rem] py-[0.12rem] font-mono text-[0.7rem] leading-[1.4] font-bold text-ink"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </ul>
          </section>

          <div className="mx-auto max-w-(--max) px-5 pt-12" id="featured-projects">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="featured-projects-heading"
                  className="m-0 text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1] tracking-[-0.03em]"
                >
                  Featured <Highlight handDrawn>projects</Highlight>
                </h2>
                <p className="m-0 mt-2 text-ink-soft">
                  Filter by category or click a technology tag to narrow the list.
                </p>
              </div>
              <Link
                to="/projects/"
                className={[
                  'inline-flex items-center gap-1.5 font-heading font-bold text-accent',
                  ...ANIMATED_UNDERLINE_CLASSES,
                ].join(' ')}
              >
                All projects
                <Icon icon={getIcon('arrow-right')} className="size-4" />
              </Link>
            </div>
          </div>

          <ProjectsSection featuredOnly enableFilters cardHeadingLevel="h3" />

          <section className="section pt-6" aria-labelledby="experience-preview-heading">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <h2
                id="experience-preview-heading"
                className="m-0 text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1] tracking-[-0.03em]"
              >
                Background &amp; <Highlight handDrawn>learning</Highlight>
              </h2>
              <Link
                to="/experience/"
                className={[
                  'inline-flex items-center gap-1.5 font-heading font-bold text-accent',
                  ...ANIMATED_UNDERLINE_CLASSES,
                ].join(' ')}
              >
                Full details
                <Icon icon={getIcon('arrow-right')} className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {PORTFOLIO_EXPERIENCE.map((item) => (
                <Card key={item.id} as="article" className="flex flex-col p-6">
                  <span className="inline-block self-start border-2 border-ink bg-accent px-2.5 py-1 font-mono text-[0.72rem] leading-none font-bold text-bg">
                    {item.dates}
                  </span>
                  <h3 className="m-0 mt-4 text-[1.2em] leading-[1.25] font-bold text-ink">{item.role}</h3>
                  <p className="m-0 mt-1 font-heading text-[0.95rem] font-semibold text-accent">
                    {item.organization.name}
                  </p>
                  <p className="mt-3 mb-0 text-[0.95rem] leading-[1.55] text-ink-soft">{item.summary}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="section pb-12" aria-labelledby="contact-cta-heading">
            <Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
              <div className="max-w-[54ch]">
                <h2 id="contact-cta-heading" className="m-0 text-[clamp(1.7rem,2.6vw,2.2rem)] leading-[1.15]">
                  Let&apos;s <Highlight handDrawn>connect</Highlight>
                </h2>
                <p className="m-0 mt-3 text-ink-soft">
                  Always open to learning, collaborating on projects, and connecting with people in cybersecurity and
                  tech.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href={withBase('/contact/')}>
                  Contact page
                  <Icon icon={getIcon('arrow-right')} />
                </Button>
                <CopyEmailButton email={PORTFOLIO_PROFILE.email} />
              </div>
            </Card>
          </section>
        </main>
      </HeatShimmer>
    </Layout>
  );
}
