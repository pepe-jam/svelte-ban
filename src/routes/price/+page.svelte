<script lang="ts">
  // Libraries
  import { onMount } from 'svelte'
  import { quintOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'
  // Assets
  // Components
  // Imports

  let ready = false

  const today: Date = new Date()
  const yesterday: Date = new Date(today.setDate(today.getDate() - 1))
  const tomorrow: Date = new Date(today.setDate(today.getDate() + 1))
  let month: string, day: string, year: string
  let maxDate: string

  let currency: string = 'usd'
  const currencies: Map<string, string> = new Map([
    ['usd', '$'],
    ['eur', '€'],
    ['ban', '🍌'],
  ])

  const birthday: Date = new Date('2018-10-03')
  let pickedDate: string
  let dateString: string
  let displayDate: string
  let prediction: number = 0.000001

  $: validInputs = !(new Date(pickedDate) > tomorrow || new Date(pickedDate) < birthday) && !(prediction <= 0)
  // $: decimalCount = String(prediction).split('.')[1]?.length ?? 0

  let prices: Map<string, number> = new Map()
  const priceHistory: Map<string, Map<string, number>> = new Map()
  let deviation: number

  let currencyInput: HTMLSelectElement

  onMount(() => {
    year = '' + today.getUTCFullYear()
    month = '' + (today.getUTCMonth() + 1)
    day = '' + today.getUTCDate()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    maxDate = [year, month, day].join('-')
    pickedDate = maxDate
    ready = true
  })

  async function handleGuessButton() {
    await getBanPrice()
    updateDisplayDate()
    updateDeviation()
  }

  function updateCurrency() {
    currency = currencyInput.value
  }

  function updateDeviation() {
    updateCurrency()
    deviation = prices
      ? Number((((Number(prediction) - prices.get(currency)!) / prices.get(currency)!) * 100).toFixed(2))
      : 0
  }

  function updateDisplayDate() {
    displayDate = new Date(pickedDate).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function addNeededCurrencies(toBeFiltered: { [key: string]: number }) {
    prices.set('ban', 1)
    Object.keys(toBeFiltered).forEach((key) => {
      if (currencies.has(key)) {
        prices.set(key, Number(toBeFiltered[key].toFixed(6)))
      }
    })
  }

  async function getBanPrice() {
    // return data from price history if date was already requested
    if (priceHistory.has(pickedDate)) {
      prices = priceHistory.get(pickedDate)!
      return
    }
    // no request if in future
    if (new Date(pickedDate) > tomorrow) {
      return
    }

    // get current price from coingecko
    if (new Date(pickedDate) > yesterday && new Date(pickedDate) < tomorrow) {
      const api =
        'https://api.coingecko.com/api/v3/coins/banano?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'

      const response = await fetch(api)
      if (response.ok) {
        const result = (await response.json()).market_data.current_price
        addNeededCurrencies(result)
      }
    } else if (new Date(pickedDate) < today) {
      // get prices of picked date from coingecko
      ;[year, month, day] = pickedDate.split('-')
      dateString = [day, month, year].join('-')
      const api = 'https://api.coingecko.com/api/v3/coins/banano/history?date=' + dateString
      const response = await fetch(api)

      if (response.ok) {
        const result = (await response.json()).market_data.current_price
        addNeededCurrencies(result)
      }
    }
    priceHistory.set(pickedDate, new Map(prices))
  }
</script>

{#if ready}
  <div class="main">
    <div class="title">
      Guess the <span>ban</span> price!
    </div>
    <div>
      <div class="currency">
        <label for="select">choose a currency,</label>
        <select bind:this={currencyInput} name="currencies">
          <option value="usd">USD $</option>
          <option value="eur">EUR €</option>
          <option value="ban">BAN 🍌</option>
        </select>
      </div>
      <div class="error" />
      <div class="date">
        <label for="datepicker">pick a date and</label>
        <div class="container">
          <input bind:value={pickedDate} type="date" name="datepicker" min="2018-10-03" max={maxDate} />
        </div>
        <div class="error">
          {#if new Date(pickedDate) > tomorrow || new Date(pickedDate) < birthday}
            Pick a date from 2018-10-03 to now.
          {/if}
        </div>
      </div>
      <div class="guesser">
        <label for="guess">guess the <span>ban</span> price!</label>
        <div class="input-container">
          <input bind:value={prediction} type="number" min="0" step="0.000001" class="guess" name="guess" />
          <div class="symbol">{currencies.get(currency)}</div>
        </div>
        <div class="error">
          {#if prediction < 0}
            Enter positive numbers only.
          {:else if prediction == 0}
            ...but maybe try to put in some higher number.
          {/if}
        </div>
      </div>
    </div>
    <button on:click={handleGuessButton} disabled={!validInputs}>take a guess 🍌</button>
    {#if prices.size != 0}
      {#key [deviation, dateString, currency]}
        <div class="result" in:scale={{ duration: 300, easing: quintOut }} out:scale={{ duration: 0 }}>
          <div>
            {#if deviation < 0}
              Your guess was {-1 * deviation}% lower!
            {:else if deviation > 0}
              Your guess was {deviation}% higher!
            {:else}
              Congratulations, your guess was accurate!
            {/if}
          </div>
          <div>
            According to
            <img
              src="https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png"
              alt="coingecko"
            />
            <a href="https://www.coingecko.com/en/coins/banano">coingecko</a>, the price of
            <img src="https://assets.coingecko.com/coins/images/6226/small/banano-transparent.png" alt="ban" /><a
              href="https://www.banano.cc">Banano</a
            >
            on <b>{displayDate}</b> was
            <b>
              {#if currency == 'usd'}
                {currencies.get(currency)}{prices.get(currency)}
              {:else if currency == 'ban'}
                {prices.get(currency)} {currencies.get(currency)}
              {:else}
                {prices.get(currency)} {currencies.get(currency)}
              {/if}
            </b>
          </div>
        </div>
      {/key}
    {/if}
  </div>
{/if}

<style lang="scss">
  .title {
    font-size: 1.4em;

    text-align: center;
    margin-bottom: 0.5em;
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

  select {
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

  button:disabled {
    color: $ban-gray2;
    background: $ban-gray;
    border: 3px solid $ban-gray2;
    filter: grayscale(80%);
  }

  input:focus,
  select:focus {
    outline: 0.1em solid $ban-y;
  }

  .main {
    display: flex;
    flex-direction: column;
    word-break: break-word;
    align-items: center;
    align-self: center;
    user-select: none;
    font-size: 1.3em;
  }

  .currency {
    display: flex;
    flex-flow: column;
  }

  /* For IE10 */
  select::-ms-expand,
  input::-ms-expand {
    display: none;
  }

  .guess {
    width: 11em;
    justify-content: center;
  }

  .input-container {
    display: flex;
    flex-flow: row;
  }

  .symbol {
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

  .result {
    font-size: 0.8em;
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

  @media (min-width: 420px) {
    .main {
      font-size: 1.6em;
    }
  }

  @media (min-width: 576px) {
    .main {
      font-size: 1.7em;
    }
    .result {
      font-size: 1em;
    }
  }

  @media (min-width: 768px) {
    .main {
      font-size: 1.9em;
    }
  }

  @media (min-width: 992px) {
    .main {
      font-size: 2em;
    }
  }

  @media (min-width: 1200px) {
    .main {
      font-size: 2em;

      .title {
        margin-top: 0.1em;
        margin-bottom: 0.5em;
        font-size: 2em;
      }
    }
  }

  @media (min-width: 1400px) {
    .main {
      font-size: 2em;

      .title {
        margin-top: 0.1em;
        margin-bottom: 0.5em;
        font-size: 2.5em;
      }
    }
  }
</style>
