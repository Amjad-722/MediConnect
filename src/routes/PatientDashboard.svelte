<script>
    import Button from "$ui/Button.svelte";
    import Icon from "$ui/Icon.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$features/routing/router";
    import { onMount } from "svelte";
    import AppointmentDetailsModal from "$features/appointments/AppointmentDetailsModal.svelte";
    import {
        appointments,
        cancelAppointment,
        getPatientStats,
        updateAppointment,
    } from "$features/appointments/appointments";
    import { records } from "$features/medical-records/records";
    import MedicationManager from "$features/reminders/MedicationManager.svelte";
    import ChatInterface from "$features/messaging/ChatInterface.svelte";
    import PrescriptionManager from "$features/prescriptions/PrescriptionManager.svelte";
    import Modal from "$ui/Modal.svelte";

    onMount(() => {
        if (!$user || $user.role !== "patient") {
            navigate("/login", { replace: true });
        }
    });

    let activeTab = "all";
    let selectedAppointment = null;
    let showViewModal = false;

    // Reactive filtered appointments based on patient and active tab
    $: patientAppointments = $appointments.filter(
        (apt) => apt.patientEmail === $user?.email,
    );

    $: patientRecords = $records.filter((r) => r.patientEmail === $user?.email);

    $: filteredAppointments = patientAppointments
        .filter((apt) => {
            switch (activeTab) {
                case "pending":
                    return apt.status === "Pending";
                case "confirmed":
                    return apt.status === "Confirmed";
                case "completed":
                    return apt.status === "Completed";
                case "cancelled":
                    return apt.status === "Cancelled";
                default:
                    return true;
            }
        })
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    // Get statistics
    $: stats = $user
        ? getPatientStats($user.email)
        : {
              total: 0,
              upcoming: 0,
              completed: 0,
              cancelled: 0,
              pending: 0,
          };

    // Next upcoming appointment
    $: nextAppointment = patientAppointments
        .filter(
            (apt) =>
                (apt.status === "Pending" || apt.status === "Confirmed") &&
                new Date(apt.date) >= new Date(),
        )
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )[0];

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

    function viewAppointment(appointment) {
        selectedAppointment = appointment;
        showViewModal = true;
    }

    function closeViewModal() {
        showViewModal = false;
        selectedAppointment = null;
    }

    function handleCancel(id) {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            cancelAppointment(id);
        }
    }

    // Edit Modal State
    let showEditModal = false;
    let editingAppointment = null;
    let editForm = {
        date: "",
        time: "",
        reason: "",
    };

    function openEditModal(apt) {
        editingAppointment = apt;
        editForm = {
            date: apt.date,
            time: apt.time,
            reason: apt.reason,
        };
        showEditModal = true;
    }

    function handleUpdateAppointment() {
        if (!editForm.date || !editForm.time || !editForm.reason) return;

        updateAppointment(editingAppointment.id, {
            date: editForm.date,
            time: editForm.time,
            reason: editForm.reason,
        });

        showEditModal = false;
        editingAppointment = null;
    }

    // Chat State
    let showChat = false;
    let activeChatAppointment = null;

    function openChat(apt) {
        activeChatAppointment = apt;
        showChat = true;
    }

    function closeChat() {
        showChat = false;
        activeChatAppointment = null;
    }
</script>

{#if $user}
    <div class="min-h-screen bg-slate-50 pt-28 sm:pt-36 pb-12">
        <div class="container mx-auto px-4 max-w-6xl">
            <!-- Welcome Header -->
            <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
                <div>
                    <h1 class="text-3xl font-bold text-[#000921]">
                        Patient Dashboard
                    </h1>
                    <p class="text-gray-600">
                        Hello, {$user.name}! Keep track of your health journey.
                    </p>
                </div>
                <div class="flex gap-3">
                    <Button variant="outline" href="/profile">
                        <Icon name="user" size={18} className="mr-2" />
                        Profile
                    </Button>
                    <Button variant="primary" href="/doctors">
                        <Icon name="plus" size={18} className="mr-2" />
                        Book Appointment
                    </Button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <!-- Stats Overview -->
                <div
                    class="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                    <div
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div
                            class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1"
                        >
                            Total
                        </div>
                        <div class="text-3xl font-bold text-[#000921]">
                            {stats.total}
                        </div>
                        <div class="text-xs text-gray-400 mt-2">
                            Appointments
                        </div>
                    </div>
                    <div
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div
                            class="text-primary text-xs font-bold uppercase tracking-wider mb-1"
                        >
                            Upcoming
                        </div>
                        <div class="text-3xl font-bold text-primary">
                            {stats.upcoming}
                        </div>
                        <div class="text-xs text-gray-400 mt-2">Scheduled</div>
                    </div>
                    <div
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div
                            class="text-green-600 text-xs font-bold uppercase tracking-wider mb-1"
                        >
                            Completed
                        </div>
                        <div class="text-3xl font-bold text-green-600">
                            {stats.completed}
                        </div>
                        <div class="text-xs text-gray-400 mt-2">Visits</div>
                    </div>
                    <div
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div
                            class="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-1"
                        >
                            Pending
                        </div>
                        <div class="text-3xl font-bold text-yellow-600">
                            {stats.pending}
                        </div>
                        <div class="text-xs text-gray-400 mt-2">Pending</div>
                    </div>
                </div>

                <!-- Next Appointment Spotlight -->
                <div
                    class="bg-[#000921] rounded-3xl p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden"
                >
                    <div class="relative z-10">
                        <h3
                            class="text-sm font-bold text-secondary uppercase tracking-[0.2em] mb-4"
                        >
                            Next Appointment
                        </h3>
                        {#if nextAppointment}
                            <div class="flex items-center gap-4 mb-4">
                                <div
                                    class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold"
                                >
                                    {nextAppointment.doctorName.charAt(0)}
                                </div>
                                <div>
                                    <h4 class="font-bold text-lg">
                                        {nextAppointment.doctorName}
                                    </h4>
                                    <p class="text-white/60 text-sm">
                                        {nextAppointment.type || "In-Person"}
                                    </p>
                                </div>
                            </div>
                            <div class="space-y-3 mb-6">
                                <div
                                    class="flex items-center gap-3 text-sm text-white/80"
                                >
                                    <Icon
                                        name="calendar"
                                        size={16}
                                        className="text-secondary"
                                    />
                                    {nextAppointment.date}
                                </div>
                                <div
                                    class="flex items-center gap-3 text-sm text-white/80"
                                >
                                    <Icon
                                        name="clock"
                                        size={16}
                                        className="text-secondary"
                                    />
                                    {nextAppointment.time}
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                on:click={() =>
                                    viewAppointment(nextAppointment)}
                            >
                                View Details
                            </Button>
                        {:else}
                            <div class="py-8 text-center">
                                <p class="text-white/60 mb-6 font-medium">
                                    No upcoming appointments scheduled.
                                </p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full"
                                    href="/doctors"
                                >
                                    Book Now
                                </Button>
                            </div>
                        {/if}
                    </div>
                    <!-- Decorative background element -->
                    <div
                        class="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"
                    ></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <!-- Records Summary -->
                <div
                    class="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
                >
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold text-[#000921]">
                            Medical Records
                        </h3>
                        <a
                            href="/profile"
                            on:click={() =>
                                localStorage.setItem(
                                    "profileActiveSection",
                                    "records",
                                )}
                            class="text-xs font-bold text-secondary hover:underline"
                            >View All</a
                        >
                    </div>

                    <div class="space-y-4 flex-1">
                        {#if patientRecords.length === 0}
                            <div
                                class="flex flex-col items-center justify-center py-6 text-gray-400"
                            >
                                <Icon
                                    name="clipboard"
                                    size={32}
                                    className="mb-2 opacity-20"
                                />
                                <p class="text-xs font-medium">
                                    No records yet
                                </p>
                            </div>
                        {:else}
                            {#each patientRecords.slice(0, 3) as record}
                                <button
                                    class="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-blue-100 transition-all text-left group"
                                    on:click={() => {
                                        localStorage.setItem(
                                            "profileActiveSection",
                                            "records",
                                        );
                                        navigate("/profile");
                                    }}
                                >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-secondary transition-colors shadow-sm"
                                    >
                                        <Icon
                                            name={record.type === "Prescription"
                                                ? "activity"
                                                : record.type === "Report"
                                                  ? "clipboard"
                                                  : "heart"}
                                            size={18}
                                        />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p
                                            class="text-sm font-bold text-gray-900 truncate"
                                        >
                                            {record.title}
                                        </p>
                                        <p class="text-[10px] text-gray-500">
                                            {record.date}
                                        </p>
                                    </div>
                                </button>
                            {/each}
                        {/if}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-6"
                        href="/profile"
                        onClick={() =>
                            localStorage.setItem(
                                "profileActiveSection",
                                "records",
                            )}
                    >
                        <Icon name="plus" size={14} className="mr-2" />
                        Add New Record
                    </Button>
                </div>

                <!-- Empty space or other summary could go here, for now let's just use the column -->
                <div
                    class="lg:col-span-2 bg-[#000921]/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-200"
                >
                    <div
                        class="w-16 h-16 rounded-full bg-white flex items-center justify-center text-secondary mb-4 shadow-sm"
                    >
                        <Icon name="shield" size={32} />
                    </div>
                    <h3 class="text-lg font-bold text-[#000921]">
                        Your Health Data is Secure
                    </h3>
                    <p class="text-sm text-gray-500 max-w-sm mt-2">
                        All your records are encrypted and only accessible by
                        you and the doctors you choose to share them with.
                    </p>
                </div>
            </div>

            <!-- Appointments List -->
            <div
                class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
            >
                <div
                    class="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <h2 class="text-xl font-bold text-[#000921]">
                        Recent Activity
                    </h2>

                    <!-- Filter Tabs -->
                    <div class="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-xl">
                        {#each ["all", "pending", "confirmed", "completed", "cancelled", "reminders", "prescriptions"] as tab}
                            <button
                                class="px-4 py-2 rounded-lg text-sm font-bold transition-all {activeTab ===
                                tab
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'}"
                                on:click={() => (activeTab = tab)}
                            >
                                {tab === "all"
                                    ? "All Activity"
                                    : tab.charAt(0).toUpperCase() +
                                      tab.slice(1)}
                            </button>
                        {/each}
                    </div>
                </div>

                {#if activeTab === "reminders"}
                    <div class="p-6 md:p-8">
                        <MedicationManager />
                    </div>
                {:else if activeTab === "prescriptions"}
                    <div class="p-6 md:p-8">
                        <PrescriptionManager mode="viewer" />
                    </div>
                {:else}
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gray-50/50">
                                    <th
                                        class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                        >Doctor</th
                                    >
                                    <th
                                        class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                        >Date & Time</th
                                    >
                                    <th
                                        class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                        >Reason</th
                                    >
                                    <th
                                        class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                        >Status</th
                                    >
                                    <th
                                        class="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"
                                        >Actions</th
                                    >
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {#if filteredAppointments.length === 0}
                                    <tr>
                                        <td
                                            colspan="5"
                                            class="px-8 py-16 text-center"
                                        >
                                            <div
                                                class="flex flex-col items-center justify-center text-gray-400"
                                            >
                                                <div
                                                    class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4"
                                                >
                                                    <Icon
                                                        name="calendar"
                                                        size={32}
                                                    />
                                                </div>
                                                <p
                                                    class="font-bold text-gray-900"
                                                >
                                                    No appointments found
                                                </p>
                                                <p class="text-sm mt-1">
                                                    Book an appointment to see
                                                    your activity here.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                {:else}
                                    {#each filteredAppointments as apt}
                                        <tr
                                            class="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td class="px-8 py-5">
                                                <div
                                                    class="flex items-center gap-3"
                                                >
                                                    <div
                                                        class="w-10 h-10 rounded-full bg-blue-50 text-secondary flex items-center justify-center font-bold"
                                                    >
                                                        {apt.doctorName.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p
                                                            class="font-bold text-gray-900 group-hover:text-primary transition-colors"
                                                        >
                                                            {apt.doctorName}
                                                        </p>
                                                        <p
                                                            class="text-xs text-gray-500 capitalize"
                                                        >
                                                            {apt.type ||
                                                                "Clinic Visit"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-8 py-5 text-sm">
                                                <p
                                                    class="font-medium text-gray-900"
                                                >
                                                    {apt.date}
                                                </p>
                                                <p class="text-gray-500">
                                                    {apt.time}
                                                </p>
                                            </td>
                                            <td
                                                class="px-8 py-5 text-sm text-gray-600 max-w-[200px] truncate"
                                            >
                                                {apt.reason}
                                            </td>
                                            <td class="px-8 py-5">
                                                <span
                                                    class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full {getStatusColor(
                                                        apt.status,
                                                    )}"
                                                >
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td class="px-8 py-5 text-right">
                                                <div
                                                    class="flex items-center justify-end gap-3"
                                                >
                                                    <button
                                                        class="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                                                        on:click={() =>
                                                            viewAppointment(
                                                                apt,
                                                            )}
                                                        title="View Details"
                                                    >
                                                        <Icon
                                                            name="eye"
                                                            size={18}
                                                        />
                                                    </button>
                                                    {#if apt.status === "Pending" || apt.status === "Confirmed"}
                                                        <button
                                                            class="p-2 text-gray-400 hover:text-secondary hover:bg-blue-50 rounded-lg transition-all"
                                                            on:click={() =>
                                                                openEditModal(
                                                                    apt,
                                                                )}
                                                            title="Edit Appointment"
                                                        >
                                                            <Icon
                                                                name="edit"
                                                                size={18}
                                                            />
                                                        </button>
                                                        <button
                                                            class="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                                                            on:click={() =>
                                                                openChat(apt)}
                                                            title="Message Doctor"
                                                        >
                                                            <Icon
                                                                name="message-circle"
                                                                size={18}
                                                            />
                                                        </button>
                                                        <button
                                                            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            on:click={() =>
                                                                handleCancel(
                                                                    apt.id,
                                                                )}
                                                            title="Cancel Appointment"
                                                        >
                                                            <Icon
                                                                name="x-circle"
                                                                size={18}
                                                            />
                                                        </button>
                                                    {/if}
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                {/if}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    {#if showChat && activeChatAppointment}
        <ChatInterface
            appointmentId={activeChatAppointment.id}
            otherPartyName={activeChatAppointment.doctorName}
            onClose={closeChat}
        />
    {/if}
    <!-- Appointment Details Modal -->
    <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showViewModal}
        onClose={closeViewModal}
        onCancel={handleCancel}
    />

    <!-- Appointment Edit Modal (Previously added invalid import tag removed) -->
    <Modal
        isOpen={showEditModal}
        title="Edit Appointment"
        on:close={() => (showEditModal = false)}
    >
        {#if editingAppointment}
            <div class="space-y-6">
                <div>
                    <p class="text-sm text-gray-500 mb-1">Doctor</p>
                    <p class="font-bold text-gray-900">
                        {editingAppointment.doctorName}
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="dashEditDate"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Date</label
                        >
                        <input
                            id="dashEditDate"
                            type="date"
                            bind:value={editForm.date}
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                        />
                    </div>
                    <div>
                        <label
                            for="dashEditTime"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Time</label
                        >
                        <input
                            id="dashEditTime"
                            type="text"
                            bind:value={editForm.time}
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                            placeholder="e.g. 09:00 AM"
                        />
                    </div>
                </div>
                <div>
                    <label
                        for="dashEditReason"
                        class="block text-sm font-bold text-gray-700 mb-2"
                        >Reason for Visit</label
                    >
                    <textarea
                        id="dashEditReason"
                        rows="3"
                        bind:value={editForm.reason}
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium resize-none"
                    ></textarea>
                </div>
                <div
                    class="flex justify-end gap-3 pt-4 border-t border-gray-100"
                >
                    <button
                        class="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                        on:click={() => (showEditModal = false)}
                    >
                        Cancel
                    </button>
                    <Button variant="primary" onClick={handleUpdateAppointment}>
                        Save Changes
                    </Button>
                </div>
            </div>
        {/if}
    </Modal>
{/if}

<style>
    :global(.animate-in) {
        animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
