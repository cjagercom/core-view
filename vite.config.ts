import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: 'suppress-empty-chunk-warnings',
      onLog(_level, log) {
        if (log.code === 'EMPTY_BUNDLE') return false;
      },
    },
  ],
});
