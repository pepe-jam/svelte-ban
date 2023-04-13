<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { Main } from '@bananocoin/bananojs'

  import MonkeyPagedList from '@/components/MonkeyPagedList.svelte'

  let ready = false
  onMount(() => (ready = true))

  let seed: string = ''

  function generateBananoSeed() {
    seed = ''
    const seedBytes = new Uint8Array(32)
    window.crypto.getRandomValues(seedBytes)
    for (const element of seedBytes) {
      seed += element.toString(16).padStart(2, '0').toUpperCase()
    }
    clearAddresses()
    setCurrentPage(1)
    generateAddresses()
  }

  let addresses: string[] = []
  let currentPage = 1
  $: totalAddresses = addresses.length
  let addrPerPage = 5
  $: totalPages = Math.ceil(totalAddresses / addrPerPage)
  $: addrRangeHigh = currentPage * addrPerPage
  $: addrRangeLow = addrRangeHigh - addrPerPage

  function setCurrentPage(newPage: number) {
    currentPage = newPage
  }

  async function generateAddresses() {
    for (let i = 0; i < 5; i++) {
      addresses = [...addresses, await Main.getBananoAccountFromSeed(seed, i)]
    }
  }

  async function addAddressPage() {
    await generateAddresses()
    setCurrentPage(totalPages)
  }

  function scrollToTop() {
    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop
    if (currentScroll > 0) {
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0, currentScroll - currentScroll / 5)
    }
  }

  function copySeed() {
    navigator.clipboard.writeText(seed)
  }

  function clearAddresses() {
    addresses = []
  }
</script>

{#if ready}
  <div class="generator subtitle">
    {#if seed.length === 0}
      <div class="seed">Use the button to generate a new banano seed</div>
      <button on:click={generateBananoSeed}>Generate 🍌 🌱</button>
    {:else}
      <div class="seed clickable">
        Your generated seed is<br /><span on:mousedown={copySeed}>{seed}</span>
      </div>
      {#if addresses.length !== 0}
        <span>and here some of the addresses that belong to it</span>
        {#key currentPage}
          <MonkeyPagedList {seed} {addresses} />
        {/key}
      {/if}
    {/if}
    {#if seed.length !== 0}
      <button on:click={generateBananoSeed}>I want another 🌱</button>
    {/if}
  </div>
{/if}

<style lang="scss">
  * {
    user-select: none;
  }
  .clickable {
    cursor: pointer;
  }

  .generator {
    margin-top: 0.5em;
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 1.2em;

    button {
      margin-top: 1em;
      font-size: 0.9em;
    }
  }

  .seed {
    font-size: 0.75em;
    color: #fff;
    overflow-wrap: anywhere;
    user-select: text;

    span {
      color: $ban-y;
    }
  }

  @media (min-width: 420px) {
    .generator {
      font-size: 1.6em;
    }
  }

  @media (min-width: 576px) {
    .generator {
      font-size: 1.6em;
    }
  }

  @media (min-width: 768px) {
    .generator {
      font-size: 1.9em;
    }
  }

  @media (min-width: 992px) {
    .generator {
      font-size: 1.85em;
    }
  }

  @media (min-width: 1200px) {
  }

  @media (min-width: 1400px) {
    .generator {
      font-size: 1.15em;

      span {
        font-size: 1.2em;
      }

      .seed {
        font-size: 1.3em;
      }

      button {
        font-size: 1.3em;
      }
    }
  }
</style>
