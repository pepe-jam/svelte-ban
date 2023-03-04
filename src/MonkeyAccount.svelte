<script lang="ts">
  export let bananodeApi: string

  let account = 'ban_1waifusa1tnk3eo7dstc4z9tt7puurh5jyettyj59mis5m86ofiwywahcccm'
  let promise: Promise<string|undefined>

  async function getBalance(account: string) {
    const req = {
      action: 'account_balance',
      account: account,
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    }

    try {
      const response = await fetch(bananodeApi, options)
      const result = await response.json()
      return Number(result.balance_decimal).toFixed(2)
    } catch (error) {
      console.error(error)
    }
  }

  function handleClick() {
    promise = getBalance(account)
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
    <img src="https://monkey.banano.cc/api/v1/monkey/{account}" alt="monkey avatar" />
  </a>
    <!-- <button on:click={handleClick}>Update Balance</button> -->

</div>

<style lang="scss">
  .account {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.7em;
    margin-top: 1.5em;
    word-break: break-all;

    div {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      letter-spacing: 0.1em;

      .balance {
        font-size: 1em;
        text-align: right;
      }
    }

    img {
      height: 10em;
    }
  }
  // X-Small devices (portrait phones, less than 576px)

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    .account {
      font-size: 1.15em;
      margin-top: 1.5em;
      padding: 0.3em;

      div {
        gap: 0.5em;
        letter-spacing: 0.05em;

        .balance {
          font-size: 1.3em;
        }
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    .account {
      font-size: 1.4em;
      margin-top: 1.5em;
      padding: 1.5em;

      div {
        .balance {
          font-size: 1.3em;
        }
      }
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    .account {
      font-size: 1.5em;
    }
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    .account {
      font-size: 1.5em;
      padding: 0.5em 3em;
    }
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
    .account {
      font-size: 1.8em;
    }
  }
</style>
