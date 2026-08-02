import { MerklApi } from '@merkl/api';

const base =
  typeof window !== 'undefined' ? `${window.location.origin}/api/merkl` : 'https://api.merkl.xyz';

export const MERKL_PROXY_BASE = base;

export const merklClient = MerklApi(base).v4;
