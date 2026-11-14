import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import rehypeShiki from '@shikijs/rehype';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { createCssVariablesTheme } from 'shiki';
import { visit } from 'unist-util-visit';
import { defineConfig, type Plugin } from 'vite';
import { PAGE_SEARCH_ENTRIES, type SearchEntry } from './src/lib/search.ts';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './src/lib/site.ts';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const USE_FIXTURE_POSTS = process.env.USE_FIXTURE_POSTS === 'true';
const RAW_BASE_PATH = process.env.BASE_PATH || '';
const NORMALIZED_BASE = RAW_BASE_PATH ? `${RAW_BASE_PATH.replace(/\/+$/, '')}/` : '/';
const BASE_PREFIX = NORMALIZED_BASE.replace(/\/+$/, '');
const ACTIVE_SITE_URL = process.env.SITE_URL || SITE_URL;

interface MdastImageNode {
  type: 'image';
  url: string;
  alt?: string | null;
  title?: string | null;
}

interface HastElementNode {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

interface HastTextNode {
  type: 'text';
  value: string;
}

type HastNode = HastElementNode | HastTextNode | { type: string; children?: HastNode[] };

function toEstreeExpression(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    return {
      type: 'ArrayExpression',
      elements: value.map(toEstreeExpression),
    };
  }
  if (value !== null && typeof value === 'object') {
    return {
      type: 'ObjectExpression',
      properties: Object.entries(value).map(([key, propValue]) => ({
        type: 'Property',
        kind: 'init',
        method: false,
        shorthand: false,
        computed: false,
        key: { type: 'Identifier', name: key },
        value: toEstreeExpression(propValue),
      })),
    };
  }
  return {
    type: 'Literal',
    value,
    raw: JSON.stringify(value),
  };
}

function remarkViteImages() {
  return (tree: { type: string; children: unknown[] }) => {
    const imports: unknown[] = [];
    let imageIndex = 0;

    visit(
      tree,
      'image',
      (node: MdastImageNode, index: number | undefined, parent: { children: unknown[] } | undefined) => {
        if (!parent || index === undefined) return;
        if (!node.url.startsWith('@/') && !node.url.startsWith('./') && !node.url.startsWith('../')) return;

        const identifier = `__mdx_img_${imageIndex++}`;
        imports.push({
          type: 'mdxjsEsm',
          value: `import ${identifier} from ${JSON.stringify(node.url)};`,
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ImportDeclaration',
                  specifiers: [{ type: 'ImportDefaultSpecifier', local: { type: 'Identifier', name: identifier } }],
                  source: { type: 'Literal', value: node.url, raw: JSON.stringify(node.url) },
                },
              ],
            },
          },
        });

        const attributes: unknown[] = [
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: identifier,
              data: {
                estree: {
                  type: 'Program',
                  sourceType: 'module',
                  body: [{ type: 'ExpressionStatement', expression: { type: 'Identifier', name: identifier } }],
                },
              },
            },
          },
          {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: node.alt ?? '',
          },
        ];

        if (node.title) {
          attributes.push({
            type: 'mdxJsxAttribute',
            name: 'title',
            value: node.title,
          });
        }

        parent.children[index] = {
          type: 'mdxJsxTextElement',
          name: 'img',
          attributes,
          children: [],
        };
      },
    );

    if (imports.length > 0) {
      tree.children.unshift(...imports);
    }
  };
}

function getHastText(node: HastNode): string {
  if (node.type === 'text' && 'value' in node) return node.value;
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(getHastText).join('');
  }
  return '';
}

function rehypeHeadings() {
  return (tree: { type: string; children: unknown[] }) => {
    const headings: Array<{ depth: number; slug: string; text: string }> = [];

    visit(tree, 'element', (node: HastElementNode) => {
      const match = /^h([1-6])$/.exec(node.tagName);
      if (!match) return;
      const slug = typeof node.properties?.id === 'string' ? node.properties.id : '';
      if (!slug) return;
      headings.push({
        depth: Number(match[1]),
        slug,
        text: getHastText(node).trim(),
      });
    });

    tree.children.unshift({
      type: 'mdxjsEsm',
      value: `export const headings = ${JSON.stringify(headings)};`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              source: null,
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'headings' },
                    init: toEstreeExpression(headings),
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
}

function withBasePath(pathname: string): string {
  return `${BASE_PREFIX}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function readBlogPosts(): Array<{
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  draft: boolean;
  body: string;
}> {
  const dir = path.join(ROOT_DIR, USE_FIXTURE_POSTS ? 'src/tests/fixtures/blog' : 'src/content/blog');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => /\.(md|mdx)$/i.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.(md|mdx)$/i, ''),
        title: String(data.title ?? file),
        description: String(data.description ?? ''),
        date: data.date ? new Date(data.date) : new Date(0),
        tags: Array.isArray(data.tags) ? [...new Set(data.tags.map(String))] : [],
        draft: Boolean(data.draft),
        body: content,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

function buildSearchJson(): string {
  const postEntries: SearchEntry[] = USE_FIXTURE_POSTS
    ? readBlogPosts().map((post) => ({
        title: post.title,
        description: post.description,
        tags: post.tags,
        body: post.body,
        url: `/blog/${post.slug}/`,
      }))
    : [];

  const entries: SearchEntry[] = [...PAGE_SEARCH_ENTRIES, ...postEntries].map((entry) => ({
    ...entry,
    url: withBasePath(entry.url),
  }));

  return JSON.stringify(entries);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildRssXml(): string {
  const siteRoot = new URL(withBasePath('/'), ACTIVE_SITE_URL).toString();
  const items = readBlogPosts()
    .map((post) => {
      const link = new URL(`blog/${post.slug}/`, siteRoot).toString();
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${post.date.toUTCString()}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(`RSS — ${SITE_NAME}`)}</title>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    `    <link>${escapeXml(siteRoot)}</link>`,
    '    <language>en-us</language>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function collectUsedTablerIcons(dir: string, out: Set<string>): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectUsedTablerIcons(fullPath, out);
    } else if (/\.(ts|tsx|md|mdx)$/i.test(entry.name)) {
      const text = fs.readFileSync(fullPath, 'utf-8');
      for (const match of text.matchAll(/getIcon\(\s*['"]([^'"]+)['"]\s*\)/g)) {
        out.add(match[1]);
      }
    }
  }
}

function tablerIconsSubsetPlugin(): Plugin {
  return {
    name: 'tabler-icons-subset',
    apply: 'build',
    load(id) {
      if (!id.replace(/\\/g, '/').endsWith('/@iconify-json/tabler/icons.json')) return null;

      const raw = JSON.parse(fs.readFileSync(id, 'utf-8')) as {
        icons: Record<string, { body: string }>;
        aliases?: Record<string, { parent: string }>;
      };
      const usedNames = new Set<string>();
      collectUsedTablerIcons(path.join(ROOT_DIR, 'src'), usedNames);

      const icons: Record<string, { body: string }> = {};
      const aliases: Record<string, { parent: string }> = {};

      for (const name of usedNames) {
        const alias = raw.aliases?.[name];
        if (alias) {
          aliases[name] = alias;
          if (raw.icons[alias.parent]) {
            icons[alias.parent] = raw.icons[alias.parent];
          }
        } else if (raw.icons[name]) {
          icons[name] = raw.icons[name];
        }
      }

      return JSON.stringify({ icons, aliases });
    },
  };
}

function seasonsStaticPlugin(): Plugin {
  return {
    name: 'seasons-static-outputs',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqPath = (req.url ?? '').split('?')[0];
        if (reqPath === withBasePath('/search.json') || reqPath === '/search.json') {
          res.setHeader('Content-Type', 'application/json');
          res.end(buildSearchJson());
          return;
        }
        if (reqPath === withBasePath('/rss.xml') || reqPath === '/rss.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(buildRssXml());
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'search.json', source: buildSearchJson() });
      this.emitFile({ type: 'asset', fileName: 'rss.xml', source: buildRssXml() });
    },
    closeBundle() {
      const distDir = path.join(ROOT_DIR, 'dist');
      const indexFile = path.join(distDir, 'index.html');
      const notFoundFile = path.join(distDir, '404.html');
      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, notFoundFile);
      }
    },
  };
}

const shikiTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--astro-code-',
  variableDefaults: {},
  fontStyle: true,
});

export default defineConfig({
  base: NORMALIZED_BASE,
  define: {
    'import.meta.env.VITE_USE_FIXTURE_POSTS': JSON.stringify(USE_FIXTURE_POSTS),
    'import.meta.env.VITE_SITE_URL': JSON.stringify(ACTIVE_SITE_URL),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    tablerIconsSubsetPlugin(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkViteImages],
        rehypePlugins: [rehypeSlug, rehypeHeadings, [rehypeShiki, { theme: shikiTheme }]],
      }),
    },
    tailwindcss(),
    react(),
    seasonsStaticPlugin(),
  ],
});
