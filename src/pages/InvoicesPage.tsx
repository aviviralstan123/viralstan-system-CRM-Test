import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invoices as initialInvoices, clients, services, Invoice, InvoiceItem } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Search, FileDown, X } from "lucide-react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>(initialInvoices);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState<Invoice["status"]>("pending");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ serviceName: "", price: 0, quantity: 1 }]);

  const filtered = invoiceList.filter(i => i.clientName.toLowerCase().includes(search.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

  const totalAmount = items.reduce((s, item) => s + item.price * item.quantity, 0);

  const resetForm = () => {
    setClientId(""); setStatus("pending"); setDueDate(""); setItems([{ serviceName: "", price: 0, quantity: 1 }]);
    setCreating(false); setEditing(null);
  };

  const handleEdit = (inv: Invoice) => {
    setEditing(inv); setCreating(false);
    setClientId(inv.clientId); setStatus(inv.status); setDueDate(inv.dueDate);
    setItems(inv.items.length > 0 ? [...inv.items] : [{ serviceName: "", price: 0, quantity: 1 }]);
  };

  const addItem = () => setItems(prev => [...prev, { serviceName: "", price: 0, quantity: 1 }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleSave = () => {
    if (!clientId) { toast.error("Select a client"); return; }
    if (items.every(it => !it.serviceName)) { toast.error("Add at least one item"); return; }

    const client = clients.find(c => c.id === clientId);
    const validItems = items.filter(it => it.serviceName);
    const amount = validItems.reduce((s, it) => s + it.price * it.quantity, 0);

    if (editing) {
      setInvoiceList(prev => prev.map(inv => inv.id === editing.id ? {
        ...inv, clientId, clientName: client?.company || "", items: validItems, amount, status, dueDate,
      } : inv));
      toast.success("Invoice updated");
    } else {
      const newInv: Invoice = {
        id: String(Date.now()),
        invoiceNumber: `INV-${String(invoiceList.length + 1).padStart(3, "0")}`,
        clientId, clientName: client?.company || "", items: validItems, amount, status,
        issueDate: new Date().toISOString().split("T")[0], dueDate,
      };
      setInvoiceList(prev => [...prev, newInv]);
      toast.success("Invoice created");
    }
    resetForm();
  };

  const handleDelete = (id: string) => { setInvoiceList(prev => prev.filter(i => i.id !== id)); toast.success("Invoice deleted"); };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Invoices" description="Viralstan Admin · Saturday, 28 March 2026" />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => { setCreating(true); setEditing(null); resetForm(); setCreating(true); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Invoice
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Invoice" : "New Invoice"}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Client *</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company} ({c.name})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Invoice["status"])} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Due Date</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-primary">Items</label>
              <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select value={item.serviceName} onChange={e => { const svc = services.find(s => s.name === e.target.value); updateItem(idx, "serviceName", e.target.value); if (svc) updateItem(idx, "price", svc.price); }} className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select service</option>
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <Input type="number" placeholder="Price" value={item.price || ""} onChange={e => updateItem(idx, "price", Number(e.target.value))} className="w-28" />
                  <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, "quantity", Number(e.target.value))} className="w-20" />
                  <span className="text-sm font-semibold w-24 text-right">${(item.price * item.quantity).toLocaleString()}</span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(idx)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3 border-t border-border pt-3">
              <span className="text-base font-bold">Total: ${totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="gradient-primary text-primary-foreground border-0" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold font-mono">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{inv.clientName}</p>
                </td>
                <td className="px-4 py-3">
                  {inv.items.map((item, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{item.serviceName} × {item.quantity}</p>
                  ))}
                </td>
                <td className="px-4 py-3"><span className="text-sm font-bold">${inv.amount.toLocaleString()}</span></td>
                <td className="px-4 py-3"><StatusBadge label={inv.status} variant={getInvoiceStatusVariant(inv.status)} /></td>
                <td className="px-4 py-3"><span className="text-sm text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(inv.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No invoices found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
