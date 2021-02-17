<template>
  <div class="container">
    <div class="row">
      <div class="primary-column">
        <div class="image">
          <linkable-image
            :link="slice.primary.image_link"
            :image="slice.primary.image"
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
import LinkableImage from '~/components/LinkableImage'

export default {
  components: {
    TextBox,
    LinkableImage
  },
  props: {
    slice: {
      type: Object,
      default: () => ({}),
      validator: ({ slice_type }) => slice_type === 'image_text_box' 
    }
  }
}
</script>

<style lang="scss" scoped>
@include bp-up(lg) {
  .container,
  .row,
  .primary-column,
  .secondary-column,
  .image {
    height: 100%;
  }
}

.image {
  margin-bottom: 50px;

  ::v-deep {
    img {
      margin: 0 auto;
      display: block;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      object-position: top;
      border: 1px solid transparent;

      @include bp-up(lg) {
        max-height: 450px;
        height: 100%;
      }
    }

    a:hover img {
      border-color: var(--link-color);
    }    
  }
}
</style>