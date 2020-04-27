<script>
  export let params = {};
  import { onMount } from "svelte";
  import config from "../config";
  import Cookies from "../Cookies";
  import {
    mealTypeToString,


    cookieUser,
    convertDateToAge,
    convertDateToString,
    customFetch
  } from "../helpers";
  import { push } from "svelte-spa-router";
  // import Meals from "./Meals.svelte";
  // import Children from "./Children.svelte";
  // import EatenMeals from "./EatenMeals.svelte";
  let c = new Cookies();
  let userLoaded = false;
  let mode = params.mode || "";

  let user = {};

  const toggleMode = () => {
    if (mode == "") {
      mode = "AddChild";
    } else if (mode == "AddChild") {
      mode = "AddMeal";
    } else {
      mode = "";
    }
  };

  const logout = () => {
    c.eraseCookie("user-jwt");
    push("/login");
  };

  const loadUser = () => {
    customFetch(`auth/me`)
      .then(res => {
        if (res.status === 403) {
          logout();
        } else {
          return res
        }
      })
      .then(res => {
        console.log('res :>> ', res.data);
        user = res.data

        userLoaded = true;
      });
  };

  onMount(() => loadUser());
</script>

{#if userLoaded}

  <h1>Hello {user.name}</h1>
  <h2>user role:{user.role}</h2>
  <h2>user email:{user.email}</h2>
  <button on:click={logout}>Logout</button>
  <br />
{#if user.role === "admin"}
  <a href="/#/users">Go to users</a>
{/if}

{:else}
  <h1>Loading...</h1>
{/if}
