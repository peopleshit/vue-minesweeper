<template>
  <div
      :class="{ revealed }"
      class="cell"
      @click="handleClick"
      @contextmenu.prevent="handleRightClick"
  >
    <template v-if="revealed">
      <template v-if="value === -1">
        <img src="/src/assets/mine.svg" alt="" />
      </template>
      <template v-else-if="value > 0 && flagged">
        <img src="/src/assets/mistake.svg" alt="" />
      </template>
      <div
        v-else-if="value > 0"
        :class="`value-${value}`"
      >
        {{ value }}
      </div>
    </template>
    <template v-else-if="flagged">
      <img src="/src/assets/flag.svg" alt="" />
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Cell',

    props: {
      revealed: {
        type: Boolean,
        default: false
      },

      flagged: {
        type: Boolean,
        default: false
      },

      value: {
        type: Number,
        required: true
      }
    },

    emits: ['reveal', 'flag'],

    methods: {
      handleClick() {
        if (this.flagged) {
          return
        }

        this.$emit('reveal')
      },

      handleRightClick() {
        if (this.revealed) {
          return
        }

        this.$emit('flag')
      }
    }
  }
</script>

<style scoped lang="scss">
  .cell {
    display: flex;

    width: 20px;
    height: 20px;

    align-items: center;
    justify-content: center;

    border: 1px solid black;
    border-radius: 1px;

    cursor: pointer;
    user-select: none;

    &.revealed {
      background-color: lightgray;
      color: black
    }

    .icon {
      max-width: 18px;
      max-height: 18px;
    }

    @for $i from 1 through 8 {
      .value-#{$i} {
        color: var(--color-cell-value-#{$i});
      }
    }
  }
</style>