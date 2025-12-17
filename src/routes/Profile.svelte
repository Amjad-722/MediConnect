<script>
    import Button from "$components/Button.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { onMount } from "svelte";

    let isLoading = false;
    let successMessage = "";

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
                    <!-- Profile Images -->
                    {#if $user.role === "doctor"}
                        <div
                            class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100"
                        >
                            <div>
                                <label
                                    for="profilePic"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    >Profile Picture</label
                                >
                                <div class="flex items-center gap-4">
                                    {#if $user.profilePic}
                                        <img
                                            src={$user.profilePic}
                                            alt="Profile"
                                            class="w-16 h-16 rounded-full object-cover border border-gray-200"
                                        />
                                    {/if}
                                    <input
                                        id="profilePic"
                                        type="file"
                                        accept="image/*"
                                        on:change={(e) =>
                                            handleFileSelect(e, "profilePic")}
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    for="bannerImage"
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    >Banner Image</label
                                >
                                <div class="space-y-2">
                                    {#if $user.bannerImage}
                                        <img
                                            src={$user.bannerImage}
                                            alt="Banner"
                                            class="w-full h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                    {/if}
                                    <input
                                        id="bannerImage"
                                        type="file"
                                        accept="image/*"
                                        on:change={(e) =>
                                            handleFileSelect(e, "bannerImage")}
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                    />
                                </div>
                            </div>
                        </div>
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
{/if}
