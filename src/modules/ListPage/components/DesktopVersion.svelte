<script lang="ts">
  import { goto } from '$app/navigation';
  import Search from '@/components/Search.svelte';
  import { config } from '@/global/sites.svelte';
  import Column from './Column.svelte';
  import Button from '@/components/Button/Button.svelte';
  import ArrowLeft from '@/components/Icons/ArrowLeft.svelte';
  import ArrowRight from '@/components/Icons/ArrowRight.svelte';

  const hasPages = config.allSites?.pages && config.allSites.pages.length > 0;
  const pages = hasPages ? config.allSites.pages : [];
  const totalNumberOfPages = pages.length;
  let currentPage = $state(0);
  const shouldShowPreviousBtn = $derived(currentPage > 0);
  const shouldShowNextBtn = $derived(currentPage < totalNumberOfPages - 1);
</script>

<Search />
<div class="lg:flex lg:justify-evenly h-full">
  {#if hasPages}
    {#each config.allSites.pages[currentPage].sitesColumns as menu}
      <Column column={menu} />
    {/each}
  {/if}
</div>
<div class="grid grid-cols-3">
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
  <div class="col-start-2">
    <Button
      color="secondary"
      size="medium"
      className="my-4 cursor-pointer"
      onclick={() => goto('/editor')}
    >
      Open Builder
    </Button>
  </div>
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
