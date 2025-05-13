import { Address, zeroAddress } from 'viem';
import { hardhat, mainnet } from 'viem/chains';

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
  [hardhat.id]: [
    {
      address: '0x04C89607413713Ec9775E14b954286519d836FEf',
      symbol: 'TEST',
      decimals: 20,
    },
    {
      address: '0x4C4a2f8c81640e47606d3fd77B353E87Ba015584',
      symbol: 'TEST1',
      decimals: 18,
    },
    {
      address: '0x21dF544947ba3E8b3c32561399E88B52Dc8b2823',
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
    symbol: 'USD1',
  },
  [hardhat.id]: {
    address: '0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43',
    decimals: 18,
    symbol: 'USD1',
  },
};

export const BACKED_TOKEN = BACKED_TOKENS[chainId];

export const ALL_SUPPORTED_TOKENS = [...SUPPORTED_RESERVE_ASSETS, BACKED_TOKEN];
export const NORMALIZED_ASSET_DECIMALS = 18;
