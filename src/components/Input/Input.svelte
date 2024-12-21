<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  const {
    labelChildren,
    ...rest
  }: {
    labelChildren?: string;
    className?: string;
  } & HTMLInputAttributes = $props();
</script>

<input
  aria-label={labelChildren}
  placeholder={labelChildren}
  type="text"
  {...rest}
  class={`bg-gray-50 border border-gray-300 text-gray-900
           text-sm rounded-lg focus:ring-blue-500
          focus:border-blue-500 p-2.5 dark:bg-green dark:border-emerald
          outline-none
          dark:placeholder-peach dark:text-peach 
          dark:focus:ring-emerald
          dark:focus:border-emerald ${rest.className}`}
/>
