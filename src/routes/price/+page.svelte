<script lang="ts">
    import { onMount } from 'svelte';

    let yesterday: Date = new Date()
    let month: string, day: string, year: string;
    yesterday.setDate(yesterday.getDate() - 1)

    let currency: string = 'usd'
    const currencies: { [key: string]: string } = {
        'usd': '$',
        'eur': '€',
        'ban': '🍌'
    }
    const birthday: Date = new Date('2018-10-03')
	let datePicker: string
	let dateString: string
	let displayDate: string
    let prediction: Number = 0.000001
    $: decimalCount = String(prediction).split('.')[1]?.length ?? 0
    
    let prices: { [key: string]: number }
    $: deviation = prices ? Number((((Number(prediction) - prices[currency]) / prices[currency]) * 100).toFixed(2)) : 0
    
    let predictionInput: HTMLInputElement
	
	onMount(()=> {
        year = '' + yesterday.getUTCFullYear()
        month = '' + (yesterday.getUTCMonth() + 1)
        day = '' + yesterday.getUTCDate()

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        datePicker = [year, month, day].join('-');
     
	})

    // when is coingecko current_price updated for new day? didnt work at 12am utc
    async function getBanPrice() {
        // check if button should be pressable (date)

        [year, month, day] = datePicker.split('-')
        dateString = [day, month, year].join('-');
        let api = 'https://api.coingecko.com/api/v3/coins/banano/history?date=' + dateString;
        let response = await fetch(api);
        if (response.ok) {
            prices = (await response.json()).market_data.current_price;
            prices['ban'] = 1
        }

        for (let key in prices) {
            let value = prices[key]
            prices[key] = Number(value.toFixed(6))
        }
        console.log(predictionInput.value)
        prediction = Number(predictionInput.value)

        displayDate = new Date(datePicker).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    }
</script>

<div id="main">
    <div id="title">
        Guess the <span>ban</span> price!
    </div>
    <div>
        <div id="currency">
            <label for="select">choose a currency,</label>
            <select bind:value={currency} name="currencies">
                <option value="usd">USD $</option>
                <option value="eur">EUR €</option>
                <option value="ban">BAN 🍌</option>
            </select>
        </div>
        <div class="error"/>
        <div id="date">
            <label for="datepicker">pick a date and</label>
            <div id="container">
                <input bind:value={datePicker}
                    type="date"
                    id="datepicker"
                    name="datepicker"
                    min="2018-10-03"
                />
            </div>
            <div class="error">
                {#if new Date(datePicker) > yesterday || new Date(datePicker) < birthday}
                    Pick a date from 2018-10-03 to yesterday.
                {/if}
            </div>
        </div>
        <div id="guesser">
            <label for="guess">guess the <span>ban</span> price!</label>
            <div id="input-container">
                <input bind:value={prediction} bind:this={predictionInput}
                    type="number"
                    min="0"
                    step="0.000001"
                    id="guess"
                    name="guess"
                />
                <div id="symbol">{currencies[currency]}</div>
            </div>
            <div class="error">
                {#if prediction < 0 || decimalCount > 6}
                    Enter positive numbers with up to 6 decimals.
                {:else if prediction == 0}
                    ...but maybe try to put in some higher number.
                {/if}
            </div>
        </div>
    </div>
    <button on:click={getBanPrice}>take a guess 🍌</button>
    {#if prices} <!-- on currency change remove result -->
    <div id="result">
        <div>
            {#if prices[currency] == prediction}
                Congratulations, your guess was accurate!
            {/if}
            {#if deviation < 0}
                Your guess was {-1 * deviation}% lower!
            {:else if deviation > 0}
                Your guess was {deviation}% higher!
            {/if}
        </div>
        <div>According to 
            <img src="https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png" alt="cg">
            <a href="https://www.coingecko.com/en/coins/banano">coingecko</a>, the price of <img src="https://assets.coingecko.com/coins/images/6226/small/banano-transparent.png" alt="ban"><a href="https://www.banano.cc">Banano</a>
            on <b>{displayDate}</b> was
            <b>
                {#if currency == 'usd'}
                    {currencies[currency]}{prices[currency]}
                {:else if currency == 'ban'}
                    {prices[currency]} {currencies[currency]}
                {:else}
                    {prices[currency]} {currencies[currency]}
                {/if}
            </b>
        </div>
    </div>
{/if}
</div>


<style lang="scss">
#title {
    margin-top: 0.1em;
    margin-bottom: 1em;
    font-size: 2.5em;
}

span {
    color: $ban-y;
}

input,
select {
    font-size: 1em;
    margin-top: 0.2em;
    margin-bottom: 0.3em;
    border-radius: 0.3em;
    padding: 0 0.4em;
    width: 10em;
    border: 2px solid $ban-gray;
    user-select: text !important;
    color: #fff;
    background: $ban-gray;
    -webkit-appearance: none;
    -moz-appearance: none;
}

select {
    width: 14.9em;
    font-size: 0.9em;
    background-color: #212529;
    text-indent: 1px;
    text-overflow: '';
}

select,
#datepicker {
    cursor: pointer;
}

option {
    font-size: 0.85em;
    background: #212529;
}

button {
    display: flex;
    justify-content: center;
    width: 11em;
    font-size: 1em;
    color: #fff;
    background: #2a2a2e;
    border: 0.15em solid #fff;
    border-radius: 0.4rem;
    padding: 0.5rem;
    margin: 0.5em 0;
    cursor: pointer;
}



input:focus, select:focus{
    outline: 0.15em solid $ban-y;
    // inset-inline: 0.05em solid #000;
    box-shadow: 0px 0px 3px $ban-y;
}

#main {
    display: flex;
    flex-direction: column;
    word-break: break-word;
    align-items: center;
    align-self: center;
    user-select: none;
    font-size: 2em;
}

#currency {
    display: flex;
    flex-flow: column;
}

/* For IE10 */
select::-ms-expand, input::-ms-expand {
    display: none;
}

#datepicker {
    width: 12.5em;
}

#guess {
    width: 11em;
    justify-content: center;
}

#input-container {
    display: flex;
    flex-flow: row;
}

#symbol {
    font-size: 1em;
    padding: 0.15em 0.25em;
    width: 1em;
    height: 1em;
}

.error {
    font-size: 0.5em;
    margin-bottom: 0.5em;
    height: 0.8em;
    color: deeppink;
}

#result {
    display: block;
    text-align: center;
    border-top: solid;
    border-bottom: solid;
    padding: 0.4em 1em;
    margin-top: 1em;
}

img {
    margin: 0 0.3em 0 0.1em;
    padding-top: 0.5em;
    height: 0.75em;
}
</style>
