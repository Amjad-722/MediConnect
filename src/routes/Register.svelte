<script>
    import Button from "$components/Button.svelte";
    import Link from "$lib/Link.svelte";
    import { login } from "$lib/store";
    import { navigate } from "$lib/router.js";

    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let isLoading = false;

    async function handleRegister() {
        isLoading = true;
        await new Promise((resolve) => setTimeout(resolve, 800));

        login(email, { name: `${firstName} ${lastName}` });
        navigate("/", { replace: true });
        isLoading = false;
    }
</script>

<div
    class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50"
>
    <div
        class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200"
    >
        <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
            <p class="mt-2 text-sm text-gray-600">
                Already have an account?
                <Link
                    to="/login"
                    class="font-medium text-primary hover:text-primary-dark transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
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
                        autocomplete="new-password"
                        required
                        class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                        placeholder="••••••••"
                    />
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
                        href="/terms"
                        class="text-primary hover:underline">Terms of Service</a
                    >
                    and
                    <a href="/privacy" class="text-primary hover:underline"
                        >Privacy Policy</a
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
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
            </div>
        </form>
    </div>
</div>
