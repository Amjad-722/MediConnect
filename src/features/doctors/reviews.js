import { writable, derived } from 'svelte/store';

// Check if we're in the browser
const browser = typeof window !== 'undefined';

// Initial data for reviews (mock data to start with)
const mockReviews = [
    {
        id: 'rev1',
        doctorId: 1,
        patientName: 'John Doe',
        rating: 5,
        comment: 'Dr. Sarah is amazing! Very attentive and professional.',
        date: '2023-11-15T10:30:00Z'
    },
    {
        id: 'rev2',
        doctorId: 1,
        patientName: 'Emily Clark',
        rating: 4,
        comment: 'Great experience, though the wait time was a bit long.',
        date: '2023-12-01T14:45:00Z'
    }
];

// Get initial reviews from localStorage or use mock data
const storedReviews = browser ? localStorage.getItem('medi_reviews') : null;
const initialReviews = storedReviews ? JSON.parse(storedReviews) : mockReviews;

// Create the reviews store
export const reviews = writable(initialReviews);

// Subscribe to store changes and update localStorage
if (browser) {
    reviews.subscribe(value => {
        localStorage.setItem('medi_reviews', JSON.stringify(value));
    });
}

/**
 * Add a new review
 */
export function addReview(reviewData) {
    const newReview = {
        id: `REV-${Date.now()}`,
        doctorId: reviewData.doctorId,
        patientName: reviewData.patientName,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString()
    };

    reviews.update(current => [newReview, ...current]);
    return newReview;
}

/**
 * Get reviews for a specific doctor
 */
export function getReviewsByDoctor(doctorId) {
    let result = [];
    reviews.subscribe(allReviews => {
        // Handle both string and number IDs
        result = allReviews.filter(r => String(r.doctorId) === String(doctorId));
    })();
    return result;
}

/**
 * Calculate average rating and review count for a doctor
 */
export function getDoctorRatingStats(doctorId, baseRating = 0, baseCount = 0) {
    const docReviews = getReviewsByDoctor(doctorId);

    if (docReviews.length === 0) {
        return { rating: baseRating || 0, count: baseCount || 0 };
    }

    const sum = docReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / docReviews.length;

    return {
        rating: Number(avg.toFixed(1)),
        count: docReviews.length
    };
}
