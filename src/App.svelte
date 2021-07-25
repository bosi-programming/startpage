<script>
  import Fetch from "./Fetch.svelte";

  const data = JSON.parse(JSON.parse(localStorage.getItem("sites")));
  const menus = data.data;
  console.log(data, menus);
</script>

<main class="flex-div">
  <div class="flex-div__content">
    {#each menus as menu}
      <Fetch sites={menu} />
    {/each}
  </div>
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
      justify-content: flex-start;
    }
  }
</style>
