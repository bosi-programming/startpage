<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';

  const { Story } = defineMeta({
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
  });
</script>

<Story
  name="Primary"
  args={{
    title: 'Text',
    tags: ['test', 'react', 'banana'],
    content:'O React quer resolver problemas de performance, confiabilidade e segurança no frontend',
    reference:
      'KUMAR, Tejas. Fluent React: Build Fast, Performant, and Intuitive Web Applications',
  }}
/>
