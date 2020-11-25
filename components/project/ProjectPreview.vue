<template>
  <div
    :class="[
      'project-preview',
      { 'is-highlighted': highlighted },
      { 'is-active': active },
      { 'is-inactive': inactive }
    ]"
    :style="style"
  >
    <div
      class="frame"
      v-on:click="$emit('click')"
      v-on:mouseenter="$emit('mouseenter')"
      v-on:mouseleave="$emit('mouseleave')"
    >
      <template v-if="slice.slice_type === 'detail_gallery'">
        <div class="detail-gallery">
          <prismic-image
            v-if="slice.primary.detail_featured_image.url"
            :field="slice.primary.detail_featured_image"
          />
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'detail_text'">
        <div class="detail-text">
          <div
            class="text"
            v-html="$prismic.asHtml(slice.primary.detail_rich_text)"
          />
        </div>
      </template>

      <div class="frame__overlay" />
    </div>
  </div>
</template>

<script>
import _random from 'lodash/random'

export default {
  props: {
    slice: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    inactive: {
      type: Boolean,
      default: false
    },    
    highlighted: {
      type: Boolean,
      default: false
    },
    randomStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      style: {}
    }
  },
  mounted() {
    if (this.randomStyle) {
      // Make sure flex stays below 3.8
      // and padding stays below 8vw since those are the largest values that get applie on
      // active / inactive states
      this.style = {
        'flex': _random(0.99, 2.11),
        'padding-left': `${_random(0.5, 7.0)}vw`,
        'padding-right': `${_random(0.5, 7.0)}vw`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.project-preview {
  padding: 0 50px;
  padding: 0 3vw;
}

.frame {
  cursor: pointer;
  pointer-events: auto;
  height: 100%;
  width: 100%;
  border: 1px solid $white;
  overflow: hidden;
  position: relative;
  transition: border-color $preview-highlight-transition-duration-out $preview-highlight-easing-out;

  .is-highlighted & {
    border-color: $dark-grey;
    transition: {
      timing-function: $preview-highlight-easing-in;
      duration: $preview-highlight-transition-duration-in;
    }
  }  
}

.frame__overlay {
  @include fill;
  z-index: 1;
  background-color: $black;
  pointer-events: none;
  opacity: 0;
  transition: opacity $preview-highlight-transition-duration-out $preview-highlight-easing-out;

  .is-highlighted & {
    opacity: 0.8;
    transition: {
      timing-function: $preview-highlight-easing-in;
      duration: $preview-highlight-transition-duration-in;
    }
  }
}

// slice.slice_type === 'detail_gallery'

.detail-gallery {
  height: 100%;
  position: relative;
  transition: filter $preview-highlight-transition-duration-out $preview-highlight-easing-out;

  .is-highlighted & {
    filter: grayscale(1);
    transition: {
      timing-function: $preview-highlight-easing-in;
      duration: $preview-highlight-transition-duration-in;
    }
  }

  img {
    @include fill;
    object-fit: cover;
  }
}

// slice.slice_type === 'detail_text'

.detail-text {
  @include fill;
  border: 1px solid white;
  color: white;
  background: $darker-grey;
  white-space: nowrap;

}

.text {
  font-size: 50px;
  line-height: 53px;
  width: 500px;
  padding: 65px 13px; 
}
</style>