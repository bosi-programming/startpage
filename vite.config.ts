import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  // @ts-expect-error error
  plugins: [sveltekit()],
  ssr: {
    external: ['reflect-metadata'],
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
