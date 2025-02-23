import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TwoColumnLayout from '@/layouts/TwoColumnLayout';
import AddLiquidity from './PoolForms/AddLiquidity';
import SwapForm from './PoolForms/SwapForm';

export default function Pool() {
  return (
    <TwoColumnLayout
      main={
        <div className="p-4">
          <h1 className="text-2xl font-bold">Pool Main Content</h1>
          {/* Add lots of content to test scrolling */}
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} className="my-4">
              Placeholder Item {i + 1}
            </p>
          ))}
        </div>
      }
      sidebar={
        <div className="p-4">
          <Tabs defaultValue="pool">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="pool">
                Pool
              </TabsTrigger>
              <TabsTrigger className="w-full" value="swap">
                Swap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pool">
              <AddLiquidity />
            </TabsContent>

            <TabsContent value="swap">
              <SwapForm />
            </TabsContent>
          </Tabs>
        </div>
      }
    />
  );
}
