import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PhilippinesChoropleth from "@/components/custom/PhilippinesChoropleth";

export default function MapCard() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>Responses origin</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[70vh] w-full">
        <PhilippinesChoropleth />
      </CardContent>
    </Card>
  );
}
