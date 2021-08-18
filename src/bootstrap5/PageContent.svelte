<script>
    import {Row, Col} from 'sveltestrap'
</script>

<Row class="mb-1 mt-1">
    <Col sm="12" md="2" />
    <Col>
        <slot name="title"/>
    </Col>
    <Col sm="12" md="2" />
</Row>
<Row class="mb-1 mt-1">
    <Col sm="12" md="2">
        <slot name="left" />
    </Col>
    <Col>
        <slot name="content" />
    </Col>
    <Col sm="12" md="2">
        <slot name="right" />
    </Col>
</Row>