<script>
  export let params = {};
  import { onMount } from "svelte";
  import { customFetch, customFetchFileUpload } from "../../helpers";
  import config from "../../config";
  import Table from "../../UI/Table.svelte";
  let loaded = false;
  let userSelect = [];
  let errors = "";

  let company = {
    name: "",
    description: "",
    email: "",
    phone: "",
    user: "",
    website: ""
  };

  let newImage = {
    title: "",
    imageType: ""
  };

  let jobs = [];

  let ownerId = "";

  let files;

  const loadCompany = async () => {
    loaded = false;

    let res = await customFetch(`companies/${params.id}`);
    company = res.data;
    jobs = company.jobs;
    ownerId = company.user._id;
    loaded = true;
  };

  const getUsersForSelect = async () => {
    loaded = false;
    let res = await customFetch(`users?select=name,_id&page=All`);
    userSelect = res.data;
    loaded = true;
  };

  const uploadFile = async () => {
    let formData = new FormData();

    formData.append("file", files[0]);
    formData.append("title", newImage.title);
    formData.append("imageType", newImage.imageType);

    await customFetchFileUpload(`companies/${params.id}/photo`, {
      method: "PUT",
      body: formData
    });
    loadCompany();
  };

  const changeOwner = async () => {
    await customFetch(`companies/${params.id}`, {
      method: "PUT",
      body: { user: ownerId }
    });
  };

  const submitForm = () => {
    if (company.name == "") {
      errors = "Please enter all fields";
    } else {
      errors = "";
      updateCompany();
    }
  };

  const updateCompany = async () => {
    await customFetch(`companies/${params.id}`, {
      method: "PUT",
      body: company
    });
  };

  const restoreJob = id => {};
  const deleteJob = async id => {
    if (window.confirm(`Are you sure you want to delete job with id:${id}`)) {
      await customFetch(`jobs/${id}`, {
        method: "DELETE"
      });

      loadCompany();
    }
  };

  const addJob = async () => {
    let res = await customFetch(`companies/${params.id}/jobs`, {
      method: "POST",
      body: {
        title: "new job",
        description: "new desc",
        minimumSkill: "new desc",
        pay: "0"
      }
    });

    loadCompany();
  };

  onMount(() => {
    if (params.id) {
      loadCompany();
      getUsersForSelect();
    } else {
      loaded = true;
    }
  });
</script>

<style>
  .box {
    border: 1px solid black;
    width: 60%;
    padding: 1rem;
  }

  main {
    display: grid;
    grid-template-columns: 40% 60%;
  }
</style>

{#if loaded}
  <main>

    <section>
      {#if params.id}
        <form class="auth-from" on:submit|preventDefault>
          <div style="color:red">{errors}</div>
          <label for="name">company name</label>
          <input type="text" name="name" id="name" bind:value={company.name} />
          <label for="name">description</label>
          <textarea bind:value={company.description} />
          <label for="name">website</label>
          <input
            type="text"
            name="name"
            id="name"
            bind:value={company.website} />
          <label for="name">address</label>
          <input
            type="text"
            name="name"
            id="name"
            bind:value={company.address} />
          <label for="name">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            bind:value={company.email} />
          <label for="name">Owner</label>
          {#if userSelect.length > 1}
            <select name="" id="" bind:value={company.user}>
              {#each userSelect as user}
                <option
                  value={user._id}
                  selected={company.user._id == user._id && true}>
                  {user.name}
                </option>
              {/each}
            </select>
          {/if}
          <br />
          <button on:click={submitForm}>Update Company</button>
        </form>

        <div class="box">
          <input type="text" bind:value={newImage.title} />
          <br />
          <select name="" id="" bind:value={newImage.imageType}>
            <option value="logos">logos</option>
            <option value="teams">teams</option>
            <option value="sites">sites</option>
          </select>
          <br />
          <!-- <img src={`${config.imageUrl}${company.photo}`} alt="" /> -->
          <br />
          <input type="file" bind:files />
          <button on:click={uploadFile}>add</button>
        </div>
      {:else}create new{/if}
    </section>
    <section>
      <h3>jobs</h3>
      <button on:click={addJob}>ADD JOB</button>
      {#if jobs}
        {#each jobs as job}
          <Table
            headers={['title', 'pay', 'skills', { name: 'actions', col: 2 }]}
            pagination={false}>
            <tbody slot="body">
              <td>{job.title}</td>
              <td>{job.pay}</td>
              <td>{job.minimumSkill}</td>
              <td>
                {#if job.deleted}
                  <button
                    on:click={() => {
                      restoreJob(job._id);
                    }}>
                    restore
                  </button>
                {:else}
                  <a href={`/#/jobs/${job._id}`}>edit</a>
                {/if}
              </td>
              <td>
                <button
                  on:click={() => {
                    deleteJob(job._id);
                  }}>
                  delete
                </button>
              </td>
            </tbody>
          </Table>
        {/each}
      {:else}
        <h3>NO JOBS</h3>
      {/if}
    </section>
  </main>
{/if}
