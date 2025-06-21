import { Address, zeroAddress } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';

import { envVar } from './environment';

export const BACKING_POOL_ADDRESS: Address = {
  [mainnet.id]: zeroAddress,
  [sepolia.id]: '0x79a512FB94B555339a11851F9928F40C61cd0FBC' as Address,
  [hardhat.id]: zeroAddress,
}[envVar.chainId as 1 | 31337 | 11155111];

export const UNISWAP_V4_QUOTER_ADDRESS: Address = {
  [mainnet.id]: '0x52f0e24d1c21c8a0cb1e5a5dd6198556bd9e1203' as Address,
  [sepolia.id]: '0x61b3f2011a92d183c7dbadbda940a7555ccf9227' as Address,
  [hardhat.id]: zeroAddress,
}[envVar.chainId as 1 | 31337 | 11155111];

export const UNISWAP_V4_ROUTER_ADDRESS: Address = {
  [mainnet.id]: '0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af' as Address,
  [sepolia.id]: '0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b' as Address,
  [hardhat.id]: zeroAddress,
}[envVar.chainId as 1 | 31337 | 11155111];