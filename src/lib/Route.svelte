<script>
    import { currentPath } from "./router.js";
    export let path;
    export let component = null;

    let params = {};

    $: {
        if (path.includes(":")) {
            const pathSegments = path.split("/");
            const currentSegments = $currentPath.split("/");

            if (pathSegments.length === currentSegments.length) {
                let isMatch = true;
                let newParams = {};

                for (let i = 0; i < pathSegments.length; i++) {
                    if (pathSegments[i].startsWith(":")) {
                        const paramName = pathSegments[i].slice(1);
                        newParams[paramName] = currentSegments[i];
                    } else if (pathSegments[i] !== currentSegments[i]) {
                        isMatch = false;
                        break;
                    }
                }

                match = isMatch;
                params = newParams;
            } else {
                match = false;
                params = {};
            }
        } else {
            match = $currentPath === path;
            params = {};
        }
    }

    let match = false;
</script>

{#if match}
    {#if component}
        <svelte:component this={component} {...params} />
    {:else}
        <slot />
    {/if}
{/if}
