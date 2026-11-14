import { Link } from 'react-router-dom';
import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/posts/PostCard';
import { getPublishedPosts } from '@/lib/posts';
import { BLOG_DESCRIPTION, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <Layout title={`Blog — ${SITE_NAME}`} description={SITE_DESCRIPTION} canonicalPath="/blog/">
      <main className="content-shell">
        <PageHero title="Blog" hideTitle>
          <Lede>{BLOG_DESCRIPTION}</Lede>
          <Link className="tags-link" to="/tags/">
            Browse by tag <span aria-hidden="true">→</span>
          </Link>
        </PageHero>

        <section className="section" aria-label="Blog posts">
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet, check back soon.</p>
          ) : (
            <div className="grid gap-8">
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} latest={index === 0} />
              ))}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
