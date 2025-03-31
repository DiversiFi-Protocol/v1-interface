import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInsuranceFund } from '@/hooks/BackingPool/useInsuranceFund';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

export default function InsuranceFund() {
  const { insuranceFundBalanceQuery } = useInsuranceFund();

  const balance = useMemo(() => {
    if (insuranceFundBalanceQuery.data == null) {
      return undefined;
    }

    return formatUnits(
      insuranceFundBalanceQuery.data.value,
      insuranceFundBalanceQuery.data.decimals
    );
  }, [insuranceFundBalanceQuery.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Fund</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">${balance ?? '0.00'}</span>
      </CardContent>
    </Card>
  );
}
