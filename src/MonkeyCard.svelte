<script lang="ts">
  // Libraries
  // Assets
  // Components
  import QrCodeImage from 'svelte-qrcode-image/QRCodeImage.svelte'
  // Imports
  export let account: string
  export let validAccount: Function
</script>

<div class="instruction">
  <div>&gt enter your address to put it on your monkey card</div>
  <div>&gt print it with the upcoming button (pog)</div>
  <div>&gt scan it to send nanners easier in the wild jungle</div>
</div>
<div class="front">
  <div class="left">
    <img src="./../public/gorilla.png" alt="gorilla" />
    <div class="subtitle">Instant, Feeless & Potassium Rich</div>
  </div>
  <div class="right">
    <div class="top">
      <div class="title">BANANO.CC</div>
      <div class="subtitle">Folding proteins in the name of science</div>
    </div>
    <div class="bottom">
      <img src="./../public/banano-gold.svg" alt="banano" />
    </div>
  </div>
</div>

<div class="back">
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
  <div class="subtitle">Scan to transfer</div>
</div>

<style lang="scss">
  * {
    font-family: monospace;
    font-size: 1em;
    user-select: none;
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

      img {
        max-width: 70%;
        max-height: 70%;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      text-align: right;
      gap: 5em;

      .top {
        flex-direction: column;

        .title {
          font-size: 1.3em;
          color: $ban-gold;
        }

        .subtitle {
          font-size: 0.7em;
          color: $ban-gray;
          padding-top: 1.5em;
          max-width: 10em;
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

    .subtitle {
      font-size: 0.7em;
      color: $ban-gray;
      padding: 1em 4em;
      text-align: left;
      align-self: flex-start;
    }

    .banana {
      background: url(public/banano-gold.svg) center no-repeat;
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
