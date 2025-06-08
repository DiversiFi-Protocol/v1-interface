import { Address, zeroAddress } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';

import { envVar } from './environment';

export const BACKING_POOL_ADDRESS: Address = {
  [mainnet.id]: zeroAddress,
  [sepolia.id]: '0xeFaa63Afc69871438062218eB123973A66732dAF' as Address,
  [hardhat.id]: zeroAddress,
}[envVar.chainId as 1 | 31337 | 11155111];
