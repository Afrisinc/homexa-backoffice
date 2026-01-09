import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function runtimeConfigPlugin(): Plugin {
  return {
    name: 'runtime-config',

    generateBundle() {
      const configPath = path.resolve(__dirname, './public/config.json');
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        this.emitFile({
          type: 'asset',
          fileName: 'config.json',
          source: configContent,
        });
      }
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html: string) {
        const preloadLink = `<link rel="preload" href="/config.json" as="fetch" crossorigin>`;
        if (!html.includes(preloadLink)) {
          return html.replace('</head>', `${preloadLink}\n</head>`);
        }
        return html;
      },
    },

    writeBundle() {
      const distConfigPath = path.resolve(__dirname, './dist/config.json');
      if (!fs.existsSync(distConfigPath)) {
        console.warn('Warning: config.json not found in dist/');
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    runtimeConfigPlugin(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/auth': path.resolve(__dirname, './src/auth'),
      '@/routes': path.resolve(__dirname, './src/routes'),
    },
  },

  build: {
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'config.json') {
            return 'config.json';
          }
          if (assetInfo.name && assetInfo.name.includes('.woff')) {
            return 'fonts/[name][extname]';
          }
          if (assetInfo.name && /\.(jpg|png|gif|svg)$/i.test(assetInfo.name)) {
            return 'images/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
