<script>
    import {Table, Input, ButtonGroup, Button, ListGroup, ListGroupItem} from 'sveltestrap'
    import DataTableCell from "./DataTableCell.svelte";
    import FaIcon from '../fontawesome5/Icon.svelte'
    import DataTableHeader from "./DataTableHeader.svelte";
    import {MessageType} from 'boost-web'
    import DataTableCommand from "./DataTableCommand.svelte";

    const _dataTable = globalThis.c('data-table')
    const _i18n = globalThis.c('i18n')
    const _str = globalThis.c('string-utils')
    const _screen = globalThis.c('screen')

    export let dataSource
    export let columns = null
    export let selectableRows = true
    export let titleField = null
    export let filter = _dataTable.getDefaultFilter()
    export let commands = []

    async function initConfig(dSource, cols, selectableRows, titleFld) {
        try {
            error = null
            config = await _dataTable.getConfig({
                dataSource: dSource,
                columns: cols,
                selectableRows: selectableRows,
                titleField: titleFld
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

    $: initConfig(dataSource, columns, selectableRows, titleField)
    $: fetchData(config, filter)
    $: pagination = (filter && data) ? _dataTable.getPagination(filter, data) : {}

    async function refresh() {
        if (config == null)
            await initConfig(dataSource, columns, selectableRows, titleField)
        if (config != null)
            filter = {...filter}
    }

    function onToggleSelectAll(e) {
        if (data == null || data.items == null || data.items.length == 0)
            return
        data.items = [...data.items.map(i => ({...i, $$isSelected: e.target.checked}))]
    }
</script>

<style>
    .selected-row {background: #EEE}
</style>


{#if _screen.getType() !== 0}
    {#each commands as command}
        <DataTableCommand {command} selectedRows={data && data.items.filter(i => i.$$isSelected) || []} />
    {/each}
    <Table bordered responsive>
        <thead class="shadow-sm" style="border-bottom: 1px solid grey">
            <tr>
                {#if selectableRows}
                    <th>
                        <Input type="checkbox" on:change={onToggleSelectAll} />
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
                    <h2><FaIcon messageType={MessageType.ERROR} /> {_i18n._('FAILED')}</h2>
                    <div>{_i18n._('FAILED_TO_FETCH_DATA')}</div>
                    <div><Button color="danger" outline on:click={refresh}><FaIcon key="undo" /> {_i18n._('RETRY')}... </Button></div>
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
                            <DataTableCell value={row[col.id]} config={col} {row} />
                        </td>
                    {/each}
                </tr>
            {:else}
                <tr>
                    <td colspan={columnCount} class="text-center text-muted">
                        <h2>{_i18n._('EMPTY')}</h2>
                        <div>{_i18n._('EMPTY_TABLE')}</div>
                        <div><Button color="success"><FaIcon key="plus" /> {_i18n._('CREATE_NEW')}... </Button></div>
                    </td>
                </tr>
            {/each}
        {/if}
        {#if data == null && error == null}
            <h2 class="text-center mt-2 text-muted"><FaIcon key="circle-notch" spin={true} /> {_i18n._('LOADING')}...</h2>
        {/if}
        </tbody>
        <tfoot>
            <tr>
                <td colspan={columnCount}>
                    <ButtonGroup>
                        {#if data}
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
                        {/if}
                        <Button outline color="primary" on:click={refresh}>
                            <FaIcon key="undo" />
                        </Button>
                    </ButtonGroup>
                    <span class="float-end">
                        <FaIcon key="sort-amount-down" class="text-info" /> {(data && data.totalCount) || 0}
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
        <div class="text-center text-danger">
            <h2><FaIcon messageType={MessageType.ERROR} /> {_i18n._('FAILED')}</h2>
            <div>{_i18n._('FAILED_TO_FETCH_DATA')}</div>
            <div><Button color="danger" outline on:click={refresh}><FaIcon key="undo" /> {_i18n._('RETRY')}... </Button></div>
        </div>
    {/if}
    {#if data != null}
        {#each commands as command}
            <DataTableCommand {command} selectedRows={data.items || []} />
        {/each}
        <ListGroup flush class="shadow-sm">
            {#each data.items as row}
                <ListGroupItem class="list-group-item-action {row.$$isSelected ? 'active' : ''}">
                    <h5 class="mb-1">
                        <!--<Input type="checkbox" bind:checked={row.$$isSelected} />-->
                        <DataTableCell value={row[config.titleField]} config={config.columns[config.titleField]} {row} />
                    </h5>
                    <!--<p class="mb-1">
                    </p>-->
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
        <div class="mt-2">
            <ButtonGroup>
                {#if data}
                    <Button outline color="primary" disabled={!pagination.canGoFirst} on:click={() => filter = {...filter, currentPage: 0}}>
                        <FaIcon key="step-backward" />
                    </Button>
                    <Button outline color="primary" disabled={!pagination.canGoPrev} on:click={() => filter = {...filter, currentPage: filter.currentPage - 1}}>
                        <FaIcon key="backward" />
                    </Button>
                    <Button outline color="primary">
                        <Input type="select" bind:value={filter.pageSize} class="form-select-sm">
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </Input>
                    </Button>
                    <Button outline color="primary" disabled={!pagination.canGoNext} on:click={() => filter = {...filter, currentPage: filter.currentPage + 1}}>
                        <FaIcon key="forward" />
                    </Button>
                    <Button outline color="primary" disabled={!pagination.canGoLast} on:click={() => filter = {...filter, currentPage: data.pageCount - 1}}>
                        <FaIcon key="step-forward" />
                    </Button>
                {/if}
                <Button outline color="primary" on:click={refresh}>
                    <FaIcon key="undo" />
                </Button>
            </ButtonGroup>
            <span class="float-end">
                <FaIcon key="sort-amount-down" class="text-info" /> {(data && data.totalCount) || 0}
            </span>
        </div>
    {/if}
{/if}