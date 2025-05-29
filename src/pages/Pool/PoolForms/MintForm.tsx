import { useMemo, useState } from 'react';

import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';

import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import { useMintSteps, useSimulateMint } from '@/hooks/BackingPool/mintHook';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

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

  const mintSimulation = useSimulateMint({
    amount: debouncedMintAmount,
  });

  const signer = useWalletClient();

  const stepsQuery = useMintSteps({
    amount: debouncedMintAmount,
  });

  const onMint = async () => {
    const steps = stepsQuery.data;
    const currentStep = steps?.at(0);
    if (steps == null || steps.length === 0 || !signer.data || !currentStep) {
      toast.error('Something went wrong');
      return;
    }

    const type = currentStep.type;
    const { success } = await currentStep.execute(signer.data);

    if (success && type === 'mint') {
      setMintAmount('');
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

  const isDisabled = !signer || !hasTokensForMint || mintAmount === '';

  let buttonText = 'Mint';

  if (mintAmount === '') {
    buttonText = 'Mint';
  } else {
    const currentStep = stepsQuery.data?.at(0);
    if (currentStep == null && stepsQuery.isFetched) {
      buttonText = 'Unavailable';
    } else if (currentStep?.type === 'network') {
      buttonText = 'Switch Network';
    } else if (currentStep?.type === 'approve') {
      buttonText = 'Set Approval';
    }
  }

  const mintButtonAndReceipt = (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="ghost"
        onClick={onMint}
        disabled={isDisabled}
        className="w-full py-6 text-xl border border-border"
      >
        {buttonText}
      </Button>
      {mintSimulation?.data && (
        <div className="flex flex-col gap-2">
          <span className="flex-1 flex text-sm text-muted-foreground justify-between">
            <span>Network Cost</span>
            <span>${mintSimulation.data.networkCost}</span>
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint</CardTitle>
      </CardHeader>
      <CardContent className="flexColumn gap-1">{content}</CardContent>
      <CardFooter>{mintButtonAndReceipt}</CardFooter>
    </Card>
  );
}
