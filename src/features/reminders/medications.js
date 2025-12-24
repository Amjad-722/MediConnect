import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';
const storedMedications = browser ? localStorage.getItem('medications') : null;
const initialMedications = storedMedications ? JSON.parse(storedMedications) : [];

export const medications = writable(initialMedications);

if (browser) {
    medications.subscribe(value => {
        localStorage.setItem('medications', JSON.stringify(value));
    });
}

export function addMedication(medication) {
    const id = Date.now().toString();
    medications.update(m => [
        {
            id,
            ...medication
        },
        ...m
    ]);
    return id;
}

export function updateMedication(id, updates) {
    medications.update(m => m.map(item => item.id === id ? { ...item, ...updates } : item));
}

export function deleteMedication(id) {
    medications.update(m => m.filter(item => item.id !== id));
}

export function getMedicationsByPatient(email) {
    // This is a helper, but since we are using a store, it's better to filter in the component
    // or provide a derived store.
    return medications.update(m => m.filter(item => item.patientEmail === email));
}
