import { Address, zeroAddress } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';

import { envVar } from './environment';

export const BACKING_POOL_ADDRESS: Address = (
  {
    [mainnet.id]: zeroAddress,
    [sepolia.id]: '0xd65351C3C3578B405397b3169D02454d8a69590a',
    [hardhat.id]: zeroAddress,
  } satisfies Record<number, Address>
)[envVar.chainId];

export const UNISWAP_V4_QUOTER_ADDRESS: Address = (
  {
    [mainnet.id]: '0x52f0e24d1c21c8a0cb1e5a5dd6198556bd9e1203',
    [sepolia.id]: '0x61b3f2011a92d183c7dbadbda940a7555ccf9227',
    [hardhat.id]: zeroAddress,
  } satisfies Record<number, Address>
)[envVar.chainId];

export const UNISWAP_V4_ROUTER_ADDRESS: Address = (
  {
    [mainnet.id]: '0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af',
    [sepolia.id]: '0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b',
    [hardhat.id]: zeroAddress,
  } satisfies Record<number, Address>
)[envVar.chainId];

export const PERMIT2_ADDRESS: Address = (
  {
    [mainnet.id]: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
    [sepolia.id]: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
    [hardhat.id]: zeroAddress,
  } satisfies Record<number, Address>
)[envVar.chainId];
