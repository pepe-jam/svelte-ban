<script lang="ts">
  import { fly } from 'svelte/transition'
  import { onMount } from 'svelte'

  import { Confetti } from 'svelte-confetti'

  import BoopAction from '$/Boop/BoopAction.svelte'
  import ToggleConfetti from '$/components/ToggleConfetti.svelte'
  import chibi from '$/assets/chibi_peepo.webp'

  let ready = false
  onMount(() => (ready = true))

  let birthday: Date = new Date(2018, 3, 1)
  let bdEnd: Date = new Date(2018, 3, 2)
  let bdToday = false

  let _digits = [
    { label: 'days', value: [1, 9] },
    { label: 'hours', value: [1, 9] },
    { label: 'minutes', value: [1, 9] },
    { label: 'seconds', value: [1, 9] },
  ]

  setInterval(function () {
    const now = new Date(Date.now())
    // const now = new Date(2023, 3, 1, 1, 1, 1)  // birthday test
    bdToday = now.toLocaleDateString().slice(0, -4) == birthday.toLocaleDateString().slice(0, -4)
    while (now > birthday) {
      birthday.setFullYear(birthday.getFullYear() + 1)
    }

    if (bdToday) {
      bdEnd.setDate(2)
      bdEnd.setFullYear(Number(birthday.toLocaleDateString().slice(-4)))
      let remainingBd = bdEnd.valueOf() - now.valueOf()
      setTimer(remainingBd)
    } else {
      let remaining = birthday.valueOf() - now.valueOf()
      setTimer(remaining)
    }

    function setTimer(timeLeft: number) {
      let days: any = Math.floor(timeLeft / (1000 * 60 * 60 * 24)).toString()
      let hours: any = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        .toString()
        .padStart(2, '0')
      let minutes: any = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, '0')
      let seconds: any = Math.floor((timeLeft % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, '0')

      _digits[0].value = []
      for (const digit in days) {
        _digits[0].value.push(Number(days[digit]))
      }
      _digits[1].value = []
      for (const digit in hours) {
        _digits[1].value.push(Number(hours[digit]))
      }
      _digits[2].value = []
      for (const digit in minutes) {
        _digits[2].value.push(Number(minutes[digit]))
      }
      _digits[3].value = []
      for (const digit in seconds) {
        _digits[3].value.push(Number(seconds[digit]))
      }
    }
  }, 1000)
</script>

{#if ready}
  <div class="birthday">
    <p class="title"><y>Banano</y>'s Birthday is on April 1, 2018</p>
    {#if bdToday}
      <p class="subtitle">that means <y>today is Banano's birthday party!</y></p>
    {:else}
      <p class="subtitle">that means there are</p>
    {/if}
    {#if bdToday}
      <div class="full-confetti">
        <Confetti
          x={[-5, 5]}
          y={[0, 0.1]}
          delay={[1000, 2000]}
          size={15}
          infinite
          duration={20000}
          amount={123}
          fallDistance="100vh"
        />
      </div>
      <div class="countdown">
        {#each _digits.slice(1) as digit}
          {#if digit.label != 'hours'}
            <div class="colon">:</div>
          {/if}
          <div class="col">
            <div class="digits">
              {#each digit.value as number}
                {#key number}
                  {#if ((digit.value[0] == 1 && digit.value[1] == 9) || (digit.value[1] == 1 && digit.value[2] == 9)) && (number == 1 || number == 9)}
                    <span in:fly={{ y: -50, duration: 1000, opacity: 0.1 }} out:fly={{ duration: 1 }}
                      >{@html "<span style='color: #fbdd11'>" + number + '</span>'}</span
                    >
                  {:else}
                    <span in:fly={{ y: -50, duration: 1000, opacity: 0.1 }} out:fly={{ duration: 1 }}>{number}</span>
                  {/if}
                {/key}
              {/each}
            </div>
            <span class="label">{digit.label}</span>
          </div>
        {/each}
      </div>
      <p class="subtitle">left until the party is over!</p>
    {:else}
      <div class="countdown">
        {#each _digits as digit}
          {#if digit.label != 'days'}
            <div class="colon">:</div>
          {/if}
          <div class="col">
            <div class="digits">
              {#each digit.value as number}
                {#key number}
                  {#if ((digit.value[0] == 1 && digit.value[1] == 9) || (digit.value[1] == 1 && digit.value[2] == 9)) && (number == 1 || number == 9)}
                    <span in:fly={{ y: -50, duration: 1000, opacity: 0.1 }} out:fly={{ duration: 0 }}
                      >{@html "<span style='color: #fbdd11'>" + number + '</span>'}</span
                    >
                  {:else}
                    <span in:fly={{ y: -50, duration: 1000, opacity: 0.1 }} out:fly={{ duration: 0 }}>{number}</span>
                  {/if}
                {/key}
              {/each}
            </div>
            <span class="label">{digit.label}</span>
          </div>
        {/each}
      </div>
      <p class="subtitle">left until its next big birthday party is starting!</p>
    {/if}
    <div class="chibi-confetti">
      {#if bdToday}
        <div class="confetti">
          {#each Array(3) as _, i}
            <div class="">
              <Confetti cone delay={[2000, 2000]} x={[-0.5, 0.5]} />
              <Confetti cone delay={[2000, 2000]} amount="10" x={[-0.75, -0.4]} y={[0.15, 0.75]} />
              <Confetti cone delay={[2000, 2000]} amount="10" x={[0.4, 0.75]} y={[0.15, 0.75]} />
            </div>
          {/each}
        </div>
      {/if}
      <div class="chibis">
        {#each Array(3) as _, i}
          {#if bdToday}
            <ToggleConfetti>
              <!--  -->
              <button style="all: unset" slot="label"
                ><BoopAction boopParams={{ y: 15, timing: 800 }}>
                  <img src={chibi} alt="happy chibi" /></BoopAction
                ></button
              >
              <Confetti cone delay={[200, 500]} x={[-0.5, 0.5]} />
              <Confetti cone delay={[200, 500]} amount="10" x={[-1, -0.4]} y={[0.25, 0.75]} />
              <Confetti cone delay={[200, 500]} amount="10" x={[0.4, 1]} y={[0.25, 0.75]} />
            </ToggleConfetti>
          {:else}
            <button style="all: unset"
              ><BoopAction boopParams={{ y: -15, timing: 800 }}>
                <img src={chibi} alt="happy chibi" /></BoopAction
              ></button
            >
          {/if}
        {/each}
      </div>
    </div>
  </div>
{/if}

<style type="scss">
  .birthday {
    text-align: center;
    display: flex;
    align-self: center;
    flex-flow: column;
    font-size: 0.6em;

    .title {
      font-size: 3em;
      margin: 0;
    }

    .subtitle {
      font-size: 2em;
      margin-bottom: 0;
    }

    .full-confetti {
      position: fixed;
      top: -50px;
      left: 0;
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      overflow: hidden;
      pointer-events: none;
    }

    .chibi-confetti {
      margin-top: 2em;
      place-items: center;
      justify-content: center;

      .confetti {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0 10em;
        height: 0.3em;
      }

      .chibis {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0 5em;

        button {
          background: unset;
          border: unset;
        }

        img {
          width: 5em;
          vertical-align: middle;
          align-self: center;
        }
      }
    }

    .countdown {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      user-select: none;
      font-size: 0.45em;
      margin-top: 1em;

      .col {
        font-size: 10em;
        display: flex;
        flex-direction: column;
        font-feature-settings: 'tnum';
        align-content: center;

        .digits {
          display: flex;
          flex-flow: row;
        }
      }

      .colon {
        font-size: 9em;
        margin-top: 0em;
        padding: 0 0.05em;
      }

      .label {
        font-size: 0.3em;
      }
    }

    y {
      color: $ban-y;
    }
  }

  @media (min-width: 420px) {
    .birthday {
      font-size: 0.8em;
    }
  }

  @media (min-width: 576px) {
    .birthday {
      font-size: 0.6em;

      .title {
        font-size: 3em;
        margin-bottom: 0;
      }

      .subtitle {
        font-size: 3em;
        margin-bottom: 0;
        margin-top: 0.5em;
      }

      .chibi-confetti {
        margin-top: 2em;
        gap: 5em;
        user-select: none;

        img {
          width: 5em;
        }
      }

      .countdown {
        font-size: 0.9em;
        margin-top: 1em;

        .col {
          font-size: 10em;
        }

        .colon {
          font-size: 9em;
          margin-top: 0em;
          padding: 0 0.05em;
        }

        .label {
          font-size: 0.3em;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .birthday {
      font-size: 0.7em;

      .subtitle {
        font-size: 2.8em;
        margin-top: 1em;
      }
    }
  }

  @media (min-width: 992px) {
    .birthday {
      font-size: 0.85em;
      .title {
        margin-top: 1em;
      }
    }
  }

  @media (min-width: 1200px) {
    .birthday {
      font-size: 1em;
    }
  }

  @media (min-width: 1400px) {
    .birthday {
      font-size: 1.2em;
    }
  }
</style>
