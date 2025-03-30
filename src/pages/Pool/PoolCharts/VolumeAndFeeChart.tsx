'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { date: '2024-04-01', volume: 222, fee: 150 },
  { date: '2024-04-02', volume: 97, fee: 180 },
  { date: '2024-04-03', volume: 167, fee: 120 },
  { date: '2024-04-04', volume: 242, fee: 260 },
  { date: '2024-04-05', volume: 373, fee: 290 },
  { date: '2024-04-06', volume: 301, fee: 340 },
  { date: '2024-04-07', volume: 245, fee: 180 },
  { date: '2024-04-08', volume: 409, fee: 320 },
  { date: '2024-04-09', volume: 59, fee: 110 },
  { date: '2024-04-10', volume: 261, fee: 190 },
  { date: '2024-04-11', volume: 327, fee: 350 },
  { date: '2024-04-12', volume: 292, fee: 210 },
  { date: '2024-04-13', volume: 342, fee: 380 },
  { date: '2024-04-14', volume: 137, fee: 220 },
  { date: '2024-04-15', volume: 120, fee: 170 },
  { date: '2024-04-16', volume: 138, fee: 190 },
  { date: '2024-04-17', volume: 446, fee: 360 },
  { date: '2024-04-18', volume: 364, fee: 410 },
  { date: '2024-04-19', volume: 243, fee: 180 },
  { date: '2024-04-20', volume: 89, fee: 150 },
  { date: '2024-04-21', volume: 137, fee: 200 },
  { date: '2024-04-22', volume: 224, fee: 170 },
  { date: '2024-04-23', volume: 138, fee: 230 },
  { date: '2024-04-24', volume: 387, fee: 290 },
  { date: '2024-04-25', volume: 215, fee: 250 },
  { date: '2024-04-26', volume: 75, fee: 130 },
  { date: '2024-04-27', volume: 383, fee: 420 },
  { date: '2024-04-28', volume: 122, fee: 180 },
  { date: '2024-04-29', volume: 315, fee: 240 },
  { date: '2024-04-30', volume: 454, fee: 380 },
  { date: '2024-05-01', volume: 165, fee: 220 },
  { date: '2024-05-02', volume: 293, fee: 310 },
  { date: '2024-05-03', volume: 247, fee: 190 },
  { date: '2024-05-04', volume: 385, fee: 420 },
  { date: '2024-05-05', volume: 481, fee: 390 },
  { date: '2024-05-06', volume: 498, fee: 520 },
  { date: '2024-05-07', volume: 388, fee: 300 },
  { date: '2024-05-08', volume: 149, fee: 210 },
  { date: '2024-05-09', volume: 227, fee: 180 },
  { date: '2024-05-10', volume: 293, fee: 330 },
  { date: '2024-05-11', volume: 335, fee: 270 },
  { date: '2024-05-12', volume: 197, fee: 240 },
  { date: '2024-05-13', volume: 197, fee: 160 },
  { date: '2024-05-14', volume: 448, fee: 490 },
  { date: '2024-05-15', volume: 473, fee: 380 },
  { date: '2024-05-16', volume: 338, fee: 400 },
  { date: '2024-05-17', volume: 499, fee: 420 },
  { date: '2024-05-18', volume: 315, fee: 350 },
  { date: '2024-05-19', volume: 235, fee: 180 },
  { date: '2024-05-20', volume: 177, fee: 230 },
  { date: '2024-05-21', volume: 82, fee: 140 },
  { date: '2024-05-22', volume: 81, fee: 120 },
  { date: '2024-05-23', volume: 252, fee: 290 },
  { date: '2024-05-24', volume: 294, fee: 220 },
  { date: '2024-05-25', volume: 201, fee: 250 },
  { date: '2024-05-26', volume: 213, fee: 170 },
  { date: '2024-05-27', volume: 420, fee: 460 },
  { date: '2024-05-28', volume: 233, fee: 190 },
  { date: '2024-05-29', volume: 78, fee: 130 },
  { date: '2024-05-30', volume: 340, fee: 280 },
  { date: '2024-05-31', volume: 178, fee: 230 },
  { date: '2024-06-01', volume: 178, fee: 200 },
  { date: '2024-06-02', volume: 470, fee: 410 },
  { date: '2024-06-03', volume: 103, fee: 160 },
  { date: '2024-06-04', volume: 439, fee: 380 },
  { date: '2024-06-05', volume: 88, fee: 140 },
  { date: '2024-06-06', volume: 294, fee: 250 },
  { date: '2024-06-07', volume: 323, fee: 370 },
  { date: '2024-06-08', volume: 385, fee: 320 },
  { date: '2024-06-09', volume: 438, fee: 480 },
  { date: '2024-06-10', volume: 155, fee: 200 },
  { date: '2024-06-11', volume: 92, fee: 150 },
  { date: '2024-06-12', volume: 492, fee: 420 },
  { date: '2024-06-13', volume: 81, fee: 130 },
  { date: '2024-06-14', volume: 426, fee: 380 },
  { date: '2024-06-15', volume: 307, fee: 350 },
  { date: '2024-06-16', volume: 371, fee: 310 },
  { date: '2024-06-17', volume: 475, fee: 520 },
  { date: '2024-06-18', volume: 107, fee: 170 },
  { date: '2024-06-19', volume: 341, fee: 290 },
  { date: '2024-06-20', volume: 408, fee: 450 },
  { date: '2024-06-21', volume: 169, fee: 210 },
  { date: '2024-06-22', volume: 317, fee: 270 },
  { date: '2024-06-23', volume: 480, fee: 530 },
  { date: '2024-06-24', volume: 132, fee: 180 },
  { date: '2024-06-25', volume: 141, fee: 190 },
  { date: '2024-06-26', volume: 434, fee: 380 },
  { date: '2024-06-27', volume: 448, fee: 490 },
  { date: '2024-06-28', volume: 149, fee: 200 },
  { date: '2024-06-29', volume: 103, fee: 160 },
  { date: '2024-06-30', volume: 446, fee: 400 },
];

export default function VolumeAndFeeChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('volume');

  const total = React.useMemo(
    () => ({
      volume: chartData.reduce((acc, curr) => acc + curr.volume, 0),
      fee: chartData.reduce((acc, curr) => acc + curr.fee, 0),
    }),
    []
  );

  const chartConfig = React.useMemo(
    () =>
      ({
        volume: {
          label: 'Volume',
          color: 'hsl(var(--chart-1))',
        },
        fee: {
          label: 'Fees',
          color: 'hsl(var(--chart-2))',
        },
      }) satisfies ChartConfig,
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>USD1 Pool Information</CardTitle>
          <CardDescription>View the volume and fees for the USD1 pool</CardDescription>
        </div>
        <div className="flex mx-2">
          {['volume', 'fee'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="focus:outline-none active:outline-none relative rounded-none z-30 flex flex-1 flex-col justify-center gap-1 text-left border-0 data-[active=true]:border-b-2"
                style={{
                  borderBottomColor: chartConfig[chart].color,
                }}
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ${total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
