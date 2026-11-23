import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('app.html', () => {
  it('should not use inline styles, which the CSP style-src blocks', () => {
    const html = readFileSync(new URL('./app.html', import.meta.url), 'utf8');
    expect(html).not.toMatch(/\sstyle=/);
  });
});
