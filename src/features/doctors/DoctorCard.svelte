<script>
    import Button from "$ui/Button.svelte";
    import Link from "$features/routing/Link.svelte";
    import Card from "$ui/Card.svelte";
    import Icon from "$ui/Icon.svelte";
    import { getDoctorRatingStats } from "$features/doctors/reviews";

    export let doctor;

    $: ratingStats = getDoctorRatingStats(
        doctor.id,
        doctor.rating,
        doctor.reviews,
    );
</script>

<Card padding="p-0" className="group h-full flex flex-col">
    <div
        class="h-48 bg-gradient-to-br from-blue-50 to-blue-100 relative flex items-center justify-center overflow-hidden"
    >
        {#if doctor.profilePic}
            <img
                src={doctor.profilePic}
                alt={doctor.name}
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        {:else}
            <div
                class="text-primary/40 transform group-hover:scale-110 transition-transform duration-300"
            >
                <Icon name="user-md" size={64} />
            </div>
        {/if}
    </div>
    <div class="p-6 flex-1 flex flex-col">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3
                    class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors"
                >
                    {doctor.name}
                </h3>
                <p class="text-primary font-medium">{doctor.specialty}</p>
            </div>
            <span
                class="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded"
            >
                <Icon
                    name="star"
                    size={16}
                    fill="currentColor"
                    className="text-amber-500"
                />
                {ratingStats.rating}
            </span>
        </div>

        <div class="space-y-2 mb-6 flex-1">
            <div class="flex items-center gap-2 text-gray-500 text-sm">
                <Icon name="map-pin" size={16} />
                {doctor.location}
            </div>
            <div class="flex items-center gap-2 text-gray-500 text-sm">
                <Icon name="message-circle" size={16} />
                {ratingStats.count} Reviews
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <Link
                to="/doctor/{doctor.id}"
                class="flex items-center justify-center px-4 py-2 border border-blue-200 text-primary rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
                View Profile
            </Link>
            <Button variant="primary" href="/doctor/{doctor.id}" size="sm"
                >Book Now</Button
            >
        </div>
    </div>
</Card>
