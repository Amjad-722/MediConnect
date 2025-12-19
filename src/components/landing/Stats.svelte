<script>
    import { onMount } from "svelte";
    import { stats as initialStats } from "$lib/data.js";

    let statsVisible = false;
    let stats = initialStats.map((s) => ({ ...s, value: 0 }));

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !statsVisible) {
                        statsVisible = true;
                        animateStats();
                    }
                });
            },
            { threshold: 0.5 },
        );

        const statsSection = document.querySelector(".stats-section");
        if (statsSection) {
            observer.observe(statsSection);
        }

        return () => observer.disconnect();
    });

    function animateStats() {
        stats.forEach((stat, index) => {
            const duration = 2500;
            const startTime = performance.now();
            const target = stat.target;

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);

                stats[index].value = Math.floor(easeOut * target);
                stats = [...stats];

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }
</script>

<section
    class="stats-section py-16 sm:py-20 lg:py-24 bg-[#000921] relative overflow-hidden"
>
    <!-- Glowing Accent -->
    <div
        class="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[300px] bg-secondary/5 rounded-full blur-[120px]"
    ></div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-20">
            {#each stats as stat}
                <div class="text-center group">
                    <div
                        class="text-4xl sm:text-5xl lg:text-7xl font-black mb-3 sm:mb-4 tracking-tighter transition-all duration-500 group-hover:scale-110"
                    >
                        <span
                            class="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-blue-200"
                        >
                            {stat.value}{stat.suffix}
                        </span>
                    </div>
                    <div
                        class="text-xs sm:text-sm font-bold text-secondary uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                        {stat.label}
                    </div>
                    <!-- Subtle underline accent -->
                    <div
                        class="mt-4 h-1 w-8 bg-white/10 mx-auto rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full w-full bg-secondary -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                        ></div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
