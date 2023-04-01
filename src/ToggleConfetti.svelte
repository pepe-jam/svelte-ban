<script>
  import { tick } from 'svelte'

  let relative = true

  let active = false

  async function click() {
    active = false
    await tick()
    active = true
  }
</script>

<span on:mouseenter={click} class="relative">
  <slot name="label" />

  {#if active}
    <div class="confetti">
      <slot />
    </div>
  {/if}
</span>

<style>
  .relative {
    position: relative;
  }

  .relative .confetti {
    position: absolute;
    top: 10%;
    left: 50%;
  }

  .confetti {
    pointer-events: none;
  }
</style>
