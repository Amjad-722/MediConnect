<script>
    import { onMount, onDestroy } from "svelte";
    import { testimonials } from "$lib/data.js";
    import Icon from "$components/reusable/Icon.svelte";

    let currentIndex = 0;
    let autoRotateInterval;

    // Auto-rotate every 5 seconds
    onMount(() => {
        autoRotateInterval = setInterval(() => {
            next();
        }, 5000);
    });

    onDestroy(() => {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    });

    function next() {
        currentIndex = (currentIndex + 1) % testimonials.length;
    }

    function prev() {
        currentIndex =
            (currentIndex - 1 + testimonials.length) % testimonials.length;
    }

    function goToSlide(index) {
        currentIndex = index;
    }

    // Get position class for each card
    function getCardPosition(index) {
        const diff = index - currentIndex;
        if (diff === 0) return "center";
        if (diff === 1 || diff === -(testimonials.length - 1)) return "right";
        if (diff === -1 || diff === testimonials.length - 1) return "left";
        return "hidden";
    }
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

        <!-- Carousel Container -->
        <div class="relative max-w-6xl mx-auto">
            <!-- Cards Container -->
            <div class="relative h-[500px] sm:h-[450px] lg:h-[400px]">
                {#each testimonials as testimonial, i}
                    {@const position = getCardPosition(i)}
                    {@const isCenter = position === "center"}
                    {@const isSide =
                        position === "left" || position === "right"}
                    {@const isHidden = position === "hidden"}
                    {@const translateX =
                        position === "center"
                            ? "-50%"
                            : position === "left"
                              ? "calc(-50% - 280px)"
                              : position === "right"
                                ? "calc(-50% + 280px)"
                                : "-50%"}
                    <div
                        class="absolute top-1/2 left-1/2 w-full max-w-md sm:max-w-lg transition-all duration-700 ease-out -translate-y-1/2
                        {isCenter ? 'opacity-100 scale-105 z-30' : ''}
                        {isSide ? 'opacity-50 scale-90 blur-sm z-20' : ''}
                        {isHidden ? 'opacity-0 scale-75 blur-md z-10' : ''}
                        {!isCenter ? 'pointer-events-none' : ''}"
                        style="transform: translateX({translateX}) translateY(-50%); z-index: {isCenter
                            ? 30
                            : isSide
                              ? 20
                              : 10};"
                    >
                        <div
                            class="relative p-6 sm:p-8 lg:p-10 bg-white rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 transition-shadow duration-700
                            {isCenter
                                ? 'shadow-[0_20px_60px_rgb(0,0,0,0.2)]'
                                : 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]'}"
                        >
                            <!-- Quote Ornament -->
                            <div
                                class="hidden sm:block absolute top-6 sm:top-8 right-6 sm:right-8 text-gray-100 z-0"
                            >
                                <Icon
                                    name="activity"
                                    size={60}
                                    strokeWidth={0.5}
                                />
                            </div>

                            <div class="relative z-10">
                                <div
                                    class="flex gap-1 mb-6 sm:mb-8 text-amber-400"
                                >
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
                    </div>
                {/each}
            </div>

            <!-- Navigation Arrows -->
            <button
                on:click={prev}
                class="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#000921] hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Previous testimonial"
            >
                <Icon name="chevron-down" size={24} className="rotate-90" />
            </button>
            <button
                on:click={next}
                class="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#000921] hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Next testimonial"
            >
                <Icon name="chevron-down" size={24} className="-rotate-90" />
            </button>

            <!-- Dots Navigation -->
            <div class="flex justify-center gap-2 mt-8 sm:mt-12">
                {#each testimonials as _, i}
                    <button
                        on:click={() => goToSlide(i)}
                        class="w-2 h-2 rounded-full transition-all duration-300"
                        class:bg-secondary={i === currentIndex}
                        class:w-8={i === currentIndex}
                        class:bg-gray-300={i !== currentIndex}
                        aria-label="Go to testimonial {i + 1}"
                    ></button>
                {/each}
            </div>
        </div>
    </div>
</section>
