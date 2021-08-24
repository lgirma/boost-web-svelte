<script>
    export let resource
    export let height = 128
    const _file = globalThis.c('file')

    let elt;
    let error;

    async function fetchFile(fileId, mountOn) {
        if (fileId == null || mountOn == null)
            return
        try {
            mountOn.src = await _file.loadFile(fileId)
        } catch (e) {
            console.log(e)
            error = e
        }
    }

    $: fetchFile(resource && resource.id, elt)

    $: console.log('ID Change', resource.id)
</script>

{#if error != null}
    <span class="text-danger">!File {resource && resource.id} Not Found</span>
{:else}
    <img bind:this={elt} alt="" on:click height={height}>
{/if}