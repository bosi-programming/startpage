<script lang="ts">
	import { Button, Input, Typography } from '@/components';
	import type { ActionData, PageData } from '../../routes/login/$types';

	let { form }: { data: PageData; form: ActionData } = $props();
	const isMissingEmail = form?.isMissingEmail;
	const isMissingPassword = form?.isMissingPassword;
	const email = form?.email;
</script>

<Typography size="h1" className="mb-10" color="secondary">Login</Typography>
<form method="POST" class="mx-auto grid gap-y-4">
	<div>
		<Input className="py-1 px-2" name="email" value={email} type="email" placeholder="Email" />
		{#if isMissingEmail}
			<Typography size="details" color="error" className="mt-1 text-left">
				{form.message}
			</Typography>
		{/if}
	</div>
	<div>
		<Input className="py-1 px-2" name="password" type="password" placeholder="Password" />
		{#if isMissingPassword}
			<Typography size="details" color="error" className="mt-1 text-left">
				{form.message}
			</Typography>
		{/if}
	</div>
	<Button type="submit" color="primary">Submit</Button>
</form>
