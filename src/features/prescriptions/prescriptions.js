import { writable } from 'svelte/store';
import { supabase } from '../../lib/supabaseClient';

export const prescriptions = writable([]);
export const prescriptionsLoading = writable(false);

/**
 * Initialize prescriptions from Supabase
 */
export async function initPrescriptions() {
    prescriptionsLoading.set(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
                *,
                doctor:doctor_id(name),
                patient:patient_id(name, email)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formatted = data?.map(rx => ({
            id: rx.id,
            appointmentId: rx.appointment_id,
            patientId: rx.patient_id,
            patientName: rx.patient?.name || 'Unknown Patient',
            patientEmail: rx.patient?.email || '',
            doctorId: rx.doctor_id,
            doctorName: rx.doctor?.name || 'Unknown Doctor',
            medications: rx.medications || [],
            issuedAt: rx.created_at,
            status: rx.status,
            notes: rx.notes || ''
        })) || [];

        prescriptions.set(formatted);
    } catch (error) {
        console.error('Error initializing prescriptions:', error);
    } finally {
        prescriptionsLoading.set(false);
    }
}

/**
 * Issue a new prescription
 */
export async function issuePrescription(prescriptionData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('prescriptions')
            .insert({
                appointment_id: prescriptionData.appointmentId,
                doctor_id: user.id,
                patient_id: prescriptionData.patientId,
                medications: prescriptionData.medications,
                status: 'Active',
                notes: prescriptionData.notes
            })
            .select(`
                *,
                doctor:doctor_id(name),
                patient:patient_id(name, email)
            `)
            .single();

        if (error) throw error;

        const newRx = {
            id: data.id,
            appointmentId: data.appointment_id,
            patientId: data.patient_id,
            patientName: data.patient?.name || 'Unknown Patient',
            patientEmail: data.patient?.email || '',
            doctorId: data.doctor_id,
            doctorName: data.doctor?.name || 'Unknown Doctor',
            medications: data.medications || [],
            issuedAt: data.created_at,
            status: data.status,
            notes: data.notes || ''
        };

        prescriptions.update(current => [newRx, ...current]);
        return newRx;
    } catch (error) {
        console.error('Error issuing prescription:', error);
        throw error;
    }
}

/**
 * Update prescription status
 */
export async function updatePrescriptionStatus(id, newStatus) {
    try {
        const { error } = await supabase
            .from('prescriptions')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;

        prescriptions.update(current =>
            current.map(rx => rx.id === id ? { ...rx, status: newStatus } : rx)
        );
    } catch (error) {
        console.error('Error updating prescription status:', error);
        throw error;
    }
}

/**
 * Get prescriptions for a specific patient
 */
export function getPrescriptionsByPatient(patientId) {
    let result = [];
    prescriptions.subscribe(rxs => {
        // Filter by patient ID (UUID)
        result = rxs.filter(rx => rx.patientId === patientId);
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

// Initial load
if (typeof window !== 'undefined') {
    initPrescriptions();
}
