// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsConfigFilePath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ChordDiagramLibrary',
      fileName: (format) => `chord-diagram-library.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.ts')
      },
      external: ['react', 'react-dom', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'motion',
        },
      },
    },
  },
});