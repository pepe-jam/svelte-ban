<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { Main, BananoUtil, BananodeApi } from '@bananocoin/bananojs'
  import { sendBanano, receiveBanano, bananoDecimalToRaw } from './NodeRequests'
  // import { getAccountInfo } from '$/db/claims'
 
  import type { PageData } from './$types'
  /** @type {import('./$types').PageData} */
  export let data: PageData

  let ready = false
  onMount(() => {
    
  })

  //  replace with process.env.seed
  const FAUCET_SEED = '00A01A82FFE177A1D9ACD4DF3C3CBA770FE50FF33CAA83A256FC0A6D71C5C611'
  const FAUCET_ADDR = 'ban_36aauqwe6s3dibw9c3j1yxwxtz88bnxwjhjhao1tad3hjzyhgjf9urn1ctzw'
  let faucetBalancePromise: Promise<string> | undefined = undefined //getFaucetBalance()
  let claimAccount: string = ''

  function shortAddress(address: string) {
    const start = address.slice(0, 12)
    const end = address.slice(-6, 64)
    return [start, end].join('...')
  }

  $: validAccount = (account: string ) => {
    if (account) account = account.trim()
    return BananoUtil.getBananoAccountValidationInfo(account).valid
  }

  async function claimFaucet() {
    console.log(claimAccount + ' claiming the faucet')
    // TODO TODO TODO
    checkEligibility(claimAccount)
    const amount = calcReward()
    //
    // const blockHash = await sendBanano(claimAccount, amount)
    // console.log(blockHash)
  }

  async function getIP() {
		const response = await fetch('/api/faucet')
		const ip = await response.json()
    return ip
	}

  async function checkEligibility(account: string='') {
    // TODO if ('cookie') return false
    // const info = await getAccountInfo(account)
    // console.log(info)
    // if (getTimestamp(account))
  }

  // export to tools
  function calcReward() {
    let reward = (0.019).toString()
    console.log(bananoDecimalToRaw(reward))
    return bananoDecimalToRaw(reward)
  }
</script>


<h1>Your IP Address is {data.ip}</h1>
<div class="faucet">
  <div class="title">legendary banano faucet</div>
  <div class="spacer" />
  <label for="input">enter banano address</label>
  <input
    bind:value={claimAccount}
    on:input={() => {}}
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
  <button on:click={claimFaucet} disabled={!validAccount(claimAccount)}>claim bananos</button>
  <button on:click={receiveBanano}>receive bananos</button>
  <button>make custom captcha</button>

  <div class="account" transition:fade>
    <div>
      <div class="address">
        {shortAddress(FAUCET_ADDR)}
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
    <a href="https://creeper.banano.cc/account/{FAUCET_ADDR}" target="_blank" rel="noreferrer">
      <img src="https://monkey.banano.cc/api/v1/monkey/{FAUCET_ADDR}" alt="monkey avatar" />
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
