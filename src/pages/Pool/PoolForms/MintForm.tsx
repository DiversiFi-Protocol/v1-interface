import { useEffect, useMemo, useState } from 'react';

import { CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';

import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import {
  MintStep,
  useMintDepositAmounts,
  useMintSteps,
  useSimulateMint,
} from '@/hooks/BackingPool/mintHook';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

import { InventoryPopover } from '../InventoryPopover';
import FormInput from './FormInput';

export default function MintForm() {
  const [mintAmount, setMintAmount] = useState('');
  const debouncedMintAmount = useDebounce(mintAmount);

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

  const mintDepositAmounts = useMintDepositAmounts({
    amount: debouncedMintAmount,
  });

  const mintSimulation = useSimulateMint({
    amount: debouncedMintAmount,
  });

  const signer = useWalletClient();

  const stepsQuery = useMintSteps({
    amount: debouncedMintAmount,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [mintSteps, setMintSteps] = useState<MintStep[]>();
  const [stepError, setStepError] = useState<unknown>();
  const [isAwaitingWalletAction, setIsAwaitingWalletAction] = useState(false);

  useEffect(() => {
    async function autoPromptSteps() {
      if (
        mintSteps == null ||
        mintSteps.length === 0 ||
        mintSteps[currentStep] == null ||
        signer.data == null
      ) {
        return;
      }

      const { success, error } = await mintSteps[currentStep].execute(signer.data);

      if (success && currentStep < mintSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (success) {
        setMintAmount('');
      }

      if (!success && error) {
        setStepError(error);
      }
    }

    autoPromptSteps();
  }, [mintSteps, currentStep, signer.data]);

  useEffect(() => {
    // reset current burn steps if the input has changed
    setMintSteps(undefined);
    setCurrentStep(0);
    setIsAwaitingWalletAction(false);
    setStepError(undefined);
  }, [debouncedMintAmount]);

  const onMint = async () => {
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
        setMintAmount('');
      } else {
        setIsAwaitingWalletAction(false);
        setStepError(error);
      }
    } else {
      setMintSteps(steps);
    }
  };

  const onRetry = async () => {
    const step = mintSteps?.[currentStep];
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
        label="Mint Amount"
        className="hover:brightness-110 [input:focus]:brightness-110"
        token={BACKED_TOKEN.symbol}
        onChange={setMintAmount}
        value={mintAmount}
        balance={backedTokenBalance}
      />
    </div>
  );

  const hasTokensForMint = SUPPORTED_RESERVE_ASSETS.every((asset) =>
    MustBigNumber(mapOfBalances[asset.address]?.balance).gte(
      MustBigNumber(debouncedMintAmount).div(3)
    )
  );

  const isDisabled = signer.data == null || !hasTokensForMint || mintAmount === '';

  const buttonText = useMemo(() => {
    if (debouncedMintAmount === '') {
      return 'Enter Amount';
    }

    if (signer.data == null) {
      return 'Connect Wallet';
    }

    if (!hasTokensForMint) {
      return 'Insufficient Balance';
    }

    return 'Mint';
  }, [signer.data, hasTokensForMint, debouncedMintAmount]);

  const mintButtonAndReceipt = (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="outline"
        onClick={onMint}
        disabled={isDisabled}
        isLoading={isAwaitingWalletAction || stepsQuery.isFetching}
        className="w-full py-6 text-xl border border-border"
      >
        {buttonText}
      </Button>

      <div className="flex flex-col gap-2">
        {debouncedMintAmount.trim() !== '' && (
          <>
            {mintDepositAmounts?.map((deposit) => (
              <span className="flex-1 flex text-sm text-muted-foreground justify-between">
                <span>{deposit.symbol}</span>
                <span className="font-mono">
                  <span className="text-destructive">-</span>
                  {deposit.depositAmount}
                </span>
              </span>
            ))}
            <span className="flex-1 flex text-sm text-muted-foreground justify-between">
              <span>{BACKED_TOKEN.symbol}</span>
              <span className="font-mono">
                <span className="text-green-600">+</span>
                {debouncedMintAmount}
              </span>
            </span>
          </>
        )}

        {mintSimulation?.data && (
          <span className="flex-1 flex text-sm text-muted-foreground justify-between">
            <span>Network Cost (est.)</span>
            <span className="font-mono">${mintSimulation.data.networkCost}</span>
          </span>
        )}
      </div>

      {mintSteps != null && (
        <div className="flex flex-col gap-2 border-t-[1px] border-border pt-2 mt-1 border-solid">
          <span className="text-sm text-muted-foreground">Steps:</span>

          {mintSteps?.map((step, i) => {
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
                      mint: 'Mint',
                    }[step.type]
                  }
                </span>

                {isCurrentStep ? (
                  error == null ? (
                    <span>pending...</span>
                  ) : (
                    <a className="hover:underline cursor-pointer" onClick={onRetry}>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="row gap-2 h-8 justify-between">
            Mint
            <InventoryPopover />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flexColumn gap-1">{content}</CardContent>
      <CardFooter>{mintButtonAndReceipt}</CardFooter>
    </Card>
  );
}
