import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves project sites from /<repo-name>/.
  // Using a relative base makes the built assets work regardless of repo name.
  base: './',
});
