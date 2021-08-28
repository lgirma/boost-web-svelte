<script>
    import FaIcon from '../fontawesome5/Icon.svelte'
    import {Row, Col} from 'sveltestrap'

    const _str = globalThis.c('string-utils')

    export let icon
    export let label
    export let value
    export let numeric = false
    export let unit = ""
</script>

<Row>
    <Col class="text-muted">
        <span>
            <FaIcon key={icon} style="opacity: 0.5" /> {_str.humanized_i18n(label)}
        </span>
    </Col>
    <Col class="fs-5">
        <span class:float-end={numeric} style="{numeric ? 'font-family: monospace' : ''}">
            {value} <span class="text-muted">{_str.humanized_i18n(unit)}</span>
        </span>
    </Col>
</Row>