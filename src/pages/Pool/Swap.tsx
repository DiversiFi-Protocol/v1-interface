import SingleColumnLayout from '@/layouts/SingleColumnLayout';
import { ArrowLeftRight, Flame, InfoIcon, Stars } from 'lucide-react';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AllocationChangeBanner } from './AllocationChangeBanner/AllocationChangeBanner';
import AssetCards from './AssetCards/AssetCards';
import PoolPieChart from './PoolCharts/PoolPieChart';
import VolumeAndFeeChart from './PoolCharts/VolumeAndFeeChart';
import { BurnDialog } from './PoolForms/BurnDialog';
import BurnForm from './PoolForms/BurnForm';
import { MintDialog } from './PoolForms/MintDialog';
import MintForm from './PoolForms/MintForm';
import { SwapDialog } from './PoolForms/SwapDialog';
import SwapForm from './PoolForms/SwapForm';
import PoolHeader from './PoolHeader/PoolHeader';
import PoolInfoDrawer from './PoolInfoDrawer/PoolInfoDrawer';
import { BalanceTable } from './PoolTables/BalanceTable';

export default function Swap() {
  const { isTablet } = useBreakpoints();

  if (isTablet) {
    return (
      <SingleColumnLayout>
        <div className="p-4 flexColumn gap-4">
          <AllocationChangeBanner />
          <PoolHeader />
          <Tabs defaultValue="swap">
            <TabsList className="bg-transparent">
              <TabsTrigger className="bg-transparent text-lg font-semibold" value="swap">
                Swap
              </TabsTrigger>
              <TabsTrigger className="bg-transparent text-lg font-semibold" value="mint">
                Mint
              </TabsTrigger>
              <TabsTrigger className="bg-transparent text-lg font-semibold" value="burn">
                Burn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swap">
              <SwapForm />
            </TabsContent>
            <TabsContent value="mint">
              <MintForm />
            </TabsContent>
            <TabsContent value="burn">
              <BurnForm />
            </TabsContent>
          </Tabs>
        </div>

        <PoolInfoDrawer>
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 rounded-[50%]"
          >
            <InfoIcon />
          </Button>
        </PoolInfoDrawer>
      </SingleColumnLayout>
    );
  }

  return (
    <SingleColumnLayout className="w-full" innerClassName="flexColumn gap-8 py-4">
      <AllocationChangeBanner className="mb-2" />

      <PoolHeader />
      <AssetCards direction="row" />

      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent">
          <TabsTrigger className="bg-transparent text-lg font-semibold" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="bg-transparent text-lg font-semibold" value="fee-volume">
            Fees & Volume
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PoolPieChart />
        </TabsContent>
        <TabsContent value="fee-volume">
          <VolumeAndFeeChart />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-2">
        <MintDialog>
          <Card className="cursor-pointer flex-1 bg-green-900/10" borderColor="create">
            <CardHeader className="py-4 pb-1">
              <CardTitle>
                <div className="row gap-2 text-lg">
                  Mint <Stars className="size-4" />
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground">
              Exchange reserve assets that you hold for DFiUSD.
            </CardContent>
          </Card>
        </MintDialog>

        <BurnDialog>
          <Card className="cursor-pointer flex-1 bg-red-900/10" borderColor="destroy">
            <CardHeader className="py-4 pb-1">
              <CardTitle>
                <div className="row gap-2 text-lg">
                  Burn <Flame className="size-4" />
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground">
              Exchange DFiUSD for reserve assets in denominations determined by their current
              allocation percentage.
            </CardContent>
          </Card>
        </BurnDialog>
      </div>

      <Tabs defaultValue="holdings">
        <TabsList className="bg-transparent w-full">
          <TabsTrigger className="bg-transparent text-lg font-semibold" value="holdings">
            Holdings
          </TabsTrigger>
          <TabsTrigger className="bg-transparent text-lg font-semibold" value="recent-activity">
            Recent Activity
          </TabsTrigger>

          <SwapDialog>
            <Button className="ml-auto" variant="gradient-primary" size="default">
              Swap
              <ArrowLeftRight className="size-4" />
            </Button>
          </SwapDialog>
        </TabsList>
        <TabsContent value="holdings">
          <BalanceTable />
        </TabsContent>
        <TabsContent value="recent-activity">
          <BalanceTable />
        </TabsContent>
      </Tabs>
    </SingleColumnLayout>
  );
}
