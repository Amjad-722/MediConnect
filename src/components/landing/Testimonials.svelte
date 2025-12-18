<script>
    import { testimonials } from "$lib/data.js";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section class="py-32 bg-white relative overflow-hidden">
    <!-- Subtle Gradient Ornament -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
            <h2 class="text-4xl lg:text-5xl font-bold text-[#000921] mb-6">
                Voices of <span class="text-secondary">Trust</span>
            </h2>
            <p class="text-xl text-gray-500 leading-relaxed">
                Join thousands of satisfied patients who have experienced the
                MediConnect difference.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {#each testimonials as testimonial, i}
                <div
                    class="relative p-10 bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-900/10 animate-fade-in-up"
                    style="animation-delay: {i * 150}ms"
                >
                    <!-- Quote Ornament -->
                    <div class="absolute top-8 right-8 text-gray-100 z-0">
                        <Icon name="activity" size={80} strokeWidth={0.5} />
                    </div>

                    <div class="relative z-10">
                        <div class="flex gap-1 mb-8 text-amber-400">
                            {#each Array(5) as _}
                                <Icon
                                    name="star"
                                    size={18}
                                    fill="currentColor"
                                />
                            {/each}
                        </div>

                        <p
                            class="text-xl leading-relaxed text-[#000921] font-medium italic mb-10"
                        >
                            "{testimonial.text}"
                        </p>

                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <img
                                    src={testimonial.img}
                                    alt={testimonial.name}
                                    class="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-50"
                                />
                                <div
                                    class="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-white flex items-center justify-center"
                                >
                                    <Icon
                                        name="check"
                                        size={10}
                                        className="text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                            </div>
                            <div>
                                <div
                                    class="text-[#000921] font-bold text-lg leading-tight"
                                >
                                    {testimonial.name}
                                </div>
                                <div
                                    class="text-sm font-semibold text-secondary uppercase tracking-wider mt-1 opacity-80"
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
