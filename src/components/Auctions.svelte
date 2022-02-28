<script lang="ts">
  import { onMount } from "svelte";
  import { auctionDef } from "../contracts/auction";
  import { auctionFactory } from "../contracts/auction-factory";
  import { 
    createContract, 
    refContract, 
    coinConvert } from "@stakeordie/griptape.js";


    let activeAuctions = [];
    let auctionDetails = "";
    let sell_token_symbol,sell_token_decimals,sell_amount;
    let bid_token_symbol,bid_token_decimals,min_bid,auctionaddress,description;
    let ends_at,status;


    function getDetails(auctionDetails) {
      sell_token_symbol = auctionDetails.sell_token.token_info.symbol;
      sell_token_decimals = auctionDetails.sell_token.token_info.decimals;
      sell_amount = coinConvert(auctionDetails.sell_amount, sell_token_decimals, "human");
      bid_token_symbol = auctionDetails.bid_token.token_info.symbol;
      bid_token_decimals = auctionDetails.bid_token.token_info.decimals;
      min_bid = coinConvert(auctionDetails.minimum_bid, bid_token_decimals, "human"); ;
      auctionaddress = auctionDetails.auction_address;
      description = auctionDetails.description;
      ends_at = auctionDetails.ends_at;
      status = auctionDetails.status.toString();
      const auctionName = sell_token_symbol + " - " + bid_token_symbol + " auction."

      return auctionName;
    }

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
    auctionDetails = result;
  }

  onMount(() => {
    listActiveAuction();
  })

</script>  

<div class="auctions">
    {#if activeAuctions.length == 0}
      <p>...waiting for auction data</p>
    {:else}
      <h2>Active auctions.</h2>
      {#each activeAuctions as auction}
        <span>
          {auction.label}
          <button on:click={() => getAuctionInfo(auction.address)}>
            View details</button></span><br/>
      {/each}
    {/if}

    {#if auctionDetails !== ""}
      <h2>
         {getDetails(auctionDetails)}
      </h2>
      <p>Auction address: <strong>{auctionaddress}</strong> </p>
      <p>Token for sale: <strong>{sell_amount} {sell_token_symbol}</strong> </p>
      <p>Bid token: <strong>{bid_token_symbol}</strong> (balance: )</p>
      <p>Minimum bid: <strong>{min_bid}</strong></p>
      <p>description: <strong>{description}</strong></p>
      <p>Closes at: <strong>{ends_at}</strong></p>
      <p>Status: <strong>{status}</strong></p>
    {/if}
</div>