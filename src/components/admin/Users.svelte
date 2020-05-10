<script>
  import { onMount } from "svelte";
  import { customFetch } from "../../helpers";
  import Table from "../../UI/Table.svelte";
  import LoadingSpinner from "../../UI/LoadingSpinner.svelte";
  import Pagination from "../../UI/Pagination.svelte";
  // import EditUser from "./EditUser.svelte";
  let loaded = false;
  let errors = "";
  let users = [];
  let pagination = {};
  let sortBy;
  let showPagination = true;
  let showDeleted = false;

  let newUser = {
    name: "",
    email: "",
    role: "user"
  };

  const submitForm = () => {
    // console.log(newUser)
    if (newUser.name == "" || newUser.email == "") {
      errors = "Please enter all fields";
    } else {
      errors = "";
      createUser(newUser);
    }
  };

  const createUser = async user => {
    await customFetch(`users`, {
      method: "POST",
      body: user
    });

    newUser = {
      name: "",
      email: "",
      role: "user"
    };

    getAllUsers();
  };

  const getAllUsersPagination = e => getAllUsers({ page: e.detail });

  const getAllUsersSort = e => getAllUsers({ sort: e.detail });

  const getAllUsers = async (action = {}) => {
    loaded = false;
    let res;
    if (action.page) {
      res = await customFetch(
        `users${action.page !== null ? `?page=${action.page}` : ""}${
          sortBy ? `&sort=${sortBy}` : ""
        }${showDeleted ? "&deleted=true" : ""}`
      );
    } else if (action.sort) {
      res = await customFetch(
        `users?sort=${action.sort.dir == "desc" ? "-" : ""}${action.sort.name}${
          showDeleted ? "&deleted=true" : ""
        }`
      );
    } else {
      res = await customFetch(`users${showDeleted ? "?deleted=true" : ""}`);
    }

    users = res.data;
    pagination = res.pagination;
    sortBy = res.sortBy;

    // if (pagination.total > 1) showPagination = true;
    loaded = true;
  };

  const deleteUser = async id => {
    if (window.confirm(`Are you sure you want to delete user with id:${id}`)) {
      await customFetch(`users/${id}`, {
        method: "DELETE"
      });

      getAllUsers();
    }
  };
  const restoreUser = async id => {
    await customFetch(`users/${id}`, {
      method: "PUT",
      body: { deleted: false }
    });

    getAllCompanies();
  };

  const toggleDeleted = () => {
    showDeleted = !showDeleted;
    getAllUsers();
  };
  onMount(() => getAllUsers());
</script>

<style>
  .auth-form {
    display: flex;
    justify-content: space-between;
  }
</style>

<!-- <EditUser/> -->
<form class="auth-form" on:submit|preventDefault>
  <div style="color:red">{errors}</div>
  <label for="name">Username</label>
  <input type="text" name="name" id="name" bind:value={newUser.name} />
  <label for="name">Email</label>
  <input type="text" name="email" id="email" bind:value={newUser.email} />
  <label for="Role">Role</label>
  <select name="role" id="role" bind:value={newUser.role}>
    <option value="user">user</option>
    <option value="company">company</option>
    <option value="recruiter">recruiter</option>
  </select>

  <button on:click={submitForm}>Create New User</button>
</form>

{#if loaded}
  <button on:click={toggleDeleted}>toggle deleted</button>
  <Table
    headers={[{ name: 'name', sortable: true }, { name: 'email', sortable: true }, { name: 'role', sortable: true }, { name: 'createdAt', sortable: true }, { name: 'actions', col: 2 }]}
    pagination={showPagination}
    {sortBy}
    on:changesort={getAllUsersSort}>
    <tbody slot="body">

      {#each users as user}
        <tr>

          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>{user.createdAt}</td>
          <td>
            {#if user.deleted}
              <button
                on:click={() => {
                  restoreUser(user._id);
                }}>
                restore
              </button>
            {:else}
              <a href={`/#/admin/users/${user._id}`}>edit</a>
            {/if}
          </td>
          <td>
            <button
              on:click={() => {
                deleteUser(user._id);
              }}>
              delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot slot="pagination">
      <tr>
        <Pagination {pagination} on:switchpage={getAllUsersPagination} />
      </tr>
    </tfoot>
  </Table>
{:else}
  <LoadingSpinner />
{/if}
