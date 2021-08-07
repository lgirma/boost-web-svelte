<script>
    import FormField from './FormField.svelte'
    import {Form, Row, Col, Accordion, AccordionHeader, AccordionItem} from 'sveltestrap'
    import {createEventDispatcher, onMount} from 'svelte'

    let dispatcher = createEventDispatcher()
    let _form = globalThis.c('form')
    let _i18n = globalThis.c('i18n')

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

    function fixAccordions() {
        [...document.querySelectorAll('.accordion-button')].map(e => e.type = 'button')
    }

    function onSubmit(e) {
        e.preventDefault()
        if (config.autoValidate) {
            validationResult = _form.validate(forObj, config)
        }
        if (!validationResult.hasError)
            dispatcher('submit', e)
    }

    $: hasGroups = _form.hasGroups(config)
    $: groupedFields = _form.getGroupedFields(config.fieldsConfig)

    onMount(() => {
        fixAccordions()
    })
</script>

<Form on:submit={onSubmit} novalidate={config.autoValidate ? 'novalidate' : undefined}>
    {#if hasGroups}
        <Accordion stayOpen>
            {#each Object.entries(groupedFields) as [grpKey, fieldGroup]}
                <AccordionItem active header={_i18n._(grpKey)}>
                    <Row>
                    {#each _form.getColumns(fieldGroup, config.columns) as fields}
                        <Col>
                            {#each Object.entries(fields) as [fieldId, fieldConfig]}
                                <FormField config={fieldConfig} bind:value={forObj[fieldId]}
                                           validationResult={validationResult.fields[fieldId] || _form.getValidationResult()} />
                            {/each}
                        </Col>
                    {/each}
                    </Row>
                </AccordionItem>
            {/each}
        </Accordion>
    {:else}
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
    {/if}
    <slot></slot>
</Form>