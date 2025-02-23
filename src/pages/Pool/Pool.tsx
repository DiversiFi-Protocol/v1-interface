import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TwoColumnLayout from '@/layouts/TwoColumnLayout';

export default function Pool() {
  return (
    <TwoColumnLayout
      main={
        <div className="p-4">
          <h1 className="text-2xl font-bold">Pool Main Content</h1>
          {/* Add lots of content to test scrolling */}
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} className="my-4">
              Main content row {i + 1}
            </p>
          ))}
        </div>
      }
      sidebar={
        <div className="p-4">
          <Tabs defaultValue="pool">
            <TabsList>
              <TabsTrigger value="pool">Pool</TabsTrigger>
              <TabsTrigger value="vault">Vault</TabsTrigger>
            </TabsList>
            <TabsContent value="pool">
              <div className="p-4">
                <h2 className="text-xl font-semibold">Pool</h2>
                {/* Add lots of content to test scrolling */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <p key={i} className="my-4">
                    Pool row {i + 1}
                  </p>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="vault">
              <div className="p-4">
                <h2 className="text-xl font-semibold">Vault</h2>
                {/* Add lots of content to test scrolling */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <p key={i} className="my-4">
                    Vault row {i + 1}
                  </p>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      }
    />
  );
}
