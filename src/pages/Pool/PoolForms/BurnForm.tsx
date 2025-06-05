import { useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';

import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import { BurnStep, useBurnSteps, useSimulateBurn } from '@/hooks/BackingPool/burnHook';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

import FormInput from './FormInput';

export default function BurnForm() {
  const [burnAmount, setBurnAmount] = useState('');
  const debouncedBurnAmount = useDebounce(burnAmount);

  const { balances } = useAssetBalances();
  const mapOfBalances = useMemo(() => {
    return objectFromEntries((balances ?? EMPTY_ARR).map((a) => [a.address, a]));
  }, [balances]);

  const backedTokenBalance = MustBigNumber(mapOfBalances[BACKED_TOKEN.address]?.balance).toFormat(
    2,
    {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    }
  );

  const burnSimulation = useSimulateBurn({
    amount: debouncedBurnAmount,
  });

  const signer = useWalletClient();

  const stepsQuery = useBurnSteps({
    amount: debouncedBurnAmount,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [burnSteps, setBurnSteps] = useState<BurnStep[]>();
  const [stepError, setStepError] = useState<unknown>();
  const [isAwaitingWalletAction, setIsAwaitingWalletAction] = useState(false);

  useEffect(() => {
    async function autoPromptSteps() {
      if (
        burnSteps == null ||
        burnSteps.length === 0 ||
        burnSteps[currentStep] == null ||
        signer.data == null
      ) {
        return;
      }

      const { success, error } = await burnSteps[currentStep].execute(signer.data);

      if (success && currentStep < burnSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }

      if (!success && error) {
        setStepError(error);
      }
    }

    autoPromptSteps();
  }, [burnSteps, currentStep, signer.data]);

  useEffect(() => {
    // reset current burn steps if the input has changed
    setBurnSteps(undefined);
    setCurrentStep(0);
    setIsAwaitingWalletAction(false);
    setStepError(undefined);
  }, [debouncedBurnAmount]);

  const onBurn = async () => {
    const steps = stepsQuery.data;
    const currentStep = steps?.[0];
    if (steps == null || steps.length === 0 || !signer.data || currentStep == null) {
      toast.error('Something went wrong');
      return;
    }

    setStepError(undefined);
    setIsAwaitingWalletAction(true);

    if (steps.length === 1) {
      const { success, error } = await currentStep.execute(signer.data);
      if (success) {
        setBurnAmount('');
      } else {
        setIsAwaitingWalletAction(false);
        setStepError(error);
      }
    } else {
      setBurnSteps(steps);
    }
  };

  const onRetry = async () => {
    const step = burnSteps?.[currentStep];
    if (step == null || signer.data == null) return;

    const { success, error } = await step.execute(signer.data);
    if (success) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setStepError(error);
    }
  };

  const content = (
    <div className="flexColumn gap-1 relative">
      <FormInput
        label="Burn Amount"
        className="hover:brightness-110 [input:focus]:brightness-110"
        token={BACKED_TOKEN.symbol}
        onChange={setBurnAmount}
        value={burnAmount}
        balance={backedTokenBalance}
      />
    </div>
  );

  const hasTokensForBurn = SUPPORTED_RESERVE_ASSETS.every((asset) =>
    MustBigNumber(mapOfBalances[asset.address]?.balance).gte(
      MustBigNumber(debouncedBurnAmount).div(3)
    )
  );

  const isDisabled = signer.data == null || !hasTokensForBurn || burnAmount === '';

  const buttonText = useMemo(() => {
    if (burnAmount === '') {
      return 'Enter Amount';
    }

    if (signer.data == null) {
      return 'Connect Wallet';
    }

    if (!hasTokensForBurn) {
      return 'Insufficient Balance';
    }

    return 'Burn';
  }, [signer.data, hasTokensForBurn, burnAmount]);

  const burnButtonAndReceipt = (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="ghost"
        onClick={onBurn}
        disabled={isDisabled}
        isLoading={isAwaitingWalletAction || stepsQuery.isFetching}
        className="w-full py-6 text-xl border border-border"
      >
        {buttonText}
      </Button>

      {burnSimulation?.data && (
        <div className="flex flex-col gap-2">
          <span className="flex-1 flex text-sm text-muted-foreground justify-between">
            <span>Network Cost (est.)</span>
            <span>${burnSimulation.data.networkCost}</span>
          </span>
        </div>
      )}

      {burnSteps != null && (
        <div className="flex flex-col gap-2">
          {burnSteps?.map((step, i) => {
            const isCurrentStep = i === currentStep;
            const error = isCurrentStep ? stepError : undefined;

            return (
              <span
                key={step.type}
                className="flex-1 flex text-sm text-muted-foreground justify-between"
              >
                <span>
                  {
                    {
                      network: 'Switch Network',
                      approve: 'Set Approval',
                      burn: 'Burn',
                    }[step.type]
                  }
                </span>
                {error != null && <a onClick={onRetry}>Retry</a>}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burn</CardTitle>
      </CardHeader>
      <CardContent className="flexColumn gap-1">{content}</CardContent>
      <CardFooter>{burnButtonAndReceipt}</CardFooter>
    </Card>
  );
}
