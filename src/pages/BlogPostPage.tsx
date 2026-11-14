import { type AnchorHTMLAttributes, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Tag from '@/components/common/Tag';
import Layout from '@/components/layout/Layout';
import { ANIMATED_UNDERLINE_CLASSES } from '@/lib/animatedUnderline';
import { withBase, withoutBase } from '@/lib/paths';
import { formatPostDate, getPostBySlug } from '@/lib/posts';
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from '@/lib/site';
import { slugifyTag } from '@/lib/tags';
import NotFoundPage from './NotFoundPage';

function MdxLink({ href = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { pathname } = useLocation();
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  const basePath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const resolved = new URL(href, `https://example.invalid${basePath}`).pathname;
  return (
    <Link to={withoutBase(resolved)} {...rest}>
      {children}
    </Link>
  );
}

const MDX_COMPONENTS = {
  a: MdxLink as React.ComponentType<Record<string, unknown>>,
};

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);
  const proseRef = useRef<HTMLDivElement>(null);

  const sectionHeadings = post ? post.headings.filter((heading) => heading.depth === 2) : [];
  const firstHeadingSlug = sectionHeadings[0]?.slug ?? '';
  const [activeHeading, setActiveHeading] = useState<string>(firstHeadingSlug);

  useEffect(() => {
    const proseElement = proseRef.current;
    if (!proseElement) return;

    const headings = Array.from(proseElement.querySelectorAll<HTMLElement>('h2[id]'));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target instanceof HTMLElement) {
          setActiveHeading(visible.target.id);
        }
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [slug]);

  if (!post) {
    return <NotFoundPage />;
  }

  const tags = post.data.tags.filter((tag) => slugifyTag(tag) !== '');
  const articleProseClasses = ['article-prose', ...ANIMATED_UNDERLINE_CLASSES].join(' ');
  const baseSite = import.meta.env.VITE_SITE_URL || SITE_URL;

  const postSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.date.toISOString(),
    url: new URL(withBase(`/blog/${slug}/`), baseSite).toString(),
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: new URL(withBase('/'), baseSite).toString(),
    },
  }).replace(/</g, '\\u003c');

  const currentActiveSlug = sectionHeadings.some((h) => h.slug === activeHeading) ? activeHeading : firstHeadingSlug;
  const PostContent = post.Content;

  return (
    <Layout
      title={`${post.data.title} — ${SITE_NAME}`}
      description={post.data.description}
      canonicalPath={`/blog/${slug}/`}
      ogType="article"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: postSchema }} />
      <main className="content-shell">
        <div className="article-layout section">
          <aside className="article-toc" aria-label="Article sections">
            {sectionHeadings.length > 0 && (
              <nav className="grid border-l-[3px] border-ink">
                {sectionHeadings.map((heading) => (
                  <a
                    key={heading.slug}
                    href={`#${heading.slug}`}
                    data-heading-link={heading.slug}
                    aria-current={currentActiveSlug === heading.slug ? 'true' : undefined}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            )}
          </aside>

          <article className="min-w-0">
            <header className="mb-[2.35rem] border-b-4 border-ink pb-8">
              <p className="post-meta">
                <time dateTime={post.data.date.toISOString()}>{formatPostDate(post.data.date)}</time>
              </p>
              <h1 className="m-0 max-w-[22ch] text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold tracking-[0.005em] text-ink">
                {post.data.title}
              </h1>
              <p className="mt-[1.2rem] max-w-[680px] text-[1.18rem] leading-[1.7] text-[color-mix(in_srgb,var(--ink)_68%,var(--muted))]">
                {post.data.description}
              </p>
              {tags.length > 0 && (
                <p className="mt-4 flex max-w-[680px] flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Tag key={tag} href={withBase(`/tags/${slugifyTag(tag)}/`)}>
                      #{tag}
                    </Tag>
                  ))}
                </p>
              )}
            </header>
            <div ref={proseRef} className={articleProseClasses}>
              <PostContent components={MDX_COMPONENTS} />
            </div>
          </article>
        </div>
      </main>
    </Layout>
  );
}
