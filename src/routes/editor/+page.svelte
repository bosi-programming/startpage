<script lang="ts">
	import JsonEditor from '../../components/JsonEditor.svelte';
	import FormEditor from '../../components/FormEditor/FormEditor.svelte';
	import { saveSites } from '$lib/saveSites';
	import { exportFileToLocalStorage } from '$lib/exportFileToLocalStorage.js';

	export let allSites;
	export let handleOpenBuilder;

	let selectedBuilder = 'form';

	const pushSitesToLocalStorage = () => {
		localStorage.removeItem('sites');
		localStorage.setItem('sites', JSON.stringify(allSites));
		handleOpenBuilder();
	};

	const pushFileToLocalStorage = (e: Event) => {
		exportFileToLocalStorage(e, 'sites');
		location.reload();
	};

	const changeBuilder = () => {
		if (selectedBuilder === 'form') {
			selectedBuilder = 'json';
		} else {
			selectedBuilder = 'form';
		}
	};
</script>

<h1>Personalize your startpage</h1>
{#if selectedBuilder === 'form'}
	<FormEditor {allSites} />
{:else}
	<JsonEditor allMenus={allSites} />
{/if}
<button
	class="button button-center"
	type="submit"
	on:click|preventDefault={pushSitesToLocalStorage}
>
	Submit
</button>
<div>
	<button class="button" on:click={handleOpenBuilder}> Close Builder </button>
	<button class="button" on:click|preventDefault={changeBuilder}>
		{selectedBuilder === 'form' ? 'JSON' : 'Form'} Builder
	</button>
</div>
<div>
	<button class="button" on:click|preventDefault={saveSites}> Export sites </button>
	<input class="button" type="file" id="import" accept=".json" on:change={pushFileToLocalStorage} />
</div>

<style>
	.button {
		background-color: rgb(35, 35, 60);
		color: white;
		border: 1px solid #3c8db9;
		border-radius: 8px;
		cursor: pointer;
		width: 250px;
		margin: 16px;
	}
	.button-center {
		margin: 16px auto;
	}
	.button:active {
		background-color: rgb(45, 45, 70);
	}
</style>
