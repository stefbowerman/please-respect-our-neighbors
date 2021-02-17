<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <div
            v-if="firstImage"
            class="first-image"
          >
            <linkable-image
              :link="firstImageLink"
              :image="firstImage"
            />           
          </div>
        </div>
        <div class="secondary-column">
          <div
            v-if="secondImage"
            class="second-image"
          >
            <linkable-image
              :link="secondImageLink"
              :image="secondImage"
            />            
          </div>
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
      default: () => ({}),
      validator: ({ slice_type }) => slice_type === 'image_pair'
    }
  },
  computed: {
    firstImage() {
      return _get(this.slice, 'primary.first_image')
    },
    firstImageLink() {
      return _get(this.slice, 'primary.first_image_link')
    },
    secondImage() {
      return _get(this.slice, 'primary.second_image')
    },
    secondImageLink() {
      return _get(this.slice, 'primary.second_image_link')
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

  ::v-deep img {
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