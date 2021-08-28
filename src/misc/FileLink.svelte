<script>
    import FileIcon from './FileIcon.svelte'
    export let id
    export let contentType = null
    export let name

    const _config = globalThis.c('config')
</script>

<a href="{_config.get('http').apiBaseUrl}/files/get-inline/{id}" target="_blank" rel="noopener noreferrer">
    <FileIcon {contentType} />
    {name}
</a>