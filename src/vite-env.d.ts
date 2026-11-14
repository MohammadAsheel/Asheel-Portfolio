/// <reference types="vite/client" />

declare module '*.md' {
  import type { ComponentType } from 'react';
  import type { PostFrontmatter, PostHeading } from '@/lib/posts';

  export const frontmatter: PostFrontmatter;
  export const headings: PostHeading[];
  const MDXContent: ComponentType<{ components?: Record<string, ComponentType<never>> }>;
  export default MDXContent;
}

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { PostFrontmatter, PostHeading } from '@/lib/posts';

  export const frontmatter: PostFrontmatter;
  export const headings: PostHeading[];
  const MDXContent: ComponentType<{ components?: Record<string, ComponentType<never>> }>;
  export default MDXContent;
}
