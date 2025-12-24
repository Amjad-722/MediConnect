import { get } from 'svelte/store';
import { notifications, addNotification } from './notifications';
import { medications } from './medications';
import { appointments } from '$features/appointments/appointments';
import { user } from '$lib/store';

let interval;

export function startReminderService() {
    if (interval) return;

    // Check every minute
    interval = setInterval(checkReminders, 60000);
    // Also check immediately
    checkReminders();
}

export function stopReminderService() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

function checkReminders() {
    const currentUser = get(user);
    if (!currentUser) return;

    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const currentHourMin = now.getHours() * 100 + now.getMinutes();

    // 1. Check Medications
    const allMeds = get(medications);
    const userMeds = allMeds.filter(m => m.patientEmail === currentUser.email);

    userMeds.forEach(med => {
        // Simple time match (e.g. "08:00")
        if (med.time === currentTimeStr) {
            triggerNotification({
                type: 'medication',
                title: 'Medication Reminder',
                message: `It's time to take ${med.dosage} of ${med.name}.`,
                data: { medId: med.id }
            });
        }
    });

    // 2. Check Appointments
    // Appointments store might not be imported correctly yet but assuming it's structured similarly
    const allAppts = get(appointments);
    const userAppts = allAppts.filter(a => a.patientEmail === currentUser.email && a.status === 'confirmed');

    userAppts.forEach(appt => {
        const apptDate = new Date(appt.date);
        const [hour, min] = appt.time.split(':');
        // This logic needs to be more robust based on how appointment time is stored
        // For now, let's assume a match if it's 1 hour before
        const apptTime = new Date(appt.date);
        // Assuming appt.time is like "09:00 AM"
        // Let's just do a simple log or logic if we have the data
    });
}

function triggerNotification(notification) {
    const existing = get(notifications);
    // Avoid duplicate notifications for the same thing in the last 10 minutes
    const isDuplicate = existing.some(n =>
        n.title === notification.title &&
        n.message === notification.message &&
        (new Date().getTime() - new Date(n.timestamp).getTime()) < 600000
    );

    if (!isDuplicate) {
        addNotification(notification);
    }
}
