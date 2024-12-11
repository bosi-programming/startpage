<script>
  import { updateSites } from "../stores/sites.js";
  export let allMenus;

  const windowWidth = window.innerWidth;
</script>

<textarea
  cols={windowWidth < 1024 ? 30 : 100}
  rows="30"
  type="text"
  value={JSON.stringify(allMenus, null, 2)}
  on:change={(event) => updateSites(event.target.value)}
/>
