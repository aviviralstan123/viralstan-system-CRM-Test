import { useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, Users, Target, Receipt, TrendingUp, Clock, FileText, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { dashboardStats, activityLogs, invoices, clients, leads } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const recentInvoices = invoices.slice(0, 4);
  const recentLeads = leads.filter(l => l.status === "new" || l.status === "contacted").slice(0, 4);
  const recentActivity = activityLogs.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Viralstan Admin · Overview</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${(dashboardStats.totalRevenue / 1000).toFixed(1)}K`}
          change={`+${dashboardStats.revenueGrowth}%`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Active Clients"
          value={String(clients.filter(c => c.status === "active").length)}
          change={`${clients.length} total`}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Open Leads"
          value={String(leads.filter(l => l.status !== "won" && l.status !== "lost").length)}
          change={`$${leads.filter(l => l.status !== "won" && l.status !== "lost").reduce((s, l) => s + l.value, 0).toLocaleString()} pipeline`}
          changeType="positive"
          icon={Target}
        />
        <StatCard
          title="Pending Invoices"
          value={String(invoices.filter(i => i.status !== "paid").length)}
          change={`$${invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.amount, 0).toLocaleString()} outstanding`}
          changeType="negative"
          icon={Receipt}
        />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Revenue Overview</h3>
            <p className="text-xs text-muted-foreground">Monthly revenue trend</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={dashboardStats.monthlyRevenue}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(250, 80%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(250, 80%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(224, 20%, 11%)', border: '1px solid hsl(224, 20%, 18%)', borderRadius: '8px', color: 'hsl(220, 14%, 96%)', fontSize: '12px' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(250, 80%, 60%)" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom: Recent Leads + Recent Invoices + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Leads */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">New Leads</h3>
            <Link to="/leads" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2.5">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.company} · {lead.source}</p>
                </div>
                <span className="text-sm font-semibold text-primary">${lead.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Recent Invoices</h3>
            <Link to="/invoices" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2.5">
            {recentInvoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium font-mono">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{inv.clientName}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-sm font-semibold">${inv.amount.toLocaleString()}</p>
                  <StatusBadge label={inv.status} variant={getInvoiceStatusVariant(inv.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2.5">
            {recentActivity.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <div className="mt-0.5 rounded-full bg-accent p-1.5 shrink-0">
                  {log.type === "invoice" && <Receipt className="h-3 w-3 text-accent-foreground" />}
                  {log.type === "client" && <Users className="h-3 w-3 text-accent-foreground" />}
                  {log.type === "lead" && <Target className="h-3 w-3 text-accent-foreground" />}
                  {log.type === "payment" && <DollarSign className="h-3 w-3 text-accent-foreground" />}
                  {log.type === "blog" && <FileText className="h-3 w-3 text-accent-foreground" />}
                  {log.type === "service" && <TrendingUp className="h-3 w-3 text-accent-foreground" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{log.action}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />{new Date(log.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
