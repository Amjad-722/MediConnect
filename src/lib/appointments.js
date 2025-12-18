import { writable } from 'svelte/store';

// Check if we're in the browser
const browser = typeof window !== 'undefined';

// Get initial appointments from localStorage if available
const storedAppointments = browser ? localStorage.getItem('appointments') : null;
const initialAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];

// Create the appointments store
export const appointments = writable(initialAppointments);

// Subscribe to store changes and update localStorage
if (browser) {
    appointments.subscribe(value => {
        localStorage.setItem('appointments', JSON.stringify(value));
    });
}

/**
 * Generate a unique appointment ID
 */
function generateId() {
    return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
export function createAppointment(appointmentData) {
    const newAppointment = {
        id: generateId(),
        doctorId: appointmentData.doctorId,
        doctorName: appointmentData.doctorName,
        patientName: appointmentData.patientName,
        patientEmail: appointmentData.patientEmail,
        date: appointmentData.date || getNextDateForDay(appointmentData.day),
        day: appointmentData.day,
        time: appointmentData.time,
        type: appointmentData.type || 'In-Person',
        reason: appointmentData.reason || 'General Consultation',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        notes: appointmentData.notes || ''
    };

    appointments.update(current => [...current, newAppointment]);
    return newAppointment;
}

/**
 * Update appointment status
 */
export function updateAppointmentStatus(appointmentId, newStatus) {
    appointments.update(current =>
        current.map(apt =>
            apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
    );
}

/**
 * Cancel an appointment
 */
export function cancelAppointment(appointmentId) {
    updateAppointmentStatus(appointmentId, 'Cancelled');
}

/**
 * Get appointments for a specific doctor
 */
export function getAppointmentsByDoctor(doctorId) {
    let result = [];
    appointments.subscribe(apts => {
        result = apts.filter(apt => apt.doctorId === doctorId);
    })();
    return result;
}

/**
 * Get appointments for a specific patient
 */
export function getAppointmentsByPatient(patientEmail) {
    let result = [];
    appointments.subscribe(apts => {
        result = apts.filter(apt => apt.patientEmail === patientEmail);
    })();
    return result;
}

/**
 * Get appointment statistics for a doctor
 */
export function getDoctorStats(doctorId) {
    let apts = [];
    appointments.subscribe(current => {
        apts = current.filter(apt => apt.doctorId === doctorId);
    })();

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
        total: apts.length,
        pending: apts.filter(apt => apt.status === 'Pending').length,
        confirmed: apts.filter(apt => apt.status === 'Confirmed').length,
        completed: apts.filter(apt => apt.status === 'Completed').length,
        cancelled: apts.filter(apt => apt.status === 'Cancelled').length,
        upcomingThisWeek: apts.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= now && aptDate <= weekFromNow &&
                (apt.status === 'Pending' || apt.status === 'Confirmed');
        }).length,
        uniquePatients: new Set(apts.map(apt => apt.patientEmail)).size
    };
}

/**
 * Delete an appointment (for admin purposes)
 */
export function deleteAppointment(appointmentId) {
    appointments.update(current =>
        current.filter(apt => apt.id !== appointmentId)
    );
}
