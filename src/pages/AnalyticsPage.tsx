import { PageHeader } from "@/components/ui/page-header";
import { dashboardStats } from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["hsl(250,80%,60%)", "hsl(280,80%,55%)", "hsl(200,90%,55%)", "hsl(142,72%,42%)", "hsl(38,92%,50%)"];

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Analytics" description="Deep dive into your agency's performance" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardStats.monthlyRevenue}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(250,80%,60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(250,80%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(220,10%,46%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(220,10%,46%)', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(224,20%,11%)', border: '1px solid hsl(224,20%,18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(250,80%,60%)" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dashboardStats.leadsBySource} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={100} label={(e) => e.source}>
                {dashboardStats.leadsBySource.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(224,20%,11%)', border: '1px solid hsl(224,20%,18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Service */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Revenue by Service</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardStats.revenueByService}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="service" tick={{ fill: 'hsl(220,10%,46%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(220,10%,46%)', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(224,20%,11%)', border: '1px solid hsl(224,20%,18%)', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="hsl(250,80%,60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
