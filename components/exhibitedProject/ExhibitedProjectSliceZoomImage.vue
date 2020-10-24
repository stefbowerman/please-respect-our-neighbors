<template>
  <div class="container">
    <div style="position: relative">
      <div class="primary" v-if="primaryImage">
        <img :src="primaryImage.url" :alt="primaryImage.alt" />
      </div>
      <div class="detail" v-if="detailImage">
        <div class="loupe">
          <img :src="detailImage.url" :alt="detailImage.alt" />
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
        return s.slice_type === 'zoom_image'
      } 
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    primaryImage() {
      return _get(this.slice, 'primary.main_image')
    },
    detailImage() {
      return _get(this.slice, 'primary.detail_image')
    }
  }
}
</script>

<style lang="scss" scoped>
.primary {

}

.detail {
  position: absolute;
  top: 95%;
  right: 10px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid $black;
  overflow: hidden;

  @include bp-up(lg) {
    top: 10%;
    right: 10%;    
    width: 600px;
    height: 600px;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>