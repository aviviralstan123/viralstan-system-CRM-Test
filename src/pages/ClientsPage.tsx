import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { clients, Client } from "@/lib/mock-data";
import { Plus, Mail } from "lucide-react";

const columns: Column<Client>[] = [
  {
    header: "Client",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-primary-foreground">{row.name[0]}</span>
        </div>
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.company}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Email",
    cell: (row) => (
      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Mail className="h-3.5 w-3.5" />{row.email}
      </span>
    ),
  },
  {
    header: "Status",
    cell: (row) => <StatusBadge label={row.status} variant={getInvoiceStatusVariant(row.status)} />,
  },
  {
    header: "Total Spent",
    cell: (row) => <span className="text-sm font-semibold">${row.totalSpent.toLocaleString()}</span>,
  },
  {
    header: "Joined",
    cell: (row) => <span className="text-sm text-muted-foreground">{new Date(row.joinedAt).toLocaleDateString()}</span>,
  },
];

export default function ClientsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clients"
        description="Manage your client relationships"
        actions={
          <Button className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-1.5" /> Add Client
          </Button>
        }
      />
      <DataTable columns={columns} data={clients} searchKey="name" searchPlaceholder="Search clients..." />
    </div>
  );
}
