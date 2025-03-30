import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import FormInput from './FormInput';

export default function MintForm() {
  const [usdcAmount, setUsdcAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [daiAmount, setDaiAmount] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint</CardTitle>
      </CardHeader>
      <CardContent className="flexColumn gap-1">
        <FormInput token="USDC" onChange={setUsdcAmount} value={usdcAmount} />
        <FormInput token="USDT" onChange={setUsdtAmount} value={usdtAmount} />
        <FormInput token="DAI" onChange={setDaiAmount} value={daiAmount} />
      </CardContent>
      <CardFooter>
        <Button className="w-full">Mint</Button>
      </CardFooter>
    </Card>
  );
}
