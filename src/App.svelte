<script>
  import Fetch from "./Fetch.svelte";
  import JsonEditor from "./JsonEditor.svelte";
  import { getFromLocalStorage } from "./utils/getFromLocalStorage";

  const windowWidth = window.innerWidth;
  let menus = getFromLocalStorage("sites") || null;
  let isBuilderOpen = false;
  let selectedCelMenu = null;

  const handleOpenBuilder = () => {
    isBuilderOpen = !isBuilderOpen;
    menus = getFromLocalStorage("sites");
  };
  const selectCelMenu = (index) => {
    selectedCelMenu = index;
  };
</script>

<main class="flex-div">
  {#if isBuilderOpen}
    <form class="flex-div">
      <JsonEditor sites={menus} {handleOpenBuilder} />
    </form>
  {:else if windowWidth < 1024}
    <div class="flex-div">
      {#if menus && selectedCelMenu === null}
        {#each menus as menu, index}
          <button class="button" on:click={() => selectCelMenu(index)}>
            {menu.title}
          </button>
        {/each}
      {/if}
      {#if selectedCelMenu !== null}
        <Fetch sites={menus[selectedCelMenu]} />
        <button class="button" on:click={() => selectCelMenu(null)}>
          Clear
        </button>
      {/if}
      <button class="button" on:click={handleOpenBuilder}>
        Open Builder
      </button>
    </div>
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
    background-color: rgb(35, 35, 60);
    color: white;
    border: 1px solid #3c8db9;
    border-radius: 8px;
    cursor: pointer;
    width: 250px;
    margin: 16px auto;
  }
  .button:active {
    background-color: rgb(45, 45, 70);
  }
  .flex-div {
    height: 100%;
    text-align: center;
    padding: unset;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  @media (min-width: 1023px) {
    .flex-div {
      max-width: 100%;
    }
    .flex-div__content {
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>
