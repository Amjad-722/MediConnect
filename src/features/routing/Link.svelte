<script>
    import { navigate } from "./router.js";
    export let to;
    export let onClick = null;

    function handleClick(e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        navigate(to);
        if (onClick) onClick(e);
    }
</script>

<a href={to} on:click={handleClick} {...$$restProps}>
    <slot />
</a>
