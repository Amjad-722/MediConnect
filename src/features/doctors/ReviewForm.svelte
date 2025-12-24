<script>
    import { user } from "$lib/store";
    import { addReview } from "$features/doctors/reviews";
    import Icon from "$ui/Icon.svelte";
    import Button from "$ui/Button.svelte";

    export let doctorId;

    let rating = 0;
    let hoverRating = 0;
    let comment = "";
    let isSubmitting = false;
    let showSuccess = false;

    function handleStarClick(value) {
        rating = value;
    }

    function handleStarHover(value) {
        hoverRating = value;
    }

    function handleSubmit() {
        if (rating === 0) return alert("Please select a rating");
        if (!comment.trim()) return alert("Please write a comment");

        isSubmitting = true;

        addReview({
            doctorId,
            patientName: $user.name,
            rating,
            comment,
        });

        // Reset form
        setTimeout(() => {
            isSubmitting = false;
            showSuccess = true;
            rating = 0;
            comment = "";

            setTimeout(() => {
                showSuccess = false;
            }, 3000);
        }, 600);
    }
</script>

<div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>

    {#if !$user}
        <div class="text-center py-4">
            <p class="text-gray-600 mb-4">Please log in to leave a review.</p>
            <Button variant="outline" onClick={() => navigate("/login")}
                >Log In</Button
            >
        </div>
    {:else if showSuccess}
        <div
            class="flex flex-col items-center justify-center py-6 text-center animate-fade-in"
        >
            <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4"
            >
                <Icon name="check" size={32} />
            </div>
            <h4 class="text-lg font-bold text-gray-900">Review Submitted!</h4>
            <p class="text-gray-600">Thank you for your feedback.</p>
        </div>
    {:else}
        <div class="space-y-6">
            <!-- Star Rating Selection -->
            <div>
                <p class="text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                </p>
                <div class="flex gap-1">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            type="button"
                            class="text-2xl transition-all transform hover:scale-110 focus:outline-none"
                            on:click={() => handleStarClick(star)}
                            on:mouseenter={() => handleStarHover(star)}
                            on:mouseleave={() => handleStarHover(0)}
                        >
                            <Icon
                                name="star"
                                size={28}
                                className={star <= (hoverRating || rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"}
                            />
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Comment Area -->
            <div>
                <label
                    for="comment"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Your Review</label
                >
                <textarea
                    id="comment"
                    rows="4"
                    bind:value={comment}
                    placeholder="Share your experience with this doctor..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition-all bg-white"
                ></textarea>
            </div>

            <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Post Review"}
            </Button>
        </div>
    {/if}
</div>

<style>
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
