<script>
    import {Button} from 'sveltestrap'
    import SecureFile from "../misc/SecureFile.svelte";
    import FaIcon from '../fontawesome5/Icon.svelte'

    export let icon = "user"
    export let id
    export let uploadUrl
    export let height = 128

    let resource = {id}

    const _http = globalThis.c('http')
    const _apiError = globalThis.c('api-error')
    let fileInput

    async function onUpload(e) {
        try {
            const formData = new FormData()
            formData.append('file', e.target.files[0])
            console.log('Form', formData)
            resource = {id: await _http.post(uploadUrl, formData)}
        } catch (e) {
            _apiError.handle(e, _ => {})
            console.error(e)
        }
    }
</script>

<span style="cursor: pointer" on:click={() => fileInput.click()}>
{#if resource.id == null}
    <FaIcon key={icon} class="fa-4x text-black-50" />
{:else}
    <SecureFile {resource} {height} />
{/if}
</span>
<form class="d-inline">
    <input name="file" class="d-none" type="file" on:change={onUpload} bind:this={fileInput}/>
</form>