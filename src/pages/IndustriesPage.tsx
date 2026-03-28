import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { industries as initialIndustries, services, Industry } from "@/lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyIndustry = {
  serviceId: "",
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
};

export default function IndustriesPage() {
  const [industryList, setIndustryList] = useState<Industry[]>(initialIndustries);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyIndustry);

  const handleEdit = (industry: Industry) => {
    setEditing(industry);
    setCreating(false);
    setForm({
      serviceId: industry.serviceId,
      title: industry.title,
      content: industry.content,
      metaTitle: industry.metaTitle,
      metaDescription: industry.metaDescription,
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

  const handleSave = () => {
    if (!form.serviceId) {
      toast.error("Please select a service");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editing) {
      setIndustryList((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...i, ...form } : i))
      );
      toast.success("Industry updated");
    } else {
      const newIndustry: Industry = {
        id: String(Date.now()),
        ...form,
      };
      setIndustryList((prev) => [...prev, newIndustry]);
      toast.success("Industry created");
    }
    handleCancel();
  };

  const handleDelete = (id: string) => {
    setIndustryList((prev) => prev.filter((i) => i.id !== id));
    toast.success("Industry deleted");
  };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Industries"
        description="Viralstan Admin · Saturday, 28 March 2026"
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{industryList.length} industries</p>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Industry
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Industry" : "New Industry"}</h3>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Service *</label>
            <select
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Title</label>
            <Input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Content</label>
            <Textarea placeholder="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-[120px]" />
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

      {/* Table */}
      {industryList.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
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
                    {services.find((s) => s.id === industry.serviceId)?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(industry)} className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(industry.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
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
          <div className="text-center py-12 text-sm text-muted-foreground">
            No industries yet. Click "Add Industry" to create one.
          </div>
        )
      )}
    </div>
  );
}
