<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    export let options

    const _http = globalThis.c('http')
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
    <slot data={data}>
        {data}
    </slot>
{:else}
    <div class="text-center">
        <FaIcon key="circle-notch" spin />
    </div>
{/if}