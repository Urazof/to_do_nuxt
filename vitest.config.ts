import { defineConfig } from 'vitest/config';
import path from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    css: {
      modules: false,
    },
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
        css: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'), // Adjust this if your source folder is not `src`
        },
    },
});