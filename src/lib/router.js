import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

export const currentPath = writable(isBrowser ? window.location.pathname : '/');

export const navigate = (path) => {
    if (!isBrowser) return;
    window.history.pushState({}, "", path);
    currentPath.set(path);
    window.scrollTo(0, 0);
};
