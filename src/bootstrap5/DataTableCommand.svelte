<script>
    //import {Button} from 'sveltestrap'
    import {FaIcon} from "../fontawesome5";

    export let command
    export let selectedRows

    const _str = globalThis.c('string-utils')
    const _confirm = globalThis.c('confirm-dialog')
    const _i18n = globalThis.c('i18n')

    async function onCommandInvoke() {
        if (command.condition && !command.condition(selectedRows))
            return
        if (command.confirm && !await _confirm.showAsync(null, _i18n._('ITEMS_SELECTED', selectedRows.length)))
            return
        command.invoke(selectedRows)
    }
</script>

{#if command.linkTo != null}
    <a href={command.linkTo} class="{command.class} mb-2" style={command.style}>
        {#if command.iconKey}
            <FaIcon key={command.iconKey} />
        {/if}
        <span class="d-md-inline d-none">{_str.humanized_i18n(command.id || command.label)}</span>
    </a>&nbsp;
{:else}
    <button on:click={onCommandInvoke} class="{command.class} mb-2" style={command.style}>
        {#if command.iconKey}
            <FaIcon key={command.iconKey} />
        {/if}
        <span class="d-md-inline d-none">{_str.humanized_i18n(command.id || command.label)}</span>
    </button>&nbsp;
{/if}