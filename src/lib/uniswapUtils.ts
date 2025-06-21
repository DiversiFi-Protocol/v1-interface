import uniswapV4Quoter from "@/abi/uniswapV4Quoter";
import uniswapV4Router from "@/abi/uniswapV4Router";
import { UNISWAP_V4_QUOTER_ADDRESS, UNISWAP_V4_ROUTER_ADDRESS } from "@/constants/contracts";
import { 
  Address, 
  Hash, 
  zeroAddress, 
  keccak256, 
  encodeAbiParameters, 
  Abi,
  Chain,
  toHex
} from "viem";

export const Commands = { V4_SWAP: 0x10 }
export const Actions = {
  SWAP_EXACT_IN_SINGLE: 0x06,
  SWAP_EXACT_OUT_SINGLE: 0x08,
  SETTLE_ALL: 0x0C,
  TAKE_ALL: 0x0D,
}

export type poolKey = {
  currency0: Address;
  currency1: Address;
  fee: number;          // uint24
  tickSpacing: number;  // int24
  hooks: Address;
}

export type singleQuoteCall = {
  address: Address,
  abi: Abi,
  functionName: string,
  args: (string | bigint | boolean | poolKey)[]
}

export type singleSwapWrite = {
  address: Address,
  abi: Abi,
  functionName: string,
  args: (string | bigint | boolean | poolKey)[],
  chain: Chain,
  account: Address
}

/*
  const txHash = await signer.writeContract({
    address: asset.address,
    abi: erc20Abi,
    functionName: 'approve',
    args: [BACKING_POOL_ADDRESS, allowMaxApproval ? maxUint256 : amountNeededBigInt],
    chain,
    account: address,
  });
*/

export const FEE_TO_TICK_SPACING: Record<number, number> = {
  100:    1,    // 0.01% fee
  500:    10,   // 0.05% fee
  3000:   60,   // 0.3% fee
  10000:  200,  // 1.0% fee
};

export function getPoolKey(
  token0:Address,
  token1:Address,
  fee:number = 100,
  hooks:Address = zeroAddress
):poolKey {
  let currency0:Address
  let currency1:Address
  if(compareAddresses(token0, token1) < 0) {
		currency0 = token0
		currency1 = token1
  } else if(compareAddresses(token0, token1) > 0) {
		currency0 = token1
	 	currency1 = token0
 	} else {
		throw new Error("addresses must be different to get a valid poolKey")
	}

  return {
    currency0,
    currency1,
    fee,
    tickSpacing: FEE_TO_TICK_SPACING[fee],
    hooks
  }
}

export function getPoolId(key:poolKey):Hash {
    return keccak256(
    encodeAbiParameters(
      [
        { type: 'address' },   // token0
        { type: 'address' },   // token1
        { type: 'uint24' },    // fee
        { type: 'int24' },     // tickSpacing
        { type: 'address' },   // hooks
      ],
      [
        key.currency0,
        key.currency1,
        key.fee,
        key.tickSpacing,
        key.hooks,
      ]
    )
  )
}

/*
  returns everything required to call useContractRead()
  the contract call will return two values: [expectedOutput, gasUsed]
*/
export function prepareQuoteExactInputSingle(
  inputToken:Address,
  outputToken:Address,
  exactInput:bigint,
  fee:number = 100,
  hooks:Address = zeroAddress
):singleQuoteCall {
  const poolKey = getPoolKey(inputToken, outputToken, fee, hooks)
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0
  const singleQuoteArgs = [
    poolKey,
    zeroForOne,
    exactInput,
    '0x'
  ]

  return {
    address: UNISWAP_V4_QUOTER_ADDRESS,
    abi: uniswapV4Quoter,
    functionName: 'quoteExactInputSingle',
    args: singleQuoteArgs
  }
}

/*
  returns everything required to call useContractRead()
  the contract call will return two values: [expectedOutput, gasUsed]
*/
export function prepareQuoteExactOutputSingle(
  inputToken:Address,
  outputToken:Address,
  exactOutput:bigint,
  fee:number = 100,
  hooks:Address = zeroAddress
):singleQuoteCall {
  const poolKey = getPoolKey(inputToken, outputToken, fee, hooks)
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0
  const singleQuoteArgs = [
    poolKey,
    zeroForOne,
    exactOutput,
    '0x'
  ]

  return {
    address: UNISWAP_V4_QUOTER_ADDRESS,
    abi: uniswapV4Quoter,
    functionName: 'quoteExactOutputSingle',
    args: singleQuoteArgs
  }
}

export function prepareSwapExactInputSingle(
  caller:Address,
  inputToken:Address,
  outputToken:Address,
  exactInput:bigint,
  minimumOutput:bigint,
  deadline:bigint = BigInt(Math.floor(Date.now() / 1000)) + 25n,//two blocks
  fee:number = 100,
  hooks:Address = zeroAddress
):singleSwapWrite {
  const poolKey = getPoolKey(inputToken, outputToken, fee, hooks)
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0

  // 1. commands = abi.encodePacked(uint8(Commands.V4_SWAP))
  const commands = new Uint8Array([Commands.V4_SWAP])

  // 2. actions = abi.encodePacked(…)
  const actions = new Uint8Array([
    Actions.SWAP_EXACT_IN_SINGLE,
    Actions.SETTLE_ALL,
    Actions.TAKE_ALL,
  ])

    // 3. params[0]: ExactInputSingleParams encoded
  const exactInParams = encodeAbiParameters(
    [
      { type: 'tuple', components: [
        { name: 'poolKey', type: 'tuple', components: [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickSpacing', type: 'int24' },
          { name: 'hooks', type: 'address' },
        ]},
        { name: 'zeroForOne', type: 'bool' },
        { name: 'amountIn', type: 'uint128' },
        { name: 'amountOutMinimum', type: 'uint128' },
        { name: 'hookData', type: 'bytes' },
      ] },
    ],
    [{
      poolKey,
      zeroForOne,
      amountIn: exactInput,
      amountOutMinimum: minimumOutput,
      hookData: '0x',
    }]
  )

  // 4. params[1] = encode(key.currency0, amountIn)
  const param1 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency0, exactInput]
  )

  // 5. params[2] = encode(key.currency1, minAmountOut)
  const param2 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency1, minimumOutput]
  )

  // 6. inputs = [abi.encode(actions, params)]
  const input = encodeAbiParameters(
    [
      { type: 'bytes' },  // encoded actions
      { type: 'bytes[]' }, // array of params
    ],
    [toHex(actions), [exactInParams, param1, param2]]
  )

  return {
    address: UNISWAP_V4_ROUTER_ADDRESS,
    abi: uniswapV4Router,
    functionName: 'execute',
    args: [toHex(commands), input, deadline],
    account: caller
  }
}

export function prepareSwapExactOutputSingle(
  caller:Address,
  inputToken:Address,
  outputToken:Address,
  exactOutput:bigint,
  maximumInput:bigint,
  deadline:bigint = BigInt(Math.floor(Date.now() / 1000)) + 25n,//two blocks
  fee:number = 100,
  hooks:Address = zeroAddress
):singleSwapWrite {
  const poolKey = getPoolKey(inputToken, outputToken, fee, hooks)
  const zeroForOne = compareAddresses(inputToken, outputToken) < 0

  // 1. commands = abi.encodePacked(uint8(Commands.V4_SWAP))
  const commands = new Uint8Array([Commands.V4_SWAP])

  // 2. actions = abi.encodePacked(…)
  const actions = new Uint8Array([
    Actions.SWAP_EXACT_OUT_SINGLE,
    Actions.SETTLE_ALL,
    Actions.TAKE_ALL,
  ])

    // 3. params[0]: ExactInputSingleParams encoded
  const exactInParams = encodeAbiParameters(
    [
      { type: 'tuple', components: [
        { name: 'poolKey', type: 'tuple', components: [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickSpacing', type: 'int24' },
          { name: 'hooks', type: 'address' },
        ]},
        { name: 'zeroForOne', type: 'bool' },
        { name: 'amountOut', type: 'uint128' },
        { name: 'amountInMaximum', type: 'uint128' },
        { name: 'hookData', type: 'bytes' },
      ] },
    ],
    [{
      poolKey,
      zeroForOne,
      amountOut: exactOutput,
      amountInMaximum: maximumInput,
      hookData: '0x',
    }]
  )

  // 4. params[1] = encode(key.currency0, amountIn)
  const param1 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency0, exactOutput]
  )

  // 5. params[2] = encode(key.currency1, minAmountOut)
  const param2 = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint128' }],
    [poolKey.currency1, maximumInput]
  )

  // 6. inputs = [abi.encode(actions, params)]
  const input = encodeAbiParameters(
    [
      { type: 'bytes' },  // encoded actions
      { type: 'bytes[]' }, // array of params
    ],
    [toHex(actions), [exactInParams, param1, param2]]
  )

  return {
    address: UNISWAP_V4_ROUTER_ADDRESS,
    abi: uniswapV4Router,
    functionName: 'execute',
    args: [toHex(commands), input, deadline],
    account: caller
  }
}

function compareAddresses(a: Address, b: Address): number {
  const aBig = BigInt(a)
  const bBig = BigInt(b)
  return aBig < bBig ? -1 : aBig > bBig ? 1 : 0
}
