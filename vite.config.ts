// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';


// Assicura che i percorsi siano risolti correttamente anche in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
    }) as unknown as Plugin,
  ],
  build: {
    // Non minificare il codice per agevolare il debug
    minify: false,
    sourcemap: true,
    // Configurazione semplificata della libreria
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ChordDiagramLibrary',
      fileName: 'chord-diagram-library',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Dichiara esplicitamente tutte le dipendenze come esterne
      external: ['react', 'react-dom', 'framer-motion'],
      output: {
        // Utilizza dei globals per garantire che React sia correttamente condiviso
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'FramerMotion',
        },
        // Ottimizza per la compatibilità delle dipendenze esterne
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});