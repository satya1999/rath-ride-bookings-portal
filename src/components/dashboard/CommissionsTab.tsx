
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import CommissionHistory, { CommissionHistoryItem } from "./CommissionHistory";

interface CommissionsTabProps {
  commissions: CommissionHistoryItem[];
}

const CommissionsTab = ({ commissions }: CommissionsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Commission History</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </CardHeader>
      <CardContent>
        <CommissionHistory commissions={commissions} />
      </CardContent>
    </Card>
  );
};

export default CommissionsTab;
