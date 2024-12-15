<script lang="ts">
	import { updateColumn, type TColumn } from '../../stores/sites.js';
	import EditColumn from './components/EditColumn.svelte';

	interface Props {
		allSites: TColumn[];
	}

	const { allSites }: Props = $props();
	let selectedColumn = $state(0);
</script>

<main class="flex-div">
	<label for="column">Choose the column you want to edit:</label>
	<select
		name="sites"
		id="sites"
		onchange={(e) => {
			const target = e.target as HTMLSelectElement;
			const value = target.value;
			if (value === 'new' && allSites) {
				updateColumn(target.value, allSites.length, 'title');
				selectedColumn = allSites.length - 1;
			} else {
				selectedColumn = Number(target.value);
			}
		}}
	>
		<option value={null} hidden selected disabled>Select an option</option>
		{#if allSites}
			{#each allSites as column, index}
				<option value={index}>{column.title}</option>
			{/each}
		{/if}
		<option value="new">Add new column</option>
	</select>
	{#if allSites && allSites[selectedColumn]}
		<EditColumn
			selectedColumnIndex={selectedColumn}
			selectedColumn={allSites[selectedColumn]}
		/>
	{/if}
</main>
