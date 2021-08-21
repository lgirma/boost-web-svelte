<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    export let config
    export let value
    export let row

    const _str = globalThis.c('string-utils')
</script>

{#if config.template}
    {@html config.template(value, row)}
{:else if value == null}
{:else}
    {#if config.type === 'tel' && !_str.isEmpty(value)}
        <a href="tel:{value}">{value}</a> <a href="sms:{value}"><FaIcon key="comment" /></a>
    {:else if config.type === 'checkbox'}
        {#if value}<FaIcon key="check" />{/if}
    {:else if config.type === 'email' && !_str.isEmpty(value)}
        <a href="mailto:{value}">{value}</a>
    {:else}
        {value}
    {/if}
{/if}