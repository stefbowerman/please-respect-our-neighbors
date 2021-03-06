<template>
  <div
    :class="[
      'project-preview',
      { 'is-introd': introd },
      { 'is-visible': visible },
      { 'is-ready': ready },
      { 'is-highlighted': highlighted },
      { 'is-active': active },
      { 'is-inactive': inactive }
    ]"
    :style="style"
  >
    <div class="frame-wrapper">
      <div
        class="frame"
        @click="$emit('click')"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
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
              :class="textBoxContentClasses"
              v-html="$prismic.asHtml(slice.primary.detail_rich_text)"
            />
          </div>
        </template>

        <div class="frame__overlay" />
      </div>

      <div
        v-if="slice.items && slice.items.length > 0"
        class="frame-count"
        v-text="countText"
      />
    </div>
  </div>
</template>

<script>
import _random from 'lodash/random'
import _kebabCase from 'lodash/kebabCase'
import _padStart from 'lodash/padStart'

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
    introduced: {
      type: Boolean,
      default: false
    },
    randomStyle: {
      type: Boolean,
      default: false
    },
    maxPaddingPercentage: {
      type: Number,
      default: 7,
      validator: function(value) {
        return value >= 0
      }
    }
  },
  data() {
    return {
      ready: false, // Need this flag so we can turn on transitions *after* the component is "ready" (has inline styles applied)
      introd: false, // Need this flag to stagger the intro
      visible: false,
      style: {}
    }
  },
  mounted() {
    this.timeouts = [];

    if (this.randomStyle) {
      // Make sure flex stays below 3.8
      // and padding stays below 8vw since those are the largest values that get applied on
      // active / inactive states
      this.style = {
        'flex': _random(0.25, 3),
        'padding-left': `${_random(0.25, this.maxPaddingPercentage)}%`,
        'padding-right': `${_random(0.25, this.maxPaddingPercentage)}%`
      }
    }

    this.$nextTick(() => {
      this.ready = true
    })
  },
  beforeDestroy() {
    this.timeouts.forEach(tO => clearTimeout(tO))
  },
  computed: {
    textBoxContentClasses() {
      return [
        'text-box-content',
        (this.slice.primary.detail_text_size && `size-${_kebabCase(this.slice.primary.detail_text_size)}`)
      ]
    },
    countText() {
      return `01/${_padStart(this.slice.items.length, 2, '0')}`
    }
  },
  watch: {
    introduced(newVal, oldVal) {
      if (newVal) {
        this.timeouts.push(
          setTimeout(() => {
            this.introd = true

            this.timeouts.push(
              setTimeout(() => {
                this.visible = true
              }, _random(0, 250)) 
            )
          }, _random(0, 1000))
        )  
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

.frame-wrapper {
  position: relative;
  height: 100%;
  opacity: 0;

  // Only do the translation stuff on larger screens where there's no overflow
  @include bp-up(md) {
    transform: translateY(150px);

    .is-introd & {
      transform: translateY(0px);
      transition: transform 350ms cubic-bezier(0.84, 0.31, 0.78, 0.86);
    }

    .is-visible & {
      opacity: 1;
    }    
  }

  // On smaller screens just fade in
  @include bp-down(sm) {
    .is-introd & {
      opacity: 1;
      transition: opacity 350ms cubic-bezier(0.84, 0.31, 0.78, 0.86);
    }
  }
}

.frame-count {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  padding-top: 10px;
  transform: translateY(100%);
  pointer-events: none;
  font-size: 18px;
  font-weight: $font-weight-medium;
  opacity: 0;
  transition: opacity $preview-highlight-transition-duration-out cubic-bezier(0.22, 0.74, 0, 0.89);

  .is-active & {
    opacity: 1;
    transition-duration: $preview-highlight-transition-duration-in * 1.5;
  }
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
  color: $white;
  background: $darker-grey;
  white-space: nowrap;
}

.text-box-content {
  padding: 65px 13px;
  pointer-events: none; // In case the text has links in it..you shouldn't be able to click at this point
}
</style>