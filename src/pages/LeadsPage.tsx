import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leads as initialLeads, Lead } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const emptyLead: Omit<Lead, "id"> = {
  name: "", email: "", company: "", source: "Website", status: "new", value: 0, createdAt: new Date().toISOString().split("T")[0],
};

export default function LeadsPage() {
  const [leadList, setLeadList] = useState<Lead[]>(initialLeads);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyLead);
  const [search, setSearch] = useState("");

  const filtered = leadList.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (lead: Lead) => {
    setEditing(lead); setCreating(false);
    setForm({ name: lead.name, email: lead.email, company: lead.company, source: lead.source, status: lead.status, value: lead.value, createdAt: lead.createdAt });
  };

  const handleCancel = () => { setCreating(false); setEditing(null); setForm(emptyLead); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (editing) {
      setLeadList(prev => prev.map(l => l.id === editing.id ? { ...l, ...form } : l));
      toast.success("Lead updated");
    } else {
      setLeadList(prev => [...prev, { id: String(Date.now()), ...form }]);
      toast.success("Lead added");
    }
    handleCancel();
  };

  const handleDelete = (id: string) => { setLeadList(prev => prev.filter(l => l.id !== id)); toast.success("Lead deleted"); };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Leads" description="Viralstan Admin · Saturday, 28 March 2026" />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => { setCreating(true); setEditing(null); setForm(emptyLead); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Lead
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Lead" : "New Lead"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Name *</label>
              <Input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Email</label>
              <Input placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Company</label>
              <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Source</label>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Website</option><option>Referral</option><option>LinkedIn</option><option>Google Ads</option><option>Twitter</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Lead["status"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="proposal">Proposal</option><option value="won">Won</option><option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Value ($)</label>
              <Input type="number" placeholder="0" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="gradient-primary text-primary-foreground border-0" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div><p className="text-sm font-medium">{lead.name}</p><p className="text-xs text-muted-foreground">{lead.company}</p></div>
                </td>
                <td className="px-4 py-3"><span className="text-sm">{lead.source}</span></td>
                <td className="px-4 py-3"><StatusBadge label={lead.status} variant={getInvoiceStatusVariant(lead.status)} /></td>
                <td className="px-4 py-3"><span className="text-sm font-semibold">${lead.value.toLocaleString()}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(lead)} className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(lead.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No leads found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
