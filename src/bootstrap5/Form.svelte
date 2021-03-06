<script>
    import FormField from './FormField.svelte'
    import {Form, Row, Col, Card, CardBody, CardHeader, CardTitle} from 'sveltestrap'
    import {createEventDispatcher, onMount} from 'svelte'

    let dispatcher = createEventDispatcher()
    let _form = globalThis.c('form')
    let _i18n = globalThis.c('i18n')

    export let id = null
    let className = ''
    export {className as class}
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
        e.preventDefault()
        if (config.autoValidate) {
            validationResult = _form.validate(forObj, config)
        }
        if (!validationResult.hasError)
            dispatcher('submit', e)
    }

    $: fieldsConfig = Object.keys(config.fieldsConfig).reduce((prev, fieldId) => {
        if (!config.fieldsConfig[fieldId].hidden)
            return {...prev, [fieldId]: config.fieldsConfig[fieldId]}
        return prev
    }, {})
    $: hasGroups = _form.hasGroups(config)
    $: groupedFields = _form.getGroupedFields(fieldsConfig)

    function getField(fields, row, col, cols) {
        return fields[Object.keys(fields)[(row*cols)+col]]
    }
    function getFieldId(fields, row, col, cols) {
        return Object.keys(fields)[(row*cols)+col]
    }
</script>

<Form on:submit={onSubmit} novalidate={config.autoValidate ? 'novalidate' : undefined} id={id || undefined} class={className || undefined}>
    {#if hasGroups}
        <Card>
            {#each Object.entries(groupedFields) as [grpKey, fieldGroup]}
                <CardHeader>
                    <CardTitle>{_i18n._(grpKey)}</CardTitle>
                </CardHeader>
                <CardBody>
                    {#each new Array(Math.ceil(Object.keys(fieldGroup).length / config.columns)).fill(0) as _, row}
                        <Row>
                            {#each new Array(config.columns).fill(0) as _2, col}
                                {#if Object.keys(fieldGroup).length > (row*config.columns)+col}
                                    <Col>
                                        <FormField config={getField(fieldGroup, row, col, config.columns)}
                                                   bind:value={forObj[getFieldId(fieldGroup, row, col, config.columns)]}
                                                   validationResult={validationResult.fields[getFieldId(fieldGroup, row, col, config.columns)] || _form.getValidationResult()} />
                                    </Col>
                                {:else}
                                    <Col/>
                                {/if}
                            {/each}
                        </Row>
                    {/each}
                </CardBody>
            {/each}
        </Card>
    {:else}
        {#each new Array(Math.ceil(Object.keys(fieldsConfig).length / config.columns)).fill(0) as _, row}
            <Row>
                {#each new Array(config.columns).fill(0) as _2, col}
                    {#if Object.keys(fieldsConfig).length > (row*config.columns)+col}
                        <Col>
                            <FormField config={getField(fieldsConfig, row, col, config.columns)}
                                       bind:value={forObj[getFieldId(fieldsConfig, row, col, config.columns)]}
                                       validationResult={validationResult.fields[getFieldId(fieldsConfig, row, col, config.columns)] || _form.getValidationResult()} />
                        </Col>
                    {:else}
                        <Col/>
                    {/if}
                {/each}
            </Row>
        {/each}
    {/if}
    <slot></slot>
</Form>