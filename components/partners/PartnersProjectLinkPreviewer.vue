<template>
  <span
    :class="[
      'link-previewer',
      {'loaded': iframeLoaded }
    ]"
  >
    <span
      class="text"
      v-text="text"
      @click="onClick"
    />

    <transition
      name="preview-window"
      v-on:after-leave="onPreviewWindowAfterLeave"
    >
      <div
        ref="preview"
        :class="[
          'preview-window',
          { 'is-visible': showPreviewWindow }
        ]"
        :style="previewWindowStyle"
        v-show="showPreviewWindow"
      >
        <div
          class="preview-frame"
          :style="previewFrameStyle"
        >
          <iframe
            v-if="loadable"
            :src="url"
            ref="iframe"
            :class="[
              { 'is-loaded': iframeLoaded }
            ]"
            @load="onIframeLoad"
            @onload="onIframeLoad"
          />
          <div class="iframe-mask" />

          <div
            class="preview-frame__scale-control"
            v-dragged="onScaleControlDrag"
          >
            <svg-dragger />
          </div>       
        </div>
      </div>
    </transition>
  </span>
    
  </span>
</template>

<script>
import SvgDragger from '~/assets/svg/dragger.svg'

const PREVIEW_PADDING = 100 // How much space between the preview and the edge of the screen
const PREVIEW_INITIAL_HEIGHT = 200
const PREVIEW_INITIAL_WIDTH = 300
const PREVIEW_FRAME_HEIGHT = 800

export default {
  components: {
    SvgDragger
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      loadable: false,
      iframeLoaded: false,
      previewHeight: PREVIEW_INITIAL_HEIGHT,
      previewWidth: PREVIEW_INITIAL_WIDTH,
      aspectRatio: (2/3)
    }
  },
  mounted() {
    // AJAX check if iframe has x-frame-options same origin
    // https://stackoverflow.com/questions/15273042/catch-error-if-iframe-src-fails-to-load-error-refused-to-display-http-ww
    // this.loadable = true / false

    this.loadable = true
  },
  computed: {
    showPreviewWindow() {
      return this.show && this.iframeLoaded
    },
    previewWindowStyle() {
      return {
        height: `${this.previewHeight}px`,
        width: `${this.previewWidth}px`
      }
    },
    previewFrameStyle() {
      return {
        transform: `scale(${this.previewHeight / PREVIEW_FRAME_HEIGHT})`
      }
    }
  },
  methods: {
    onPreviewWindowAfterLeave() {
      this.previewHeight = PREVIEW_INITIAL_HEIGHT
      this.previewWidth  = PREVIEW_INITIAL_WIDTH
    },
    onClick() {
      this.show = !this.show
    },
    onIframeLoad() {
      this.iframeLoaded = true
    },
    onScaleControlDrag({ deltaX, deltaY, first, last }) {
      if (first) {
        this.$store.commit('SET_IS_DRAGGING', true)
      }
      else if (last) {
        this.$store.commit('SET_IS_DRAGGING', false)
      }

      const previewRect = this.$refs.preview.getBoundingClientRect()
      const isMin = this.previewWidth < PREVIEW_INITIAL_WIDTH
      const isMax = (previewRect.x + previewRect.width + PREVIEW_PADDING) > window.innerWidth

      if ((isMin && deltaX < 0) || (isMax && deltaX > 0)) {
        return
      }

      // Maintain window aspect ratio
      if (deltaX != 0) {
        // Resize on X
        this.previewWidth  += (deltaX || 0)
        this.previewHeight  = this.previewWidth * this.aspectRatio
      }
      else if (deltaY != 0) {
        // resize on Y
        this.previewHeight += (deltaY || 0)
        this.previewWidth   = this.previewHeight * (1 / this.aspectRatio)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.link-previewer {
  position: relative;
}

.text {
  .loaded & {
    cursor: pointer;
  }

  .link-previewer:hover & {
    color: $white;
  }
}

.preview-window {
  position: absolute;
  z-index: $zindex-link-preview;
  top: 50%;
  left: 50%;
  height: 200px;
  width: 300px;
  pointer-events: none;

  &.is-visible {
    pointer-events: auto;
  }
}

.preview-frame {
  height: 800px;
  width: 1200px;
  transform-origin: top left;
  transform: scale(0.25);

  iframe {
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: opacity 0.8s $easing-ease-out-quart;

    &.is-loaded {
      opacity: 1;
    }
  }

  .is-dragging & {
    pointer-events: none;
  }
}


.iframe-mask {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: 1;
  pointer-events: none;
  border: 1px solid $red;
  box-shadow: inset 0px 0px 93px 50px $red,
              inset 0px 0px 175px 100px $red;
}

.preview-frame__scale-control {
  position: absolute;
  z-index: 1;
  bottom: 15px;
  right: 15px;
  height: 30px;
  width: 30px;
  cursor: nwse-resize;

  svg {
    height: 100%;
    width: 100%;
  }
}

// Transition
.preview-window-enter,
.preview-window-leave-to {
  opacity: 0;
}

.preview-window-enter-active,
.preview-window-leave-active {
  transition: opacity 0.5s $easing-ease-out-quart;
}
</style>