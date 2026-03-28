import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { payments as initialPayments, invoices, Payment } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Search, CreditCard, Building2, Wallet } from "lucide-react";
import { toast } from "sonner";

const emptyPayment: Omit<Payment, "id"> = {
  invoiceId: "", invoiceNumber: "", clientName: "", amount: 0, method: "stripe", transactionId: "", status: "pending", date: new Date().toISOString().split("T")[0],
};

export default function PaymentsPage() {
  const [paymentList, setPaymentList] = useState<Payment[]>(initialPayments);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyPayment);
  const [search, setSearch] = useState("");

  const filtered = paymentList.filter(p => p.clientName.toLowerCase().includes(search.toLowerCase()) || p.transactionId.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (payment: Payment) => {
    setEditing(payment); setCreating(false);
    setForm({ invoiceId: payment.invoiceId, invoiceNumber: payment.invoiceNumber, clientName: payment.clientName, amount: payment.amount, method: payment.method, transactionId: payment.transactionId, status: payment.status, date: payment.date });
  };

  const handleCancel = () => { setCreating(false); setEditing(null); setForm(emptyPayment); };

  const handleSave = () => {
    if (!form.invoiceId) { toast.error("Select an invoice"); return; }
    if (editing) {
      setPaymentList(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p));
      toast.success("Payment updated");
    } else {
      setPaymentList(prev => [...prev, { id: String(Date.now()), ...form }]);
      toast.success("Payment recorded");
    }
    handleCancel();
  };

  const handleDelete = (id: string) => { setPaymentList(prev => prev.filter(p => p.id !== id)); toast.success("Payment deleted"); };

  const showForm = creating || editing;

  const methodIcons: Record<string, React.ReactNode> = {
    credit_card: <CreditCard className="h-3.5 w-3.5" />,
    bank_transfer: <Building2 className="h-3.5 w-3.5" />,
    paypal: <Wallet className="h-3.5 w-3.5" />,
    stripe: <CreditCard className="h-3.5 w-3.5" />,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Payments" description="Viralstan Admin · Saturday, 28 March 2026" />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => { setCreating(true); setEditing(null); setForm(emptyPayment); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Record Payment
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Payment" : "Record Payment"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Invoice *</label>
              <select value={form.invoiceId} onChange={e => {
                const inv = invoices.find(i => i.id === e.target.value);
                setForm({ ...form, invoiceId: e.target.value, invoiceNumber: inv?.invoiceNumber || "", clientName: inv?.clientName || "", amount: inv?.amount || 0 });
              }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select invoice</option>
                {invoices.map(inv => <option key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.clientName} (${inv.amount.toLocaleString()})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Amount ($)</label>
              <Input type="number" value={form.amount || ""} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Method</label>
              <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value as Payment["method"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="stripe">Stripe</option><option value="credit_card">Credit Card</option><option value="bank_transfer">Bank Transfer</option><option value="paypal">PayPal</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Payment["status"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Transaction ID</label>
              <Input placeholder="txn_..." value={form.transactionId} onChange={e => setForm({ ...form, transactionId: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Date</label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="gradient-primary text-primary-foreground border-0" onClick={handleSave}>{editing ? "Update" : "Record"}</Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transaction</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Method</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(payment => (
              <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-mono font-medium">{payment.transactionId}</p>
                  <p className="text-xs text-muted-foreground">{payment.invoiceNumber}</p>
                </td>
                <td className="px-4 py-3"><span className="text-sm">{payment.clientName}</span></td>
                <td className="px-4 py-3"><span className="text-sm font-bold">${payment.amount.toLocaleString()}</span></td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5 capitalize">{methodIcons[payment.method]} {payment.method.replace("_", " ")}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge label={payment.status} variant={getInvoiceStatusVariant(payment.status)} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(payment)} className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(payment.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No payments found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
