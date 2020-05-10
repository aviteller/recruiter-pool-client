<script>
  import routes from "./routes";
  import Router from "svelte-spa-router";
  import Header from "./UI/Header.svelte";
</script>

<style>
  main {
   margin: 5rem;
   color: rgb(110, 110, 110);
  }
</style>

<Header />
<main style=" ">
  <section>
    <Router {routes} />
  </section>
</main>
