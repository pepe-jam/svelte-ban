<script lang="ts">
  let account: string = 'ban_1waifusa1tnk3eo7dstc4z9tt7puurh5jyettyj59mis5m86ofiwywahcccm'
</script>

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
      <div class="qr" />
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

        .qr {
          background: url(public/qr.png) center no-repeat;
          background-size: 6.8em;
          width: 7em;
          height: 7em;
        }
      }
    }
  }

  @media (min-width: 576px) {
    .front,
    .back {
      font-size: 1.8em;
    }
  }

  @media (min-width: 768px) {
    .front,
    .back {
      font-size: 2em;
    }
  }
</style>
