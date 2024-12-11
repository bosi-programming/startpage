<script lang="ts">
	import '../app.css';
  import { sites } from "./stores/sites.js";
  import Home from "./pages/Home.svelte";
  import Editor from "./pages/Editor.svelte";

	let { children } = $props();

  let allSites;
  let isBuilderOpen = false;

  sites.subscribe((value) => {
    allSites = value;
  });

  const handleOpenBuilder = () => {
    isBuilderOpen = !isBuilderOpen;
  };
</script>

<main class="flex-div">
{@render children()}
  {#if isBuilderOpen || !allSites}
    <form class="flex-div">
      <Editor {allSites} {handleOpenBuilder} />
    </form>
  {:else}
    <Home allMenus={allSites} {handleOpenBuilder} />
  {/if}
</main>

<style>
  :global(.flex-div) {
    height: 100%;
    text-align: center;
    padding: unset;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  @media (min-width: 1023px) {
    :global(.flex-div) {
      max-width: 100%;
    }
  }
</style>
