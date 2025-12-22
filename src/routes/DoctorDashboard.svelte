<script>
    import Button from "$components/reusable/Button.svelte";
    import Icon from "$components/reusable/Icon.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { onMount } from "svelte";
    import Link from "$lib/Link.svelte";
    import AppointmentDetailsModal from "$components/AppointmentDetailsModal.svelte";
    import {
        appointments,
        updateAppointmentStatus,
        getDoctorStats,
    } from "$lib/appointments.js";

    onMount(() => {
        if (!$user || $user.role !== "doctor") {
            navigate("/login", { replace: true });
        }
    });

    let activeTab = "all";
    let selectedAppointment = null;
    let showViewModal = false;

    // Reactive filtered appointments based on doctor and active tab
    $: doctorAppointments = $appointments.filter(
        (apt) => apt.doctorId === $user?.id,
    );

    $: filteredAppointments = doctorAppointments.filter((apt) => {
        switch (activeTab) {
            case "pending":
                return apt.status === "Pending";
            case "confirmed":
                return apt.status === "Confirmed";
            case "upcoming":
                return apt.status === "Pending" || apt.status === "Confirmed";
            case "completed":
                return apt.status === "Completed";
            case "cancelled":
                return apt.status === "Cancelled";
            default:
                return true;
        }
    });

    // Get statistics
    $: stats = $user
        ? getDoctorStats($user.id)
        : {
              total: 0,
              pending: 0,
              confirmed: 0,
              completed: 0,
              cancelled: 0,
              upcomingThisWeek: 0,
              uniquePatients: 0,
          };

    function getStatusColor(status) {
        switch (status.toLowerCase()) {
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

    function viewAppointment(appointment) {
        selectedAppointment = appointment;
        showViewModal = true;
    }

    function closeViewModal() {
        showViewModal = false;
        selectedAppointment = null;
    }

    function confirmAppointment(id) {
        if (confirm("Confirm this appointment?")) {
            updateAppointmentStatus(id, "Confirmed");
        }
    }

    function completeAppointment(id) {
        if (confirm("Mark this appointment as completed?")) {
            updateAppointmentStatus(id, "Completed");
        }
    }

    function cancelAppointment(id) {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            updateAppointmentStatus(id, "Cancelled");
        }
    }
</script>

{#if $user}
    <div class="min-h-screen bg-slate-50 pt-28 sm:pt-36 pb-12">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-gray-600">Welcome back, Dr. {$user.name}</p>
                </div>
                <div class="flex gap-4">
                    <Button variant="outline" href="/profile"
                        >Edit Profile</Button
                    >
                    <Button variant="primary" href="/doctor/me"
                        >View Public Profile</Button
                    >
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Total Patients
                    </div>
                    <div class="text-3xl font-bold text-gray-900">
                        {stats.uniquePatients}
                    </div>
                    <div class="text-gray-600 text-sm mt-2">
                        Unique patients
                    </div>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Total Appointments
                    </div>
                    <div class="text-3xl font-bold text-gray-900">
                        {stats.total}
                    </div>
                    <div class="text-blue-600 text-sm mt-2">
                        {stats.upcomingThisWeek} upcoming this week
                    </div>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Pending
                    </div>
                    <div class="text-3xl font-bold text-gray-900">
                        {stats.pending}
                    </div>
                    <div class="text-yellow-600 text-sm mt-2">
                        Awaiting confirmation
                    </div>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Completed
                    </div>
                    <div class="text-3xl font-bold text-gray-900">
                        {stats.completed}
                    </div>
                    <div class="text-green-600 text-sm mt-2">
                        {stats.confirmed} confirmed
                    </div>
                </div>
            </div>

            <!-- Appointments List -->
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">
                        Appointments
                    </h2>
                    <!-- Filter Tabs -->
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeTab ===
                            'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (activeTab = "all")}
                        >
                            All ({doctorAppointments.length})
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeTab ===
                            'pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (activeTab = "pending")}
                        >
                            Pending ({stats.pending})
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeTab ===
                            'confirmed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (activeTab = "confirmed")}
                        >
                            Confirmed ({stats.confirmed})
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeTab ===
                            'completed'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (activeTab = "completed")}
                        >
                            Completed ({stats.completed})
                        </button>
                        <button
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeTab ===
                            'cancelled'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (activeTab = "cancelled")}
                        >
                            Cancelled ({stats.cancelled})
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Patient</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Date & Time</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Type</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Reason</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Status</th
                                >
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Actions</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#if filteredAppointments.length === 0}
                                <tr>
                                    <td
                                        colspan="6"
                                        class="px-6 py-12 text-center"
                                    >
                                        <div class="text-gray-400">
                                            <Icon
                                                name="calendar"
                                                size={48}
                                                className="mx-auto mb-3 opacity-50"
                                            />
                                            <p class="text-gray-500">
                                                No appointments found
                                            </p>
                                            <p
                                                class="text-sm text-gray-400 mt-1"
                                            >
                                                {activeTab === "all"
                                                    ? "Your appointments will appear here when patients book with you"
                                                    : `No ${activeTab} appointments`}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                {#each filteredAppointments as appointment}
                                    <tr
                                        class="hover:bg-gray-50 transition-colors"
                                    >
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div
                                                    class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3"
                                                >
                                                    {appointment.patientName.charAt(
                                                        0,
                                                    )}
                                                </div>
                                                <div>
                                                    <div
                                                        class="text-sm font-medium text-gray-900"
                                                    >
                                                        {appointment.patientName}
                                                    </div>
                                                    <div
                                                        class="text-xs text-gray-500"
                                                    >
                                                        {appointment.patientEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {appointment.date}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {appointment.time}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span
                                                class="inline-flex items-center gap-1 text-sm text-gray-700"
                                            >
                                                <Icon name="user" size={14} /> In-Person
                                            </span>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            {appointment.reason}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span
                                                class={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                        >
                                            <button
                                                class="text-primary hover:text-primary-dark mr-3"
                                                on:click={() =>
                                                    viewAppointment(
                                                        appointment,
                                                    )}>View</button
                                            >
                                            {#if appointment.status === "Pending"}
                                                <button
                                                    class="text-green-600 hover:text-green-700 mr-3"
                                                    on:click={() =>
                                                        confirmAppointment(
                                                            appointment.id,
                                                        )}>Confirm</button
                                                >
                                            {/if}
                                            {#if appointment.status === "Confirmed"}
                                                <button
                                                    class="text-blue-600 hover:text-blue-700 mr-3"
                                                    on:click={() =>
                                                        completeAppointment(
                                                            appointment.id,
                                                        )}>Complete</button
                                                >
                                            {/if}
                                            {#if appointment.status === "Pending" || appointment.status === "Confirmed"}
                                                <button
                                                    class="text-red-600 hover:text-red-700"
                                                    on:click={() =>
                                                        cancelAppointment(
                                                            appointment.id,
                                                        )}>Cancel</button
                                                >
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Appointment Details Modal Component -->
    <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showViewModal}
        onClose={closeViewModal}
        onConfirm={confirmAppointment}
        onComplete={completeAppointment}
        onCancel={cancelAppointment}
    />
{/if}
