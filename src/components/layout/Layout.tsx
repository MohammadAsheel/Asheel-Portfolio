import { type ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/header/Header';
import Footer from '@/components/layout/Footer';
import SmartCursor from '@/components/layout/SmartCursor';
import SearchOverlay from '@/components/search/SearchOverlay';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

interface LayoutProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  children: ReactNode;
}

export default function Layout({
  title,
  description,
  canonicalPath = '/',
  ogType = 'website',
  noIndex = false,
  children,
}: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useDocumentMeta({ title, description, canonicalPath, ogType, noIndex });

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (event.key === 'Escape' && searchOpen) {
        event.preventDefault();
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <>
      <Header onOpenSearch={() => setSearchOpen(true)} />
      {children}
      <Footer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <SmartCursor />
    </>
  );
}
