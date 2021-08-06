<script>
    import {Input, Label, FormGroup, FormText} from 'sveltestrap'

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
</script>

<FormGroup>
    {#if config.type !== 'checkbox' && !config.hideLabel}
        <Label for={config.id}>{try_i18nText(config, 'label')}</Label>
    {/if}
    {#if config.readonly}
        {#if config.type === 'checkbox'}
            {value ? _i18n._('YES') : _i18n._('NO')}
        {:else}
            {value}
        {/if}
    {:else if config.type === 'checkbox'}
        <Input bind:checked={value}
               id={config.id} type={config.type} invalid={validationResult.hasError}
               feedback={_i18n._(validationResult.message)}
               label={try_i18nText(config, 'label')}
               required={config.required}
               name={config.name || undefined} />
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
        />
    {/if}

    <FormText color="muted">{try_i18nText(config, 'helpText')}</FormText>
</FormGroup>