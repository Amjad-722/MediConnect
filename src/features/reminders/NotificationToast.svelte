<script>
    import { onMount } from "svelte";
    import { notifications, removeNotification } from "./notifications";
    import Icon from "$ui/Icon.svelte";

    let toasts = [];

    $: {
        // Only show unread and recent ones as toasts
        const recent = $notifications.filter((n) => !n.read).slice(0, 3);
        toasts = recent;
    }

    function dismiss(id) {
        removeNotification(id);
    }
</script>

<div
    class="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 pointer-events-none"
>
    {#each toasts as toast (toast.id)}
        <div
            class="pointer-events-auto bg-white border border-gray-100 rounded-2xl p-4 shadow-2xl flex items-start gap-4 min-w-[320px] max-w-[400px] animate-slide-in"
        >
            <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 {toast.type ===
                'medication'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-blue-50 text-blue-600'}"
            >
                <Icon
                    name={toast.type === "medication" ? "pill" : "calendar"}
                    size={20}
                />
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-900 text-sm">{toast.title}</h4>
                <p class="text-gray-500 text-xs mt-0.5 line-clamp-2">
                    {toast.message}
                </p>
            </div>
            <button
                on:click={() => dismiss(toast.id)}
                class="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <Icon name="x" size={16} />
            </button>
        </div>
    {/each}
</div>

<style>
    .animate-slide-in {
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
</style>
