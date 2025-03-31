import TwoColumnLayout from '@/layouts/TwoColumnLayout';
import PoolPieChart from './PoolCharts/PoolPieChart';
import VolumeAndFeeChart from './PoolCharts/VolumeAndFeeChart';
import SwapForm from './PoolForms/SwapForm';

export default function Pool() {
  return (
    <TwoColumnLayout
      main={
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">USD1 Liquidity Pool</h1>
          <PoolPieChart />
          <VolumeAndFeeChart />
        </div>
      }
      sidebar={
        <div className="p-4">
          <SwapForm />
        </div>
      }
    />
  );
}
