<script lang="ts">
    import tokens from "../data/tokens.json";
    import { tokensWithViewkeys,tokensWithoutViewkeys,balances } from "../stores/stores"
    import {
        createContractClient,
        coinConvert,
        refContract,
        snip20Def,
        onAccountAvailable,
        keplrViewingKeyManager,
        BaseContract,
    } from "@stakeordie/griptape.js";
  
    let decimals = [];
    let index = 0;
    let viewkeys = false;

    async function initContract() {
        tokens.forEach((item) => {
            createContractClient({
                id: item.symbol,
                at: item.address,
                definition: snip20Def,
            });
        });

        await getBalance();
    }

    async function getdecimals() {
        decimals = [];

        const promise = tokens
            .filter(({ address }) => keplrViewingKeyManager.get(address))
            .map(({ address }) => {
                const contract = refContract(address);
                return contract.getTokenInfo();
            });

        const result = await Promise.allSettled(promise);
        

        result.forEach((viewkey) => {
            decimals = [...decimals, viewkey.value.token_info.decimals ]; 
        });

        viewkeys = true;
    }

    function getCoinBalance() {
        let coinBalance = coinConvert( balances[index], decimals[index], "human", 2 );
        index = index + 1
        return coinBalance
    }

    async function getBalance() {

        tokensWithViewkeys.length = 0;
        tokensWithoutViewkeys.length = 0;

        const promise = tokens
            .filter(({ address }) => keplrViewingKeyManager.get(address))
            .map(({ address }) => {
                const contract = refContract(address);
                const add = contract.getBalance() ;
                tokensWithViewkeys.push(contract.id);
                return add;
            });

        const promise2 = tokens
            .filter(({ address }) => !keplrViewingKeyManager.get(address))
            .map(({ address }) => {
                const contract = refContract(address);
                const add = contract.id;
                tokensWithoutViewkeys.push(contract.id);
                return add;
            });

        const result = await Promise.allSettled(promise);
        

        result.forEach((viewkey) => {
            balances.push(viewkey.value.balance.amount); 
        });

        console.log(tokensWithViewkeys)
        await getdecimals();
    }

    async function createViewingKey(Token) {
        const contractaddress: BaseContract = refContract(Token.address);
        await keplrViewingKeyManager.add(contractaddress);
        await getBalance();
    }

    initContract();
</script>

<div>
    <h2> wallet assets </h2>
    {#if viewkeys == true}
        {#each tokens as token}
            {#if tokensWithViewkeys.includes(token.symbol) }
                <span><strong> { getCoinBalance() } </strong>{token.symbol} </span>
                <br > 
            {:else if tokensWithoutViewkeys.includes(token.symbol)}
                <span>{token.symbol} </span>
                <button on:click|once={() => { createViewingKey(token);}} > get more info </button>
                <br>
            {/if}
        {/each}
    {:else}
        <span> Getting info from keplr</span>
        <br>
        <span class="refreshMessage"> Everytime you show wallet all the amount are refreshed to ensure accuracy, please be patient and enjoy your Secret Network Auction House experince!</span>
    {/if}
</div>

<style>
    span {
        margin-top: 2px;
        margin-bottom: 2px;
    }

    div {
        text-align: start;
        margin: 10px;
        padding: 2px 0px 5px 15px;
        outline: var(--text-color) solid 1px ;
        border-radius: 2rem;
    }

    p {
        margin-top: 1px;
    }
</style>
