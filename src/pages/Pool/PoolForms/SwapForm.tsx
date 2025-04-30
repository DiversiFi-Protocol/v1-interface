import { useMemo, useState } from 'react';

import { ArrowUpDownIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';

import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS, SupportedAsset } from '@/constants/tokens';

import { useSimulateSwapGivenIn, useSwapSteps } from '@/hooks/BackingPool/swapHook';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

import FormInput from './FormInput';

const DEFAULT_INPUT_TOKEN = SUPPORTED_RESERVE_ASSETS[0];
const DEFAULT_OUTPUT_TOKEN = BACKED_TOKEN;

export default function SwapForm() {
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

  const swapSimulation = useSimulateSwapGivenIn({
    assetIn: inputToken,
    assetOut: outputToken,
    amount: debouncedInputAmount,
  });

  const { amountOut = '' } = swapSimulation?.data ?? {};

  const stepsQuery = useSwapSteps({
    assetIn: inputToken,
    assetOut: outputToken,
    amount: debouncedInputAmount,
    minAmountOut: amountOut,
  });

  const signer = useWalletClient();
  const [currentStep, setCurrentStep] = useState(0);

  const onSwap = async () => {
    const steps = stepsQuery.data;
    if (steps == null || steps.length === 0 || !signer.data || !steps[currentStep]) {
      toast.error('Something went wrong');
      return;
    }

    const { success } = await steps[currentStep].execute(signer.data);

    if (success && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (success) {
      setInputAmount('');
      setCurrentStep(0);
    }
  };

  const switchAssetButton = (
    <Button
      className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-input text-textPrimary border-card border-[3px]"
      variant="ghost"
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

  const shouldDisableSwap = stepsQuery.data?.length === 0 || debouncedInputAmount.trim() === '';

  const swapButton = (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="ghost"
        isLoading={stepsQuery.isLoading}
        disabled={shouldDisableSwap}
        onClick={onSwap}
        className="w-full py-6 text-xl border border-border"
      >
        Swap
      </Button>
      {swapSimulation?.data && (
        <div className="flex flex-col gap-2">
          <span className="flex-1 flex text-sm text-muted-foreground justify-between">
            <span>Network Cost</span>
            <span>${swapSimulation.data.networkCost}</span>
          </span>
          <span className="flex-1 flex text-sm text-muted-foreground justify-between">
            <span>Fee</span>
            <span>TBD - Gimme</span>
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap</CardTitle>
      </CardHeader>

      <CardContent>{swapView}</CardContent>

      <CardFooter>{swapButton}</CardFooter>
    </Card>
  );
}
