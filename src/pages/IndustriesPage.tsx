import { useState, useEffect } from "react";
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

export default function IndustriesPage() {
  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyIndustry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [industriesData, servicesData] = await Promise.all([
        industryService.getAllIndustries(),
        serviceService.getAllServices()
      ]);
      
      setIndustryList(industriesData.data || industriesData);
      setServices(servicesData.data || servicesData);
    } catch (error) {
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const data = await industryService.getAllIndustries();
      setIndustryList(data.data || data);
    } catch (error) {
      toast.error("Failed to load industries");
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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

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
      fetchIndustries();
      handleCancel();
    } catch (error) {
      toast.error("Error saving industry");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this industry?")) return;
    try {
      await industryService.deleteIndustry(id);
      toast.success("Industry deleted");
      fetchIndustries();
    } catch (error) {
      toast.error("Error deleting industry");
    }
  };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in px-6 py-6">
      <div className="bg-amber-100 border border-amber-300 rounded p-2 text-xs text-amber-800 mb-4">
        DEBUG: API URL: {import.meta.env.VITE_API_URL || "Using fallback: http://localhost:5000/api"}
      </div>
      <PageHeader
        title="Industries"
        description="Manage industry-specific content and SEO configurations."
      />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{industryList.length} industries configured</p>
        <Button className="gradient-primary text-primary-foreground border-0 h-9 px-4 rounded-lg" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Industry
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-primary">{editing ? "Edit Industry" : "New Industry"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary ml-1">Linked Service *</label>
              <select
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              >
                <option value="">Select service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary ml-1">Industry Title *</label>
              <Input 
                className="h-11 rounded-xl bg-background/50"
                placeholder="Industry title" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary ml-1">Page Content</label>
            <Textarea 
              placeholder="Content for the industry page" 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
              className="min-h-[160px] rounded-xl bg-background/50 resize-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary ml-1">Meta Title</label>
              <Input 
                className="h-11 rounded-xl bg-background/50"
                placeholder="SEO Title" 
                value={form.meta_title} 
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary ml-1">Meta Description</label>
              <Input 
                className="h-11 rounded-xl bg-background/50"
                placeholder="SEO Description" 
                value={form.meta_description} 
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })} 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <button className="gradient-primary text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transform active:scale-[0.98] transition-all" onClick={handleSave}>
              {editing ? "Update Industry" : "Create Industry"}
            </button>
            <Button variant="outline" className="h-11 px-6 rounded-xl font-medium" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground animate-pulse">Loading industries...</div>
      ) : industryList.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Industry Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Linked Service</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {industryList.map((industry) => (
                <tr key={industry.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-primary">{industry.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {services.find((s) => String(s.id) === String(industry.service_id))?.title || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(industry)} className="h-9 w-9 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 transition-shadow">
                        <Pencil className="h-4.5 w-4.5" />
                      </button>
                      <button onClick={() => handleDelete(industry.id)} className="h-9 w-9 rounded-xl flex items-center justify-center text-destructive hover:bg-destructive/10 transition-shadow">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/60">
            <p className="text-muted-foreground text-base">No industries configured yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Configure your first industry to see it here.</p>
          </div>
        )
      )}
    </div>
  );
}
