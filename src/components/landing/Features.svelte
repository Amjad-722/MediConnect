<script>
    import { features } from "$lib/data.js";
</script>

<section class="py-24 bg-white">
    <div class="container mx-auto px-4">
        <h2
            class="text-center text-4xl lg:text-5xl font-bold text-primary-dark mb-4"
        >
            Why Choose MediConnect?
        </h2>
        <p class="text-center text-lg text-gray-500 mb-16">
            Experience healthcare that puts you first
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each features as feature}
                <div
                    class="group relative p-10 bg-white rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,80,157,0.15)] hover:border-primary-light overflow-hidden"
                >
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    ></div>
                    <div
                        class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary-light group-hover:to-secondary group-hover:rotate-[10deg] group-hover:scale-110"
                    >
                        <div class="text-4xl">{feature.icon}</div>
                    </div>
                    <h3 class="text-xl font-semibold text-primary mb-4">
                        {feature.title}
                    </h3>
                    <p class="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
