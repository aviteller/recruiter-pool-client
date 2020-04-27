<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const switchPage = page => dispatch("switchpage", page);

  export let pagination;
</script>

{#if pagination.total > 1}
  {#if pagination.prev}
    <button on:click|preventDefault={() => switchPage(pagination.prev.page)}>
      prev
    </button>
  {/if}
  {#each Array(pagination.total) as _, page}
    {#if pagination.current == page + 1}
      <button style="color:red">{page + 1}</button>
    {:else}
      <button on:click|preventDefault={() => switchPage(page + 1)}>
        {page + 1}
      </button>
    {/if}
  {/each}
  {#if pagination.next}
    <button on:click|preventDefault={() => switchPage(pagination.next.page)}>
      next
    </button>
  {/if}
  <button on:click|preventDefault={() => switchPage('All')}>ALL</button>
{/if}
<span>
  <!-- TO BE SERIOUSLY LOOKED AT  -->
  results {pagination.current == 1 ? 1 : pagination.limit * pagination.current - pagination.limit + 1}
  - {pagination.current * pagination.limit >= pagination.totalRows ? pagination.totalRows : pagination.current * pagination.limit}
  out of {pagination.totalRows}
</span>
