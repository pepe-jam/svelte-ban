<script lang="ts">
  import bananoLogo from '../assets/banano-icon.svg'
  import MonkeyAccount from '../MonkeyAccount.svelte'
  import AddressSearch from '../AddressSearch.svelte'

  let account: string
  const bananodeApi: string = 'https://kaliumapi.appditto.com/api'
</script>

<div class="title">
  <a href="https://banano.cc/" target="_blank" rel="noopener noreferrer">
    <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
  </a>
  1 Ban = 1 Ban
  <a href="https://banano.cc/" target="_blank" rel="noopener noreferrer">
    <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
  </a>
</div>

<AddressSearch bind:account />
<MonkeyAccount {bananodeApi} />
<!-- {account} -->

<!-- todo gorilla banano card -->
<style lang="scss">
  .title {
    display: flex;
    flex-flow: row;
    align-items: center;
    font-size: 1.2em;

    .logo {
      width: 2.3em;
      padding: 1em;
      vertical-align: middle;
    }

    .logo.banano:hover {
      filter: drop-shadow(0 0 1em #ff3e00aa);
    }
  }

  // X-Small devices (portrait phones, less than 576px)

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    .title {
      font-size: 2.5em;

      .logo {
        width: 1.5em;
        padding: 1em;
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
  }
</style>
