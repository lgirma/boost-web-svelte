<script>
    import {createEventDispatcher} from 'svelte'
    export let multiple = true
    export let url

    const _http = globalThis.c('http')
    const _apiError = globalThis.c('api-error')
    let fileInput
    let dispatch = createEventDispatcher()

    async function onUpload(e) {
        if (e.target.files.length === 0)
            return
        try {
            const formData = new FormData()
            if (multiple) {
                for (let i=0; i<e.target.files.length; i++)
                    formData.append('files[]', e.target.files[i])
            }
            else
                formData.append('file', e.target.files[0])
            await _http.post(url, formData)
            fileInput.value = ''
            dispatch('upload')
        } catch (e) {
            _apiError.handle(e, _ => {})
            console.error(e)
        }
    }
</script>

<div on:click={() => fileInput.click()}>
    <slot></slot>
</div>
<form class="d-inline">
    <input {multiple} name="file" class="d-none" type="file" on:change={onUpload} bind:this={fileInput}/>
</form>
