<script>
  import { push } from "svelte-spa-router";
  import config from "../config";
  import { waitFor, customFetch } from "../helpers";
  import Cookies from "../Cookies";
  let c = new Cookies();
  let user = {
    name: "",
    email: "",
    password: "",
    role: ""
  };

  let errors = "";

  const createUser = async user => {
    let data = customFetch(`auth/register`, {
      method: "POST",
      body: user
    });

    return data;
  };

  const submitRegisterForm = () => {
    if (user.name == "" || user.email == "" || user.password == "") {
      errors = "Please enter all fields";
    } else {
      errors = "";
      createUser(user)
        .then(res => c.setCookie("user-jwt", JSON.stringify(res.data), 1))
        .then(res => location.assign("/"));
    }
  };
</script>

<h1>Register</h1>
<!-- <a href="#/Login">Login</a> -->

<form class="auth-from" on:submit|preventDefault>
  <div style="color:red">{errors}</div>
  <label for="name">Username</label>
  <input type="text" name="name" id="name" bind:value={user.name} />
  <label for="name">Email</label>
  <input type="text" name="email" id="email" bind:value={user.email} />
  <label for="Role">Role</label>
  <select name="role" id="role" bind:value={user.role}>
    <option value="user">user</option>
    <option value="company">company</option>
    <option value="recruiter">recruiter</option>

  </select>
  <label for="password">Password</label>
  <input
    type="password"
    name="password"
    id="password"
    bind:value={user.password} />
  <button on:click={submitRegisterForm}>Submit</button>
</form>
