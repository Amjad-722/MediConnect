import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

// Check if we're in the browser to avoid SSR errors
const browser = typeof window !== 'undefined';

// User store
export const user = writable(null);
export const isSignupModalOpen = writable(false);
export const authLoading = writable(true);

// Default doctor fields for new doctor accounts
export const defaultDoctorFields = {
    bio: "",
    education: "",
    clinicAddress: "",
    about: "",
    availability: [
        { day: "Mon", slots: [{ start: "09:00 AM", end: "02:00 PM" }] },
        { day: "Wed", slots: [{ start: "09:00 AM", end: "02:00 PM" }] },
        { day: "Fri", slots: [{ start: "09:00 AM", end: "02:00 PM" }] },
    ],
    profilePic: "",
    bannerImage: "",
    clinicMapUrl: ""
};

/**
 * Initialize auth state from Supabase session
 */
async function initializeAuth() {
    if (!browser) return;

    authLoading.set(true);

    try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            await loadUserProfile(session.user.id);
        }
    } catch (error) {
        console.error('Error initializing auth:', error);
    } finally {
        authLoading.set(false);
    }
}

/**
 * Load user profile from database
 */
async function loadUserProfile(userId) {
    try {
        // Fetch user profile
        const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        // If doctor, fetch doctor profile and availability
        if (userProfile.role === 'doctor') {
            const { data: doctorProfile } = await supabase
                .from('doctor_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            const { data: availability } = await supabase
                .from('doctor_availability')
                .select('*')
                .eq('doctor_id', userId);

            // Format availability to match existing structure
            const formattedAvailability = availability?.reduce((acc, slot) => {
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
            }, []) || [];

            user.set({
                id: userProfile.id,
                email: userProfile.email,
                name: userProfile.name,
                role: userProfile.role,
                ...doctorProfile,
                specialty: doctorProfile?.specialty,
                bio: doctorProfile?.bio || "",
                education: doctorProfile?.education || "",
                clinicAddress: doctorProfile?.clinic_address || "",
                about: doctorProfile?.about || "",
                profilePic: doctorProfile?.profile_pic || "",
                bannerImage: doctorProfile?.banner_image || "",
                clinicMapUrl: doctorProfile?.clinic_map_url || "",
                availability: formattedAvailability.length > 0 ? formattedAvailability : defaultDoctorFields.availability
            });
        } else {
            user.set({
                id: userProfile.id,
                email: userProfile.email,
                name: userProfile.name,
                role: userProfile.role
            });
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

/**
 * Listen to auth state changes
 */
if (browser) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
            user.set(null);
        }
    });

    // Initialize auth on load
    initializeAuth();
}

/**
 * Sign up a new user
 */
export async function signup(email, password, userDetails = {}) {
    try {
        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        if (!authData.user) {
            throw new Error('User creation failed');
        }

        // Create user profile
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                name: userDetails.name || email.split('@')[0],
                role: userDetails.role || 'patient'
            });

        if (profileError) throw profileError;

        // If doctor, create doctor profile and availability
        if (userDetails.role === 'doctor') {
            const { error: doctorError } = await supabase
                .from('doctor_profiles')
                .insert({
                    user_id: authData.user.id,
                    specialty: userDetails.specialty || '',
                    bio: defaultDoctorFields.bio,
                    education: defaultDoctorFields.education,
                    clinic_address: defaultDoctorFields.clinicAddress,
                    about: defaultDoctorFields.about,
                    profile_pic: defaultDoctorFields.profilePic,
                    banner_image: defaultDoctorFields.bannerImage,
                    clinic_map_url: defaultDoctorFields.clinicMapUrl
                });

            if (doctorError) throw doctorError;

            // Insert default availability
            const availabilityRecords = defaultDoctorFields.availability.flatMap(avail =>
                avail.slots.map(slot => ({
                    doctor_id: authData.user.id,
                    day: avail.day,
                    start_time: slot.start,
                    end_time: slot.end
                }))
            );

            const { error: availError } = await supabase
                .from('doctor_availability')
                .insert(availabilityRecords);

            if (availError) throw availError;
        }

        return { success: true, user: authData.user };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Login user
 */
export async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // User profile will be loaded by onAuthStateChange listener
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Logout user
 */
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        user.set(null);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates) {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error('Not authenticated');

        // Update users table
        const { error: userError } = await supabase
            .from('users')
            .update({
                name: updates.name
            })
            .eq('id', authUser.id);

        if (userError) throw userError;

        // If doctor, update doctor profile
        if (updates.role === 'doctor') {
            const { error: doctorError } = await supabase
                .from('doctor_profiles')
                .update({
                    specialty: updates.specialty,
                    bio: updates.bio,
                    education: updates.education,
                    clinic_address: updates.clinicAddress,
                    about: updates.about,
                    profile_pic: updates.profilePic,
                    banner_image: updates.bannerImage,
                    clinic_map_url: updates.clinicMapUrl,
                    languages: updates.languages
                })
                .eq('user_id', authUser.id);

            if (doctorError) throw doctorError;

            // Update availability if provided
            if (updates.availability) {
                // Delete existing availability
                await supabase
                    .from('doctor_availability')
                    .delete()
                    .eq('doctor_id', authUser.id);

                // Insert new availability
                const availabilityRecords = updates.availability.flatMap(avail =>
                    avail.slots.map(slot => ({
                        doctor_id: authUser.id,
                        day: avail.day,
                        start_time: slot.start,
                        end_time: slot.end
                    }))
                );

                const { error: availError } = await supabase
                    .from('doctor_availability')
                    .insert(availabilityRecords);

                if (availError) throw availError;
            }
        }

        // Reload user profile
        await loadUserProfile(authUser.id);

        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current user ID
 */
export async function getCurrentUserId() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    return authUser?.id;
}

