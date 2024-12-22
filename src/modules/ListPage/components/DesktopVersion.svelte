<script lang="ts">
	import { goto } from '$app/navigation';
	import Search from '@/components/Search.svelte';
	import { allSites } from '@/global/sites.svelte';
	import Column from './Column.svelte';
	import Button from '@/components/Button/Button.svelte';
</script>

<Search />
<div class="lg:flex lg:justify-evenly">
	{#if allSites.allSites}
		{#each allSites.allSites as menu}
			<Column column={menu} />
		{/each}
	{/if}
</div>
<Button
	color="secondary"
	size="medium"
	className="mx-auto my-4 cursor-pointer"
	onclick={() => goto('/editor')}
>
	Open Builder
</Button>
