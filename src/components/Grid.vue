<template>
  <div class="grid">
    <div
      v-for="(row, xIdx) in items"
      :key="xIdx"
      class="row"
    >
      <cell
        v-for="(item, yIdx) in row"
        :key="yIdx"
        :revealed="item.revealed"
        :flagged="item.flagged"
        :value="item.value"
        @reveal="$emit('reveal', { x: xIdx, y: yIdx })"
        @flag="$emit('flag', { x: xIdx, y: yIdx })"
      />
    </div>
  </div>
</template>

<script>
  import Cell from '@/components/Cell.vue'

  export default {
    name: 'Grid',

    components: {
      Cell
    },

    props: {
      items: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .grid {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .row {
      display: flex;
      gap: 2px;
    }
  }
</style>