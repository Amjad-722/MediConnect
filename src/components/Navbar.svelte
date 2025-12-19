<script>
  import Link from "$lib/Link.svelte";
  import Button from "$components/reusable/Button.svelte";
  import menuIcon from "../assets/icons/menu.svg";
  import xIcon from "../assets/icons/x.svg";
  import userIcon from "../assets/icons/user.svg";
  import chevronDownIcon from "../assets/icons/chevron-down.svg";
  import settingsIcon from "../assets/icons/settings.svg";
  import logOutIcon from "../assets/icons/log-out.svg";
  import { user, logout, isSignupModalOpen } from "$lib/store";
  import Icon from "$components/reusable/Icon.svelte";
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
  class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 sm:py-4"
>
  <div
    class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center"
  >
    <div class="flex-shrink-0">
      <Link to="/" class="text-xl sm:text-2xl font-bold text-gray-900">
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
      {/if}
      {#if $user}
        <div class="relative">
          <button
            on:click={toggleProfileMenu}
            class="flex items-center gap-2 focus:outline-none"
          >
            {#if $user.profilePic}
              <img
                src={$user.profilePic}
                alt={$user.name}
                class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-primary/20 transition-all"
              />
            {:else}
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-transparent hover:border-primary/20 transition-all"
              >
                {$user.name.charAt(0).toUpperCase()}
              </div>
            {/if}
            <img
              src={chevronDownIcon}
              alt=""
              class="w-4 h-4 text-gray-500 transition-transform duration-200 {isProfileMenuOpen
                ? 'rotate-180'
                : ''}"
            />
          </button>

          {#if isProfileMenuOpen}
            <div
              role="menu"
              tabindex="-1"
              class="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              on:mouseleave={closeProfileMenu}
            >
              <!-- Profile Header -->
              <div
                class="px-4 py-3 flex items-center gap-3 border-b border-gray-50 mb-1"
              >
                {#if $user.profilePic}
                  <img
                    src={$user.profilePic}
                    alt={$user.name}
                    class="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                {:else}
                  <div
                    class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-lg border border-blue-100"
                  >
                    {$user.name.charAt(0).toUpperCase()}
                  </div>
                {/if}
                <div class="overflow-hidden">
                  <p class="font-bold text-gray-900 truncate text-sm">
                    {$user.name}
                  </p>
                  <p class="text-xs text-gray-500 truncate">{$user.email}</p>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="px-2 space-y-0.5">
                <Link
                  to="/profile"
                  class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  on:click={closeProfileMenu}
                >
                  <Icon name="user" size={16} className="text-gray-400" />
                  Profile Settings
                </Link>

                {#if $user.role === "doctor"}
                  <Link
                    to="/doctor-dashboard"
                    class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    on:click={closeProfileMenu}
                  >
                    <Icon name="grid" size={16} className="text-gray-400" />
                    Dashboard
                  </Link>
                {/if}
              </div>

              <!-- Logout -->
              <div class="border-t border-gray-50 mt-1 pt-1 px-2">
                <button
                  on:click={handleLogout}
                  class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Icon name="log-out" size={16} className="text-red-400" />
                  Sign Out
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
        <Button variant="primary" onClick={() => isSignupModalOpen.set(true)}
          >Get Started</Button
        >
      {/if}
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="md:hidden p-2 text-gray-700 hover:text-primary focus:outline-none"
      on:click={toggleMenu}
      aria-label="Toggle menu"
    >
      <img src={isMenuOpen ? xIcon : menuIcon} alt="" class="w-6 h-6" />
    </button>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div
      class="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg px-4 sm:px-6 py-6 flex flex-col gap-2"
    >
      <Link
        to="/"
        class="block py-3 px-4 font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
        on:click={toggleMenu}>Home</Link
      >
      <Link
        to="/doctors"
        class="block py-3 px-4 font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
        on:click={toggleMenu}>Find Doctors</Link
      >
      <Link
        to="/about"
        class="block py-3 px-4 font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
        on:click={toggleMenu}>About</Link
      >
      <div class="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
        {#if $user}
          {#if $user.role === "doctor"}
            <Link
              to="/doctor-dashboard"
              class="block py-3 px-4 font-medium text-primary hover:bg-blue-50 rounded-lg transition-colors text-center"
              on:click={toggleMenu}>Dashboard</Link
            >
          {/if}
          <Link
            to="/profile"
            class="block py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-center"
            on:click={toggleMenu}>Profile Settings</Link
          >
          <div
            class="py-2 px-4 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded-lg"
          >
            Signed in as {$user.name}
          </div>
          <Button variant="danger" fullWidth onClick={handleLogout}
            >Sign Out</Button
          >
        {:else}
          <Link
            to="/login"
            class="block py-3 px-4 text-center font-medium text-primary hover:text-primary-dark hover:bg-blue-50 rounded-lg transition-colors"
            on:click={toggleMenu}>Login</Link
          >
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              toggleMenu();
              isSignupModalOpen.set(true);
            }}>Get Started</Button
          >
        {/if}
      </div>
    </div>
  {/if}
</nav>
