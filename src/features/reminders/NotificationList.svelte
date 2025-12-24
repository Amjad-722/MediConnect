<script>
    import {
        notifications,
        markAsRead,
        markAllAsRead,
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

<div class="relative w-[450px] animate-fade-in pt-3 origin-top-right">
    <!-- Tiny Pointer Arrow -->
    <div
        class="absolute top-0 right-6 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 transform origin-center -z-10 translate-y-1.5"
    ></div>

    <div
        class="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
    >
        <!-- Header -->
        <div
            class="px-6 py-4 flex justify-between items-center border-b border-gray-50 bg-white"
        >
            <h3 class="text-base font-bold text-gray-900">Notifications</h3>
            {#if $notifications.some((n) => !n.read)}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="p-1 h-auto text-primary font-bold hover:bg-primary/5 border-none"
                >
                    <Icon name="check" size={14} className="mr-1.5" />
                    Mark all as read
                </Button>
            {/if}
        </div>

        <!-- Scrollable List -->
        <div
            class="max-h-[480px] overflow-y-auto custom-scrollbar
                   [&::-webkit-scrollbar]:w-1.5
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-gray-100
                   [&::-webkit-scrollbar-thumb]:rounded-full
                   hover:[&::-webkit-scrollbar-thumb]:bg-gray-200"
        >
            {#if $notifications.length === 0}
                <div class="text-center py-16 px-6">
                    <div
                        class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"
                    >
                        <Icon name="bell" size={24} />
                    </div>
                    <p class="text-gray-900 font-bold text-sm">
                        No notifications yet
                    </p>
                    <p class="text-gray-500 text-xs mt-1">
                        We'll alert you when something happens.
                    </p>
                </div>
            {:else}
                <div class="divide-y divide-gray-50">
                    {#each $notifications as notification (notification.id)}
                        <div
                            class="p-4 hover:bg-gray-50/50 transition-colors flex items-start gap-3 relative group"
                        >
                            <!-- Unread Indicator Dot -->
                            {#if !notification.read}
                                <div
                                    class="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                                ></div>
                            {/if}

                            <!-- Icon/Avatar -->
                            <div
                                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 {notification.type ===
                                'medication'
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'bg-blue-50 text-blue-600'}"
                            >
                                <Icon
                                    name={notification.type === "medication"
                                        ? "pill"
                                        : "calendar"}
                                    size={18}
                                />
                            </div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                                <div
                                    class="flex justify-between items-start gap-2"
                                >
                                    <h4
                                        class="font-bold text-gray-900 text-[13px] leading-snug"
                                    >
                                        {notification.title}
                                    </h4>
                                    <span
                                        class="text-[10px] text-gray-400 whitespace-nowrap pt-0.5"
                                    >
                                        {formatTime(notification.timestamp)}
                                    </span>
                                </div>
                                <p
                                    class="text-gray-500 text-xs mt-0.5 leading-relaxed line-clamp-2"
                                >
                                    {notification.message}
                                </p>

                                <div
                                    class="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {#if !notification.read}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                markAsRead(notification.id)}
                                            className="p-0 h-auto text-[10px] font-bold text-primary hover:underline hover:bg-transparent border-none"
                                        >
                                            Mark as read
                                        </Button>
                                    {/if}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            removeNotification(notification.id)}
                                        className="p-0 h-auto text-[10px] font-bold text-red-500 hover:underline hover:bg-transparent border-none"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Footer -->
        <div class="p-4 bg-white border-t border-gray-50 space-y-2">
            {#if $notifications.length > 0}
                <Button
                    variant="ghost"
                    fullWidth
                    size="sm"
                    onClick={onClose}
                    className="py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                    Show all
                </Button>
                <Button
                    variant="ghost"
                    fullWidth
                    size="sm"
                    onClick={clearAllNotifications}
                    className="py-2 text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider hover:bg-transparent"
                >
                    Clear all notifications
                </Button>
            {:else}
                <Button
                    variant="ghost"
                    fullWidth
                    size="sm"
                    disabled
                    className="py-2 text-gray-400 opacity-100"
                >
                    View all
                </Button>
            {/if}
        </div>
    </div>
</div>
