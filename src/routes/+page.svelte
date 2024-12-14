<script lang="ts">
	import Column from '../components/Column.svelte';
	import Search from '../components/Search.svelte';
	import { sites, type TColumn } from '../stores/sites';

	let allSites: TColumn[];

	sites.subscribe((value) => {
		allSites = value;
	});

	const windowWidth = window.innerWidth;
	let selectedCelMenu: number | null = null;

	const selectCelMenu = (index: number | null) => {
		selectedCelMenu = index;
	};

	const handleOpenBuilder = () => {};
</script>

{#if windowWidth < 1024}
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
	<div class="flex-div__content">
		{#if allSites}
			{#each allSites as menu}
				<Column column={menu} />
			{/each}
		{/if}
	</div>
	<button class="button" onclick={handleOpenBuilder}> Open Builder </button>
{/if}

<style>
	.button {
		background-color: rgb(35, 35, 60);
		color: white;
		border: 1px solid #3c8db9;
		border-radius: 8px;
		cursor: pointer;
		width: 250px;
		margin: 16px auto;
	}
	.button:active {
		background-color: rgb(45, 45, 70);
	}
	@media (min-width: 1023px) {
		.flex-div__content {
			display: flex;
			justify-content: space-evenly;
		}
	}
</style>
