<script>
  import Link from "$lib/Link.svelte";
  import Button from "$components/Button.svelte";
  import { user, logout } from "$lib/store";
  import { navigate } from "$lib/router.js";

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
    isMenuOpen = false;
  }
</script>

<nav
  class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 py-4"
>
  <div class="container mx-auto px-4 flex justify-between items-center">
    <div class="flex-shrink-0">
      <Link to="/" class="text-2xl font-bold text-gray-900">
        Medi<span class="text-primary">Connect</span>
      </Link>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center gap-8">
      <Link
        to="/"
        class="font-medium text-gray-700 hover:text-primary transition-colors"
        >Home</Link
      >
      <Link
        to="/doctors"
        class="font-medium text-gray-700 hover:text-primary transition-colors"
        >Find Doctors</Link
      >
      <Link
        to="/about"
        class="font-medium text-gray-700 hover:text-primary transition-colors"
        >About</Link
      >
    </div>

    <div class="hidden md:flex items-center gap-4">
      {#if $user}
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-700">Hi, {$user.name}</span
          >
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      {:else}
        <Link
          to="/login"
          class="font-medium text-primary hover:text-primary-dark transition-colors"
          >Login</Link
        >
        <Button variant="primary" href="/register">Get Started</Button>
      {/if}
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="md:hidden p-2 text-gray-700 hover:text-primary focus:outline-none"
      on:click={toggleMenu}
      aria-label="Toggle menu"
    >
      <div class="w-6 h-5 relative flex flex-col justify-between">
        <span
          class="w-full h-0.5 bg-current rounded-full transition-all duration-300 {isMenuOpen
            ? 'rotate-45 translate-y-2'
            : ''}"
        ></span>
        <span
          class="w-full h-0.5 bg-current rounded-full transition-all duration-300 {isMenuOpen
            ? 'opacity-0'
            : ''}"
        ></span>
        <span
          class="w-full h-0.5 bg-current rounded-full transition-all duration-300 {isMenuOpen
            ? '-rotate-45 -translate-y-2.5'
            : ''}"
        ></span>
      </div>
    </button>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div
      class="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg p-4 flex flex-col gap-4"
    >
      <Link
        to="/"
        class="block py-2 font-medium text-gray-700 hover:text-primary"
        on:click={toggleMenu}>Home</Link
      >
      <Link
        to="/doctors"
        class="block py-2 font-medium text-gray-700 hover:text-primary"
        on:click={toggleMenu}>Find Doctors</Link
      >
      <Link
        to="/about"
        class="block py-2 font-medium text-gray-700 hover:text-primary"
        on:click={toggleMenu}>About</Link
      >
      <div class="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-100">
        {#if $user}
          <div
            class="py-2 text-center font-medium text-gray-900 bg-gray-50 rounded"
          >
            Signed in as {$user.name}
          </div>
          <Button variant="outline" fullWidth onClick={handleLogout}
            >Logout</Button
          >
        {:else}
          <Link
            to="/login"
            class="text-center font-medium text-primary hover:text-primary-dark py-2"
            on:click={toggleMenu}>Login</Link
          >
          <Button
            variant="primary"
            href="/register"
            fullWidth
            onClick={toggleMenu}>Get Started</Button
          >
        {/if}
      </div>
    </div>
  {/if}
</nav>
