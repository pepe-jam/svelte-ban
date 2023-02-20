<script lang="ts">
    import { Main, BananodeApi, BananoUtil } from "@bananocoin/bananojs";
    import "https";

    Main.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

    let account =
        "ban_3banobotojqz8pkm1uectwb8baqjkfhq38e6fbwdrp51qjnwemepzc4ytowy";
    let promise = checkBalance(account);

    // function checkBalance() {
    //     BananodeApi.getAccountBalanceRaw(
    //         "ban_3banobotojqz8pkm1uectwb8baqjkfhq38e6fbwdrp51qjnwemepzc4ytowy"
    //     )
    //         .then((raw_bal) => {
    //             let ban_parts = Main.getBananoPartsFromRaw(raw_bal);

    //             // let ban_parts = BananoUtil.getAmountPartsFromRaw(raw_bal, 'ban_');
    //             console.log("banano parts:", ban_parts);
    //             return (
    //                 Number(ban_parts.banano) + Number(ban_parts.banoshi) / 100
    //             );
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             return 2;
    //         });
    // }

    async function checkBalance(account: string) {
        let raw_bal;
        try {
            raw_bal = await BananodeApi.getAccountBalanceRaw(
                "ban_3banobotojqz8pkm1uectwb8baqjkfhq38e6fbwdrp51qjnwemepzc4ytowy"
            );
        } catch (error) {
            console.log(error);
            return error;
        }
        
        let bal_parts = BananoUtil.getAmountPartsFromRaw(raw_bal, 'ban_');
        console.log("banano parts:", bal_parts);
        return Number(bal_parts.banano) + Number(bal_parts.banoshi) / 100;
    }

    async function getRandomNumber() {
        const res = await fetch(`https://svelte.dev/tutorial/random-number`);
        const text = await res.text();

        if (res.ok) {
            return text;
        } else {
            throw new Error(text);
        }
    }

    function handleClick() {
        promise = checkBalance(account);
    }
</script>

<div class="account">
    <div>
        <div class="address">
            {account}
        </div>
        <div class="balance">
            {#await promise}
                <p>...waiting</p>
            {:then balance}
                <p style="color: #FBDD11">{balance} BAN</p>
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
    <a href="https://creeper.banano.cc/account/{account}" target="_blank" rel="noreferrer">
        <img
            src="https://monkey.banano.cc/api/v1/monkey/{account}"
            alt="monkey avatar"
        />
    </a>
    <button on:click={handleClick}>Update Balance</button>
</div>

<style lang="scss">
    .account {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 2em;

        div {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            letter-spacing: 0.1em;

            .balance {
                font-size: 0.7em;
                text-align: right;
            }
        }

        img {
            height: 8em;
        }
    }
</style>
