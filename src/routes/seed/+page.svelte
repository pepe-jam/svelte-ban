<script lang="ts">
  import { Main } from '@bananocoin/bananojs'
  import { fade } from 'svelte/transition'
  import { quintIn } from 'svelte/easing'

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
  let amount: number = 0
  /////////////
  let currentPage = 1
  $: totalAddresses = addresses.length
  let addrPerPage = 5
  $: totalPages = Math.ceil(totalAddresses / addrPerPage)
  $: addrRangeHigh = currentPage * addrPerPage
  $: addrRangeLow = addrRangeHigh - addrPerPage

  function setCurrentPage(newPage: number) {
    currentPage = newPage
  }

  /////////////

  async function generateAddresses() {
    for (let i = amount; i < amount + 5; i++) {
      addresses = [...addresses, await Main.getBananoAccountFromSeed(seed, i)]
    }
    amount += 5
    // adjust spacing and sizing of whole page (onepage)
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

<div class="generator subtitle">
  {#if seed.length === 0}
    <div id="seed">Use the button to generate a new banano seed</div>
    <button on:click={generateBananoSeed}>Generate 🍌 🌱</button>
  {:else}
    <div class="seed clickable">
      Your generated seed is<br /><span on:mousedown={copySeed}>{seed}</span>
    </div>
    {#if addresses.length !== 0}
      <h4>and here some of the addresses that belong to it</h4>
      {#key currentPage}
        <div class="addresses">
          <div class="list">
            <div in:fade={{ duration: 500, easing: quintIn }}>
              {#each addresses as address, i}
                {#if i >= addrRangeLow && i < addrRangeHigh}
                  <div class="address">
                    <div class="monkey">
                      <a target="_blank" rel="noreferrer" href="https://creeper.banano.cc/account/{address}">
                        <img alt="monkey avatar" src="https://monkey.banano.cc/api/v1/monkey/{address}" />
                      </a>
                    </div>
                    <span
                      ><a target="_blank" rel="noreferrer" href="https://creeper.banano.cc/account/{address}"
                        >{address}</a
                      ></span
                    >
                  </div>
                {/if}
              {/each}
            </div>
          </div>
          <div class="buttons">
            <button on:click={generateAddresses}>more</button>
            <!--  -->
            <div class="listnav">
              <button disabled={currentPage <= 1} on:click|preventDefault={() => setCurrentPage(1)}>&lt&lt</button>
              <button disabled={currentPage <= 1} on:click|preventDefault={() => setCurrentPage(currentPage - 1)}
                >&lt</button
              >
              <!-- pages before current -->
              {#if currentPage != totalPages}
                {#each [1] as i}
                  {#if currentPage - i > 0}
                    <div>
                      <a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage - i)}
                        >{currentPage - i}</a
                      >
                    </div>
                  {/if}
                {/each}
              {:else}
                {#each [2, 1] as i}
                  {#if currentPage - i > 0}
                    <div>
                      <a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage - i)}
                        >{currentPage - i}</a
                      >
                    </div>
                  {/if}
                {/each}
              {/if}
              <!-- current -->
              <div><span>{currentPage}</span></div>
              <!-- pages after current -->
              {#if currentPage == 1}
                {#each Array(2) as _, i}
                  {#if currentPage + (i + 1) <= totalPages}
                    <div>
                      <a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage + (i + 1))}
                        >{currentPage + (i + 1)}</a
                      >
                    </div>
                  {/if}
                  {#if i == 1 && currentPage + i != totalPages && totalPages > 3}
                    <div id="total">/ {totalPages}</div>
                  {/if}
                {/each}
              {:else}
                {#each Array(1) as _, i}
                  {#if currentPage + (i + 1) <= totalPages}
                    <div>
                      <a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage + (i + 1))}
                        >{currentPage + (i + 1)}</a
                      >
                    </div>
                  {/if}
                  {#if currentPage + i < totalPages - 1 && totalPages > 3}
                    <div id="total">/ {totalPages}</div>
                  {/if}
                {/each}
              {/if}
              <button disabled={currentPage >= totalPages} on:click={() => setCurrentPage(currentPage + 1)}>&gt</button>
              <button disabled={currentPage >= totalPages} on:click={() => setCurrentPage(totalPages)}>&gt&gt</button>
            </div>
            <!--  -->
          </div>
        </div>
      {/key}
    {/if}
  {/if}
  {#if seed.length !== 0}
    <button on:click={generateBananoSeed}>I want another 🌱</button>
  {/if}
</div>

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
      width: 11em;
    }
  }

  .seed {
    font-size: 0.75em;
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

  .addresses {
    align-items: end;
    align-self: center;
    text-align: left;
    font-size: 1em;

    .list {
      background: #181a1b;
      border: 3px solid #fff;
      border-radius: 0.4em;
      padding: 0.5em;
      margin: 1em 0 0 0;
      width: 15em;
      height: 19.4em;
      justify-content: space-evenly;
      div .address {
        margin-bottom: 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        font-size: 0.54em;
        gap: 1em;
        border-top: 1px solid #fff;
        overflow-wrap: anywhere;
        text-align: left;

        .monkey {
          height: 7.3em;
          width: 13em;
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

      .address:nth-of-type(1) {
        border: none;
        margin-top: 0;
      }
    }
  }

  .buttons {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-content: center;
    margin-top: 0.2em;

    button {
      font-size: 0.8em;
      width: 5em;
      padding: 0.3em;
      margin-bottom: 0;
      margin-top: 0;
    }

    .listnav {
      display: flex;
      flex-direction: row;
      font-size: 0.9em;
      align-items: center;

      div {
        line-height: 2em;
        font-size: 0.8em;

        a,
        span {
          margin: 0 0.2em;
          font-feature-settings: 'tnum';
        }

        span {
          color: $ban-y;
          font-size: 1.15em;
        }
      }

      #total {
        // line-height: 3em;
        font-size: 0.7em;
        display: none;
      }

      button {
        width: 2.5em;
        height: 2em;
        line-height: 0em;
        padding: 0.5em;
        margin: 0 0.15em;
        font-feature-settings: 'tnum';
        font-size: 0.8em;
        align-self: center;
      }

      button:nth-of-type(4) {
        margin-right: 0;
      }
    }
  }

  @media (min-width: 420px) {
    .generator {
      font-size: 1.6em;
      .addresses {
        .list {
          height: 21.3em;
          .address {
            font-size: 0.5em;

            .monkey {
              height: 8.8em;
              width: 13em;
            }
          }
        }
      }
    }
  }

  @media (min-width: 576px) {
    .generator {
      font-size: 1.6em;

      .addresses {
        .list {
          padding: 0 1em;
          width: 20em;
          height: 25.8em;

          .address {
            font-size: 0.54em;
            .monkey {
              height: 9.7em;
              width: 13em;
            }
          }
        }
        .listnav {
          #total {
            display: block;
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .generator {
      font-size: 1.9em;

      .addresses {
        .list {
          width: 23em;
          height: 18em;

          .address {
            font-size: 0.47em;
            .monkey {
              height: 7.6em;
              width: 7em;
            }
          }
        }
      }
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    .generator {
      font-size: 1.85em;
      .addresses {
        .list {
          width: 26em;
          height: 20.8em;

          .address {
            font-size: 0.54em;
            .monkey {
              width: 7.5em;
            }
          }
        }
      }
    }
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
    .generator {
      font-size: 1.15em;

      .seed {
        font-size: 1.3em;
      }

      button {
        font-size: 1.3em;
      }

      .addresses {
        .list {
          width: 55em;
          height: 37.5em;

          .address {
            font-size: 1.05em;
            gap: 3em;
            .monkey {
              height: 7em;
              width: 7em;
            }
          }
        }

        .buttons {
          button {
            width: 4em;
            height: 2em;
            line-height: 0em;
            font-size: 1.2em;
          }
          .listnav {
            div {
              font-size: 1.1em;
            }
            #total {
              // line-height: 3em;
              font-size: 0.7em;
            }

            button {
              width: 3em;
            }
          }
        }
      }
    }
  }
</style>
