import { Chain } from 'viem';
import { hardhat, mainnet } from 'viem/chains';
import { envVar } from './environment';

export const chainId: 1 | 31337 = envVar.chainId;

export const chain: Chain = {
  [mainnet.id]: mainnet,
  [hardhat.id]: hardhat,
}[chainId];
