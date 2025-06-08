/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string | undefined;
  readonly VITE_CHAIN_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
