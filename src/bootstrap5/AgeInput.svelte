<script>
    import {Row, Col, Input} from 'sveltestrap'

    export let value
    export let inputProps

    const _i18n = globalThis.c('i18n')

    let months = 12 * Number((value-Math.trunc(value)).toFixed(2))
    let years = Math.trunc(value)

    function onMonthsChange() {
        value = years + (months / 12)
    }

    function onYearsChange() {
        value = years + (months / 12)
    }
</script>

<Row>
    <Col>
        <Input type="number" {...inputProps} bind:value={years} on:change={onYearsChange} />
    </Col>
    <Col>
        <Input type="number" bind:value={months} on:change={onMonthsChange} placeholder={_i18n._('MONTHS')} />
    </Col>
</Row>

