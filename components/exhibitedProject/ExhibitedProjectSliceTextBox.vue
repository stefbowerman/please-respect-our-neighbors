<template>
  <div class="container">
    <div class="text-box-wrapper">
      <text-box
        :date="date"
        :content="content"
      />
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
        return s.slice_type === 'text_box'
      } 
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    date() {
      return _get(this.slice, 'primary.content_date', null)
    },
    content() {
      return this.$prismic.asHtml(_get(this.slice, 'primary.content', []))
    }
  }
}
</script>

<style lang="scss" scoped>
.text-box-wrapper {
  margin: 0 auto;
  height: 80vh;

  @include bp-up(lg) {
    max-width: 80%;
  }
}
</style>