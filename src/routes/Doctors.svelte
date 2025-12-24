<script>
    import DoctorCard from "$features/doctors/DoctorCard.svelte";
    import { doctors } from "$features/doctors/data";
    import Card from "$ui/Card.svelte";
    import Input from "$ui/Input.svelte";
    import Select from "$ui/Select.svelte";
    import searchIcon from "$assets/icons/search.svg";

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

<div class="min-h-screen bg-slate-50 pt-28 sm:pt-36 pb-8 sm:pb-12">
    <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h1
                class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            >
                Find a Specialist
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Browse our extensive list of verified specialists and book your
                appointment today.
            </p>
        </div>

        <!-- Search & Filter -->
        <Card
            className="max-w-4xl mx-auto mb-8 sm:mb-12 flex flex-col gap-4 animate-fade-in-up"
            padding="p-4 sm:p-6"
            hoverEffect={false}
        >
            <Input
                bind:value={searchQuery}
                icon={searchIcon}
                placeholder="Search doctors, location..."
                className="flex-1 w-full"
            />
            <Select
                bind:value={selectedSpecialty}
                options={specialties}
                className="w-full"
            />
        </Card>

        {#if filteredDoctors.length > 0}
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up"
                style="animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards;"
            >
                {#each filteredDoctors as doctor (doctor.id)}
                    <DoctorCard {doctor} />
                {/each}
            </div>
        {:else}
            <div class="text-center py-20 animate-fade-in-up">
                <div class="mb-4 text-gray-300 flex justify-center">
                    <img src={searchIcon} alt="" class="w-16 h-16" />
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
