<script lang="ts">
  import ListPage from '@/modules/ListPage/ListPage.svelte';
  import type { PageProps } from './$types';
  import { sites } from '@/stores/sites';
  import { config } from '@/global/sites.svelte';
  import { pushSitesToLocalStorage } from '@/modules/EditPage/EditPage.utils';
  import { browser } from '$app/environment';

  let { data: configFromBE }: PageProps = $props();
  console.log(
    configFromBE,
    config?.allSites?.updatedAt < (configFromBE?.updatedAt || 0),
  );
  if (
    !config.allSites?.updatedAt ||
    config.allSites.updatedAt < (configFromBE?.updatedAt || 0)
  ) {
    sites.update(() => configFromBE);
    if (browser) {
      pushSitesToLocalStorage(configFromBE);
    }
  }
</script>

<ListPage />
