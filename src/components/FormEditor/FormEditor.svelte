<script>
  import { updateColumn } from "../../stores/sites.js";
  import EditColumn from "./components/EditColumn.svelte";
  export let allSites;
  let selectedColumn = 0;
</script>

<main class="flex-div">
  <label for="column">Choose the column you want to edit:</label>
  <select
    name="sites"
    id="sites"
    on:change={(e) => {
      const value = e.target.value;
      if (value === "new" && allSites) {
        updateColumn(e.target.value, allSites.length, "title");
        selectedColumn = allSites.length - 1;
      } else {
        selectedColumn = e.target.value;
      }
    }}
  >
    <option value={null} hidden selected disabled>Select an option</option>
    {#if allSites}
      {#each allSites as column, index}
        <option value={index}>{column.title}</option>
      {/each}
    {/if}
    <option value="new">Add new column</option>
  </select>
  {#if allSites && allSites[selectedColumn]}
    <EditColumn
      selectedColumnIndex={selectedColumn}
      selectedColumn={allSites[selectedColumn]}
      {updateColumn}
    />
  {/if}
</main>
