<script lang="ts">
  import { fly } from 'svelte/transition'

  // https://mitcheljager.github.io/svelte-confetti/?ref=madewithsvelte.com
  // https://www.npmjs.com/package/svelte-countdown?activeTab=explore

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
    // const now = new Date(2021, 3, 1, 1, 1, 1)
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
      let hours: any = String(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
      let minutes: any = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
      let seconds: any = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, '0')

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

<body>
  <div class="birthday">
    <p class="title"><y>Banano</y>'s Birthday was on April 1, 2018</p>
    {#if bdToday}
      <p class="subtitle">that means <y>today is Banano's birthday party!</y></p>
    {:else}
      <p class="subtitle">that means there are</p>
    {/if}
    {#if bdToday}
      <div class="countdown today">
        {#each _digits.slice(1) as digit}
          {#if digit.label != 'hours'}
            <div id="colon">:</div>
          {/if}
          <div class="col" id={digit.label}>
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
      <p class="subtitle">left until the party is over!</p>
    {:else}
      <div class="countdown">
        {#each _digits as digit}
          {#if digit.label != 'days'}
            <div id="colon">:</div>
          {/if}
          <div class="col" id={digit.label}>
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
      <div class="chibi">
        <img src="../../public/chibi.webp" alt="happy chibi" />
        <img src="../../public/chibi.webp" alt="happy chibi" />
        <img src="../../public/chibi.webp" alt="happy chibi" />
      </div>
    {/if}
  </div>
</body>

<style type="scss">
  .birthday {
    text-align: center;
    display: flex;
    align-self: center;
    flex-flow: column;
    font-size: 0.6em;

    .title {
      font-size: 3em;
      margin-bottom: 0;
    }

    .subtitle {
      font-size: 2em;
      margin-bottom: 0;
    }

    .chibi {
      margin-top: 2em;
      display: flex;
      align-self: center;
      gap: 5em;

      img {
        width: 5em;
        vertical-align: middle;
        align-self: center;
      }
    }

    .countdown {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      user-select: none;
      font-size: 0.5em;
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

      #colon {
        font-size: 9em;
        margin-top: 0em;
        padding: 0 0.05em;
      }

      .label {
        font-size: 0.3em;
      }
    }

    .today {
      font-size: 1.2em;
    }
    y {
      color: $ban-y;
    }
  }

  // X-Small devices (portrait phones, less than 576px)

  // Small devices (landscape phones, 576px and up)
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

      .chibi {
        margin-top: 2em;
        gap: 5em;

        img {
          width: 5em;
        }
      }

      .countdown {
        font-size: 0.8em;
        margin-top: 1em;

        .col {
          font-size: 10em;
        }

        #colon {
          font-size: 9em;
          margin-top: 0em;
          padding: 0 0.05em;
        }

        .label {
          font-size: 0.3em;
        }
      }

      .today {
        font-size: 1.2em;
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    .birthday {
      font-size: 0.7em;

      .subtitle {
        font-size: 2.8em;
        margin-top: 1em;
      }
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    .birthday {
      font-size: 0.85em;
    }
  }

  // X-Large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    .birthday {
      font-size: 1em;
    }
  }

  // XX-Large devices (larger desktops, 1400px and up)
  @media (min-width: 1400px) {
    .birthday {
      font-size: 1.2em;
    }
  }
</style>
