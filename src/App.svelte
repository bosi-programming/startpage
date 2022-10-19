<script>
  import Home from "./pages/Home.svelte";
  import Editor from "./pages/Editor.svelte";
  import { getFromLocalStorage } from "./utils/getFromLocalStorage";

  let allMenus = getFromLocalStorage("sites") || null;
  let isBuilderOpen = false;

  const handleOpenBuilder = () => {
    isBuilderOpen = !isBuilderOpen;
    allMenus = getFromLocalStorage("sites");
  };
</script>

<main class="flex-div">
  {#if isBuilderOpen}
    <form class="flex-div">
      <Editor {allMenus} {handleOpenBuilder} />
    </form>
  {:else}
    <Home {allMenus} {handleOpenBuilder} />
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
