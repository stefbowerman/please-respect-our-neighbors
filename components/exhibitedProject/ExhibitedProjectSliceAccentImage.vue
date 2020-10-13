<template>
  <div class="accent">
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
        return s.slice_type === 'accent_image'
      }      
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
.accent {
  background-color: $red;
  padding: 80px 0;
  flex: 1;
  display: flex;
  align-items: center;
}

.accent-image {
  padding: 0 5px;
  position: relative;
  z-index: $zindex-header + 1;

  @include bp-up(md) {
    padding: 0;
  }
}
</style>