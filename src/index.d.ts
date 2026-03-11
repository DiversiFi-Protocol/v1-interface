/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string | undefined;
  readonly VITE_CHAIN_ID: string | undefined;
  readonly VITE_APP_ENV: string | undefined;
  readonly VITE_ALCHEMY_API_KEY: string | undefined;
  readonly VITE_GRAPH_API_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
