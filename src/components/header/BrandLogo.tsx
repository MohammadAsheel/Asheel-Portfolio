import { SITE_NAME } from '@/lib/site';

export default function BrandLogo() {
  const initial: string = SITE_NAME.charAt(0).toUpperCase();

  return (
    <span className="brand-logo" aria-hidden="true">
      {initial}
    </span>
  );
}
