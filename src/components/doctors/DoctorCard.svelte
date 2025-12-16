<script>
    import Button from "$components/Button.svelte";
    import Link from "$lib/Link.svelte";
    export let doctor;
</script>

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
                ⭐ {doctor.rating}
            </span>
        </div>

        <div class="space-y-2 mb-6">
            <div class="flex items-center gap-2 text-gray-500 text-sm">
                <span>📍</span>
                {doctor.location}
            </div>
            <div class="flex items-center gap-2 text-gray-500 text-sm">
                <span>💬</span>
                {doctor.reviews} Reviews
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
</div>
