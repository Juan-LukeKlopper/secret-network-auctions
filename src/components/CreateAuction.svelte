<script lang="ts">
    import { createContractClient, refContract, snip20Def } from "@stakeordie/griptape.js";
    import { auctionFactory } from "../contracts/auction-factory";
    import tokens from "../data/tokens.json"

    const form = ({
        sellAmount: null,
        minimumBid: null,
        endsAt: null,
        description: null,
        sellContract: null,
        bidContract: null,
    })
    let bid_token,sell_token, unixdate ;
    let sell_amount,  min_bid, ends_at, description;

    async function createAuction() {
       // const result = 

        unixdate = Date.parse(ends_at);
        form.sellAmount = sell_amount;
        form.minimumBid= min_bid;
        form.endsAt= ends_at ;
        form.description= description;
        form.sellContract= sell_token;
        form.bidContract= bid_token;

        const contract = refContract(sell_token);
        try {
            console.log(unixdate)
            await contract.increaseAllowences(auctionFactory.at, sell_amount);
            await auctionFactory.createAuction(form)
            
        } finally {
            
        }
        
    }

    function createSellContractClient() {
        const address = {sell_token};
        if (!address) return;
        createContractClient({
            id: address,
            at: address,
            definition: snip20Def
        }); 
    }
</script>

<div class="auctions">
    <p>Create a custom auction</p>

    <p>Sell contract:</p>
    <select bind:value={sell_token}>
        {#each tokens as token}
            <option value={token.address}> {token.name}</option>
        {/each}
    </select>
    <input type="text" placeholder="Sell amount" bind:value={sell_amount} min=0/>

    <p>Bid contract:</p>
    <select bind:value={bid_token}>
        {#each tokens as token}
            <option name={bid_token} value={token.address} > {token.name} </option>
        {/each}
    </select>
    <input type="text" placeholder="Minimum bid" bind:value={min_bid} min=0/>

    <p>Ends at:</p>
    <input type="datetime" bind:value={ends_at}/>
    
    <p>Description: (optional)</p>
    <textarea bind:value={description}></textarea>

    <button on:click={() => createAuction()}>Create Auction</button>
</div>
