<script>
    import {Input, Label, FormGroup, FormText, Row, Col} from 'sveltestrap'
    import {Rating} from '..'
    import AgeInput from './AgeInput.svelte'
    import AutoComplete from './AutoComplete.svelte'
    import StaticValue from './StaticValue.svelte'

    let _form = globalThis.c('form')
    let _i18n = globalThis.c('i18n')
    let _str = globalThis.c('string-utils')

    export let config
    export let validationResult = _form.getValidationResult()
    export let value

    function try_i18nText(obj, prop) {
        let key = obj[prop + 'Key']
        let val = ''
        if (key)
            val = _i18n._(key)
        if (val) return val
        if (_str.isEmpty(obj[prop]))
            return ''
        key = obj[prop].replaceAll(/\s/g, '_').toUpperCase()
        val = _i18n._(key)
        if (val !== key) return val
        return obj[prop]
    }

    function onToggleMultiSelect(e, val) {
        let on = e.target.checked;
        if (on)
            value = [...value, val]
        else
            value = value.filter(i => i !== val)
    }

    let className

    $: {
        if (config.scale > 1) {
            if (config.type === 'select')
                className = 'form-select-lg'
            else
                className = 'form-control-lg'
        } else if (config.scale < 1) {
            if (config.type === 'select')
                className = 'form-select-sm'
            else
                className = 'form-control-sm'
        } else {
            className = ''
        }
    }
</script>

<FormGroup>
    {#if (config.readonly || config.type !== 'checkbox') && !config.hideLabel}
        <Label for={config.id}>
            <span class:text-muted={config.readonly}>{config.label}</span>
            {#if config.required}<span style="color: red">*</span>{/if}
        </Label>
    {/if}
    {#if config.readonly}
        <div class="fs-5" style="border-bottom: 1px solid #EEE;">
            <StaticValue type={config.type} {value} max={config.max} choices={config.choices} />
        </div>
    {:else if config.type === 'checkbox'}
        <Input bind:checked={value}
               id={config.id} type="checkbox" invalid={validationResult.hasError}
               feedback={_i18n._(validationResult.message)}
               label={config.label}
               required={config.required}
               hidden={config.hidden}
               name={config.name || undefined} class={className} />
    {:else if config.type === 'radio'}
        <Row>
        {#each config.choices as choice, i}
            <Col sm="6" md="3">
            {#if config.multiple}
                <Input
                       on:change={e => onToggleMultiSelect(e, choice.key)}
                       checked={value.indexOf(choice.key) > -1}
                       id="{config.id}_{choice.key}" type="checkbox" invalid={validationResult.hasError}
                       feedback={_i18n._(validationResult.message)}
                       label={choice.val}
                       hidden={config.hidden}
                       name={config.name || undefined} class={className} />
            {:else}
                <Input value={choice.key}
                       id="{config.id}_{choice.key}" type="radio" invalid={validationResult.hasError}
                       bind:group={value}
                       feedback={_i18n._(validationResult.message)}
                       label={choice.val}
                       hidden={config.hidden}
                       name={config.name || undefined} class={className} />
            {/if}
            </Col>
        {/each}
        </Row>
    {:else if config.type === 'rating'}
        <div>
            <Rating max={config.max || 5} bind:value />
        </div>
    {:else if config.type === 'file'}
        <Input bind:files={value}
               id={config.id} type="file" invalid={validationResult.hasError}
               feedback={_i18n._(validationResult.message)}
               required={config.required}
               name={config.name || undefined}
               placeholder={try_i18nText(config, 'placeholder') || undefined}
               maxlength={config.maxlength || undefined}
               max={config.max || undefined}
               min={config.min || undefined}
               pattern={config.pattern || undefined}
               rows={config.rows || undefined}
               step={config.step || undefined}
               multiple={config.multiple || undefined}
               hidden={config.hidden} class={className}
        />
    {:else if config.type === 'age'}
        <AgeInput bind:value
            inputProps={{
                id: config.id,
                invalid: validationResult.hasError,
                feedback: _i18n._(validationResult.message),
                required: config.required,
                name: config.name || undefined,
                placeholder: try_i18nText(config, 'placeholder') || undefined,
                maxlength: config.maxlength || undefined,
                max: config.max || undefined,
                min: config.min || undefined,
                pattern: config.pattern || undefined,
                step: config.step || undefined,
                hidden: config.hidden,
                class: className
              }}
        />
    {:else if config.type === 'autocomplete'}
        <AutoComplete bind:value
                      id={config.id} invalid={validationResult.hasError}
                      feedback={_i18n._(validationResult.message)}
                      required={config.required}
                      name={config.name || undefined}
                      placeholder={try_i18nText(config, 'placeholder') || undefined}
                      hidden={config.hidden} {...config.customOptions} />
    {:else}
        <Input bind:value
               id={config.id} type={config.type} invalid={validationResult.hasError}
               feedback={_i18n._(validationResult.message)}
               required={config.required}
               name={config.name || undefined}
               placeholder={try_i18nText(config, 'placeholder') || undefined}
               maxlength={config.maxlength || undefined}
               max={config.max || undefined}
               min={config.min || undefined}
               pattern={config.pattern || undefined}
               rows={config.rows || undefined}
               step={config.step || undefined}
               multiple={config.multiple || undefined}
               hidden={config.hidden} class={className}
        >
            {#if config.type === 'select'}
                {#each config.choices as choice}
                    <option value={choice.key}>{choice.val}</option>
                {/each}
            {/if}
        </Input>
    {/if}

    <FormText color="muted">{try_i18nText(config, 'helpText')}</FormText>
</FormGroup>