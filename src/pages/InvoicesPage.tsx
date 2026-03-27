import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { invoices, Invoice } from "@/lib/mock-data";
import { Plus, FileDown } from "lucide-react";

const columns: Column<Invoice>[] = [
  {
    header: "Invoice",
    cell: (row) => (
      <div>
        <p className="text-sm font-semibold font-mono">{row.invoiceNumber}</p>
        <p className="text-xs text-muted-foreground">{row.clientName}</p>
      </div>
    ),
  },
  {
    header: "Items",
    cell: (row) => (
      <div className="space-y-0.5">
        {row.items.map((item, i) => (
          <p key={i} className="text-xs text-muted-foreground">
            {item.serviceName} × {item.quantity}
          </p>
        ))}
      </div>
    ),
  },
  {
    header: "Amount",
    cell: (row) => <span className="text-sm font-bold">${row.amount.toLocaleString()}</span>,
  },
  {
    header: "Status",
    cell: (row) => <StatusBadge label={row.status} variant={getInvoiceStatusVariant(row.status)} />,
  },
  {
    header: "Issue Date",
    cell: (row) => <span className="text-sm text-muted-foreground">{new Date(row.issueDate).toLocaleDateString()}</span>,
  },
  {
    header: "Due Date",
    cell: (row) => <span className="text-sm text-muted-foreground">{new Date(row.dueDate).toLocaleDateString()}</span>,
  },
  {
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <FileDown className="h-4 w-4" />
      </Button>
    ),
    className: "w-12",
  },
];

export default function InvoicesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Invoices"
        description="Create and manage invoices for your clients"
        actions={
          <Button className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-1.5" /> Create Invoice
          </Button>
        }
      />
      <DataTable columns={columns} data={invoices} searchKey="clientName" searchPlaceholder="Search invoices..." />
    </div>
  );
}
