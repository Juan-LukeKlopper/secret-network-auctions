<script lang="ts">
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar.svelte";
  import style from "./styling.svelte";
  import { auctionFactory } from "./contracts/auction-factory";
  import {
	bootstrap,
	getAddress,
	onAccountAvailable,
	getNativeCoinBalance,
	coinConvert
} from  '@stakeordie/griptape.js';

  let activeAuctions = [];
  let address,balance;
  let connected = false;

  async function listActiveAuction() {
    const {
      list_active_auctions: { active: results },
    } = await auctionFactory.listActiveAuctions();
    activeAuctions = results;
  }

  async function getBalance() {
    let scrtbalance = await getNativeCoinBalance();
    scrtbalance = coinConvert(scrtbalance, 6, "human");
    balance = scrtbalance;
  }

  onAccountAvailable(() => {
		address = getAddress();
		getBalance();
    connected = true;
	})

  onMount(() => {
    listActiveAuction();
  });
</script>

<main>
  <Navbar />
  <h1>Hello Typescript!</h1>
  <button on:click={bootstrap}> connect </button>

  {#if connected}
    <p>Your address is: {address}</p>
    <p>Your balance is : {balance}</p>
  {/if}

  <p>Active auctions</p>
  <ul>
    {#each activeAuctions as auction}
      <li>{auction.label}</li>
      <li>{auction.address}</li>
    {/each}
  </ul>
</main>