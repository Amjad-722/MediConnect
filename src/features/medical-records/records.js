import { writable, get } from 'svelte/store';

// Check if we're in the browser
const browser = typeof window !== 'undefined';

// Initial sample data
const sampleRecords = [
    {
        id: 'rec_1',
        patientEmail: 'patient@example.com',
        type: 'History',
        title: 'Chronic Hypertension',
        date: '2023-10-15',
        doctor: 'Dr. Sarah Smith',
        description: 'Diagnosed with stage 1 hypertension. Prescribed Lisinopril 10mg.',
        attachments: []
    },
    {
        id: 'rec_2',
        patientEmail: 'patient@example.com',
        type: 'Prescription',
        title: 'Amoxicillin 500mg',
        date: '2023-11-20',
        doctor: 'Dr. Michael Chen',
        description: 'Take 3 times daily for 7 days for sinus infection.',
        attachments: []
    },
    {
        id: 'rec_3',
        patientEmail: 'patient@example.com',
        type: 'Report',
        title: 'Annual Blood Work',
        date: '2023-12-05',
        doctor: 'Diagnostic Labs',
        description: 'All values within normal range except vitamin D (mildly low).',
        attachments: []
    }
];

// Load from localStorage or use samples
const storedRecords = browser ? localStorage.getItem('medical_records') : null;
const initialRecords = storedRecords ? JSON.parse(storedRecords) : sampleRecords;

export const records = writable(initialRecords);

// Subscribe to update localStorage
if (browser) {
    records.subscribe(value => {
        localStorage.setItem('medical_records', JSON.stringify(value));
    });
}

// Helper functions
export function addRecord(record) {
    records.update(current => {
        const newRecord = {
            id: 'rec_' + Date.now(),
            attachments: [],
            ...record
        };
        return [newRecord, ...current];
    });
}

export function deleteRecord(id) {
    records.update(current => current.filter(r => r.id !== id));
}

export function getRecordsByPatient(email) {
    return get(records).filter(r => r.patientEmail === email);
}

export function updateRecord(id, updatedData) {
    records.update(current => current.map(r => r.id === id ? { ...r, ...updatedData } : r));
}
