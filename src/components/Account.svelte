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

{#await getAddress() then address}
    <p>Your address is: {address}</p>
{/await}

{#await getBalance()}
    <p>...waiting</p>
{:then balance} 
    <p>Your balance is : {balance} </p>
{/await}

