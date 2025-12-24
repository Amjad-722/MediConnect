<script>
    import {
        notifications,
        markAsRead,
        removeNotification,
        clearAllNotifications,
    } from "./notifications";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";

    export let onClose = () => {};

    function formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

<div
    class="w-full max-w-md bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden animate-fade-in"
>
    <div class="p-6 border-b border-gray-50 flex justify-between items-center">
        <div>
            <h3 class="text-xl font-bold text-[#000921]">Notifications</h3>
            <p class="text-gray-500 text-xs mt-0.5">
                Stay updated with your health schedule
            </p>
        </div>
        <button
            on:click={onClose}
            class="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
        >
            <Icon name="x" size={20} />
        </button>
    </div>

    <div class="max-h-[500px] overflow-y-auto p-4 space-y-3">
        {#if $notifications.length === 0}
            <div class="text-center py-12">
                <div
                    class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300"
                >
                    <Icon name="bell" size={24} />
                </div>
                <p class="text-gray-500 text-sm">No notifications yet</p>
            </div>
        {:else}
            {#each $notifications as notification (notification.id)}
                <div
                    class="p-4 rounded-2xl border transition-all flex items-start gap-4 {notification.read
                        ? 'bg-white border-gray-50 opacity-75'
                        : 'bg-blue-50/30 border-blue-100 shadow-sm'}"
                >
                    <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 {notification.type ===
                        'medication'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-blue-100 text-blue-600'}"
                    >
                        <Icon
                            name={notification.type === "medication"
                                ? "pill"
                                : "calendar"}
                            size={20}
                        />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start gap-2">
                            <h4 class="font-bold text-gray-900 text-sm">
                                {notification.title}
                            </h4>
                            <span
                                class="text-[10px] text-gray-400 whitespace-nowrap"
                                >{formatTime(notification.timestamp)}</span
                            >
                        </div>
                        <p class="text-gray-500 text-xs mt-1 leading-relaxed">
                            {notification.message}
                        </p>
                        {#if !notification.read}
                            <button
                                on:click={() => markAsRead(notification.id)}
                                class="text-[10px] font-bold text-primary mt-2 hover:underline"
                            >
                                Mark as read
                            </button>
                        {/if}
                    </div>
                    <button
                        on:click={() => removeNotification(notification.id)}
                        class="text-gray-300 hover:text-red-500 transition-colors"
                    >
                        <Icon name="trash" size={14} />
                    </button>
                </div>
            {/each}
        {/if}
    </div>

    {#if $notifications.length > 0}
        <div
            class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-3"
        >
            <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={clearAllNotifications}>Clear All</Button
            >
            <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={onClose}>Close</Button
            >
        </div>
    {/if}
</div>
