<template>
  <div class="page">

  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', '')
    this.$store.commit('SET_HEADER_SUBTITLE', '')
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
