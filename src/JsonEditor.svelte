<script>
  import { saveSites } from "./utils/saveSites";
  import { exportFileToLocalStorage } from "./utils/exportFileToLocalStorage.js";

  export let sites;
  export let handleOpenBuilder;
  const windowWidth = window.innerWidth;
  let newSites;

  const pushSitesToLocalStorage = (e) => {
    console.log(e.target.value, newSites);
    localStorage.removeItem("sites");
    localStorage.setItem("sites", newSites);
    handleOpenBuilder();
  };

  const pushFileToLocalStorage = (e) => {
    exportFileToLocalStorage(e, "sites");
    location.reload();
  };

  const updateSites = (e) => {
    newSites = e.target.value;
  };
</script>

<h1>Personalize your startpage</h1>
<textarea
  cols={windowWidth < 1024 ? 30 : 100}
  rows="30"
  type="text"
  value={JSON.stringify(sites, null, 2)}
  on:change={updateSites}
/>
<button
  class="button button-center"
  type="submit"
  on:click|preventDefault={pushSitesToLocalStorage}
>
  Submit
</button>
<button class="button button-center" on:click={handleOpenBuilder}>
  Close Builder
</button>
<div>
  <button class="button" on:click|preventDefault={saveSites}>
    Export sites
  </button>
  <input
    class="button"
    type="file"
    id="import"
    accept=".json"
    on:change={pushFileToLocalStorage}
  />
</div>

<style>
  .button {
    background-color: rgb(35, 35, 60);
    color: white;
    border: 1px solid #3c8db9;
    border-radius: 8px;
    cursor: pointer;
    width: 250px;
    margin: 16px;
  }
  .button-center {
    margin: 16px auto;
  }
  .button:active {
    background-color: rgb(45, 45, 70);
  }
</style>
