<script>
    import {Button, ButtonGroup, Input} from 'sveltestrap'
    import FaIcon from '../fontawesome5/Icon.svelte'

    const _i18n = globalThis.c('i18n')

    export let filter
    export let pagination
    export let refresh
    export let pageCount
</script>

<ButtonGroup>
    <Button outline color="secondary" disabled={!pagination.canGoFirst} on:click={() => filter = {...filter, currentPage: 0}}>
        <FaIcon key="step-backward" /> <span class="d-none d-md-inline">{_i18n._('FIRST')}</span>
    </Button>
    <Button outline color="secondary" disabled={!pagination.canGoPrev} on:click={() => filter = {...filter, currentPage: filter.currentPage - 1}}>
        <FaIcon key="backward" /> <span class="d-none d-md-inline">{_i18n._('PREV')}</span>
    </Button>
    <Button outline color="secondary">
        <Input type="select" bind:value={filter.pageSize} class="form-select-sm">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
        </Input>
    </Button>
    <Button outline color="secondary" disabled={!pagination.canGoNext} on:click={() => filter = {...filter, currentPage: filter.currentPage + 1}}>
        <span class="d-none d-md-inline">{_i18n._('NEXT')}</span> <FaIcon key="forward" />
    </Button>
    <Button outline color="secondary" disabled={!pagination.canGoLast} on:click={() => filter = {...filter, currentPage: pageCount - 1}}>
        <span class="d-none d-md-inline">{_i18n._('LAST')}</span> <FaIcon key="step-forward" />
    </Button>
    <Button outline color="secondary" on:click={refresh}>
        <FaIcon key="undo" />
    </Button>
</ButtonGroup>