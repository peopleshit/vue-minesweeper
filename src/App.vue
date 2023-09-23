<template>
  <div class="minesweeper">
    <router-view />
  </div>
</template>

<script>
  import { RouterView } from 'vue-router'

  export default {
    name: 'App',

    components: {
      RouterView
    }
  }
</script>

<style scoped lang="scss">
  .minesweeper {
    margin: 0;
    padding: 0;

    width: 100%;
    height: 100%;
  }
</style>
