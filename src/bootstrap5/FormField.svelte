<script>
    import {Input, Label, FormGroup, FormText} from 'sveltestrap'
    import {Rating} from '..'
    import {fly} from 'svelte/transition'

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
</script>

<style>
    form .accordion-header button {

    }
</style>

<FormGroup>
    {#if config.type !== 'checkbox' && !config.hideLabel && !config.hidden}
        <Label for={config.id}>
            {try_i18nText(config, 'label')}
            {#if config.required}<span style="color: red">*</span>{/if}
        </Label>
    {/if}
    {#if config.readonly}
        {#if config.type === 'checkbox'}
            {value ? _i18n._('YES') : _i18n._('NO')}
        {:else if config.type === 'rating'}
            {#each new Array(config.max || 5).fill(0) as i}
                <span class="boost-star">{value > i ? '★' : '☆'}</span>
            {/each}
        {:else}
            <Input plaintext {value} />
        {/if}
    {:else if config.type === 'checkbox'}
        <Input bind:checked={value}
               id={config.id} type="checkbox" invalid={validationResult.hasError}
               feedback={_i18n._(validationResult.message)}
               label={try_i18nText(config, 'label')}
               required={config.required}
               hidden={config.hidden}
               name={config.name || undefined} />
    {:else if config.type === 'radio'}
        {#each Object.keys(config.choices || {}) as key}
            {#if config.multiple}
                <Input
                       on:change={e => onToggleMultiSelect(e, key)}
                       checked={value.indexOf(key) > -1}
                       id="{config.id}_{key}" type="checkbox" invalid={validationResult.hasError}
                       feedback={_i18n._(validationResult.message)}
                       label={_i18n._(config.choices[key])}
                       hidden={config.hidden}
                       name={config.name || undefined} />
            {:else}
                <Input value={key}
                       id="{config.id}_{key}" type="radio" invalid={validationResult.hasError}
                       bind:group={value}
                       feedback={_i18n._(validationResult.message)}
                       label={try_i18nText(config, 'label')}
                       hidden={config.hidden}
                       name={config.name || undefined} />
            {/if}
        {/each}
    {:else if config.type === 'rating'}
        <div>
            <Rating max={config.max || 5} bind:value />
        </div>
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
               hidden={config.hidden}
        >
            {#if config.type === 'select'}
                {#each Object.keys(config.choices || {}) as key}
                    <option value={key}>{try_i18nText(config.choices, key)}</option>
                {/each}
            {/if}
        </Input>
    {/if}

    <FormText color="muted">{try_i18nText(config, 'helpText')}</FormText>
</FormGroup>