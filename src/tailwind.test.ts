import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import config from '../tailwind.config';

async function buildUtilities(): Promise<string> {
  const result = await postcss([tailwindcss(config)]).process(
    '@tailwind utilities;',
    { from: undefined },
  );
  return result.css;
}

describe('tailwind config', () => {
  it('should generate the classes the design system Typography uses', async () => {
    const css = await buildUtilities();
    expect(css).toContain('.text-h2');
    expect(css).toContain('.dark\\:text-secondary-on-dark');
    expect(css).toContain('.dark\\:text-gray-93');
  });
});
