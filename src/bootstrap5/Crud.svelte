<script>
    import DataTable from './DataTable.svelte'
    import Form from './Form.svelte'
    import {fly} from 'svelte/transition'
    import {Button, Breadcrumb, BreadcrumbItem, Card, CardHeader, CardTitle, CardBody} from 'sveltestrap'
    import {deepMerge} from 'boost-web'
    import PageContent from './PageContent.svelte'
    import FaIcon from '../fontawesome5/Icon.svelte'

    const _i18n = globalThis.c('i18n')
    const _http = globalThis.c('http')
    const _apiError = globalThis.c('api-error')
    const _dataTable = globalThis.c('data-table')
    const _crud = globalThis.c('crud')
    const _toast = globalThis.c('toast')
    const _msgBox = globalThis.c('message-box')

    export let id
    export let rootUrl = null
    export let dataTable = {}
    export let createForm = {}
    export let filterForm = {}
    export let updateForm = {}
    export let getNew
    export let getFilter = () => {}
    export let detailUrl = null
    export let updateUrl = null
    export let createUrl = null
    export let name = null
    export let namePlural = null
    export let page = 'list'
    export let pageParams = null

    const pages = {NONE: 0, LIST: 1, CREATE: 2, EDIT: 3}

    let _config = null
    let currentPage = pages.NONE
    let updatedObj = {}
    let createdObj = {}
    let filterObj = {}
    let detailRow

    async function goto(page, e) {
        if (e)
            e.preventDefault()
        await setupPage(page)
        currentPage = page
    }

    async function setupPage(forPage) {
        if (forPage === pages.CREATE) {
            createdObj = getNew()
        } else if (forPage === pages.EDIT) {
            updatedObj = await _http.get(_config.detailUrl(pageParams))
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
            await _http.post(_config.createUrl, createdObj)
            _toast.showSuccess('SUCCESS')
            await goto(pages.LIST)
        } catch (e) {
            _apiError.handle(e, _ => {})
        }
    }

    async function onUpdate() {
        try {
            await _http.post(_config.updateUrl(pageParams), updatedObj)
            _toast.showSuccess('SUCCESS')
            await goto(pages.LIST)
        } catch (e) {
            _apiError.handle(e, _ => {})
        }
    }

    async function init(pageName) {
        _config = await _crud.createConfig({
            id, name, namePlural, dataTable, detailUrl, updateUrl, createUrl,
            createForm, updateForm, filterForm, getFilter, getNew
        })
        if (pageName === 'list')
            await goto(pages.LIST)
        else if (pageName === 'edit')
            await goto(pages.EDIT)
        else if (pageName === 'new')
            await goto(pages.CREATE)
    }

    $: init(page, pageParams)
</script>

{#if currentPage === pages.LIST}
    <div in:fly={{x: 100}}>
        <PageContent>
            <svelte:fragment slot="title">
                <h4>{_config.namePlural}</h4>
            </svelte:fragment>
            <svelte:fragment slot="left">
                <Card class="mb-1">
                    <CardHeader>
                        <CardTitle>{_i18n._('FILTER')}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form bind:forObj={filterObj} formConfig={_config.filterForm} />
                    </CardBody>
                </Card>
            </svelte:fragment>
            <svelte:fragment slot="content">
                <a class="btn btn-success mb-2" href="#/{rootUrl}/new">
                    <FaIcon key="plus-circle" /> {_i18n._('CREATE_NEW')}
                </a>
                <DataTable {..._config.dataTable} bind:filter={filterObj} />
            </svelte:fragment>
        </PageContent>
    </div>
{:else if currentPage === pages.EDIT}
    <PageContent>
        <svelte:fragment slot="title">
            <h4>{_config.name}</h4>
            <div>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a href="#/{rootUrl}">{_config.namePlural}</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{_i18n._('EDIT')}</BreadcrumbItem>
                </Breadcrumb>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <div in:fly={{x: 100}}>
                <Form bind:forObj={updatedObj} formConfig={_config.updateForm} on:submit={onUpdate}>
                    <Button color="light" class="btn-brand"><FaIcon key="check" /> {_i18n._('UPDATE')}</Button>
                </Form>
            </div>
        </svelte:fragment>
    </PageContent>
{:else if currentPage === pages.CREATE}
    <PageContent>
        <svelte:fragment slot="title">
            <h4>{_i18n._('NEW')} - {_config.name}</h4>
            <div>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a href="#/{rootUrl}">{_config.namePlural}</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{_i18n._('NEW')}</BreadcrumbItem>
                </Breadcrumb>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <div in:fly={{x: 100}}>
            <Form bind:forObj={createdObj} formConfig={_config.createForm} on:submit={onCreate}>
                <Button color="light" class="btn-brand"><FaIcon key="check" /> {_i18n._('CREATE')}</Button>
            </Form>
            </div>
        </svelte:fragment>
    </PageContent>
{/if}