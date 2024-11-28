import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform', // Tells esbuild to transform JSX in .js files
  },
});
