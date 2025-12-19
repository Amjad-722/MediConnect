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
    let appointmentType = "In-Person";
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
        appointmentType = "In-Person";
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

    function convertToMinutes(timeStr) {
        if (!timeStr) return 0;
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        if (hours === "12") hours = "00";
        let h = parseInt(hours, 10);
        if (modifier === "PM") h += 12;
        return h * 60 + parseInt(minutes, 10);
    }

    function formatMinutes(totalMinutes) {
        let hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const modifier = hours >= 12 ? "PM" : "AM";
        let h = hours % 12;
        if (h === 0) h = 12;
        return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${modifier}`;
    }

    function getAvailableSlots(dayStr) {
        const day = doctor.availability.find((d) => d.day === dayStr);
        if (!day) return [];

        let allSlots = [];
        day.slots.forEach((slot) => {
            if (typeof slot === "string") {
                allSlots.push(slot);
            } else if (slot && slot.start && slot.end) {
                let current = convertToMinutes(slot.start);
                const end = convertToMinutes(slot.end);
                while (current <= end) {
                    allSlots.push(formatMinutes(current));
                    current += 30; // 30 min intervals
                }
            }
        });

        return [...new Set(allSlots)].sort(
            (a, b) => convertToMinutes(a) - convertToMinutes(b),
        );
    }
</script>

{#if doctor}
    <div class="min-h-screen bg-white relative overflow-hidden">
        <!-- Background Orbs (Landing Page Style) -->
        <div class="absolute inset-0 z-0 pointer-events-none">
            <div
                class="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"
            ></div>
            <div
                class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -ml-20 -mb-20"
            ></div>
            <div
                class="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]"
            ></div>
        </div>

        <!-- Navigation (Minimal) -->
        <div class="container mx-auto px-6 pt-8 relative z-50 mb-8">
            <button
                class="group flex items-center gap-2 text-gray-400 hover:text-secondary transition-colors"
                on:click={() => navigate("/doctors")}
            >
                <div
                    class="p-2 rounded-full bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-gray-100 shadow-sm transition-all"
                >
                    <Icon name="arrow-left" size={16} />
                </div>
                <span class="font-medium">Back to Doctors</span>
            </button>
        </div>

        <div class="container mx-auto px-6 pb-20 relative z-10">
            <div
                class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.5fr_1fr] gap-12 lg:gap-24 items-start"
            >
                <!-- LEFT COLUMN: Profile Info & Content -->
                <div class="space-y-12 animate-fade-in-up">
                    <!-- Hero Profile Header -->
                    <div class="relative">
                        <div
                            class="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left"
                        >
                            <!-- Profile Pic with Float Animation -->
                            <div class="relative animate-float shrink-0">
                                <div
                                    class="p-2 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10"
                                >
                                    {#if doctor.profilePic}
                                        <img
                                            src={doctor.profilePic}
                                            alt={doctor.name}
                                            class="w-48 h-48 md:w-56 md:h-56 rounded-[2rem] object-cover"
                                        />
                                    {:else}
                                        <div
                                            class="w-48 h-48 md:w-56 md:h-56 bg-blue-50 rounded-[2rem] flex items-center justify-center text-secondary/30"
                                        >
                                            <Icon name="user-md" size={80} />
                                        </div>
                                    {/if}
                                </div>
                                <!-- Badge floating -->
                                <div
                                    class="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg flex items-center gap-2 border border-gray-100"
                                >
                                    <div class="text-amber-400">
                                        <Icon
                                            name="star"
                                            size={20}
                                            fill="currentColor"
                                        />
                                    </div>
                                    <div class="text-left leading-none">
                                        <div class="font-bold text-gray-900">
                                            {ratingStats.rating}
                                        </div>
                                        <div
                                            class="text-[10px] text-gray-400 uppercase tracking-wider font-bold"
                                        >
                                            Rating
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4">
                                <div
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-secondary rounded-full text-sm font-bold mb-4"
                                >
                                    <Icon name="briefcase" size={14} />
                                    {doctor.specialty}
                                </div>
                                <h1
                                    class="text-4xl md:text-6xl font-black text-[#000921] mb-4 leading-[1.1]"
                                >
                                    {doctor.name}
                                </h1>
                                <p
                                    class="text-xl text-gray-500 max-w-lg leading-relaxed mb-6"
                                >
                                    {doctor.experience} years of experience in {doctor.specialty}.
                                    Dedicated to providing top-tier medical
                                    care.
                                </p>
                                <div
                                    class="flex flex-wrap gap-3 justify-center sm:justify-start"
                                >
                                    {#each doctor.languages as lang}
                                        <span
                                            class="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-secondary hover:text-secondary transition-colors cursor-default"
                                        >
                                            {lang}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- About Card -->
                    <div
                        class="group relative p-10 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-secondary/20"
                    >
                        <h2 class="text-2xl font-bold text-[#000921] mb-6">
                            About
                        </h2>
                        <div
                            class="text-lg text-gray-500 leading-relaxed space-y-6"
                        >
                            <p>{doctor.bio}</p>
                            <p>{doctor.about}</p>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div
                        class="group relative p-10 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-secondary/20"
                    >
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-2xl font-bold text-[#000921]">
                                Patient Stories
                            </h2>
                            {#if $user?.role === "patient"}
                                <button
                                    class="text-secondary font-bold hover:underline"
                                    >Write a Review</button
                                >
                            {/if}
                        </div>

                        {#if $user?.role === "patient"}
                            <div
                                class="mb-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50"
                            >
                                <ReviewForm doctorId={doctor.id} />
                            </div>
                        {/if}
                        <ReviewList doctorId={doctor.id} />
                    </div>
                </div>

                <!-- RIGHT COLUMN: Sticky Booking & Info -->
                <div
                    class="space-y-8 lg:sticky lg:top-8 animate-fade-in-up"
                    style="animation-delay: 200ms"
                >
                    <!-- Booking Card -->
                    <div
                        class="relative bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden p-8"
                    >
                        <div
                            class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-secondary to-[#00a8b0]"
                        ></div>

                        <div class="mb-8">
                            <h3 class="text-2xl font-bold text-[#000921] mb-2">
                                Book Appointment
                            </h3>
                            <p class="text-gray-500">
                                Secure your slot with Dr. {doctor.name.split(
                                    " ",
                                )[1]}
                            </p>
                        </div>

                        <div class="space-y-4 mb-8">
                            <div
                                class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                            >
                                <div
                                    class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm"
                                >
                                    <Icon name="map-pin" size={18} />
                                </div>
                                <div class="flex-1">
                                    <div
                                        class="text-xs font-bold text-gray-400 uppercase tracking-widest"
                                    >
                                        Location
                                    </div>
                                    <div class="font-medium text-gray-900">
                                        {doctor.location}
                                    </div>
                                </div>
                            </div>

                            <div
                                class="p-4 rounded-2xl bg-gray-50 border border-gray-100"
                            >
                                <div
                                    class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
                                >
                                    Availability
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each doctor.availability.slice(0, 3) as slot}
                                        <span
                                            class="px-3 py-1 bg-white rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-100"
                                        >
                                            {slot.day.substring(0, 3)}
                                        </span>
                                    {/each}
                                    {#if doctor.availability.length > 3}
                                        <span
                                            class="px-3 py-1 text-xs text-gray-400"
                                            >+ more</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            className="rounded-2xl py-5 text-lg shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-transform"
                            onClick={openBookingModal}
                        >
                            Schedule Visit
                        </Button>
                    </div>

                    <!-- Map Card -->
                    <div
                        class="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/5 border border-gray-100 h-64 relative group"
                    >
                        <div
                            class="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
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
                                    class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400"
                                >
                                    <Icon name="map-pin" size={32} />
                                    <span class="mt-2 text-sm"
                                        >Map Unavailable</span
                                    >
                                </div>
                            {/if}
                        </div>
                        <div
                            class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        >
                            <div
                                class="text-xs font-bold text-gray-400 uppercase"
                            >
                                Clinic Address
                            </div>
                            <div
                                class="text-sm font-medium text-gray-900 truncate"
                            >
                                {doctor.clinicAddress}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Booking Modal (Retaining Logic) -->
    {#if showModal}
        <Modal
            isOpen={true}
            title={bookingSuccess ? "" : "Book Appointment"}
            maxWidth="max-w-2xl"
            on:close={closeBookingModal}
        >
            {#if bookingSuccess}
                <!-- Success State -->
                <div class="text-center py-12">
                    <div
                        class="w-24 h-24 bg-green-100 text-green-500 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce shadow-xl shadow-green-100/50"
                    >
                        ✓
                    </div>
                    <h3 class="text-3xl font-bold text-[#000921] mb-4">
                        All Set!
                    </h3>
                    <p class="text-xl text-gray-500 mb-8 max-w-sm mx-auto">
                        Your appointment with Dr. {doctor.name.split(" ")[1]} is
                        confirmed.
                    </p>

                    {#if bookedAppointment}
                        <div
                            class="bg-gray-50 p-8 rounded-[2rem] text-left space-y-4 max-w-sm mx-auto border border-gray-100"
                        >
                            <div
                                class="flex justify-between items-center pb-4 border-b border-gray-200"
                            >
                                <span class="text-gray-500">Day</span>
                                <span class="font-bold text-gray-900 text-lg"
                                    >{bookedAppointment.date}</span
                                >
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-500">Time</span>
                                <span class="font-bold text-secondary text-lg"
                                    >{bookedAppointment.time}</span
                                >
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <!-- Booking Form -->
                <div class="space-y-8">
                    <!-- Day Selection -->
                    <div>
                        <div
                            class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4"
                        >
                            Select Day
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {#each doctor.availability as slot}
                                <button
                                    class="p-4 rounded-2xl border-2 transition-all duration-200 font-bold text-center {selectedDate ===
                                    slot.day
                                        ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105'
                                        : 'border-gray-100 text-gray-500 hover:border-secondary/30 hover:text-secondary bg-white'}"
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
                        <div class="animate-fade-in-up">
                            <div
                                class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4"
                            >
                                Available Slots
                            </div>
                            <div
                                class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                            >
                                {#each getAvailableSlots(selectedDate) as time}
                                    <button
                                        class="py-3 px-2 rounded-xl border transition-all duration-200 text-sm font-semibold {selectedSlot ===
                                        time
                                            ? 'bg-gradient-to-r from-secondary to-[#00a8b0] text-white border-transparent shadow-lg shadow-blue-500/30 transform scale-105'
                                            : 'border-gray-100 text-gray-600 hover:border-secondary hover:text-secondary bg-white'}"
                                        on:click={() => (selectedSlot = time)}
                                    >
                                        {time}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <div class="space-y-6">
                        <div>
                            <label
                                for="reason"
                                class="block text-sm font-bold text-gray-700 mb-2"
                                >Reason for Visit</label
                            >
                            <input
                                id="reason"
                                type="text"
                                bind:value={reason}
                                placeholder="e.g., Annual Checkup"
                                class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-secondary transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label
                                for="notes"
                                class="block text-sm font-bold text-gray-700 mb-2"
                                >Notes (Optional)</label
                            >
                            <textarea
                                id="notes"
                                bind:value={notes}
                                rows="2"
                                placeholder="Any symptoms or details..."
                                class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-secondary transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div class="pt-4">
                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            className="rounded-2xl py-5 text-xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-transform"
                            disabled={!selectedDate ||
                                !selectedSlot ||
                                !reason.trim()}
                            onClick={confirmBooking}
                        >
                            Confirm Appointment
                        </Button>
                    </div>
                </div>
            {/if}
        </Modal>
    {/if}
{:else}
    <div class="min-h-screen flex items-center justify-center bg-white">
        <div class="text-center">
            <div
                class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 text-gray-300"
            >
                🩺
            </div>
            <h2 class="text-2xl font-bold text-[#000921]">Doctor not found</h2>
            <button
                class="text-secondary font-semibold hover:underline mt-4"
                on:click={() => navigate("/doctors")}>Back to Doctors</button
            >
        </div>
    </div>
{/if}

<style>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }
    :global(.animate-fade-in-up) {
        animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
</style>
