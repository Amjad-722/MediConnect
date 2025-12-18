<script>
    import { steps } from "$lib/data.js";
</script>

<section class="py-32 bg-slate-50 relative overflow-hidden">
    <!-- Animated Decoration -->
    <div
        class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -mr-40 -mt-40"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-20">
            <h2 class="text-4xl lg:text-5xl font-bold text-[#000921] mb-6">
                Simple. Fast. <span class="text-secondary">Secured.</span>
            </h2>
            <p class="text-xl text-gray-500 leading-relaxed">
                We've streamlined the entire process so you can focus on what
                matters most: your health.
            </p>
        </div>

        <div class="relative">
            <!-- Continuous Line (Desktop) -->
            <div
                class="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0"
            >
                <div
                    class="absolute inset-0 bg-gradient-to-r from-secondary to-[#00a8b0] origin-left animate-timeline-grow"
                ></div>
            </div>

            <div
                class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative z-10"
            >
                {#each steps as step, i}
                    <div
                        class="text-center group flex flex-col items-center animate-fade-in-up"
                        style="animation-delay: {i * 200}ms"
                    >
                        <!-- Glowing Number -->
                        <div class="relative mb-8">
                            <div
                                class="absolute inset-0 bg-secondary/30 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-500"
                            ></div>
                            <div
                                class="w-24 h-24 rounded-full bg-white shadow-xl shadow-blue-900/5 flex items-center justify-center text-3xl font-black text-secondary border-4 border-white relative z-10 transition-all duration-500 group-hover:bg-secondary group-hover:text-white group-hover:-translate-y-2"
                            >
                                {step.num}
                            </div>
                        </div>

                        <h3 class="text-2xl font-bold text-[#000921] mb-4">
                            {step.title}
                        </h3>
                        <p
                            class="text-gray-500 leading-relaxed text-lg max-w-sm"
                        >
                            {step.desc}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    @keyframes timeline-grow {
        from {
            transform: scaleX(0);
        }
        to {
            transform: scaleX(1);
        }
    }

    .animate-timeline-grow {
        animation: timeline-grow 2s ease-out forwards;
    }
</style>
