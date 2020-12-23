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
        <div class="medium" v-if="captions.medium" v-text="captions.medium" />
        <div class="small"  v-if="captions.small"  v-text="captions.small" />
        <div class="large"  v-if="captions.large"  v-text="captions.large" />
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
      return {
        small: this.$prismic.asText(_get(this.slice, 'primary.small_caption', [])) || '',
        medium: this.$prismic.asText(_get(this.slice, 'primary.medium_caption', [])) || '',
        large: this.$prismic.asText(_get(this.slice, 'primary.large_caption', [])) || '',
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.captions {
  position: fixed;
  z-index: -1;
  bottom: 21px;
  left: 0;
  right: 0;
  pointer-events: none;
  text-align: center;
  font-weight: $font-weight-medium;
  opacity: 0;

  &.is-visible {
    opacity: 1;
  }

  @include bp-up(md) {
    bottom: 34px;
  }

  .small {
    line-height: 1; // Do we need?
    max-width: 31em;
    margin-left: auto;
    margin-right: auto;

    @include bp-down(md) {
      font-size: 13px;
    }
  }

  .medium {
    @include text-big;
  }

  .large {
    @include text-huge;
    margin-bottom: -7px;
  }

  .medium + .small {
    margin-top: 3px;
  }

  .small + .large {
    margin-top: 32px;

    @include bp-up(md) {
      margin-top: 38px;
    }
  }
}
</style>