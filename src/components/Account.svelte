<script lang="ts">
    import {
        getNativeCoinBalance,
        coinConvert,
        getAddress,
    } from "@stakeordie/griptape.js"

    async function getBalance() {
    let balance = await getNativeCoinBalance();
    balance = coinConvert(balance, 6, "human");
    return balance
    }
</script>

<div class="Account">
    {#await getAddress()}
        <p>Your address is: ...waiting</p> 
    {:then address}
        <p>Your address is: {address}</p>
    {/await}

    {#await getBalance()}
        <p>Your balance is : ...waiting</p>
    {:then balance} 
        <p>Your balance is : {balance} </p>
    {/await}
</div>

<style>
    div {
        outline: var(--text-color) solid 1px ;
        text-align: justify;
    }
    p {
        padding: auto;
    }
</style>

