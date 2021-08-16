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

<FormGroup>
    {#if config.type !== 'checkbox' && !config.hideLabel}
        <Label for={config.id}>
            {config.label}
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
               label={config.label}
               required={config.required}
               hidden={config.hidden}
               name={config.name || undefined} />
    {:else if config.type === 'radio'}
        {#each config.choices as choice}
            {#if config.multiple}
                <Input
                       on:change={e => onToggleMultiSelect(e, choice.value)}
                       checked={value.indexOf(choice.value) > -1}
                       id="{config.id}_{choice.value}" type="checkbox" invalid={validationResult.hasError}
                       feedback={_i18n._(validationResult.message)}
                       label={_i18n._(choice.label)}
                       hidden={config.hidden}
                       name={config.name || undefined} />
            {:else}
                <Input value={choice.value}
                       id="{config.id}_{choice.value}" type="radio" invalid={validationResult.hasError}
                       bind:group={value}
                       feedback={_i18n._(validationResult.message)}
                       label={config.label}
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
                {#each config.choices as choice}
                    <option value={choice.value}>{choice.label}</option>
                {/each}
            {/if}
        </Input>
    {/if}

    <FormText color="muted">{try_i18nText(config, 'helpText')}</FormText>
</FormGroup>