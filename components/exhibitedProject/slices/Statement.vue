<template>
  <div class="container">
    <div
      class="text-statement"
      v-html="content"
    />
  </div>
</template>

<script>
import _get from 'lodash/get'

export default {
  props: {
    slice: {
      type: Object,
      default: () => ({}),
      validator: ({ slice_type }) => slice_type === 'statement'
    }
  },
  computed: {
    content() {
      return this.$prismic.asHtml(_get(this.slice, 'primary.content', []))
    }
  }
}
</script>

<style lang="scss" scoped>
.text-statement {
  padding-left: 12px;
  padding-right: 12px;

  @include bp-up(lg) {
    margin-top: 50px;
    padding: 0;
  }

  ::v-deep {
    p {
      text-indent: 1em;

      @include bp-up(md) {
        text-indent: 1.5em;
      }
    }

    p + p {
      margin-top: 1.5em;
    }
  }
}
</style>