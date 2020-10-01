<template>
  <div
    class="page-header"
    v-if="title || subtitle"
  >
    <h1 class="title" v-text="title" v-if="title && title.length" />
    <transition name="fade" mode="out-in">
      <h3
        class="subtitle"
        v-text="subtitle"
        v-if="subtitle && subtitle.length"
        :key="subtitle"
      />
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  position: fixed;
  top: 30px;
  left: 50px;
  width: 1050px;
  text-align: center;
  text-transform: uppercase;
}

.title {
  // @TODO - vw units?
  font-size: 80px;
  line-height: 0.95;
  font-weight: normal;
}

.subtitle {
  font-size: 46px;
  font-weight: normal;
}
</style>