<script lang="ts">
    import Button from "$ui/Button.svelte";
    import Icon from "$ui/Icon.svelte";
    import Modal from "$ui/Modal.svelte";
    import MedicalRecords from "$features/medical-records/MedicalRecords.svelte";
    import { user } from "$lib/store";

    interface Appointment {
        id: string;
        patientName: string;
        patientEmail: string;
        date: string;
        time: string;
        type: string;
        reason: string;
        status: string;
        notes?: string;
        createdAt: string;
    }

    export let appointment: Appointment | null = null;
    export let isOpen = false;
    export let onClose: () => void = () => {};
    export let onConfirm: (id: string) => void = () => {};
    export let onComplete: (id: string) => void = () => {};
    export let onCancel: (id: string) => void = () => {};

    let showMedicalRecords = false;

    function getStatusColor(status) {
        switch (status?.toLowerCase()) {
            case "upcoming":
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
</script>

{#if isOpen && !!appointment}
    <Modal
        isOpen={true}
        title="Appointment Details"
        maxWidth="max-w-2xl"
        on:close={onClose}
    >
        {#if appointment}
            <div class="space-y-4">
                <!-- Appointment ID -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Appointment ID</p>
                    <p class="font-mono text-xs text-primary font-semibold">
                        {appointment.id}
                    </p>
                </div>

                <!-- Status -->
                <div>
                    <p class="text-sm text-gray-600 mb-1">Status</p>
                    <span
                        class={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}
                    >
                        {appointment.status}
                    </span>
                </div>

                <!-- Patient Info -->
                <div>
                    <p class="text-sm text-gray-600 mb-1">Patient</p>
                    <p class="font-medium text-gray-900">
                        {appointment.patientName}
                    </p>
                    <p class="text-sm text-gray-500">
                        {appointment.patientEmail}
                    </p>
                </div>

                <!-- Date & Time -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Date</p>
                        <p class="font-medium text-gray-900">
                            {appointment.date}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Time</p>
                        <p class="font-medium text-gray-900">
                            {appointment.time}
                        </p>
                    </div>
                </div>

                <!-- Type -->
                <div>
                    <p class="text-sm text-gray-600 mb-1">Appointment Type</p>
                    <span class="inline-flex items-center gap-2 text-gray-900">
                        <Icon name="user" size={16} /> In-Person Visit
                    </span>
                </div>

                <!-- Reason -->
                <div>
                    <p class="text-sm text-gray-600 mb-1">Reason for Visit</p>
                    <p class="text-gray-900">
                        {appointment.reason}
                    </p>
                </div>

                <!-- Notes -->
                {#if appointment.notes}
                    <div>
                        <p class="text-sm text-gray-600 mb-1">
                            Additional Notes
                        </p>
                        <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {appointment.notes}
                        </p>
                    </div>
                {/if}

                <!-- Created At -->
                <div>
                    <p class="text-sm text-gray-600 mb-1">Booked On</p>
                    <p class="text-gray-900">
                        {new Date(appointment.createdAt).toLocaleString()}
                    </p>
                </div>

                <!-- Medical Records Section for Doctors -->
                {#if $user?.role === "doctor"}
                    <div class="mt-8 pt-6 border-t border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3
                                class="text-lg font-bold text-gray-900 flex items-center gap-2"
                            >
                                <Icon
                                    name="clipboard"
                                    size={20}
                                    className="text-secondary"
                                />
                                Medical History & Notes
                            </h3>
                            <button
                                class="text-sm font-bold text-secondary hover:underline"
                                on:click={() =>
                                    (showMedicalRecords = !showMedicalRecords)}
                            >
                                {showMedicalRecords
                                    ? "Hide Records"
                                    : "View/Add Records"}
                            </button>
                        </div>

                        {#if showMedicalRecords}
                            <div
                                class="bg-slate-50 rounded-2xl p-4 border border-gray-100"
                            >
                                <MedicalRecords
                                    targetEmail={appointment.patientEmail}
                                    showHeader={false}
                                    isDoctorView={true}
                                    forceAddMode={true}
                                />
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Actions -->
            <div
                class="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100"
            >
                {#if appointment.status === "Pending"}
                    <Button
                        variant="primary"
                        onClick={() => {
                            onConfirm(appointment.id);
                            onClose();
                        }}
                    >
                        Confirm Appointment
                    </Button>
                {/if}
                {#if appointment.status === "Confirmed"}
                    <Button
                        variant="primary"
                        onClick={() => {
                            onComplete(appointment.id);
                            onClose();
                        }}
                    >
                        Mark as Completed
                    </Button>
                {/if}
                {#if appointment.status === "Pending" || appointment.status === "Confirmed"}
                    <button
                        class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                        on:click={() => {
                            onCancel(appointment.id);
                            onClose();
                        }}
                    >
                        Cancel Appointment
                    </button>
                {/if}
                <button
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    on:click={onClose}
                >
                    Close
                </button>
            </div>
        {/if}
    </Modal>
{/if}
