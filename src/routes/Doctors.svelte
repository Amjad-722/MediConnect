<script>
    import DoctorCard from "$components/doctors/DoctorCard.svelte";
    import { doctors } from "$lib/data.js";
    import Card from "$components/reusable/Card.svelte";
    import Input from "$components/reusable/Input.svelte";
    import Select from "$components/reusable/Select.svelte";
    import Icon from "$components/reusable/Icon.svelte";

    import { user } from "$lib/store";

    let searchQuery = "";
    let selectedSpecialty = "All";

    // Create a combined list of doctors including the logged-in user if they are a doctor
    $: allDoctors = (() => {
        /** @type {any[]} */
        let list = [...doctors];
        if ($user && $user.role === "doctor") {
            const userAsDoctor = {
                id: "me", // Special ID for the logged-in user
                name: $user.name,
                specialty: $user.specialty || "General",
                location: $user.clinicAddress || "Unknown Location",
                rating: 5.0, // New doctors start with a perfect score!
                reviews: 0,
                bio: $user.bio || "",
                education: $user.education || "",
                experience: "New",
                languages: ["English"], // Default
                about: $user.about || "",
                clinicAddress: $user.clinicAddress || "",
                availability: $user.availability || [],
                profilePic: $user.profilePic,
                bannerImage: $user.bannerImage,
            };
            // Place the logged-in user first for visibility
            list = [userAsDoctor, ...list];
        }
        return list;
    })();

    $: specialties = ["All", ...new Set(allDoctors.map((d) => d.specialty))];

    $: filteredDoctors = allDoctors.filter((doctor) => {
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
        <Card
            className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4 animate-fade-in-up"
            padding="p-4"
            hoverEffect={false}
        >
            <Input
                bind:value={searchQuery}
                icon="search"
                placeholder="Search doctors, location..."
                className="flex-1"
            />
            <Select
                bind:value={selectedSpecialty}
                options={specialties}
                className="w-full md:w-48"
            />
        </Card>

        {#if filteredDoctors.length > 0}
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up"
                style="animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards;"
            >
                {#each filteredDoctors as doctor (doctor.id)}
                    <DoctorCard {doctor} />
                {/each}
            </div>
        {:else}
            <div class="text-center py-20 animate-fade-in-up">
                <div class="text-6xl mb-4 text-gray-300 flex justify-center">
                    <Icon name="search" size={64} />
                </div>
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
