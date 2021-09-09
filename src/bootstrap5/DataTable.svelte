<script>
    import {Table, Input, ButtonGroup, Button, ListGroup, ListGroupItem} from 'sveltestrap'
    import DataTableCell from "./DataTableCell.svelte";
    import FaIcon from '../fontawesome5/Icon.svelte'
    import DataTableHeader from "./DataTableHeader.svelte";
    import {MessageType} from 'boost-web'
    import DataTableCommand from "./DataTableCommand.svelte";
    import DataTablePagination from "./DataTablePagination.svelte";

    const _dataTable = globalThis.c('data-table')
    const _i18n = globalThis.c('i18n')
    const _str = globalThis.c('string-utils')
    const _screen = globalThis.c('screen')

    export let dataSource
    export let columns = null
    export let selectableRows = true
    export let titleField = null
    export let skip = []
    export let filter = _dataTable.getDefaultFilter()
    export let commands = []

    async function initConfig(dSource, cols, selectableRows, titleFld, skp) {
        try {
            error = null
            config = await _dataTable.getConfig({
                dataSource: dSource,
                columns: cols,
                selectableRows: selectableRows,
                titleField: titleFld,
                skip: skp
            })
            columnList = Object.keys(config.columns)
                .map(c => config.columns[c])
                .filter(c => !c.hidden)
        } catch (e) {
            error = e
            console.error(e)
        }
    }

    async function fetchData(cnfg, fltr) {
        if (cnfg == null) {
            return
        }
        try {
            error = null
            data = await _dataTable.getData(cnfg, fltr)
        } catch (e) {
            error = e
        }
    }

    let config = null
    let data = null
    let error = null
    let columnList = []

    $: columnCount = columnList.length + (selectableRows ? 1 : 0)

    $: initConfig(dataSource, columns, selectableRows, titleField, skip)
    $: fetchData(config, filter)
    $: pagination = (filter && data) ? _dataTable.getPagination(filter, data) : {}

    async function refresh() {
        error = null
        if (config == null)
            await initConfig(dataSource, columns, selectableRows, titleField, skip)
        if (config != null)
            filter = {...filter}
    }

    let selectAll = false

    function updateSelection(all) {
        if (data != null && data.items != null && data.items.length > 0)
            data.items = [...data.items.map(i => ({...i, $$isSelected: all}))]
    }

    $: updateSelection(selectAll)
    $: selectedRows = data && data.items.filter(i => i.$$isSelected) || []

    $: console.log('DataTable config', config)
</script>

<style>
    .selected-row {background: #EEE}
</style>


{#if _screen.getType() !== 0}
    {#each commands as command}
        <DataTableCommand {command} {selectedRows} />
    {/each}
    <Table bordered responsive>
        <thead class="shadow-sm" style="border-width: 1px">
            <tr>
                {#if selectableRows}
                    <th>
                        <Input type="checkbox" bind:checked={selectAll} />
                    </th>
                {/if}
                {#each columnList as column}
                    <DataTableHeader {column} bind:filter />
                {/each}
            </tr>
        </thead>
        <tbody>
        {#if error != null}
            <tr>
                <td colspan={columnCount} class="text-center text-danger">
                    <div class="text-center text-muted">
                        <h2 style="color: indianred"><FaIcon type="regular" key="frown" /></h2>
                        <div>{_i18n._('FAILED_TO_FETCH_DATA')}</div>
                        <div><Button size="sm" color="danger" outline on:click={refresh}><FaIcon key="undo" /> {_i18n._('RETRY')}... </Button></div>
                    </div>
                </td>
            </tr>
        {/if}
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
                            <DataTableCell value={col.value ? col.value(row) : row[col.id]} config={col} {row} />
                        </td>
                    {/each}
                </tr>
            {:else}
                <tr>
                    <td colspan={columnCount} class="text-center text-muted">
                        <h2>{_i18n._('EMPTY')}</h2>
                        <div>{_i18n._('EMPTY_TABLE')}</div>
                        <slot name="create-link"></slot>
                    </td>
                </tr>
            {/each}
        {/if}
        {#if data == null && error == null}
            <h2 class="text-center mt-2 text-muted"><FaIcon key="circle-notch" spin={true} /> {_i18n._('LOADING')}...</h2>
        {/if}
        </tbody>
        <tfoot class="shadow-sm bg-light" style="border-width: 1px">
            <tr>
                <td colspan={columnCount}>
                    <DataTablePagination pageCount={data && data.pageCount || 0} bind:filter {pagination} {refresh} />
                    <span class="float-end">
                        <button class="btn text-muted">
                            <FaIcon style="opacity: 0.5" key="sort-amount-down" class="text-info" /> {(data && data.totalCount) || 0}
                        </button>
                        <Button outline color="secondary" on:click={refresh}>
                            <FaIcon key="undo" />
                        </Button>
                    </span>
                </td>
            </tr>
        </tfoot>
    </Table>
{:else}
    {#if data == null && error == null}
        <h2 class="text-center mt-2 text-muted"><FaIcon key="circle-notch" spin={true} /> {_i18n._('LOADING')}...</h2>
    {/if}
    {#if error != null}
        <div class="text-center text-muted">
            <h2 style="color: indianred"><FaIcon type="regular" key="frown" /></h2>
            <div>{_i18n._('FAILED_TO_FETCH_DATA')}</div>
            <div><Button size="sm" color="danger" outline on:click={refresh}><FaIcon key="undo" /> {_i18n._('RETRY')}... </Button></div>
        </div>
    {/if}
    {#if data != null}
        {#if selectableRows}
            <Button outline color="light" class="text-dark mb-2" on:click={() => selectAll = !selectAll}>
                <input class="form-check-input" type="checkbox" bind:checked={selectAll}>
                <FaIcon key="list" />
            </Button>
        {/if}
        {#each commands as command}
            <DataTableCommand {command} {selectedRows} />
        {/each}
        <ListGroup flush class="shadow-sm">
            {#each data.items as row}
                <ListGroupItem class="list-group-item-action" style="{row.$$isSelected ? 'background: #EEE' : ''}">
                    <h5 class="mb-1">
                        <input class="form-check-input" type="checkbox" bind:checked={row.$$isSelected} >
                        <DataTableCell value={row[config.titleField]} config={config.columns[config.titleField]} {row} />
                    </h5>
                    <small>
                        {#each columnList as col, i}
                            <span class="text-black-50">
                                {#if col.id !== config.titleField && row[col.id] != null && row[col.id] !== ''}
                                    {#if i > 1}<span style="opacity: 0.3">&bull;</span>{/if}
                                    <DataTableCell value={row[col.id]} config={col} {row} />
                                {/if}
                            </span>
                        {/each}

                    </small>
                </ListGroupItem>
            {/each}
        </ListGroup>
        <div class="mt-2 bg-light">
            <DataTablePagination pageCount={data && data.pageCount || 0} bind:filter {pagination} {refresh} />
            <span class="float-end">
                <button class="btn text-muted">
                    <FaIcon style="opacity: 0.5" key="sort-amount-down" class="text-info" /> {(data && data.totalCount) || 0}
                </button>
                <Button outline color="secondary" on:click={refresh}>
                    <FaIcon key="undo" />
                </Button>
            </span>
        </div>
    {/if}
{/if}