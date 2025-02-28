<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		placeholder,
		value = $bindable(),
		...rest
	}: {
		placeholder?: string;
		value?: string;
		className?: string;
	} & HTMLInputAttributes = $props();
</script>

<input
	aria-label={placeholder}
	bind:value={value}
	{placeholder}
	type="text"
	{...rest}
	class={`bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg border px-2 py-1 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-emerald dark:bg-green dark:text-peach placeholder:italic dark:focus:border-emerald dark:focus:ring-emerald ${rest.className}`}
/>
