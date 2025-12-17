<script>
    import Icon from "./Icon.svelte";

    export let type = "text";
    export let value = "";
    export let placeholder = "";
    export let icon = "";
    export let className = "";
    export let required = false;
    export let name = "";
    export let label = "";
</script>

<div class="w-full relative {className}">
    {#if label}
        <label for={name} class="block text-sm font-medium text-gray-700 mb-1"
            >{label}</label
        >
    {/if}
    <div class="relative">
        {#if icon}
            <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
                <Icon name={icon} size={20} />
            </span>
        {/if}
        <input
            {type}
            bind:value
            {placeholder}
            {required}
            {name}
            id={name}
            class="w-full {icon
                ? 'pl-10'
                : 'pl-4'} pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700"
            on:input
            on:change
        />
    </div>
</div>
