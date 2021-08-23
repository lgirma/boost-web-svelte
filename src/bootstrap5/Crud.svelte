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

    const pages = {NONE: 0, LIST: 1, CREATE: 2, DETAIL: 3, EDIT: 4}

    let _config = null
    let currentPage = pages.NONE
    let updatedObj = {}
    let createdObj = {}
    let filterObj = {}
    let detailForm = {...updateForm, readonly: true}
    let toggleFilter = false

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
        } else if (forPage === pages.DETAIL) {
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
            window.location.href = `#/${rootUrl}`
        } catch (e) {
            _apiError.handle(e, _ => {})
        }
    }

    async function onUpdate() {
        try {
            await _http.post(_config.updateUrl(pageParams), updatedObj)
            _toast.showSuccess('SUCCESS')
            window.location.href = `#/${rootUrl}`
        } catch (e) {
            _apiError.handle(e, _ => {})
        }
    }

    async function init(pageName) {
        _config = await _crud.createConfig({
            id, name, namePlural, dataTable, detailUrl, updateUrl, createUrl,
            createForm, updateForm, filterForm, getFilter, getNew
        })
        _config.dataTable.commands = [
            {
                id: 'createNew',
                iconKey: 'plus-circle',
                class: 'btn btn-outline-success',
                linkTo: `#/${rootUrl}/new`
            },
            {
                id: 'exportToExcel',
                iconKey: 'file-excel',
                class: 'btn btn-outline-secondary',
                invoke: exportToExcel
            },
            {
                id: 'delete',
                iconKey: 'times-circle',
                class: 'btn btn-outline-danger',
                confirm: true,
                invoke: deleteSelected,
                condition: rows => rows.length > 0
            },
            {
                class: 'float-end btn btn-light d-md-none d-inline',
                iconKey: 'search',
                invoke: () => toggleFilter = !toggleFilter
            },
            ..._config.dataTable.commands
        ]
        if (pageName === 'list')
            await goto(pages.LIST)
        else if (pageName === 'edit')
            await goto(pages.EDIT)
        else if (pageName === 'detail')
            await goto(pages.DETAIL)
        else if (pageName === 'new')
            await goto(pages.CREATE)
    }

    $: init(page, pageParams)

    async function exportToExcel() {
        try {
            const res = await _http.request("post", _config.exportUrl, {...filterObj, format: 'excel'})
            const contentDisp = res.headers.get("Content-Disposition")
            if (contentDisp == null) {
                _msgBox.showError("Empty content disposition")
                return
            }
            const fileName = contentDisp.split('filename=')[1].split(';')[0].trim();
            const blob = await res.blob()
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.setAttribute("download", fileName);
            a.click();
            return false;
        } catch (e) {
            _apiError.handle(e, _ => {})
            console.error(e)
        }
    }

    async function deleteSelected(rows) {
        alert('Deleting ' + rows.length)
    }
</script>

{#if currentPage === pages.LIST}
    <div in:fly={{x: 100}}>
        <PageContent>
            <svelte:fragment slot="title">
                <h4>{_config.namePlural}</h4>
            </svelte:fragment>
            <svelte:fragment slot="left">
                <Card class="mb-1 d-md-block {toggleFilter ? '' : 'd-none'}">
                    <CardHeader>
                        <CardTitle>{_i18n._('FILTER')}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form bind:forObj={filterObj} formConfig={_config.filterForm} />
                    </CardBody>
                </Card>
            </svelte:fragment>
            <svelte:fragment slot="content">
                <!--<a class="btn btn-outline-success mb-2" href="#/{rootUrl}/new">
                    <FaIcon key="plus-circle" /> <span class="d-md-inline d-none">{_i18n._('CREATE_NEW')}</span>
                </a>
                <Button color="secondary" outline class="mb-2" on:click={exportToExcel}>
                    <FaIcon key="file-excel" /> <span class="d-md-inline d-none">{_i18n._('EXPORT_TO_EXCEL')}</span>
                </Button>
                <Button color="light" class="mb-2 float-end d-md-none d-inline" on:click={() => toggleFilter = !toggleFilter}>
                    <FaIcon key="search" />
                </Button>-->
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
                    <div class="mt-2">
                        <Button color="light" class="btn-brand"><FaIcon key="check" /> {_i18n._('UPDATE')}</Button>
                        <a class="btn btn-light" href="#/{rootUrl}">{_i18n._('CANCEL')}</a>
                    </div>
                </Form>
            </div>
        </svelte:fragment>
    </PageContent>
{:else if currentPage === pages.DETAIL}
    <PageContent>
        <svelte:fragment slot="title">
            <h4>{_config.name} <a href="#/{rootUrl}/edit/{pageParams}"><FaIcon key="pen" /> </a></h4>
            <div>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a href="#/{rootUrl}">{_config.namePlural}</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{_i18n._('DETAIL')}</BreadcrumbItem>
                </Breadcrumb>
            </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <div in:fly={{x: 100}}>
                <Form forObj={updatedObj} formConfig={detailForm}>
                    <div class="mt-2">
                        <a class="btn btn-brand" href="#/{rootUrl}/edit/{pageParams}"><FaIcon key="pen" /> {_i18n._('EDIT')}</a>
                        <a class="btn btn-light" href="#/{rootUrl}">{_i18n._('CANCEL')}</a>
                    </div>
                </Form>
            </div>
            <slot name="detail"></slot>
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
                <div class="mt-2">
                    <Button color="light" class="btn-brand"><FaIcon key="check" /> {_i18n._('CREATE')}</Button>
                    <a class="btn btn-light" href="#/{rootUrl}">{_i18n._('CANCEL')}</a>
                </div>
            </Form>
            </div>
        </svelte:fragment>
    </PageContent>
{/if}