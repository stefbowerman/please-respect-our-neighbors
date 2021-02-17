<template>
  <a
    v-if="url"
    :href="url"
    :target="target"
  >
    <prismic-image
      :field="image"
    />
  </a>

  <prismic-image
    v-else
    :field="image"
  />
</template>

<script>
import _get from 'lodash/get'

export default {
  props: {
    link: {
      type: Object
    },
    image: {
      type: Object
    }
  },
  computed: {
    url() {
      return _get(this.link, 'url')
    },
    target() {
      return _get(this.link, 'target')
    }
  }
}
</script>