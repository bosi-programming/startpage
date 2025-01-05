<script lang="ts">
	import { Button, Input, Typography } from '@/components';
</script>

<Typography size="h1" className="mb-10" color="secondary">Login</Typography>
<form class="mx-auto grid gap-y-4">
	<Input className="py-1 px-2" type="email" placeholder="Email" />
	<Input className="py-1 px-2" type="password" placeholder="Password" />
	<Button type="submit" color="primary">Submit</Button>
</form>
