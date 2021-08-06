<script>
    import {Modal, ModalBody} from 'sveltestrap'
    import {BusyModalStore} from "./Stores";
    import FaIcon from "../fontawesome5/Icon.svelte";

    const _i18n = globalThis.c('i18n')
</script>

<Modal backdrop="static" isOpen={$BusyModalStore.isOpen}>
    <ModalBody class="text-center">
        <h2 class="text-muted"><FaIcon spin={true} key="circle-notch" /></h2>
        {_i18n._($BusyModalStore.titleKey)}
    </ModalBody>
</Modal>