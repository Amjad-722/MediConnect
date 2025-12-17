<script>
    import Button from "$components/Button.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { onMount } from "svelte";

    let isLoading = false;
    let successMessage = "";
    let showProfilePicModal = false;

    function triggerFileInput(elementId) {
        document.getElementById(elementId).click();
    }

    onMount(() => {
        if (!$user) {
            navigate("/login", { replace: true });
        }
    });

    async function handleSave() {
        isLoading = true;
        successMessage = "";
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Force store update to trigger subscribers (localStorage sync)
        user.set($user);

        successMessage = "Profile updated successfully!";
        isLoading = false;

        setTimeout(() => {
            successMessage = "";
        }, 3000);
    }

    function addSlot(dayIndex) {
        $user.availability[dayIndex].slots = [
            ...$user.availability[dayIndex].slots,
            "09:00 AM",
        ];
    }

    function removeSlot(dayIndex, slotIndex) {
        $user.availability[dayIndex].slots = $user.availability[
            dayIndex
        ].slots.filter((_, i) => i !== slotIndex);
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
                                    ✏️
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
                                            class="w-full h-full bg-gray-100 flex items-center justify-center text-4xl"
                                        >
                                            👨‍⚕️
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
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 mb-4">
                                Availability Management
                            </h3>
                            <div class="space-y-4">
                                {#each $user.availability as day, i}
                                    <div
                                        class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                                    >
                                        <div
                                            class="flex items-center justify-between mb-2"
                                        >
                                            <span
                                                class="font-bold text-gray-800"
                                                >{day.day}</span
                                            >
                                            <button
                                                type="button"
                                                class="text-sm text-primary hover:text-primary-dark"
                                                on:click={() => addSlot(i)}
                                            >
                                                + Add Slot
                                            </button>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            {#each day.slots as slot, slotIndex}
                                                <div class="relative group">
                                                    <input
                                                        type="text"
                                                        bind:value={
                                                            $user.availability[
                                                                i
                                                            ].slots[slotIndex]
                                                        }
                                                        class="w-24 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-primary focus:border-primary"
                                                    />
                                                    <button
                                                        type="button"
                                                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        on:click={() =>
                                                            removeSlot(
                                                                i,
                                                                slotIndex,
                                                            )}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            {/each}
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
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            on:click|self={() => (showProfilePicModal = false)}
        >
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                <h3 class="text-lg font-bold mb-4">Change Profile Photo</h3>
                <div class="space-y-3">
                    <button
                        type="button"
                        class="w-full py-3 px-4 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-left flex items-center gap-3"
                        on:click={() => {
                            triggerFileInput("profilePicInput");
                            showProfilePicModal = false;
                        }}
                    >
                        <span>📁</span> Upload Photo
                    </button>
                    <button
                        type="button"
                        class="w-full py-3 px-4 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors text-left flex items-center gap-3"
                        on:click={() => {
                            $user.profilePic = "";
                            showProfilePicModal = false;
                        }}
                    >
                        <span>🗑️</span> Remove Photo
                    </button>
                </div>
                <button
                    class="mt-6 w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
                    on:click={() => (showProfilePicModal = false)}
                    >Cancel</button
                >
            </div>
        </div>
    {/if}
{/if}
