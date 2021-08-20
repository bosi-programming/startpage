<script>
  import Fetch from "./Fetch.svelte";
  import JsonEditor from "./JsonEditor.svelte";
  import { getFromLocalStorage } from "./utils/getFromLocalStorage";

  let menus = getFromLocalStorage("sites") || null;
  let isBuilderOpen = false;

  const handleOpenBuilder = () => {
    isBuilderOpen = !isBuilderOpen;
    menus = getFromLocalStorage("sites");
  };
</script>

<main class="flex-div">
  {#if isBuilderOpen}
    <form class="flex-div">
      <JsonEditor sites={menus} {handleOpenBuilder} />
    </form>
  {:else}
    <div class="flex-div__content">
      {#if menus}
        {#each menus as menu}
          <Fetch sites={menu} />
        {/each}
      {/if}
    </div>
    <button class="button" on:click={handleOpenBuilder}> Open Builder </button>
  {/if}
</main>

<style>
  .button {
    background-color: #3C8DB9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 250px;
    margin: 16px auto;
  }
  .button:active {
    background-color: #86BBD8;
  }
  .flex-div {
    max-width: 240px;

    text-align: center;
    padding: unset;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    .flex-div {
      height: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .flex-div__content {
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>
