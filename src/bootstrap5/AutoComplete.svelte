<script>
    import { Button, Tooltip } from 'sveltestrap';

    const _str = globalThis.c('string-utils')

    export let value
    export let choices = [{key: 1, val: 'Apple'}, {key: 2, val: 'Banana'}]

    let id = _str.randomHash()
</script>

<Button {id}>Trigger Popup</Button>
<Tooltip target={id} placement="bottom">
    Some <p>Drop</p>-Down
</Tooltip>