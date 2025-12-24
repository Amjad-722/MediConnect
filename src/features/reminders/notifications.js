import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';
const storedNotifications = browser ? localStorage.getItem('notifications') : null;
const initialNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

export const notifications = writable(initialNotifications);

if (browser) {
    notifications.subscribe(value => {
        localStorage.setItem('notifications', JSON.stringify(value));
    });
}

export function addNotification(notification) {
    const id = Date.now().toString();
    notifications.update(n => [
        {
            id,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        },
        ...n
    ]);
    return id;
}

export function markAsRead(id) {
    notifications.update(n => n.map(item => item.id === id ? { ...item, read: true } : item));
}

export function markAllAsRead() {
    notifications.update(n => n.map(item => ({ ...item, read: true })));
}

export function removeNotification(id) {
    notifications.update(n => n.filter(item => item.id !== id));
}

export function clearAllNotifications() {
    notifications.set([]);
}
