<script>
    import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'sveltestrap'

    import {ModalFormStore} from "./Stores";
    import Form from './Form.svelte'

    const _i18n = globalThis.c('i18n')

    const toggle = () => ModalFormStore.update(s => ({...s, isOpen: !s.isOpen}))

    function onDecline() {
        if ($ModalFormStore.onDecline)
            $ModalFormStore.onDecline()
        toggle()
    }

    function onAccept() {
        document.getElementById('$$form-modal').submit()
    }

    function onSubmit() {
        if ($ModalFormStore.onAccept)
            $ModalFormStore.onAccept($ModalFormStore.forObj)
        toggle()
    }
</script>


<Modal {toggle} isOpen={$ModalFormStore.isOpen}>
    <ModalHeader>{_i18n._($ModalFormStore.titleKey)}</ModalHeader>
    <ModalBody>
        {#if $ModalFormStore.forObj}
            <Form bind:forObj={$ModalFormStore.forObj} formConfig={$ModalFormStore.formConfig}
                  on:submit={onSubmit} id="$$form-modal">

                <div class="mt-2">
                    <Button color="primary" on:click={onAccept}>
                        {_i18n._($ModalFormStore.acceptButtonTitleKey)}
                    </Button>
                    <Button type="button" color="light" on:click={onDecline}>
                        {_i18n._($ModalFormStore.declineButtonTitleKey)}
                    </Button>
                </div>
                
            </Form>
        {/if}
    </ModalBody>
</Modal>