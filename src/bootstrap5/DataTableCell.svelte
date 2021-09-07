<script>
    import StaticValue from './StaticValue.svelte'
    export let config
    export let value
    export let row

</script>

{#if config.template}
    {@html config.template(value, row)}
{:else}
    <StaticValue {value} type={config.type} choices={config.choices} max={config.max} />
{/if}