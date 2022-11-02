<script>
  export let selectedColumn;
  export let selectedColumnIndex;
  export let updateMenu;
  const getNewSites = (newValue, index, field) => {
    if (!selectedColumn.sites[index]) {
      selectedColumn.sites[index] = { url: "", name: "" };
    }
    if (field) {
      selectedColumn.sites[index][field] = newValue;
    }

    const newSites = selectedColumn.sites;
    return newSites;
  };

  const deleteSite = (index) => {
    const allSites = selectedColumn.sites;
    allSites.splice(index, 1);
    return allSites;
  };
</script>

<aside id={selectedColumn.title} class="form-editor__content">
  <div class="field">
    <label for={`title-${selectedColumn}`}>Title</label>
    <input
      type="text"
      value={selectedColumn.title}
      on:change={(e) =>
        updateMenu(e.target.value, selectedColumnIndex, "title")}
    />
  </div>
  <ul>
    {#if selectedColumn && selectedColumn.sites}
      {#each selectedColumn.sites as site, siteIndex}
        <li>
          <input
            type="url"
            placeholder="URL"
            value={site.url}
            on:change={(e) => {
              const newSites = getNewSites(e.target.value, siteIndex, "url");
              updateMenu(newSites, selectedColumnIndex, `sites`);
            }}
          />
          <input
            type="text"
            placeholder="Site name"
            value={site.name}
            on:change={(e) => {
              const newSites = getNewSites(e.target.value, siteIndex, "name");
              updateMenu(newSites, selectedColumnIndex, `sites`);
            }}
          />
          <button
            class="button button-danger"
            type="button"
            on:click={() => {
              const newSites = deleteSite(siteIndex);
              updateMenu(newSites, selectedColumnIndex, `sites`);
            }}>Delete</button
          >
        </li>
      {/each}
    {/if}
  </ul>
  <button
    class="button button-center"
    type="button"
    on:click={() => {
      const newSites = getNewSites("", selectedColumn.sites.length);
      updateMenu(newSites, selectedColumnIndex, `sites`);
    }}
  >
    Add new site
  </button>
</aside>

<style>
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  .button {
    background-color: rgb(35, 35, 60);
    color: white;
    border: 1px solid #3c8db9;
    border-radius: 8px;
    cursor: pointer;
    width: 250px;
    margin: 16px;
  }
  .button-danger {
    background-color: #ba000d;
    border: 1px solid black;
    width: 100px;
  }
  .button-center {
    margin: 16px auto 32px auto;
  }
</style>
