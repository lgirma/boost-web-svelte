<script>
    import {Modal, ModalBody, ModalFooter, Button} from 'sveltestrap'
    import {MessageBoxStore} from "./Stores";
    import FaIcon from "../fontawesome5/Icon.svelte";
    import {MessageType} from 'boost-web'
    import {TextColorTable} from "./common";

    const _i18n = globalThis.c('i18n')

    const toggle = () => MessageBoxStore.update(s => ({...s, isOpen: !s.isOpen}))

    const TitleTable = {
        [MessageType.INFO]: 'INFORMATION',
        [MessageType.NONE]: 'INFORMATION',
        [MessageType.SUCCESS]: 'SUCCESS',
        [MessageType.WARNING]: 'WARNING',
        [MessageType.ERROR]: 'FAILED',
    }
</script>

<Modal {toggle} isOpen={$MessageBoxStore.isOpen}>
    <ModalBody>
        <h3 class={TextColorTable[$MessageBoxStore.messageType]}>
            <FaIcon messageType={$MessageBoxStore.messageType} /> {_i18n._($MessageBoxStore.titleKey || TitleTable[$MessageBoxStore.messageType])}
        </h3>
        {#if $MessageBoxStore.messageKey}
            {_i18n._($MessageBoxStore.messageKey)}
        {/if}
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={toggle}>
            {_i18n._($MessageBoxStore.acceptButtonTitleKey)}
        </Button>
    </ModalFooter>
</Modal>