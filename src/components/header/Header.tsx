import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/common/Icon';
import { ANIMATED_UNDERLINE_CLASSES } from '@/lib/animatedUnderline';
import { getIcon } from '@/lib/icons';
import { GITHUB_URL, LINKEDIN_URL, SITE_NAME } from '@/lib/site';
import BrandLogo from './BrandLogo';
import ThemePicker from './ThemePicker';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onOpenSearch: () => void;
}

export default function Header({ onOpenSearch }: HeaderProps) {
  const { pathname } = useLocation();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }, [pathname]);

  const normalizedPath = pathname === '/' ? '/' : pathname.endsWith('/') ? pathname : `${pathname}/`;

  const navMenuItems = [
    {
      to: '/',
      title: 'Home',
      current: normalizedPath === '/',
    },
    {
      to: '/projects/',
      title: 'Projects',
      current: normalizedPath === '/projects/',
    },
    {
      to: '/experience/',
      title: 'Experience',
      current: normalizedPath === '/experience/',
    },
    {
      to: '/contact/',
      title: 'Contact',
      current: normalizedPath === '/contact/',
    },
  ];

  return (
    <header className="sticky top-0 z-20 border-b-5 border-ink bg-bg">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" to="/" aria-label={SITE_NAME}>
          <BrandLogo />
          <span>{SITE_NAME}</span>
        </Link>

        <div className={['nav-links', ...ANIMATED_UNDERLINE_CLASSES].join(' ')}>
          {navMenuItems.map((item) => (
            <Link key={item.to} to={item.to} aria-current={item.current ? 'page' : undefined}>
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-[0.45rem] max-[860px]:ml-auto">
          <div className="flex items-center gap-[0.45rem] max-sm:hidden">
            <button
              className="nav-icon-link"
              type="button"
              id="search-open"
              aria-label="Search (Ctrl+K)"
              onClick={onOpenSearch}
            >
              <Icon icon={getIcon('search')} />
            </button>
            <a className="nav-icon-link" href={GITHUB_URL} aria-label="GitHub" target="_blank" rel="noopener">
              <Icon icon={getIcon('brand-github')} />
            </a>
            <a className="nav-icon-link" href={LINKEDIN_URL} aria-label="LinkedIn" target="_blank" rel="noopener">
              <Icon icon={getIcon('brand-linkedin')} />
            </a>
          </div>
          <ThemePicker />
          <ThemeToggle />
        </div>

        <details className="hidden max-[860px]:flex" ref={mobileMenuRef}>
          <summary className="nav-menu-button" aria-label="Open navigation">
            <span />
            <span />
            <span />
          </summary>
          <div className="nav-menu-panel">
            {navMenuItems.map((item) => (
              <Link key={item.to} to={item.to} aria-current={item.current ? 'page' : undefined}>
                {item.title}
              </Link>
            ))}
          </div>
        </details>
      </nav>
    </header>
  );
}
