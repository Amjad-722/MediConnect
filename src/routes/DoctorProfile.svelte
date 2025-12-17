<script>
    import { doctors } from "$lib/data.js";
    import Button from "$components/Button.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";

    export let id;

    $: doctor = doctors.find((d) => d.id == id);

    let showModal = false;
    let selectedDate = "";
    let selectedSlot = "";
    let bookingSuccess = false;

    function openBookingModal() {
        if (!$user) {
            navigate("/login");
            return;
        }
        showModal = true;
    }

    function closeBookingModal() {
        showModal = false;
        bookingSuccess = false;
        selectedDate = "";
        selectedSlot = "";
    }

    function confirmBooking() {
        bookingSuccess = true;
        setTimeout(() => {
            closeBookingModal();
        }, 2000);
    }
</script>

{#if doctor}
    <div class="min-h-screen bg-slate-50 py-12">
        <div class="container mx-auto px-4 max-w-5xl">
            <!-- Back Button -->
            <button
                class="mb-6 text-gray-500 hover:text-primary flex items-center gap-2 transition-colors"
                on:click={() => navigate("/doctors")}
            >
                ← Back to Doctors
            </button>

            <!-- Profile Header -->
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
            >
                <div
                    class="h-48 bg-gradient-to-r from-blue-600 to-blue-400"
                ></div>
                <div class="px-8 pb-8">
                    <div
                        class="relative flex justify-between items-end -mt-16 mb-6"
                    >
                        <div class="p-2 bg-white rounded-2xl shadow-lg">
                            <div
                                class="w-32 h-32 bg-blue-50 rounded-xl flex items-center justify-center text-6xl"
                            >
                                👨‍⚕️
                            </div>
                        </div>
                        <div class="mb-4">
                            <Button variant="primary" onClick={openBookingModal}
                                >Book Appointment</Button
                            >
                        </div>
                    </div>

                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">
                            {doctor.name}
                        </h1>
                        <p class="text-xl text-primary font-medium mb-4">
                            {doctor.specialty}
                        </p>
                        <div class="flex flex-wrap gap-6 text-gray-600">
                            <span class="flex items-center gap-2">
                                📍 {doctor.location}
                            </span>
                            <span class="flex items-center gap-2">
                                ⭐ {doctor.rating} ({doctor.reviews} reviews)
                            </span>
                            <span class="flex items-center gap-2">
                                💼 {doctor.experience} Exp.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="md:col-span-2 space-y-8">
                    <div
                        class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <h2 class="text-xl font-bold text-gray-900 mb-4">
                            About
                        </h2>
                        <p class="text-gray-600 leading-relaxed mb-6">
                            {doctor.bio}
                        </p>
                        <p class="text-gray-600 leading-relaxed">
                            {doctor.about}
                        </p>
                    </div>

                    <div
                        class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <h2 class="text-xl font-bold text-gray-900 mb-4">
                            Education & Languages
                        </h2>
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-medium text-gray-900 mb-1">
                                    Education
                                </h3>
                                <p class="text-gray-600">{doctor.education}</p>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-900 mb-1">
                                    Languages
                                </h3>
                                <div class="flex gap-2">
                                    {#each doctor.languages as lang}
                                        <span
                                            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {lang}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-8">
                    <div
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <h3 class="font-bold text-gray-900 mb-4">
                            Clinic Details
                        </h3>
                        <p class="text-gray-600 mb-4">{doctor.clinicAddress}</p>
                        <div
                            class="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400"
                        >
                            Map View
                        </div>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <h3 class="font-bold text-gray-900 mb-4">
                            Availability
                        </h3>
                        <div class="space-y-3">
                            {#each doctor.availability as slot}
                                <div class="flex justify-between items-start">
                                    <span class="font-medium text-gray-700 w-12"
                                        >{slot.day}</span
                                    >
                                    <div
                                        class="flex flex-wrap gap-2 justify-end flex-1"
                                    >
                                        {#each slot.slots as time}
                                            <span
                                                class="px-2 py-1 bg-blue-50 text-primary text-xs rounded"
                                            >
                                                {time}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Booking Modal -->
    {#if showModal}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div
            role="dialog"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            on:click|self={closeBookingModal}
            on:keydown={(e) => e.key === "Escape" && closeBookingModal()}
            tabindex="-1"
            aria-modal="true"
        >
            <div
                class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
                <button
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    on:click={closeBookingModal}
                >
                    ✕
                </button>

                {#if bookingSuccess}
                    <div class="text-center py-8">
                        <div
                            class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                        >
                            ✓
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">
                            Booking Confirmed!
                        </h3>
                        <p class="text-gray-600">
                            Your appointment with {doctor.name} has been booked.
                        </p>
                    </div>
                {:else}
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">
                        Book Appointment
                    </h3>

                    <div class="space-y-6">
                        <div>
                            <span
                                class="block text-sm font-medium text-gray-700 mb-2"
                                >Select Day</span
                            >
                            <div class="flex flex-wrap gap-2">
                                {#each doctor.availability as slot}
                                    <button
                                        class="px-4 py-2 rounded-lg border transition-colors {selectedDate ===
                                        slot.day
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-gray-200 text-gray-700 hover:border-primary'}"
                                        on:click={() => {
                                            selectedDate = slot.day;
                                            selectedSlot = "";
                                        }}
                                    >
                                        {slot.day}
                                    </button>
                                {/each}
                            </div>
                        </div>

                        {#if selectedDate}
                            <div>
                                <span
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    >Select Time</span
                                >
                                <div class="grid grid-cols-3 gap-2">
                                    {#each doctor.availability.find((d) => d.day === selectedDate)?.slots || [] as time}
                                        <button
                                            class="px-2 py-2 rounded-lg border text-sm transition-colors {selectedSlot ===
                                            time
                                                ? 'bg-primary text-white border-primary'
                                                : 'border-gray-200 text-gray-700 hover:border-primary'}"
                                            on:click={() =>
                                                (selectedSlot = time)}
                                        >
                                            {time}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <Button
                            variant="primary"
                            fullWidth
                            disabled={!selectedDate || !selectedSlot}
                            onClick={confirmBooking}
                        >
                            Confirm Booking
                        </Button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
{:else}
    <div class="min-h-screen flex items-center justify-center">
        <p class="text-gray-500">Doctor not found</p>
    </div>
{/if}
