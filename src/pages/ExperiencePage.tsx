import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import ExperienceSection from '@/components/experience/ExperienceSection';
import Layout from '@/components/layout/Layout';
import { withBase } from '@/lib/paths';
import { AUTHOR_NAME, SITE_URL } from '@/lib/site';

export default function ExperiencePage() {
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
        name: 'Experience',
        item: new URL(withBase('/experience/'), baseSite).toString(),
      },
    ],
  }).replace(/</g, '\\u003c');

  return (
    <Layout
      title={`Experience & Security Labs — ${AUTHOR_NAME}`}
      description="Undergraduate B.Tech Computer Science studies in Cyber Security, CodeAlpha Virtual Internship Program, and practical security lab projects."
      canonicalPath="/experience/"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <main className="content-shell">
        <PageHero title="Experience" eyebrow="education &amp; hands-on labs">
          <Lede>
            B.Tech Computer Science (Cyber Security) background, CodeAlpha internship, security labs, and continuous
            hands-on learning.
          </Lede>
        </PageHero>

        <section className="section grid gap-8" aria-label="Work experience">
          <ExperienceSection headingLevel="h2" />
        </section>
      </main>
    </Layout>
  );
}
