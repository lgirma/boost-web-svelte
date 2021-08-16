<script>
    import {Toast, ToastBody} from 'sveltestrap'
    import {ToastStore} from "./Stores";
    import FaIcon from "../fontawesome5/Icon.svelte";
    import {BgColorTable} from "./common";

    const _i18n = globalThis.c('i18n')
    const toggle = () => ToastStore.update(ts => ({...ts, isOpen: !ts.isOpen}))
</script>

<div class="position-fixed top-0 end-0 p-3"
     role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 11">
    <Toast class="text-white bg-{BgColorTable[$ToastStore.type]}" isOpen={$ToastStore.isOpen}
           autohide={$ToastStore.autoHide} delay={$ToastStore.timeout}>
        <div class="d-flex">
            <ToastBody>
                <h4><FaIcon messageType={$ToastStore.type} /> {_i18n._($ToastStore.titleKey)}</h4>
                <div>
                    {#if $ToastStore.isDetailHtml}
                        {@html _i18n._($ToastStore.detailKey)}
                    {:else}
                        {_i18n._($ToastStore.detailKey)}
                    {/if}
                </div>
            </ToastBody>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" on:click={toggle}></button>
        </div>
    </Toast>
</div>