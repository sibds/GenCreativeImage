import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { localGenerateApiPlugin } from './server/vitePlugin.js';
import { overlayUnexpandedSecrets } from './server/envSecrets.js';

export default defineConfig(({ mode }) => {
  let env = loadEnv(mode, process.cwd(), '');
  if (existsSync('.env')) {
    env = overlayUnexpandedSecrets(env, readFileSync('.env', 'utf8'));
  }

  if (!process.env.VITEST && env.VITE_OPENROUTER_API_KEY) {
    throw new Error(
      'VITE_OPENROUTER_API_KEY leaks into the client bundle. Use OPENROUTER_API_KEY instead.'
    );
  }

  return {
    plugins: [react(), localGenerateApiPlugin(env)],
    server: {
      host: true,
      port: 5173
    }
  };
});
