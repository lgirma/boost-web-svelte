<script>
    import {Table, Input, Pagination, ButtonGroup, Button} from 'sveltestrap'
    import DataTableCell from "./DataTableCell.svelte";
    import FaIcon from '../fontawesome5/Icon.svelte'
    import DataTableHeader from "./DataTableHeader.svelte";

    const _dataTable = globalThis.c('data-table')
    const _i18n = globalThis.c('i18n')

    export let dataSource
    export let columns = null
    export let selectableRows = true
    export let filter = _dataTable.getDefaultFilter()

    async function initConfig(dSource, cols, selectableRows) {
        config = await _dataTable.getConfig({
            dataSource: dSource,
            columns: cols,
            selectableRows: selectableRows
        })
        columnList = Object.keys(config.columns)
            .map(c => config.columns[c])
            .filter(c => !c.hidden)
    }

    async function fetchData(conf, fltr) {
        if (config == null)
            return
        data = await _dataTable.getData(conf, fltr)
    }

    let config = null
    let data = null
    let columnList = []

    $: columnCount = columnList.length + (selectableRows ? 1 : 0)

    $: initConfig(dataSource, columns, selectableRows)
    $: fetchData(config, filter)
    $: pagination = (filter && data) ? _dataTable.getPagination(filter, data) : {}

    $: console.log('New Filter', filter)
</script>

<style>
    .selected-row {background: #EEE}
</style>

{#if config}
    <Table bordered>
        <thead class="shadow-sm" style="border-bottom: 1px solid grey">
            <tr>
                {#if selectableRows}
                    <th>
                        <Input type="checkbox" />
                    </th>
                {/if}
                {#each columnList as column}
                    <DataTableHeader {column} bind:filter />
                {/each}
            </tr>
        </thead>
        <tbody>
        {#if data != null}

            {#each data.items as row}
                <tr class:selected-row={row.$$isSelected}>
                    {#if selectableRows}
                        <td>
                            <Input type="checkbox" bind:checked={row.$$isSelected} />
                        </td>
                    {/if}
                    {#each columnList as col}
                        <td>
                            <DataTableCell value={row[col.id]} config={col} {row} />
                        </td>
                    {/each}
                </tr>
            {/each}
        {:else}
            Fetching...
        {/if}
        </tbody>
        <tfoot>
        {#if data}
            <tr>
                <td colspan={columnCount}>
                    <ButtonGroup>
                        <Button outline color="primary" disabled={!pagination.canGoFirst} on:click={() => filter = {...filter, currentPage: 0}}>
                            {_i18n._('FIRST')}
                        </Button>
                        <Button outline color="primary" disabled={!pagination.canGoPrev} on:click={() => filter = {...filter, currentPage: filter.currentPage - 1}}>
                            {_i18n._('PREV')}
                        </Button>
                        <Button outline color="primary">
                            <Input type="select" bind:value={filter.pageSize} class="form-select-sm">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </Input>
                        </Button>
                        <Button outline color="primary" disabled={!pagination.canGoNext} on:click={() => filter = {...filter, currentPage: filter.currentPage + 1}}>
                            {_i18n._('NEXT')}
                        </Button>
                        <Button outline color="primary" disabled={!pagination.canGoLast} on:click={() => filter = {...filter, currentPage: data.pageCount - 1}}>
                            {_i18n._('LAST')}
                        </Button>
                        <Button outline color="primary" on:click={() => filter = {...filter}}>
                            <FaIcon key="undo" />
                        </Button>
                    </ButtonGroup>
                    <span class="float-end text-muted">
                        {data.totalCount} Total
                    </span>
                </td>
            </tr>
        {/if}
        </tfoot>
    </Table>
{:else}
    Initializing...
{/if}