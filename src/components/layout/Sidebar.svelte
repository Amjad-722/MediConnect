<script>
    import { onMount } from "svelte";
    import { currentPath, navigate } from "$features/routing/router";
    import Link from "$features/routing/Link.svelte";
    import Icon from "$ui/Icon.svelte";
    import { user, logout } from "$lib/store";

    export let userRole = "patient"; // 'doctor' | 'patient'
    export let isOpen = true;

    // Navigation items based on user role
    const doctorNavItems = [
        { path: "/", label: "Home", icon: "home", section: "main" },
        {
            path: "/doctors",
            label: "Find Doctors",
            icon: "search",
            section: "main",
        },
        {
            path: "/doctor-dashboard",
            label: "Dashboard",
            icon: "grid",
            section: "dashboard",
        },
        {
            path: "/doctor-dashboard#appointments",
            label: "Appointments",
            icon: "calendar",
            section: "dashboard",
        },
        {
            path: "/doctor-dashboard#messages",
            label: "Messages",
            icon: "message-circle",
            section: "dashboard",
        },
        {
            path: "/doctor-dashboard#prescriptions",
            label: "Prescriptions",
            icon: "file-text",
            section: "dashboard",
        },
        {
            path: "/profile",
            label: "Profile Settings",
            icon: "settings",
            section: "dashboard",
        },
    ];

    const patientNavItems = [
        { path: "/", label: "Home", icon: "home", section: "main" },
        {
            path: "/doctors",
            label: "Find Doctors",
            icon: "search",
            section: "main",
        },
        {
            path: "/patient-dashboard",
            label: "Dashboard",
            icon: "grid",
            section: "dashboard",
        },
        {
            path: "/patient-dashboard#appointments",
            label: "My Appointments",
            icon: "calendar",
            section: "dashboard",
        },
        {
            path: "/patient-dashboard#messages",
            label: "Messages",
            icon: "message-circle",
            section: "dashboard",
        },
        {
            path: "/patient-dashboard#prescriptions",
            label: "Prescriptions",
            icon: "file-text",
            section: "dashboard",
        },
        {
            path: "/profile",
            label: "Profile Settings",
            icon: "settings",
            section: "dashboard",
        },
    ];

    $: navItems = userRole === "doctor" ? doctorNavItems : patientNavItems;
    $: mainNavItems = navItems.filter((item) => item.section === "main");
    $: dashboardNavItems = navItems.filter(
        (item) => item.section === "dashboard",
    );

    const isBrowser = typeof window !== "undefined";
    let currentHash = isBrowser ? window.location.hash : "";

    // Check if a nav item is active
    function isActive(path) {
        // If path has a hash, check for exact match with currentHash
        if (path.includes("#")) {
            const [base, itemHash] = path.split("#");
            return $currentPath === base && currentHash === "#" + itemHash;
        }

        // For dashboard root, only match if no hash is present or if it's the specific base path
        if (path === "/doctor-dashboard" || path === "/patient-dashboard") {
            return (
                $currentPath === path &&
                (currentHash === "" || currentHash === "#")
            );
        }

        return (
            $currentPath === path ||
            ($currentPath.startsWith(path + "/") && path !== "/")
        );
    }

    // Toggle sidebar
    function toggleSidebar() {
        isOpen = !isOpen;
        // Persist state in localStorage
        localStorage.setItem("sidebarOpen", isOpen.toString());
    }

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    // Load sidebar state from localStorage
    onMount(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        if (savedState !== null) {
            isOpen = savedState === "true";
        }

        // Auto-collapse on mobile
        if (window.innerWidth < 768) {
            isOpen = false;
        }

        // Listen for hash changes to update active state
        const handleHashChange = () => {
            currentHash = window.location.hash;
        };
        window.addEventListener("hashchange", handleHashChange);

        // Also listen for pushState/replaceState via currentPath store or custom events if needed
        // But since Link uses navigate which updates currentPath, that's fine for the path part.

        return () => window.removeEventListener("hashchange", handleHashChange);
    });
</script>

<aside
    class="fixed left-0 top-0 h-full bg-[#000921] text-white transition-all duration-300 ease-in-out z-40 shadow-2xl"
    class:w-64={isOpen}
    class:w-20={!isOpen}
>
    <!-- Branding Header -->
    <div class="px-4 py-6 border-b border-white/5">
        <Link to="/">
            <div class="flex items-center gap-3 cursor-pointer group">
                <!-- Logo Icon -->
                <div
                    class="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                >
                    <Icon
                        name="activity"
                        size={24}
                        className="text-[#000921]"
                    />
                </div>
                <!-- App Name -->
                {#if isOpen}
                    <div class="transition-opacity duration-200">
                        <h1 class="text-lg font-bold text-white">
                            Medi<span class="text-secondary">Connect</span>
                        </h1>
                        <p
                            class="text-[10px] text-white/40 uppercase tracking-widest"
                        >
                            Healthcare Platform
                        </p>
                    </div>
                {/if}
            </div>
        </Link>
    </div>

    <!-- Toggle Button (Small and Sleek) -->
    <button
        on:click={toggleSidebar}
        class="absolute -right-3 top-20 bg-primary text-white rounded-full p-1.5 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-white hover:text-primary z-50 border-2 border-[#000921]"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
        <Icon
            name={isOpen ? "panel-left-close" : "panel-left-open"}
            size={16}
            className="transition-transform duration-300"
        />
    </button>

    <!-- Navigation Items -->
    <nav class="px-3 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
        <!-- Main Navigation -->
        {#if isOpen}
            <div
                class="px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest"
            >
                Main
            </div>
        {/if}
        {#each mainNavItems as item}
            <Link to={item.path}>
                <div
                    class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden {isActive(
                        item.path,
                    )
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'}"
                >
                    <!-- Icon -->
                    <div class="flex-shrink-0 relative z-10">
                        <Icon
                            name={item.icon}
                            size={20}
                            className={isActive(item.path)
                                ? "text-white"
                                : "text-white/40 group-hover:text-white"}
                        />
                    </div>

                    <!-- Label -->
                    {#if isOpen}
                        <span
                            class="font-bold text-sm whitespace-nowrap transition-opacity duration-200"
                        >
                            {item.label}
                        </span>
                    {/if}
                </div>
            </Link>
        {/each}

        <!-- Separator -->
        <div class="my-6 mx-4 border-t border-white/5"></div>

        <!-- Dashboard Navigation -->
        {#if isOpen}
            <div
                class="px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest"
            >
                Dashboard
            </div>
        {/if}
        {#each dashboardNavItems as item}
            <Link to={item.path}>
                <div
                    class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden {isActive(
                        item.path,
                    )
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'}"
                >
                    <!-- Icon -->
                    <div class="flex-shrink-0 relative z-10">
                        <Icon
                            name={item.icon}
                            size={20}
                            className={isActive(item.path)
                                ? "text-white"
                                : "text-white/40 group-hover:text-white"}
                        />
                    </div>

                    <!-- Label -->
                    {#if isOpen}
                        <span
                            class="font-bold text-sm whitespace-nowrap transition-opacity duration-200"
                        >
                            {item.label}
                        </span>
                    {/if}
                </div>
            </Link>
        {/each}
    </nav>

    <!-- Sidebar Footer -->
    <div class="absolute bottom-6 left-0 right-0 px-4 space-y-2">
        <!-- Logout Section (Now above Profile) -->
        <button
            on:click={handleLogout}
            class="w-full flex items-center {isOpen
                ? 'gap-3 px-4'
                : 'justify-center px-0'} py-3 text-sm font-bold text-red-400 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-400/20"
        >
            <Icon name="log-out" size={20} />
            {#if isOpen}
                <span>Sign Out</span>
            {/if}
        </button>

        <!-- User Profile Section at Very Bottom -->
        {#if $user}
            <div class="px-2 py-4 border-t border-white/5">
                <div
                    class="flex items-center {isOpen
                        ? 'gap-3'
                        : 'justify-center'}"
                >
                    {#if $user.profilePic}
                        <img
                            src={$user.profilePic}
                            alt={$user.name}
                            class="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                        />
                    {:else}
                        <div
                            class="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-lg"
                        >
                            {$user.name.charAt(0).toUpperCase()}
                        </div>
                    {/if}

                    {#if isOpen}
                        <div class="overflow-hidden">
                            <p class="text-xs font-bold text-white truncate">
                                {$user.name}
                            </p>
                            <p
                                class="text-[10px] text-white/50 truncate uppercase tracking-tighter"
                            >
                                {$user.role}
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        {#if isOpen}
            <div
                class="text-center text-[9px] text-white/20 uppercase tracking-tighter pt-1"
            >
                <p>MediConnect v1.0</p>
            </div>
        {/if}
    </div>
</aside>

<!-- Overlay for mobile when sidebar is open -->
{#if isOpen}
    <div
        class="fixed inset-0 bg-[#000921]/60 backdrop-blur-sm z-30 md:hidden"
        on:click={toggleSidebar}
        on:keydown={(e) => e.key === "Escape" && toggleSidebar()}
        role="button"
        tabindex="0"
        aria-label="Close sidebar"
    ></div>
{/if}

<style>
    /* Smooth transitions */
    aside {
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Custom scrollbar for navigation */
    nav {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    }

    nav::-webkit-scrollbar {
        width: 4px;
    }

    nav::-webkit-scrollbar-track {
        background: transparent;
    }

    nav::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
    }
</style>
