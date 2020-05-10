<script>
  export let params = {};
  import { onMount } from "svelte";
  import config from "../config";
  import Cookies from "../Cookies";
  import AdminDashboard from "./admin/Dashboard.svelte";
  import CompanyDashboard from "./company/Dashboard.svelte";
  import {
    mealTypeToString,
    cookieUser,
    convertDateToAge,
    convertDateToString,
    customFetch
  } from "../helpers";
  import { push } from "svelte-spa-router";

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
          return res;
        }
      })
      .then(async res => {
        user = res.data;

        if (res.data.role === "company") {
        }

        userLoaded = true;
      });
  };

  onMount(() => loadUser());
</script>

{#if userLoaded}

  {#if user.role === 'admin'}
    <AdminDashboard {user} />
  {:else if user.role === 'company'}
    <CompanyDashboard {user} />

  {:else if user.role === 'recruiter'}
    {user.role}
  {:else if user.role === 'user'}{user.role}{/if}
{:else}
  <h1>Loading...</h1>
{/if}
