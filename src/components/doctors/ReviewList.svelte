<script>
    import { reviews } from "$lib/reviews";
    import Icon from "$components/reusable/Icon.svelte";

    export let doctorId;

    $: doctorReviews = $reviews.filter(
        (r) => String(r.doctorId) === String(doctorId),
    );

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-bold text-gray-900">
            Reviews
            <span class="text-sm font-normal text-gray-500 ml-2"
                >({doctorReviews.length})</span
            >
        </h3>
    </div>

    {#if doctorReviews.length === 0}
        <div
            class="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center"
        >
            <div
                class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300"
            >
                <Icon name="star" size={24} />
            </div>
            <p class="text-gray-500 italic">
                No reviews yet. Be the first to leave one!
            </p>
        </div>
    {:else}
        {#each doctorReviews as review (review.id)}
            <div
                class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold"
                        >
                            {review.patientName.charAt(0)}
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900">
                                {review.patientName}
                            </h4>
                            <p class="text-xs text-gray-400">
                                {formatDate(review.date)}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-0.5">
                        {#each Array(5) as _, i}
                            <Icon
                                name="star"
                                size={14}
                                className={i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-200"}
                            />
                        {/each}
                    </div>
                </div>
                <p class="text-gray-600 leading-relaxed">
                    {review.comment}
                </p>
            </div>
        {/each}
    {/if}
</div>
