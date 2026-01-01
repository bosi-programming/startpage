<script lang="ts">
  import type { TSite } from '@/stores/sites';
  import { Typography } from 'bosi-design-system/svelte';

  interface Props {
    site: TSite;
  }

  const { site }: Props = $props();
</script>

<li class="m-0 border-0 p-0">
  <Typography
    as="a"
    href={site.url}
    target="_self"
    rel="noopener"
    className="block !mb-0 px-0 py-1.5 text-details text-primary-on-light dark:text-primary-on-dark"
  >
    {site.name}
  </Typography>
</li>
