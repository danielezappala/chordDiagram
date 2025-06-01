import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outputDir: 'dist/types',
      tsConfigFilePath: path.resolve(__dirname, 'tsconfig.json'),
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),  // Puntiamo al file index.ts invece di lib.ts
      name: 'ChordDiagramLibrary',
      fileName: (format) => {
        if (format === 'es') {
          return 'chord-diagram-library.es.js';
        }
        return 'chord-diagram-library.umd.js';
      },
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer-motion', 'tailwind-scrollbar'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'motion',
          'tailwind-scrollbar': 'tailwindScrollbar'
        },
        sourcemapExcludeSources: true
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    reportCompressedSize: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});