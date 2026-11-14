import { CAPABILITY_PILLARS, PORTFOLIO_EXPERIENCE, PORTFOLIO_PROFILE, PORTFOLIO_PROJECTS } from './portfolio.ts';
import { CONTACT_DESCRIPTION, EXPERIENCE_DESCRIPTION, PROJECTS_DESCRIPTION, SITE_DESCRIPTION } from './site.ts';

export type SearchEntry = {
  title: string;
  description: string;
  tags: string[];
  body: string;
  url: string;
};

const PROJECT_SEARCH_ENTRIES: SearchEntry[] = PORTFOLIO_PROJECTS.map((project) => ({
  title: `${project.name} — Project`,
  description: project.description,
  tags: [project.category, ...project.technologies],
  body: `${project.category} (${project.year}). ${project.description} Stack: ${project.technologies.join(', ')}.`,
  url: `/projects/#${project.id}`,
}));

const EXPERIENCE_SEARCH_ENTRIES: SearchEntry[] = PORTFOLIO_EXPERIENCE.map((item) => ({
  title: `${item.role} — ${item.organization.name}`,
  description: item.summary.replace(/\*\*/g, ''),
  tags: item.technologies,
  body: `${item.dates} · ${item.location}. ${item.summary} ${item.details.join(' ')}`.replace(/\*\*/g, ''),
  url: `/experience/#${item.id}`,
}));

export const PAGE_SEARCH_ENTRIES: SearchEntry[] = [
  {
    title: 'Home',
    description: SITE_DESCRIPTION,
    tags: ['cybersecurity', 'ethical hacking', 'kali linux', 'burp suite', 'python', 'sql', 'frontend'],
    body: `${PORTFOLIO_PROFILE.headlineLead} ${PORTFOLIO_PROFILE.name}${PORTFOLIO_PROFILE.headlineMiddle} ${PORTFOLIO_PROFILE.headlineAccentWork} ${PORTFOLIO_PROFILE.headlineJoin} ${PORTFOLIO_PROFILE.headlineAccentApis}. ${PORTFOLIO_PROFILE.heroSummary} ${PORTFOLIO_PROFILE.aboutParagraphs.join(' ')} ${CAPABILITY_PILLARS.map((pillar) => `${pillar.title}: ${pillar.description} (${pillar.technologies.join(', ')})`).join(' ')}`,
    url: '/',
  },
  {
    title: 'Projects',
    description: PROJECTS_DESCRIPTION,
    tags: ['cybersecurity', 'python', 'sql', 'frontend', 'kali linux', 'burp suite'],
    body: PORTFOLIO_PROJECTS.map((p) => `${p.name}: ${p.description} (${p.technologies.join(', ')})`).join(' '),
    url: '/projects/',
  },
  {
    title: 'Experience',
    description: EXPERIENCE_DESCRIPTION,
    tags: ['b.tech', 'cyber security', 'labs', 'education'],
    body: PORTFOLIO_EXPERIENCE.map(
      (item) => `${item.role} (${item.organization.name}, ${item.dates}): ${item.summary}`,
    ).join(' '),
    url: '/experience/',
  },
  {
    title: 'Contact',
    description: CONTACT_DESCRIPTION,
    tags: ['collaborate', 'email', 'cybersecurity', 'community'],
    body: `${PORTFOLIO_PROFILE.availability}. Email: ${PORTFOLIO_PROFILE.email}. Collaboration areas: ${PORTFOLIO_PROFILE.preferredRoles.join(', ')}.`,
    url: '/contact/',
  },
  ...PROJECT_SEARCH_ENTRIES,
  ...EXPERIENCE_SEARCH_ENTRIES,
];
