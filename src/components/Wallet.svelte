<script lang="ts">
    import tokens from "../data/tokens.json";
    import {
        createContractClient,
        coinConvert,
        refContract,
        snip20Def,
        onAccountAvailable,
        keplrViewingKeyManager,
        BaseContract,
    } from "@stakeordie/griptape.js";

    let tokensWithViewkeys: any = [];
    let tokensWithoutViewkeys:any = [];    
    let balances: any = [];
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
        const coinBalance = coinConvert( balances[index], decimals[index], "human");
        index = index + 1
        return coinBalance
    }

    async function getBalance() {

        tokensWithViewkeys = []
        tokensWithoutViewkeys = []

        const promise = tokens
            .filter(({ address }) => keplrViewingKeyManager.get(address))
            .map(({ address }) => {
                const contract = refContract(address);
                const add : Object = contract.getBalance() ;
                tokensWithViewkeys = [...tokensWithViewkeys, contract.id];
                return add;
            });

        const promise2 = tokens
            .filter(({ address }) => !keplrViewingKeyManager.get(address))
            .map(({ address }) => {
                const contract = refContract(address);
                const add = contract.id;
                tokensWithoutViewkeys = [...tokensWithoutViewkeys, contract.id];
                return add;
            });

        const result = await Promise.allSettled(promise);
        

        result.forEach((viewkey) => {
            balances = [...balances, viewkey.value.balance.amount ]; 
        });

        await getdecimals();
    }

    async function createViewingKey(Token) {
        const contractaddress: BaseContract = refContract(Token.address);
        await keplrViewingKeyManager.add(contractaddress);
        await getBalance();
        console.log(decimals)
    }

    onAccountAvailable(() => {
        initContract();
    });
</script>

<div>
    <p>wallet assets</p>
    {#if viewkeys == true}
        {#each tokens as token}
            {#if tokensWithViewkeys.includes(token.symbol) }
                <span>{token.symbol} </span>
                <span> balance : { getCoinBalance() } </span>
                <br > 
            {:else if tokensWithoutViewkeys.includes(token.symbol)}
                <span>{token.symbol} </span>
                <button on:click|once={() => { createViewingKey(token)}}>get more info</button>
                <br>
            {/if}
        {/each}
    {:else}
        <span> Getting info from keplr</span>
        <br>
        {/if}
</div>

<style>

</style>
