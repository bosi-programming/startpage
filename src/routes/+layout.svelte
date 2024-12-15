<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex-div">
	{@render children()}
</main>

<style global>
	.flex-div {
		height: 100%;
		text-align: center;
		padding: unset;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;

	@media (min-width: 1023px) {
			max-width: 100%;
		}
	}
</style>
