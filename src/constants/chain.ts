import { Chain } from 'viem';
import { hardhat, mainnet, sepolia } from 'viem/chains';

import { envVar } from './environment';

export const chainId: 1 | 31337 | 11155111 = envVar.chainId;

export const chain: Chain = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
  [hardhat.id]: hardhat,
}[chainId];
