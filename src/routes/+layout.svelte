<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<main
  class="mx-auto my-0 flex h-screen w-screen flex-col justify-center bg-background-on-light px-8 text-center lg:py-10 dark:bg-background-on-dark"
>
  {@render children()}
</main>
