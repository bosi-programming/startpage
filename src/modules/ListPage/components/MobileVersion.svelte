<script lang="ts">
  import { goto } from '$app/navigation';
  import Search from '@/components/Search.svelte';
  import Column from './Column.svelte';
  import { config } from '@/global/sites.svelte';
  import Button from '@/components/Button/Button.svelte';

  let selectedCelMenu: number | null = $state(null);

  const selectCelMenu = (index: number | null) => {
    selectedCelMenu = index;
  };
</script>

<div class="flex-div">
  <Search />
  {#if config && config.allSites?.pages && selectedCelMenu === null}
    <div>
      {#each config.allSites.pages[0].sitesColumns as menu, index}
        <Button
          color="secondary"
          className="block mb-4 mx-auto w-36"
          onclick={() => selectCelMenu(index)}
        >
          {menu.title}
        </Button>
      {/each}
    </div>
  {/if}
  {#if selectedCelMenu !== null}
    <Column column={config.allSites.pages[0].sitesColumns[selectedCelMenu]} />
  {/if}
  <div class={selectedCelMenu !== null ? 'flex justify-between' : ''}>
    <Button color="primary" onclick={() => goto('/editor')}>Open Builder</Button
    >
    {#if selectedCelMenu !== null}
      <Button color="primary" onclick={() => selectCelMenu(null)}>Clear</Button>
    {/if}
  </div>
</div>
