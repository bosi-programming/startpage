<script lang="ts">
	import { searchSites } from '../stores/sites';
</script>

<input
	type="text"
	placeholder="Search"
	on:input={(e) => searchSites(e.currentTarget.value)}
/>

<style>
	input {
		outline: transparent;
		width: calc(100vw - 64px);
		margin: 0 auto 20px;
		border-radius: 5px;
	}
	@media (min-width: 1023px) {
		input {
			width: 400px;
		}
	}
</style>
