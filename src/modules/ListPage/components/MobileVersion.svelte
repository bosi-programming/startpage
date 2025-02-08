<script lang="ts">
  import { goto } from '$app/navigation';
  import Search from '@/components/Search.svelte';
  import Column from './Column.svelte';
  import { config } from '@/global/sites.svelte';
  import Button from '@/components/Button/Button.svelte';
  import ArrowLeft from '@/components/Icons/ArrowLeft.svelte';
  import ArrowRight from '@/components/Icons/ArrowRight.svelte';

  let selectedCelMenu: number | null = $state(null);

  const selectCelMenu = (index: number | null) => {
    selectedCelMenu = index;
  };

  const hasPages = config.allSites?.pages && config.allSites.pages.length > 0;
  const pages = hasPages ? config.allSites.pages : [];
  const totalNumberOfPages = pages.length;
  let currentPage = $state(0);
  const shouldShowPreviousBtn = $derived(currentPage > 0);
  const shouldShowNextBtn = $derived(currentPage < totalNumberOfPages - 1);
</script>

<div class="flex h-full flex-col justify-between px-8 py-10">
  <Search />
  {#if config && config.allSites?.pages && selectedCelMenu === null}
    <div>
      {#each config.allSites.pages[currentPage].sitesColumns as menu, index}
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
    <Column
      column={config.allSites.pages[currentPage].sitesColumns[selectedCelMenu]}
    />
  {/if}
  <div>
    <div class={selectedCelMenu !== null ? 'flex justify-between' : ''}>
      <Button color="primary" onclick={() => goto('/editor')}
        >Open Builder</Button
      >
      {#if selectedCelMenu !== null}
        <Button color="primary" onclick={() => selectCelMenu(null)}
          >Clear</Button
        >
      {/if}
    </div>
    <div class="grid grid-cols-3 pt-8">
      {#if shouldShowPreviousBtn}
        <div class="col-start-1">
          <Button
            color="secondary"
            size="medium"
            className="my-4 cursor-pointer"
            onclick={() => currentPage--}
          >
            <ArrowLeft size={24} />
          </Button>
        </div>
      {/if}
      {#if shouldShowNextBtn}
        <div class="col-start-3">
          <Button
            color="secondary"
            size="medium"
            className="my-4 cursor-pointer"
            onclick={() => currentPage++}
          >
            <ArrowRight size={24} />
          </Button>
        </div>
      {/if}
    </div>
  </div>
</div>
