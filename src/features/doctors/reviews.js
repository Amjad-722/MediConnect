import { writable } from 'svelte/store';
import { supabase } from '../../lib/supabaseClient';

// Create the reviews store
export const reviews = writable([]);
export const reviewsLoading = writable(false);

/**
 * Initialize reviews from Supabase and set up real-time subscription
 */
export async function initReviews() {
    reviewsLoading.set(true);
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                patient:patient_id(name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedReviews = data?.map(rev => ({
            id: rev.id,
            doctorId: rev.doctor_id,
            patientId: rev.patient_id,
            patientName: rev.patient?.name || 'Anonymous',
            rating: rev.rating,
            comment: rev.comment,
            date: rev.created_at
        })) || [];

        reviews.set(formattedReviews);

        // Set up real-time subscription
        const channel = supabase
            .channel('reviews_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reviews'
                },
                () => {
                    // Reload reviews on any change
                    initReviews();
                }
            )
            .subscribe();

    } catch (error) {
        console.error('Error initializing reviews:', error);
    } finally {
        reviewsLoading.set(false);
    }
}

/**
 * Add a new review
 */
export async function addReview(reviewData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('reviews')
            .insert({
                doctor_id: reviewData.doctorId,
                patient_id: user.id,
                rating: reviewData.rating,
                comment: reviewData.comment
            })
            .select(`
                *,
                patient:patient_id(name)
            `)
            .single();

        if (error) throw error;

        const newReview = {
            id: data.id,
            doctorId: data.doctor_id,
            patientId: data.patient_id,
            patientName: data.patient?.name || 'Anonymous',
            rating: data.rating,
            comment: data.comment,
            date: data.created_at
        };

        reviews.update(current => [newReview, ...current]);
        return newReview;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

/**
 * Get reviews for a specific doctor
 */
export function getReviewsByDoctor(doctorId) {
    let result = [];
    reviews.subscribe(allReviews => {
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

// Initial load
if (typeof window !== 'undefined') {
    initReviews();
}
