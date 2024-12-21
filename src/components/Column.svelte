<script lang="ts">
	import type { TColumn } from '../stores/sites';
	import Column from './Column.svelte';

	interface Props {
		column: TColumn;
		isSubColumn?: boolean;
	}
	const { column, isSubColumn = false }: Props = $props();
</script>

<aside class="text-left" id={column.title}>
	{#if isSubColumn}
		<h3 class="mx-0 my-4 text-h4 font-bold text-gray-15 dark:text-gray-93">{column.title}</h3>
	{:else}
		<h2 class="mx-0 my-4 text-h3 font-bold text-secondary-on-light dark:text-secondary-on-dark">
			{column.title}
		</h2>
	{/if}
	{#if column && column.sites}
		<ul class="list-none p-0">
			{#each column.sites as site}
				<li class="m-0 p-0 border-0">
					<a
						href={site.url}
						target="_self"
						rel="noopener"
						class="block px-0 py-1.5 text-details text-primary-on-light dark:text-primary-on-dark"
						>{site.name}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
	{#if column.subColumns}
		{#each column.subColumns as subColumn}
			<Column column={subColumn} isSubColumn={true} />
		{/each}
	{/if}
</aside>
