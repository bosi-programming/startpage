<script lang="ts">
	import { updateSites, type TColumn } from '../stores/sites.js';
	interface Props {
		allMenus: TColumn;
	}
	const { allMenus }: Props = $props();

	const windowWidth = window.innerWidth;
</script>

<textarea
	cols={windowWidth < 1024 ? 30 : 100}
	rows="30"
	value={JSON.stringify(allMenus, null, 2)}
  onchange={(event: Event) => updateSites((event.target as HTMLTextAreaElement)?.value)}
></textarea>
