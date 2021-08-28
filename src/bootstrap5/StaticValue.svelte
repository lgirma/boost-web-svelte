<script>
    import FaIcon from '../fontawesome5/Icon.svelte'

    const _str = globalThis.c('string-utils')
    const _i18n = globalThis.c('i18n')

    export let value
    export let type
    export let max = 5
    export let choices = []
</script>

{#if value == null}
    -
{:else}
    {#if type === 'tel' && !_str.isEmpty(value)}
        <a href="tel:{value}">{value}</a> <a href="sms:{value}"><FaIcon key="sms" /></a>
    {:else if type === 'checkbox'}
        {value ? _i18n._('YES') : _i18n._('NO')}
    {:else if type === 'rating'}
        {#each new Array(max || 5).fill(0) as i}
            <span class="boost-star">{value > i ? '★' : '☆'}</span>
        {/each}
    {:else if type === 'email' && !_str.isEmpty(value)}
        <a href="mailto:{value}">{value}</a>
    {:else if type === 'select' && value != null}
        {choices.find(c => c.key === value).val}
    {:else if type === 'radio' && value != null}
        {choices.find(c => c.key === value).val}
    {:else if type === 'date' && !_str.isEmpty(value)}
        {new Date(value).toLocaleDateString()}
    {:else if type === 'datetime' && !_str.isEmpty(value)}
        {new Date(value).toLocaleTimeString()}
    {:else if _str.isEmpty(value)}
        -
    {:else}
        {value}
    {/if}
{/if}