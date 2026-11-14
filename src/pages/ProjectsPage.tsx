import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import ProjectsSection from '@/components/projects/ProjectsSection';
import { withBase } from '@/lib/paths';
import { AUTHOR_NAME, SITE_URL } from '@/lib/site';

export default function ProjectsPage() {
  const baseSite = (import.meta.env.VITE_SITE_URL || SITE_URL).replace(/\/+$/, '');
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: new URL(withBase('/'), baseSite).toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: new URL(withBase('/projects/'), baseSite).toString(),
      },
    ],
  }).replace(/</g, '\\u003c');

  return (
    <Layout
      title={`Projects — Cybersecurity, Python & Web | ${AUTHOR_NAME}`}
      description="Explore hands-on projects in network packet analysis, intrusion detection (NIDS), secure coding review, and machine learning by Asheel Mohammad."
      canonicalPath="/projects/"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <main className="content-shell">
        <PageHero title="Projects" eyebrow="selected work">
          <Lede>
            Hands-on projects combining cybersecurity, network packet analysis, intrusion detection, Python, SQL, and
            frontend development.
          </Lede>
        </PageHero>

        <ProjectsSection enableFilters />
      </main>
    </Layout>
  );
}
