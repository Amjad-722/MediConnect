<script>
    import { testimonials } from "$lib/data.js";
    import Icon from "$components/reusable/Icon.svelte";
</script>

<section class="py-24 bg-white">
    <div class="container mx-auto px-4">
        <h2
            class="text-center text-4xl lg:text-5xl font-bold text-primary-dark mb-4"
        >
            What Our Patients Say
        </h2>
        <p class="text-center text-lg text-gray-500 mb-16">
            Real stories from real people
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#each testimonials as testimonial}
                <div
                    class="p-10 bg-white rounded-2xl shadow-md border-2 border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,80,157,0.15)] hover:border-secondary"
                >
                    <div class="flex gap-1 mb-6 text-amber-400">
                        {#each Array(5) as _}
                            <Icon name="star" size={20} fill="currentColor" />
                        {/each}
                    </div>
                    <p
                        class="text-lg leading-relaxed text-gray-900 italic mb-8"
                    >
                        "{testimonial.text}"
                    </p>
                    <div class="flex items-center gap-4">
                        <img
                            src={testimonial.img}
                            alt={testimonial.name}
                            class="w-16 h-16 rounded-full object-cover border-4 border-primary-light"
                        />
                        <div class="flex flex-col">
                            <strong class="text-primary-dark font-semibold"
                                >{testimonial.name}</strong
                            >
                            <span class="text-sm text-gray-500"
                                >{testimonial.role}</span
                            >
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
