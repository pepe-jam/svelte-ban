<script lang="ts">
  import bananoLogo from '../assets/banano-icon.svg'
  import MonkeyAccount from '../MonkeyAccount.svelte'
  import AddressSearch from '../AddressSearch.svelte'
  import TransactionHistory from '../TransactionHistory.svelte'
  import type { SvelteComponent } from 'svelte'

  const bananodeApi: string = 'https://kaliumapi.appditto.com/api'
  let account: string
  let transactionHistory: SvelteComponent
</script>

<div class="title">
  <a href="https://banano.cc/" target="_blank" rel="noopener noreferrer">
    <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
  </a>
  <div>
    <div>1 Ban = 1 Ban</div>
    <div class="subtitle">did you know?</div>
  </div>
  <a href="https://banano.cc/" target="_blank" rel="noopener noreferrer">
    <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
  </a>
</div>

<MonkeyAccount {bananodeApi} />
<AddressSearch bind:account {transactionHistory} />
<TransactionHistory bind:this={transactionHistory} {bananodeApi} {account}/>

<!-- {account} -->

<!-- todo gorilla banano card -->
<style lang="scss">
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

  // X-Small devices (portrait phones, less than 576px)

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    .title {
      font-size: 2.5em;

      .logo {
        width: 1.5em;
        padding: 1em;
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
  }
</style>
