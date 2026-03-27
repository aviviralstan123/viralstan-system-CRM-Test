import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, getInvoiceStatusVariant } from "@/components/ui/status-badge";
import { reviews } from "@/lib/mock-data";
import { Star } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Reviews" description="Client reviews and testimonials" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-card p-5 space-y-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-foreground">{review.clientName[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{review.clientName}</p>
                  <p className="text-xs text-muted-foreground">{review.service}</p>
                </div>
              </div>
              <StatusBadge label={review.status} variant={getInvoiceStatusVariant(review.status)} />
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-border"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{review.comment}"</p>
            <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
