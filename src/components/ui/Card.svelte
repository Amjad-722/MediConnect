<script>
    export let className = "";
    export let padding = "p-6";
    export let hoverEffect = true;
</script>

<div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden {hoverEffect
        ? 'hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
        : ''} {padding} {className}"
>
    <slot />
</div>
