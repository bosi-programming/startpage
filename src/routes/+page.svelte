<script lang="ts">
	import { goto } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import Column from '../components/Column.svelte';
	import Search from '../components/Search.svelte';
	import { sites, type TColumn } from '../stores/sites';

	let allSites: TColumn[] = $state([]);

	sites.subscribe((value) => {
		allSites = value;
	});

	const isDesktop = new MediaQuery('min-width: 1024px');
	let selectedCelMenu: number | null = $state(null);

	const selectCelMenu = (index: number | null) => {
		selectedCelMenu = index;
	};

	const handleOpenBuilder = () => {
		goto('/editor');
	};
</script>

{#if !isDesktop.current}
	<div class="flex-div">
		<Search />
		{#if allSites && selectedCelMenu === null}
			{#each allSites as menu, index}
				<button class="button" onclick={() => selectCelMenu(index)}>
					{menu.title}
				</button>
			{/each}
		{/if}
		{#if selectedCelMenu !== null}
			<Column column={allSites[selectedCelMenu]} />
			<button class="button" onclick={() => selectCelMenu(null)}> Clear </button>
		{/if}
		<button class="button" onclick={handleOpenBuilder}> Open Builder </button>
	</div>
{:else}
	<Search />
	<div class="lg:flex lg:justify-evenly">
		{#if allSites}
			{#each allSites as menu}
				<Column column={menu} />
			{/each}
		{/if}
	</div>
	<button
		class="button mx-auto my-4 w-64 cursor-pointer rounded bg-secondary-on-light p-1 text-white dark:bg-secondary-on-dark"
		onclick={handleOpenBuilder}
	>
		Open Builder
	</button>
{/if}
