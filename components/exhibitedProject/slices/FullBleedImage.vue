<template>
  <div class="image">
    <linkable-image
      :link="imageLink"
      :image="image"
    />
  </div>
</template>

<script>
import _get from 'lodash/get'

import LinkableImage from '~/components/LinkableImage'

export default {
  components: {
    LinkableImage
  },
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
    },
    imageLink() {
      return _get(this.slice, 'primary.image_link')
    }
  }
}
</script>

<style lang="scss" scoped>
.image {

  @include bp-up(md) {
    height: 100%;

    ::v-deep {
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }      
    } 
  }
}
</style>