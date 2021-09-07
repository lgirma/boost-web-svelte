<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    export let options

    const _http = globalThis.c('http')
    const _i18n = globalThis.c('i18n')
    const _apiError = globalThis.c('api-error')

    let data

    async function fetchData(opts) {
        try {
            data = await _http.read(opts.url, opts.method || 'get', opts.body, opts)
        } catch (e) {
            _apiError.handle(e, opts.errorHandler || (_ => {}))
        }
    }

    $: fetchData(options)
</script>

{#if data}
    <slot {data}>
        {data}
    </slot>
{:else}
    <div class="text-center">
        <h2><FaIcon key="circle-notch" spin /> {_i18n._('LOADING')} ...</h2>
    </div>
{/if}