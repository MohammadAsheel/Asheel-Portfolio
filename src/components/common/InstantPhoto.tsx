import type { HTMLAttributes } from 'react';

interface InstantPhotoProps extends HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
  /** Text on the chin of the photo. */
  caption?: string;
  /** Intrinsic width (px) hint for the image. */
  width?: number;
  loading?: 'eager' | 'lazy';
  /** CSS `object-position` for the crop, e.g. `50% 10%` to keep a face near the top. */
  position?: string;
}

const FRAME_CLASSES = [
  'relative',
  'm-0',
  'aspect-[8847/10752]',
  'rotate-2',
  'border-2',
  'border-ink',
  'bg-bg-elevated',
  'shadow-[6px_6px_0_0_var(--ink)]',
];

export default function InstantPhoto({
  src,
  alt,
  caption,
  width = 768,
  loading = 'lazy',
  position = '50% 40%',
  className,
  ...rest
}: InstantPhotoProps) {
  const classes = [...FRAME_CLASSES, className].filter(Boolean).join(' ');

  return (
    <figure className={classes} {...rest}>
      <span
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 border-2 border-ink bg-accent"
        aria-hidden="true"
      />
      <img
        src={src}
        alt={alt}
        width={width}
        loading={loading}
        className="absolute top-[5.6%] left-[5.4%] aspect-[7894/7680] w-[89.2%] border-2 border-ink object-cover"
        style={{ objectPosition: position }}
      />
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 flex h-[23.7%] items-center justify-center text-center font-heading text-[1.25rem] leading-none font-bold text-ink">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
