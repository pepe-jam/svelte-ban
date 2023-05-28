<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import QrCodeImage from 'svelte-qrcode-image/QRCodeImage.svelte'

  import gorilla from 'assets/gorilla.png'
  import banano_gold from 'assets/banano-gold.svg'

  export let account: string
  export let validAccount: Function

</script>

{#key account}
  <div class="card" in:fly={{ duration: 200, y: 500, delay: 400}} out:fly={{ duration: 300, y: 1000 }}>
    <div class="instruction">
      <div>&gt enter your address to put on your monkey card</div>
      <div>&gt print it</div>
      <div>&gt scan it to send nanners easier in the wild jungle</div>
    </div>
    <div class="front">
      <div class="left">
        <img src={gorilla} alt="gorilla" />
        <div class="subtitle">Instant, Feeless & Potassium Rich</div>
      </div>
      <div class="right">
        <div class="top">
          <div class="title">BANANO.CC</div>
          <div class="subtitle">Folding proteins in the name of science</div>
        </div>
        <div class="bottom">
          <img src={banano_gold} alt="banano" />
        </div>
      </div>
    </div>

    <div class="back">
      <div class="subtitle-top">
        Consider contributing your GPU to scientific research<br />Learn more on
        <a href="https://bananominer.com">bananominer.com</a>
      </div>
      <div class="banana">
        <div class="box">
          <QrCodeImage
            displayStyle="width: 95%;"
            text={validAccount(account)
              ? 'ban:' + account
              : 'ban_HereCouldBeYourAmazingBananoAddressIfYouWouldPutItInNowThanks'}
            altText={validAccount(account)
              ? 'ban:' + account
              : 'ban_HereCouldBeYourAmazingBananoAddressIfYouWouldPutItInNowThanks'}
            margin={2}
          />
        </div>
      </div>
      <div class="subtitle-bottom">Scan to transfer</div>
    </div>
  </div>
{/key}

<button on:click={() => window.print()}>print card</button>

<style lang="scss">
  * {
    font-family: monospace;
    font-size: 1em;
    user-select: none;
  }
  @media print {
    .instruction,
    button {
      display: none;
    }

    .front,
    .back {
      filter: none !important;
      text-align: left;
    }
  }

  .instruction {
    margin-top: 2em;
    font-size: 0.8em;
    width: 29em;

    div {
      margin: 0.75em 0;
    }
  }

  .front {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1.5em;
    height: 12em;
    width: 20.05em;
    border-radius: 1em;
    background-color: #000;
    padding: 1em;
    font-size: 1em;
    filter: drop-shadow(4px 4px 1px $ban-gray);

    .left {
      display: flex;
      flex-direction: column;
      font-size: 0.6em;
      gap: 0.5em;
      width: 45em;
      padding-left: 0.75em;

      img {
        max-width: 85%;
        max-height: 85%;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      text-align: right;
      gap: 3.5em;

      .top {
        margin-top: 0.25em;
        flex-direction: column;

        .title {
          font-size: 1.3em;
          color: $ban-gold;
        }

        .subtitle {
          font-size: 0.9em;
          color: $ban-gray;
          padding-top: 1.5em;
        }
      }

      .bottom {
        align-self: flex-end;

        img {
          width: 3em;
          height: 3em;
        }
      }
    }
  }

  .back {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.5em;
    height: 12em;
    width: 20.05em;
    border-radius: 1em;
    background-color: #000;
    padding: 1em;
    font-size: 1em;
    filter: drop-shadow(4px 4px 1px $ban-gray);

    .subtitle-top {
      font-size: 0.65em;
      padding: 0;
      color: $ban-gray;
      text-align: left;
      align-self: flex-start;
      margin-bottom: 1.5em;

      a {
        color: inherit;
      }
    }

    .subtitle-bottom {
      font-size: 0.8em;
      color: $ban-gray;
      padding: 0.75em 3.2em;
      align-self: center;
      text-align: right;
      align-self: flex-start;
    }

    .banana {
      background: url(../assets/banano-gold.svg) center no-repeat;
      width: 15em;
      height: 30em;
      display: flex;
      display: flex;
      align-items: flex-end;

      .box {
        width: 7em;
        height: 7em;
        background-color: #fff;
        border-radius: 0.5em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  button {
    margin-top: 2em;
    font-family: Filson-Pro;
  }

  @media (min-width: 420px) {
    .front,
    .back {
      font-size: 1.25em;
    }
    .instruction {
      font-size: 1.05em;
    }
  }

  @media (min-width: 576px) {
    .front,
    .back {
      font-size: 1.4em;
    }

    .instruction {
      font-size: 1.2em;
    }
  }

  @media (min-width: 768px) {
    .front,
    .back {
      font-size: 1.7em;
    }

    .instruction {
      font-size: 1.5em;
    }
  }

  @media (min-width: 992px) {
    .front,
    .back {
      font-size: 2em;
    }

    .instruction {
      font-size: 1.6em;
    }
  }
</style>
