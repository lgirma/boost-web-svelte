<script>
    import {Button} from 'sveltestrap'
    import Form from './Form.svelte'

    const _auth = globalThis.c('auth')
    const _i18n = globalThis.c('i18n')
    const _toast = globalThis.c('toast')
    const _apiError = globalThis.c('api-error')

    let formData = {userName: '', password: ''}
    let formConfig = {
        fieldsConfig: {
            userName: {required: true}
        }
    }

    async function onLogin() {
        try {
            await _auth.login({userId: formData.userName, password: formData.password})
        } catch (e) {
            _apiError.handle(e, apiErr => {
                _toast.showError('ERR_' + apiErr.code)
            })
        }
    }
</script>

<Form bind:forObj={formData} {formConfig} on:submit={onLogin}>
    <div>
        <Button color="primary" block>{_i18n._('LOGIN')}</Button>
    </div>
</Form>
