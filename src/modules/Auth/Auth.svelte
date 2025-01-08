<script lang="ts">
	import { Button, Input, Typography } from '@/components';
	import type { ActionData as LoginActionData } from '../../routes/login/$types';
	import type { ActionData as RegisterActionData } from '../../routes/register/$types';
	import { goto } from '$app/navigation';

	let {
		form,
		isRegisterPage
	}: { form: LoginActionData | RegisterActionData; isRegisterPage?: boolean } = $props();
	const isMissingEmail = form?.isMissingEmail;
	const isMissingPassword = form?.isMissingPassword;
	const email = form?.email;

	$effect(() => {
		const success = form?.success;
		if (success) {
      // todo change from token to cookies
			const token = form?.token;
			goto('/');
		}
	});
</script>

<Typography size="h1" className="mb-10" color="secondary">
	{isRegisterPage ? 'Register' : 'Login'}
</Typography>
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
	<Button type="submit" color="primary">{isRegisterPage ? 'Register' : 'Submit'}</Button>
	<Button
		type="button"
		onclick={() => goto(isRegisterPage ? '/login' : '/register')}
		color="secondary"
	>
		{isRegisterPage ? 'Go to login page' : 'Go to register page'}
	</Button>
</form>
