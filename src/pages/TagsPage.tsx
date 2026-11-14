import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import Tag from '@/components/common/Tag';
import Layout from '@/components/layout/Layout';
import { withBase } from '@/lib/paths';
import { getPublishedPosts } from '@/lib/posts';
import { SITE_NAME, TAGS_DESCRIPTION } from '@/lib/site';
import { getAllTags } from '@/lib/tags';

export default function TagsPage() {
  const tags = getAllTags(getPublishedPosts());

  return (
    <Layout title={`Tags — ${SITE_NAME}`} description={TAGS_DESCRIPTION} canonicalPath="/tags/">
      <main className="content-shell">
        <PageHero title="Tags" hideTitle>
          <Lede>{TAGS_DESCRIPTION}</Lede>
        </PageHero>

        <section className="section" aria-label="Tags">
          <div className="flex flex-wrap gap-[0.6rem]">
            {tags.map(({ slug, name, count }) => (
              <Tag key={slug} href={withBase(`/tags/${slug}/`)} size="lg">
                #{name} {count > 0 && <span className="font-normal opacity-70">{count}</span>}
              </Tag>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
