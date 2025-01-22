<script lang="ts">
  import ListPage from '@/modules/ListPage/ListPage.svelte';
  import type { PageProps } from './$types';

  let { data: config }: PageProps = $props();
</script>

<ListPage config={config} />
