import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { payments, Payment } from "@/lib/mock-data";
import { CreditCard, Building2, Wallet } from "lucide-react";

const methodIcons: Record<string, React.ReactNode> = {
  credit_card: <CreditCard className="h-3.5 w-3.5" />,
  bank_transfer: <Building2 className="h-3.5 w-3.5" />,
  paypal: <Wallet className="h-3.5 w-3.5" />,
  stripe: <CreditCard className="h-3.5 w-3.5" />,
};

const columns: Column<Payment>[] = [
  {
    header: "Transaction",
    cell: (row) => (
      <div>
        <p className="text-sm font-mono font-medium">{row.transactionId}</p>
        <p className="text-xs text-muted-foreground">{row.invoiceNumber}</p>
      </div>
    ),
  },
  {
    header: "Client",
    cell: (row) => <span className="text-sm">{row.clientName}</span>,
  },
  {
    header: "Amount",
    cell: (row) => <span className="text-sm font-bold">${row.amount.toLocaleString()}</span>,
  },
  {
    header: "Method",
    cell: (row) => (
      <span className="text-sm text-muted-foreground flex items-center gap-1.5 capitalize">
        {methodIcons[row.method]} {row.method.replace("_", " ")}
      </span>
    ),
  },
  {
    header: "Status",
    cell: (row) => <StatusBadge label={row.status} variant={getInvoiceStatusVariant(row.status)} />,
  },
  {
    header: "Date",
    cell: (row) => <span className="text-sm text-muted-foreground">{new Date(row.date).toLocaleDateString()}</span>,
  },
];

export default function PaymentsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Payments" description="Track all payment transactions" />
      <DataTable columns={columns} data={payments} searchKey="clientName" searchPlaceholder="Search payments..." />
    </div>
  );
}
