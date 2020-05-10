<script>
  export let user;
  console.log('user :>> ', user);
</script>

{#if user.company}
  {user.name}
  COMPANY
  {user.company.name}
{:else}
  <button>ADD COMPANY</button>
{/if}