<script lang="ts">
	import FormEditor from './components/FormEditor/FormEditor.svelte';
	import { saveSites } from '$lib/saveSites';
	import { goto } from '$app/navigation';
	import { allSites } from '@/global/sites.svelte';
	import Typography from '@/components/Typography/Typography.svelte';
	import Button from '@/components/Button/Button.svelte';
	import { pushFileToLocalStorage, pushSitesToLocalStorage } from './EditPage.utils';
	import JsonEditor from './components/JsonEditor.svelte';

	let selectedBuilder = $state('form');

	const changeBuilder = (e: Event) => {
		e.preventDefault();
		if (selectedBuilder === 'form') {
			selectedBuilder = 'json';
		} else {
			selectedBuilder = 'form';
		}
	};

	const handleCloseBuilder = () => {
		goto('/');
	};
</script>

<Typography size="h1">Personalize your startpage</Typography>
{#if selectedBuilder === 'form'}
	<FormEditor allSites={allSites.allSites} />
{:else}
	<JsonEditor allMenus={allSites.allSites} />
{/if}
<Button
	size="small"
	color="secondary"
	className="size-fit mx-auto"
	onclick={(e: Event) => pushSitesToLocalStorage(e, allSites.allSites)}>Submit</Button
>
<div class="my-4">
	<Button onclick={handleCloseBuilder} className="mr-4">Close Builder</Button>
	<Button onclick={changeBuilder}>
		{selectedBuilder === 'form' ? 'JSON' : 'Form'} Builder
	</Button>
</div>
<div>
	<Button onclick={saveSites} className="mr-4">Export sites</Button>
	<input
		class="w-52 dark:text-white"
		type="file"
		id="import"
		accept=".json"
		onchange={(e: Event) => pushFileToLocalStorage(e)}
	/>
</div>
