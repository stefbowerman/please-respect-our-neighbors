<template>
  <div class="image">
    <img
      v-if="image"
      :src="image.url"
      :alt="image.alt"
    />
  </div>
</template>

<script>
import _get from 'lodash/get'

export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      validator: ({ slice_type }) => slice_type === 'full_bleed_image'
    }
  },
  computed: {
    image() {
      return _get(this.slice, 'primary.image')
    }
  }
}
</script>

<style lang="scss" scoped>
.image {

  @include bp-up(md) {
    height: 100%;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }    
  }
}
</style>