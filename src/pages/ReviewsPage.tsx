import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { reviews as initialReviews, Review } from "@/lib/mock-data";
import { Star, CheckCircle, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviewList, setReviewList] = useState<Review[]>(initialReviews);

  const approvedCount = reviewList.filter((r) => r.status === "published").length;
  const pendingCount = reviewList.filter((r) => r.status === "pending").length;

  const handleApprove = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "published" as const } : r))
    );
    toast.success("Review approved");
  };

  const handleHide = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "hidden" as const } : r))
    );
    toast.success("Review hidden");
  };

  const handleDelete = (id: string) => {
    setReviewList((prev) => prev.filter((r) => r.id !== id));
    toast.success("Review deleted");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reviews"
        description="Viralstan Admin · Saturday, 28 March 2026"
      />

      {/* Status badges */}
      <div className="flex gap-3 mb-6">
        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {approvedCount} Approved
        </span>
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          {pendingCount} Pending
        </span>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviewList.map((review) => {
          const isPending = review.status === "pending";
          const borderColor = isPending
            ? "border-amber-300 bg-amber-50/30"
            : review.status === "published"
            ? "border-green-300 bg-green-50/20"
            : "border-border";

          return (
            <div
              key={review.id}
              className={`rounded-xl border-2 ${borderColor} bg-card p-5 flex items-start justify-between gap-4 transition-all`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {review.clientName[0]}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{review.clientName}</span>
                    <span className="text-xs text-muted-foreground">· {review.service}</span>
                  </div>
                  <p className="text-sm text-primary/80 italic">"{review.comment}"</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5">
                  {isPending && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {review.status === "published" && (
                    <button
                      onClick={() => handleHide(review.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {reviewList.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
}
