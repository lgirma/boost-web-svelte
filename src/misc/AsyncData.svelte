<script>
    export let dataRoot
    export let data = root => root

    const _i18n = globalThis.c('i18n')
</script>

<svelte:fragment>
    {#if dataRoot}
        <slot>
            {data(dataRoot)}
        </slot>
    {:else}
        {_i18n._('LOADING')}...
    {/if}
</svelte:fragment>