<template>
  <div class="page">
    <div v-if="$store.state.indexViewed">
      Random thing goes here
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', '')
    this.$store.commit('SET_HEADER_SUBTITLE', '')
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'light')
  },  
  beforeDestroy() {
    this.$store.commit('SET_INDEX_VIEWED', true)
  }
}
</script>

<style>
.page {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
