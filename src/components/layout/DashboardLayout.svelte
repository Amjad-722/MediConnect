<script>
    import Sidebar from "./Sidebar.svelte";
    import { onMount } from "svelte";

    export let userRole = "patient"; // 'doctor' | 'patient'

    let sidebarOpen = true;

    // Load sidebar state from localStorage
    onMount(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        if (savedState !== null) {
            sidebarOpen = savedState === "true";
        }

        // Auto-collapse on mobile
        if (window.innerWidth < 768) {
            sidebarOpen = false;
        }
    });
</script>

<div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <Sidebar {userRole} bind:isOpen={sidebarOpen} />

    <!-- Main Content Area -->
    <main
        class="flex-1 transition-all duration-300 ease-in-out"
        class:ml-64={sidebarOpen}
        class:ml-20={!sidebarOpen}
    >
        <slot />
    </main>
</div>

<style>
    /* Smooth transition for content shift */
    main {
        transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Mobile responsive - no margin on small screens */
    @media (max-width: 768px) {
        main {
            margin-left: 0 !important;
        }
    }
</style>
