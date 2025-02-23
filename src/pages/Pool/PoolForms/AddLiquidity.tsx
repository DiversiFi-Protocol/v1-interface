import { Button } from '@/components/ui/button';
import { useState } from 'react';
import FormInput from './FormInput';

export default function AddLiquidity() {
  const [usdcAmount, setUsdcAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [daiAmount, setDaiAmount] = useState('');

  return (
    <div className="flex flex-col gap-4 rounded-md p-4 border-border border-solid border-[1px]">
      <div className="text-2xl font-semibold">Add Liquidity</div>
      <FormInput token="USDC" onChange={setUsdcAmount} value={usdcAmount} />
      <FormInput token="USDT" onChange={setUsdtAmount} value={usdtAmount} />
      <FormInput token="DAI" onChange={setDaiAmount} value={daiAmount} />
      <div className="flex justify-end">
        <Button className="w-full">Add Liquidity</Button>
      </div>
    </div>
  );
}
