<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    export let contentType = null

</script>

{#if contentType === 'application/pdf'}
    <FaIcon key="file-pdf" />
{:else if contentType.indexOf('image/') === 0}
    <FaIcon key="file-image" />
{:else}
    <FaIcon key="file" />
{/if}