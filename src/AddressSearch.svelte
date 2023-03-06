<script lang="ts">
  // Libraries
  import type { SvelteComponent } from 'svelte'
  // Assets
  // Components
  // Imports
  export let account: string = ''
  export let transactionHistory: SvelteComponent
  export let validAccount: Function

  function handleHistoryButton() {
    account = account.trim()
    if (validAccount(account)) {
      transactionHistory.getAccountHistory(account)
    }
  }
</script>

<div class="search">
  <label for="input">enter banano address</label>
  <input
    bind:value={account}
    on:input={() => (account = account.trim())}
    type="text"
    name="input"
    placeholder="ban_1waifu..."
  />
  {#if !validAccount(account) && account !== ''}
    <div class="error">Invalid banano address.</div>
  {:else}
    <div class="error" />
  {/if}
  <button on:click={handleHistoryButton} disabled={!validAccount(account)}>get history</button>
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

  @media (min-width: 576px) {
    .search {
      font-size: 1.2em;
      width: 20em;
    }
  }

  @media (min-width: 768px) {
    .search {
      font-size: 1.2em;
    }
  }

  @media (min-width: 992px) {
    .search {
      margin-top: 2em;
    }
  }

  @media (min-width: 1200px) {
  }

  @media (min-width: 1400px) {
    .search {
      font-size: 1.5em;
      width: 20em;
    }
  }
</style>
