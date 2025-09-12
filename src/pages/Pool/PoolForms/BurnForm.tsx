import { useEffect, useMemo, useState } from 'react';

import { CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';

import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN } from '@/constants/tokens';

import {
  BurnStep,
  useBurnSteps,
  useBurnWithdrawalAmounts,
  useSimulateBurn,
} from '@/hooks/BackingPool/burnHook';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

import { InventoryPopover } from '../InventoryPopover';
import FormInput from './FormInput';

export default function BurnForm({ withCard = true }: { withCard?: boolean }) {
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

  const withdrawalAmounts = useBurnWithdrawalAmounts({
    burnAmount: debouncedBurnAmount,
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
      } else if (success) {
        setBurnAmount('');
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

    setStepError(undefined);
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

  const hasTokensForBurn = MustBigNumber(mapOfBalances[BACKED_TOKEN.address]?.balance).gte(
    MustBigNumber(debouncedBurnAmount)
  );

  const isDisabled = signer.data == null || !hasTokensForBurn || burnAmount === '';

  const buttonText = useMemo(() => {
    if (debouncedBurnAmount === '') {
      return 'Enter Amount';
    }

    if (signer.data == null) {
      return 'Connect Wallet';
    }

    if (!hasTokensForBurn) {
      return 'Insufficient Balance';
    }

    return 'Burn';
  }, [signer.data, hasTokensForBurn, debouncedBurnAmount]);

  const burnButtonAndReceipt = (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="outline"
        onClick={onBurn}
        disabled={isDisabled}
        isLoading={isAwaitingWalletAction || stepsQuery.isFetching}
        className="w-full py-6 text-xl border border-border"
      >
        {buttonText}
      </Button>

      <div className="flex flex-col gap-2">
        {debouncedBurnAmount.trim() !== '' && (
          <>
            {withdrawalAmounts?.map((withdrawal) => (
              <span className="flex-1 flex text-sm text-muted-foreground justify-between">
                <span>{withdrawal.symbol}</span>
                <span className="font-mono">
                  <span className="text-green-600">+</span>
                  {withdrawal.withdrawalAmount}
                </span>
              </span>
            ))}
            <span className="flex-1 flex text-sm text-muted-foreground justify-between">
              <span>{BACKED_TOKEN.symbol}</span>
              <span className="font-mono">
                <span className="text-destructive">-</span>
                {debouncedBurnAmount}
              </span>
            </span>
          </>
        )}

        {burnSimulation?.data && (
          <span className="flex-1 flex text-sm text-muted-foreground justify-between">
            <span>Network Cost (est.)</span>
            <span className="font-mono">${burnSimulation.data.networkCost}</span>
          </span>
        )}
      </div>

      {burnSteps != null && (
        <div className="flex flex-col gap-2">
          <span>Steps:</span>

          {burnSteps?.map((step, i) => {
            const isCurrentStep = i === currentStep;
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
                      burn: 'Burn',
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
                ) : i < currentStep ? (
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
        <CardHeader>
          <CardTitle>
            <div className="row gap-2 h-8 justify-between">
              Burn
              <InventoryPopover />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flexColumn gap-1">{content}</CardContent>
        <CardFooter>{burnButtonAndReceipt}</CardFooter>
      </Card>
    );
  }

  return (
    <div className="flexColumn gap-2">
      {content}
      {burnButtonAndReceipt}
    </div>
  );
}
