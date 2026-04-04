import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as serviceService from "@/services/serviceService";

interface Service {
  id: string | number;
  title: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
}

const emptyService = {
  title: "",
  description: "",
  price: 0,
  category: "",
  is_active: true,
  meta_title: "",
  meta_description: "",
};

export default function ServicesPage() {
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyService);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceService.getAllServices();
      // Adjust if API returns data inside a 'data' property
      const services = data.data || data;
      setServiceList(services);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setCreating(false);
    setForm({
      title: service.title,
      description: service.description,
      price: Number(service.price),
      category: service.category,
      is_active: service.is_active,
      meta_title: service.meta_title || "",
      meta_description: service.meta_description || "",
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

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      if (editing) {
        await serviceService.updateService(String(editing.id), form);
        toast.success("Service updated");
      } else {
        await serviceService.createService(form);
        toast.success("Service created");
      }
      fetchServices();
      handleCancel();
    } catch (error) {
      toast.error("Error saving service");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await serviceService.deleteService(String(id));
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Error deleting service");
    }
  };

  const showForm = creating || editing;

  const columns: Column<Service>[] = [
    {
      header: "Service",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium">{row.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    { header: "Category", cell: (row) => <span className="text-sm">{row.category}</span> },
    { header: "Price", cell: (row) => <span className="text-sm font-semibold">${Number(row.price).toLocaleString()}</span> },
    { header: "Status", cell: (row) => <StatusBadge label={row.is_active ? "active" : "inactive"} variant={row.is_active ? "success" : "neutral"} /> },
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
        description="Manage your CRM services"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Title</label>
              <Input placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Category</label>
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Description</label>
            <Textarea placeholder="Service description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Price</label>
              <Input type="number" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Status</label>
              <select 
                value={form.is_active ? "active" : "inactive"} 
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Meta Title</label>
              <Input placeholder="SEO Title" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Meta Description</label>
              <Input placeholder="SEO Description" value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="gradient-primary text-primary-foreground border-0" onClick={handleSave}>
              {editing ? "Update" : "Create"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading services...</div>
      ) : (
        <DataTable columns={columns} data={serviceList} searchKey="title" searchPlaceholder="Search services..." />
      )}
    </div>
  );
}

