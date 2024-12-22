<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import MobileVersion from './components/MobileVersion.svelte';
	import DesktopVersion from './components/DesktopVersion.svelte';

	const isDesktop = new MediaQuery('min-width: 1024px');
</script>

{#if !isDesktop.current}
	<MobileVersion />
{:else}
  <DesktopVersion />
{/if}
