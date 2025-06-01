import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outputDir: 'dist',
      // entryRoot: 'src', // Not strictly needed if lib.entry is correctly picking up src/lib.ts
      // tsconfigPath: 'tsconfig.app.json' // Specify if not automatically found
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'ChordDiagramLibrary', // PascalCase name for UMD global variable
      fileName: (format) => `chord-diagram-library.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'FramerMotion'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true,
  }
});
