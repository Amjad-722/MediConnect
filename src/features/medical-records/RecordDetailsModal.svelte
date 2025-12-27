<script>
    import Modal from "$ui/Modal.svelte";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";

    /** @type {any} */
    export let record = null;
    export let isOpen = false;
    export let onClose = () => {};

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

{#if record}
    <Modal
        {isOpen}
        on:close={onClose}
        title="Record Details"
        maxWidth="max-w-2xl"
    >
        <div class="p-2">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div class="flex items-center gap-4">
                    <div
                        class="w-14 h-14 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center"
                    >
                        <Icon
                            name={record.type === "Prescription"
                                ? "activity"
                                : record.type === "Report"
                                  ? "clipboard"
                                  : "heart"}
                            size={28}
                        />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-[#000921]">
                            {record.title}
                        </h2>
                        <span
                            class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full {getTypeColor(
                                record.type,
                            )}"
                        >
                            {record.type}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold text-gray-900">{record.date}</p>
                    <p class="text-xs text-gray-500">{record.doctor}</p>
                </div>
            </div>

            <div class="space-y-6">
                <div>
                    <h3
                        class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2"
                    >
                        Description
                    </h3>
                    <div
                        class="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-gray-600 leading-relaxed"
                    >
                        {record.description}
                    </div>
                </div>

                {#if record.attachments && record.attachments.length > 0}
                    <div>
                        <h3
                            class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3"
                        >
                            Attachments
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {#each record.attachments as attachment}
                                <div
                                    class="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                                    >
                                        <Icon name="file-text" size={20} />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p
                                            class="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors"
                                        >
                                            {attachment.name}
                                        </p>
                                        <p
                                            class="text-[10px] text-gray-400 uppercase"
                                        >
                                            {attachment.type}
                                        </p>
                                    </div>
                                    <Icon
                                        name="download"
                                        size={16}
                                        className="text-gray-400"
                                    />
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            <div class="mt-10 flex justify-end">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </div>
    </Modal>
{/if}
