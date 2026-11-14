import { useEffect } from 'react';
import { withBase } from '@/lib/paths';
import { SITE_NAME, SITE_URL } from '@/lib/site';

interface DocumentMetaOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}

function setMetaTag(selector: string, attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function useDocumentMeta({
  title,
  description,
  canonicalPath = '/',
  ogType = 'website',
  noIndex = false,
}: DocumentMetaOptions): void {
  useEffect(() => {
    document.title = title;
    const baseSite = (import.meta.env.VITE_SITE_URL || SITE_URL).replace(/\/+$/, '');
    const formattedPath = withBase(canonicalPath);
    const canonicalUrl = new URL(formattedPath, baseSite).toString();
    const ogImageUrl = new URL(withBase('/assets/og.png'), baseSite).toString();

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const robotsContent = noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsContent);
    setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImageUrl);
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImageUrl);
  }, [title, description, canonicalPath, ogType, noIndex]);
}
