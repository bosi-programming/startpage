<script lang="ts">
  import { searchSites } from '../stores/sites';
</script>

<input
  type="text"
  placeholder="Search"
  on:input={(e) => searchSites(e.currentTarget.value)}
  class="mx-auto mb-5 mt-0 w-3/4 rounded p-1.5 outline-transparent sm:w-[400px]"
/>
