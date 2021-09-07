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
    let selectedItem = null
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
        selectedItem = i
        value = valueAdapter(i)
        searchKey = ''
    }

    function onRemove() {
        selectedItem = null
        value = null
    }

    $: fetchList(searchKey)
</script>

<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    <DropdownToggle tag="div" class="d-inline-block w-100">
        <Input size="sm" type="search" bind:value={searchKey} autocomplete="off"
               {placeholder} {invalid} {id} {name} {required} {feedback} {hidden} />
    </DropdownToggle>
    <DropdownMenu class="w-100">
        {#each list as item}
            <DropdownItem on:click={_ => onSelect(item)}>
                {#if listItemTemplate}
                    {#if htmlTemplates}
                        {@html listItemTemplate(item)}
                    {:else}
                        {listItemTemplate(item)}
                    {/if}
                {:else}
                    <slot name="item" {item}>{item}</slot>
                {/if}
            </DropdownItem>
        {/each}
    </DropdownMenu>
</Dropdown>
{#if selectedItem != null}
    <Badge pill>
        {#if selectedItemTemplate}
            {#if htmlTemplates}
                {@html selectedItemTemplate(selectedItem)}
            {:else}
                {selectedItemTemplate(selectedItem)}
            {/if}
        {:else}
            <slot name="selected-item" item={selectedItem}>{selectedItem}</slot>
        {/if}
        <FaIcon key="times-circle" style="cursor: pointer" on:click={_ => onRemove()}>&times;</FaIcon>
    </Badge>
{:else}
    {#if error == null}
        <Badge pill color="white" class="text-muted">{_i18n._('TYPE_TO_FIND_AND_SELECT')}</Badge>
    {:else}
        <Badge pill color="white" class="text-danger">{_i18n._(error)}</Badge>
    {/if}
{/if}