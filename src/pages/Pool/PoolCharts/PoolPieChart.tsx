import { useMemo } from 'react';

import { Loader2 } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  useAllAssetScaledReserves,
  useGetTotalScaledReserves,
} from '@/hooks/BackingPool/usePoolReserves';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { MustBigNumber, formatNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

export default function PoolPieChart() {
  const { totalScaledReserves, isLoading: totalScaledReservesLoading } =
    useGetTotalScaledReserves();
  const { scaledReserves, isLoading: scaledReservesLoading } = useAllAssetScaledReserves();

  const chartData = useMemo(() => {
    return scaledReserves?.map(({ amount, symbol }) => ({
      asset: symbol,
      amount: MustBigNumber(amount).toNumber(),
      fill: `var(--color-${symbol})`,
    }));
  }, [scaledReserves]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = objectFromEntries(
      scaledReserves?.map(({ symbol }, idx) => [
        symbol,
        {
          label: symbol,
          color: `hsl(var(--chart-${idx + 1}))`,
        },
      ]) ?? []
    );

    return config;
  }, [scaledReserves]);

  const tvl = useMemo(() => {
    const tvlBN = MustBigNumber(totalScaledReserves);
    if (tvlBN.isZero()) return '-';
    if (tvlBN.gte(1e5))
      return formatNumber({
        value: tvlBN,
        type: 'compact-fiat',
        options: {
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'USD',
        },
      });

    return formatNumber({
      value: tvlBN,
      type: 'fiat',
      options: { maximumFractionDigits: 2 },
    });
  }, [totalScaledReserves]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>USD1 Pool Composition</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {totalScaledReservesLoading || scaledReservesLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="dot" />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="asset"
                innerRadius={90}
                strokeWidth={5}
              >
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
                            {tvl}
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

              <ChartLegend
                content={<ChartLegendContent nameKey="asset" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
