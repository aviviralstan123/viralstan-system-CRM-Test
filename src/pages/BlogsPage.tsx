import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { blogs, Blog } from "@/lib/mock-data";
import { Plus, Eye } from "lucide-react";

const columns: Column<Blog>[] = [
  {
    header: "Post",
    cell: (row) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium truncate">{row.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{row.excerpt}</p>
      </div>
    ),
  },
  { header: "Author", cell: (row) => <span className="text-sm">{row.author}</span> },
  { header: "Category", cell: (row) => <span className="text-sm text-muted-foreground">{row.category}</span> },
  { header: "Status", cell: (row) => <StatusBadge label={row.status} variant={getInvoiceStatusVariant(row.status)} /> },
  {
    header: "Views",
    cell: (row) => (
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" />{row.views.toLocaleString()}
      </span>
    ),
  },
];

export default function BlogsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Blogs" description="Manage your content marketing"
        actions={<Button className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1.5" /> New Post</Button>}
      />
      <DataTable columns={columns} data={blogs} searchKey="title" searchPlaceholder="Search posts..." />
    </div>
  );
}
