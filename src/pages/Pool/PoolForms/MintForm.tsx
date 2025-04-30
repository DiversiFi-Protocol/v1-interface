import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function MintForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint</CardTitle>
      </CardHeader>
      <CardContent className="flexColumn gap-1"></CardContent>
      <CardFooter>
        <Button className="w-full">Mint</Button>
      </CardFooter>
    </Card>
  );
}
