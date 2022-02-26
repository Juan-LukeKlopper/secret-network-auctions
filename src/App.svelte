<script lang="ts">
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar.svelte";
  import style from "./styling.svelte";
  import { auctionFactory } from "./contracts/auction-factory";
  import {
    bootstrap,
    createContract,
    getAddress,
    onAccountAvailable,
    getNativeCoinBalance,
    coinConvert,
    refContract,
  } from "@stakeordie/griptape.js";
  import { auctionDef } from "./contracts/auction";
  import type { Auction } from "./contracts/types";
  import { loop_guard } from "svelte/internal";
  import Account from "./components/Account.svelte";

  let activeAuctions = [];
  let auction = "";
  let connected = false;

  function initAuctions(activeAuctions) {
    activeAuctions.forEach((item) =>
      createContract({
        id: item.address,
        at: item.address,
        definition: auctionDef,
      })
    );
  }

  async function listActiveAuction() {
    const {
      list_active_auctions: { active: results },
    } = await auctionFactory.listActiveAuctions();
    activeAuctions = results;
    initAuctions(activeAuctions);
  }

  async function getAuctionInfo(address) {
    const auctionContract = refContract(address);
    const { auction_info: result } = await auctionContract.getAuctionInfo();
    auction = result;
  }

  onAccountAvailable(() => {
    connected = true;
  });

  onMount(() => {
    listActiveAuction();
  });
</script>

<main>
  <Navbar />
  

  {#if !connected}
    <h1>Welcome to The secret network auction house!</h1>
    <button on:click={bootstrap}> connect </button>
  {:else}
      <Account />
  {/if}

  <p>Active auctions</p>

  {#each activeAuctions as auction}
    <li>
      {auction.label}
      <button on:click={() => getAuctionInfo(auction.address)}
        >get more info</button>
    </li>
  {/each}

  {#if auction != ""}
    <p>
      {auction.sell_token.token_info.symbol} - {auction.bid_token.token_info.symbol} auction
    </p>
    <p>Auction address: {auction.auction_address}</p>
    <p>description: {auction.description}</p>
    <p>Closes at: {auction.ends_at}</p>

    {console.log(auction.status.toString())}
  {/if}
</main>
