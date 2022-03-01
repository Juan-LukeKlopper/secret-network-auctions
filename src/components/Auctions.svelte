<script lang="ts">
  import { onMount } from "svelte";
  import { auctionDef } from "../contracts/auction";
  import { auctionFactory } from "../contracts/auction-factory";
  import { 
    createContract, 
    refContract, 
    coinConvert, 
keplrViewingKeyManager,
viewingKeyManager} from "@stakeordie/griptape.js";
  import { balances, tokensWithViewkeys, tokensWVKaddress, bid_token_balance } from "../stores";


    let activeAuctions = [];
    let auctionDetails = "";
    let sell_token_symbol,sell_token_decimals,sell_amount;
    let bid_token_symbol,bid_token_decimals,bid_token_address;
    let min_bid,auction_address;
    let ends_at,description,status,bal;
    let bid_amount = 0;
    let viewKey;
    let has_view_key = false;
    let has_bid_amount;
    let loading = false;


    function getDetails(auctionDetails) {
      sell_token_symbol = auctionDetails.sell_token.token_info.symbol;
      sell_token_decimals = auctionDetails.sell_token.token_info.decimals;
      sell_amount = coinConvert(auctionDetails.sell_amount, sell_token_decimals, "human");
      bid_token_symbol = auctionDetails.bid_token.token_info.symbol;
      bid_token_decimals = auctionDetails.bid_token.token_info.decimals;
      bal = coinConvert(balances[tokensWithViewkeys.indexOf(bid_token_symbol)] , bid_token_decimals, "human", 2);
      if (bal !== "") {
        bid_token_balance.set(bal);
        bid_token_address = tokensWVKaddress[tokensWithViewkeys.indexOf(bid_token_symbol)];
      }
      else {
        bid_token_balance.set(-1);
        bid_token_address = "";
      }
      min_bid = coinConvert(auctionDetails.minimum_bid, bid_token_decimals, "human"); ;
      auction_address = auctionDetails.auction_address;
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

  async function placeBid() {
    const contract = refContract(bid_token_address);
    const amount = coinConvert(bid_amount, bid_token_decimals, "machine");
    try{
      loading = true;
      await contract.send(auction_address, amount);
    } finally{
      loading = false;
    }
    
  }

  async function createAuctionViewingKey() {
    try {
      loading = true;
      const result = await auctionFactory.createViewingKey();
      if (result.isEmpty()) return;
      const { viewing_key: {key} } = result.parse()
      viewingKeyManager.add(auctionFactory, key);
      viewKey = key;
    }finally {
      loading = false;
      chechHasViewKey();
    }
  }

  async function chechHasViewKey() {
    const vk = viewingKeyManager.get(auctionFactory.at);
    has_view_key = (typeof vk !== 'undefined');
  }

  async function checkHasBids(){
    const contract = refContract(auction_address);
    const { has_bids: {has_bids} } = await contract.hasBids(viewKey);
    has_bid_amount = has_bids;
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
      
      <p>Auction address: <strong>{auction_address}</strong> </p>
      <p>Token for sale: <strong>{sell_amount} {sell_token_symbol}</strong> </p>
      <p>Bid token: <strong>{bid_token_symbol} ( 
        {#if $bid_token_balance >= 0}
          Your balance: {$bid_token_balance}
        {:else}
          Please create Viewing Key in wallet to see balance
        {/if})</strong></p>
      <p>Minimum bid: <strong>{min_bid}</strong></p>
      <p>description: <strong>{description}</strong></p>
      <p>Closes at: <strong>{ends_at}</strong></p>
      <p>Status: <strong>{status}</strong></p>

      {#if !has_view_key}
       <span><button disabled={loading} on:click={() => createAuctionViewingKey()}>create Viewing key</button> </span> <br/>
      {:else}
        <button disabled={loading} on:click={() => checkHasBids()}>check has bids</button>
        {#if has_bid_amount}
          <span>Yes</span><br/>
        {:else if !has_bid_amount}
         <span>No</span><br/>
        {:else}
          <br/>
        {/if}
      {/if}
      
      

      <label for="amount"> Enter amount of u{bid_token_symbol} bid :</label>
      <input type="text" name="amount" bind:value={bid_amount} >
      <button disabled={loading} on:click={() => (placeBid())}> Submit bid.</button>
    {/if}
</div>