<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main
	class="text-center mx-auto my-0 flex h-screen w-screen flex-col justify-center bg-background-on-light px-8 dark:bg-background-on-dark lg:py-10"
>
	{@render children()}
</main>
