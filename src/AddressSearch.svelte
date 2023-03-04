<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import { BananoUtil } from '@bananocoin/bananojs'

  export let account: string = ''
  export let transactionHistory: SvelteComponent

  $: validAccount = () => {
    return BananoUtil.getBananoAccountValidationInfo(account.trim()).valid
  }

  function handleHistoryButton() {
    account = account.trim()
    if (validAccount()) {
      transactionHistory.getAccountHistory(account)
    }
  }
</script>

<div class="search">
  <label for="input">enter banano address</label>
  <input bind:value={account} type="text" name="input" placeholder="ban_1waifu..." />
  {#if !validAccount() && account !== ''}
    <div class="error">Invalid banano address.</div>
  {:else}
    <div class="error"/>
  {/if}
  <button on:click={handleHistoryButton} disabled={!validAccount()}>get history</button>
</div>

<style lang="scss">
  .search {
    display: flex;
    flex-flow: column;
    width: 16em;
    padding: 0.5em 1em;
    font-size: 1em;
    border-radius: 5px;

    input {
      font-size: 0.8em;
      border-radius: 5px;
      padding: 4px;
    }

    input:focus {
      color: #495057;
      background-color: #fff;
      border-color: $ban-y;
      outline: 5em;
      box-shadow: 1px 1px #4cbf4b;
    }

    button {
      margin-top: 0.5em;
      font-size: 0.9em;
      width: 8em;
      height: 2.6em;
    }

    .error {
      font-size: 0.5em;
      margin-bottom: 0.5em;
      height: 0.8em;
      color: deeppink;
    }
  }

  // X-Small devices (portrait phones, less than 576px)

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    .search {
      font-size: 1.2em;
      width: 20em;
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    .search {
      font-size: 1.2em;
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    .search {
      margin-top: 2em;
    }
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
    .search {
      font-size: 1.5em;
      width: 20em;
    }
  }
</style>
