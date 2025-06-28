import { Address, Abi, Chain, Hex } from 'viem';

export const Commands = { V4_SWAP: 0x10 };
export const Actions = {
  SWAP_EXACT_IN_SINGLE: 0x06,
  SWAP_EXACT_OUT_SINGLE: 0x08,
  SETTLE_ALL: 0x0c,
  TAKE_ALL: 0x0d,
};

export type PoolKey = {
  currency0: Address;
  currency1: Address;
  fee: number; // uint24
  tickSpacing: number; // int24
  hooks: Address;
};

export type SingleQuoteCall = {
  address: Address;
  abi: Abi;
  functionName: string;
  args: {
    poolKey: PoolKey;
    zeroForOne: boolean;
    exactAmount: bigint;
    hookData: string;
  }[];
};

export type SingleSwapWrite = {
  address: Address;
  abi: Abi;
  functionName: string;
  args: (string | bigint | boolean | PoolKey | Hex[])[];
  chain: Chain;
  account: Address;
};

export type SwapFee = 100 | 500 | 3000 | 10000;

export const FEE_TO_TICK_SPACING: Record<SwapFee, number> = {
  100: 1, // 0.01% fee
  500: 10, // 0.05% fee
  3000: 60, // 0.3% fee
  10000: 200, // 1.0% fee
};
