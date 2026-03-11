import fs from 'fs';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

type WranglerConfig = {
  env?: Record<
    string,
    {
      vars?: Record<string, string>;
    }
  >;
};

const wranglerConfigPath = path.resolve(__dirname, './wrangler.jsonc');

function stripJsonComments(contents: string) {
  return contents
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

function loadWranglerVars(targetEnv: string) {
  const rawConfig = fs.readFileSync(wranglerConfigPath, 'utf8');
  const parsedConfig = JSON.parse(stripJsonComments(rawConfig)) as WranglerConfig;
  const vars = parsedConfig.env?.[targetEnv]?.vars;

  if (!vars) {
    throw new Error(`Missing Wrangler vars for CLOUDFLARE_ENV="${targetEnv}" in wrangler.jsonc`);
  }

  return vars;
}

// https://vite.dev/config/
export default defineConfig(() => {
  const cloudflareEnv = process.env.CLOUDFLARE_ENV ?? 'mainnet';
  const wranglerVars = loadWranglerVars(cloudflareEnv);
  const viteVars = Object.fromEntries(
    Object.entries(wranglerVars)
      .filter(([key]) => key.startsWith('VITE_'))
      .map(([key, value]) => [key, process.env[key] ?? value]),
  );

  return {
    define: Object.fromEntries(
      Object.entries(viteVars).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
    ),
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            floatPrecision: 2,
          },
        },
        include: '**/*.svg',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
