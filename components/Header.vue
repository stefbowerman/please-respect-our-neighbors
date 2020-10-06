<template>
  <header
    v-show="show"
  >
    <transition :name="null" mode="out-in">
      <h1
        class="title"
        v-text="title"
        v-if="title && title.length"
        :key="title"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <h3
        class="subtitle"
        v-text="subtitle"
        v-if="subtitle && subtitle.length"
        :key="subtitle"
      />
    </transition>
  </header>
</template>

<script>
export default {
  computed: {
    show() {
      return this.title || this.subtitle
    },
    title() {
      return this.$store.state.header.title
    },
    subtitle() {
      return this.$store.state.header.subtitle
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 50px;
  left: 50px;
  width: 1050px;
  text-align: center;
  text-transform: uppercase;

  @include theme-text;
}

.title {
  // @TODO - vw units?
  @include text-bigger;
}

.subtitle {
  @include text-big;
  margin-top: 2px;
}
</style>