<script lang="ts">
  import Navbar from "./components/Navbar.svelte";
  import style from "./styling.svelte";
  import {
    bootstrap,
    onAccountAvailable
  } from "@stakeordie/griptape.js";
  import Account from "./components/Account.svelte";
  import Wallet from "./components/Wallet.svelte";
  import Auctions from "./components/Auctions.svelte";
  import CreateAuction from "./components/CreateAuction.svelte";

  let connected = false;
  let showWallet = false;
  let showCreate = false;

  function ToggleWallet() {
    showCreate = false;
    showWallet = !showWallet;
  }

  function ToggleCreate() {
    showCreate = !showCreate;
    showWallet = false;
  }

  onAccountAvailable(() => {
    connected = true;
  });
</script>

<main>
  <Navbar />

  {#if !connected}
    <h1>Welcome to The secret network auction house!</h1>
    <p>Please connect your wallet to continue.</p>
    <button on:click={bootstrap}> connect </button>
  {:else}
    <Account />
    {#if !showCreate}
      <button on:click={() => ToggleCreate()}> create an auction</button>
    {:else}
      <button on:click={() => ToggleCreate()}> Show active auction</button>
    {/if}
    
    {#if !showWallet}
      <button on:click={() => ToggleWallet()}> Show wallet </button>
    {:else}
      <button on:click={() => ToggleWallet()}> Hide wallet </button>
      <Wallet/>
    {/if}

    {#if !showCreate}
      <Auctions/>
    {:else}
      <CreateAuction/>
    {/if}
  {/if}
</main>
