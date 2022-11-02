<script>
  import EditColumn from "./components/EditColumn.svelte";
  export let updateSites;
  export let allMenus;
  let selectedColumn = 0;

  let newSites = allMenus || [];

  const updateMenu = (newValue, index, field) => {
    if (!newSites[index]) {
      newSites[index] = {};
    }
    newSites[index][field] = newValue;
    updateSites(JSON.stringify(newSites));
  };
</script>

<main class="flex-div">
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
    <option value={null} hidden selected disabled>Select an option</option>
    {#if newSites}
      {#each newSites as column, index}
        <option value={index}>{column.title}</option>
      {/each}
    {/if}
    <option value="new">Add new column</option>
  </select>
  {#if newSites && newSites[selectedColumn]}
    <EditColumn
      selectedColumnIndex={selectedColumn}
      selectedColumn={newSites[selectedColumn]}
      {updateMenu}
    />
  {/if}
</main>
