<script>
    import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'sveltestrap'
    import {ConfirmDialogStore} from "./Stores";
    import FaIcon from '../fontawesome5/Icon.svelte'

    const _i18n = globalThis.c('i18n')

    const toggle = () => ConfirmDialogStore.update(s => ({...s, isOpen: !s.isOpen}))

    function onDecline() {
        if ($ConfirmDialogStore.onDecline)
            $ConfirmDialogStore.onDecline()
        toggle()
    }

    function onAccept() {
        if ($ConfirmDialogStore.onAccept)
            $ConfirmDialogStore.onAccept()
        toggle()
    }
</script>

<Modal {toggle} isOpen={$ConfirmDialogStore.isOpen}>
    <ModalHeader>{_i18n._($ConfirmDialogStore.titleKey)}</ModalHeader>
    <ModalBody>
        <h3>
            <h3>
                <span class="text-warning"><FaIcon messageType={$ConfirmDialogStore.messageType} /></span>
                {_i18n._($ConfirmDialogStore.questionKey)}
            </h3>
        </h3>
        {#if $ConfirmDialogStore.detailKey}
            <p class="text-muted">{_i18n._($ConfirmDialogStore.detailKey)}</p>
        {/if}
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={onAccept}>
            {_i18n._($ConfirmDialogStore.acceptButtonTitleKey)}
        </Button>
        <Button type="button" color="light" on:click={onDecline}>
            {_i18n._($ConfirmDialogStore.declineButtonTitleKey)}
        </Button>
    </ModalFooter>
</Modal>