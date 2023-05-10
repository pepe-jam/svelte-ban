<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { BananoUtil } from '@bananocoin/bananojs'
  // import { getAccountInfo } from '$/db/claims'

  import type { PageData, PageServerData } from './$types'
  export let data: PageData
  export let serverData: PageServerData

  import LogoGradient from './LogoGradient.svelte'

  onMount(() => {
    console.log(data)
    console.log(serverData)
  })


  let faucetBalancePromise: Promise<string> | undefined = undefined //getFaucetBalance() from NodeRequests now
  let claimAccount: string = ''

  function shortAddress(address: string) {
    const start = address.slice(0, 12)
    const end = address.slice(-6, 64)
    return [start, end].join('...')
  }

  $: validAccount = (account: string) => {
    if (account) account = account.trim()
    return BananoUtil.getBananoAccountValidationInfo(account).valid
  }

  async function claim() {
    if (!validAccount(claimAccount)) return
    console.log(claimAccount + ' claiming the faucet')
    const result = await fetch(`/api/send?address=${claimAccount}`)
    const block = await result.json()
    console.log('block', block)
    return block
  }

  async function receiveBanano() {
    const result = await fetch('/api/faucet/receive')
    const receivedBlocks = await result.json()
    console.log('receivedBlocks', receivedBlocks)
    return receivedBlocks
  }
</script>

<!-- <LogoGradient/> -->
<h1>Your IP Address is {data.ip}</h1>
<div class="faucet">
  <div class="title">legendary banano faucet</div>
  <div class="spacer" />
  <label for="input">enter banano address</label>
  <input
    bind:value={claimAccount}
    on:input={() => {
      claimAccount = claimAccount.trim()
    }}
    type="text"
    name="input"
    placeholder="ban_1waifu..."
    tabindex="0"
  />
  {#if claimAccount !== '' && !validAccount(claimAccount)}
    <div class="error">Invalid banano address.</div>
  {:else}
    <div class="error" />
  {/if}
  <button on:click={claim} disabled={!validAccount(claimAccount)}>claim bananos</button>
  <button on:click={receiveBanano}>receive bananos</button>
  <button>make custom captcha</button>

  <div class="account" transition:fade>
    <div>
      <div class="address">
        {shortAddress(data.faucetAd???dress)} // + add error stuff in api from svelte https://icflorescu.github.io/trpc-sveltekit/authentication
      </div>
      <div class="balance">
        {#await faucetBalancePromise}
          <p style="color: #FBDD11">...gathering BAN</p>
        {:then faucetBalance}
          <p style="color: #FBDD11">{faucetBalance} BAN</p>
        {:catch error}
          <p class="error">{error.message}</p>
        {/await}
      </div>
    </div>
    <a href="https://creeper.banano.cc/account/{data.faucetAddress}" target="_blank" rel="noreferrer">
      <img src="https://monkey.banano.cc/api/v1/monkey/{data.faucetAddress}" alt="monkey avatar" />
    </a>
  </div>
</div>

<style lang="scss">
  .faucet {
    display: grid;

    .title {
      font-size: 1.5em;
      margin-top: 1em;
      text-align: center;
    }

    .error {
      color: red;
      font-size: 0.7em;
    }

    .spacer {
      border-bottom: 3px solid $ban-y;
      margin: 1.5em 0 2em 0;
      width: 100%;
    }

    .account {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 0.8em;
      margin-top: 1.5em;
      padding: 0 0.7em;
      word-break: break-all;

      div {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        letter-spacing: 0.1em;

        .address {
          font-size: 0.8em;
        }

        .balance {
          font-size: 1em;
          text-align: right;
        }
      }

      img {
        height: 8em;
        user-select: none;
      }
    }
  }
</style>
