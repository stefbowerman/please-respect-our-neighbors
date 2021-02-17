<template>
  <div class="container">
    <div class="row">
      <div class="primary-column gutter-less">
        <div class="accent-image">
          <linkable-image
            :image="image"
            :link="imageLink"
          />
        </div>
      </div>
    </div>
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
      validator: ({ slice_type }) => slice_type === 'accent_image'
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
.container,
.row,
.primary-column,
.accent-image {
  height: 100%;
}

.accent-image {
  padding: 0 5px;

  @include bp-up(md) {
    padding: 0;
  }

  ::v-deep img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>