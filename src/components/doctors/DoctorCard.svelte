<script>
    import Button from "$components/Button.svelte";
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
                <span class="text-yellow-400 mr-1 text-sm">★</span>
                <span class="font-bold text-gray-700 text-sm"
                    >{doctor.rating}</span
                >
                <span class="text-gray-400 text-xs ml-1"
                    >({doctor.reviews})</span
                >
            </div>
        </div>
        <p class="text-gray-500 text-sm mb-6 flex items-center gap-1">
            <span>📍</span>
            {doctor.location}
        </p>
        <div class="grid grid-cols-2 gap-3">
            <Button variant="outline" fullWidth>Profile</Button>
            <Button variant="primary" fullWidth>Book</Button>
        </div>
    </div>
</div>
