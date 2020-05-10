<script>
  export let params;

  import { onMount } from "svelte";
  import { customFetch } from "../helpers";

  let loaded = false;
  let message = {};
  let messages = [];
  let roomUsers = [];
  let room = {};
  let text = "";

  const loadRoom = async () => {
    loaded = false;
    let res = await customFetch(`messagerooms/slug/${params.slug}`);
    room = res.data;

    roomUsers = room.users;
    messages = room.messages;
    loaded = true;
  };

  const getUserName = id => {
    let th = roomUsers.filter(user => user._id === id);

    return th[0].name;
  };

  const addMessage = async () => {
    message = {
      room: room._id,
      text: text
    };

    await customFetch(`messages`, {
      method: "POST",
      body: message
    });
    text = "";
    loadRoom();
  };

  onMount(() => loadRoom());
</script>

{#if messages.length > 0 && loaded}

  {#each messages as mes}
    {getUserName(mes.user)}: {mes.text}
    <br />
  {/each}
{/if}

<form on:submit|preventDefault>
  <textarea name="" id="" cols="30" rows="10" bind:value={text} />
  <button on:click={addMessage}>add</button>
</form>
