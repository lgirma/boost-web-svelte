<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    import {Button} from 'sveltestrap'
    export let options
    export let hideRetry = false

    const _http = globalThis.c('http')
    const _i18n = globalThis.c('i18n')
    const _apiError = globalThis.c('api-error')

    let data
    let error

    async function fetchData(opts) {
        try {
            data = await _http.read(opts.url, opts.method || 'get', opts.body, opts)
            error = null
        } catch (e) {
            error = e
            _apiError.handle(e, opts.errorHandler || (_ => {}))
        }
    }

    async function refresh() {
        error = null
        await fetchData(options)
    }

    $: fetchData(options)
</script>

{#if error != null}
    {#if !hideRetry}
        <div class="text-center text-muted">
            <h2 style="color: indianred"><FaIcon type="regular" key="frown" /></h2>
            <div>{_i18n._('FAILED_TO_FETCH_DATA')}</div>
            <div><Button size="sm" color="danger" outline on:click={refresh}><FaIcon key="undo" /> {_i18n._('RETRY')}... </Button></div>
        </div>
    {/if}
{:else if data}
    <slot {data} {refresh}>
        {data}
    </slot>
{:else}
    <div class="text-center text-muted">
        <h2 class="fs-1" style="opacity: 0.5"><FaIcon key="circle-notch" spin /></h2>
    </div>
{/if}