<script>
    import { onMount } from "svelte";
    import { user } from "$lib/store";
    import {
        records,
        addRecord,
        deleteRecord,
        getRecordsByPatient,
    } from "$features/medical-records/records";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";
    import RecordDetailsModal from "./RecordDetailsModal.svelte";

    let activeTab = "All";
    let showAddForm = false;
    let selectedRecord = null;
    let showDetailsModal = false;

    // Form state
    let newRecord = {
        title: "",
        type: "History",
        date: new Date().toISOString().split("T")[0],
        doctor: "",
        description: "",
    };

    $: patientRecords = $records.filter((r) => r.patientEmail === $user?.email);

    $: filteredRecords = patientRecords
        .filter((r) => activeTab === "All" || r.type === activeTab)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    function handleAddRecord() {
        if (!newRecord.title || !newRecord.description) return;

        addRecord({
            ...newRecord,
            patientEmail: $user.email,
        });

        // Reset form
        newRecord = {
            title: "",
            type: "History",
            date: new Date().toISOString().split("T")[0],
            doctor: "",
            description: "",
        };
        showAddForm = false;
    }

    function viewDetails(record) {
        selectedRecord = record;
        showDetailsModal = true;
    }

    function getTypeColor(type) {
        switch (type?.toLowerCase()) {
            case "history":
                return "bg-blue-100 text-blue-800";
            case "prescription":
                return "bg-purple-100 text-purple-800";
            case "report":
                return "bg-cyan-100 text-cyan-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
</script>

<div class="space-y-8 animate-fade-in">
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h2 class="text-2xl font-bold text-[#000921]">Medical Records</h2>
            <p class="text-gray-500 text-sm mt-1">
                Manage and view your centralized medical history.
            </p>
        </div>
        <Button variant="primary" onClick={() => (showAddForm = !showAddForm)}>
            <Icon
                name={showAddForm ? "x" : "plus"}
                size={18}
                className="mr-2"
            />
            {showAddForm ? "Cancel" : "Add Record"}
        </Button>
    </div>

    {#if showAddForm}
        <div
            class="bg-gray-50 rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-inner animate-in"
        >
            <h3 class="text-lg font-bold text-[#000921] mb-6">
                New Medical Record
            </h3>
            <form on:submit|preventDefault={handleAddRecord} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Record Title</label
                        >
                        <input
                            type="text"
                            bind:value={newRecord.title}
                            placeholder="e.g. Annual Checkup, Dental Surgery"
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Record Type</label
                        >
                        <select
                            bind:value={newRecord.type}
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm text-gray-900"
                        >
                            <option value="History">Medical History</option>
                            <option value="Prescription">Prescription</option>
                            <option value="Report">Test Report</option>
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Date</label
                        >
                        <input
                            type="date"
                            bind:value={newRecord.date}
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-bold text-gray-700 mb-2"
                            >Doctor/Clinic</label
                        >
                        <input
                            type="text"
                            bind:value={newRecord.doctor}
                            placeholder="e.g. Dr. Sarah Smith"
                            class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2"
                        >Summary / Notes</label
                    >
                    <textarea
                        bind:value={newRecord.description}
                        rows="4"
                        placeholder="Provide basic details about this record..."
                        class="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-sm resize-none"
                        required
                    ></textarea>
                </div>
                <div class="flex justify-end pt-4">
                    <Button type="submit" variant="primary" size="lg"
                        >Save Record</Button
                    >
                </div>
            </form>
        </div>
    {/if}

    <!-- Filtering -->
    <div class="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-xl w-fit">
        {#each ["All", "History", "Prescription", "Report"] as tab}
            <button
                class="px-5 py-2 rounded-lg text-sm font-bold transition-all {activeTab ===
                tab
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}"
                on:click={() => (activeTab = tab)}
            >
                {tab === "All"
                    ? "All Records"
                    : tab === "History"
                      ? "Medical History"
                      : tab === "Prescription"
                        ? "Prescriptions"
                        : "Reports"}
            </button>
        {/each}
    </div>

    <!-- Records List -->
    <div class="grid grid-cols-1 gap-4">
        {#if filteredRecords.length === 0}
            <div
                class="text-center py-16 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200"
            >
                <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-secondary mb-4"
                >
                    <Icon name="clipboard" size={32} />
                </div>
                <h3 class="text-lg font-bold text-gray-900">
                    No records found
                </h3>
                <p class="text-gray-500 max-w-sm mx-auto mt-2">
                    Any medical records or history you add will appear here for
                    easy access.
                </p>
            </div>
        {:else}
            {#each filteredRecords as record}
                <div
                    class="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group border-l-4 {record.type ===
                    'Prescription'
                        ? 'border-l-purple-400'
                        : record.type === 'Report'
                          ? 'border-l-cyan-400'
                          : 'border-l-blue-400'}"
                >
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <div class="flex items-start gap-4">
                            <div
                                class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-secondary transition-colors shrink-0"
                            >
                                <Icon
                                    name={record.type === "Prescription"
                                        ? "activity"
                                        : record.type === "Report"
                                          ? "clipboard"
                                          : "heart"}
                                    size={24}
                                />
                            </div>
                            <div>
                                <h3
                                    class="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors"
                                >
                                    {record.title}
                                </h3>
                                <div
                                    class="flex flex-wrap items-center gap-3 mt-1"
                                >
                                    <span
                                        class="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md {getTypeColor(
                                            record.type,
                                        )}"
                                    >
                                        {record.type}
                                    </span>
                                    <span
                                        class="text-xs text-gray-500 flex items-center gap-1"
                                    >
                                        <Icon name="calendar" size={12} />
                                        {record.date}
                                    </span>
                                    {#if record.doctor}
                                        <span
                                            class="text-xs text-gray-500 flex items-center gap-1"
                                        >
                                            <Icon name="user" size={12} />
                                            {record.doctor}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex items-center gap-2 self-end sm:self-center"
                        >
                            <button
                                class="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                                on:click={() => viewDetails(record)}
                                title="View Details"
                            >
                                <Icon name="eye" size={20} />
                            </button>
                            <button
                                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                on:click={() => {
                                    if (confirm("Delete this record?"))
                                        deleteRecord(record.id);
                                }}
                                title="Delete Record"
                            >
                                <Icon name="trash" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<RecordDetailsModal
    record={selectedRecord}
    isOpen={showDetailsModal}
    onClose={() => {
        showDetailsModal = false;
        selectedRecord = null;
    }}
/>

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
