import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InsuranceFund() {
  const balance = useMemo(() => {
    return undefined;
  }, []);

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
