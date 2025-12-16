<script>
    import Button from "$components/Button.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { onMount } from "svelte";

    let isLoading = false;
    let successMessage = "";

    onMount(() => {
        if (!$user || $user.role !== "doctor") {
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
</script>

{#if $user}
    <div class="min-h-screen bg-slate-50 py-12">
        <div class="container mx-auto px-4 max-w-4xl">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900">
                    Doctor Dashboard
                </h1>
                <Button variant="outline" href="/doctor/me"
                    >View Public Profile</Button
                >
            </div>

            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div class="p-8 border-b border-gray-100">
                    <h2 class="text-xl font-bold text-gray-900 mb-2">
                        My Profile
                    </h2>
                    <p class="text-gray-600">
                        Update your public provider information.
                    </p>
                </div>

                <form
                    class="p-8 space-y-8"
                    on:submit|preventDefault={handleSave}
                >
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
                    </div>

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
                                        <span class="font-bold text-gray-800"
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
                                                        $user.availability[i]
                                                            .slots[slotIndex]
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
