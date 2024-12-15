<script lang="ts">
	import JsonEditor from '../../components/JsonEditor.svelte';
	import FormEditor from '../../components/FormEditor/FormEditor.svelte';
	import { saveSites } from '$lib/saveSites';
	import { exportFileToLocalStorage } from '$lib/exportFileToLocalStorage.js';
	import { sites, type TColumn } from '../../stores/sites';
	import { goto } from '$app/navigation';

	let allSites: TColumn[] = $state([]);

	sites.subscribe((value) => {
		allSites = value;
	});

	let selectedBuilder = $state('form');

	const pushSitesToLocalStorage = (e: Event) => {
		e.preventDefault();
		localStorage.removeItem('sites');
		localStorage.setItem('sites', JSON.stringify(allSites));
	};

	const pushFileToLocalStorage = (e: Event) => {
		e.preventDefault();
		exportFileToLocalStorage(e, 'sites');
		location.reload();
	};

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

<h1>Personalize your startpage</h1>
{#if selectedBuilder === 'form'}
	<FormEditor {allSites} />
{:else}
	<JsonEditor allMenus={allSites} />
{/if}
<button class="button button-center" type="submit" onclick={pushSitesToLocalStorage}>
	Submit
</button>
<div>
	<button class="button" onclick={handleCloseBuilder}> Close Builder </button>
	<button class="button" onclick={changeBuilder}>
		{selectedBuilder === 'form' ? 'JSON' : 'Form'} Builder
	</button>
</div>
<div>
	<button class="button" onclick={saveSites}> Export sites </button>
	<input class="button" type="file" id="import" accept=".json" onchange={pushFileToLocalStorage} />
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
