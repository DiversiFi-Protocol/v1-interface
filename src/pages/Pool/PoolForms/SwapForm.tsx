import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SWAPPABLE_ASSETS } from '@/constants/tokens';
import { useStableBalances } from '@/hooks/useStableBalances';
import { MustBigNumber } from '@/lib/numbers';
import { Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import FormInput from './FormInput';

type SwappableAsset = keyof typeof SWAPPABLE_ASSETS;

export default function SwapForm() {
  const [view, setView] = useState<'swap' | 'select1' | 'select2'>('swap');

  const [input1Amount, setInput1Amount] = useState('');
  const [input1Token, setInput1Token] = useState<SwappableAsset>('USDC');

  const [output2Amount, setOutput2Amount] = useState('');
  const [output2Token, setOutput2Token] = useState<SwappableAsset>('USDT');

  const { daiQuery, usdcQuery, usdtQuery } = useStableBalances();
  const daiBalance = daiQuery.data?.value ?? 0n;
  const usdcBalance = usdcQuery.data?.value ?? 0n;
  const usdtBalance = usdtQuery.data?.value ?? 0n;
  const formattedDaiBalance = formatUnits(daiBalance, SWAPPABLE_ASSETS.DAI.decimals);
  const formattedUsdcBalance = formatUnits(usdcBalance, SWAPPABLE_ASSETS.USDC.decimals);
  const formattedUsdtBalance = formatUnits(usdtBalance, SWAPPABLE_ASSETS.USDT.decimals);

  const formattedBalances = useMemo(
    () => ({
      DAI: formattedDaiBalance,
      USDC: formattedUsdcBalance,
      USDT: formattedUsdtBalance,
      USD1: '0',
    }),
    [formattedDaiBalance, formattedUsdcBalance, formattedUsdtBalance]
  );

  const { inputWalletBalance, outputWalletBalance } = useMemo(
    () => ({
      inputWalletBalance: formattedBalances[input1Token],
      outputWalletBalance: formattedBalances[output2Token],
    }),
    [formattedBalances, input1Token, output2Token]
  );

  const swapView = (
    <div className="flexColumn gap-1">
      <FormInput
        token={input1Token}
        onChange={setInput1Amount}
        value={input1Amount}
        onClick={() => setView('select1')}
        balance={inputWalletBalance}
      />
      <FormInput
        token={output2Token}
        onChange={setOutput2Amount}
        value={output2Amount}
        onClick={() => setView('select2')}
        balance={outputWalletBalance}
      />
    </div>
  );

  const tokenSelectView = (
    <div className="flexColumn gap-1">
      {Object.entries(SWAPPABLE_ASSETS).map(([asset, assetInfo]) => (
        <button
          key={asset}
          className="row w-full border border-border gap-2 justify-between"
          onClick={() => {
            if (view === 'select1') {
              if (asset === output2Token) {
                setOutput2Token(input1Token);
              }

              setInput1Token(asset as SwappableAsset);
            }
            if (view === 'select2') {
              if (asset === input1Token) {
                setInput1Token(output2Token);
              }

              setOutput2Token(asset as SwappableAsset);
            }
            setView('swap');
          }}
        >
          <div className="row gap-2">
            <AssetIcon size="md" asset={asset} />
            {assetInfo.name}
          </div>
          <div className="row gap-2">
            <span>{MustBigNumber(formattedBalances[asset as SwappableAsset]).toFixed(2)}</span>
            <Wallet className="w-4 h-4" />
          </div>
        </button>
      ))}
    </div>
  );

  const title = view === 'swap' ? 'Swap' : 'Select Token';

  const swapButton = <Button className="w-full">Swap</Button>;

  const tokenSelectClose = (
    <Button className="w-full" onClick={() => setView('swap')}>
      Close
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>{view === 'swap' ? swapView : tokenSelectView}</CardContent>

      <CardFooter>{view === 'swap' ? swapButton : tokenSelectClose}</CardFooter>
    </Card>
  );
}
