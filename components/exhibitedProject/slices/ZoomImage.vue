<template>
  <div class="container">
    <div
      v-if="primaryImage"
      class="primary"
    >
      <linkable-image
        :image="primaryImage"
        :link="primaryImageLink"
      />
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
      default: () => ({}),
      validator: ({ slice_type }) => slice_type === 'zoom_image'
    }
  },
  computed: {
    primaryImage() {
      return _get(this.slice, 'primary.main_image')
    },
    primaryImageLink() {
      return _get(this.slice, 'primary.main_image_link')
    }
  }
}
</script>

<style lang="scss" scoped>
@include bp-up(lg) {
  .container,
  .primary {
    height: 100%;
  }
}

.primary {
  position: relative;

  @include bp-up(lg) {
    ::v-deep img {
      vertical-align: top;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>