<script>
    import Button from "$ui/Button.svelte";
    import Link from "$features/routing/Link.svelte";
    import { signup } from "$lib/store";
    import { navigate } from "$features/routing/router";

    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let showPassword = false;
    let showConfirmPassword = false;
    let specialty = "";
    let licenseNumber = "";
    let isLoading = false;
    let errorMessage = "";

    const specialties = [
        "Cardiologist",
        "Dermatologist",
        "Pediatrician",
        "Neurologist",
        "Orthopedic Surgeon",
        "Ophthalmologist",
        "General Practitioner",
        "Dentist",
    ];

    async function handleRegister() {
        if (password !== confirmPassword) {
            errorMessage = "Passwords do not match";
            return;
        }

        isLoading = true;
        errorMessage = "";

        try {
            const result = await signup(email, password, {
                name: `Dr. ${firstName} ${lastName}`,
                role: "doctor",
                specialty,
                licenseNumber,
            });

            if (result.success) {
                navigate("/profile", { replace: true });
            } else {
                errorMessage =
                    result.error || "Registration failed. Please try again.";
            }
        } catch (error) {
            errorMessage = "An unexpected error occurred. Please try again.";
            console.error(error);
        } finally {
            isLoading = false;
        }
    }
</script>

<div
    class="min-h-[80vh] flex items-center justify-center pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50"
>
    <div
        class="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200"
    >
        <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Join as a Doctor</h2>
            <p class="mt-2 text-sm text-gray-600">
                Partner with MediConnect to reach more patients.
                <Link
                    to="/login"
                    class="font-medium text-primary hover:text-primary-dark transition-colors"
                >
                    Already have an account? Sign in
                </Link>
            </p>
        </div>

        {#if errorMessage}
            <div
                class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200"
                role="alert"
            >
                <span class="font-medium">Error!</span>
                {errorMessage}
            </div>
        {/if}

        <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="first-name"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >First name</label
                        >
                        <input
                            id="first-name"
                            name="first-name"
                            type="text"
                            bind:value={firstName}
                            required
                            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label
                            for="last-name"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Last name</label
                        >
                        <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            bind:value={lastName}
                            required
                            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Email address</label
                    >
                    <input
                        id="email"
                        name="email"
                        type="email"
                        bind:value={email}
                        autocomplete="email"
                        required
                        class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                        placeholder="doctor@clinic.com"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="specialty"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Specialty</label
                        >
                        <div class="relative">
                            <select
                                id="specialty"
                                name="specialty"
                                bind:value={specialty}
                                required
                                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm bg-white"
                            >
                                <option value="" disabled selected
                                    >Select specialty</option
                                >
                                {#each specialties as spec}
                                    <option value={spec}>{spec}</option>
                                {/each}
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                            >
                                <svg
                                    class="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    ><path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    /></svg
                                >
                            </div>
                        </div>
                    </div>
                    <div>
                        <label
                            for="license"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Medical License #</label
                        >
                        <input
                            id="license"
                            name="license"
                            type="text"
                            bind:value={licenseNumber}
                            required
                            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                            placeholder="LIC-123456"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Password</label
                        >
                        <div class="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                bind:value={password}
                                autocomplete="new-password"
                                required
                                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                on:click={() => (showPassword = !showPassword)}
                                aria-label={showPassword
                                    ? "Hide password"
                                    : "Show password"}
                            >
                                {#if showPassword}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        ><path
                                            d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                                        /><path
                                            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                        /><path
                                            d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                        /><line
                                            x1="2"
                                            x2="22"
                                            y1="2"
                                            y2="22"
                                        /></svg
                                    >
                                {:else}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        ><path
                                            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"
                                        /><circle cx="12" cy="12" r="3" /></svg
                                    >
                                {/if}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label
                            for="confirm-password"
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Confirm Password</label
                        >
                        <div class="relative">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                bind:value={confirmPassword}
                                autocomplete="new-password"
                                required
                                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                on:click={() =>
                                    (showConfirmPassword =
                                        !showConfirmPassword)}
                                aria-label={showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"}
                            >
                                {#if showConfirmPassword}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        ><path
                                            d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                                        /><path
                                            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                        /><path
                                            d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                        /><line
                                            x1="2"
                                            x2="22"
                                            y1="2"
                                            y2="22"
                                        /></svg
                                    >
                                {:else}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        ><path
                                            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"
                                        /><circle cx="12" cy="12" r="3" /></svg
                                    >
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    required
                />
                <label
                    for="terms"
                    class="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                    I agree to the <a
                        href="/provider-terms"
                        class="text-primary hover:underline">Provider Terms</a
                    >
                    and
                    <a
                        href="/hipaa-compliance"
                        class="text-primary hover:underline"
                        >HIPAA Compliance Policy</a
                    >
                </label>
            </div>

            <div>
                <Button
                    variant="primary"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Creating Provider Account..."
                        : "Join as Provider"}
                </Button>
            </div>
        </form>
    </div>
</div>
