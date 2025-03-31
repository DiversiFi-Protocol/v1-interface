import { Address } from 'viem';
import { mainnet } from 'viem/chains';

export const SWAPPABLE_ASSETS = {
  USDC: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    image: '/currencies/usdc.png',
  },
  USDT: {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    image: '/currencies/usdt.png',
  },
  DAI: {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    image: '/currencies/dai.png',
  },
  USD1: {
    name: 'USD1',
    symbol: 'USD1',
    decimals: 18,
    image: '/currencies/dai.png',
  },
};

export const TOKEN_ADDRESSES: {
  [asset: string]: {
    [chainId: number]: Address;
  };
} = {
  USDC: {
    [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  USDT: {
    [mainnet.id]: '0xdAC17f958d2ee523a2206206994597c13d831ec7',
  },
  DAI: {
    [mainnet.id]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
};
