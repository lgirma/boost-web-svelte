<script>
    import {
        DropdownItem,
        DropdownMenu,
        DropdownToggle,
        Dropdown,
        Input,
        Badge
    } from 'sveltestrap';
    import FaIcon from '../fontawesome5/Icon.svelte'
    import {onMount} from 'svelte'

    const _str = globalThis.c('string-utils')
    const _i18n = globalThis.c('i18n')

    export let value = null
    export let dataSourceFactory // searchKey => dataSource
    export let adapter = null
    export let multiple = false
    export let valueAdapter = _ => _
    export let selectedItemTemplate = null
    export let listItemTemplate = null
    export let htmlTemplates = false

    export let placeholder = null
    export let id = null
    export let name = null
    export let feedback = null
    export let required = null
    export let invalid = null
    export let hidden = null
    export let minChars = 0

    let isOpen = false
    let searchKey = ''
    let selectedItems = []
    let error = null

    let list = []

    async function fetchList(key) {
        if (key.length < minChars) {
            return
        }
        const dataSource = dataSourceFactory(key)
        try {
            list = await dataSource.read(adapter)
            isOpen = true
            error = null
        } catch (e) {
            error = 'FAILED_TO_FETCH'
        }
    }

    function onSelect(i) {
        if (multiple) {
            selectedItems = [...selectedItems, i]
            value = selectedItems.map(valueAdapter)
        }
        else {
            selectedItems = [i]
            value = valueAdapter(i)
        }
        searchKey = ''
    }

    function onRemove(i) {
        if (multiple) {
            selectedItems = selectedItems.filter(itm => itm !== i)
            value = selectedItems.map(valueAdapter)
        }
        else {
            selectedItems = []
            value = null
        }
    }

    $: fetchList(searchKey)

    onMount(() => {

    })
</script>

<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    <DropdownToggle tag="div" class="d-inline-block w-100">
        <Input size="sm" type="search" bind:value={searchKey} autocomplete="off"
               {placeholder} {invalid} {id} {name} {required} {feedback} {hidden} />
    </DropdownToggle>
    <DropdownMenu class="w-100">
        {#each list as item}
            <DropdownItem on:click={_ => onSelect(item)} disabled={selectedItems.indexOf(item) > -1}>
                {#if listItemTemplate}
                    {#if htmlTemplates}
                        {@html listItemTemplate(item)}
                    {:else}
                        {listItemTemplate(item)}
                    {/if}
                {:else}
                    <slot name="item" {item}>{item}</slot>
                {/if}
                {#if selectedItems.indexOf(item) > -1}
                    <FaIcon key="check" />
                {/if}
            </DropdownItem>
        {/each}
        <DropdownItem disabled class="text-center"><small>{_i18n._('POSSIBLE_MORE_TYPE_TO_FIND')}</small></DropdownItem>
    </DropdownMenu>
</Dropdown>
{#each selectedItems as selectedItem}
    <Badge pill class="me-1">
        {#if selectedItemTemplate}
            {#if htmlTemplates}
                {@html selectedItemTemplate(selectedItem)}
            {:else}
                {selectedItemTemplate(selectedItem)}
            {/if}
        {:else}
            <slot name="selected-item" item={selectedItem}>{selectedItem}</slot>
        {/if}
        <FaIcon key="times-circle" style="cursor: pointer" on:click={_ => onRemove(selectedItem)}>&times;</FaIcon>
    </Badge>
{:else}
    {#if error == null}
        <Badge pill color="white" class="text-muted">{_i18n._('TYPE_TO_FIND_AND_SELECT')}</Badge>
    {:else}
        <Badge pill color="white" class="text-danger">{_i18n._(error)}</Badge>
    {/if}
{/each}