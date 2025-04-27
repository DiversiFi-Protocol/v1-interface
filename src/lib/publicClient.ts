import { chainId } from '@/constants/chain';
import { mainnet } from 'viem/chains';

const alchemyKey = process.env.VITE_APP_ALCHEMY_KEY;

export function getPublicClient() {
  switch (chainId) {
    case mainnet.id:
    default:
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
  }
}
