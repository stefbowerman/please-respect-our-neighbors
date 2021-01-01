<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <div class="first-image" v-if="firstImage">
            <img
              :src="firstImage.url"
              :alt="firstImage.alt"
            />
          </div>
        </div>
        <div class="secondary-column">
          <div class="second-image" v-if="secondImage">
            <prismic-image
              :field="secondImage"
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
        return s.slice_type === 'image_pair'
      } 
    }
  },
  computed: {
    firstImage() {
      return _get(this.slice, 'primary.first_image')
    },
    secondImage() {
      return _get(this.slice, 'primary.second_image')
    }
  }
}
</script>

<style lang="scss" scoped>
.first-image,
.second-image {
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  img {
    display: inline-block;
    vertical-align: top;
    border: 1px solid $black; // ?
  }
}

.first-image {
  // max-width: 79%;

  @include bp-up(lg) {
    max-width: 750px;
  }
}

.second-image {
  // max-width: 55%;
  margin-top: 10px;

  @include bp-up(lg) {
    // max-width: 571px;
    margin-top: 0;
  }
}
</style>