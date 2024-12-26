<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import { updateColumn, addNewSite, updateSite, deleteSite, type TColumn } from '@/stores/sites';

	interface Props {
		selectedColumn: TColumn;
		selectedColumnIndex: number;
	}
	const { selectedColumn, selectedColumnIndex }: Props = $props();
</script>

<aside id={selectedColumn.title} class="form-editor__content">
	<div class="field">
		<label class="mr-4 dark:text-white" for={`title-${selectedColumn}`}>Title:</label>
		<input
			type="text"
			value={selectedColumn.title}
			onchange={(e) =>
				updateColumn((e.target as HTMLInputElement).value, selectedColumnIndex, 'title')}
		/>
	</div>
	<ul class="list-none pl-0">
		{#if selectedColumn && selectedColumn.sites}
			{#each selectedColumn.sites as site, siteIndex}
				<li class="m-0 rounded-none p-0 align-baseline">
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
	<Button className="mx-auto !p-2 my-4" onclick={() => addNewSite(selectedColumnIndex)}
		>Add new site</Button
	>
</aside>
