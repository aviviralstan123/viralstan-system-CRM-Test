// Mock data for the Viralstan CMS/CRM/Billing platform

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: "active" | "inactive" | "prospect";
  totalSpent: number;
  joinedAt: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  clients: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  value: number;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  status: "draft" | "published" | "archived";
  category: string;
  views: number;
  publishedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  amount: number;
  status: "paid" | "pending" | "overdue";
  issueDate: string;
  dueDate: string;
}

export interface InvoiceItem {
  serviceName: string;
  price: number;
  quantity: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: "credit_card" | "bank_transfer" | "paypal" | "stripe";
  transactionId: string;
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  status: "published" | "pending" | "hidden";
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: "invoice" | "client" | "lead" | "payment" | "blog" | "service";
}

export const clients: Client[] = [
  { id: "1", name: "Alex Thompson", email: "alex@techcorp.com", company: "TechCorp", phone: "+1 555-0101", status: "active", totalSpent: 24500, joinedAt: "2024-01-15" },
  { id: "2", name: "Sarah Chen", email: "sarah@innovate.io", company: "Innovate.io", phone: "+1 555-0102", status: "active", totalSpent: 18200, joinedAt: "2024-02-20" },
  { id: "3", name: "Marcus Rivera", email: "marcus@growthlab.com", company: "GrowthLab", phone: "+1 555-0103", status: "active", totalSpent: 31000, joinedAt: "2023-11-08" },
  { id: "4", name: "Emma Watson", email: "emma@brandwise.co", company: "BrandWise", phone: "+1 555-0104", status: "inactive", totalSpent: 9800, joinedAt: "2024-03-01" },
  { id: "5", name: "James Park", email: "james@startupx.com", company: "StartupX", phone: "+1 555-0105", status: "prospect", totalSpent: 0, joinedAt: "2024-06-15" },
  { id: "6", name: "Olivia Martinez", email: "olivia@nexgen.com", company: "NexGen", phone: "+1 555-0106", status: "active", totalSpent: 42000, joinedAt: "2023-08-22" },
  { id: "7", name: "David Kim", email: "david@cloudpeak.io", company: "CloudPeak", phone: "+1 555-0107", status: "active", totalSpent: 15600, joinedAt: "2024-04-10" },
  { id: "8", name: "Lisa Johnson", email: "lisa@ecomhub.com", company: "EcomHub", phone: "+1 555-0108", status: "prospect", totalSpent: 0, joinedAt: "2024-07-01" },
];

export const services: Service[] = [
  { id: "1", name: "SEO Optimization", description: "Full SEO audit and optimization", price: 2500, category: "SEO", status: "active", clients: 12 },
  { id: "2", name: "Social Media Management", description: "Complete social media strategy and management", price: 3000, category: "Social", status: "active", clients: 18 },
  { id: "3", name: "PPC Campaigns", description: "Google & Meta paid advertising", price: 4500, category: "Advertising", status: "active", clients: 8 },
  { id: "4", name: "Content Marketing", description: "Blog posts, whitepapers, and content strategy", price: 2000, category: "Content", status: "active", clients: 15 },
  { id: "5", name: "Web Development", description: "Custom website design and development", price: 8000, category: "Development", status: "active", clients: 6 },
  { id: "6", name: "Email Marketing", description: "Email campaigns and automation", price: 1500, category: "Email", status: "active", clients: 20 },
  { id: "7", name: "Brand Strategy", description: "Complete brand identity and strategy", price: 5000, category: "Branding", status: "inactive", clients: 3 },
  { id: "8", name: "Video Production", description: "Promotional videos and reels", price: 3500, category: "Content", status: "active", clients: 9 },
];

export const leads: Lead[] = [
  { id: "1", name: "Robert Chen", email: "robert@futuretech.com", company: "FutureTech", source: "Website", status: "new", value: 15000, createdAt: "2024-07-20" },
  { id: "2", name: "Amanda Foster", email: "amanda@greenleaf.co", company: "GreenLeaf", source: "Referral", status: "contacted", value: 8000, createdAt: "2024-07-18" },
  { id: "3", name: "Michael Lee", email: "michael@dataflow.io", company: "DataFlow", source: "LinkedIn", status: "qualified", value: 22000, createdAt: "2024-07-15" },
  { id: "4", name: "Jessica Adams", email: "jessica@urbanstyle.com", company: "UrbanStyle", source: "Google Ads", status: "proposal", value: 12000, createdAt: "2024-07-10" },
  { id: "5", name: "Chris Morgan", email: "chris@skyline.dev", company: "Skyline Dev", source: "Website", status: "won", value: 35000, createdAt: "2024-06-28" },
  { id: "6", name: "Nina Patel", email: "nina@healthplus.com", company: "HealthPlus", source: "Referral", status: "new", value: 18000, createdAt: "2024-07-22" },
  { id: "7", name: "Tom Wilson", email: "tom@mediahub.co", company: "MediaHub", source: "Twitter", status: "lost", value: 6000, createdAt: "2024-07-05" },
];

export const blogs: Blog[] = [
  { id: "1", title: "10 SEO Trends That Will Dominate 2026", excerpt: "Stay ahead with these emerging SEO strategies...", author: "Sarah Chen", status: "published", category: "SEO", views: 2340, publishedAt: "2024-07-15" },
  { id: "2", title: "The Ultimate Guide to Social Media ROI", excerpt: "Learn how to measure and maximize your social ROI...", author: "Alex Thompson", status: "published", category: "Social Media", views: 1890, publishedAt: "2024-07-10" },
  { id: "3", title: "PPC vs Organic: Where to Invest", excerpt: "A comprehensive comparison of paid and organic strategies...", author: "Marcus Rivera", status: "draft", category: "Strategy", views: 0, publishedAt: "" },
  { id: "4", title: "Email Marketing Automation Best Practices", excerpt: "Automate your email campaigns without losing the personal touch...", author: "Emma Watson", status: "published", category: "Email", views: 3120, publishedAt: "2024-07-01" },
  { id: "5", title: "Building Brand Identity in Digital Age", excerpt: "How to create a memorable brand presence online...", author: "Sarah Chen", status: "archived", category: "Branding", views: 890, publishedAt: "2024-05-20" },
];

export const invoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-001", clientId: "1", clientName: "TechCorp", items: [{ serviceName: "SEO Optimization", price: 2500, quantity: 1 }, { serviceName: "Content Marketing", price: 2000, quantity: 2 }], amount: 6500, status: "paid", issueDate: "2024-07-01", dueDate: "2024-07-31" },
  { id: "2", invoiceNumber: "INV-002", clientId: "2", clientName: "Innovate.io", items: [{ serviceName: "Social Media Management", price: 3000, quantity: 1 }], amount: 3000, status: "pending", issueDate: "2024-07-15", dueDate: "2024-08-15" },
  { id: "3", invoiceNumber: "INV-003", clientId: "3", clientName: "GrowthLab", items: [{ serviceName: "PPC Campaigns", price: 4500, quantity: 1 }, { serviceName: "SEO Optimization", price: 2500, quantity: 1 }], amount: 7000, status: "paid", issueDate: "2024-06-20", dueDate: "2024-07-20" },
  { id: "4", invoiceNumber: "INV-004", clientId: "6", clientName: "NexGen", items: [{ serviceName: "Web Development", price: 8000, quantity: 1 }], amount: 8000, status: "overdue", issueDate: "2024-06-01", dueDate: "2024-07-01" },
  { id: "5", invoiceNumber: "INV-005", clientId: "7", clientName: "CloudPeak", items: [{ serviceName: "Email Marketing", price: 1500, quantity: 1 }, { serviceName: "Content Marketing", price: 2000, quantity: 1 }], amount: 3500, status: "pending", issueDate: "2024-07-20", dueDate: "2024-08-20" },
  { id: "6", invoiceNumber: "INV-006", clientId: "2", clientName: "Innovate.io", items: [{ serviceName: "Video Production", price: 3500, quantity: 2 }], amount: 7000, status: "paid", issueDate: "2024-05-15", dueDate: "2024-06-15" },
];

export const payments: Payment[] = [
  { id: "1", invoiceId: "1", invoiceNumber: "INV-001", clientName: "TechCorp", amount: 6500, method: "stripe", transactionId: "txn_1a2b3c4d", status: "completed", date: "2024-07-28" },
  { id: "2", invoiceId: "3", invoiceNumber: "INV-003", clientName: "GrowthLab", amount: 7000, method: "bank_transfer", transactionId: "txn_5e6f7g8h", status: "completed", date: "2024-07-18" },
  { id: "3", invoiceId: "6", invoiceNumber: "INV-006", clientName: "Innovate.io", amount: 7000, method: "credit_card", transactionId: "txn_9i0j1k2l", status: "completed", date: "2024-06-12" },
  { id: "4", invoiceId: "2", invoiceNumber: "INV-002", clientName: "Innovate.io", amount: 3000, method: "paypal", transactionId: "txn_3m4n5o6p", status: "pending", date: "2024-08-10" },
  { id: "5", invoiceId: "4", invoiceNumber: "INV-004", clientName: "NexGen", amount: 8000, method: "stripe", transactionId: "txn_7q8r9s0t", status: "failed", date: "2024-07-05" },
];

export const reviews: Review[] = [
  { id: "1", clientName: "Alex Thompson", rating: 5, comment: "Viralstan transformed our online presence. SEO results exceeded expectations!", service: "SEO Optimization", date: "2024-07-20", status: "published" },
  { id: "2", clientName: "Sarah Chen", rating: 4, comment: "Great social media strategy. Our engagement doubled in 3 months.", service: "Social Media Management", date: "2024-07-15", status: "published" },
  { id: "3", clientName: "Marcus Rivera", rating: 5, comment: "The PPC campaigns delivered incredible ROI. Highly recommend!", service: "PPC Campaigns", date: "2024-07-10", status: "published" },
  { id: "4", clientName: "Olivia Martinez", rating: 5, comment: "Outstanding web development work. Our new site is amazing.", service: "Web Development", date: "2024-07-05", status: "pending" },
  { id: "5", clientName: "David Kim", rating: 3, comment: "Good email marketing setup but could improve on segmentation.", service: "Email Marketing", date: "2024-06-28", status: "hidden" },
];

export const activityLogs: ActivityLog[] = [
  { id: "1", action: "Invoice INV-001 marked as paid", user: "Admin", timestamp: "2024-07-28T14:30:00", type: "invoice" },
  { id: "2", action: "New client TechCorp added", user: "Admin", timestamp: "2024-07-27T10:15:00", type: "client" },
  { id: "3", action: "Lead Robert Chen created", user: "Sarah", timestamp: "2024-07-26T09:00:00", type: "lead" },
  { id: "4", action: "Payment of $7,000 received from GrowthLab", user: "System", timestamp: "2024-07-25T16:45:00", type: "payment" },
  { id: "5", action: "Blog post published: 10 SEO Trends", user: "Sarah Chen", timestamp: "2024-07-24T11:20:00", type: "blog" },
  { id: "6", action: "Service 'Brand Strategy' deactivated", user: "Admin", timestamp: "2024-07-23T13:10:00", type: "service" },
  { id: "7", action: "Invoice INV-004 marked as overdue", user: "System", timestamp: "2024-07-22T00:00:00", type: "invoice" },
  { id: "8", action: "New lead Nina Patel from referral", user: "System", timestamp: "2024-07-22T08:30:00", type: "lead" },
];

export const dashboardStats = {
  totalRevenue: 141500,
  revenueGrowth: 12.5,
  totalClients: 8,
  clientGrowth: 25,
  activeLeads: 7,
  leadGrowth: 18,
  pendingInvoices: 2,
  overdueInvoices: 1,
  monthlyRevenue: [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 11000 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 22000 },
    { month: "Jun", revenue: 20500 },
    { month: "Jul", revenue: 24500 },
  ],
  leadsBySource: [
    { source: "Website", count: 35 },
    { source: "Referral", count: 28 },
    { source: "LinkedIn", count: 18 },
    { source: "Google Ads", count: 12 },
    { source: "Twitter", count: 7 },
  ],
  revenueByService: [
    { service: "SEO", revenue: 30000 },
    { service: "Social Media", revenue: 54000 },
    { service: "PPC", revenue: 36000 },
    { service: "Content", revenue: 40000 },
    { service: "Web Dev", revenue: 48000 },
    { service: "Email", revenue: 30000 },
  ],
};
