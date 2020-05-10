<script>
  import { onMount } from "svelte";
  import { customFetch } from "../../helpers";
  import Table from "../../UI/Table.svelte";
  import Pagination from "../../UI/Pagination.svelte";
  let loaded = false;
  let errors = "";
  let rooms = [];
  let pagination = {};
  let sortBy;
  let showPagination = true;
  let showDeleted = false;
  let users = [];
  let userSelect = [];
  let selectedUsers = [];
  let selectedUser;

  const getUsersForSelect = async () => {
    loaded = false;
    let res = await customFetch(`users?select=name,_id&page=All`);
    userSelect = res.data;
    loaded = true;
  };

  const getAllChatRoomsPagination = e => getAllChatRooms({ page: e.detail });

  const getAllChatRoomsSort = e => getAllChatRooms({ sort: e.detail });

  const getAllChatRooms = async (action = {}) => {
    loaded = false;
    let res;
    if (action.page) {
      res = await customFetch(
        `messagerooms${action.page !== null ? `?page=${action.page}` : ""}${
          sortBy ? `&sort=${sortBy}` : ""
        }${showDeleted ? "&deleted=true" : ""}`
      );
    } else if (action.sort) {
      res = await customFetch(
        `messagerooms?sort=${action.sort.dir == "desc" ? "-" : ""}${
          action.sort.name
        }${showDeleted ? "&deleted=true" : ""}`
      );
    } else {
      res = await customFetch(
        `messagerooms${showDeleted ? "?deleted=true" : ""}`
      );
    }

    rooms = res.data;

    pagination = res.pagination;
    sortBy = res.sortBy;

    // if (pagination.total > 1) showPagination = true;
    loaded = true;
  };

  const addToUsersArray = async () => {
    let user = selectedUser.split("-");

    // if (!selectedUsers.includes(user[0])) {
    await selectedUsers.push({ user: user[0], name: user[1] });
    // }
    console.log("selectedUsers :>> ", selectedUsers);
  };

  const createChatRoom = async () => {
    let res = await customFetch(`messagerooms`, {
      method: "POST",
      body: { users: selectedUsers }
    });

    selectedUsers = [];
  };

  const submitForm = () => {
    if (selectedUsers.length < 2) {
      errors = "select 2 or more users";
    } else {
      createChatRoom();
    }
  };

  const toggleDeleted = () => {
    showDeleted = !showDeleted;
    getAllCompanies();
  };

  const deleteChatRoom = async id => {
    if (
      window.confirm(`Are you sure you want to delete chatroom with id:${id}`)
    ) {
      await customFetch(`messagerooms/${id}`, {
        method: "DELETE"
      });

      getAllChatRooms();
    }
  };
  onMount(() => {
    getAllChatRooms();
    getUsersForSelect();
  });
</script>

{#if loaded}

  <form class="auth-form" on:submit|preventDefault>
    <div style="color:red">{errors}</div>
    <div>
      {#each selectedUsers as s}
        {s}
        <br />
      {/each}
    </div>
    <label for="name">users</label>
    {#if userSelect.length > 1}
      <select
        name=""
        id=""
        on:change={addToUsersArray}
        bind:value={selectedUser}>
        {#each userSelect as user}
          <option value={`${user._id}-${user.name}`}>{user.name}</option>
        {/each}
      </select>
    {/if}
    <button on:click={submitForm}>Create new Room</button>
  </form>
  <button on:click={toggleDeleted}>toggle deleted</button>

  <Table headers={['id', 'users', 'slug', { col: 2, name: 'action' }]}>
    <tbody slot="body">
      {#each rooms as room}
        <tr>

          <td>{room._id}</td>
          <td>
            {#each room.users as rUser}
              {rUser.name}
              <br />
            {/each}
          </td>
          <td>{room.slug}</td>
          <td>
            <a href={`/#/room/${room.slug}`}>go to room</a>
          </td>
          <td>

            <button
              on:click={() => {
                deleteChatRoom(room._id);
              }}>
              delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
{/if}
