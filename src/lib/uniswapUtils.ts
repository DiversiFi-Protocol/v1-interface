import { Address, Hash, keccak256, encodeAbiParameters, toHex, Chain, Hex } from 'viem';

import uniswapV4Quoter from '@/abi/uniswapV4Quoter';
import uniswapV4Router from '@/abi/uniswapV4Router';
import { UNISWAP_V4_QUOTER_ADDRESS, UNISWAP_V4_ROUTER_ADDRESS } from '@/constants/contracts';
import {
  PoolKey,
  FEE_TO_TICK_SPACING,
  SingleQuoteCall,
  SingleSwapWrite,
  Commands,
  Actions,
  SwapFee,
} from '@/constants/uniswap';

function compareAddresses(a: Address, b: Address): number {
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  return aBig < bBig ? -1 : aBig > bBig ? 1 : 0;
}

export function getPoolKey({
  token0,
  token1,
  fee = 100,
}: {
  token0: Address;
  token1: Address;
  fee?: SwapFee;
}): PoolKey {
  let currency0: Address;
  let currency1: Address;
  if (compareAddresses(token0, token1) < 0) {
    currency0 = token0;
    currency1 = token1;
  } else if (compareAddresses(token0, token1) > 0) {
    currency0 = token1;
    currency1 = token0;
  } else {
    throw new Error('addresses must be different to get a valid poolKey');
  }

  return {
    currency0,
    currency1,
    fee,
    tickSpacing: FEE_TO_TICK_SPACING[fee],
    hooks: '0x0000000000000000000000000000000000000000',
  };
}

export function getPoolId(key: PoolKey): Hash {
  return keccak256(
    encodeAbiParameters(
      [
        { type: 'address' }, // token0
        { type: 'address' }, // token1
        { type: 'uint24' }, // fee
        { type: 'int24' }, // tickSpacing
        { type: 'address' }, // hooks
      ],
      [key.currency0, key.currency1, key.fee, key.tickSpacing, key.hooks]
    )
  );
}

/*
  returns everything required to call useContractRead()
  the contract call will return two values: [expectedOutput, gasUsed]
*/
export function prepareQuoteExactInputSingle({
  inputToken,
  outputToken,
  exactInput,
  fee = 100,
}: {
  inputToken: Address;
  outputToken: Address;
  exactInput: bigint;
  fee?: SwapFee;
}): SingleQuoteCall {
  const poolKey = getPoolKey({ token0: inputToken, token1: outputToken, fee });
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0;
  const singleQuoteArgs = [
    {
      poolKey,
      zeroForOne,
      exactAmount: exactInput,
      hookData: '0x',
    },
  ];

  return {
    address: UNISWAP_V4_QUOTER_ADDRESS,
    abi: uniswapV4Quoter,
    functionName: 'quoteExactInputSingle',
    args: singleQuoteArgs,
  };
}

/*
  returns everything required to call useContractRead()
  the contract call will return two values: [expectedOutput, gasUsed]
*/
export function prepareQuoteExactOutputSingle({
  inputToken,
  outputToken,
  exactOutput,
  fee = 100,
}: {
  inputToken: Address;
  outputToken: Address;
  exactOutput: bigint;
  fee?: SwapFee;
}): SingleQuoteCall {
  const poolKey = getPoolKey({ token0: inputToken, token1: outputToken, fee });
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0;
  const singleQuoteArgs = [
    {
      poolKey,
      zeroForOne,
      exactAmount: exactOutput,
      hookData: '0x',
    },
  ];

  return {
    address: UNISWAP_V4_QUOTER_ADDRESS,
    abi: uniswapV4Quoter,
    functionName: 'quoteExactOutputSingle',
    args: singleQuoteArgs,
  };
}

export function prepareSwapExactInputSingle({
  caller,
  chain,
  inputToken,
  outputToken,
  exactInput,
  minimumOutput,
  deadline = BigInt(Math.floor(Date.now() / 1000)) + 25n, // 2 blocks
  fee = 100,
}: {
  caller: Address;
  chain: Chain;
  inputToken: Address;
  outputToken: Address;
  exactInput: bigint;
  minimumOutput: bigint;
  deadline?: bigint;
  fee?: SwapFee;
}): SingleSwapWrite {
  const poolKey = getPoolKey({ token0: inputToken, token1: outputToken, fee });
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0;

  // 1. commands = abi.encodePacked(uint8(Commands.V4_SWAP))
  const commands = new Uint8Array([Commands.V4_SWAP]);

  // 2. actions = abi.encodePacked(…)
  const actions = new Uint8Array([
    Actions.SWAP_EXACT_IN_SINGLE,
    Actions.SETTLE_ALL,
    Actions.TAKE_ALL,
  ]);

  // 3. params[0]: ExactInputSingleParams encoded
  const exactInParams = encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          {
            name: 'poolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', type: 'address' },
              { name: 'currency1', type: 'address' },
              { name: 'fee', type: 'uint24' },
              { name: 'tickSpacing', type: 'int24' },
              { name: 'hooks', type: 'address' },
            ],
          },
          { name: 'zeroForOne', type: 'bool' },
          { name: 'amountIn', type: 'uint128' },
          { name: 'amountOutMinimum', type: 'uint128' },
          { name: 'hookData', type: 'bytes' },
        ],
      },
    ],
    [
      {
        poolKey,
        zeroForOne,
        amountIn: exactInput,
        amountOutMinimum: minimumOutput,
        hookData: '0x',
      },
    ]
  );

  // 4. params[1] = encode(key.currency0, amountIn)
  const param1 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency0, exactInput]
  );

  // 5. params[2] = encode(key.currency1, minAmountOut)
  const param2 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency1, minimumOutput]
  );

  // 6. inputs = [abi.encode(actions, params)]
  const params = [exactInParams, param1, param2];
  const actionParams: Hex[] = [];

  actionParams.push(
    encodeAbiParameters(
      [
        { type: 'bytes' }, // encoded actions
        { type: 'bytes[]' }, // array of params
      ],
      [toHex(actions), params]
    )
  );

  return {
    address: UNISWAP_V4_ROUTER_ADDRESS,
    abi: uniswapV4Router,
    functionName: 'execute',
    args: [toHex(commands), actionParams, deadline],
    account: caller,
    chain,
  };
}

export function prepareSwapExactOutputSingle({
  caller,
  chain,
  inputToken,
  outputToken,
  exactOutput,
  maximumInput,
  deadline = BigInt(Math.floor(Date.now() / 1000)) + 25n, // 2 blocks
  fee = 100,
}: {
  caller: Address;
  chain: Chain;
  inputToken: Address;
  outputToken: Address;
  exactOutput: bigint;
  maximumInput: bigint;
  deadline?: bigint;
  fee?: SwapFee;
}): SingleSwapWrite {
  const poolKey = getPoolKey({ token0: inputToken, token1: outputToken, fee });
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0;

  // 1. commands = abi.encodePacked(uint8(Commands.V4_SWAP))
  const commands = new Uint8Array([Commands.V4_SWAP]);

  // 2. actions = abi.encodePacked(…)
  const actions = new Uint8Array([
    Actions.SWAP_EXACT_OUT_SINGLE,
    Actions.SETTLE_ALL,
    Actions.TAKE_ALL,
  ]);

  // 3. params[0]: ExactInputSingleParams encoded
  const exactInParams = encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          {
            name: 'poolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', type: 'address' },
              { name: 'currency1', type: 'address' },
              { name: 'fee', type: 'uint24' },
              { name: 'tickSpacing', type: 'int24' },
              { name: 'hooks', type: 'address' },
            ],
          },
          { name: 'zeroForOne', type: 'bool' },
          { name: 'amountOut', type: 'uint128' },
          { name: 'amountInMaximum', type: 'uint128' },
          { name: 'hookData', type: 'bytes' },
        ],
      },
    ],
    [
      {
        poolKey,
        zeroForOne,
        amountOut: exactOutput,
        amountInMaximum: maximumInput,
        hookData: '0x',
      },
    ]
  );

  // 4. params[1] = encode(key.currency0, amountIn)
  const param1 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency0, exactOutput]
  );

  // 5. params[2] = encode(key.currency1, minAmountOut)
  const param2 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency1, maximumInput]
  );

  // 6. inputs = [abi.encode(actions, params)]
  const params = [exactInParams, param1, param2];
  const actionParams: Hex[] = [];

  actionParams.push(
    encodeAbiParameters(
      [
        { type: 'bytes' }, // encoded actions
        { type: 'bytes[]' }, // array of params
      ],
      [toHex(actions), params]
    )
  );

  return {
    address: UNISWAP_V4_ROUTER_ADDRESS,
    abi: uniswapV4Router,
    functionName: 'execute',
    args: [toHex(commands), actionParams, deadline],
    chain,
    account: caller,
  };
}
