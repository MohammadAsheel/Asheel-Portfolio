import type { ComponentType } from 'react';

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string | Date;
  tags?: string[];
  draft?: boolean;
}

export interface PostHeading {
  depth: number;
  slug: string;
  text: string;
}

export type MdxComponentProps = {
  components?: Record<string, ComponentType<Record<string, unknown>>>;
};

export interface PostModule {
  default: ComponentType<MdxComponentProps>;
  frontmatter?: PostFrontmatter;
  headings?: PostHeading[];
}

export interface PostEntry {
  slug: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    draft: boolean;
  };
  headings: PostHeading[];
  Content: PostModule['default'];
}

const contentModules = import.meta.glob<PostModule>('/src/content/blog/*.{md,mdx}', { eager: true });
const fixtureModules = import.meta.glob<PostModule>('/src/tests/fixtures/blog/*.{md,mdx}', { eager: true });

const activeModules: Record<string, PostModule> = import.meta.env.VITE_USE_FIXTURE_POSTS
  ? fixtureModules
  : contentModules;

function toPostEntry([filePath, module]: [string, PostModule]): PostEntry {
  const fileName = filePath.split('/').pop() ?? '';
  const slug = fileName.replace(/\.(md|mdx)$/i, '');
  const frontmatter = module.frontmatter;

  return {
    slug,
    data: {
      title: frontmatter?.title ?? slug,
      description: frontmatter?.description ?? '',
      date: frontmatter?.date ? new Date(frontmatter.date) : new Date(0),
      tags: [...new Set(frontmatter?.tags ?? [])],
      draft: frontmatter?.draft ?? false,
    },
    headings: module.headings ?? [],
    Content: module.default,
  };
}

const ALL_POSTS: PostEntry[] = Object.entries(activeModules).map(toPostEntry);

export function getAllPosts(): PostEntry[] {
  return ALL_POSTS;
}

export function getPublishedPosts(): PostEntry[] {
  return ALL_POSTS.filter((post) => !post.data.draft).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getPostBySlug(slug: string): PostEntry | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function postSlug(post: PostEntry): string {
  return post.slug;
}

export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
