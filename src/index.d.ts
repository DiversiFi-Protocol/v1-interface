/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string | undefined;
  readonly VITE_CHAIN_ID: string | undefined;
  readonly VITE_BACKING_POOL_ADDRESS: string | undefined;
  readonly VITE_APP_ALCHEMY_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
