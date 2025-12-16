<script>
    // @ts-nocheck

    import { currentPath } from "./router.js";
    export let path;
    export let component = null;

    $: match = $currentPath === path;
</script>

{#if match}
    {#if component}
        <svelte:component this={component} />
    {:else}
        <slot />
    {/if}
{/if}
