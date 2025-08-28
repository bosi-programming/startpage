<script lang="ts">
  import { baseButtonClasses, sizeClasses } from './Button.styles';
  import { getColor } from './Button.utils';
  import type { ButtonProps } from './Button';

  const {
    children,
    className,
    color = 'default',
    size = 'medium',
    action,
    onclick,
    ...props
  }: ButtonProps = $props();

  const colorClass = getColor(action, color);
  const sizeClass = sizeClasses[size];
  const buttonClasses = `
    ${baseButtonClasses}${' '}
    ${colorClass}${' '}
    ${sizeClass}${' '}
    ${className ? className : ''}
  `;
</script>

<button {onclick} class={buttonClasses} {...props}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
</button>
