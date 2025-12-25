import { writable } from 'svelte/store';
import { supabase } from '../../lib/supabaseClient';

// Check if we're in the browser
const browser = typeof window !== 'undefined';

// Create the appointments store
export const appointments = writable([]);

/**
 * Initialize appointments from Supabase and set up real-time subscription
 */
async function initializeAppointments() {
    if (!browser) return;

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user's role
        const { data: userProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!userProfile) return;

        // Fetch appointments based on role
        let query = supabase
            .from('appointments')
            .select(`
                *,
                doctor:doctor_id(name, email),
                patient:patient_id(name, email)
            `)
            .order('date', { ascending: true });

        if (userProfile.role === 'doctor') {
            query = query.eq('doctor_id', user.id);
        } else {
            query = query.eq('patient_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Format appointments to match existing structure
        const formattedAppointments = data?.map(apt => ({
            id: apt.id,
            doctorId: apt.doctor_id,
            doctorName: apt.doctor?.name || '',
            patientName: apt.patient?.name || '',
            patientEmail: apt.patient?.email || '',
            date: apt.date,
            day: apt.day,
            time: apt.time,
            type: apt.type,
            reason: apt.reason,
            status: apt.status,
            createdAt: apt.created_at,
            notes: apt.notes || ''
        })) || [];

        appointments.set(formattedAppointments);

        // Set up real-time subscription
        const channel = supabase
            .channel('appointments_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                    filter: userProfile.role === 'doctor'
                        ? `doctor_id=eq.${user.id}`
                        : `patient_id=eq.${user.id}`
                },
                () => {
                    // Reload appointments on any change
                    initializeAppointments();
                }
            )
            .subscribe();

    } catch (error) {
        console.error('Error initializing appointments:', error);
    }
}

// Initialize appointments when auth state changes
if (browser) {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            initializeAppointments();
        } else if (event === 'SIGNED_OUT') {
            appointments.set([]);
        }
    });

    // Initialize on load
    initializeAppointments();
}

/**
 * Get the next occurrence of a day (e.g., "Mon" -> next Monday's date)
 */
function getNextDateForDay(dayName) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const targetDay = days.indexOf(dayName);

    if (targetDay === -1) return today.toISOString().split('T')[0];

    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;

    // If the day has passed this week, go to next week
    if (daysToAdd <= 0) {
        daysToAdd += 7;
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);

    return targetDate.toISOString().split('T')[0];
}

/**
 * Create a new appointment
 */
export async function createAppointment(appointmentData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const appointmentDate = appointmentData.date || getNextDateForDay(appointmentData.day);

        const { data, error } = await supabase
            .from('appointments')
            .insert({
                doctor_id: appointmentData.doctorId,
                patient_id: user.id,
                date: appointmentDate,
                day: appointmentData.day,
                time: appointmentData.time,
                type: appointmentData.type || 'In-Person',
                reason: appointmentData.reason || 'General Consultation',
                status: 'Pending',
                notes: appointmentData.notes || ''
            })
            .select(`
                *,
                doctor:doctor_id(name, email),
                patient:patient_id(name, email)
            `)
            .single();

        if (error) throw error;

        // Format and return the new appointment
        const newAppointment = {
            id: data.id,
            doctorId: data.doctor_id,
            doctorName: data.doctor?.name || appointmentData.doctorName,
            patientName: data.patient?.name || '',
            patientEmail: data.patient?.email || '',
            date: data.date,
            day: data.day,
            time: data.time,
            type: data.type,
            reason: data.reason,
            status: data.status,
            createdAt: data.created_at,
            notes: data.notes || ''
        };

        // Update local store
        appointments.update(current => [...current, newAppointment]);

        return newAppointment;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', appointmentId);

        if (error) throw error;

        // Update local store
        appointments.update(current =>
            current.map(apt =>
                apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            )
        );
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
    }
}

/**
 * Update appointment details
 */
export async function updateAppointment(appointmentId, updatedData) {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({
                date: updatedData.date,
                time: updatedData.time,
                day: updatedData.day,
                type: updatedData.type,
                reason: updatedData.reason,
                notes: updatedData.notes
            })
            .eq('id', appointmentId);

        if (error) throw error;

        // Update local store
        appointments.update(current =>
            current.map(apt =>
                apt.id === appointmentId ? { ...apt, ...updatedData } : apt
            )
        );
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
}

/**
 * Cancel an appointment
 */
export function cancelAppointment(appointmentId) {
    return updateAppointmentStatus(appointmentId, 'Cancelled');
}

/**
 * Get appointments for a specific doctor
 */
export async function getAppointmentsByDoctor(doctorId) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                doctor:doctor_id(name, email),
                patient:patient_id(name, email)
            `)
            .eq('doctor_id', doctorId);

        if (error) throw error;

        return data?.map(apt => ({
            id: apt.id,
            doctorId: apt.doctor_id,
            doctorName: apt.doctor?.name || '',
            patientName: apt.patient?.name || '',
            patientEmail: apt.patient?.email || '',
            date: apt.date,
            day: apt.day,
            time: apt.time,
            type: apt.type,
            reason: apt.reason,
            status: apt.status,
            createdAt: apt.created_at,
            notes: apt.notes || ''
        })) || [];
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        return [];
    }
}

/**
 * Get appointments for a specific patient
 */
export async function getAppointmentsByPatient(patientId) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                doctor:doctor_id(name, email),
                patient:patient_id(name, email)
            `)
            .eq('patient_id', patientId);

        if (error) throw error;

        return data?.map(apt => ({
            id: apt.id,
            doctorId: apt.doctor_id,
            doctorName: apt.doctor?.name || '',
            patientName: apt.patient?.name || '',
            patientEmail: apt.patient?.email || '',
            date: apt.date,
            day: apt.day,
            time: apt.time,
            type: apt.type,
            reason: apt.reason,
            status: apt.status,
            createdAt: apt.created_at,
            notes: apt.notes || ''
        })) || [];
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        return [];
    }
}

/**
 * Get appointment statistics for a doctor
 */
export async function getDoctorStats(doctorId) {
    try {
        const { data: apts, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorId);

        if (error) throw error;

        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        return {
            total: apts?.length || 0,
            pending: apts?.filter(apt => apt.status === 'Pending').length || 0,
            confirmed: apts?.filter(apt => apt.status === 'Confirmed').length || 0,
            completed: apts?.filter(apt => apt.status === 'Completed').length || 0,
            cancelled: apts?.filter(apt => apt.status === 'Cancelled').length || 0,
            upcomingThisWeek: apts?.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= now && aptDate <= weekFromNow &&
                    (apt.status === 'Pending' || apt.status === 'Confirmed');
            }).length || 0,
            uniquePatients: new Set(apts?.map(apt => apt.patient_id) || []).size
        };
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        return {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
            upcomingThisWeek: 0,
            uniquePatients: 0
        };
    }
}

/**
 * Get appointment statistics for a patient
 */
export async function getPatientStats(patientId) {
    try {
        const { data: apts, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', patientId);

        if (error) throw error;

        const now = new Date();

        return {
            total: apts?.length || 0,
            upcoming: apts?.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= now && (apt.status === 'Pending' || apt.status === 'Confirmed');
            }).length || 0,
            completed: apts?.filter(apt => apt.status === 'Completed').length || 0,
            cancelled: apts?.filter(apt => apt.status === 'Cancelled').length || 0,
            pending: apts?.filter(apt => apt.status === 'Pending').length || 0
        };
    } catch (error) {
        console.error('Error fetching patient stats:', error);
        return {
            total: 0,
            upcoming: 0,
            completed: 0,
            cancelled: 0,
            pending: 0
        };
    }
}

/**
 * Delete an appointment (for admin purposes)
 */
export async function deleteAppointment(appointmentId) {
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointmentId);

        if (error) throw error;

        // Update local store
        appointments.update(current =>
            current.filter(apt => apt.id !== appointmentId)
        );
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
    }
}
