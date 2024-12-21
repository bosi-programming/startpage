import type { Snippet } from 'svelte';

export type TColor = 'default' | 'primary' | 'secondary';

export type TSize = 'body' | 'h1' | 'h2' | 'h3' | 'h4' | 'details';
export interface TypographyProps {
  color?: TColor;
  size?: TSize;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'details';
  children: Snippet | string;
}
