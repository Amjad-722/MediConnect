<script>
    import Button from "$ui/Button.svelte";
    import Icon from "$ui/Icon.svelte";
    import {
        user,
        defaultDoctorFields,
        logout,
        updateUserProfile,
    } from "$lib/store";
    import { navigate } from "$features/routing/router";
    import { onMount, onDestroy } from "svelte";
    import Modal from "$ui/Modal.svelte";
    import {
        appointments as appointmentsStore,
        cancelAppointment,
        updateAppointment,
    } from "$features/appointments/appointments";
    import MedicalRecords from "$features/medical-records/MedicalRecords.svelte";

    let isLoading = false;
    let successMessage = "";
    let errorMessage = "";
    let showProfilePicModal = false;
    let selectedDay = "";
    let activeSection = "details";
    let appointments = [];

    // Subscribe to appointments store
    const unsubscribeAppointments = appointmentsStore.subscribe((value) => {
        appointments = value;
    });

    onDestroy(() => {
        unsubscribeAppointments();
    });

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    function triggerFileInput(elementId) {
        document.getElementById(elementId).click();
    }

    onMount(() => {
        if (!$user) {
            navigate("/login", { replace: true });
        } else if ($user.role === "doctor") {
            // Ensure availability exists
            if (!$user.availability) {
                $user.availability = [...defaultDoctorFields.availability];
            }
            // Normalize availability data: convert string slots to objects
            $user.availability = $user.availability.map((day) => ({
                ...day,
                slots: (day.slots || []).map((slot) =>
                    typeof slot === "string"
                        ? { start: slot, end: "05:00 PM" } // Default end time if it was just a string
                        : slot,
                ),
            }));
        }

        const savedSection = localStorage.getItem("profileActiveSection");
        if (savedSection) {
            activeSection = savedSection;
            localStorage.removeItem("profileActiveSection");
        }
    });

    function handleRoleChange(event) {
        const newRole = event.target.value;
        if (newRole === "doctor" && $user.role !== "doctor") {
            // Initialize doctor fields if switching to doctor for the first time
            $user = {
                ...$user,
                role: "doctor",
                ...Object.fromEntries(
                    Object.entries(defaultDoctorFields).filter(
                        ([key]) =>
                            $user[key] === undefined || $user[key] === "",
                    ),
                ),
            };
            if (!$user.availability || $user.availability.length === 0) {
                $user.availability = [...defaultDoctorFields.availability];
            }
        } else {
            $user.role = newRole;
        }
    }

    async function handleSave() {
        isLoading = true;
        successMessage = "";
        errorMessage = "";

        try {
            const result = await updateUserProfile($user);

            if (result.success) {
                successMessage = "Profile updated successfully!";
                setTimeout(() => {
                    successMessage = "";
                }, 3000);
            } else {
                errorMessage = result.error || "Failed to update profile.";
            }
        } catch (error) {
            errorMessage = "An unexpected error occurred.";
            console.error(error);
        } finally {
            isLoading = false;
        }
    }

    function addSlot(dayIndex) {
        $user.availability[dayIndex].slots = [
            ...$user.availability[dayIndex].slots,
            { start: "09:00 AM", end: "05:00 PM" },
        ];
    }

    function removeSlot(dayIndex, slotIndex) {
        $user.availability[dayIndex].slots = $user.availability[
            dayIndex
        ].slots.filter((_, i) => i !== slotIndex);
    }

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    $: unusedDays = daysOfWeek.filter(
        (day) => !($user.availability || []).find((d) => d.day === day),
    );

    function addDay(day) {
        if (!$user.availability.find((d) => d.day === day)) {
            $user.availability = [
                ...$user.availability,
                { day, slots: [{ start: "09:00 AM", end: "05:00 PM" }] },
            ];
            // Sort days
            $user.availability.sort(
                (a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day),
            );
        }
    }

    function removeDay(dayIndex) {
        $user.availability = $user.availability.filter(
            (_, i) => i !== dayIndex,
        );
    }

    function handleFileSelect(event, field) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                $user[field] = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function handleMapUrlInput(event) {
        let value = event.target.value;
        // Check if it's a full iframe tag
        if (value.includes("<iframe")) {
            const match = value.match(/src="([^"]+)"/);
            if (match && match[1]) {
                $user.clinicMapUrl = match[1];
            }
        } else {
            $user.clinicMapUrl = value;
        }
    }

    // Appointments logic using store subscription
    // Already handled by the subscription above

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
    // Appointment Editing state
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

    async function handleUpdateAppointment() {
        if (!editForm.date || !editForm.time || !editForm.reason) return;

        try {
            await updateAppointment(editingAppointment.id, {
                date: editForm.date,
                time: editForm.time,
                reason: editForm.reason,
            });

            showEditModal = false;
            editingAppointment = null;

            successMessage = "Appointment updated successfully!";
            setTimeout(() => (successMessage = ""), 3000);
        } catch (error) {
            errorMessage = "Failed to update appointment.";
        }
    }
</script>

{#if $user}
    <div class="min-h-screen bg-slate-50 pt-28 sm:pt-36 pb-12">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-[#000921]">My Profile</h1>
                {#if $user.role === "patient"}
                    <Button
                        variant="primary"
                        href="/doctors"
                        className="hidden sm:flex"
                    >
                        Book New Appointment
                    </Button>
                {/if}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- User Profile Card -->
                    <div
                        class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center"
                    >
                        <div class="relative w-24 h-24 mb-4 group">
                            {#if $user.profilePic}
                                <img
                                    src={$user.profilePic}
                                    alt="Profile"
                                    class="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            {:else}
                                <div
                                    class="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-secondary border-4 border-white shadow-lg"
                                >
                                    <Icon name="user" size={32} />
                                </div>
                            {/if}
                            <button
                                class="absolute bottom-0 right-0 p-2 bg-secondary text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                                on:click={() => (showProfilePicModal = true)}
                            >
                                <Icon name="edit" size={12} />
                            </button>
                        </div>
                        <h2 class="font-bold text-lg text-[#000921] mb-1">
                            {$user.name}
                        </h2>
                        <p class="text-sm text-gray-500 capitalize">
                            {$user.role}
                        </p>
                    </div>

                    <!-- Navigation -->
                    <div
                        class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <nav class="space-y-1">
                            <button
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left {activeSection ===
                                'details'
                                    ? 'bg-blue-50 text-secondary font-bold'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
                                on:click={() => (activeSection = "details")}
                            >
                                <Icon name="user" size={18} />
                                Account Details
                            </button>
                            <button
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left {activeSection ===
                                'appointments'
                                    ? 'bg-blue-50 text-secondary font-bold'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
                                on:click={() =>
                                    (activeSection = "appointments")}
                            >
                                <Icon name="calendar" size={18} />
                                My Appointments
                            </button>
                            {#if $user.role === "patient"}
                                <button
                                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left {activeSection ===
                                    'records'
                                        ? 'bg-blue-50 text-secondary font-bold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
                                    on:click={() => (activeSection = "records")}
                                >
                                    <Icon name="clipboard" size={18} />
                                    Medical Records
                                </button>
                            {/if}
                            <button
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left {activeSection ===
                                'password'
                                    ? 'bg-blue-50 text-secondary font-bold'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
                                on:click={() => (activeSection = "password")}
                            >
                                <Icon name="lock" size={18} />
                                Change Password
                            </button>
                            {#if $user.role === "doctor"}
                                <button
                                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left {activeSection ===
                                    'availability'
                                        ? 'bg-blue-50 text-secondary font-bold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
                                    on:click={() =>
                                        (activeSection = "availability")}
                                >
                                    <Icon name="clock" size={18} />
                                    Availability
                                </button>
                            {/if}
                            <button
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium text-left mt-2"
                                on:click={handleLogout}
                            >
                                <Icon name="log-out" size={18} />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Main Content Form -->
                <div
                    class="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-gray-100"
                >
                    {#if activeSection === "details"}
                        <!-- ... (details form) ... -->
                        <form
                            on:submit|preventDefault={handleSave}
                            class="space-y-8 animate-fade-in"
                        >
                            {#if errorMessage}
                                <div
                                    class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200"
                                    role="alert"
                                >
                                    <span class="font-medium">Error!</span>
                                    {errorMessage}
                                </div>
                            {/if}
                            <!-- ... content ... -->
                            <!-- Profile Banner -->
                            {#if $user.role === "doctor"}
                                <div>
                                    <label
                                        for="bannerInput"
                                        class="block text-sm font-bold text-gray-700 mb-3"
                                        >Profile Banner</label
                                    >
                                    <div
                                        class="relative h-40 rounded-2xl overflow-hidden bg-gray-50 group border border-gray-100"
                                    >
                                        {#if $user.bannerImage}
                                            <img
                                                src={$user.bannerImage}
                                                alt="Banner"
                                                class="w-full h-full object-cover"
                                            />
                                        {:else}
                                            <div
                                                class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
                                            >
                                                No banner selected
                                            </div>
                                        {/if}
                                        <div
                                            class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <button
                                                type="button"
                                                class="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg"
                                                on:click={() =>
                                                    triggerFileInput(
                                                        "bannerInput",
                                                    )}
                                            >
                                                Change Banner
                                            </button>
                                        </div>
                                        <input
                                            id="bannerInput"
                                            type="file"
                                            accept="image/*"
                                            class="hidden"
                                            on:change={(e) =>
                                                handleFileSelect(
                                                    e,
                                                    "bannerImage",
                                                )}
                                        />
                                    </div>
                                </div>
                            {/if}

                            <!-- Hidden Profile Input -->
                            <input
                                id="profilePicInput"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                on:change={(e) =>
                                    handleFileSelect(e, "profilePic")}
                            />

                            <!-- Basic Inputs -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        for="name"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Display Name</label
                                    >
                                    <input
                                        id="name"
                                        type="text"
                                        bind:value={$user.name}
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="role"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Account Role</label
                                    >
                                    <select
                                        id="role"
                                        value={$user.role || "patient"}
                                        on:change={handleRoleChange}
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-gray-900"
                                    >
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Doctor Fields (Only if doctor) -->
                            {#if $user.role === "doctor"}
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <label
                                            for="specialty"
                                            class="block text-sm font-bold text-gray-700 mb-2"
                                            >Specialty</label
                                        >
                                        <input
                                            id="specialty"
                                            type="text"
                                            bind:value={$user.specialty}
                                            class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="education"
                                            class="block text-sm font-bold text-gray-700 mb-2"
                                            >Education</label
                                        >
                                        <input
                                            id="education"
                                            type="text"
                                            bind:value={$user.education}
                                            class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label
                                            for="clinic"
                                            class="block text-sm font-bold text-gray-700 mb-2"
                                            >Clinic Address</label
                                        >
                                        <input
                                            id="clinic"
                                            type="text"
                                            bind:value={$user.clinicAddress}
                                            class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                            placeholder="123 Medical Center Dr..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        for="bio"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Short Bio</label
                                    >
                                    <textarea
                                        id="bio"
                                        rows="2"
                                        bind:value={$user.bio}
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium resize-none"
                                        placeholder="A brief summary..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label
                                        for="about"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >About / Services</label
                                    >
                                    <textarea
                                        id="about"
                                        rows="4"
                                        bind:value={$user.about}
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium resize-none"
                                        placeholder="Detailed description..."
                                    ></textarea>
                                </div>

                                <!-- Map Section -->
                                <div
                                    class="p-6 bg-gray-50 rounded-2xl border border-gray-100"
                                >
                                    <label
                                        for="mapUrl"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Clinic Map URL / Embed</label
                                    >
                                    <input
                                        id="mapUrl"
                                        type="text"
                                        value={$user.clinicMapUrl}
                                        on:input={handleMapUrlInput}
                                        class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                                        placeholder="Paste Google Maps iframe tag..."
                                    />
                                    {#if $user.clinicMapUrl}
                                        <div
                                            class="mt-4 h-48 rounded-xl overflow-hidden shadow-sm border border-gray-200"
                                        >
                                            <iframe
                                                title="Clinic Location Preview"
                                                src={$user.clinicMapUrl}
                                                width="100%"
                                                height="100%"
                                                style="border:0;"
                                                allowfullscreen={true}
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                    {/if}
                                </div>
                            {/if}

                            <div
                                class="flex items-center justify-end pt-4 border-t border-gray-100"
                            >
                                {#if successMessage}
                                    <span
                                        class="text-green-600 font-bold mr-4 animate-fade-in"
                                        >{successMessage}</span
                                    >
                                {/if}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    disabled={isLoading}
                                    className="shadow-lg shadow-primary/30"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    {:else if activeSection === "appointments"}
                        <div class="space-y-6 animate-fade-in">
                            <h2 class="text-2xl font-bold text-[#000921]">
                                My Appointments
                            </h2>

                            {#if errorMessage}
                                <div
                                    class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200"
                                    role="alert"
                                >
                                    <span class="font-medium">Error!</span>
                                    {errorMessage}
                                </div>
                            {/if}

                            {#if appointments.length === 0}
                                <div
                                    class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
                                >
                                    <div
                                        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-secondary mb-4"
                                    >
                                        <Icon name="calendar" size={32} />
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900">
                                        No appointments yet
                                    </h3>
                                    <p
                                        class="text-gray-500 max-w-sm mx-auto mt-2"
                                    >
                                        Find a doctor and book your first
                                        appointment to see it here.
                                    </p>
                                    <div class="mt-6">
                                        <Button
                                            variant="primary"
                                            href="/doctors"
                                        >
                                            Find a Doctor
                                        </Button>
                                    </div>
                                </div>
                            {:else}
                                <div class="space-y-4">
                                    {#each appointments as apt}
                                        <div
                                            class="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                                        >
                                            <div
                                                class="flex flex-col md:flex-row md:items-center justify-between gap-6"
                                            >
                                                <div
                                                    class="flex items-start gap-4"
                                                >
                                                    <div
                                                        class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0"
                                                    >
                                                        {apt.doctorName.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3
                                                            class="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors"
                                                        >
                                                            {apt.doctorName}
                                                        </h3>
                                                        <div
                                                            class="flex items-center gap-4 mt-1 text-sm text-gray-500"
                                                        >
                                                            <div
                                                                class="flex items-center gap-1.5"
                                                            >
                                                                <Icon
                                                                    name="calendar"
                                                                    size={14}
                                                                />
                                                                {apt.date}
                                                            </div>
                                                            <div
                                                                class="flex items-center gap-1.5"
                                                            >
                                                                <Icon
                                                                    name="clock"
                                                                    size={14}
                                                                />
                                                                {apt.time}
                                                            </div>
                                                        </div>
                                                        <p
                                                            class="text-sm text-gray-600 mt-2 bg-white px-3 py-1.5 rounded-lg inline-block border border-gray-100"
                                                        >
                                                            Reason: {apt.reason}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    class="flex items-center gap-4 self-end md:self-center"
                                                >
                                                    <span
                                                        class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider {getStatusColor(
                                                            apt.status,
                                                        )}"
                                                    >
                                                        {apt.status}
                                                    </span>
                                                    {#if apt.status === "Pending" || apt.status === "Confirmed"}
                                                        <button
                                                            class="text-secondary hover:text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                                            on:click={() =>
                                                                openEditModal(
                                                                    apt,
                                                                )}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            class="text-red-500 hover:text-red-600 text-sm font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                                            on:click={() => {
                                                                if (
                                                                    confirm(
                                                                        "Cancel this appointment?",
                                                                    )
                                                                ) {
                                                                    cancelAppointment(
                                                                        apt.id,
                                                                    );
                                                                    appointments =
                                                                        getAppointmentsByPatient(
                                                                            $user.email,
                                                                        );
                                                                }
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {:else if activeSection === "password"}
                        <form
                            on:submit|preventDefault={handleSave}
                            class="space-y-8 animate-fade-in"
                        >
                            {#if errorMessage}
                                <div
                                    class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200"
                                    role="alert"
                                >
                                    <span class="font-medium">Error!</span>
                                    {errorMessage}
                                </div>
                            {/if}
                            <h2 class="text-2xl font-bold text-[#000921]">
                                Change Password
                            </h2>

                            <div class="space-y-6">
                                <div>
                                    <label
                                        for="currentPassword"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Current Password</label
                                    >
                                    <input
                                        id="currentPassword"
                                        type="password"
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="newPassword"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >New Password</label
                                    >
                                    <input
                                        id="newPassword"
                                        type="password"
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="confirmPassword"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Confirm New Password</label
                                    >
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div
                                class="flex items-center justify-end pt-4 border-t border-gray-100"
                            >
                                {#if successMessage}
                                    <span
                                        class="text-green-600 font-bold mr-4 animate-fade-in"
                                        >Password updated!</span
                                    >
                                {/if}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    disabled={isLoading}
                                    className="shadow-lg shadow-primary/30"
                                >
                                    {isLoading
                                        ? "Updating..."
                                        : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    {:else if activeSection === "records" && $user.role === "patient"}
                        <MedicalRecords />
                    {/if}

                    <!-- Appointment Edit Modal -->
                    <Modal
                        isOpen={showEditModal}
                        title="Edit Appointment"
                        on:close={() => (showEditModal = false)}
                    >
                        {#if editingAppointment}
                            <div class="space-y-6">
                                <div>
                                    <p class="text-sm text-gray-500 mb-1">
                                        Doctor
                                    </p>
                                    <p class="font-bold text-gray-900">
                                        {editingAppointment.doctorName}
                                    </p>
                                </div>
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label
                                            for="editDate"
                                            class="block text-sm font-bold text-gray-700 mb-2"
                                            >Date</label
                                        >
                                        <input
                                            id="editDate"
                                            type="date"
                                            bind:value={editForm.date}
                                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="editTime"
                                            class="block text-sm font-bold text-gray-700 mb-2"
                                            >Time</label
                                        >
                                        <input
                                            id="editTime"
                                            type="text"
                                            bind:value={editForm.time}
                                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                            placeholder="e.g. 09:00 AM"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        for="editReason"
                                        class="block text-sm font-bold text-gray-700 mb-2"
                                        >Reason for Visit</label
                                    >
                                    <textarea
                                        id="editReason"
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
                                    <Button
                                        variant="primary"
                                        onClick={handleUpdateAppointment}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        {/if}
                    </Modal>

                    {#if activeSection === "availability" && $user.role === "doctor"}
                        <form
                            on:submit|preventDefault={handleSave}
                            class="space-y-8 animate-fade-in"
                        >
                            {#if errorMessage}
                                <div
                                    class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200"
                                    role="alert"
                                >
                                    <span class="font-medium">Error!</span>
                                    {errorMessage}
                                </div>
                            {/if}
                            <div class="flex items-center justify-between">
                                <h2 class="text-2xl font-bold text-[#000921]">
                                    Manage Availability
                                </h2>
                                <div class="relative">
                                    <select
                                        class="appearance-none pl-4 pr-8 py-2 bg-secondary text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-lg shadow-indigo-200"
                                        bind:value={selectedDay}
                                        on:change={() => {
                                            if (selectedDay) {
                                                addDay(selectedDay);
                                                selectedDay = "";
                                            }
                                        }}
                                    >
                                        <option value="" disabled selected
                                            >+ Add Day</option
                                        >
                                        {#each unusedDays as day}
                                            <option
                                                value={day}
                                                class="text-gray-900"
                                                >{day}</option
                                            >
                                        {/each}
                                    </select>
                                </div>
                            </div>

                            <div class="space-y-4">
                                {#if $user.availability?.length === 0}
                                    <div
                                        class="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
                                    >
                                        <p>No availability added yet.</p>
                                        <p class="text-sm mt-1">
                                            Select a day above to start.
                                        </p>
                                    </div>
                                {/if}

                                {#each $user.availability || [] as day, i}
                                    <div
                                        class="bg-gray-50 rounded-2xl p-6 border border-gray-200 transition-all hover:bg-white hover:shadow-md hover:border-blue-100 group"
                                    >
                                        <div
                                            class="flex items-center justify-between mb-4"
                                        >
                                            <span
                                                class="font-bold text-gray-800 text-lg"
                                                >{day.day}</span
                                            >
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <button
                                                    type="button"
                                                    class="text-xs font-bold text-primary hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                                    on:click={() => addSlot(i)}
                                                >
                                                    + Add Slot
                                                </button>
                                                <button
                                                    type="button"
                                                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    on:click={() =>
                                                        removeDay(i)}
                                                >
                                                    <Icon
                                                        name="trash"
                                                        size={18}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        <div class="space-y-3">
                                            {#each day.slots as slot, slotIndex}
                                                <div
                                                    class="flex items-center gap-3 animate-fade-in"
                                                >
                                                    <div
                                                        class="relative w-full"
                                                    >
                                                        <input
                                                            type="text"
                                                            bind:value={
                                                                slot.start
                                                            }
                                                            class="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-bold text-center focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                    <span
                                                        class="text-gray-400 font-medium"
                                                        >to</span
                                                    >
                                                    <div
                                                        class="relative w-full"
                                                    >
                                                        <input
                                                            type="text"
                                                            bind:value={
                                                                slot.end
                                                            }
                                                            class="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-bold text-center focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        on:click={() =>
                                                            removeSlot(
                                                                i,
                                                                slotIndex,
                                                            )}
                                                    >
                                                        <Icon
                                                            name="x"
                                                            size={16}
                                                        />
                                                    </button>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>

                            <!-- Action Buttons -->
                            <div
                                class="flex items-center justify-end pt-4 border-t border-gray-100"
                            >
                                {#if successMessage}
                                    <span
                                        class="text-green-600 font-bold mr-4 animate-fade-in"
                                        >{successMessage}</span
                                    >
                                {/if}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    disabled={isLoading}
                                    className="shadow-lg shadow-primary/30"
                                >
                                    {isLoading ? "Saving..." : "Save Schedule"}
                                </Button>
                            </div>
                        </form>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Picture Modal -->
    {#if showProfilePicModal}
        <Modal
            isOpen={true}
            title="Edit Photo"
            maxWidth="max-w-sm"
            className="rounded-[2.5rem]"
            on:close={() => (showProfilePicModal = false)}
        >
            <div class="flex flex-col items-center pb-4">
                <!-- Preview -->
                <div class="relative w-32 h-32 mb-8 group">
                    <div
                        class="absolute inset-0 rounded-full bg-blue-100 animate-pulse"
                    ></div>
                    {#if $user.profilePic}
                        <img
                            src={$user.profilePic}
                            alt="Profile Reference"
                            class="relative w-full h-full rounded-full object-cover border-[6px] border-white shadow-xl shadow-blue-900/10"
                        />
                    {:else}
                        <div
                            class="relative w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-secondary border-[6px] border-white shadow-xl shadow-blue-900/10"
                        >
                            <Icon name="user" size={48} />
                        </div>
                    {/if}
                    <!-- Edit Icon Overlay -->
                    <div
                        class="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg border-4 border-white"
                    >
                        <Icon name="edit" size={14} />
                    </div>
                </div>

                <!-- Actions -->
                <div class="w-full space-y-3">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => {
                            triggerFileInput("profilePicInput");
                            showProfilePicModal = false;
                        }}
                    >
                        Upload New Photo
                    </Button>

                    {#if $user.profilePic}
                        <button
                            type="button"
                            class="w-full py-3 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            on:click={() => {
                                $user.profilePic = "";
                                showProfilePicModal = false;
                            }}
                        >
                            <Icon name="trash" size={16} />
                            Remove Photo
                        </button>
                    {/if}
                </div>
            </div>
        </Modal>
    {/if}
{/if}
