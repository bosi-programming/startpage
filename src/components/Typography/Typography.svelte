<script lang="ts">
  import { type TypographyProps } from './Typography.d';
  import { colorClass, sizeClass, getComponent } from './Typography.utils';

  const { color, size, className, as, children }: TypographyProps = $props();

  const colorClassName = $derived(colorClass(color));
  const sizeClassName = $derived(sizeClass(size));
  const finalClassName = $derived(
    `${colorClassName} ${sizeClassName} ${className ? className : ''}`,
  );
  const component = $derived(getComponent(size, as));
</script>

<svelte:element this={component} class={finalClassName}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
</svelte:element>
