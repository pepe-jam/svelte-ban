<script lang="ts">
  import { onMount } from 'svelte'
  import type { SvelteComponent } from 'svelte'
  import { BananoUtil } from '@bananocoin/bananojs'

  import bananoLogo from '@/assets/banano-icon.svg'

  import MonkeyAccount from '../MonkeyAccount.svelte'
  import AddressSearch from '../AddressSearch.svelte'
  import MonkeyCard from '../MonkeyCard.svelte'
  import TransactionHistory from '../TransactionHistory.svelte'
  

  let ready = false
  onMount(() => (ready = true))

  const bananodeApi: string = 'https://kaliumapi.appditto.com/api'
  let account: string
  let transactionHistory: SvelteComponent

  $: validAccount = (account: string) => {
    if (account) account = account.trim()
    return BananoUtil.getBananoAccountValidationInfo(account).valid
  }
</script>

<div class="container">
  {#if ready}
    <div class="title">
      <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
      <div>
        <div class="subtitle">did you know?</div>
        <div>1 Ban = 1 Ban</div>
      </div>
      <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
    </div>

    <AddressSearch bind:account {transactionHistory} {validAccount} />
    {#if validAccount(account)}
      <MonkeyAccount {account} {bananodeApi} />
      <TransactionHistory bind:this={transactionHistory} {bananodeApi} {validAccount} />
    {/if}
    <MonkeyCard {account} {validAccount} />
  {/if}
</div>

<style lang="scss">
  @media print {
    :global(body) {
      background-color: #fff !important;
    }

    .title {
      display: none !important;
    }

    .container {
      align-items: flex-start !important;
      background-color: #fff !important;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2em;

    .subtitle {
      font-size: 0.6em;
      letter-spacing: 0.15em;
      text-align: center;
    }

    .title {
      display: flex;
      flex-flow: row;
      align-items: center;
      font-size: 1.2em;
      letter-spacing: 0.05em;

      .logo {
        width: 2.3em;
        padding: 1em;
        vertical-align: middle;
      }
    }

    @media (min-width: 420px) {
      .title {
        font-size: 1.4em;
      }
    }

    @media (min-width: 576px) {
      .title {
        font-size: 2em;

        .logo {
          width: 1.5em;
          padding: 1em;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .title {
      font-size: 2.5em;
    }
  }

  @media (min-width: 992px) {
  }

  @media (min-width: 1200px) {
  }

  @media (min-width: 1400px) {
  }
</style>
