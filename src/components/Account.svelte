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
        <p>Your address is: <strong>{address}</strong></p>
    {/await}

    {#await getBalance()}
        <p>Your balance is : ...waiting</p>
    {:then balance} 
        <p>Your balance is : <strong>{balance}</strong> </p>
    {/await}
</div>

<style>
    div {
        margin: 10px;
        padding: 2px 0px 5px 0px;
        outline: var(--text-color) solid 1px ;
        border-radius: 2rem;
    }
    p {
        padding: auto;
    }
</style>

