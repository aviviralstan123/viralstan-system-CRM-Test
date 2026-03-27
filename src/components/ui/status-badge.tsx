import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  className?: string;
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

export function getInvoiceStatusVariant(status: string): StatusVariant {
  switch (status) {
    case "paid": case "completed": case "active": case "published": case "won": return "success";
    case "pending": case "contacted": case "qualified": case "draft": return "warning";
    case "overdue": case "failed": case "lost": case "inactive": case "hidden": return "danger";
    case "new": case "prospect": case "proposal": return "info";
    default: return "neutral";
  }
}
