<script>
    export let max = 5
    export let value
    export let classes = ''
    export let style = ''
</script>

<style>
    .boost-star {cursor: pointer; font-size: 1.5em; color: darkorange;}
    .boost-star:hover {color: darkred}
</style>

{#each new Array(max).fill(0) as _, i}
    <span class="boost-star {classes}" {style} on:click={() => value = (i + 1)}>
        {value > i ? '★' : '☆'}
    </span>
{/each}