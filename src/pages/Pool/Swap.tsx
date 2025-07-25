import SingleColumnLayout from '@/layouts/SingleColumnLayout';
import TwoColumnLayout from '@/layouts/TwoColumnLayout';
import { InfoIcon } from 'lucide-react';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AssetCards from './AssetCards/AssetCards';
import InsuranceFund from './InsuranceFund/InsuranceFund';
import PoolPieChart from './PoolCharts/PoolPieChart';
import VolumeAndFeeChart from './PoolCharts/VolumeAndFeeChart';
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
          <PoolHeader />
          <SwapForm />
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
    <SingleColumnLayout className="w-full" innerClassName="flexColumn gap-8">
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

  return (
    <TwoColumnLayout
      main={
        <div className="flexColumn p-0.5 gap-1">
          <PoolHeader />
          <PoolPieChart />
          <VolumeAndFeeChart />
          <h2>My Portfolio</h2>
          <BalanceTable />
        </div>
      }
      sidebar={
        <div className="flexColumn p-0.5 gap-1">
          <SwapForm />
          <AssetCards />

          <InsuranceFund />
        </div>
      }
    />
  );
}
