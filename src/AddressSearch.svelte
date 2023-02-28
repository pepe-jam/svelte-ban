<script lang="ts">
  export let account: string

  async function getAccountHistory(account: string, count: number = 5) {
    const req = {
      action: 'account_history',
      account: account,
      count: count,
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }

    try {
      const response = await fetch(bananodeApi, options)
      const result = await response.json()
      console.log(result)
      return result
    } catch (error) {
      console.error(error)
    }
  }
</script>

<div class="search">
  <label for="input">enter a banano address</label>
  <input bind:value={account} type="text" name="input" placeholder="ban_1waifu..." />
</div>

<style lang="scss">
  .search {
    display: flex;
    flex-flow: column;
    width: 16em;
    padding: 0.5em 1em;
    font-size: 1em;
    border: 2px solid $ban-gray2;
    border-radius: 5px;
    margin-top: 1em;

    input {
      font-size: 0.8em;
      border-radius: 5px;
      padding: 4px;
    }

    input:focus {
      color: #495057;
      background-color: #fff;
      border-color: $ban-y;
      outline: 5em;
      box-shadow: 1px 1px #4cbf4b;
    }
  }

    // X-Small devices (portrait phones, less than 576px)

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    .search {
      font-size: 1.2em;
      width: 20em;
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    .search {
      font-size: 1.2em;
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    .search {
      margin-top: 2em;
    }
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
    .search {
      font-size: 1.5em;
      width: 20em;
    }
  }
</style>
