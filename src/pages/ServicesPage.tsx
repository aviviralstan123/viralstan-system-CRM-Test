import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { services, Service } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const columns: Column<Service>[] = [
  {
    header: "Service",
    cell: (row) => (
      <div>
        <p className="text-sm font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{row.description}</p>
      </div>
    ),
  },
  { header: "Category", cell: (row) => <span className="text-sm">{row.category}</span> },
  { header: "Price", cell: (row) => <span className="text-sm font-semibold">${row.price.toLocaleString()}</span> },
  { header: "Status", cell: (row) => <StatusBadge label={row.status} variant={getInvoiceStatusVariant(row.status)} /> },
  { header: "Clients", cell: (row) => <span className="text-sm text-muted-foreground">{row.clients}</span> },
];

export default function ServicesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Services" description="Manage your service offerings"
        actions={<Button className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1.5" /> Add Service</Button>}
      />
      <DataTable columns={columns} data={services} searchKey="name" searchPlaceholder="Search services..." />
    </div>
  );
}
