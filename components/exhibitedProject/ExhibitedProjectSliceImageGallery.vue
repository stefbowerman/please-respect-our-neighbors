<template>
  <div>
    <div class="container" style="display: flex; justify-content: center">
      <div v-for="item in slice.items">
        <img :src="item.image.url" :alt="item.image.alt" />
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      validator(s) {
        return s.slice_type === 'image_gallery'
      } 
    }
  }
}
</script>

<style lang="scss" scoped>

</style>