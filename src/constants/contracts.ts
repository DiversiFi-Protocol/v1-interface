import { Address, zeroAddress } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';

import { envVar } from './environment';

export const BACKING_POOL_ADDRESS: Address = {
  [mainnet.id]: zeroAddress,
  [sepolia.id]: '0x79a512FB94B555339a11851F9928F40C61cd0FBC' as Address,
  [hardhat.id]: zeroAddress,
}[envVar.chainId as 1 | 31337 | 11155111];
