<script>
    import Button from "$ui/Button.svelte";
    import Link from "$features/routing/Link.svelte";
    import { login } from "$lib/store";
    import { navigate } from "$features/routing/router";

    let email = "";
    let password = "";
    let isLoading = false;
    let errorMessage = "";

    async function handleLogin() {
        isLoading = true;
        errorMessage = "";

        try {
            const result = await login(email, password);

            if (result.success) {
                // Determine redirect based on role
                // The user store will be updated by the store's internal listener
                // We'll wait a bit for the store to update or we can check the result
                if (result.user) {
                    // We need to know the role to redirect correctly
                    // For now, redirect to home which will handle routing based on user state
                    navigate("/", { replace: true });
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
                    <input
                        id="password"
                        name="password"
                        type="password"
                        bind:value={password}
                        autocomplete="current-password"
                        required
                        class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                        placeholder="••••••••"
                    />
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
