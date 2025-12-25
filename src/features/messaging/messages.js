import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';
const storedMessages = browser ? localStorage.getItem('messages') : null;
const initialMessages = storedMessages ? JSON.parse(storedMessages) : [];

export const messages = writable(initialMessages);

if (browser) {
    messages.subscribe(value => {
        localStorage.setItem('messages', JSON.stringify(value));
    });
}

/**
 * Send a new message
 */
export function sendMessage(appointmentId, senderEmail, text, senderName) {
    const newMessage = {
        id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appointmentId,
        senderEmail,
        senderName,
        text,
        timestamp: new Date().toISOString(),
        read: false
    };

    messages.update(current => [...current, newMessage]);
    return newMessage;
}

/**
 * Get messages for a specific appointment
 */
export function getMessagesByAppointment(appointmentId) {
    let result = [];
    messages.subscribe(msgs => {
        result = msgs.filter(m => m.appointmentId === appointmentId);
    })();
    return result;
}

/**
 * Mark messages as read for an appointment
 */
export function markAsRead(appointmentId, userEmail) {
    messages.update(current =>
        current.map(m =>
            m.appointmentId === appointmentId && m.senderEmail !== userEmail
                ? { ...m, read: true }
                : m
        )
    );
}

/**
 * Get unread message count for a user
 */
export function getUnreadCount(userEmail) {
    let count = 0;
    messages.subscribe(msgs => {
        count = msgs.filter(m => m.senderEmail !== userEmail && !m.read).length;
    })();
    return count;
}
