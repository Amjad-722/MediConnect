<script>
    import chevronDown from "../../assets/icons/chevron-down.svg";

    export let value = "";
    export let options = []; // Array of {value, label} or strings
    export let placeholder = "";
    export let label = "";
    export let className = "";
    export let name = "";
</script>

<div class="w-full relative {className}">
    {#if label}
        <label for={name} class="block text-sm font-medium text-gray-700 mb-1"
            >{label}</label
        >
    {/if}
    <div class="relative">
        <select
            bind:value
            id={name}
            {name}
            class="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-gray-700 pr-10"
            on:change
        >
            {#if placeholder}
                <option value="" disabled selected>{placeholder}</option>
            {/if}
            {#each options as option}
                {#if typeof option === "object"}
                    <option value={option.value}>{option.label}</option>
                {:else}
                    <option value={option}>{option}</option>
                {/if}
            {/each}
        </select>
        <div
            class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
        >
            <img src={chevronDown} alt="" class="w-5 h-5" />
        </div>
    </div>
</div>
