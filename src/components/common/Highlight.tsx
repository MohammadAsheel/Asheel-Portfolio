import type { ReactNode } from 'react';

interface HighlightProps {
  bold?: boolean;
  /** Draws the highlight as an uneven, hand-drawn marker stroke instead of a straight bar. */
  handDrawn?: boolean;
  children: ReactNode;
}

export default function Highlight({ bold = false, handDrawn = false, children }: HighlightProps) {
  const classes = ['highlight', handDrawn ? 'highlight-hand-drawn' : '', bold ? 'font-semibold' : '']
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}
