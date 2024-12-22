<script lang="ts">
	import type { TColumn } from '@/stores/sites';
	import Column from './Column.svelte';
	import Typography from '@/components/Typography/Typography.svelte';
	import ItemSite from './ItemSite.svelte';

	interface Props {
		column: TColumn;
		isSubColumn?: boolean;
	}
	const { column, isSubColumn = false }: Props = $props();
</script>

<aside class="text-left" id={column.title}>
	{#if isSubColumn}
		<Typography size="h3" className="mb-2">{column.title}</Typography>
	{:else}
		<Typography size="h2" color="secondary" className="mb-2">{column.title}</Typography>
	{/if}
	{#if column && column.sites}
		<ul class="list-none p-0">
			{#each column.sites as site}
        <ItemSite {site} />
			{/each}
		</ul>
	{/if}
	{#if column.subColumns}
		{#each column.subColumns as subColumn}
			<Column column={subColumn} isSubColumn={true} />
		{/each}
	{/if}
</aside>
