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
    const defaultDoctorFields = userDetails.role === 'doctor' ? {
        bio: "",
        education: "",
        clinicAddress: "",
        about: "",
        availability: [
            { day: "Mon", slots: ["09:00 AM", "02:00 PM"] },
            { day: "Wed", slots: ["09:00 AM", "02:00 PM"] },
            { day: "Fri", slots: ["09:00 AM", "02:00 PM"] },
        ],
        profilePic: "",
        bannerImage: ""
    } : {};

    user.set({
        email,
        name: userDetails.name || email.split('@')[0],
        ...defaultDoctorFields,
        ...userDetails
    });
}

export function logout() {
    user.set(null);
}
