import { Address, zeroAddress } from 'viem';
import { hardhat, mainnet, sepolia } from 'viem/chains';

import { chainId } from '@/constants/chain';

export type SupportedAsset = {
  address: Address;
  symbol: string;
  decimals: number;
};

const ALL_SUPPORTED_RESERVE_ASSETS: Record<number, SupportedAsset[]> = {
  [mainnet.id]: [
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      address: '0xdAC17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      decimals: 6,
    },
  ],
  [sepolia.id]: [
    {
      address: '0xa814D1722125151c1BcD363E79a60d59BFb8F53e',
      symbol: 'TK0',
      decimals: 18,
    },
    {
      address: '0x1537e0CD1eAC6Dc732d0847139d9eACAEc323Db0',
      symbol: 'TK1',
      decimals: 20,
    },
    {
      address: '0x8E9c43c72ab3a49Fdd242e5BB44B337e94979dd1',
      symbol: 'TK2',
      decimals: 6,
    },
  ],
  [hardhat.id]: [
    {
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      symbol: 'TEST',
      decimals: 20,
    },
    {
      address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      symbol: 'TEST1',
      decimals: 18,
    },
    {
      address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      symbol: 'TEST2',
      decimals: 6,
    },
  ],
};

export const SUPPORTED_RESERVE_ASSETS = ALL_SUPPORTED_RESERVE_ASSETS[chainId];

const BACKED_TOKENS: Record<number, SupportedAsset> = {
  [mainnet.id]: {
    address: zeroAddress, // TODO: Add address
    decimals: 18,
    symbol: 'DFIUSD',
  },
  [sepolia.id]: {
    address: '0x2cEe63EFE079630b420Ed8fdF53c0a5c9aa880F2',
    decimals: 18,
    symbol: 'DFIUSD',
  },
  [hardhat.id]: {
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    decimals: 18,
    symbol: 'DFIUSD',
  },
};

export const BACKED_TOKEN = BACKED_TOKENS[chainId];

export const ALL_SUPPORTED_TOKENS = [...SUPPORTED_RESERVE_ASSETS, BACKED_TOKEN];
export const NORMALIZED_ASSET_DECIMALS = 18;
