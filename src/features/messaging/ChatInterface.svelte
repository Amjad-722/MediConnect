<script>
    import { onMount, afterUpdate } from "svelte";
    import { fly, scale } from "svelte/transition";
    import { user } from "$lib/store";
    import { messages, sendMessage, markAsRead } from "./messages";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";

    export let appointmentId;
    export let otherPartyName;
    export let onClose;

    let newMessage = "";
    let chatContainer;

    $: appointmentMessages = $messages.filter(
        (m) => m.appointmentId === appointmentId,
    );

    // Auto-scroll to bottom on new messages
    function scrollToBottom() {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    onMount(() => {
        scrollToBottom();
        markAsRead(appointmentId, $user.email);
    });

    afterUpdate(() => {
        scrollToBottom();
    });

    function handleSend() {
        if (!newMessage.trim()) return;
        sendMessage(appointmentId, $user.email, newMessage, $user.name);
        newMessage = "";
    }

    function handleKeydown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
</script>

<div
    transition:scale={{ duration: 300, start: 0.95 }}
    class="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col z-[100] overflow-hidden"
>
    <!-- Header -->
    <div
        class="p-6 bg-[#000921] text-white flex justify-between items-center shrink-0"
    >
        <div class="flex items-center gap-4">
            <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20"
            >
                <Icon name="user" size={20} />
            </div>
            <div>
                <h3 class="font-bold text-sm">{otherPartyName}</h3>
                <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    <span class="text-[10px] text-white/60">Online</span>
                </div>
            </div>
        </div>
        <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 h-auto hover:bg-white/10 text-white/70 hover:text-white border-none"
        >
            <Icon name="x" size={20} />
        </Button>
    </div>

    <!-- Messages Area -->
    <div
        bind:this={chatContainer}
        class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 custom-scrollbar
               [&::-webkit-scrollbar]:w-1.5
               [&::-webkit-scrollbar-track]:bg-transparent
               [&::-webkit-scrollbar-thumb]:bg-gray-200
               [&::-webkit-scrollbar-thumb]:rounded-full"
    >
        {#if appointmentMessages.length === 0}
            <div
                class="flex flex-col items-center justify-center h-full text-center space-y-4 px-8"
            >
                <div
                    class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300"
                >
                    <Icon name="message-circle" size={32} />
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-900">
                        No messages yet
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                        Start a conversation with your healthcare provider.
                    </p>
                </div>
            </div>
        {:else}
            {#each appointmentMessages as msg (msg.id)}
                <div
                    class="flex flex-col {msg.senderEmail === $user.email
                        ? 'items-end'
                        : 'items-start'}"
                >
                    <div
                        class="max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                               {msg.senderEmail === $user.email
                            ? 'bg-[#000921] text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}"
                    >
                        {msg.text}
                    </div>
                    <span class="text-[10px] text-gray-400 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t border-gray-100 shrink-0">
        <div
            class="flex items-end gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-100 focus-within:border-primary transition-all"
        >
            <textarea
                bind:value={newMessage}
                on:keydown={handleKeydown}
                placeholder="Type your message..."
                class="flex-1 bg-transparent border-none focus:ring-0 p-2 text-sm resize-none max-h-32 min-h-[44px]"
                rows="1"
            ></textarea>
            <Button
                variant="primary"
                size="sm"
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-2.5 h-auto min-w-0"
            >
                <Icon name="arrow-right" size={20} className="-rotate-45" />
            </Button>
        </div>
    </div>
</div>
