<script>
    import Button from "$ui/Button.svelte";
    import Link from "$features/routing/Link.svelte";
    import { user, login } from "$lib/store";
    import { navigate } from "$features/routing/router";

    let email = "";
    let password = "";
    let showPassword = false;
    let isLoading = false;
    let errorMessage = "";

    $: if ($user && $user.role) {
        const targetPath =
            $user.role === "doctor"
                ? "/doctor-dashboard"
                : "/patient-dashboard";
        if (window.location.pathname !== targetPath) {
            navigate(targetPath, { replace: true });
        }
    }

    async function handleLogin() {
        isLoading = true;
        errorMessage = "";

        try {
            const result = await login(email, password);

            if (result.success) {
                if (result.role) {
                    const targetPath =
                        result.role === "doctor"
                            ? "/doctor-dashboard"
                            : "/patient-dashboard";
                    navigate(targetPath, { replace: true });
                }
            } else {
                errorMessage =
                    result.error ||
                    "Login failed. Please check your credentials.";
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
        class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200"
    >
        <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p class="mt-2 text-sm text-gray-600">
                Don't have an account?
                <Link
                    to="/register"
                    class="font-medium text-primary hover:text-primary-dark transition-colors"
                >
                    Sign up for free
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

        <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
            <div class="space-y-4">
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
                        placeholder="you@example.com"
                    />
                </div>
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
                            autocomplete="current-password"
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
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label
                        for="remember-me"
                        class="ml-2 block text-sm text-gray-700 cursor-pointer"
                    >
                        Remember me
                    </label>
                </div>

                <div class="text-sm">
                    <a
                        href="/forgot-password"
                        class="font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                        Forgot password?
                    </a>
                </div>
            </div>

            <div>
                <Button
                    variant="primary"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>
            </div>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500"
                        >Or continue with</span
                    >
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <Button variant="outline" fullWidth>Google</Button>
                <Button variant="outline" fullWidth>Apple</Button>
            </div>
        </form>
    </div>
</div>
