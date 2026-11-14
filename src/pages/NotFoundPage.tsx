import { Link } from 'react-router-dom';
import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { SITE_NAME } from '@/lib/site';

export default function NotFoundPage() {
  return (
    <Layout
      title={`404: Page Not Found — ${SITE_NAME}`}
      description="The page you are looking for does not exist or has been moved."
      canonicalPath="/404/"
      noIndex
    >
      <main className="content-shell">
        <PageHero title="404" eyebrow="page not found">
          <Lede>This page doesn&apos;t exist. It may have been moved or removed.</Lede>
          <div className="mt-7 flex flex-wrap gap-[0.6rem]">
            <Link className="not-found-button not-found-button-primary" to="/">
              Go home
            </Link>
            <Link className="not-found-button not-found-button-secondary" to="/projects/">
              View projects
            </Link>
          </div>
        </PageHero>
      </main>
    </Layout>
  );
}
