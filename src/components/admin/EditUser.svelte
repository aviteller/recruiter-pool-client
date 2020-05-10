<script>
  export let params = {};
  import { onMount } from "svelte";
  import { customFetch } from "../../helpers";
  let loaded = false;

  let user = {
    name: "",
    email: "",
    role: ""
  };

  let errors = "";

  const loadUser = async () => {
    loaded = false;

    let res = await customFetch(`users/${params.id}`);

    user = {
      name: res.data.name,
      email: res.data.email,
      role: res.data.role
    };
    loaded = true;
  };
  const updateUser = async user => {
    await customFetch(`users/${params.id}`, {
      method: "PUT",
      body: user
    });

    errors = "UPDATED";
  };

  const submitForm = () => {
    if (user.name == "" || user.email == "") {
      errors = "Please enter all fields";
    } else {
      errors = "";
      updateUser(user);
    }
  };

  onMount(() => loadUser());
</script>

{#if loaded}

  <form class="auth-from" on:submit|preventDefault>
    <div style="color:red">{errors}</div>
    <label for="name">Username</label>
    <input type="text" name="name" id="name" bind:value={user.name} />
    <label for="name">Email</label>
    <input type="text" name="email" id="email" bind:value={user.email} />
    <label for="Role">Role</label>
    {#if user.role === 'admin'}
      ADMIN ROLE CANNOT BE EDITED
    {:else}
      <select name="role" id="role" bind:value={user.role}>
        <option value="user">user</option>
        <option value="company">company</option>
        <option value="recruiter">recruiter</option>
      </select>
    {/if}
    <br />
    <button on:click={submitForm}>Update User</button>
  </form>
{:else}
  <h1>LOADING</h1>
{/if}
