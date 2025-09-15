import { useEffect, useMemo, useState } from 'react';

import { ArrowUpDownIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';

import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS, SupportedAsset } from '@/constants/tokens';

import { SwapStep, useGetSwapQuote, useSwapSteps } from '@/hooks/BackingPool/swapHook';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

import FormInput from './FormInput';

const DEFAULT_INPUT_TOKEN = SUPPORTED_RESERVE_ASSETS[0];
const DEFAULT_OUTPUT_TOKEN = BACKED_TOKEN;

export default function SwapForm({
  hideHeader = false,
  withCard = true,
}: {
  hideHeader?: boolean;
  withCard?: boolean;
}) {
  const [inputAmount, setInputAmount] = useState('');
  const [inputToken, setInputToken] = useState<SupportedAsset>(DEFAULT_INPUT_TOKEN);
  const debouncedInputAmount = useDebounce(inputAmount);
  const [outputToken, setOutputToken] = useState<SupportedAsset>(DEFAULT_OUTPUT_TOKEN);

  const { balances } = useAssetBalances();

  const mapOfBalances = useMemo(() => {
    return objectFromEntries((balances ?? EMPTY_ARR).map((a) => [a.address, a]));
  }, [balances]);

  const { inputWalletBalance, outputWalletBalance } = useMemo(
    () => ({
      inputWalletBalance: MustBigNumber(mapOfBalances[inputToken.address]?.balance).toFormat(2, {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
      }),
      outputWalletBalance: MustBigNumber(mapOfBalances[outputToken.address]?.balance).toFormat(2, {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
      }),
    }),
    [inputToken, outputToken, mapOfBalances]
  );

  const swapQuote = useGetSwapQuote({
    assetIn: inputToken,
    assetOut: outputToken,
    amount: debouncedInputAmount,
  });

  const { amountOutBigInt, amountOut = '' } = swapQuote?.data ?? {};

  const stepsQuery = useSwapSteps({
    assetIn: inputToken,
    assetOut: outputToken,
    amount: debouncedInputAmount,
    minAmountOut: amountOutBigInt ?? 0n * 9995n / 10000n, //5 bps slippage tolerance
  });

  const signer = useWalletClient();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [swapSteps, setSwapSteps] = useState<SwapStep[]>();
  const [stepError, setStepError] = useState<unknown>();
  const [isAwaitingWalletAction, setIsAwaitingWalletAction] = useState(false);

  useEffect(() => {
    async function autoPromptSteps() {
      if (
        swapSteps == null ||
        swapSteps.length === 0 ||
        swapSteps[currentStepIdx] == null ||
        signer.data == null
      ) {
        return;
      }

      const { success, error } = await swapSteps[currentStepIdx].execute(signer.data);

      if (success && currentStepIdx < swapSteps.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else if (success) {
        setInputAmount('');
      }

      if (!success && error) {
        setStepError(error);
      }
    }

    autoPromptSteps();
  }, [swapSteps, currentStepIdx, signer.data]);

  useEffect(() => {
    // reset current burn steps if the input has changed
    setSwapSteps(undefined);
    setCurrentStepIdx(0);
    setIsAwaitingWalletAction(false);
    setStepError(undefined);
  }, [debouncedInputAmount]);

  const onSwap = async () => {
    const steps = stepsQuery.data;
    const currentStep = steps?.at(0);
    if (steps == null || steps.length === 0 || !signer.data || !currentStep) {
      toast.error('Something went wrong');
      return;
    }

    setStepError(undefined);
    setIsAwaitingWalletAction(true);

    if (steps.length === 1) {
      const { success, error } = await currentStep.execute(signer.data);
      if (success) {
        setInputAmount('');
      } else {
        setIsAwaitingWalletAction(false);
        setStepError(error);
      }
    } else {
      setSwapSteps(steps);
    }
  };

  const onRetry = async () => {
    const step = swapSteps?.[currentStepIdx];
    if (step == null || signer.data == null) return;

    setStepError(undefined);
    const { success, error } = await step.execute(signer.data);

    if (success) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setStepError(error);
    }
  };

  const switchAssetButton = (
    <Button
      className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-input text-textPrimary border-card border-[3px] border-solid rounded-[50%] size-12"
      variant="ghost"
      disabled={isAwaitingWalletAction}
      onClick={() => {
        const tmp = inputToken;
        setInputToken(outputToken);
        setOutputToken(tmp);
      }}
    >
      <ArrowUpDownIcon className="size-4" />
    </Button>
  );

  const swapView = (
    <div className="flexColumn gap-1 relative">
      <FormInput
        label="In"
        className="hover:brightness-110 [input:focus]:brightness-110"
        token={inputToken.symbol}
        onChange={setInputAmount}
        value={inputAmount}
        onSelectToken={(asset) => {
          if (asset.address === outputToken.address) {
            setOutputToken(inputToken);
          }

          setInputToken(asset);
        }}
        balance={inputWalletBalance}
      />
      <FormInput
        label="Out"
        disabled
        token={outputToken.symbol}
        onChange={() => {}}
        value={amountOut}
        onSelectToken={(asset) => {
          if (asset.address === inputToken.address) {
            setInputToken(outputToken);
          }

          setOutputToken(asset);
        }}
        balance={outputWalletBalance}
      />
      {switchAssetButton}
    </div>
  );

  const shouldDisableSwap =
    signer.data == null || stepsQuery.data?.length === 0 || debouncedInputAmount.trim() === '';

  const buttonText = useMemo(() => {
    if (debouncedInputAmount === '') {
      return 'Enter Amount';
    }

    if (signer.data == null) {
      return 'Connect Wallet';
    }

    if (stepsQuery.data?.length === 0) {
      return 'Retrieving Quote...';
    }

    return 'Swap';
  }, [signer.data, stepsQuery.data, debouncedInputAmount]);

  const swapButtonAndReceipt = (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="outline"
        isLoading={isAwaitingWalletAction || stepsQuery.isLoading}
        disabled={shouldDisableSwap}
        onClick={onSwap}
        className="w-full py-6 text-xl border border-border"
      >
        {buttonText}
      </Button>
      <div className="flex flex-col gap-2">
        {debouncedInputAmount.trim() !== '' && (
          <>
            <span className="flex-1 flex text-sm text-muted-foreground justify-between">
              <span>{inputToken.symbol}</span>
              <span className="font-mono">
                <span className="text-destructive">-</span>
                {MustBigNumber(debouncedInputAmount).toFormat(2)}
              </span>
            </span>
            <span className="flex-1 flex text-sm text-muted-foreground justify-between">
              <span>{outputToken.symbol}</span>
              <span className="font-mono">
                <span className="text-green-600">+</span>
                {MustBigNumber(amountOut).toFormat(2)}
              </span>
            </span>
          </>
        )}
        {swapQuote?.data && (
          <>
            <span className="flex-1 flex text-sm text-muted-foreground justify-between">
              <span>Network Cost (est.)</span>
              <span>${swapQuote.data.networkCost}</span>
            </span>
            <span className="flex-1 flex text-sm text-muted-foreground justify-between">
              <span>Fee</span>
              <span>${swapQuote.data.fee}</span>
            </span>
          </>
        )}
      </div>

      {swapSteps != null && (
        <div className="flex flex-col gap-2 border-t-[1px] border-border pt-2 mt-1 border-solid">
          <span className="text-sm text-muted-foreground">Steps:</span>

          {swapSteps?.map((step, i) => {
            const isCurrentStep = i === currentStepIdx;
            const stepNumber = i + 1;
            const error = isCurrentStep ? stepError : undefined;

            return (
              <span
                key={step.type}
                className="flex-1 flex text-sm text-muted-foreground justify-between"
              >
                <span>
                  {stepNumber}.{' '}
                  {
                    {
                      network: 'Switch Network',
                      approve: 'Set Approval',
                      'approve-permit2': 'Set Permit2 Approval',
                      swap: 'Swap',
                    }[step.type]
                  }
                </span>

                {isCurrentStep ? (
                  error == null ? (
                    <span>pending...</span>
                  ) : (
                    <a className="hover:underline" onClick={onRetry}>
                      Retry
                    </a>
                  )
                ) : i < currentStepIdx ? (
                  <CheckIcon className="size-3 text-green-500" />
                ) : null}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );

  if (withCard) {
    return (
      <Card>
        <CardHeader>{!hideHeader && <CardTitle>Swap</CardTitle>}</CardHeader>

        <CardContent className="flexColumn gap-1">{swapView}</CardContent>
        <CardFooter>{swapButtonAndReceipt}</CardFooter>
      </Card>
    );
  }

  return (
    <div className="flexColumn gap-2">
      {swapView}
      {swapButtonAndReceipt}
    </div>
  );
}
