<script>
    let _i18n = globalThis.c('i18n')
    let currentLang = _i18n.getCurrentUserLanguage()

    function changeLang(lang) {
        _i18n.changeLanguage(lang)
        window.location.href = window.location.href
    }
</script>

{#each _i18n.getLanguages() as lang}
    <span>
    {#if currentLang !== lang.key}
        <span style="cursor: pointer; color: darkblue" on:click={() => changeLang(lang.key)}>{lang.shortName}</span>&nbsp;
    {:else}
        <span class="badge bg-brand">{lang.shortName}</span>&nbsp;
    {/if}
    </span>
{/each}