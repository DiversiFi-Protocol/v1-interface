import TwoColumnLayout from '@/layouts/TwoColumnLayout';
import InsuranceFund from './InsuranceFund/InsuranceFund';
import PoolPieChart from './PoolCharts/PoolPieChart';
import VolumeAndFeeChart from './PoolCharts/VolumeAndFeeChart';
import SwapForm from './PoolForms/SwapForm';

export default function Pool() {
  return (
    <TwoColumnLayout
      main={
        <div className="p-4 flexColumn gap-4">
          <h1 className="text-2xl font-bold">USD1 Liquidity Pool</h1>
          <PoolPieChart />
          <VolumeAndFeeChart />
        </div>
      }
      sidebar={
        <div className="flexColumn p-4 gap-4">
          <SwapForm />
          <InsuranceFund />
        </div>
      }
    />
  );
}
