import { writable } from 'svelte/store';

// Check if we're in the browser to avoid SSR errors (though this is SPA, good practice)
const browser = typeof window !== 'undefined';

// Get initial user from localStorage if available
const storedUser = browser ? localStorage.getItem('user') : null;
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const user = writable(initialUser);
export const isSignupModalOpen = writable(false);

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

export function login(email, userDetails = {}) {
    const doctorFields = userDetails.role === 'doctor' ? defaultDoctorFields : {};

    user.set({
        email,
        name: userDetails.name || email.split('@')[0],
        ...doctorFields,
        ...userDetails
    });
}

export function logout() {
    user.set(null);
}
