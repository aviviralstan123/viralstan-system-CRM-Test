import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { services as initialServices, Service } from "@/lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyService = {
  name: "",
  description: "",
  price: 0,
  category: "",
  status: "active" as const,
  clients: 0,
  metaTitle: "",
  metaDescription: "",
};

export default function ServicesPage() {
  const [serviceList, setServiceList] = useState<Service[]>(initialServices);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyService);

  const handleEdit = (service: Service) => {
    setEditing(service);
    setCreating(false);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      status: service.status as "active" | "inactive",
      clients: service.clients,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
    });
  };

  const handleCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyService);
  };

  const handleCancel = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyService);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editing) {
      setServiceList((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s))
      );
      toast.success("Service updated");
    } else {
      const newService: Service = {
        id: String(Date.now()),
        ...form,
      };
      setServiceList((prev) => [...prev, newService]);
      toast.success("Service created");
    }
    handleCancel();
  };

  const handleDelete = (id: string) => {
    setServiceList((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };

  const showForm = creating || editing;

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
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row)} className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Services"
        description="Viralstan Admin · Saturday, 28 March 2026"
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{serviceList.length} services</p>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Service
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Service" : "New Service"}</h3>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Title</label>
            <Input placeholder="title" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Description</label>
            <Textarea placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Meta Title</label>
            <Input placeholder="meta Title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Meta Description</label>
            <Input placeholder="meta Description" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="gradient-primary text-primary-foreground border-0" onClick={handleSave}>
              {editing ? "Update" : "Create"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={serviceList} searchKey="name" searchPlaceholder="Search services..." />
    </div>
  );
}
