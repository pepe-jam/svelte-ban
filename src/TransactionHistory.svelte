<script lang="ts">
  // Libraries
  import { fade } from 'svelte/transition'
  // Assets
  // Components
  // Imports

  export let bananodeApi: string
  export let validAccount: Function

  interface BananoTransaction {
    account: string
    amount: string
    amount_decimal: string
    confirmed: string
    hash: string
    height: string
    local_timestamp: number
    type: string
  }

  let history: ArrayLike<BananoTransaction>
  let urlAccount: string

  export async function getAccountHistory(account: string) {
    if (!validAccount(account)) return

    urlAccount = account
    const req = {
      action: 'account_history',
      account: account,
      count: 5,
    }

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
    } catch (error) {
      console.error(error)
    }
  }
</script>

{#if history}
  <!-- add working animation on update pliz -->
  <div class="history" transition:fade>
    <div class="transactions">
      <div class="title">recent transactions</div>
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
  </div>
{/if}

<style lang="scss">
  @media print {
    * {
      display: none !important;
    }
  }
  
  .history {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 0.8em;
    word-break: break-all;
    padding: 0 0.7em;

    .title {
      font-size: 1.5em;
      margin-bottom: 0.5em;
    }

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

  @media (min-width: 420px) {
    .history {
      font-size: 1.15em;
    }
  }

  @media (min-width: 576px) {
    .history {
      font-size: 1.3em;
      padding: 0 1.5em;
    }
  }

  @media (min-width: 768px) {
    .history {
      font-size: 1.1em;
    }
  }

  @media (min-width: 992px) {
    .history {
      font-size: 1.4em;
    }
  }

  @media (min-width: 1200px) {
    .history {
      font-size: 1.5em;
    }
  }

  @media (min-width: 1400px) {
    .history {
      font-size: 1.6em;
    }
  }
</style>
