import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    csp: {
      mode: 'hash',
      directives: {
        "default-src": ["none"],
        "script-src": ["self"],
        "style-src": ["self"],
        "img-src": ["self"],
        "font-src": ["self"],
        "connect-src": ["self"],
        "media-src": ["self"],
        "worker-src": ["self"],
        "child-src": ["self"],
        "manifest-src": ["self"],
        "object-src": ["none"],
        "frame-src": ["none"],
      }
    },
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      "@": "src/",
      "@/*": "src/*"
    },
    env: {
      privatePrefix: 'PRIVATE',
      publicPrefix: 'PUBLIC'
    }
  }
};

export default config;
