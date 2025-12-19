<script>
  /** @type {"button" | "submit" | "reset"} */
  export let type = "button";
  export let variant = "primary"; /* primary, secondary, outline, ghost */
  export let disabled = false;
  export let fullWidth = false;
  export let href = null;
  export let onClick = null;

  export let className = "";
  export let size = "md"; /* sm, md, lg, xl */

  import { navigate } from "$lib/router.js";

  function handleClick(e) {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
    if (href) {
      e.preventDefault();
      navigate(href);
    }
  }

  $: baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 border-2 border-transparent cursor-pointer leading-none disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95";

  $: sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  }[size];

  $: variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30",
    secondary:
      "bg-secondary text-white hover:brightness-90 hover:shadow-lg hover:shadow-secondary/30",
    outline:
      "bg-transparent border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100 hover:text-primary",
  }[variant];

  $: widthClass = fullWidth ? "w-full" : "";
  $: classes = `${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`;
</script>

{#if href}
  <a {href} class={classes} {...$$restProps} on:click={handleClick}>
    <slot />
  </a>
{:else}
  <button
    {type}
    class={classes}
    {disabled}
    {...$$restProps}
    on:click={handleClick}
  >
    <slot />
  </button>
{/if}
