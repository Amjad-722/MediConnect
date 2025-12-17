<script>
    import { onMount } from "svelte";
    import { currentPath } from "./router.js";

    // svelte-ignore export_let_unused
    export let url = undefined; // Compatibility prop

    onMount(() => {
        const handlePopState = () => {
            currentPath.set(window.location.pathname);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    });
</script>

<slot />
