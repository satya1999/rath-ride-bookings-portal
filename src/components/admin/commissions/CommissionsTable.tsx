
import { Commission } from "@/hooks/useCommissions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2, Eye, FileText, MoreHorizontal, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CommissionsTableProps {
  commissions: Commission[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
}

const CommissionsTable = ({ commissions, loading, onStatusChange }: CommissionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commission ID</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Booking</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array(5).fill(0).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
            </TableRow>
          ))
        ) : commissions.length > 0 ? (
          commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell className="font-medium">{commission.id.substring(0, 8)}</TableCell>
              <TableCell>
                <div>
                  <div>{commission.agent.name}</div>
                  <div className="text-xs text-muted-foreground">{commission.agent.email}</div>
                </div>
              </TableCell>
              <TableCell>{commission.booking}</TableCell>
              <TableCell>{commission.amount}</TableCell>
              <TableCell>{commission.date}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    commission.status === "paid" ? "bg-green-600 text-white border-green-600" :
                    commission.status === "pending" ? "bg-amber-500 text-white border-amber-500" :
                    "bg-red-500 text-white border-red-500"
                  }
                >
                  {commission.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Invoice</span>
                    </DropdownMenuItem>
                    {commission.status === "pending" && (
                      <>
                        <DropdownMenuItem 
                          className="text-green-600"
                          onClick={() => onStatusChange(commission.id, "paid")}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          <span>Approve</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onStatusChange(commission.id, "rejected")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Reject</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No commissions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CommissionsTable;
