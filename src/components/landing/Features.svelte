<script>
    import { features } from "$lib/data.js";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section class="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-white">
    <!-- Subtle Background Decoration -->
    <div class="absolute inset-0 z-0 pointer-events-none">
        <div
            class="hidden lg:block absolute top-1/2 left-[10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px]"
        ></div>
        <div
            class="hidden lg:block absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"
        ></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <div
            class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up"
        >
            <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000921] mb-4 sm:mb-6 leading-tight"
            >
                Healthcare that <span class="text-secondary"
                    >Moves with You</span
                >
            </h2>
            <p
                class="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed px-4"
            >
                Experience a platform designed to simplify your medical journey
                with cutting-edge technology and a patient-first approach.
            </p>
        </div>

        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
            {#each features as feature, i}
                <div
                    class="group relative p-6 sm:p-8 lg:p-10 bg-white backdrop-blur-md rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgb(0,0,0,0.2)] hover:border-secondary/30 animate-fade-in-up"
                    style="animation-delay: {i * 100}ms"
                >
                    <!-- Hover Accent -->
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem]"
                    ></div>

                    <div class="relative z-10">
                        <div
                            class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-white shadow-lg shadow-blue-900/5 flex items-center justify-center mb-6 sm:mb-8 transition-all duration-500 group-hover:bg-secondary group-hover:scale-110 group-hover:rotate-[15deg]"
                        >
                            <div
                                class="text-secondary group-hover:text-white transition-colors duration-500"
                            >
                                <Icon
                                    name={feature.icon}
                                    size={32}
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        <h3
                            class="text-xl sm:text-2xl font-bold text-[#000921] mb-3 sm:mb-4"
                        >
                            {feature.title}
                        </h3>
                        <p
                            class="text-gray-500 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6"
                        >
                            {feature.desc}
                        </p>

                        <div
                            class="flex items-center gap-2 text-secondary font-semibold text-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                        >
                            Learn more
                            <Icon name="arrow-right" size={16} />
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
