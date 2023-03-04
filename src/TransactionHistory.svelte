<script lang="ts">
  import { quintIn } from "svelte/easing"
  import { fade } from "svelte/transition"


  export let account: string
  export let bananodeApi: string

  let history
  let urlAccount: string

  export async function getAccountHistory(account: string) {
    urlAccount = account
    const req = {
      action: 'account_history',
      account: account,
      count: 5,
    }
    console.log(req)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }

    try {
      const response = await fetch(bananodeApi, options)
      history = (await response.json()).history
      console.log(history)
    } catch (error) {
      console.error(error)
    }
  }
</script>

{#if history}
<!-- add working animation on update pliz -->
  <div class="history" transition:fade> 
    <div class="transactions">
      <h2>recent transactions</h2>
      {#each history as t}
        <div class="transaction">
          {#if t.type == 'send'}
            <div>sent {t.amount_decimal} to</div>
            <span class="address">
              <a target="_blank" rel="noreferrer" href="https://creeper.banano.cc/account/{t.account}">{t.account}</a>
            </span>
          {:else}
          <div>received {t.amount_decimal} from</div>
            <span class="address">
              <a target="_blank" rel="noreferrer" href="https://creeper.banano.cc/account/{t.account}">{t.account}</a>
            </span>
          {/if}
          <div>at {new Date(t.local_timestamp * 1000).toLocaleString()}</div>
        </div>
      {/each}
    </div>
    <div class="monkey">
      <a href="https://creeper.banano.cc/account/{urlAccount}" target="_blank" rel="noreferrer">
        <img src="https://monkey.banano.cc/api/v1/monkey/{urlAccount}" alt="monkey avatar" />
      </a>
    </div>
  </div>
{/if}

<style lang="scss">
  .history {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;

    .transaction {
      margin-bottom: 0.5em;
      .address {
        overflow-wrap: normal;
        a {
          color: $ban-y;
        }
      }
    }

    img {
      width: 20em;
    }
  }
</style>
