import { Link } from 'react-router-dom';
import { ANIMATED_UNDERLINE_CLASSES } from '@/lib/animatedUnderline';
import { AUTHOR_NAME, GITHUB_URL, JOB_TITLE, LINKEDIN_URL } from '@/lib/site';

export default function Footer() {
  const fullYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-ink px-5 py-7 font-heading text-[0.95rem] font-semibold text-ink">
      <div className="mx-auto flex max-w-(--max) flex-wrap items-center justify-between gap-4 max-sm:flex-col max-sm:text-center">
        <span>
          &copy; {fullYear} {AUTHOR_NAME} &mdash; <span className="text-muted">{JOB_TITLE}</span>
        </span>
        <nav
          className={['flex flex-wrap items-center gap-5', ...ANIMATED_UNDERLINE_CLASSES].join(' ')}
          aria-label="Footer"
        >
          <Link to="/projects/">Projects</Link>
          <Link to="/experience/">Experience</Link>
          <Link to="/contact/">Contact</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener">
            GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
