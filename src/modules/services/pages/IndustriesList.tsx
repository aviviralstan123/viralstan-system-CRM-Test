import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as industryService from "@/services/industryService";
import * as serviceService from "@/services/serviceService";

interface Industry {
  id: string | number;
  service_id: string | number;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  slug: string;
}

interface Service {
  id: string | number;
  title: string;
}

const emptyIndustry = {
  service_id: "",
  title: "",
  content: "",
  meta_title: "",
  meta_description: "",
  slug: "",
};

export default function IndustriesList() {
  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyIndustry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [industriesResponse, servicesResponse] = await Promise.all([
        industryService.getAllIndustries(),
        serviceService.getAllServices(),
      ]);

      setIndustryList(industriesResponse || []);
      setServices(servicesResponse.data || []);
    } catch (error) {
      toast.error("Failed to load industries");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (industry: Industry) => {
    setEditing(industry);
    setCreating(false);
    setForm({
      service_id: String(industry.service_id),
      title: industry.title,
      content: industry.content,
      meta_title: industry.meta_title || "",
      meta_description: industry.meta_description || "",
      slug: industry.slug,
    });
  };

  const handleCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyIndustry);
  };

  const handleCancel = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyIndustry);
  };

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleSave = async () => {
    if (!form.service_id) {
      toast.error("Please select a service");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
      };

      if (editing) {
        await industryService.updateIndustry(editing.id, payload);
        toast.success("Industry updated");
      } else {
        await industryService.createIndustry(payload);
        toast.success("Industry created");
      }

      await fetchData();
      handleCancel();
    } catch (error) {
      toast.error("Failed to save industry");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this industry?")) {
      return;
    }

    try {
      await industryService.deleteIndustry(id);
      toast.success("Industry deleted");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete industry");
    }
  };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Industries"
        description="Manage industry-specific content and SEO configurations."
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{industryList.length} industries configured</p>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Industry
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Industry" : "New Industry"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Linked Service *</label>
              <select
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Industry Title *</label>
              <Input
                placeholder="Industry title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary block">Page Content</label>
            <Textarea
              placeholder="Content for the industry page"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Meta Title</label>
              <Input
                placeholder="SEO Title"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary block">Meta Description</label>
              <Input
                placeholder="SEO Description"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="gradient-primary text-primary-foreground border-0" onClick={handleSave}>
              {editing ? "Update Industry" : "Create Industry"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed">
          Loading industries...
        </div>
      ) : industryList.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {industryList.map((industry) => (
                <tr key={industry.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{industry.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {services.find((service) => String(service.id) === String(industry.service_id))?.title || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(industry)} className="h-8 w-8 text-primary hover:bg-primary/10">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(industry.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-12 text-sm text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed">
            No industries configured. Click "Add Industry" to get started.
          </div>
        )
      )}
    </div>
  );
}
