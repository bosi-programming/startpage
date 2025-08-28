<script lang="ts">
  import Auth from '@/modules/Auth/Auth.svelte';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<Auth {form} isRegisterPage={true} />
