<script>
    import Button from "$components/reusable/Button.svelte";
    import Icon from "$components/reusable/Icon.svelte";
    import { user, defaultDoctorFields } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { onMount } from "svelte";
    import Modal from "$components/reusable/Modal.svelte";

    let isLoading = false;
    let successMessage = "";
    let showProfilePicModal = false;
    let selectedDay = "";

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
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Create a new object reference to ensure Svelte store triggers subscribers
        // and localStorage sync works correctly.
        user.set({ ...$user });

        successMessage = "Profile updated successfully!";
        isLoading = false;

        setTimeout(() => {
            successMessage = "";
        }, 3000);
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
</script>

{#if $user}
    <div class="min-h-screen bg-slate-50 py-12">
        <div class="container mx-auto px-4 max-w-4xl">
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div class="p-8 border-b border-gray-100">
                    <h2 class="text-xl font-bold text-gray-900 mb-2">
                        Edit Profile
                    </h2>
                    <p class="text-gray-600">
                        Update your personal and professional information.
                    </p>
                </div>

                <form
                    class="p-8 space-y-8"
                    on:submit|preventDefault={handleSave}
                >
                    <!-- Profile Header Redesign -->
                    {#if $user.role === "doctor"}
                        <div class="mb-10 relative group">
                            <!-- Hidden Inputs -->
                            <input
                                id="profilePicInput"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                on:change={(e) =>
                                    handleFileSelect(e, "profilePic")}
                            />
                            <input
                                id="bannerInput"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                on:change={(e) =>
                                    handleFileSelect(e, "bannerImage")}
                            />

                            <!-- Banner -->
                            <div
                                class="relative h-48 rounded-t-2xl overflow-hidden bg-gray-100 group-hover:opacity-95 transition-opacity"
                            >
                                {#if $user.bannerImage}
                                    <img
                                        src={$user.bannerImage}
                                        alt="Banner"
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div
                                        class="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400"
                                    ></div>
                                {/if}

                                <!-- Banner Edit Button -->
                                <button
                                    type="button"
                                    class="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                                    on:click={() =>
                                        triggerFileInput("bannerInput")}
                                    title="Edit Banner"
                                >
                                    <Icon name="edit" size={16} />
                                </button>
                            </div>

                            <!-- Profile Pic -->
                            <div class="absolute -bottom-16 left-8">
                                <button
                                    type="button"
                                    class="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white group hover:grayscale-[30%] transition-all"
                                    on:click={() =>
                                        (showProfilePicModal = true)}
                                >
                                    {#if $user.profilePic}
                                        <img
                                            src={$user.profilePic}
                                            alt="Profile"
                                            class="w-full h-full object-cover"
                                        />
                                    {:else}
                                        <div
                                            class="w-full h-full bg-gray-100 flex items-center justify-center text-primary/40"
                                        >
                                            <Icon name="user-md" size={64} />
                                        </div>
                                    {/if}

                                    <!-- Hover Overlay -->
                                    <div
                                        class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span
                                            class="text-white text-xs font-bold uppercase tracking-wider"
                                            >Change</span
                                        >
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Spacing -->
                        <div class="mt-20 mb-8 border-b border-gray-100"></div>
                    {/if}

                    <!-- Basic Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Display Name</label
                            >
                            <input
                                id="name"
                                type="text"
                                bind:value={$user.name}
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label
                                for="role"
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Account Role</label
                            >
                            <select
                                id="role"
                                value={$user.role || "patient"}
                                on:change={handleRoleChange}
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                        {#if $user.role === "doctor"}
                            <div>
                                <label
                                    for="specialty"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Specialty</label
                                >
                                <input
                                    id="specialty"
                                    type="text"
                                    bind:value={$user.specialty}
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div class="md:col-span-2">
                                <label
                                    for="clinic"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Clinic Address</label
                                >
                                <input
                                    id="clinic"
                                    type="text"
                                    bind:value={$user.clinicAddress}
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="123 Medical Center Dr..."
                                />
                            </div>
                            <div class="md:col-span-2">
                                <label
                                    for="mapUrl"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Clinic Map Embed URL</label
                                >
                                <input
                                    id="mapUrl"
                                    type="text"
                                    value={$user.clinicMapUrl}
                                    on:input={handleMapUrlInput}
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Paste map URL or iframe tag here..."
                                />
                                <p class="mt-2 text-xs text-gray-500">
                                    <strong>Super Easy:</strong> Just paste the
                                    whole <code>&lt;iframe&gt;</code> tag from Google
                                    Maps, and we'll handle the rest!
                                </p>

                                {#if $user.clinicMapUrl}
                                    <div class="mt-4">
                                        <p
                                            class="text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Map Preview:
                                        </p>
                                        <div
                                            class="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
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
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    {#if $user.role === "doctor"}
                        <!-- Bio & About -->
                        <div class="space-y-6">
                            <div>
                                <label
                                    for="bio"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Short Bio</label
                                >
                                <textarea
                                    id="bio"
                                    rows="2"
                                    bind:value={$user.bio}
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="A brief summary of your expertise..."
                                ></textarea>
                            </div>
                            <div>
                                <label
                                    for="about"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >About / Services</label
                                >
                                <textarea
                                    id="about"
                                    rows="4"
                                    bind:value={$user.about}
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Detailed description of your practice, philosophy, and services..."
                                ></textarea>
                            </div>
                            <div>
                                <label
                                    for="education"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Education</label
                                >
                                <input
                                    id="education"
                                    type="text"
                                    bind:value={$user.education}
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="MD, University of Medicine..."
                                />
                            </div>
                        </div>

                        <!-- Availability -->
                        <!-- Availability -->
                        <div
                            class="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                        >
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-bold text-gray-900">
                                    Availability Management
                                </h3>

                                <div class="relative">
                                    <select
                                        class="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-primary text-sm font-medium hover:border-gray-400 transition-colors cursor-pointer"
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
                                            <option value={day}>{day}</option>
                                        {/each}
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                                    >
                                        <Icon name="chevron-down" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                {#if !($user.availability && $user.availability.length > 0)}
                                    <div
                                        class="text-center py-8 text-gray-500 italic"
                                    >
                                        No availability set. Add a day to get
                                        started.
                                    </div>
                                {/if}

                                {#each $user.availability || [] as day, i}
                                    <div
                                        class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div
                                            class="flex items-center justify-between mb-3"
                                        >
                                            <span
                                                class="font-bold text-lg text-gray-800 flex items-center gap-2"
                                            >
                                                {day.day}
                                                <span
                                                    class="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
                                                    >{day.slots.length} slots</span
                                                >
                                            </span>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <button
                                                    type="button"
                                                    class="text-sm font-medium text-primary hover:text-primary-dark hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                                    on:click={() => addSlot(i)}
                                                >
                                                    + Add Slot
                                                </button>
                                                <button
                                                    type="button"
                                                    class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                    on:click={() =>
                                                        removeDay(i)}
                                                    title="Remove Day"
                                                >
                                                    <Icon
                                                        name="trash"
                                                        size={20}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div class="space-y-3">
                                            {#each day.slots as slot, slotIndex}
                                                <div
                                                    class="flex items-center gap-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100 group relative"
                                                >
                                                    <div
                                                        class="flex-1 grid grid-cols-2 gap-2"
                                                    >
                                                        <div class="space-y-1">
                                                            <span
                                                                class="text-[10px] uppercase font-bold text-gray-400"
                                                                >From</span
                                                            >
                                                            <input
                                                                type="text"
                                                                bind:value={
                                                                    slot.start
                                                                }
                                                                class="w-full px-2 py-1.5 text-xs font-bold text-center border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-primary transition-all"
                                                                placeholder="09:00 AM"
                                                            />
                                                        </div>
                                                        <div class="space-y-1">
                                                            <span
                                                                class="text-[10px] uppercase font-bold text-gray-400"
                                                                >To</span
                                                            >
                                                            <input
                                                                type="text"
                                                                bind:value={
                                                                    slot.end
                                                                }
                                                                class="w-full px-2 py-1.5 text-xs font-bold text-center border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-primary transition-all"
                                                                placeholder="05:00 PM"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        class="text-gray-300 hover:text-red-500 transition-colors p-1"
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
                                            {#if day.slots.length === 0}
                                                <span
                                                    class="text-sm text-gray-400 py-2"
                                                    >No slots added yet.</span
                                                >
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <div
                        class="pt-6 border-t border-gray-100 flex items-center justify-between"
                    >
                        {#if successMessage}
                            <span class="text-green-600 font-medium"
                                >{successMessage}</span
                            >
                        {:else}
                            <span></span>
                        {/if}
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Profile Picture Modal -->
    {#if showProfilePicModal}
        <Modal
            isOpen={true}
            title="Change Profile Photo"
            maxWidth="max-w-sm"
            on:close={() => (showProfilePicModal = false)}
        >
            <div class="space-y-3">
                <button
                    type="button"
                    class="w-full py-3 px-4 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-left flex items-center gap-3"
                    on:click={() => {
                        triggerFileInput("profilePicInput");
                        showProfilePicModal = false;
                    }}
                >
                    <Icon name="folder" size={20} /> Upload Photo
                </button>
                <button
                    type="button"
                    class="w-full py-3 px-4 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors text-left flex items-center gap-3"
                    on:click={() => {
                        $user.profilePic = "";
                        showProfilePicModal = false;
                    }}
                >
                    <Icon name="trash" size={20} /> Remove Photo
                </button>
            </div>
            <button
                class="mt-6 w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
                on:click={() => (showProfilePicModal = false)}>Cancel</button
            >
        </Modal>
    {/if}
{/if}
