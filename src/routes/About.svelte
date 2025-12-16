<script>
    import Button from "../components/Button.svelte";
</script>

<div class="min-h-screen bg-white">
    <!-- Header -->
    <div
        class="bg-primary/5 bg-gradient-to-br from-blue-50 to-white py-20 relative overflow-hidden"
    >
        <div class="container mx-auto px-4 text-center relative z-10">
            <h1 class="text-5xl font-bold mb-6 text-primary-dark">
                About MediConnect
            </h1>
            <p class="text-xl max-w-2xl mx-auto text-gray-600">
                Revolutionizing healthcare accessibility through technology and
                compassion.
            </p>
        </div>
    </div>

    <!-- Mission -->
    <div class="py-20 container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-16 items-center">
            <div class="space-y-6">
                <h2 class="text-3xl font-bold text-gray-900">Our Mission</h2>
                <div class="space-y-4 text-lg text-gray-600 leading-relaxed">
                    <p>
                        At MediConnect, we believe that quality healthcare
                        should be accessible to everyone, everywhere. Our
                        platform bridges the gap between patients and
                        world-class medical professionals.
                    </p>
                    <p>
                        Founded in 2023, we've helped over 10,000 patients find
                        the right care and manage their health journey with
                        ease. Our commitment to privacy, security, and user
                        experience sets us apart in the digital health
                        landscape.
                    </p>
                </div>
                <div class="pt-4">
                    <Button variant="primary" href="/register"
                        >Join Our Community</Button
                    >
                </div>
            </div>

            <div class="relative">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-100 to-teal-50 rounded-3xl transform rotate-3"
                ></div>
                <div
                    class="relative bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                >
                    <div class="grid grid-cols-2 gap-6">
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-4xl font-bold text-primary mb-2">
                                10k+
                            </div>
                            <div class="text-sm font-medium text-gray-600">
                                Active Patients
                            </div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-4xl font-bold text-secondary mb-2">
                                500+
                            </div>
                            <div class="text-sm font-medium text-gray-600">
                                Specialists
                            </div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div
                                class="text-4xl font-bold text-primary-dark mb-2"
                            >
                                98%
                            </div>
                            <div class="text-sm font-medium text-gray-600">
                                Satisfaction
                            </div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-4xl font-bold text-green-600 mb-2">
                                24/7
                            </div>
                            <div class="text-sm font-medium text-gray-600">
                                Support
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
