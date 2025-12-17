<script>
    import Button from "$components/reusable/Button.svelte";
</script>

<section
    class="relative py-32 pb-48 overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"
>
    <!-- Background Decoration -->
    <div
        class="absolute -top-1/2 -right-[20%] w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-secondary/15 to-transparent animate-pulse z-0"
    ></div>

    <div
        class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center relative z-10 text-center lg:text-left"
    >
        <div class="space-y-6">
            <h1
                class="text-5xl lg:text-6xl font-bold text-primary-dark leading-tight animate-fade-in-up"
            >
                Healthcare Made <span
                    class="text-transparent bg-clip-text bg-gradient-to-br from-secondary to-[#00a8b0]"
                    >Accessible</span
                >
            </h1>
            <p
                class="text-xl text-gray-500 max-w-lg leading-relaxed animate-fade-in-up delay-200 mx-auto lg:mx-0"
            >
                Connect with top doctors, book appointments, and manage your
                health records - all in one place.
            </p>
            <div
                class="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up delay-400 mb-12"
            >
                <Button variant="primary" href="/doctors">Find a Doctor</Button>
                <Button variant="outline" href="/about">Learn More</Button>
            </div>
            <div
                class="flex flex-wrap gap-12 justify-center lg:justify-start animate-fade-in-up delay-600"
            >
                <div class="flex flex-col gap-1">
                    <strong class="text-2xl font-bold text-primary">24/7</strong
                    >
                    <span class="text-sm text-gray-500">Available</span>
                </div>
                <div class="flex flex-col gap-1">
                    <strong class="text-2xl font-bold text-primary">100%</strong
                    >
                    <span class="text-sm text-gray-500">Secure</span>
                </div>
                <div class="flex flex-col gap-1">
                    <strong class="text-2xl font-bold text-primary"
                        >Instant</strong
                    >
                    <span class="text-sm text-gray-500">Booking</span>
                </div>
            </div>
        </div>
        <div class="relative animate-fade-in-right delay-300">
            <img
                src="/images/hero-doctors.png"
                alt="Healthcare professionals"
                class="w-full h-auto rounded-3xl shadow-[0_20px_60px_rgba(0,80,157,0.2)] hover:scale-[1.02] transition-transform duration-300"
            />
        </div>
    </div>

    <!-- Hero Wave -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            class="relative block w-[calc(100%+1.3px)] h-[120px]"
        >
            <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                class="fill-white opacity-25"
            ></path>
            <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                class="fill-white opacity-50"
            ></path>
            <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                class="fill-white"
            ></path>
        </svg>
    </div>
</section>

<style>
</style>
