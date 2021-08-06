<script>
    import FormField from './FormField.svelte'
    import {Form} from 'sveltestrap'
    import {createEventDispatcher} from 'svelte'

    let dispatcher = createEventDispatcher()
    let _form = globalThis.c('form')

    export let forObj
    export let formConfig = null
    export let validationResult = _form.getFormValidationResult()

    $: config = (formConfig && formConfig.$$isComplete)
        ? formConfig
        : _form.createFormConfig(forObj, formConfig);

    function onSubmit(e) {
        if (config.autoValidate) {

        }
        dispatcher('submit', e)
    }
</script>

<Form on:submit={onSubmit} novalidate={config.autoValidate ? 'novalidate' : undefined}>
    {#each Object.entries(config.fieldsConfig) as [fieldId, fieldConfig]}
        <FormField config={fieldConfig} bind:value={forObj[fieldId]}
                   validationResult={validationResult.fields[fieldId] || _form.getValidationResult()} />
    {/each}
    <slot></slot>
</Form>