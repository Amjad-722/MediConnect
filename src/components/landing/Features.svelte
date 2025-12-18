<script>
    import { features } from "$lib/data.js";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section class="relative py-32 overflow-hidden bg-white">
    <!-- Subtle Background Decoration -->
    <div class="absolute inset-0 z-0 pointer-events-none">
        <div
            class="absolute top-1/2 left-[10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px]"
        ></div>
        <div
            class="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"
        ></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
            <h2
                class="text-4xl lg:text-5xl font-bold text-[#000921] mb-6 leading-tight"
            >
                Healthcare that <span class="text-secondary"
                    >Moves with You</span
                >
            </h2>
            <p class="text-xl text-gray-500 leading-relaxed">
                Experience a platform designed to simplify your medical journey
                with cutting-edge technology and a patient-first approach.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each features as feature, i}
                <div
                    class="group relative p-10 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-secondary/30 animate-fade-in-up"
                    style="animation-delay: {i * 100}ms"
                >
                    <!-- Hover Accent -->
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"
                    ></div>

                    <div class="relative z-10">
                        <div
                            class="w-20 h-20 rounded-2xl bg-white shadow-lg shadow-blue-900/5 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-secondary group-hover:scale-110 group-hover:rotate-[15deg]"
                        >
                            <div
                                class="text-secondary group-hover:text-white transition-colors duration-500"
                            >
                                <Icon
                                    name={feature.icon}
                                    size={36}
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        <h3 class="text-2xl font-bold text-[#000921] mb-4">
                            {feature.title}
                        </h3>
                        <p class="text-gray-500 leading-relaxed text-lg mb-6">
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
