<script>
  import { page } from '$app/stores'

  import '../app.scss'

  // console.log($page.route.id)

  const nav = [
    { title: 'Home', path: '/' },
    { title: 'Birthday', path: '/birthday' },
    { title: 'Seed', path: '/seed' },
    { title: 'Price', path: '/price' },
    // { title: 'Gallery', path: '/gallery' },
  ]
</script>

<nav>
  {#each nav as item, i}
    <a rel="external" href={item.path} class:active={$page.route.id === item.path} tabindex={i + 1}>{item.title}</a>
  {/each}
</nav>

<slot />

<style lang="scss">
  @media print {
    * {
      display: none !important;
    }
  }

  nav {
    display: flex;
    gap: 0.3em;
    font-size: 1.4em;
    text-align: center;
    user-select: none;
    margin-bottom: 0.5em;
    padding-bottom: 0.2em;
    border-bottom: $ban-y solid 2px;

    a:hover {
      color: $ban-g;
    }

    a,
    a:active {
      color: #fff;
    }

    a {
      position: relative;
      text-decoration: none;
    }

    a::before {
      content: '';
      position: absolute;
      display: block;
      width: 100%;
      height: 2px;
      top: 0;
      right: 0;
      background-color: $ban-g;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    a:hover::before {
      transition: transform 0.3s ease;
      transform: scaleX(1);
    }

    .active {
      color: $ban-y;
    }
    // TODO
    .active::before {
      position: absolute;
      display: block;
      width: 100%;
      height: 3px;
      transform: scaleX(1);
      background-color: $ban-y;
      color: $ban-y;
    }
  }

  @media (min-width: 420px) {
    nav {
      font-size: 1.8em;
    }
  }

  @media (min-width: 576px) {
    nav {
      font-size: 2.1em;
    }
  }
</style>
