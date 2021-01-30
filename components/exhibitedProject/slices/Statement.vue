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
  margin-top: 50px;

  ::v-deep {
    p {
      text-indent: 1.5;
    }

    p + p {
      margin-top: 1.5em;
    }
  }
}
</style>