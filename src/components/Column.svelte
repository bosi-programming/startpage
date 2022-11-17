<script>
  export let column = [];
  export let isSubColumn = false;
</script>

<aside id={column.title}>
  <h2 class={isSubColumn ? 'subColumn-title' : ''}>{column.title}</h2>
  {#if column && column.sites}
    <ul>
      {#each column.sites as site}
        <li>
          <a href={site.url} target="_self" rel="noopener">{site.name}</a>
        </li>
      {/each}
    </ul>
  {/if}
  {#if column.subColumns}
    {#each column.subColumns as subColumn}
      <svelte:self column={subColumn} isSubColumn={true} />
    {/each}
  {/if}
</aside>

<style>
  aside {
    text-align: left;
  }
  .subColumn-title {
    color: #ccc;
    font-size: 1.1rem;
    font-weight: bold;
  }
  h2 {
    display: block;
    font-size: 1.3rem;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  a {
    font-size: 0.9rem;
    color: deepskyblue;
    text-decoration: none;
    display: block;
    padding: 0.5em 0;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
</style>
