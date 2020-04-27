<script>
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let headers;
  export let pagination = false;
  export let sortBy = null;

  const setSort = sort => {

    if (sort.charAt(0) === "-") {
      sortBy = {
        name: sort.slice(1),
        dir: "desc"
      };
    } else {
      sortBy = {
        name: sort,
        dir: "asc"
      };
    }


  };

  const changeSort = (name, dir) => {
    dispatch("changesort", { name, dir });
  };
  onMount(() => setSort(sortBy));
</script>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    background-color: #f2f2f2;
  }

  th {
    text-align: left;
    padding: 8px;
    border-bottom: 1px black solid;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  table :global(tr:hover) {
    background-color: grey !important;
  }

  table :global(tr:nth-child(even)) {
    background-color: #f2f2f2;
  }

  table :global(td) {
    border-bottom: 1px solid #ddd;
  }
</style>

<table>
  <thead>
    <tr>
      {#each headers as header}
        {#if typeof header == 'object'}
          {#if header.col && header.sortable}
            {#if sortBy.name === header.name}
              <th colspan={header.col}>
                >
                <button
                  on:click|preventDefault={() => changeSort(header.name, sortBy.dir === 'asc' ? 'desc' : 'asc')}>
                  {header.name} {sortBy.dir ? 'desc' : 'asc'}
                </button>

              </th>
            {:else}
              <th colspan={header.col}>
                <button
                  on:click|preventDefault={() => changeSort(header.name, 'desc')}>
                  {header.name}
                </button>
              </th>
            {/if}
          {:else if header.sortable}
            {#if sortBy.name === header.name}
              <th>
                <button
                  on:click|preventDefault={() => changeSort(header.name, sortBy.dir === 'asc' ? 'desc' : 'asc')}>
                  {header.name} {sortBy.dir === 'asc' ? 'asc' : 'desc'}
                </button>
              </th>
            {:else}
              <th>
                <button
                  on:click|preventDefault={() => changeSort(header.name, 'desc')}>
                  {header.name}
                </button>
              </th>
            {/if}
          {:else if header.col}
            <th colspan={header.col}>{header.name}</th>
          {/if}
        {:else}
          <th>{header}</th>
        {/if}
      {/each}
    </tr>
  </thead>

  <slot name="body" />

  {#if pagination}
    <slot name="pagination" />
  {/if}

</table>
