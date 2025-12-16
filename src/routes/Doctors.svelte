<script>
    import Button from "../components/Button.svelte";

    const doctors = [
        {
            id: 1,
            name: "Dr. Sarah Smith",
            specialty: "Cardiologist",
            location: "New York, NY",
            rating: 4.9,
            reviews: 120,
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Dermatologist",
            location: "San Francisco, CA",
            rating: 4.8,
            reviews: 95,
        },
        {
            id: 3,
            name: "Dr. Emily Johnson",
            specialty: "Pediatrician",
            location: "Chicago, IL",
            rating: 4.9,
            reviews: 150,
        },
        {
            id: 4,
            name: "Dr. David Wilson",
            specialty: "Neurologist",
            location: "Houston, TX",
            rating: 4.7,
            reviews: 80,
        },
        {
            id: 5,
            name: "Dr. Jessica Brown",
            specialty: "Orthopedic Surgeon",
            location: "Miami, FL",
            rating: 4.9,
            reviews: 110,
        },
        {
            id: 6,
            name: "Dr. Robert Taylor",
            specialty: "Ophthalmologist",
            location: "Seattle, WA",
            rating: 4.8,
            reviews: 90,
        },
    ];

    let searchQuery = "";
    let selectedSpecialty = "All";

    $: specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];

    $: filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty =
            selectedSpecialty === "All" ||
            doctor.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });
</script>

<div class="min-h-screen bg-slate-50 py-12">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12 animate-fade-in-up">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                Find a Specialist
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                Browse our extensive list of verified specialists and book your
                appointment today.
            </p>
        </div>

        <!-- Search & Filter -->
        <div
            class="max-w-4xl mx-auto mb-12 bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-4 animate-fade-in-up"
            style="animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards;"
        >
            <div class="flex-1 relative">
                <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >🔍</span
                >
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search doctors, location..."
                    class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700"
                />
            </div>
            <div class="w-full md:w-48 relative">
                <select
                    bind:value={selectedSpecialty}
                    class="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-gray-700 pr-10"
                >
                    {#each specialties as specialty}
                        <option value={specialty}>{specialty}</option>
                    {/each}
                </select>
                <div
                    class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                >
                    <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        ></path></svg
                    >
                </div>
            </div>
        </div>

        {#if filteredDoctors.length > 0}
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up"
                style="animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards;"
            >
                {#each filteredDoctors as doctor (doctor.id)}
                    <div
                        class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                        <div
                            class="h-48 bg-gradient-to-br from-blue-50 to-blue-100 relative flex items-center justify-center overflow-hidden"
                        >
                            <div
                                class="text-6xl transform group-hover:scale-110 transition-transform duration-300"
                            >
                                👨‍⚕️
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h3
                                        class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors"
                                    >
                                        {doctor.name}
                                    </h3>
                                    <p class="text-primary font-medium">
                                        {doctor.specialty}
                                    </p>
                                </div>
                                <div
                                    class="flex items-center bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100"
                                >
                                    <span class="text-yellow-400 mr-1 text-sm"
                                        >★</span
                                    >
                                    <span
                                        class="font-bold text-gray-700 text-sm"
                                        >{doctor.rating}</span
                                    >
                                    <span class="text-gray-400 text-xs ml-1"
                                        >({doctor.reviews})</span
                                    >
                                </div>
                            </div>
                            <p
                                class="text-gray-500 text-sm mb-6 flex items-center gap-1"
                            >
                                <span>📍</span>
                                {doctor.location}
                            </p>
                            <div class="grid grid-cols-2 gap-3">
                                <Button variant="outline" fullWidth
                                    >Profile</Button
                                >
                                <Button variant="primary" fullWidth>Book</Button
                                >
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-20 animate-fade-in-up">
                <div class="text-6xl mb-4">🤷‍♂️</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                    No doctors found
                </h3>
                <p class="text-gray-500">
                    Try adjusting your search or filters to find what you're
                    looking for.
                </p>
                <button
                    class="mt-6 text-primary font-medium hover:underline"
                    on:click={() => {
                        searchQuery = "";
                        selectedSpecialty = "All";
                    }}
                >
                    Clear all filters
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    /* Simple utility logic - class application happens in template via inline styles */
    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
    }
</style>
