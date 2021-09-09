<script>
    export let column
    export let filter
    import {FaIcon} from "../fontawesome5";

    $: sort = filter.sort.find(s => s.by === column.id)

    function onClick() {
        if (!column.sortable)
            return
        filter = {
            ...filter,
            sort: (srt => {
                if (srt == null)
                    return [...filter.sort, {by: column.id, desc: false}]
                else if (!srt.desc)
                    return filter.sort.map(s => s.by === column.id ? {...s, desc: true} : s)
                else
                    return filter.sort.filter(s => s.by !== column.id)
            })(sort)
        }
    }
</script>

<style>
    .header {
        font-weight: normal;
    }
    .header:hover {
        background: white !important;
    }
</style>

<th class="header" style="{column.sortable ? 'cursor: pointer' : ''}"
    on:click={onClick} class:fw-bold={!!sort} class:bg-light={sort == null}>
    {column.header}
    {#if column.sortable}
        <span class="float-end text-muted" style="opacity: 0.5;">
            {#if sort == null}
                <FaIcon key="sort" />
            {:else if sort.desc}
                <FaIcon key="sort-up" />
            {:else}
                <FaIcon key="sort-down" />
            {/if}
        </span>
    {/if}
</th>