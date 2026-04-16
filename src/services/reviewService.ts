import apiClient from './apiClient';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string | number;
  client_name?: string;
  service_title?: string;
  rating: number;
  review_text?: string;
  status: ReviewStatus;
  created_at?: string;
}

export const getAllReviews = async (status?: ReviewStatus) => {
  const response = await apiClient.get('/reviews/admin/all', {
    params: status ? { status } : undefined,
  });

  return response.data.data as Review[];
};

export const updateReviewStatus = async (id: string | number, status: ReviewStatus) => {
  const response = await apiClient.patch(`/reviews/${id}/status`, { status });
  return response.data;
};

export const deleteReview = async (id: string | number) => {
  const response = await apiClient.delete(`/reviews/${id}`);
  return response.data;
};
