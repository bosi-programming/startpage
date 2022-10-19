<script>
  export let updateSites;
  export let allMenus;
  let selectedColumn = 0;
  console.log(selectedColumn);

  const newSites = allMenus;
  const windowWidth = window.innerWidth;

  const updateMenu = (event, index, field) => {
    const newValue = event.target.value;
    newSites[index][field] = newValue;
    updateSites(JSON.stringify(newSites));
    console.log(newSites);
  };
</script>

<main class="flex-div">
  {#if newSites && newSites[selectedColumn]}
    <aside id={allMenus[selectedColumn].title} class="form-editor__content">
      <div class="field">
        <label for={`title-${selectedColumn}`}>Title</label>
        <input
          type="text"
          value={allMenus[selectedColumn].title}
          on:change={(e) => updateMenu(e, selectedColumn, "title")}
        />
      </div>
      <ul>
        {#if allMenus[selectedColumn] && allMenus[selectedColumn].sites}
          {#each allMenus[selectedColumn].sites as site}
            <li>
              <a href={site.url} target="_self" rel="noopener">{site.name}</a>
            </li>
          {/each}
        {/if}
      </ul>
    </aside>
  {/if}
  <label for="column">Choose the column you want to edit:</label>
  <select
    name="cars"
    id="cars"
    on:change={(e) => (selectedColumn = e.target.value)}
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

<style>
  h2 {
    display: block;
    font-size: 1.3rem;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  a {
    font-size: 0.9rem;
    color: deepskyblue;
    text-decoration: none;
    display: block;
    padding: 0.5em 0;
  }
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
  @media (min-width: 1023px) {
    .form-editor__content {
      margin: 0 40px;
    }
  }
</style>
