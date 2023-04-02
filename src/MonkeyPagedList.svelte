<script lang="ts">
  import { fade } from 'svelte/transition'

  import { Main } from '@bananocoin/bananojs'


  export let seed: string = ''
  export let addresses: string[] = []
  export let currentPage: number = 1
  export let addressesPerPage: number = 5

  let amount = addressesPerPage

  $: totalAddresses = addresses.length
  $: totalPages = Math.ceil(totalAddresses / addressesPerPage)
  $: addressRangeHigh = currentPage * addressesPerPage
  $: addressRangeLow = addressRangeHigh - addressesPerPage

  function setCurrentPage(newPage: number) {
    currentPage = newPage
  }

  async function generateAddresses() {
    for (let i = amount; i < amount + addressesPerPage; i++) {
      addresses = [...addresses, await Main.getBananoAccountFromSeed(seed, i)]
    }
    amount += addressesPerPage
  }

  async function addNewPage() {
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

  function clearAddressList() {
    addresses = []
  }
</script>

<div class="main subtitle">
  <div class="addresses">
    <div class="list">
      <div>
        {#each addresses as address, i}
          {#if i >= addressRangeLow && i < addressRangeHigh}
            <div
              class="address"
              in:fade={{ delay: 30 * (i % addressesPerPage), duration: 40 * (i % addressesPerPage) }}
            >
              <div class="monkey">
                <a target="_blank" rel="noreferrer" href="https://creeper.banano.cc/account/{address}">
                  <img alt="monkey avatar" src="https://monkey.banano.cc/api/v1/monkey/{address}" />
                </a>
              </div>
              <span
                ><a target="_blank" rel="noreferrer" href="https://creeper.banano.cc/account/{address}">{address}</a
                ></span
              >
            </div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="buttons">
      <button on:click={addNewPage}>more</button>
      <!--  -->
      <div class="listnav">
        <button disabled={currentPage <= 1} on:click|preventDefault={() => setCurrentPage(1)}>&lt&lt</button>
        <button disabled={currentPage <= 1} on:click|preventDefault={() => setCurrentPage(currentPage - 1)}>&lt</button>
        <!-- pages before current -->
        {#if currentPage != totalPages}
          {#each [1] as i}
            {#if currentPage - i > 0}
              <div>
                <a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage - i)}>{currentPage - i}</a>
              </div>
            {/if}
          {/each}
        {:else}
          {#each [2, 1] as i}
            {#if currentPage - i > 0}
              <div>
                <a href="/seed/" on:click|preventDefault={() => setCurrentPage(currentPage - i)}>{currentPage - i}</a>
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
              <div class="total">/ {totalPages}</div>
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
              <div class="total">/ {totalPages}</div>
            {/if}
          {/each}
        {/if}
        <button disabled={currentPage >= totalPages} on:click={() => setCurrentPage(currentPage + 1)}>&gt</button>
        <button disabled={currentPage >= totalPages} on:click={() => setCurrentPage(totalPages)}>&gt&gt</button>
      </div>
      <!--  -->
    </div>
  </div>
</div>

<style lang="scss">
  img,
  .buttons {
    user-select: none;
  }

  .main {
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 1em;

    button {
      margin-top: 1em;
      font-size: 0.9em;
    }
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
      margin: 0.5em 0 0 0;
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
        user-select: text;

        .monkey {
          height: 7.3em;
          width: 13em;
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

      .total {
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
    .main {
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
    .main {

      .addresses {
        .list {
          padding: 0 1em;
          width: 20em;
          height: 26em;

          .address {
            font-size: 0.54em;
            .monkey {
              height: 9.7em;
              width: 13em;
            }
          }
        }
        .listnav {
          .total {
            display: block;
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .main {

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

  @media (min-width: 992px) {
    .main {
      font-size: 1.15em;
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

  @media (min-width: 1200px) {
  }

  @media (min-width: 1400px) {
    .main {
      font-size: 1.15em;

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
            .total {
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
