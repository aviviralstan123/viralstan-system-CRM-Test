import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as leadService from "@/services/leadService";
import { Lead } from "@/services/leadService";

const emptyLead: Omit<Lead, "id"> = {
  name: "", 
  email: "", 
  company: "", 
  source: "Website", 
  status: "new", 
  value: 0, 
  created_at: new Date().toISOString(),
};

export default function LeadsList() {
  const [leadList, setLeadList] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyLead);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getAllLeads();
      setLeadList(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = (leadList || []).filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    (l.company && l.company.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (lead: Lead) => {
    setEditing(lead); 
    setCreating(false);
    setForm({ 
      name: lead.name, 
      email: lead.email, 
      company: lead.company, 
      source: lead.source, 
      status: lead.status, 
      value: lead.value, 
      createdAt: lead.createdAt 
    });
  };

  const handleCancel = () => { 
    setCreating(false); 
    setEditing(null); 
    setForm(emptyLead); 
  };

  const handleSave = async () => {
    if (!form.name.trim()) { 
      toast.error("Name is required"); 
      return; 
    }
    try {
      if (editing) {
        await leadService.updateLead(editing.id, form);
        toast.success("Lead updated");
      } else {
        await leadService.createLead(form);
        toast.success("Lead added");
      }
      fetchLeads();
      handleCancel();
    } catch (error) {
      toast.error("Failed to save lead");
    }
  };

  const handleDelete = async (id: string) => { 
    if (!confirm("Are you sure?")) return;
    try {
      await leadService.deleteLead(id);
      toast.success("Lead deleted");
      fetchLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Leads" 
        description="Track and manage your potential business opportunities." 
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-9" 
          />
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => { setCreating(true); setEditing(null); setForm(emptyLead); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Lead
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
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
              <select 
                value={form.source} 
                onChange={e => setForm({ ...form, source: e.target.value })} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Website</option>
                <option>Referral</option>
                <option>LinkedIn</option>
                <option>Google Ads</option>
                <option>Twitter</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Status</label>
              <select 
                value={form.status} 
                onChange={e => setForm({ ...form, status: e.target.value as Lead["status"] })} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
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

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
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
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading leads...
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map(lead => (
                <tr 
                  key={lead.id} 
                  className="border-b border-border last:border-0 hover:bg-primary/[0.02] transition-all duration-200 group/row"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm">{lead.source}</span></td>
                  <td className="px-4 py-3"><StatusBadge label={lead.status} variant={getInvoiceStatusVariant(lead.status)} /></td>
                  <td className="px-4 py-3"><span className="text-sm font-semibold">${(lead.value || 0).toLocaleString()}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(lead)} className="h-8 w-8 text-primary hover:bg-primary/10">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No leads found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
