import { DollarSign, Users, Target, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, FileText } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { dashboardStats, activityLogs, invoices } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "hsl(250, 80%, 60%)",
  "hsl(280, 80%, 55%)",
  "hsl(200, 90%, 55%)",
  "hsl(142, 72%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your agency overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${(dashboardStats.totalRevenue / 1000).toFixed(1)}K`}
          change={`+${dashboardStats.revenueGrowth}% from last month`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Clients"
          value={String(dashboardStats.totalClients)}
          change={`+${dashboardStats.clientGrowth}% growth`}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Leads"
          value={String(dashboardStats.activeLeads)}
          change={`+${dashboardStats.leadGrowth}% this month`}
          changeType="positive"
          icon={Target}
        />
        <StatCard
          title="Pending Invoices"
          value={String(dashboardStats.pendingInvoices + dashboardStats.overdueInvoices)}
          change={`${dashboardStats.overdueInvoices} overdue`}
          changeType="negative"
          icon={Receipt}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Revenue Chart */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Revenue Overview</h3>
            <p className="text-xs text-muted-foreground">Monthly revenue trend</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dashboardStats.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(250, 80%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(250, 80%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(220, 10%, 46%)' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(220, 10%, 46%)' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(224, 20%, 11%)',
                  border: '1px solid hsl(224, 20%, 18%)',
                  borderRadius: '8px',
                  color: 'hsl(220, 14%, 96%)',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(250, 80%, 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Service */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Revenue by Service</h3>
            <p className="text-xs text-muted-foreground">Distribution across services</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboardStats.revenueByService} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis dataKey="service" type="category" tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 11 }} width={70} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(224, 20%, 11%)',
                  border: '1px solid hsl(224, 20%, 18%)',
                  borderRadius: '8px',
                  color: 'hsl(220, 14%, 96%)',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(250, 80%, 60%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Recent Activity */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50">
                <div className="mt-0.5 rounded-full bg-accent p-1.5">
                  {log.type === "invoice" && <Receipt className="h-3.5 w-3.5 text-accent-foreground" />}
                  {log.type === "client" && <Users className="h-3.5 w-3.5 text-accent-foreground" />}
                  {log.type === "lead" && <Target className="h-3.5 w-3.5 text-accent-foreground" />}
                  {log.type === "payment" && <DollarSign className="h-3.5 w-3.5 text-accent-foreground" />}
                  {log.type === "blog" && <FileText className="h-3.5 w-3.5 text-accent-foreground" />}
                  {log.type === "service" && <TrendingUp className="h-3.5 w-3.5 text-accent-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{log.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{log.user}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{inv.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${inv.amount.toLocaleString()}</p>
                  <StatusBadge label={inv.status} variant={getInvoiceStatusVariant(inv.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
