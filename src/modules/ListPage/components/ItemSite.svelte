<script lang="ts">
	import Typography from '@/components/Typography/Typography.svelte';
	import type { TSite } from '@/stores/sites';

	interface Props {
		site: TSite;
	}

	const { site }: Props = $props();
</script>

<li class="m-0 border-0 p-0">
	<Typography
		as="a"
		href={site.url}
		target="_self"
		rel="noopener"
		className="block !mb-0 px-0 py-1.5 text-details text-primary-on-light dark:text-primary-on-dark"
    >
    {site.name}
	</Typography>
</li>
