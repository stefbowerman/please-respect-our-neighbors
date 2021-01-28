<template>
  <span
    :class="[
      'previewer',
      { 'is-active': show },
      { 'is-ready': ready }
    ]"
  >
    <span
      class="text"
      v-text="text"
      @click="show = !show"
    />

    <transition
      name="preview-window"
      v-on:enter="onPreviewWindowEnter"
      v-on:after-leave="onPreviewWindowAfterLeave"
    >
      <div
        :class="[
          'preview-window',
          { 'is-visible': showPreviewWindow }
        ]"
        :style="previewWindowStyle"
        v-show="showPreviewWindow"
        ref="preview"        
      >
        <div
          class="preview-frame"
          :style="previewFrameStyle"
        >
          <iframe
            v-if="url"
            :src="url"
            @load="onIframeLoad"
            @onload="onIframeLoad"
          />
          <div
            v-else
            class="content"
            v-html="content"
            ref="content"
          />

          <div class="mask" />

          <div
            class="scale-control"
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
const ASPECT_RATIO = (2/3)

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
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      ready: false,
      iframeLoaded: false,
      previewHeight: PREVIEW_INITIAL_HEIGHT,
      previewWidth: PREVIEW_INITIAL_WIDTH
    }
  },
  created() {
    if (!this.url) {
      this.ready = true
    }
  },
  computed: {
    showPreviewWindow() {
      return this.show // && this.iframeLoaded
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
    onPreviewWindowEnter() {
      if (this.$refs.content) {
        this.$refs.content.scrollTop = 0
      }
    },
    onPreviewWindowAfterLeave() {
      this.previewHeight = PREVIEW_INITIAL_HEIGHT
      this.previewWidth  = PREVIEW_INITIAL_WIDTH
    },
    onIframeLoad() {
      this.ready = true
      this.iframeLoaded = true
    },
    onScaleControlDrag({ deltaX, deltaY, first, last }) {
      if (first) {
        this.$store.commit('SET_IS_DRAGGING', true)
      }
      else if (last) {
        this.$store.commit('SET_IS_DRAGGING', false)
      }

      const { x, width } = this.$refs.preview.getBoundingClientRect()
      const isMin = this.previewWidth < PREVIEW_INITIAL_WIDTH
      const isMax = (x + width + PREVIEW_PADDING) > window.innerWidth

      if ((isMin && deltaX < 0) || (isMax && deltaX > 0)) {
        return
      }

      // Maintain window aspect ratio
      if (deltaX != 0) {
        // Resize on X
        this.previewWidth  += (deltaX || 0)
        this.previewHeight  = this.previewWidth * ASPECT_RATIO
      }
      else if (deltaY != 0) {
        // resize on Y
        this.previewHeight += (deltaY || 0)
        this.previewWidth   = this.previewHeight * (1 / ASPECT_RATIO)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.previewer {
  position: relative;
}

.text {
  transition: color 250ms ease-out;

  .is-ready & {
    cursor: pointer;
  }

  .previewer:hover &,
  .previewer.is-active & {
    color: $white;
    transition: color 150ms ease-out;
  }

  .previewer:hover & {
    transition-duration: 400ms; // Make up for some weird lag?
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

  .is-dragging & {
    pointer-events: none;
  }  

  iframe {
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: opacity 0.8s $easing-ease-out-quart;
  }

  .is-ready & iframe {
    opacity: 1;
  }
}

.content {
  height: 100%;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 100px;
  background-color: $red;
  color: $white;
  font-size: 65px;
  font-weight: $font-weight-normal;

  ::v-deep p + p {
    margin-top: 1em;
  }
}


.mask {
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

.scale-control {
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