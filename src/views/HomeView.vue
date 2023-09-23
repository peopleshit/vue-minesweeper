<template>
  <div class="home-view">
    <div class="header">
      <div class="count">
        {{ $t('mines', { count: minesLeft }) }}
      </div>
      <div class="button" />
      <div class="count">
        {{ $t('time', { time }) }}
      </div>
    </div>
    <grid
      ref="grid"
      :items="grid"
      @reveal="handleReveal"
      @flag="handleFlag"
    />
    <div
      class="b"
      @click="newGame"
    />
    <div>{{ running }}</div>
    <div>{{ failed }}</div>
  </div>
</template>

<i18n>
  ru:
    mines: 'Осталось мин: {count}'
    time: 'Прошло времени: {time}'
</i18n>

<script>
  import Grid from '@/components/Grid.vue'

  import gameStore from '@/stores/game'

  import { mapStores } from 'pinia'

  import { formatSeconds } from '@/utils'

  export default {
    name: 'HomeView',

    components: {
      Grid
    },

    data: () => ({
      timer: null,
      seconds: 0
    }),

    computed: {
      ...mapStores(gameStore),

      grid() {
        return this.gameStore.grid
      },

      minesLeft() {
        return this.gameStore.minesRemaining
      },

      running() {
        return this.gameStore.isRunning
      },

      failed() {
        return this.gameStore.isFailed
      },

      complete() {
        return this.gameStore.isComplete
      },

      time() {
        return formatSeconds(this.seconds)
      }
    },

    watch: {
      running(value) {
        if (value) {
          this.timer = setInterval(() => this.seconds += 1, 1000)
        } else {
          clearInterval(this.timer)

          this.timer = null
        }
      }
    },

    methods: {
      newGame() {
        this.gameStore.newGame()

        this.seconds = 0
      },

      handleReveal({ x, y }) {
        this.gameStore.reveal(x, y)
      },

      handleFlag({ x, y }) {
        this.gameStore.flipFlag(x, y)
      }
    }
  }
</script>

<style scoped lang="scss">
  .home-view {
    display: flex;
    flex-direction: column;

    height: 100%;

    .button {
      width: 130px;
      height: 40px;
    }
  }
</style>