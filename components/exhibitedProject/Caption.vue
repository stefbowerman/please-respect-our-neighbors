<template>
  <div
    :class="[
      'captions',
      'container',
      { 'is-visible': visible }
    ]"
  >
    <div class="row">
      <div class="primary-column">  
        <div class="small" v-if="captions.small" v-html="captions.small" />
        <div class="large" v-if="captions.large" v-html="captions.large" />
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
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    captions() {
      const smallCap = _get(this.slice, 'primary.small_caption', [])
      const largeCap = _get(this.slice, 'primary.large_caption', [])

      const small = this.$prismic.asText(smallCap).length ? this.$prismic.asHtml(smallCap) : null
      const large = this.$prismic.asText(largeCap).length ? this.$prismic.asHtml(largeCap) : null

      return {
        small,
        large
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.captions {
  position: fixed;
  z-index: 0;
  bottom: 21px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: $font-weight-medium;
  opacity: 0;
  pointer-events: none;

  @include bp-up(md) {
    bottom: 34px;
  }  

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  ::v-deep a {
    text-decoration: underline;
  }

  .small {
    line-height: 1.1;
    font-size: 19px;
    max-width: 40em;
    margin-left: auto;
    margin-right: auto;

    @include bp-down(md) {
      font-size: 13px;
    }

    ::v-deep p + p {
      
      @include bp-up(md) {
        margin-top: 20px;
      }
    }
  }

  .large {
    @include text-huge;
    margin-bottom: -7px;
  }

  .small + .large {
    margin-top: 32px;

    @include bp-up(md) {
      margin-top: 38px;
    }
  }
}
</style>