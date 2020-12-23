<template>
  <footer
    v-if="text"
    v-text="text"
  />
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  position: fixed;
  z-index: $zindex-footer;
  bottom: 30px;
  right: 30px;
  font-weight: $font-weight-bold;
  font-family: $font-family-secondary;

  @include theme-text;
  transition-delay: 0.1s;

  @include bp-down(md) {
    display: none;
  }
}
</style>