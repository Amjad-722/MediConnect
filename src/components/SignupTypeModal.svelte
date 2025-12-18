<script>
    import { isSignupModalOpen } from "$lib/store";
    import Icon from "$components/reusable/Icon.svelte";
    import { navigate } from "$lib/router.js";

    function close() {
        isSignupModalOpen.set(false);
    }

    function handleSelect(type) {
        close();
        if (type === "doctor") {
            navigate("/doctor-register");
        } else {
            navigate("/register");
        }
    }

    function handleKeydown(e) {
        if (e.key === "Escape") {
            close();
        }
    }
</script>

{#if $isSignupModalOpen}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
        role="dialog"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
        on:click|self={close}
        on:keydown={handleKeydown}
        tabindex="-1"
        aria-modal="true"
    >
        <div
            class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in-up"
        >
            <button
                class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                on:click={close}
                aria-label="Close modal"
            >
                <Icon name="x" size={24} />
            </button>

            <div class="text-center mb-10">
                <h3 class="text-3xl font-bold text-gray-900 mb-3">
                    How would you like to join?
                </h3>
                <p class="text-gray-500">
                    Choose your account type to get started with MediConnect
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Patient Option -->
                <button
                    on:click={() => handleSelect("patient")}
                    class="group flex flex-col items-center p-8 bg-blue-50 hover:bg-white rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-xl text-center"
                >
                    <div
                        class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    >
                        <Icon name="user" size={40} className="text-primary" />
                    </div>
                    <span class="text-xl font-bold text-gray-900 mb-2"
                        >As a Patient</span
                    >
                    <p class="text-sm text-gray-500">
                        Book appointments, manage records, and consult with
                        doctors online.
                    </p>
                </button>

                <!-- Doctor Option -->
                <button
                    on:click={() => handleSelect("doctor")}
                    class="group flex flex-col items-center p-8 bg-teal-50 hover:bg-white rounded-2xl border-2 border-transparent hover:border-secondary transition-all duration-300 hover:shadow-xl text-center"
                >
                    <div
                        class="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    >
                        <Icon
                            name="user-md"
                            size={40}
                            className="text-secondary"
                        />
                    </div>
                    <span class="text-xl font-bold text-gray-900 mb-2"
                        >As a Doctor</span
                    >
                    <p class="text-sm text-gray-500">
                        Grow your practice, manage appointments, and reach more
                        patients.
                    </p>
                </button>
            </div>

            <p class="text-center mt-8 text-sm text-gray-400">
                Already have an account?
                <button
                    on:click={() => {
                        close();
                        navigate("/login");
                    }}
                    class="text-primary font-medium hover:underline"
                >
                    Log in
                </button>
            </p>
        </div>
    </div>
{/if}

<style>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.4s ease-out forwards;
    }
</style>
