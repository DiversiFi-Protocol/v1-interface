import SingleColumnLayout from '@/layouts/SingleColumnLayout';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SettingsPage() {
  const renderLanguageSettings = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium ">Language</CardTitle>
        </CardHeader>

        <CardContent>
          <RadioGroup defaultValue="en">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">English</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };

  return (
    <SingleColumnLayout className="w-full" innerClassName="flexColumn gap-8 py-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      {renderLanguageSettings()}
    </SingleColumnLayout>
  );
}
