<script>
    import { isSignupModalOpen } from "$lib/store";
    import Icon from "$components/reusable/Icon.svelte";
    import { navigate } from "$lib/router.js";
    import Modal from "$components/reusable/Modal.svelte";

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
</script>

{#if $isSignupModalOpen}
    <Modal
        isOpen={true}
        title="How would you like to join?"
        maxWidth="max-w-2xl"
        on:close={close}
    >
        <div class="text-center mb-10">
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
                    Book appointments, manage records, and consult with doctors
                    online.
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
                    <Icon name="user-md" size={40} className="text-secondary" />
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
    </Modal>
{/if}
