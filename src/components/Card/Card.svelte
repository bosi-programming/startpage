<script lang="ts">
  import Typography from '../Typography/Typography.svelte';

  interface Props {
    className: string;
    title: string;
    content: string;
    tags: string[];
    reference?: string;
  }
  const { className, title, content, tags, reference }: Props = $props();
</script>

<div
  class={`px-4 py-4 flex justify-between flex-col w-full rounded-md border-black border shadow-card dark:border-white dark:shadow-card-dark ${className ? className : ''}`}
>
  <div class="mb-4">
    <Typography color="primary" size="h2" className="mb-2">{title}</Typography>
    <Typography size="details" className="pb-0 mb-0 flex">
      {#each tags as tag (tag)}
        <Typography
          size="details"
          as="span"
          className="pr-1.5 cursor-pointer hover:scale-110 origin-left block"
          color="secondary"
        >
          #{tag}
        </Typography>
      {/each}
    </Typography>
  </div>
  <Typography className={reference ? 'mb-4' : 'mb-0'}>{content}</Typography>
  {#if reference}
    <Typography size="details">{reference}</Typography>
  {/if}
</div>
