import type { Snippet, SvelteComponent } from 'svelte';

export interface ButtonProps {
  onclick: SvelteComponent['onclick']
  children: Snippet | string;
  className?: string;
  color?: 'default' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'full-width';
  action?: 'error' | 'warning' | 'success' | 'info';
}

