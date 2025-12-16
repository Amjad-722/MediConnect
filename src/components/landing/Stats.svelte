<script>
    import { onMount } from "svelte";
    import { stats as initialStats } from "$lib/data.js";

    let statsVisible = false;
    let stats = [...initialStats];

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !statsVisible) {
                    statsVisible = true;
                    animateStats();
                }
            });
        });

        const statsSection = document.querySelector(".stats");
        if (statsSection) {
            observer.observe(statsSection);
        }

        return () => observer.disconnect();
    });

    function animateStats() {
        stats.forEach((stat, index) => {
            const duration = 2000;
            const steps = 60;
            const increment = stat.target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    stats[index].value = stat.target;
                    clearInterval(timer);
                } else {
                    stats[index].value = Math.floor(current);
                }
                stats = [...stats];
            }, duration / steps);
        });
    }
</script>

<section
    class="stats py-20 bg-gradient-to-br from-primary-dark to-primary text-white"
>
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
            {#each stats as stat}
                <div class="text-center">
                    <div
                        class="text-5xl lg:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-100"
                    >
                        {stat.value}{stat.suffix}
                    </div>
                    <div class="text-lg opacity-90">{stat.label}</div>
                </div>
            {/each}
        </div>
    </div>
</section>
