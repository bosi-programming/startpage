<script>
  import EditColumn from "./components/EditColumn.svelte";
  export let updateSites;
  export let allMenus;
  let selectedColumn = 0;
  console.log(selectedColumn);

  let newSites = allMenus || [];

  const updateMenu = (newValue, index, field) => {
    if (!newSites[index]) {
      newSites[index] = {};
    }
    newSites[index][field] = newValue;
    updateSites(JSON.stringify(newSites));
    console.log(newSites);
  };
</script>

<main class="flex-div">
  {#if newSites && newSites[selectedColumn]}
    <EditColumn
      selectedColumnIndex={selectedColumn}
      selectedColumn={newSites[selectedColumn]}
      {updateMenu}
    />
  {/if}
  <label for="column">Choose the column you want to edit:</label>
  <select
    name="sites"
    id="sites"
    on:change={(e) => {
      const value = e.target.value;
      if (value === "new" && newSites) {
        updateMenu(e.target.value, newSites.length, "title");
        selectedColumn = newSites.length - 1;
      } else {
        selectedColumn = e.target.value;
      }
    }}
  >
    {#if newSites}
      {#each newSites as column, index}
        <option value={index}>{column.title}</option>
      {/each}
    {/if}
    <option value="new">Add new column</option>
    <option value={null} selected disabled>Select an option</option>
  </select>
</main>
