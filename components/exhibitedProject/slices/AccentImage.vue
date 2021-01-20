<template>
  <div class="container">
    <div class="row">
      <div class="primary-column gutter-less">
        <div class="accent-image">
          <img
            v-if="image"
            :src="image.url"
            :alt="image.alt"
          />
        </div>
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
      validator: ({ slice_type }) => slice_type === 'accent_image'
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

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>