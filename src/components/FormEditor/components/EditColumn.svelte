<script lang="ts">
	import {
		updateColumn,
		addNewSite,
		updateSite,
		deleteSite,
		type TColumn
	} from '../../../stores/sites';

	interface Props {
		selectedColumn: TColumn;
		selectedColumnIndex: number;
	}
	const { selectedColumn, selectedColumnIndex }: Props = $props();
</script>

<aside id={selectedColumn.title} class="form-editor__content">
	<div class="field">
		<label for={`title-${selectedColumn}`}>Title</label>
		<input
			type="text"
			value={selectedColumn.title}
			onchange={(e) =>
				updateColumn((e.target as HTMLInputElement).value, selectedColumnIndex, 'title')}
		/>
	</div>
	<ul>
		{#if selectedColumn && selectedColumn.sites}
			{#each selectedColumn.sites as site, siteIndex}
				<li>
					<input
						type="url"
						placeholder="URL"
						value={site.url}
						onchange={(e) =>
							updateSite(
								(e.target as HTMLInputElement).value,
								siteIndex,
								selectedColumnIndex,
								'url'
							)}
					/>
					<input
						type="text"
						placeholder="Site name"
						value={site.name}
						onchange={(e) =>
							updateSite(
								(e.target as HTMLInputElement).value,
								siteIndex,
								selectedColumnIndex,
								'name'
							)}
					/>
					<button
						class="button button-danger"
						type="button"
						onclick={() => deleteSite(siteIndex, selectedColumnIndex)}>Delete</button
					>
				</li>
			{/each}
		{/if}
	</ul>
	<button
		class="button button-center"
		type="button"
		onclick={() => addNewSite(selectedColumnIndex)}
	>
		Add new site
	</button>
</aside>

<style>
	ul {
		list-style: none;
		padding-left: 0;
	}
	li {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	.button {
		background-color: rgb(35, 35, 60);
		color: white;
		border: 1px solid #3c8db9;
		border-radius: 8px;
		cursor: pointer;
		width: 250px;
		margin: 16px;
	}
	.button-danger {
		background-color: #ba000d;
		border: 1px solid black;
		width: 100px;
	}
	.button-center {
		margin: 16px auto 32px auto;
	}
</style>
