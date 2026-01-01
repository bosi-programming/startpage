<script lang="ts">
  import FormEditor from './components/FormEditor/FormEditor.svelte';
  import { saveSites } from '$lib/saveSites';
  import { goto } from '$app/navigation';
  import { config } from '@/global/sites.svelte';
  import Button from '@/components/Button/Button.svelte';
  import {
    pushFileToLocalStorage,
    pushSitesToLocalStorage,
  } from './EditPage.utils';
  import JsonEditor from './components/JsonEditor.svelte';
  import { Typography } from 'bosi-design-system/svelte';

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

<div class="mb-16">
  <Typography color="secondary" size="h1" className="mb-16"
    >Personalize your startpage</Typography
  >
  {#if selectedBuilder === 'form'}
    <FormEditor allSites={config.allSites?.pages} />
  {:else}
    <JsonEditor allMenus={config.allSites?.pages} />
  {/if}
  <div class="mt-4">
    <Button onclick={handleCloseBuilder} className="mr-4" action="error"
      >Close Builder</Button
    >
    <Button
      action="success"
      className="size-fit mx-auto"
      onclick={(e: Event) => {
        e.preventDefault();
        pushSitesToLocalStorage(config.allSites);
      }}>Submit</Button
    >
  </div>
</div>
<div class="my-4">
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
    onchange={async (e: Event) => {
      await pushFileToLocalStorage(e);
      goto('/');
    }}
  />
</div>
