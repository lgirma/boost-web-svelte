<script>
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
    {:else}
        {value}
    {/if}
{/if}