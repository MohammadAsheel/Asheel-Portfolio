import type { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function Image({ src, alt, loading = 'lazy', ...rest }: ImageProps) {
  return <img src={src} alt={alt} loading={loading} {...rest} />;
}
