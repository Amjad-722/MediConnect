<script>
    import { onMount } from "svelte";
    import { user } from "$lib/store";
    import {
        medications,
        addMedication,
        deleteMedication,
        updateMedication,
    } from "./medications";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";

    let showAddForm = false;
    let newMed = {
        name: "",
        dosage: "",
        frequency: "Daily",
        time: "08:00",
        startDate: new Date().toISOString().split("T")[0],
        notes: "",
    };

    $: patientMeds = $medications.filter(
        (m) => m.patientEmail === $user?.email,
    );

    function handleAdd() {
        if (!newMed.name || !newMed.dosage) return;
        addMedication({
            ...newMed,
            patientEmail: $user.email,
            id: Date.now().toString(),
        });
        resetForm();
    }

    function resetForm() {
        newMed = {
            name: "",
            dosage: "",
            frequency: "Daily",
            time: "08:00",
            startDate: new Date().toISOString().split("T")[0],
            notes: "",
        };
        showAddForm = false;
    }

    function removeMed(id) {
        if (confirm("Stop tracking this medication?")) {
            deleteMedication(id);
        }
    }
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-2xl font-bold text-[#000921]">Medications</h2>
            <p class="text-gray-500 text-sm mt-1">
                Track your prescriptions and supplements
            </p>
        </div>
        <Button variant="primary" onClick={() => (showAddForm = !showAddForm)}>
            <Icon
                name={showAddForm ? "x" : "plus"}
                size={18}
                className="mr-2"
            />
            {showAddForm ? "Cancel" : "Add Medication"}
        </Button>
    </div>

    {#if showAddForm}
        <div
            class="bg-gray-50 rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-inner animate-in"
        >
            <h3 class="text-lg font-bold text-[#000921] mb-6">
                Track New Medication
            </h3>
            <form on:submit|preventDefault={handleAdd} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            for="medName"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Medication Name</label
                        >
                        <input
                            id="medName"
                            type="text"
                            bind:value={newMed.name}
                            placeholder="e.g. Amoxicillin, Vitamin D"
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="medDosage"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Dosage</label
                        >
                        <input
                            id="medDosage"
                            type="text"
                            bind:value={newMed.dosage}
                            placeholder="e.g. 500mg, 1 tablet"
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="medFreq"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Frequency</label
                        >
                        <select
                            id="medFreq"
                            bind:value={newMed.frequency}
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm text-gray-900"
                        >
                            <option>Daily</option>
                            <option>Twice Daily</option>
                            <option>Weekly</option>
                            <option>As Needed</option>
                        </select>
                    </div>
                    <div>
                        <label
                            for="medTime"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Reminder Time</label
                        >
                        <input
                            id="medTime"
                            type="time"
                            bind:value={newMed.time}
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                        />
                    </div>
                    <div class="md:col-span-2">
                        <label
                            for="medNotes"
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Notes (Optional)</label
                        >
                        <textarea
                            id="medNotes"
                            bind:value={newMed.notes}
                            rows="2"
                            placeholder="e.g. Take with food, after breakfast"
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm resize-none"
                        ></textarea>
                    </div>
                </div>
                <div class="flex justify-end pt-4">
                    <Button type="submit" variant="primary" size="lg"
                        >Add to Schedule</Button
                    >
                </div>
            </form>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if patientMeds.length === 0}
            <div
                class="col-span-full text-center py-16 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200"
            >
                <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 mb-4"
                >
                    <Icon name="pill" size={32} />
                </div>
                <h3 class="text-lg font-bold text-gray-900">
                    No medications tracked
                </h3>
                <p class="text-gray-500 max-w-sm mx-auto mt-2">
                    Add your medications to get smart reminders and stay on
                    track.
                </p>
            </div>
        {:else}
            {#each patientMeds as med}
                <div
                    class="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all group border-l-4 border-l-purple-400"
                >
                    <div class="flex justify-between items-start">
                        <div class="flex gap-4">
                            <div
                                class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"
                            >
                                <Icon name="pill" size={24} />
                            </div>
                            <div>
                                <h3
                                    class="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors"
                                >
                                    {med.name}
                                </h3>
                                <div
                                    class="flex flex-wrap items-center gap-3 mt-1"
                                >
                                    <span
                                        class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md"
                                    >
                                        {med.dosage}
                                    </span>
                                    <span
                                        class="text-xs text-gray-500 flex items-center gap-1"
                                    >
                                        <Icon name="clock" size={12} />
                                        {med.time} ({med.frequency})
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            on:click={() => removeMed(med.id)}
                            class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Icon name="trash" size={18} />
                        </button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .animate-in {
        animation: slideDown 0.4s ease-out;
    }
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
