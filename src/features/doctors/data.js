import { writable } from 'svelte/store';
import { supabase } from '../../lib/supabaseClient';

// Store for the list of doctors
export const doctorsStore = writable([]);
export const doctorsLoading = writable(false);

/**
 * Initialize doctors data from Supabase
 */
export async function initDoctors() {
    doctorsLoading.set(true);
    try {
        // Fetch doctor profiles with user information
        const { data: profiles, error: profileError } = await supabase
            .from('doctor_profiles')
            .select(`
                *,
                user:user_id(name, email)
            `);

        if (profileError) throw profileError;

        // Fetch all availability records
        const { data: availability, error: availError } = await supabase
            .from('doctor_availability')
            .select('*');

        if (availError) throw availError;

        // Fetch review counts and averages (simplified for now, ideally a view or separate query)
        const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('doctor_id, rating');

        // Group reviews by doctor
        const reviewStats = (reviewsData || []).reduce((acc, rev) => {
            if (!acc[rev.doctor_id]) {
                acc[rev.doctor_id] = { total: 0, count: 0 };
            }
            acc[rev.doctor_id].total += rev.rating;
            acc[rev.doctor_id].count += 1;
            return acc;
        }, {});

        // Combine and format data
        const formattedDoctors = profiles.map(profile => {
            // Filter and format availability for this doctor
            const doctorsAvail = availability.filter(a => a.doctor_id === profile.user_id);
            const formattedAvail = doctorsAvail.reduce((acc, slot) => {
                const existing = acc.find(a => a.day === slot.day);
                if (existing) {
                    existing.slots.push({ start: slot.start_time, end: slot.end_time });
                } else {
                    acc.push({
                        day: slot.day,
                        slots: [{ start: slot.start_time, end: slot.end_time }]
                    });
                }
                return acc;
            }, []);

            const stats = reviewStats[profile.user_id] || { total: 0, count: 0 };
            const avgRating = stats.count > 0 ? (stats.total / stats.count).toFixed(1) : '5.0';

            return {
                id: profile.user_id,
                name: profile.user?.name || 'Unknown Doctor',
                specialty: profile.specialty || 'General Practitioner',
                location: profile.clinic_address || 'Clinic',
                rating: parseFloat(avgRating),
                reviews: stats.count,
                bio: profile.bio || '',
                education: profile.education || '',
                experience: profile.experience || 'Experienced',
                languages: profile.languages || ['English'],
                about: profile.about || '',
                clinicAddress: profile.clinic_address || '',
                availability: formattedAvail,
                profilePic: profile.profile_pic,
                bannerImage: profile.banner_image,
                clinicMapUrl: profile.clinic_map_url
            };
        });

        doctorsStore.set(formattedDoctors);
    } catch (error) {
        console.error('Error loading doctors from Supabase:', error);
    } finally {
        doctorsLoading.set(false);
    }
}

/**
 * Alias for initDoctors to refresh the store
 */
export const refreshDoctors = initDoctors;

/**
 * Get a single doctor by ID
 */
export async function getDoctorById(id) {
    // If it's a UUID, it's a real doctor from DB
    const { data: profile, error } = await supabase
        .from('doctor_profiles')
        .select(`
            *,
            user:user_id(name, email)
        `)
        .eq('user_id', id)
        .single();

    if (error || !profile) return null;

    const { data: availability } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', id);

    // Format availability
    const formattedAvail = (availability || []).reduce((acc, slot) => {
        const existing = acc.find(a => a.day === slot.day);
        if (existing) {
            existing.slots.push({ start: slot.start_time, end: slot.end_time });
        } else {
            acc.push({
                day: slot.day,
                slots: [{ start: slot.start_time, end: slot.end_time }]
            });
        }
        return acc;
    }, []);

    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('doctor_id', id);

    const totalRating = reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
    const count = reviews?.length || 0;
    const avgRating = count > 0 ? (totalRating / count).toFixed(1) : '5.0';

    return {
        id: profile.user_id,
        name: profile.user?.name || 'Unknown Doctor',
        specialty: profile.specialty,
        location: profile.clinic_address,
        rating: parseFloat(avgRating),
        reviews: count,
        bio: profile.bio,
        education: profile.education,
        experience: profile.experience,
        languages: profile.languages || [],
        about: profile.about,
        clinicAddress: profile.clinic_address,
        availability: formattedAvail,
        profilePic: profile.profile_pic,
        bannerImage: profile.banner_image,
        clinicMapUrl: profile.clinic_map_url
    };
}

// Initial load
initDoctors();

// Set up real-time subscription for doctor profiles
if (typeof window !== 'undefined') {
    supabase
        .channel('doctor_profiles_changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'doctor_profiles'
        }, () => {
            console.log('Doctor profiles changed, refreshing store...');
            initDoctors();
        })
        .subscribe();
}
