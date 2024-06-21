import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    manifest: true,
    lib: {
      entry: './src/MapboxStyleParser.ts',
      name: 'MapboxStyleParser',
      formats: ['iife'],
      fileName: 'mapboxStyleParser',
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        exports: 'named',
        generatedCode: 'es5',
        format: 'iife',
        sourcemap: true
      },
    }
  },
  define: {
    appName: 'GeoStyler'
  },
  server: {
    host: '0.0.0.0'
  }
});
