<script>
  import Link from "$lib/Link.svelte";
  import Button from "$components/Button.svelte";
  import { user, logout } from "$lib/store";
  import { navigate } from "$lib/router.js";

  let isMenuOpen = false;
  let isProfileMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      isProfileMenuOpen = false; // Close profile menu if mobile menu opens
    }
  }

  function toggleProfileMenu() {
    isProfileMenuOpen = !isProfileMenuOpen;
    if (isProfileMenuOpen) {
      isMenuOpen = false; // Close mobile menu if profile menu opens
    }
  }

  function closeProfileMenu() {
    isProfileMenuOpen = false;
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
    isMenuOpen = false;
    isProfileMenuOpen = false; // Close profile menu on logout
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
      {#if $user && $user.role === "doctor"}
        <Link
          to="/doctor-dashboard"
          class="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >Dashboard</Link
        >
      {:else if !$user}
        <Link
          to="/doctor-register"
          class="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >For Doctors</Link
        >
      {/if}
      {#if $user}
        <div class="relative">
          <button
            on:click={toggleProfileMenu}
            class="flex items-center gap-2 focus:outline-none"
          >
            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-transparent hover:border-primary/20 transition-all"
            >
              {$user.name.charAt(0).toUpperCase()}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-gray-500 transition-transform duration-200 {isProfileMenuOpen
                ? 'rotate-180'
                : ''}"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {#if isProfileMenuOpen}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              on:mouseleave={closeProfileMenu}
            >
              <div class="px-4 py-3 border-b border-gray-50">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {$user.name}
                </p>
                <p class="text-xs text-gray-500 truncate">{$user.email}</p>
              </div>

              <div class="py-1">
                <Link
                  to="/profile"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                  on:click={closeProfileMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </Link>
                <Link
                  to="/settings"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                  on:click={closeProfileMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 1-1.72v-.51a2 2 0 0 1-1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Settings
                </Link>
              </div>

              <div class="border-t border-gray-50 py-1">
                <button
                  on:click={handleLogout}
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          {/if}
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
