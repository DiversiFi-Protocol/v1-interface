import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { asset: 'USDC', amount: 275_000, fill: 'var(--color-usdc)' },
  { asset: 'USDT', amount: 200_000, fill: 'var(--color-usdt)' },
  { asset: 'DAI', amount: 287_000, fill: 'var(--color-dai)' },
];

const chartConfig = {
  tvl: {
    label: 'Total Value Locked',
  },
  usdc: {
    label: 'USDC',
    color: 'hsl(var(--chart-1))',
  },
  usdt: {
    label: 'USDT',
    color: 'hsl(var(--chart-2))',
  },
  dai: {
    label: 'DAI',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function PoolPieChart() {
  const tvl = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>USD1 Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" nameKey="asset" innerRadius={80} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {tvl.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Value Locked
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
