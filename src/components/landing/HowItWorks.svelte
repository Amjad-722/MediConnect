<script>
    import { steps } from "$lib/data.js";
</script>

<section class="py-24 bg-gradient-to-b from-white to-slate-50">
    <div class="container mx-auto px-4">
        <h2
            class="text-center text-4xl lg:text-5xl font-bold text-primary-dark mb-4"
        >
            How It Works
        </h2>
        <p class="text-center text-lg text-gray-500 mb-16">
            Get started in three simple steps
        </p>
        <div class="flex flex-wrap justify-center gap-8 mt-16">
            {#each steps as step, i}
                <div
                    class="flex-1 min-w-[250px] max-w-[300px] text-center group relative"
                >
                    <div
                        class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-2xl font-bold shadow-[0_10px_30px_rgba(0,80,157,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]"
                    >
                        {step.num}
                    </div>
                    <h3 class="text-2xl font-semibold text-primary-dark mb-3">
                        {step.title}
                    </h3>
                    <p class="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {#if i < 2}
                    <div
                        class="hidden lg:block w-24 h-0.5 mt-10 bg-gradient-to-r from-primary-light to-secondary relative after:content-['→'] after:absolute after:-right-4 after:-top-3 after:text-secondary after:text-2xl"
                    ></div>
                {/if}
            {/each}
        </div>
    </div>
</section>
