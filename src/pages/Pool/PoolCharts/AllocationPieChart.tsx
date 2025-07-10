import { useMemo } from 'react';

import { Loader2 } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

import { SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import { useGetAssetParamsForAllAssets } from '@/hooks/BackingPool/useAssets';
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

import { isTruthy } from '@/lib/isTruthy';
import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';
import { cn } from '@/lib/tw';

export default function AllocationPieChart({
  className,
  type,
}: {
  className?: string;
  type: 'current' | 'target';
}) {
  const { data: assetParamsData, isLoading: assetParamsDataLoading } =
    useGetAssetParamsForAllAssets();
  const { totalScaledReserves, isLoading: totalScaledReservesLoading } =
    useGetTotalScaledReserves();
  const { scaledReserves, isLoading: scaledReservesLoading } = useAllAssetScaledReserves();

  const isLoading =
    type === 'current'
      ? totalScaledReservesLoading || scaledReservesLoading
      : assetParamsDataLoading;

  const data = useMemo(() => {
    if (type === 'current') {
      if (totalScaledReserves == null || scaledReserves == null) {
        return [];
      }

      return scaledReserves.map(({ amount, symbol }) => {
        return {
          amount: MustBigNumber(amount).div(totalScaledReserves).toNumber(),
          symbol,
        };
      });
    }

    return assetParamsData
      ?.map((assetParams) => {
        const asset = SUPPORTED_RESERVE_ASSETS.find((a) => a.address === assetParams?.assetAddress);

        if (asset == null || assetParams == null) {
          return undefined;
        }

        return {
          amount: assetParams.targetAllocation,
          symbol: asset.symbol,
        };
      })
      .filter(isTruthy);
  }, [assetParamsData, totalScaledReserves, scaledReserves, type]);

  const title = {
    current: 'Current Allocation',
    target: 'Target Allocation',
  }[type];

  const chartData = useMemo(() => {
    return data?.map(({ amount, symbol }) => ({
      asset: symbol,
      amount: MustBigNumber(amount).times(100).toNumber(),
      fill: `var(--color-${symbol})`,
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = objectFromEntries(
      data?.map(({ symbol }, idx) => [
        symbol,
        {
          label: symbol,
          color: `hsl(var(--chart-${idx + 1}))`,
        },
      ]) ?? []
    );

    return config;
  }, [data]);

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
            <PieChart>
              {/* <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="dot" />}
              /> */}
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="text-muted-foreground flex min-w-[130px] gap-2 items-center text-xs">
                        <div
                          className="size-3 rounded-[2px]"
                          style={{
                            backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color,
                          }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {(value as number).toFixed(2)}
                          <span className="text-muted-foreground font-normal">%</span>
                        </div>
                      </div>
                    )}
                  />
                }
                cursor={false}
              />

              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="asset"
                innerRadius={30}
                strokeWidth={1}
              ></Pie>

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
