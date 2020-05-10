<script>
  export let params = {};
  import { onMount } from "svelte";
  import { customFetch, customFetchFileUpload } from "../../helpers";

  let job = {
    title: "",
    description: "",
    pay: "",
    minimumSkill: "",
    company: ""
  };
  let errors = "";
  let loaded = false;
  let companiesSelect = [];

  const getCompaniesForSelect = async () => {
    loaded = false;
    let res = await customFetch(
      `companies?select=name,_id&page=All&nopop=true`
    );
    companiesSelect = res.data;
    loaded = true;
  };

  const loadJob = async () => {
    loaded = false;

    let res = await customFetch(`jobs/${params.id}`);
    job = res.data;

    loaded = true;
  };

  const updateJob = async () => {
    await customFetch(`jobs/${params.id}`, {
      method: "PUT",
      body: job
    });
  };

  const submitForm = () => {
    if (job.title == "") {
      errors = "Please enter all fields";
    } else {
      errors = "";
      updateJob();
    }
  };

  onMount(() => {
    if (params.id) {
      loadJob();
    } else {
      loaded = true;
    }
    getCompaniesForSelect();
  });
</script>

{#if loaded}

  <form class="auth-from" on:submit|preventDefault>
    <div style="color:red">{errors}</div>
    <label for="name">Title</label>
    <input type="text" name="name" id="name" bind:value={job.title} />
    <label for="name">Pay</label>
    <input type="text" name="name" id="name" bind:value={job.pay} />
    <label for="name">skill</label>
    <input type="text" name="name" id="name" bind:value={job.minimumSkill} />
    <label for="name">description</label>
    <textarea bind:value={job.description} />
    <label for="name">Owner</label>
    {#if companiesSelect.length > 1}
      <select name="" id="" bind:value={job.company}>
        {#each companiesSelect as company}
          <option
            value={company._id}
            selected={job.company._id == company._id && true}>
            {company.name}
          </option>
        {/each}
      </select>
    {/if}
    <br />
    <button on:click={submitForm}>Update Job</button>
  </form>
{:else}
  <h3>LOADING</h3>
{/if}
