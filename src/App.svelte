<script lang="ts">
	import Navbar from "./components/Navbar.svelte";
  import { onMount } from "svelte";
	import { bootstrap } from "@stakeordie/griptape.js";
  import { auctionFactory } from "./contracts/auction-factory";

	function connect() {
		bootstrap();
	}

  let activeAuctions = [];
  
  async function listActiveAuction() {
    const {list_active_auctions: { active: results } } = await auctionFactory.listActiveAuctions();
    activeAuctions = results;
  }

  onMount(() => {
    listActiveAuction();
  })
</script>

<main>
	<Navbar/>
  	<h1>Hello Typescript!</h1>
	<button on:click={connect}> connect </button>
  
  <p>Active auctions</p>
  <ul>
    {#each activeAuctions as auction}
    <li>{auction.label}</li>
    <li>{auction.address}</li>
    {/each}
  </ul>

</main> 

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
