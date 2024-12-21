<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Typography from './Typography.svelte';

  const { Story } = defineMeta({
    title: 'Components/Typography',
    component: Typography,
    tags: ['autodocs'],
  });
</script>

<Story name="Primary" args={{ children: 'Text' }} />
