import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EMPTY_ARR } from '@/constants/objects';
import {
  ALL_SUPPORTED_TOKENS,
  BACKED_TOKEN,
  SUPPORTED_RESERVE_ASSETS,
  SupportedAsset,
} from '@/constants/tokens';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';
import { Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import FormInput from './FormInput';

const DEFAULT_INPUT_TOKEN = SUPPORTED_RESERVE_ASSETS[0];
const DEFAULT_OUTPUT_TOKEN = BACKED_TOKEN;

export default function SwapForm() {
  const [view, setView] = useState<'swap' | 'select1' | 'select2'>('swap');

  const [input1Amount, setInput1Amount] = useState('');
  const [input1Token, setInput1Token] = useState<SupportedAsset>(DEFAULT_INPUT_TOKEN);

  const [output2Amount, setOutput2Amount] = useState('');
  const [output2Token, setOutput2Token] = useState<SupportedAsset>(DEFAULT_OUTPUT_TOKEN);

  const { balances } = useAssetBalances();

  const mapOfBalances = useMemo(() => {
    return objectFromEntries((balances ?? EMPTY_ARR).map((a) => [a.address, a]));
  }, [balances]);

  const { inputWalletBalance, outputWalletBalance } = useMemo(
    () => ({
      inputWalletBalance: MustBigNumber(mapOfBalances[input1Token.address]?.balance).toFixed(2),
      outputWalletBalance: MustBigNumber(mapOfBalances[output2Token.address]?.balance).toFixed(2),
    }),
    [input1Token, output2Token, mapOfBalances]
  );

  const swapView = (
    <div className="flexColumn gap-1">
      <FormInput
        token={input1Token.symbol}
        onChange={setInput1Amount}
        value={input1Amount}
        onClick={() => setView('select1')}
        balance={inputWalletBalance}
      />
      <FormInput
        token={output2Token.symbol}
        onChange={setOutput2Amount}
        value={output2Amount}
        onClick={() => setView('select2')}
        balance={outputWalletBalance}
      />
    </div>
  );

  const tokenSelectView = (
    <div className="flexColumn gap-1">
      {ALL_SUPPORTED_TOKENS.map((asset) => (
        <button
          key={asset.symbol}
          className="row w-full border border-border gap-2 justify-between"
          onClick={() => {
            if (view === 'select1') {
              if (asset.address === output2Token.address) {
                setOutput2Token(input1Token);
              }

              setInput1Token(asset);
            }
            if (view === 'select2') {
              if (asset.address === input1Token.address) {
                setInput1Token(output2Token);
              }

              setOutput2Token(asset);
            }
            setView('swap');
          }}
        >
          <div className="row gap-2">
            <AssetIcon size="md" asset={asset.symbol} />
            {asset.symbol}
          </div>
          <div className="row gap-2">
            <span>{MustBigNumber(mapOfBalances[asset.address]?.balance).toFixed(2)}</span>
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
