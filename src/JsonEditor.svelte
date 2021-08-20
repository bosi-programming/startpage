<script>
  import { saveSites } from "./utils/saveSites";
  import { exportFileToLocalStorage } from "./utils/exportFileToLocalStorage.js";

  export let sites;
  export let handleOpenBuilder;
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
  cols="100"
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
    background-color: #3C8DB9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 250px;
    margin: 16px;
  }
  .button-center {
    margin: 16px auto;
  }
  .button:active {
    background-color: #86BBD8;
  }
</style>
