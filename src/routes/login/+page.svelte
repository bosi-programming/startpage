<script lang="ts">
	import Login from '@/modules/Login/Login.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Login {data} {form} />
