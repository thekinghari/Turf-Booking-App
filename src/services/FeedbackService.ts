import { Feedback, Review } from '../types';

class FeedbackService {
  private static instance: FeedbackService;

  private constructor() {}

  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  async submitFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feedback> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      return response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  async submitReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      return response.json();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  async getTurfReviews(turfId: string): Promise<Review[]> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/turfs/${turfId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async getUserFeedback(userId: string): Promise<Feedback[]> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}/feedback`);
      if (!response.ok) throw new Error('Failed to fetch user feedback');
      return response.json();
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error;
    }
  }

  async updateFeedback(
    feedbackId: string,
    updates: Partial<Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Feedback> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update feedback');
      return response.json();
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  }

  async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete feedback');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }

  async uploadFeedbackImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // TODO: Replace with actual API call
      const response = await fetch('/api/feedback/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error uploading feedback image:', error);
      throw error;
    }
  }

  calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }

  calculateCategoryAverages(feedbacks: Feedback[]): {
    facility: number;
    service: number;
    value: number;
    cleanliness: number;
  } {
    if (feedbacks.length === 0) {
      return {
        facility: 0,
        service: 0,
        value: 0,
        cleanliness: 0,
      };
    }

    const totals = feedbacks.reduce(
      (acc, feedback) => ({
        facility: acc.facility + feedback.categories.facility,
        service: acc.service + feedback.categories.service,
        value: acc.value + feedback.categories.value,
        cleanliness: acc.cleanliness + feedback.categories.cleanliness,
      }),
      {
        facility: 0,
        service: 0,
        value: 0,
        cleanliness: 0,
      }
    );

    return {
      facility: totals.facility / feedbacks.length,
      service: totals.service / feedbacks.length,
      value: totals.value / feedbacks.length,
      cleanliness: totals.cleanliness / feedbacks.length,
    };
  }
}

export const feedbackService = FeedbackService.getInstance(); 