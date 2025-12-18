<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Icon from "./Icon.svelte";

    export let isOpen = false;
    export let title = "";
    export let maxWidth = "max-w-md";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function handleKeydown(event) {
        if (isOpen && event.key === "Escape") {
            close();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <!-- Backdrop -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        on:click|self={close}
    >
        <!-- Modal Content -->
        <div
            class="bg-white rounded-2xl shadow-2xl {maxWidth} w-full relative animate-modal-in"
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between p-6 border-b border-gray-100"
            >
                <h3 class="text-2xl font-bold text-gray-900">
                    {title}
                </h3>
                <button
                    type="button"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    on:click={close}
                    aria-label="Close modal"
                >
                    <Icon name="x" size={20} />
                </button>
            </div>

            <!-- Body -->
            <div class="px-8 pb-8 pt-6">
                <slot />
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes modal-in {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .animate-modal-in {
        animation: modal-in 0.2s ease-out forwards;
    }
</style>
