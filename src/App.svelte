<script lang="ts">
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
  import Account from "./components/Account.svelte";
  import Wallet from "./components/Wallet.svelte";
  import Auctions from "./components/Auctions.svelte";

  let activeAuctions = [];
  let auctiondetails = "";
  let connected = false;
  export let showWallet = false;

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
    auctiondetails = result;
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
    {#if !showWallet}
      <button on:click={() => (showWallet = !showWallet)}> show wallet </button>
    {:else}
      <button on:click={() => (showWallet = !showWallet)}> hide wallet </button>
      <Wallet/>
      {auctiondetails = ""}
    {/if}
    <Auctions/>
  {/if}
</main>
