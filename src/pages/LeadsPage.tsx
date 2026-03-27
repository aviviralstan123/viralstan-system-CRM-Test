import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { leads, Lead } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const columns: Column<Lead>[] = [
  {
    header: "Lead",
    cell: (row) => (
      <div>
        <p className="text-sm font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.company}</p>
      </div>
    ),
  },
  { header: "Email", cell: (row) => <span className="text-sm text-muted-foreground">{row.email}</span> },
  { header: "Source", cell: (row) => <span className="text-sm">{row.source}</span> },
  { header: "Status", cell: (row) => <StatusBadge label={row.status} variant={getInvoiceStatusVariant(row.status)} /> },
  { header: "Value", cell: (row) => <span className="text-sm font-semibold">${row.value.toLocaleString()}</span> },
  { header: "Created", cell: (row) => <span className="text-sm text-muted-foreground">{new Date(row.createdAt).toLocaleDateString()}</span> },
];

export default function LeadsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Leads" description="Track and manage your sales pipeline"
        actions={<Button className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1.5" /> Add Lead</Button>}
      />
      <DataTable columns={columns} data={leads} searchKey="name" searchPlaceholder="Search leads..." />
    </div>
  );
}
