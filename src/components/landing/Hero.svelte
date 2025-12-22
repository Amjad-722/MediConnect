<script>
    import Button from "$components/reusable/Button.svelte";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section
    class="relative h-[100dvh] flex items-center pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden bg-white"
>
    <!-- Animated Mesh Background -->
    <div class="absolute inset-0 z-0">
        <div
            class="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-blue-100/40 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] -mr-20 sm:-mr-30 lg:-mr-40 -mt-20 sm:-mt-30 lg:-mt-40 animate-pulse"
        ></div>
        <div
            class="absolute bottom-0 left-0 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-secondary/10 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -ml-10 sm:-ml-15 lg:-ml-20 -mb-10 sm:-mb-15 lg:-mb-20 animate-pulse"
            style="animation-delay: 2s"
        ></div>
        <div
            class="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-blue-50/50 to-transparent"
        ></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <div
            class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center h-full"
        >
            <!-- Text Content -->
            <div class="space-y-6 sm:space-y-8 text-center lg:text-left">
                <div
                    class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-secondary rounded-full text-xs sm:text-sm font-semibold animate-fade-in-up"
                >
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"
                        ></span>
                        <span
                            class="relative inline-flex rounded-full h-2 w-2 bg-secondary"
                        ></span>
                    </span>
                    <span class="hidden sm:inline"
                        >Join 10,000+ Happy Patients</span
                    >
                    <span class="sm:hidden">10,000+ Happy Patients</span>
                </div>

                <h1
                    class="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#000921] leading-[1.1] animate-fade-in-up delay-100"
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
                    class="text-base sm:text-lg lg:text-xl text-gray-500 max-w-xl leading-relaxed animate-fade-in-up delay-200 mx-auto lg:mx-0"
                >
                    Experience healthcare like never before. Connect with elite
                    doctors, manage your medical history, and book clinic visits
                    instantly.
                </p>

                <div
                    class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up delay-300"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        href="/doctors"
                        className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg shadow-secondary/20 w-full sm:w-auto"
                    >
                        Find a Doctor
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        href="/about"
                        className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl w-full sm:w-auto"
                    >
                        Learn More
                    </Button>
                </div>

                <!-- Trust Badges -->
                <div
                    class="pt-6 sm:pt-8 grid grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up delay-400 max-w-md mx-auto lg:mx-0"
                >
                    <div class="space-y-1">
                        <div
                            class="text-xl sm:text-2xl font-bold text-[#000921]"
                        >
                            24/7
                        </div>
                        <div
                            class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        >
                            Support
                        </div>
                    </div>
                    <div class="border-x border-gray-100 space-y-1">
                        <div
                            class="text-xl sm:text-2xl font-bold text-[#000921]"
                        >
                            100%
                        </div>
                        <div
                            class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        >
                            Secure
                        </div>
                    </div>
                    <div class="space-y-1">
                        <div
                            class="text-xl sm:text-2xl font-bold text-[#000921]"
                        >
                            1k+
                        </div>
                        <div
                            class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        >
                            Doctors
                        </div>
                    </div>
                </div>
            </div>

            <!-- Image Composition -->
            <div
                class="relative animate-fade-in-right delay-200 mt-12 lg:mt-0 px-4 sm:px-8"
            >
                <!-- Main Image Wrapper -->
                <div class="relative z-10 group">
                    <!-- Premium Multi-layered Shadow & Glow -->
                    <div
                        class="absolute -inset-4 bg-secondary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    ></div>
                    <div
                        class="absolute inset-0 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] -rotate-3 transition-all group-hover:rotate-0 duration-500 border border-white/40 shadow-xl"
                    ></div>
                    <img
                        src="/images/hero-premium.png"
                        alt="Premium Healthcare"
                        class="relative w-full h-[300px] sm:h-[400px] lg:h-[550px] object-cover rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,10,33,0.3),0_15px_30px_-10px_rgba(0,168,176,0.15)] rotate-2 transition-all group-hover:rotate-0 group-hover:scale-[1.02] duration-500"
                    />
                </div>

                <!-- Floating Glassmorphism Cards -->
                <div
                    class="hidden sm:block absolute -top-6 sm:-top-10 -right-4 sm:-right-6 z-20 bg-white/80 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white/40 animate-float"
                >
                    <div class="flex items-center gap-2 sm:gap-4">
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-lg sm:rounded-xl flex items-center justify-center"
                        >
                            <Icon name="check" size={20} />
                        </div>
                        <div>
                            <div
                                class="text-[10px] sm:text-xs text-gray-500 font-medium"
                            >
                                Appointments
                            </div>
                            <div
                                class="text-sm sm:text-lg font-bold text-[#000921]"
                            >
                                Verified Success
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="hidden sm:block absolute -bottom-6 sm:-bottom-8 -left-4 sm:-left-8 z-20 bg-white/80 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white/40 animate-float"
                    style="animation-delay: -1s"
                >
                    <div class="flex items-center gap-2 sm:gap-4">
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-secondary rounded-lg sm:rounded-xl flex items-center justify-center"
                        >
                            <Icon name="users" size={20} />
                        </div>
                        <div>
                            <div
                                class="text-[10px] sm:text-xs text-gray-500 font-medium"
                            >
                                Network
                            </div>
                            <div
                                class="text-sm sm:text-lg font-bold text-[#000921]"
                            >
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
