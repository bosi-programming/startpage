<script lang="ts">
  import { type TypographyProps } from './Typography.d';
  import { colorClass, sizeClass, getComponent } from './Typography.utils';

  const {
    color,
    size,
    className,
    as,
    children,
    href,
    target,
    rel,
  }: TypographyProps = $props();

  const colorClassName = $derived(colorClass(color));
  const sizeClassName = $derived(sizeClass(size));
  const finalClassName = $derived(
    `${colorClassName} ${sizeClassName} ${className ? className : ''}`,
  );
  const component = $derived(getComponent(size, as));
</script>

{#snippet content()}
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
{/snippet}

{#if component === 'a'}
  <svelte:element this={component} class={finalClassName} {href} {target} {rel}>
    {@render content()}
  </svelte:element>
{:else}
  <svelte:element this={component} class={finalClassName}>
    {@render content()}
  </svelte:element>
{/if}
