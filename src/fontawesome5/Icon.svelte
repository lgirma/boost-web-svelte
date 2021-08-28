<script>
    import {MessageType} from "boost-web";

    export let messageType = null
    export let key = ''
    export let spin = false
    export let type = 'solid'
    export let style = undefined
    let className = ''
    export {className as class}

    const SolidMsgIcons = {
        [MessageType.NONE]: 'fas fa-info-circle',
        [MessageType.INFO]: 'fas fa-info-circle',
        [MessageType.WARNING]: 'fas fa-exclamation-triangle',
        [MessageType.SUCCESS]: 'fas fa-check-circle',
        [MessageType.ERROR]: 'fas fa-times-circle'
    }

    const RegularMsgIcons = {
        [MessageType.NONE]: 'fas fa-info',
        [MessageType.INFO]: 'fas fa-info',
        [MessageType.WARNING]: 'fas fa-exclamation',
        [MessageType.SUCCESS]: 'far fa-check-circle',
        [MessageType.ERROR]: 'far fa-times-circle'
    }

</script>

{#if messageType != null}
    <i class="{(type === 'solid' ? SolidMsgIcons : RegularMsgIcons)[messageType]} {className}" {style} class:fa-spin={spin}></i>
{:else}
    <i class="fa{{solid: 's', regular: 'r', brand: 'b'}[type]} fa-{key} {className}" {style} class:fa-spin={spin}></i>
{/if}