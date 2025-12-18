<script>
    import Button from "$components/reusable/Button.svelte";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section
    class="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-white"
>
    <!-- Animated Mesh Background -->
    <div class="absolute inset-0 z-0">
        <div
            class="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"
        ></div>
        <div
            class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -ml-20 -mb-20 animate-pulse"
            style="animation-delay: 2s"
        ></div>
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-blue-50/50 to-transparent"
        ></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
        <div
            class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center"
        >
            <!-- Text Content -->
            <div class="space-y-8 text-center lg:text-left">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-secondary rounded-full text-sm font-semibold animate-fade-in-up"
                >
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"
                        ></span>
                        <span
                            class="relative inline-flex rounded-full h-2 w-2 bg-secondary"
                        ></span>
                    </span>
                    Join 10,000+ Happy Patients
                </div>

                <h1
                    class="text-5xl lg:text-7xl font-bold text-[#000921] leading-[1.1] animate-fade-in-up delay-100"
                >
                    Your Health, <br />
                    <span
                        class="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-[#00a8b0]"
                    >
                        Simplified
                    </span>
                    <span class="text-secondary tracking-tighter">.</span>
                </h1>

                <p
                    class="text-xl text-gray-500 max-w-xl leading-relaxed animate-fade-in-up delay-200 mx-auto lg:mx-0"
                >
                    Experience healthcare like never before. Connect with elite
                    doctors, manage your medical history, and book clinic visits
                    instantly.
                </p>

                <div
                    class="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up delay-300"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        href="/doctors"
                        className="px-8 py-4 text-lg rounded-2xl shadow-lg shadow-secondary/20"
                    >
                        Find a Doctor
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        href="/about"
                        className="px-8 py-4 text-lg rounded-2xl"
                    >
                        Learn More
                    </Button>
                </div>

                <!-- Trust Badges -->
                <div
                    class="pt-8 grid grid-cols-3 gap-6 animate-fade-in-up delay-400 max-w-md mx-auto lg:mx-0"
                >
                    <div class="space-y-1">
                        <div class="text-2xl font-bold text-[#000921]">
                            24/7
                        </div>
                        <div
                            class="text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        >
                            Support
                        </div>
                    </div>
                    <div class="border-x border-gray-100 space-y-1">
                        <div class="text-2xl font-bold text-[#000921]">
                            100%
                        </div>
                        <div
                            class="text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        >
                            Secure
                        </div>
                    </div>
                    <div class="space-y-1">
                        <div class="text-2xl font-bold text-[#000921]">1k+</div>
                        <div
                            class="text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        >
                            Doctors
                        </div>
                    </div>
                </div>
            </div>

            <!-- Image Composition -->
            <div class="relative animate-fade-in-right delay-200">
                <!-- Main Image Wrapper -->
                <div class="relative z-10 group">
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent rounded-[3rem] -rotate-3 transition-transform group-hover:rotate-0 duration-500"
                    ></div>
                    <img
                        src="/images/hero-premium.png"
                        alt="Premium Healthcare"
                        class="relative w-full h-[550px] object-cover rounded-[3rem] shadow-2xl shadow-blue-900/10 rotate-2 transition-transform group-hover:rotate-0 duration-500"
                    />
                </div>

                <!-- Floating Glassmorphism Cards -->
                <div
                    class="absolute -top-10 -right-6 z-20 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40 animate-float"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"
                        >
                            <Icon name="check" size={24} />
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-medium">
                                Appointments
                            </div>
                            <div class="text-lg font-bold text-[#000921]">
                                Verified Success
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="absolute -bottom-8 -left-8 z-20 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40 animate-float"
                    style="animation-delay: -1s"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-blue-100 text-secondary rounded-xl flex items-center justify-center"
                        >
                            <Icon name="users" size={24} />
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-medium">
                                Network
                            </div>
                            <div class="text-lg font-bold text-[#000921]">
                                Elite Specialist
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="absolute top-1/2 -right-12 -translate-y-1/2 z-0 hidden lg:block opacity-20 rotate-12"
                >
                    <Icon
                        name="activity"
                        size={200}
                        className="text-secondary"
                        strokeWidth={1}
                    />
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-15px);
        }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    /* Animations are defined in Landing.svelte global classes, 
       but we can add specific ones here if needed */
</style>
