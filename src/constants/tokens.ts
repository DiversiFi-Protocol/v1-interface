import { Address } from 'viem';
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
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
    },
    {
      address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
      symbol: 'USDS',
      decimals: 18,
    },
    {
      address: '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f',
      symbol: 'GHO',
      decimals: 18,
    },
    {
      address: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
      symbol: 'FDUSD',
      decimals: 18,
    },
    {
      address: '0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29',
      symbol: 'FRXUSD',
      decimals: 18,
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
    // {
    //   address: '0xbe2Ad83eAa604721AC467390dd86bEB86E1DF3Bd',
    //   symbol: 'TK3',
    //   decimals: 18,
    // },
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
    address: '0xDF100b8ABd3cd41fC5cC1236AD7c6629A901AfBf',
    decimals: 18,
    symbol: 'DFiUSD',
  },
  [sepolia.id]: {
    address: '0xDF100b8ABd3cd41fC5cC1236AD7c6629A901AfBf',
    decimals: 18,
    symbol: 'DFiUSD',
  },
  [hardhat.id]: {
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    decimals: 18,
    symbol: 'DFiUSD',
  },
};

export const BACKED_TOKEN = BACKED_TOKENS[chainId];

export const ALL_SUPPORTED_TOKENS = [...SUPPORTED_RESERVE_ASSETS, BACKED_TOKEN];
export const NORMALIZED_ASSET_DECIMALS = 18;

export const DFI_MERKL_POINT_TOKEN = {
  address: '0x15aa8b6E1e4E09F4D68E45A5ddeE77bD22C6d44a',
  symbol: 'Diversifi-points',
  decimals: 18,
};
