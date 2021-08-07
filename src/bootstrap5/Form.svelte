<script>
    import FormField from './FormField.svelte'
    import {Form, Row, Col} from 'sveltestrap'
    import {createEventDispatcher} from 'svelte'

    let dispatcher = createEventDispatcher()
    let _form = globalThis.c('form')

    export let forObj
    export let formConfig = null
    export let validationResult = _form.getFormValidationResult()
    export let updateConfigOnValueChange = false
    let originalVal = null

    $: config = getConfig(formConfig)

    function getConfig(fromConfig) {
        if (originalVal == null)
            originalVal = forObj
        return (fromConfig !== null && fromConfig.$$isComplete)
            ? fromConfig
            : _form.createFormConfig(updateConfigOnValueChange ? forObj : originalVal, fromConfig)
    }

    function onSubmit(e) {
        if (config.autoValidate) {

        }
        dispatcher('submit', e)
    }

    $: hasGroups = _form.hasGroups(config)
    $: groupedFields = _form.getGroupedFields(config.fieldsConfig)
</script>

<Form on:submit={onSubmit} novalidate={config.autoValidate ? 'novalidate' : undefined}>
    <Row>
        {#each _form.getColumns(config.fieldsConfig, config.columns) as fields}
            <Col>
                {#each Object.entries(fields) as [fieldId, fieldConfig]}
                    <FormField config={fieldConfig} bind:value={forObj[fieldId]}
                               validationResult={validationResult.fields[fieldId] || _form.getValidationResult()} />
                {/each}
            </Col>
        {/each}
    </Row>
    <slot></slot>
</Form>