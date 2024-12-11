<script lang="ts">
	import Column from '../components/Column.svelte';
	import Search from '../components/Search.svelte';

	export let allMenus;
	export let handleOpenBuilder;

	const windowWidth = window.innerWidth;
	let selectedCelMenu: number | null = null;

	const selectCelMenu = (index: number | null) => {
		selectedCelMenu = index;
	};
</script>

{#if windowWidth < 1024}
	<div class="flex-div">
		<Search />
		{#if allMenus && selectedCelMenu === null}
			{#each allMenus as menu, index}
				<button class="button" on:click={() => selectCelMenu(index)}>
					{menu.title}
				</button>
			{/each}
		{/if}
		{#if selectedCelMenu !== null}
			<Column column={allMenus[selectedCelMenu]} />
			<button class="button" on:click={() => selectCelMenu(null)}> Clear </button>
		{/if}
		<button class="button" on:click={handleOpenBuilder}> Open Builder </button>
	</div>
{:else}
	<Search />
	<div class="flex-div__content">
		{#if allMenus}
			{#each allMenus as menu}
				<Column column={menu} />
			{/each}
		{/if}
	</div>
	<button class="button" on:click={handleOpenBuilder}> Open Builder </button>
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
