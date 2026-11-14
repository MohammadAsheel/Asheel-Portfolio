import { useParams } from 'react-router-dom';
import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/posts/PostCard';
import { getPublishedPosts } from '@/lib/posts';
import { SITE_NAME } from '@/lib/site';
import { getAllTags, slugifyTag } from '@/lib/tags';
import NotFoundPage from './NotFoundPage';

export default function TagPage() {
  const { tag: slug = '' } = useParams<{ tag: string }>();
  const allPosts = getPublishedPosts();
  const tagInfo = getAllTags(allPosts).find((item) => item.slug === slug);

  if (!tagInfo) {
    return <NotFoundPage />;
  }

  const posts = allPosts.filter((post) => post.data.tags.some((item) => slugifyTag(item) === slug));

  return (
    <Layout
      title={`#${tagInfo.name} — ${SITE_NAME}`}
      description={`Posts tagged "${tagInfo.name}".`}
      canonicalPath={`/tags/${slug}/`}
    >
      <main className="content-shell">
        <PageHero title={`# ${tagInfo.name}`}>
          <Lede>
            {posts.length === 0
              ? 'Nothing here yet — check back soon.'
              : `${posts.length} post${posts.length === 1 ? '' : 's'} tagged ${tagInfo.name}.`}{' '}
          </Lede>
        </PageHero>

        {posts.length > 0 && (
          <section className="section" aria-label="Posts">
            <div className="grid gap-8">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
