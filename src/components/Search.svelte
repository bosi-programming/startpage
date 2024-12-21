<script lang="ts">
	import { searchSites } from '../stores/sites';
</script>

<input
	type="text"
	placeholder="Search"
	on:input={(e) => searchSites(e.currentTarget.value)}
	class="mx-auto p-1.5 mb-5 mt-0 rounded outline-transparent w-3/4 sm:w-[400px]"
/>
