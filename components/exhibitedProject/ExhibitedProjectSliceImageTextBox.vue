<template>
  <div class="container">
    <div class="row">
      <div class="primary-column">
        <div class="image">
          <a
            v-if="slice.primary.image_link.url"
            :href="slice.primary.image_link.url"
            :target="slice.primary.image_link.target"
          >
            <prismic-image
              :field="slice.primary.image"
            />
          </a>

          <prismic-image
            v-else
            :field="slice.primary.image"
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container,
.row,
.primary-column,
.secondary-column,
.image {
  height: 100%;
}

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
    height: 100%;
    max-height: 450px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    border: 1px solid transparent;
  }

  a:hover img {
    border-color: var(--link-color);
  }
}

.text-box-wrapper {
  height: 100%;

  .text-box {
    height: 60vh;
    max-height: 100%;

    /deep/ .scroller {
      height: 100%; // @TODO - Remove the 'height' from this inside the text-box component ?
    }
  }
}
</style>