import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clients as initialClients, Client } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Search, Mail } from "lucide-react";
import { toast } from "sonner";

const emptyClient: Omit<Client, "id"> = {
  name: "", email: "", company: "", phone: "", status: "active", totalSpent: 0, joinedAt: new Date().toISOString().split("T")[0],
};

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>(initialClients);
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyClient);
  const [search, setSearch] = useState("");

  const filtered = clientList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (client: Client) => {
    setEditing(client);
    setCreating(false);
    setForm({ name: client.name, email: client.email, company: client.company, phone: client.phone, status: client.status, totalSpent: client.totalSpent, joinedAt: client.joinedAt });
  };

  const handleCancel = () => { setCreating(false); setEditing(null); setForm(emptyClient); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email are required"); return; }
    if (editing) {
      setClientList(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
      toast.success("Client updated");
    } else {
      setClientList(prev => [...prev, { id: String(Date.now()), ...form }]);
      toast.success("Client added");
    }
    handleCancel();
  };

  const handleDelete = (id: string) => { setClientList(prev => prev.filter(c => c.id !== id)); toast.success("Client deleted"); };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Clients" description="Viralstan Admin · Saturday, 28 March 2026" />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => { setCreating(true); setEditing(null); setForm(emptyClient); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Client
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Client" : "New Client"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Name *</label>
              <Input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Email *</label>
              <Input placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Company</label>
              <Input placeholder="Company name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Phone</label>
              <Input placeholder="+1 555-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Client["status"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(client => (
              <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary-foreground">{client.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{client.email}</span></td>
                <td className="px-4 py-3"><StatusBadge label={client.status} variant={getInvoiceStatusVariant(client.status)} /></td>
                <td className="px-4 py-3"><span className="text-sm font-semibold">${client.totalSpent.toLocaleString()}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(client)} className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(client.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No clients found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
