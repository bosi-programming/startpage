import type { Snippet } from 'svelte';

export type TColor = 'default' | 'primary' | 'secondary' | 'error';

export type TSize = 'body' | 'h1' | 'h2' | 'h3' | 'h4' | 'details';
export interface TypographyProps {
  color?: TColor;
  size?: TSize;
  className?: string;
  as?: 'a' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'details' | 'label';
  children: Snippet | string;
  href?: string;
  target?: HTMLAnchorElement['target'];
  rel?: HTMLAnchorElement['rel'];
}
