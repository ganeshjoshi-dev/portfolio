import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const projectRoot = __dirname;
const srcRoot = path.resolve(projectRoot, 'src');

export default defineConfig({
  root: srcRoot,
  plugins: [react()],
  css: { postcss: false },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(projectRoot, 'src/test/setup.ts')],
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': srcRoot,
    },
  },
});
