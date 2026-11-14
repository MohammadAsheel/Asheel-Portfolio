import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import Tag from '@/components/common/Tag';
import { withBase } from '@/lib/paths';
import { formatPostDate, type PostEntry, postSlug } from '@/lib/posts';
import { slugifyTag } from '@/lib/tags';

interface PostCardProps {
  post: PostEntry;
  latest?: boolean;
}

export default function PostCard({ post, latest = false }: PostCardProps) {
  const tags = post.data.tags.filter((tag) => slugifyTag(tag) !== '');

  return (
    <Card as="article" hoverable className="group">
      <Link className="block" to={`/blog/${postSlug(post)}/`}>
        <div>
          <h2 className="m-0 text-[clamp(1.45rem,3vw,2.05rem)] leading-none font-bold tracking-[0.005em] text-ink transition-colors duration-160 ease-[ease] group-hover:text-accent">
            {post.data.title}
          </h2>
          <div className="mt-3">
            <span className="inline-flex border-2 border-ink font-heading text-[0.95rem] leading-none font-bold tracking-[0.04em] shadow-[3px_3px_0_0_var(--ink)]">
              <span className="bg-bg px-3 py-1 text-ink">{formatPostDate(post.data.date)}</span>
              {latest && <span className="border-l-2 border-ink bg-accent px-3 py-1 text-bg">latest</span>}
            </span>
          </div>
          <p className="mt-4 leading-[1.55] text-[color-mix(in_srgb,var(--ink)_62%,var(--muted))]">
            {post.data.description}
          </p>
        </div>
      </Link>
      {tags.length > 0 && (
        <p className="mt-4 flex max-w-[680px] flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} href={withBase(`/tags/${slugifyTag(tag)}/`)}>
              #{tag}
            </Tag>
          ))}
        </p>
      )}
    </Card>
  );
}
