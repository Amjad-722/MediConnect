import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';
const storedPrescriptions = browser ? localStorage.getItem('prescriptions') : null;
const initialPrescriptions = storedPrescriptions ? JSON.parse(storedPrescriptions) : [];

export const prescriptions = writable(initialPrescriptions);

if (browser) {
    prescriptions.subscribe(value => {
        localStorage.setItem('prescriptions', JSON.stringify(value));
    });
}

/**
 * Issue a new prescription
 */
export function issuePrescription(prescriptionData) {
    const newPrescription = {
        id: `RX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appointmentId: prescriptionData.appointmentId,
        patientEmail: prescriptionData.patientEmail,
        patientName: prescriptionData.patientName,
        doctorId: prescriptionData.doctorId,
        doctorName: prescriptionData.doctorName,
        medications: prescriptionData.medications || [], // array of { name, dosage, instructions }
        issuedAt: new Date().toISOString(),
        status: 'Active', // Active, Ordered, Completed, Expired
        notes: prescriptionData.notes || ''
    };

    prescriptions.update(current => [...current, newPrescription]);
    return newPrescription;
}

/**
 * Update prescription status (e.g., when ordered)
 */
export function updatePrescriptionStatus(id, newStatus) {
    prescriptions.update(current =>
        current.map(rx => rx.id === id ? { ...rx, status: newStatus } : rx)
    );
}

/**
 * Get prescriptions for a specific patient
 */
export function getPrescriptionsByPatient(patientEmail) {
    let result = [];
    prescriptions.subscribe(rxs => {
        result = rxs.filter(rx => rx.patientEmail === patientEmail);
    })();
    return result;
}

/**
 * Get prescriptions for a specific doctor
 */
export function getPrescriptionsByDoctor(doctorId) {
    let result = [];
    prescriptions.subscribe(rxs => {
        result = rxs.filter(rx => rx.doctorId === doctorId);
    })();
    return result;
}
