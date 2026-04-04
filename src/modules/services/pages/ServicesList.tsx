import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/lib/mock-data";
import { getAllServices, createService, updateService, deleteService } from "@/services/serviceService";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const emptyService: Omit<Service, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: "",
  status: "active",
  clients: 0,
  metaTitle: "",
  metaDescription: "",
};

export default function ServicesList() {
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyService);

  const fetchServicesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllServices();
      // Map title to name for the table to work without much refactoring
      const mapped = (res.data || []).map((s: any) => ({
        ...s,
        name: s.title,
        status: s.is_active ? 'active' : 'inactive',
        metaTitle: s.meta_title,
        metaDescription: s.meta_description
      }));
      setServiceList(mapped);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);

  const handleEdit = (service: Service) => {
    setEditing(service);
    setCreating(false);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      status: service.status as "active" | "inactive",
      clients: service.clients || 0,
      metaTitle: service.metaTitle || "",
      metaDescription: service.metaDescription || "",
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
    if (!form.name.trim()) {
      toast.error("Title is required");
      return;
    }
    
    setActionLoading(true);
    try {
      if (editing) {
        await updateService(editing.id, {
          title: form.name,
          ...form
        } as any);
        toast.success("Service updated");
      } else {
        await createService({
          title: form.name,
          ...form
        } as any);
        toast.success("Service created");
      }
      fetchServicesData();
      handleCancel();
    } catch (error) {
      toast.error(editing ? "Failed to update service" : "Failed to create service");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    setActionLoading(true);
    try {
      await deleteService(id);
      toast.success("Service deleted");
      fetchServicesData();
    } catch (error) {
      toast.error("Failed to delete service");
    } finally {
      setActionLoading(false);
    }
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEdit(row)} 
            className="h-8 w-8 text-primary hover:bg-primary/10"
            disabled={actionLoading}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDelete(row.id)} 
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            disabled={actionLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Services"
        description="Manage your product and service offerings."
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading services..." : `${serviceList.length} services available`}
        </p>
        <Button 
          className="gradient-primary text-primary-foreground border-0" 
          onClick={handleCreate}
          disabled={loading || actionLoading}
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Service
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Service" : "New Service"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Title</label>
              <Input placeholder="Service title" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Category</label>
              <Input placeholder="SEO, Ads, etc." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Price ($)</label>
              <Input type="number" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Status</label>
              <select 
                value={form.status} 
                onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary block">Description</label>
            <Textarea placeholder="Service description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Meta Title</label>
              <Input placeholder="SEO Title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Meta Description</label>
              <Input placeholder="SEO Description" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              className="gradient-primary text-primary-foreground border-0" 
              onClick={handleSave}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                editing ? "Update Service" : "Create Service"
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={actionLoading}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
             <div className="p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading services from database...</p>
             </div>
        ) : (
            <DataTable columns={columns} data={serviceList} searchKey="name" searchPlaceholder="Search services..." />
        )}
      </div>
    </div>
  );
}
