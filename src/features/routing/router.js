import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

export const currentPath = writable(isBrowser ? window.location.pathname : '/');

export const navigate = (path, { replace = false } = {}) => {
    if (!isBrowser) return;
    if (replace) {
        window.history.replaceState({}, "", path);
    } else {
        window.history.pushState({}, "", path);
    }
    currentPath.set(path);
    window.scrollTo(0, 0);
};
