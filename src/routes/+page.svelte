<script lang="ts">
    import bananoLogo from "../assets/banano-icon.svg";
    import MonkeyAccount from "../MonkeyAccount.svelte";
</script>


<div class="title">
  <a href="https://banano.cc/" target="_blank" rel="noopener noreferrer">
    <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
  </a>
  <h1>1 Ban = 1 Ban</h1>
  <a href="https://banano.cc/" target="_blank" rel="noopener noreferrer">
    <img src={bananoLogo} class="logo banano" alt="Banano Logo" />
  </a>
</div>

<MonkeyAccount />
  
<style lang="scss">
  .title {
    display: flex;
    flex-flow: row;
    justify-content: center;

    h1 {
      font-size: 5em;
    }

    .logo {
      height: 6em;
      padding: 4em;
      will-change: filter;
    }

    .logo.banano:hover {
      filter: drop-shadow(0 0 1em #ff3e00aa);
    }
  }
</style>
