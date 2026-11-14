import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: string;
  className?: string;
}

export default function Icon({ icon, className, ...attributes }: IconProps) {
  const classes = ['size-5', className].filter(Boolean).join(' ');

  return (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon }}
      {...attributes}
    />
  );
}
