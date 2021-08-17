<script>
    import DataTable from './DataTable.svelte'
    import Form from './Form.svelte'
    import {fly} from 'svelte/transition'
    import {Button, Breadcrumb, BreadcrumbItem, Row, Col, Accordion, AccordionItem} from 'sveltestrap'
    import {deepMerge} from 'boost-web'

    const _i18n = globalThis.c('i18n')
    const _http = globalThis.c('http')
    const _apiError = globalThis.c('api-error')
    const _dataTable = globalThis.c('data-table')

    export let dataTable
    export let createForm
    export let filterForm
    export let updateForm
    export let getNew
    export let getFilter = () => {}
    export let detailUrl
    export let updateUrl
    export let createUrl
    export let name = ''
    export let namePlural = ''

    const pages = {NONE: 0, LIST: 1, CREATE: 2, EDIT: 3}

    let currentPage = pages.NONE
    let updatedObj = {}
    let createdObj = {}
    let filterObj = {}
    let detailRow

    function goto(page, e) {
        if (e)
            e.preventDefault()
        currentPage = page
        setupPage()
    }

    async function setupPage() {
        if (currentPage === pages.CREATE) {
            createdObj = getNew()
        } else if (currentPage === pages.EDIT) {
            updatedObj = await _http.get(detailUrl(detailRow))
        } else {
            filterObj = {
                ..._dataTable.getDefaultFilter(),
                ...getFilter()
            }
            filterForm = deepMerge({
                fieldsConfig: {
                    sort: {hidden: true},
                    pageSize: {hidden: true},
                    currentPage: {hidden: true},
                }
            }, filterForm)
        }
    }

    async function onCreate() {
        try {
            await _http.post(createUrl, createdObj)
        } catch (e) {
            _apiError.handle(e, _ => {})
        }
    }

    async function onUpdate() {
        try {
            await _http.post(updateUrl(detailRow), createdObj)
        } catch (e) {
            _apiError.handle(e, _ => {})
        }
    }

    goto(pages.LIST)
</script>

{#if currentPage === pages.LIST}
    <div in:fly={{x: 100}}>
        <Row>
            <Col style="max-width: 300px;" />
            <Col><h4>{_i18n._(namePlural)}</h4></Col>
        </Row>
        <Row>
            <Col style="max-width: 300px;">
                <h4>{_i18n._('FILTER')}</h4>
                <div in:fly={{y: -100}}>
                    <Form bind:forObj={filterObj} formConfig={filterForm} />
                </div>
            </Col>
            <Col>
                <Button color="success" class="mb-2" on:click={() => goto(pages.CREATE)}>{_i18n._('CREATE_NEW')}</Button>
                <DataTable {...dataTable} bind:filter={filterObj} />
            </Col>
            <Col style="max-width: 300px;" />
        </Row>
    </div>
{:else if currentPage === pages.EDIT}
    <h4>{_i18n._(name)}</h4>
    <div>
        <Breadcrumb>
            <BreadcrumbItem>
                <a href="#home" on:click={e => goto(pages.LIST, e)}>{_i18n._(namePlural)}</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>{_i18n._('EDIT')}</BreadcrumbItem>
        </Breadcrumb>
    </div>
    <div in:fly={{x: 100}}>
        <Form forObj={updatedObj} formConfig={updateForm} on:submit={onUpdate}>
            <Button>{_i18n._('UPDATE')}</Button>
        </Form>
    </div>
{:else if currentPage === pages.CREATE}
    <div in:fly={{x: 100}}>
        <h4>{_i18n._('NEW')} - {_i18n._(name)}</h4>
        <div>
            <Breadcrumb>
                <BreadcrumbItem>
                    <a href="#home" on:click={e => goto(pages.LIST, e)}>{_i18n._(namePlural)}</a>
                </BreadcrumbItem>
                <BreadcrumbItem active>{_i18n._('NEW')}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <Form bind:forObj={createdObj} formConfig={createForm} on:submit={onCreate}>
            <Button>{_i18n._('CREATE')}</Button>
        </Form>
    </div>
{/if}