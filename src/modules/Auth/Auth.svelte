<script lang="ts">
  import { Button, Input, Typography } from '@/components';
  import type { ActionData as LoginActionData } from '../../routes/login/$types';
  import type { ActionData as RegisterActionData } from '../../routes/register/$types';
  import { goto } from '$app/navigation';
  import { enhance, applyAction } from '$app/forms';
  import { loginSchema } from '$lib/schemas/auth';

  let {
    form,
    isRegisterPage,
  }: { form: LoginActionData | RegisterActionData; isRegisterPage?: boolean } =
    $props();

  const isMissingEmail = form?.isMissingEmail;
  const isMissingPassword = form?.isMissingPassword;

  // Initialize with form values but make them mutable
  let email = $state(form?.email || '');
  let password = $state('');

  let clientErrors: { email?: string; password?: string } = $state({});

  function validateForm() {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      clientErrors = {
        email: errors.email?.[0],
        password: errors.password?.[0],
      };
      return false;
    }

    clientErrors = {};
    return true;
  }
</script>

<Typography size="h1" className="mb-10" color="secondary">
  {isRegisterPage ? 'Register' : 'Login'}
</Typography>
<form
  method="POST"
  class="mx-auto grid gap-y-4"
  use:enhance={({ cancel }) => {
    if (!validateForm()) {
      return cancel();
    }
    return async ({ result }) => {
      await applyAction(result);
      if (result.status === 303) {
        goto('/');
      }
    };
  }}
>
  <div>
    <Input
      className="py-1 px-2"
      name="email"
      bind:value={email}
      type="email"
      placeholder="Email"
    />
    {#if clientErrors.email}
      <Typography size="details" color="error" className="mt-1 text-left">
        {clientErrors.email}
      </Typography>
    {/if}
    {#if isMissingEmail}
      <Typography size="details" color="error" className="mt-1 text-left">
        {form.message}
      </Typography>
    {/if}
  </div>
  <div>
    <Input
      className="py-1 px-2"
      name="password"
      type="password"
      placeholder="Password"
      bind:value={password}
    />
    {#if clientErrors.password}
      <Typography size="details" color="error" className="mt-1 text-left">
        {clientErrors.password}
      </Typography>
    {/if}
    {#if isMissingPassword}
      <Typography size="details" color="error" className="mt-1 text-left">
        {form.message}
      </Typography>
    {/if}
  </div>
  <Button type="submit" color="primary"
    >{isRegisterPage ? 'Register' : 'Submit'}</Button
  >
  <Button
    type="button"
    onclick={() => goto(isRegisterPage ? '/login' : '/register')}
    color="secondary"
  >
    {isRegisterPage ? 'Go to login page' : 'Go to register page'}
  </Button>
  {#if !isMissingPassword && !isMissingEmail && form && form.message}
    <Typography size="details" color="error" className="mt-1 text-left">
      {form.message}
    </Typography>
  {/if}
</form>
