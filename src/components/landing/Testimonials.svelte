<script>
    import { testimonials } from "$lib/data.js";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section class="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
    <!-- Subtle Gradient Ornament -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"
    ></div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <div
            class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up"
        >
            <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000921] mb-4 sm:mb-6"
            >
                Voices of <span class="text-secondary">Trust</span>
            </h2>
            <p
                class="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed px-4"
            >
                Join thousands of satisfied patients who have experienced the
                MediConnect difference.
            </p>
        </div>

        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
        >
            {#each testimonials as testimonial, i}
                <div
                    class="relative p-6 sm:p-8 lg:p-10 bg-white rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-900/10 animate-fade-in-up"
                    style="animation-delay: {i * 150}ms"
                >
                    <!-- Quote Ornament -->
                    <div
                        class="hidden sm:block absolute top-6 sm:top-8 right-6 sm:right-8 text-gray-100 z-0"
                    >
                        <Icon name="activity" size={60} strokeWidth={0.5} />
                    </div>

                    <div class="relative z-10">
                        <div class="flex gap-1 mb-6 sm:mb-8 text-amber-400">
                            {#each Array(5) as _}
                                <Icon
                                    name="star"
                                    size={16}
                                    fill="currentColor"
                                />
                            {/each}
                        </div>

                        <p
                            class="text-lg sm:text-xl leading-relaxed text-[#000921] font-medium italic mb-8 sm:mb-10"
                        >
                            "{testimonial.text}"
                        </p>

                        <div class="flex items-center gap-3 sm:gap-4">
                            <div class="relative">
                                <img
                                    src={testimonial.img}
                                    alt={testimonial.name}
                                    class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover ring-4 ring-blue-50"
                                />
                                <div
                                    class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-secondary rounded-full border-2 border-white flex items-center justify-center"
                                >
                                    <Icon
                                        name="check"
                                        size={8}
                                        className="text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                            </div>
                            <div>
                                <div
                                    class="text-[#000921] font-bold text-base sm:text-lg leading-tight"
                                >
                                    {testimonial.name}
                                </div>
                                <div
                                    class="text-xs sm:text-sm font-semibold text-secondary uppercase tracking-wider mt-1 opacity-80"
                                >
                                    {testimonial.role}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
