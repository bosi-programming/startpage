<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import MobileVersion from './components/MobileVersion.svelte';
  import DesktopVersion from './components/DesktopVersion.svelte';
  import type { Config } from '@/lib/server/entities/Config';

  const isDesktop = new MediaQuery('min-width: 1024px');

  const { config }: { config: Config } = $props();
  console.log(config);
</script>

{#if !isDesktop.current}
  <MobileVersion />
{:else}
  <DesktopVersion />
{/if}
