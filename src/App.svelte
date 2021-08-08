<script>
  import Fetch from "./Fetch.svelte";
  import { getFromLocalStorage } from "./utils/getFromLocalStorage";
  import { exportFileToLocalStorage } from "./utils/exportFileToLocalStorage";

  let menus = getFromLocalStorage("sites");

  const importSites = JSON.stringify(menus);

  const pushSitesToLocalStorage = (event) => {
    exportFileToLocalStorage(event, "sites");
    location.reload();
  };
</script>

<main class="flex-div">
  <div class="flex-div__content">
    {#if menus}
      {#each menus as menu}
        <Fetch sites={menu} />
      {/each}
    {/if}
  </div>
  <a href={`data:text/json;charset=utf-8,${importSites}`} download="sites.json">
    <button class="button"> Export sites </button>
  </a>
  <input
    class="button"
    type="file"
    id="import"
    accept=".json"
    on:change={pushSitesToLocalStorage}
  />
</main>

<nav>
  <button class="clearCel btn btn-nav" type="button" onclick="menuClearCel()">
    Clear
  </button>
</nav>

<footer>
  <script src="./js/selectionFunctions.js"></script>

  <script src="./js/cell.js"></script>
</footer>

<style>
  .button {
    width: 250px;
    margin: 16px auto;
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
