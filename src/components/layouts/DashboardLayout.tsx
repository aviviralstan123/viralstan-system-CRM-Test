import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Target,
  Star,
  BarChart3,
  Receipt,
  CreditCard,
  Settings,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Menu,
  Package,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Clients", icon: Users, path: "/clients" },
  { label: "Leads", icon: Target, path: "/leads" },
  { label: "Services", icon: Briefcase, path: "/services" },
  { 
    label: "Packages", 
    icon: Package, 
    path: "/packages",
    subItems: [
      { label: "SEO Packages", path: "/packages/seo" },
      { label: "SMO Packages", path: "/packages/smo" },
      { label: "SMM Packages", path: "/packages/sMM" },
      { label: "ORM Packages", path: "/packages/orm" },
      { label: "PPC Packages", path: "/packages/ppc" },
      { label: "PR & Guest Posting", path: "/packages/pr" },
      { label: "CGI Packages", path: "/packages/cgi" },
      { label: "Editing Packages", path: "/packages/editing" },
      { label: "Website Maintenance", path: "/packages/maintenance" },
    ]
  },
  { label: "Industries", icon: Building2, path: "/industries" },
  { label: "Blogs", icon: FileText, path: "/blogs" },
  { label: "Reviews", icon: Star, path: "/reviews" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Invoices", icon: Receipt, path: "/billing/invoices" },
  { label: "Payments", icon: CreditCard, path: "/billing/payments" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    {/* Spiral shapes based on HD logo */}
    <g transform="translate(50,50)">
      <path
        d="M0,-35 A35,35 0 0,1 30,-15"
        fill="none"
        stroke="#F43F5E"
        strokeWidth="10"
        strokeLinecap="round"
        transform="rotate(0)"
      />
      <path
        d="M0,-35 A35,35 0 0,1 30,-15"
        fill="none"
        stroke="#A855F7"
        strokeWidth="10"
        strokeLinecap="round"
        transform="rotate(72)"
      />
      <path
        d="M0,-35 A35,35 0 0,1 30,-15"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="10"
        strokeLinecap="round"
        transform="rotate(144)"
      />
      <path
        d="M0,-35 A35,35 0 0,1 30,-15"
        fill="none"
        stroke="#06B6D4"
        strokeWidth="10"
        strokeLinecap="round"
        transform="rotate(216)"
      />
      <path
        d="M0,-35 A35,35 0 0,1 30,-15"
        fill="none"
        stroke="#F43F5E"
        strokeWidth="10"
        strokeLinecap="round"
        transform="rotate(288)"
      />
      {/* Central part */}
      <circle r="12" fill="url(#logoGradient)" />
    </g>
  </svg>
);

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "/packages": true // Default expand Packages
  });
  const location = useLocation();

  const toggleSubMenu = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 md:relative",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background shadow-lg shadow-primary/10 border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                <LogoIcon />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#F43F5E]">V</span>
                <span className="text-foreground">iral</span>
                <span className="text-[#3B82F6]">s</span>
                <span className="text-foreground">tan</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-background shadow-lg shadow-primary/10 border border-primary/10 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <LogoIcon />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.path];

              return (
                <div key={item.path} className="flex flex-col">
                  {hasSubItems ? (
                    <div
                      onClick={(e) => toggleSubMenu(item.path, e)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 relative group cursor-pointer",
                        isActive || isExpanded
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-colors duration-200", isActive || isExpanded ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 relative group",
                        isActive
                          ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:bg-primary before:rounded-r-full"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-colors duration-200", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )}

                  {/* SubItems Render */}
                  {hasSubItems && isExpanded && !collapsed && (
                    <div className="flex flex-col mt-1 ml-4 border-l border-border pl-2 space-y-1">
                      {item.subItems!.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 relative",
                              isSubActive
                                ? "text-primary font-bold before:absolute before:-left-[9px] before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary"
                                : "text-muted-foreground font-medium hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden border-t border-border p-3 md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search anything..."
                className="w-80 pl-10 bg-muted/40 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300 rounded-2xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-primary/5 transition-colors group">
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#F43F5E] border-2 border-background animate-pulse" />
            </Button>
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              <div className="flex flex-col items-end hidden md:flex">
                <p className="text-sm font-bold text-foreground">Admin User</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Administrator</p>
              </div>
              <div className="h-10 w-10 rounded-xl gradient-primary p-[2px]">
                <div className="h-full w-full rounded-[10px] bg-background flex items-center justify-center">
                  <span className="text-xs font-black gradient-text">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
