import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Star, CheckCircle, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteReview, getAllReviews, Review, updateReviewStatus } from "@/services/reviewService";

export default function ReviewsList() {
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | number | null>(null);

  useEffect(() => {
    void fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviews = await getAllReviews();
      setReviewList(reviews);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const approvedCount = reviewList.filter((review) => review.status === "approved").length;
  const pendingCount = reviewList.filter((review) => review.status === "pending").length;

  const handleApprove = async (id: string | number) => {
    try {
      setActiveId(id);
      await updateReviewStatus(id, "approved");
      setReviewList((prev) =>
        prev.map((review) => (review.id === id ? { ...review, status: "approved" } : review))
      );
      toast.success("Review approved");
    } catch (error) {
      toast.error("Failed to approve review");
    } finally {
      setActiveId(null);
    }
  };

  const handleHide = async (id: string | number) => {
    try {
      setActiveId(id);
      await updateReviewStatus(id, "rejected");
      setReviewList((prev) =>
        prev.map((review) => (review.id === id ? { ...review, status: "rejected" } : review))
      );
      toast.success("Review hidden");
    } catch (error) {
      toast.error("Failed to hide review");
    } finally {
      setActiveId(null);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setActiveId(id);
      await deleteReview(id);
      setReviewList((prev) => prev.filter((review) => review.id !== id));
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setActiveId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reviews"
        description="Monitor and manage client feedback and testimonials."
      />

      <div className="flex gap-3 mb-6">
        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 shadow-sm">
          {approvedCount} Approved
        </span>
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm">
          {pendingCount} Pending
        </span>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="text-center py-12 text-sm text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed">
            Loading reviews...
          </div>
        )}

        {!loading && reviewList.map((review) => {
          const isPending = review.status === "pending";
          const borderColor = isPending
            ? "border-amber-300 bg-amber-50/30"
            : review.status === "approved"
              ? "border-green-300 bg-green-50/20"
              : "border-border";

          return (
            <div
              key={review.id}
              className={`rounded-xl border-2 ${borderColor} bg-card p-5 flex items-start justify-between gap-4 transition-all shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {(review.client_name || "Client")[0]}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{review.client_name || "Client"}</span>
                    <span className="text-xs text-muted-foreground">| {review.service_title || "Service"}</span>
                  </div>
                  <p className="text-sm text-primary/80 italic">"{review.review_text || "No review text available."}"</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  {isPending && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                      disabled={activeId === review.id}
                      className="h-8 border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                    </Button>
                  )}
                  {review.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHide(review.id)}
                      disabled={activeId === review.id}
                      className="h-8 text-muted-foreground"
                    >
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" /> Hide
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    disabled={activeId === review.id}
                    className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && reviewList.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
}
