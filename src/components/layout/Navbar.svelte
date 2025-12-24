<script>
  import Link from "$features/routing/Link.svelte";
  import Button from "$ui/Button.svelte";
  import menuIcon from "$assets/icons/menu.svg";
  import xIcon from "$assets/icons/x.svg";
  import userIcon from "$assets/icons/user.svg";
  import chevronDownIcon from "$assets/icons/chevron-down.svg";
  import settingsIcon from "$assets/icons/settings.svg";
  import logOutIcon from "$assets/icons/log-out.svg";
  import { user, logout, isSignupModalOpen } from "$lib/store";
  import Icon from "$ui/Icon.svelte";
  import { navigate } from "$features/routing/router";
  import { notifications } from "$features/reminders/notifications";
  import NotificationList from "$features/reminders/NotificationList.svelte";

  let isMenuOpen = false;
  let isProfileMenuOpen = false;
  let isNotificationsOpen = false;

  $: unreadCount = $notifications.filter((n) => !n.read).length;

  function toggleNotifications(event) {
    if (event) event.stopPropagation();
    isNotificationsOpen = !isNotificationsOpen;
    if (isNotificationsOpen) {
      isProfileMenuOpen = false;
      isMenuOpen = false;
    }
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      isProfileMenuOpen = false; // Close profile menu if mobile menu opens
    }
  }

  function toggleProfileMenu(event) {
    if (event) event.stopPropagation();
    isProfileMenuOpen = !isProfileMenuOpen;
    if (isProfileMenuOpen) {
      isMenuOpen = false; // Close mobile menu if profile menu opens
    }
  }

  function closeProfileMenu() {
    isProfileMenuOpen = false;
  }

  function handleOutsideClick(event) {
    // Handle Profile Menu
    if (isProfileMenuOpen) {
      const profileMenu = document.getElementById("profile-menu");
      const profileButton = document.getElementById("profile-button");
      if (
        profileMenu &&
        !profileMenu.contains(event.target) &&
        profileButton &&
        !profileButton.contains(event.target)
      ) {
        closeProfileMenu();
      }
    }

    // Handle Notifications Menu
    if (isNotificationsOpen) {
      const notifyMenu = document.getElementById("notification-dropdown");
      const notifyButton = document.getElementById("notification-button");
      if (
        notifyMenu &&
        !notifyMenu.contains(event.target) &&
        notifyButton &&
        !notifyButton.contains(event.target)
      ) {
        isNotificationsOpen = false;
      }
    }
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
    isMenuOpen = false;
    isProfileMenuOpen = false; // Close profile menu on logout
  }
</script>

<svelte:window on:click={handleOutsideClick} />

<nav class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
  <div
    class="bg-[#000921]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
  >
    <!-- Logo with Circular Background -->
    <div class="flex-shrink-0 flex items-center gap-3">
      <div
        class="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg group transition-transform hover:scale-105"
      >
        <Link to="/" class="flex items-center justify-center">
          <Icon name="activity" size={24} className="text-[#000921]" />
        </Link>
      </div>
      <Link
        to="/"
        class="hidden sm:block text-xl font-bold text-white tracking-tight"
      >
        Medi<span class="text-secondary">Connect</span>
      </Link>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center gap-10">
      <Link
        to="/"
        class="text-sm font-semibold text-white/80 hover:text-white transition-all hover:scale-105"
        >Home</Link
      >
      <Link
        to="/doctors"
        class="text-sm font-semibold text-white/80 hover:text-white transition-all hover:scale-105"
        >Find Doctors</Link
      >
      <Link
        to="/about"
        class="text-sm font-semibold text-white/80 hover:text-white transition-all hover:scale-105"
        >About</Link
      >
    </div>

    <div class="flex items-center gap-4">
      {#if $user && $user.role === "doctor"}
        <Link
          to="/doctor-dashboard"
          class="hidden sm:block text-xs font-bold text-secondary uppercase tracking-widest hover:text-white transition-colors"
          >Dashboard</Link
        >
      {:else if $user && $user.role === "patient"}
        <Link
          to="/patient-dashboard"
          class="hidden sm:block text-xs font-bold text-secondary uppercase tracking-widest hover:text-white transition-colors"
          >Dashboard</Link
        >
      {/if}

      {#if $user}
        <div class="relative">
          <Button
            id="notification-button"
            variant="ghost"
            size="sm"
            onClick={toggleNotifications}
            className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full relative min-w-0"
          >
            <Icon name="bell" size={20} />
            {#if unreadCount > 0}
              <span
                class="absolute top-1 right-1 w-4 h-4 bg-secondary text-[#000921] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#000921]"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            {/if}
          </Button>

          {#if isNotificationsOpen}
            <div id="notification-dropdown" class="absolute right-0 mt-4 z-50">
              <NotificationList onClose={() => (isNotificationsOpen = false)} />
            </div>
          {/if}
        </div>

        <div class="relative">
          <button
            id="profile-button"
            on:click={toggleProfileMenu}
            class="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 p-1 pr-3 rounded-full transition-all border border-white/5"
          >
            {#if $user.profilePic}
              <img
                src={$user.profilePic}
                alt={$user.name}
                class="w-8 h-8 rounded-full object-cover border border-white/20"
              />
            {:else}
              <div
                class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[#000921] font-bold text-sm"
              >
                {$user.name.charAt(0).toUpperCase()}
              </div>
            {/if}
            <span class="hidden sm:block text-sm font-medium text-white/90"
              >{$user.name.split(" ")[0]}</span
            >
            <Icon
              name="chevron-down"
              size={14}
              className="text-white/50 transition-transform {isProfileMenuOpen
                ? 'rotate-180'
                : ''}"
            />
          </button>

          {#if isProfileMenuOpen}
            <div
              id="profile-menu"
              role="menu"
              tabindex="-1"
              class="absolute right-0 mt-4 w-72 bg-[#000921] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-2xl"
            >
              <!-- Profile Header -->
              <div
                class="px-5 py-4 flex items-center gap-3 border-b border-white/5 mb-2"
              >
                {#if $user.profilePic}
                  <img
                    src={$user.profilePic}
                    alt={$user.name}
                    class="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                {:else}
                  <div
                    class="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xl"
                  >
                    {$user.name.charAt(0).toUpperCase()}
                  </div>
                {/if}
                <div class="overflow-hidden">
                  <p class="font-bold text-white truncate">
                    {$user.name}
                  </p>
                  <p class="text-xs text-white/50 truncate">{$user.email}</p>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="px-2 space-y-1">
                <Link
                  to="/profile"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-all"
                  on:click={closeProfileMenu}
                >
                  <Icon name="user" size={18} className="text-secondary/60" />
                  My Profile
                </Link>

                {#if $user.role === "doctor"}
                  <Link
                    to="/doctor-dashboard"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-all"
                    on:click={closeProfileMenu}
                  >
                    <Icon name="grid" size={18} className="text-secondary/60" />
                    Doctor Dashboard
                  </Link>
                {:else if $user.role === "patient"}
                  <Link
                    to="/patient-dashboard"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/70 rounded-xl hover:bg-white/5 hover:text-white transition-all"
                    on:click={closeProfileMenu}
                  >
                    <Icon name="grid" size={18} className="text-secondary/60" />
                    Patient Dashboard
                  </Link>
                {/if}
              </div>

              <!-- Logout -->
              <div class="border-t border-white/5 mt-2 pt-2 px-2">
                <button
                  on:click={handleLogout}
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
                >
                  <Icon name="log-out" size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <div class="flex items-center bg-white rounded-full p-1 shadow-sm">
          <Link
            to="/login"
            class="hidden sm:block px-6 py-2 text-sm font-bold text-[#000921] transition-opacity hover:opacity-70"
            >Login</Link
          >
          <button
            on:click={() => isSignupModalOpen.set(true)}
            class="bg-[#000921] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>
      {/if}

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 text-white/80 hover:text-white focus:outline-none transition-colors"
        on:click={toggleMenu}
        aria-label="Toggle menu"
      >
        <Icon name={isMenuOpen ? "x" : "menu"} size={26} />
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div
      class="md:hidden absolute top-full left-0 right-0 mt-4 bg-[#000921]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <Link
        to="/"
        class="block py-4 px-5 font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
        on:click={toggleMenu}>Home</Link
      >
      <Link
        to="/doctors"
        class="block py-4 px-5 font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
        on:click={toggleMenu}>Find Doctors</Link
      >
      <Link
        to="/about"
        class="block py-4 px-5 font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
        on:click={toggleMenu}>About</Link
      >

      <div class="mt-4 pt-4 border-t border-white/5 space-y-4">
        {#if $user}
          {#if $user.role === "doctor"}
            <Link
              to="/doctor-dashboard"
              class="block py-4 px-5 font-bold text-center text-[#000921] bg-secondary rounded-2xl transition-all"
              on:click={toggleMenu}>Doctor Dashboard</Link
            >
          {:else if $user.role === "patient"}
            <Link
              to="/patient-dashboard"
              class="block py-4 px-5 font-bold text-center text-[#000921] bg-secondary rounded-2xl transition-all"
              on:click={toggleMenu}>Patient Dashboard</Link
            >
          {/if}
          <Link
            to="/profile"
            class="block py-4 px-5 font-bold text-center text-white/80 border border-white/10 rounded-2xl transition-all mt-2"
            on:click={toggleMenu}>My Profile</Link
          >
          <button
            on:click={handleLogout}
            class="w-full py-4 text-center font-bold text-red-400 bg-red-400/10 rounded-2xl border border-red-400/20 active:scale-95 transition-transform"
          >
            Sign Out
          </button>
        {:else}
          <Link
            to="/login"
            class="block py-4 px-5 font-bold text-center text-white/90 border border-white/10 rounded-2xl active:scale-95 transition-transform"
            on:click={toggleMenu}>Login</Link
          >
          <button
            on:click={() => {
              toggleMenu();
              isSignupModalOpen.set(true);
            }}
            class="w-full py-4 font-bold text-center text-[#000921] bg-white rounded-2xl shadow-xl active:scale-95 transition-transform"
          >
            Get Started
          </button>
        {/if}
      </div>
    </div>
  {/if}
</nav>
