<template>
  <div class="container">
    <div
      v-if="primaryImage"
      class="primary"
    >
      <img :src="primaryImage.url" :alt="primaryImage.alt" />
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
        return s.slice_type === 'zoom_image'
      }
    }
  },
  computed: {
    primaryImage() {
      return _get(this.slice, 'primary.main_image')
    }
  }
}
</script>

<style lang="scss" scoped>
.container,
.primary {
  height: 100%;
}

.primary {
  position: relative;

  @include bp-up(lg) {
    margin-left: -24px;
    margin-right: -24px; 

    img {
      vertical-align: top;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>