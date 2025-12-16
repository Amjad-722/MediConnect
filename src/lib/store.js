import { writable } from 'svelte/store';

// Check if we're in the browser to avoid SSR errors (though this is SPA, good practice)
const browser = typeof window !== 'undefined';

// Get initial user from localStorage if available
const storedUser = browser ? localStorage.getItem('user') : null;
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const user = writable(initialUser);

// Subscribe to store changes and update localStorage
if (browser) {
    user.subscribe(value => {
        if (value) {
            localStorage.setItem('user', JSON.stringify(value));
        } else {
            localStorage.removeItem('user');
        }
    });
}

export function login(email, userDetails = {}) {
    user.set({
        email,
        name: userDetails.name || email.split('@')[0],
        ...userDetails
    });
}

export function logout() {
    user.set(null);
}
