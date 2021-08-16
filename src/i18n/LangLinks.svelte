<script>
    let _i18n = globalThis.c('i18n')
    let currentLang = _i18n.getCurrentUserLanguage()

    let className
    export { className as class };

    function changeLang(e, lang) {
        e.preventDefault()
        _i18n.changeLanguage(lang)
        window.location.href = window.location.href
    }
</script>

{#each _i18n.getLanguages() as lang}
    <span>
    {#if currentLang !== lang.key}
        <a href="#" style="text-decoration: none;" class={className} on:click={e => changeLang(e, lang.key)}>{lang.shortName}</a>&nbsp;
    {:else}
        <span class="badge bg-brand">{lang.shortName}</span>&nbsp;
    {/if}
    </span>
{/each}