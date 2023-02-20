<script lang="ts">
import { Main } from "@bananocoin/bananojs";
import { fade } from 'svelte/transition'
import { quintIn } from 'svelte/easing';

// good seed: 

let seed: string = ""

function generateBananoSeed() {
  seed = ""
  const seedBytes = new Uint8Array(32);
  window.crypto.getRandomValues(seedBytes);
  for (const element of seedBytes) {
    seed += element.toString(16).padStart(2, "0").toUpperCase();
  }
  clearAddresses()
  setCurrentPage(1)
  generateAddresses()
}

let addresses: string[] = []
let amount: number = 0
/////////////
let currentPage = 1
$: totalAddresses = addresses.length
let addrPerPage = 5
$: totalPages = Math.ceil(totalAddresses / addrPerPage);
$: addrRangeHigh = currentPage * addrPerPage;
$: addrRangeLow = addrRangeHigh - addrPerPage;

function setCurrentPage(newPage: number) {
  currentPage = newPage;
}

/////////////

async function generateAddresses() {
  for (let i = amount; i < amount + 5; i++) {
    addresses.push(await Main.getBananoAccountFromSeed(seed, i))
  }
  amount += 5
  addresses = addresses

  // adjust spacing and sizing of whole page (onepage)
}

function scrollToTop() {
  let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo (0,currentScroll - (currentScroll/5));
  }
}

function copySeed() {
  navigator.clipboard.writeText(seed);
  console.log('alo')
}

function clearAddresses() {
  addresses = []
}

</script>

<div class="generator subtitle">
  <button id="generate" on:click={generateBananoSeed}>Generate 🍌 🌱</button>
  {#if seed.length === 0}
  <div id="seed" on:mousedown={copySeed}>Use the button to generate a new banano seed</div>
  <div id="addresses"/>
  {:else}
  <div id="seed">
    Your generated seed is<br><span>{seed}</span> 
  </div>
  {#if addresses.length !== 0}
  <h4>and here some of the addresses that belong to it</h4>
  {#key totalAddresses}
    <div id='addresses' >
    <div id='list'>
    {#each addresses as address, i}
    {#if i >= addrRangeLow && i < addrRangeHigh}
    <div id='addr' in:fade={{duration: 500, easing: quintIn}} out:fade={{duration: 0}}>
      <div id="monkey"><a target='_blank' rel="noreferrer" href='https://creeper.banano.cc/account/{address}'>
          <img  alt="monkey avatar" src='https://monkey.banano.cc/api/v1/monkey/{address}'>
        </a></div>
        <span><a target='_blank' rel="noreferrer" href='https://creeper.banano.cc/account/{address}'>{address}</a></span>
    </div>
    {/if}
    {/each}
  </div>
  <div id="buttons">
    <button on:click={generateAddresses}>i need more</button>
<!--  -->
<div id="listnav">
  <button disabled='{currentPage <= 1}' on:click|preventDefault={() => setCurrentPage(1)}>&lt&lt</button>
  <button disabled='{currentPage <= 1}' on:click|preventDefault={() => setCurrentPage(currentPage - 1)}>&lt</button>
  <!-- pages before current -->
  {#if currentPage != totalPages}
    {#each [1] as i}
      {#if currentPage - i > 0}
      <div><a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage - i)}>{currentPage - i}</a></div>
      {/if}
    {/each}
  {:else}
    {#each [2,1] as i}
      {#if currentPage - i > 0}
      <div><a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage - i)}>{currentPage - i}</a></div>
      {/if}
    {/each}
  {/if}
  <!-- current -->
  <div><span>{currentPage}</span></div>
  <!-- pages after current -->
  {#if currentPage == 1}
    {#each Array(2) as _, i}
      {#if currentPage + (i+1) <= totalPages}
        <div><a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage + (i+1))}>{currentPage + (i+1)}</a></div>
      {/if}
      {#if i == 1 && currentPage + i != totalPages && totalPages > 3}
        <div id='total'>/ {totalPages}</div>
      {/if}
    {/each}
  {:else}
    {#each Array(1) as _, i}
      {#if currentPage + (i+1) <= totalPages}
        <div><a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage + (i+1))}>{currentPage + (i+1)}</a></div>
      {/if}
    {#if currentPage + i < totalPages - 1 && totalPages > 3}
      <div id='total'>/ {totalPages}</div>
    {/if}
    {/each}
  {/if}
  <button disabled='{currentPage >= totalPages}' on:click={() => setCurrentPage(currentPage + 1)}>&gt</button>
  <button disabled='{currentPage >= totalPages}' on:click={() => setCurrentPage(totalPages)}>&gt&gt</button>
</div>
<!--  -->
  </div>
</div>
{/key}
  {/if}
  {/if}
</div>

<style lang="scss">
  * {
    user-select: none;
  }

  .generator {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 2em;
  }

  #seed {
    color: #fff;
    overflow-wrap: anywhere;

    span {
      color: $ban-y;
      user-select: text;
    }
  }

  h4 {
    margin: 0.2em;
  }

  #addresses {
    align-items: end;
    align-self: center;
    text-align: left;
    font-size: 20pt;

    #list {
      width: 45em;
      background: #181A1B;
      border: 3px solid #fff;
      border-radius: 0.4rem;
      padding: 0.5em 2.5em 0.5em 2.5em;
      margin-top: 1em;
      text-align: center;

      #addr {
        margin-bottom: 0rem;
        display: flex;
        flex-flow: row;
        align-items: center;
        font-size: 18pt;
        font-family: Overpass Mono, monospace;
        justify-content: space-between;
        border-top: 1px solid #fff;
        overflow-wrap: anywhere;

        #monkey {
          height: 7em;
          width: 7em;
        }

        a {
          user-select: text;
        }
        span {
          user-select: text;
        }
      }

      a:hover {
        color: $ban-y;
      }

      a:active {
        color: $ban-g;
      }

      #addr:nth-of-type(1) {
        border: none;
        margin-top: 0;
      }
    }
  }

  #buttons {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-content: center;
    margin-top: 0.2em;
    
    button {
      width: 7em;
      padding: 0.3em;
      margin-bottom: 0;
      margin-top: 0;
      // flex-grow: 1;
    }

    #listnav {
      display: flex;
      flex-direction: row;
      // flex-grow: 20;

      div {
        line-height: 2em;
        
        a, span {
          margin: 0 0.2em;
          font-feature-settings: "tnum";
        }

        span {
          color: $ban-y;
          font-size: 1.1em;
        }
      }

      #total {
        line-height: 3em;
        font-size: 0.7em;
      }

      button {
        width: 3em;
        height: 2em;
        line-height: 0.5em;
        padding: 0.5em;
        margin: 0 0.15em;
        font-feature-settings: "tnum";
      }

      button:nth-of-type(4) {
        margin-right: 0;
      }
    }
  }
</style>
