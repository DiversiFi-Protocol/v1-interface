import uniswapV4Quoter from "@/abi/uniswapV4Quoter";
import { UNISWAP_V4_QUOTER_ADDRESS } from "@/constants/contracts";
import { 
  Address, 
  Hash, 
  zeroAddress, 
  keccak256, 
  encodeAbiParameters, 
  Abi
} from "viem";

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

/*
{
  address: quoterAddress,
  abi: uniswapV4QuoterAbi,
  functionName: 'quoteExactInputSingle',
  args: [{
    tokenIn,
    tokenOut,
    fee,
    amountIn,
    sqrtPriceLimitX96,
  }],
}
*/

function compareAddresses(a: Address, b: Address): number {
  const aBig = BigInt(a)
  const bBig = BigInt(b)
  return aBig < bBig ? -1 : aBig > bBig ? 1 : 0
}

/*
func (remote *UniswapV4Remote) QuoteExactInputSingle(
	tokenIn common.Address,
	tokenOut common.Address,
	exactAmountIn *big.Int,
	blockNumber *big.Int,
) (amountOut *big.Int, gasCost *big.Int, err error) {
	//construct call params
	poolKey, err := uniswapV4.GetPoolKey(tokenIn, tokenOut)
	if err != nil {
		return nil, nil, werror.Wrap("failed to get pool key", err)
	}
	zeroForOne := tokenIn.Cmp(tokenOut) < 0
	quoteParams:= ABIs.QuoteExactSingleParams{
		PoolKey: poolKey,
		ZeroForOne: zeroForOne,
		ExactAmount: exactAmountIn,
		HookData: []byte{},
	}

	//execute call
	quoteCtx, cancel := context.WithTimeout(remote.ctx.GetContext(), 500 * time.Millisecond)
	defer cancel()
	opts := &bind.CallOpts{
		Pending: false,
		BlockNumber: blockNumber,
		Context: quoteCtx,
	}
	result, err := remote.uniswapV4QuoterContract.QuoteExactInputSingle(opts, quoteParams)
	if err != nil {
		return nil, nil, werror.Wrap("failed to exec UniV4.QuoteExactInputSingle", err)
	}

	return result.AmountOut, result.GasEstimate, nil
}

func (remote *UniswapV4Remote) QuoteExactOutputSingle(
	tokenIn common.Address,
	tokenOut common.Address,
	exactAmountOut *big.Int,
	blockNumber *big.Int,
) (amountOut *big.Int, gasCost *big.Int, err error) {
	//construct call params
	poolKey, err := uniswapV4.GetPoolKey(tokenIn, tokenOut)
	if err != nil {
		return nil, nil, werror.Wrap("failed to get pool key", err)
	}
	zeroForOne := tokenIn.Cmp(tokenOut) < 0
	quoteParams:= ABIs.QuoteExactSingleParams{
		PoolKey: poolKey,
		ZeroForOne: zeroForOne,
		ExactAmount: exactAmountOut,
		HookData: []byte{},
	}

	//execute call
	quoteCtx, cancel := context.WithTimeout(remote.ctx.GetContext(), 500 * time.Millisecond)
	defer cancel()
	opts := &bind.CallOpts{
		Pending: false,
		BlockNumber: blockNumber,
		Context: quoteCtx,
	}
	result, err := remote.uniswapV4QuoterContract.QuoteExactOutputSingle(opts, quoteParams)
	if err != nil {
		return nil, nil, werror.Wrap("failed to exec UniV4.QuoteExactOutputSingle", err)
	}

	return result.AmountIn, result.GasEstimate, nil
}

*/