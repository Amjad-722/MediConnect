import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

// Check if we're in the browser to avoid SSR errors
const browser = typeof window !== 'undefined';

// User store
export const user = writable(null);
export const isSignupModalOpen = writable(false);
export const authLoading = writable(true);

// Internal flag to prevent race conditions during signup
let isSigningUp = false;

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
async function loadUserProfile(userId, email = null) {
    // Create a timeout promise
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile load timeout')), 5000); // 5s timeout
    });

    try {
        // Fetch user profile with timeout race
        const profileLoadPromise = (async () => {
            // Fetch user profile
            const { data: userProfile, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            // Handle missing user record (Self-Healing)
            if (userError && (userError.code === 'PGRST116' || userError.message.includes('JSON object requested, multiple (or no) rows returned'))) {
                console.warn("User profile missing, attempting self-healing...");

                if (!email) {
                    // Try to get email from session if not provided
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) email = user.email;
                }

                if (email) {
                    // Create basic user profile
                    // Default to 'doctor' if we don't know, or maybe 'patient'. 
                    // Since the user said "I made my doctor profile", they expect to be a doctor.
                    // But usually we set 'patient' by default. 
                    // However, we can check if they are trying to access doctor dashboard? No.
                    // Let's safe default to 'patient' BUT check if we can infer anything.
                    // For safety, let's create as 'patient' - they can't be a doctor without the complex doctor profile anyway.
                    // Wait, the user said "I made my doctor profile". 
                    // If I recreate as patient, they might be confused.
                    // BUT, if the row is missing, we lost that data anyway.

                    const { error: insertError } = await supabase.from('users').insert({
                        id: userId,
                        email: email,
                        name: email.split('@')[0],
                        role: 'patient' // Safe default, user can contact support or we can add UI to switch
                    });

                    if (insertError) throw insertError;

                    // Recursive call to load the newly created profile
                    return await loadUserProfile(userId, email);
                }
            }

            if (userError) throw userError;

            // If doctor, fetch doctor profile and availability
            if (userProfile.role === 'doctor') {
                let doctorProfileData = null;
                let availabilityData = [];

                const { data: doctorProfile, error: doctorError } = await supabase
                    .from('doctor_profiles')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                // Self-heal doctor profile if missing
                if (doctorError && (doctorError.code === 'PGRST116' || doctorError.message.includes('JSON object requested, multiple (or no) rows returned'))) {
                    console.warn("Doctor profile missing, attempting self-healing...");

                    const { error: insertDocError } = await supabase.from('doctor_profiles').insert({
                        user_id: userId,
                        specialty: '',
                        bio: defaultDoctorFields.bio,
                        education: defaultDoctorFields.education,
                        clinic_address: defaultDoctorFields.clinicAddress,
                        about: defaultDoctorFields.about,
                        profile_pic: defaultDoctorFields.profilePic,
                        banner_image: defaultDoctorFields.bannerImage,
                        clinic_map_url: defaultDoctorFields.clinicMapUrl
                    });

                    if (insertDocError) throw insertDocError;

                    // Re-fetch
                    const { data: newDocProfile } = await supabase
                        .from('doctor_profiles')
                        .select('*')
                        .eq('user_id', userId)
                        .single();

                    doctorProfileData = newDocProfile;
                } else {
                    doctorProfileData = doctorProfile;
                }

                const { data: availability } = await supabase
                    .from('doctor_availability')
                    .select('*')
                    .eq('doctor_id', userId);

                availabilityData = availability || [];

                // Format availability to match existing structure
                const formattedAvailability = availabilityData.reduce((acc, slot) => {
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

                const userData = {
                    id: userProfile.id,
                    email: userProfile.email,
                    name: userProfile.name,
                    role: userProfile.role,
                    ...doctorProfileData,
                    specialty: doctorProfileData?.specialty,
                    bio: doctorProfileData?.bio || "",
                    education: doctorProfileData?.education || "",
                    clinicAddress: doctorProfileData?.clinic_address || "",
                    about: doctorProfileData?.about || "",
                    profilePic: doctorProfileData?.profile_pic || "",
                    bannerImage: doctorProfileData?.banner_image || "",
                    clinicMapUrl: doctorProfileData?.clinic_map_url || "",
                    availability: formattedAvailability.length > 0 ? formattedAvailability : defaultDoctorFields.availability
                };
                user.set(userData);
                return userData;
            } else {
                const userData = {
                    id: userProfile.id,
                    email: userProfile.email,
                    name: userProfile.name,
                    role: userProfile.role
                };
                user.set(userData);
                return userData;
            }
        })();

        return await Promise.race([profileLoadPromise, timeout]);

    } catch (error) {
        console.error('Error loading user profile:', error);
        return null;
    }
}

/**
 * Listen to auth state changes
 */
if (browser) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            // Only load profile if we are not currently in the middle of a signup process
            // This prevents race conditions where loadUserProfile runs before profile creation
            if (!isSigningUp) {
                await loadUserProfile(session.user.id, session.user.email);
            }
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
    isSigningUp = true;
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

        if (profileError) {
            // Handle duplicate key error (User already exists)
            if (profileError.code === '23505') { // Unique violation
                console.warn("User already exists, checking if upgrade is needed...");

                // Fetch existing user to check role
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                // If existing user is 'patient' and we are trying to sign up as 'doctor'
                if (existingUser && existingUser.role === 'patient' && userDetails.role === 'doctor') {
                    console.log("Upgrading patient to doctor...");

                    // Update role to doctor
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({ role: 'doctor' })
                        .eq('id', authData.user.id);

                    if (updateError) throw updateError;

                    // Proceed to create doctor profile (logic below will handle this)
                } else {
                    // If already a doctor, or just trying to sign up again as patient
                    return { success: false, error: "Account already exists with this email. Please log in." };
                }
            } else {
                throw profileError;
            }
        }

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

        // Manually load the profile now that we are done
        await loadUserProfile(authData.user.id, email);

        return { success: true, user: authData.user };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    } finally {
        isSigningUp = false;
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

        // Load user profile immediately so it's ready when we return
        // Use default profile from auth data if loading fails
        let profile = null;
        try {
            profile = await loadUserProfile(data.user.id, data.user.email);
        } catch (e) {
            console.error("Profile load error caught in login:", e);
        }

        if (!profile) {
            // Fallback: If profile fails to load, try to at least return basic auth info
            // This prevents the UI from hanging. Login.svelte will check result.role.
            // If missing, it will display an error, but at least not hang.
            return { success: false, error: "Profile load failed. Please try again." };
        }

        return { success: true, user: data.user, role: profile.role };
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

