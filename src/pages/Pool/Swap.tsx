import SingleColumnLayout from '@/layouts/SingleColumnLayout';
import TwoColumnLayout from '@/layouts/TwoColumnLayout';
import { InfoIcon } from 'lucide-react';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { Button } from '@/components/ui/button';

import AssetCards from './AssetCards/AssetCards';
import InsuranceFund from './InsuranceFund/InsuranceFund';
import PoolPieChart from './PoolCharts/PoolPieChart';
import VolumeAndFeeChart from './PoolCharts/VolumeAndFeeChart';
import SwapForm from './PoolForms/SwapForm';
import PoolHeader from './PoolHeader/PoolHeader';
import PoolInfoDrawer from './PoolInfoDrawer/PoolInfoDrawer';

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
    <TwoColumnLayout
      main={
        <div className="p-4 flexColumn gap-4">
          <PoolHeader />
          <PoolPieChart />
          <VolumeAndFeeChart />
        </div>
      }
      sidebar={
        <div className="flexColumn p-4 gap-4">
          <SwapForm />
          <AssetCards />

          <InsuranceFund />
        </div>
      }
    />
  );
}
