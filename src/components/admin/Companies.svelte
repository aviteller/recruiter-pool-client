<script>
  import { onMount } from "svelte";
  import { customFetch } from "../../helpers";
  import config from "../../config";
  import Table from "../../UI/Table.svelte";
  import Pagination from "../../UI/Pagination.svelte";
  import LoadingSpinner from "../../UI/LoadingSpinner.svelte";
  // import EditCompany from "./EditCompany.svelte";
  let loaded = false;
  let errors = "";
  let companies = [];
  let pagination = {};
  let sortBy;
  let showPagination = true;
  let showDeleted = false;

  const getAllCompaniesPagination = e => getAllCompanies({ page: e.detail });

  const getAllCompaniesSort = e => getAllCompanies({ sort: e.detail });

  const getAllCompanies = async (action = {}) => {
    loaded = false;
    let res;
    if (action.page) {
      res = await customFetch(
        `companies${action.page !== null ? `?page=${action.page}` : ""}${
          sortBy ? `&sort=${sortBy}` : ""
        }${showDeleted ? "&deleted=true" : ""}`
      );
    } else if (action.sort) {
      res = await customFetch(
        `companies?sort=${action.sort.dir == "desc" ? "-" : ""}${
          action.sort.name
        }${showDeleted ? "&deleted=true" : ""}`
      );
    } else {
      res = await customFetch(`companies${showDeleted ? "?deleted=true" : ""}`);
    }

    companies = res.data;

    pagination = res.pagination;
    sortBy = res.sortBy;

    // if (pagination.total > 1) showPagination = true;
    loaded = true;
  };

  const deleteCompany = async id => {
    if (
      window.confirm(`Are you sure you want to delete company with id:${id}`)
    ) {
      await customFetch(`companies/${id}`, {
        method: "DELETE"
      });

      getAllCompanies();
    }
  };
  const restoreCompany = async id => {
    await customFetch(`companies/${id}`, {
      method: "PUT",
      body: { deleted: false }
    });

    getAllCompanies();
  };

  const toggleDeleted = () => {
    showDeleted = !showDeleted;
    getAllCompanies();
  };

  onMount(() => getAllCompanies());
</script>

{#if loaded}
  <button on:click={toggleDeleted}>toggle deleted</button>
  <Table
    headers={['image', { name: 'user', sortable: true }, { name: 'name', sortable: true }, { name: 'email', sortable: true }, 'address', 'No of jobs', { name: 'createdAt', sortable: true }, { name: 'actions', col: 2 }]}
    pagination={showPagination}
    {sortBy}
    on:changesort={getAllCompaniesSort}>
    <tbody slot="body">

      {#each companies as company}
        <tr>
          <td>
            <img
              src={`${config.imageUrl}${company.photo}`}
              alt=""
              height="50"
              width="50" />
          </td>
          <td>{company.user.name}</td>
          <td>{company.name}</td>
          <td>{company.email}</td>
          <td>{company.location.formattedAddress}</td>
          <td>{company.jobs.length}</td>
          <td>{company.createdAt}</td>
          <td>
            {#if company.deleted}
              <button
                on:click={() => {
                  restoreCompany(company._id);
                }}>
                restore
              </button>
            {:else}
              <a href={`/#/admin/companies/${company._id}`}>edit</a>
            {/if}
          </td>
          <td>
            <button
              on:click={() => {
                deleteCompany(company._id);
              }}>
              delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot slot="pagination">
      <tr>
        <Pagination {pagination} on:switchpage={getAllCompaniesPagination} />
      </tr>
    </tfoot>
  </Table>
{:else}
  <LoadingSpinner />
{/if}
