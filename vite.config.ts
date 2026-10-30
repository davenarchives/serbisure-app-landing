import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'emit-subpage-entries',
      closeBundle() {
        const distDir = path.resolve('dist');
        const indexHtml = path.join(distDir, 'index.html');
        if (!fs.existsSync(indexHtml)) return;
        for (const subpage of ['support', 'privacy', 'terms']) {
          const dir = path.join(distDir, subpage);
          fs.mkdirSync(dir, { recursive: true });
          fs.copyFileSync(indexHtml, path.join(dir, 'index.html'));
        }
      },
    },
  ],
  server: { port: 3000 },
});
