<script>
  export let sites = [];
</script>

<aside id={sites.title}>
  <h2>{sites.title}</h2>
  <ul>
    {#if sites && sites.sites}
      {#each sites.sites as site}
        <li>
          <a href={site.url} target="_blanks" rel="noopener">{site.name}</a>
        </li>
      {/each}
    {/if}
  </ul>
</aside>

<style>
  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  a {
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
