<template>
  <div class="container">
    <div class="row">
      <div class="primary-column">
        <div class="image">
          <img
            :src="slice.primary.image.url"
            :alt="slice.primary.image.alt"
          />
        </div>
      </div>
      <div class="secondary-column">
        <div class="text-box-wrapper">
          <text-box
            :date="slice.primary.content_date"
            :content="$prismic.asHtml(slice.primary.content)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

import TextBox from '~/components/TextBox'

export default {
  components: {
    TextBox
  },
  props: {
    slice: {
      type: Object,
      default: () => {},
      validator(s) {
        return s.slice_type === 'image_text_box'
      } 
    },
    current: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.image,
.text-box-wrapper {
  @include bp-down(lg) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    min-height: var(--unit-100vh);  
  }
}

.image {
  margin-bottom: 50px;

  img {
    margin: 0 auto;
    display: block;
    border: 1px solid $black;
  }
}

.text-box-wrapper {
  .text-box {
    height: 60vh;

    /deep/ .scroller {
      height: 100%; // @TODO - Remove the 'height' from this inside the text-box component ?
    }
  }
}
</style>