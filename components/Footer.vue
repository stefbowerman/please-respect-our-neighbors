<template>
  <footer v-text="text" />
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
  bottom: 30px;
  right: 30px;

  @include theme-text;
  font-weight: $font-weight-medium;
  font-family: $font-family-secondary;
}
</style>