<script>
    import {Row, Col} from 'sveltestrap'

    export let colWidthsMobile = ['9', '', '12']
    export let colWidthsDesktop = ['2', '', '2']
</script>

<Row class="mb-1 mt-1">
    <Col sm="12" md="2" />
    <Col>
        <slot name="title"/>
    </Col>
    <Col sm="12" md="2" />
</Row>
<Row class="mb-1 mt-1">
    <Col sm={colWidthsMobile[0] || undefined} md={colWidthsDesktop[0] || undefined}>
        <slot name="left" />
    </Col>
    <Col sm={colWidthsMobile[1] || undefined} md={colWidthsDesktop[1] || undefined}>
        <slot name="content" />
    </Col>
    <Col sm={colWidthsMobile[2] || undefined} md={colWidthsDesktop[2] || undefined}>
        <slot name="right" />
    </Col>
</Row>