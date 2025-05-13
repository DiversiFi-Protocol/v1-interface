import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import AssetCards from '../AssetCards/AssetCards';
import InsuranceFund from '../InsuranceFund/InsuranceFund';
import PoolPieChart from '../PoolCharts/PoolPieChart';
import VolumeAndFeeChart from '../PoolCharts/VolumeAndFeeChart';

interface PoolInfoDrawerProps {
  children: React.ReactNode;
}

export default function PoolInfoDrawer({ children }: PoolInfoDrawerProps) {
  return (
    <Drawer dismissible>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="p-4 flexColumn gap-4 overflow-auto max-h-[75vh]">
          <DrawerHeader>
            <DrawerTitle>Pool Info</DrawerTitle>
          </DrawerHeader>
          <PoolPieChart />
          <AssetCards />
          <VolumeAndFeeChart />
          <InsuranceFund />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
