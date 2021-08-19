<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    export let config
    export let value
    export let row
</script>

{#if config.template}
    {@html config.template(value, row)}
{:else if value == null}
{:else}
    {#if config.type === 'tel'}
        <a href="tel:{value}">{value}</a>
    {:else if config.type === 'checkbox'}
        {#if value}<FaIcon key="check" />{/if}
    {:else if config.type === 'email'}
        <a href="mailto:{value}">{value}</a>
    {:else}
        {value}
    {/if}
{/if}