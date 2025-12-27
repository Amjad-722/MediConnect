<script>
    import { user } from "$lib/store";
    import {
        prescriptions,
        issuePrescription,
        updatePrescriptionStatus,
    } from "./prescriptions";
    import { addNotification } from "$features/reminders/notifications";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";
    import { fade, slide, scale } from "svelte/transition";

    export let appointmentId = null;
    export let patientId = null;
    export let patientEmail = null;
    export let patientName = null;
    export let mode = "viewer"; // 'issuer' or 'viewer'
    export let onClose = null;

    let showSuccess = false;
    let newPrescription = {
        medications: [{ name: "", dosage: "", instructions: "" }],
        notes: "",
    };

    $: userPrescriptions = $prescriptions.filter((rx) =>
        $user.role === "patient"
            ? rx.patientEmail === $user.email
            : rx.doctorId === $user.id,
    );

    function addMedicationField() {
        newPrescription.medications = [
            ...newPrescription.medications,
            { name: "", dosage: "", instructions: "" },
        ];
    }

    function removeMedicationField(index) {
        newPrescription.medications = newPrescription.medications.filter(
            (_, i) => i !== index,
        );
    }

    function handleIssue() {
        if (!newPrescription.medications[0].name) return;

        issuePrescription({
            appointmentId,
            patientId,
            patientEmail,
            patientName,
            doctorId: $user.id,
            doctorName: $user.name,
            medications: newPrescription.medications,
            notes: newPrescription.notes,
        });

        addNotification({
            type: "activity",
            title: "New Prescription Issued",
            message: `Dr. ${$user.name} has issued a new prescription for ${patientName}.`,
            patientEmail: patientEmail,
        });

        showSuccess = true;
        setTimeout(() => {
            showSuccess = false;
            if (onClose) onClose();
        }, 2000);
        resetForm();
    }

    function resetForm() {
        newPrescription = {
            medications: [{ name: "", dosage: "", instructions: "" }],
            notes: "",
        };
    }

    function handleOrder(rx) {
        updatePrescriptionStatus(rx.id, "Ordered");

        addNotification({
            type: "activity",
            title: "Medication Ordered",
            message: `Your order for medications from Dr. ${rx.doctorName} has been placed.`,
            patientEmail: $user.email,
        });

        alert(
            "Order placed successfully! You will be notified when your medications are ready for pickup or delivery.",
        );
    }
</script>

<div class="space-y-6">
    {#if mode === "issuer"}
        <!-- Doctor View: Issue Prescription -->
        <div
            class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm"
        >
            <h3
                class="text-xl font-bold text-[#000921] mb-6 flex items-center gap-2"
            >
                <Icon name="activity" size={24} className="text-secondary" />
                Issue New Prescription
            </h3>

            <div class="space-y-4">
                {#each newPrescription.medications as med, i}
                    <div
                        transition:slide
                        class="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative"
                    >
                        {#if newPrescription.medications.length > 1}
                            <button
                                on:click={() => removeMedicationField(i)}
                                class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Icon name="x" size={16} />
                            </button>
                        {/if}

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="med-name-{i}"
                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                                    >Medication Name</label
                                >
                                <input
                                    id="med-name-{i}"
                                    bind:value={med.name}
                                    placeholder="e.g. Amoxicillin"
                                    class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label
                                    for="med-dosage-{i}"
                                    class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                                    >Dosage</label
                                >
                                <input
                                    id="med-dosage-{i}"
                                    bind:value={med.dosage}
                                    placeholder="e.g. 500mg, twice a day"
                                    class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                for="med-instructions-{i}"
                                class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                                >Special Instructions</label
                            >
                            <input
                                id="med-instructions-{i}"
                                bind:value={med.instructions}
                                placeholder="e.g. Take after meals"
                                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>
                {/each}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addMedicationField}
                    className="text-primary font-bold"
                >
                    <Icon name="plus" size={16} className="mr-2" />
                    Add Another Medication
                </Button>

                <div class="pt-4">
                    <label
                        for="doctor-notes"
                        class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                        >Doctor's Notes</label
                    >
                    <textarea
                        id="doctor-notes"
                        bind:value={newPrescription.notes}
                        rows="2"
                        placeholder="Additional notes for the patient or pharmacist..."
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-primary transition-all text-sm resize-none"
                    ></textarea>
                </div>

                <div class="flex justify-end pt-4">
                    <Button variant="primary" size="lg" onClick={handleIssue}>
                        Issue Prescription
                    </Button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Patient/General View: Prescription List -->
    <div class="grid grid-cols-1 gap-4">
        {#if userPrescriptions.length === 0}
            <div
                class="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-gray-200"
            >
                <div
                    class="w-16 h-16 rounded-full bg-blue-50 text-secondary flex items-center justify-center mx-auto mb-4"
                >
                    <Icon name="clipboard" size={32} />
                </div>
                <h3 class="text-lg font-bold text-[#000921]">
                    No prescriptions found
                </h3>
                <p class="text-gray-500 text-sm mt-1">
                    Digital prescriptions will appear here once issued by your
                    doctor.
                </p>
            </div>
        {:else}
            {#each userPrescriptions as rx (rx.id)}
                <div
                    class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                    <div
                        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center"
                            >
                                <Icon name="activity" size={24} />
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">
                                    Dr. {rx.doctorName}
                                </h4>
                                <p class="text-xs text-gray-500">
                                    Issued on {new Date(
                                        rx.issuedAt,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span
                            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                            {rx.status === 'Active'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-blue-50 text-blue-600'}"
                        >
                            {rx.status}
                        </span>
                    </div>

                    <div class="space-y-4">
                        {#each rx.medications as med}
                            <div
                                class="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-50"
                            >
                                <div>
                                    <p class="font-bold text-gray-900 text-sm">
                                        {med.name}
                                    </p>
                                    <p class="text-xs text-gray-600 mt-0.5">
                                        {med.dosage} • {med.instructions}
                                    </p>
                                </div>
                                <Icon
                                    name="pill"
                                    size={18}
                                    className="text-gray-300"
                                />
                            </div>
                        {/each}
                    </div>

                    {#if rx.notes}
                        <div
                            class="mt-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-50 text-xs text-gray-600"
                        >
                            <span class="font-bold text-primary block mb-1"
                                >Notes:</span
                            >
                            {rx.notes}
                        </div>
                    {/if}

                    {#if $user.role === "patient" && rx.status === "Active"}
                        <div class="mt-6">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => handleOrder(rx)}
                            >
                                <Icon
                                    name="shopping-cart"
                                    size={18}
                                    className="mr-2"
                                />
                                Order Medications Online
                            </Button>
                        </div>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
</div>

{#if showSuccess}
    <div
        transition:fade
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-green-600 text-white rounded-full shadow-2xl font-bold flex items-center gap-2"
    >
        <Icon name="check-circle" size={20} />
        Prescription Issued Successfully
    </div>
{/if}
