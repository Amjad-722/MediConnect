<script>
    import { doctors } from "$lib/data.js";
    import Button from "$components/reusable/Button.svelte";
    import Icon from "$components/reusable/Icon.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { createAppointment } from "$lib/appointments.js";
    import { getDoctorRatingStats } from "$lib/reviews.js";
    import ReviewForm from "$components/doctors/ReviewForm.svelte";
    import ReviewList from "$components/doctors/ReviewList.svelte";
    import Modal from "$components/reusable/Modal.svelte";

    export let id;

    let doctor;
    $: if (id === "me" && $user && $user.role === "doctor") {
        doctor = $user;
    } else {
        doctor = doctors.find((d) => d.id == id);
    }

    let showModal = false;
    let selectedDate = "";
    let selectedSlot = "";
    let appointmentType = "Video";
    let reason = "";
    let notes = "";
    let bookingSuccess = false;
    let bookedAppointment = null;

    $: ratingStats = getDoctorRatingStats(
        doctor?.id,
        doctor?.rating,
        doctor?.reviews,
    );

    function openBookingModal() {
        if (!$user) {
            navigate("/login");
            return;
        }
        if ($user.role === "doctor") {
            alert("Doctors cannot book appointments for themselves");
            return;
        }
        showModal = true;
    }

    function closeBookingModal() {
        showModal = false;
        bookingSuccess = false;
        selectedDate = "";
        selectedSlot = "";
        appointmentType = "Video";
        reason = "";
        notes = "";
        bookedAppointment = null;
    }

    function confirmBooking() {
        if (!selectedDate || !selectedSlot || !reason.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        // Create the appointment
        bookedAppointment = createAppointment({
            doctorId: doctor.id,
            doctorName: doctor.name,
            patientName: $user.name,
            patientEmail: $user.email,
            day: selectedDate,
            time: selectedSlot,
            type: appointmentType,
            reason: reason.trim(),
            notes: notes.trim(),
        });

        bookingSuccess = true;

        // Auto-close after 3 seconds
        setTimeout(() => {
            closeBookingModal();
        }, 3000);
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
                <div class="h-48 bg-gray-100 relative overflow-hidden">
                    {#if doctor.bannerImage}
                        <img
                            src={doctor.bannerImage}
                            alt="Banner"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <div
                            class="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        ></div>
                    {/if}
                </div>
                <div class="px-8 pb-8">
                    <div
                        class="relative flex justify-between items-end -mt-16 mb-6"
                    >
                        <div class="p-2 bg-white rounded-2xl shadow-lg">
                            {#if doctor.profilePic}
                                <img
                                    src={doctor.profilePic}
                                    alt={doctor.name}
                                    class="w-32 h-32 bg-blue-50 rounded-xl object-cover"
                                />
                            {:else}
                                <div
                                    class="w-32 h-32 bg-blue-50 rounded-xl flex items-center justify-center text-primary/40"
                                >
                                    <Icon name="user-md" size={64} />
                                </div>
                            {/if}
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
                                <Icon name="map-pin" size={18} />
                                {doctor.location}
                            </span>
                            <span class="flex items-center gap-2">
                                <Icon
                                    name="star"
                                    size={18}
                                    fill="currentColor"
                                    className="text-amber-500"
                                />
                                {ratingStats.rating} ({ratingStats.count} reviews)
                            </span>
                            <span class="flex items-center gap-2">
                                <Icon name="briefcase" size={18} />
                                {doctor.experience} Exp.
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

                    <!-- Reviews Section -->
                    <div class="space-y-8">
                        <ReviewList doctorId={doctor.id} />

                        {#if $user?.role === "patient"}
                            <ReviewForm doctorId={doctor.id} />
                        {/if}
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
                            class="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-100"
                        >
                            {#if doctor.clinicMapUrl}
                                <iframe
                                    title="Clinic Location"
                                    src={doctor.clinicMapUrl}
                                    width="100%"
                                    height="100%"
                                    style="border:0;"
                                    allowfullscreen={true}
                                    loading="lazy"
                                ></iframe>
                            {:else}
                                <div
                                    class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center"
                                >
                                    <Icon
                                        name="map-pin"
                                        size={32}
                                        className="mb-2 opacity-50"
                                    />
                                    <p class="text-xs">
                                        Location map not available
                                    </p>
                                </div>
                            {/if}
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
        <Modal
            isOpen={true}
            title={bookingSuccess ? "" : "Book Appointment"}
            on:close={closeBookingModal}
        >
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
                    <p class="text-gray-600 mb-4">
                        Your appointment with {doctor.name} has been booked.
                    </p>
                    {#if bookedAppointment}
                        <div
                            class="bg-blue-50 p-4 rounded-lg text-left space-y-2"
                        >
                            <p class="text-sm text-gray-700">
                                <span class="font-semibold"
                                    >Appointment ID:</span
                                >
                                <span class="text-primary font-mono text-xs"
                                    >{bookedAppointment.id}</span
                                >
                            </p>
                            <p class="text-sm text-gray-700">
                                <span class="font-semibold">Date:</span>
                                {bookedAppointment.date}
                            </p>
                            <p class="text-sm text-gray-700">
                                <span class="font-semibold">Time:</span>
                                {bookedAppointment.time}
                            </p>
                            <p class="text-sm text-gray-700">
                                <span class="font-semibold">Type:</span>
                                {bookedAppointment.type}
                            </p>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="space-y-6">
                    <!-- Appointment Type -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Appointment Type <span class="text-red-500">*</span>
                        </label>
                        <div class="flex gap-4">
                            <label class="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    bind:group={appointmentType}
                                    value="Video"
                                    class="mr-2 text-primary focus:ring-primary"
                                />
                                <Icon name="video" size={16} className="mr-1" />
                                <span class="text-gray-700"
                                    >Video Consultation</span
                                >
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    bind:group={appointmentType}
                                    value="In-Person"
                                    class="mr-2 text-primary focus:ring-primary"
                                />
                                <Icon name="user" size={16} className="mr-1" />
                                <span class="text-gray-700"
                                    >In-Person Visit</span
                                >
                            </label>
                        </div>
                    </div>

                    <!-- Select Day -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Select Day <span class="text-red-500">*</span>
                        </label>
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

                    <!-- Select Time -->
                    {#if selectedDate}
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Select Time <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-3 gap-2">
                                {#each doctor.availability.find((d) => d.day === selectedDate)?.slots || [] as time}
                                    <button
                                        class="px-2 py-2 rounded-lg border text-sm transition-colors {selectedSlot ===
                                        time
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-gray-200 text-gray-700 hover:border-primary'}"
                                        on:click={() => (selectedSlot = time)}
                                    >
                                        {time}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Reason for Visit -->
                    <div>
                        <label
                            for="reason"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Reason for Visit <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="reason"
                            type="text"
                            bind:value={reason}
                            placeholder="e.g., General Checkup, Follow-up, Consultation"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <!-- Additional Notes -->
                    <div>
                        <label
                            for="notes"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            bind:value={notes}
                            rows="3"
                            placeholder="Any specific concerns or information you'd like to share..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        ></textarea>
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        disabled={!selectedDate ||
                            !selectedSlot ||
                            !reason.trim()}
                        onClick={confirmBooking}
                    >
                        Confirm Booking
                    </Button>
                </div>
            {/if}
        </Modal>
    {/if}
{:else}
    <div class="min-h-screen flex items-center justify-center">
        <p class="text-gray-500">Doctor not found</p>
    </div>
{/if}
