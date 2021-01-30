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
      @click="onTextClick"
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
import { mapState } from 'vuex'
import _clamp from 'lodash/clamp'
import SvgDragger from '~/assets/svg/dragger.svg'

const PREVIEW_PADDING = 100 // How much space between the preview and the edge of the screen
const PREVIEW_BASE_HEIGHT = 200
const PREVIEW_BASE_WIDTH = 300
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
      previewTop: '',
      previewLeft: '',
      previewHeight: PREVIEW_BASE_HEIGHT,
      previewWidth: PREVIEW_BASE_WIDTH
    }
  },
  created() {
    if (!this.url) {
      this.ready = true
    }
  },
  computed: {
    ...mapState([
      'windowWidth'
    ]),
    showPreviewWindow() {
      return this.show // && this.iframeLoaded
    },
    previewWindowStyle() {
      return {
        top: `${this.previewTop}`,
        left: `${this.previewLeft}`,
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
    setPreviewSize(reset = false) {
      const w = reset ? PREVIEW_BASE_WIDTH  : _clamp(window.innerWidth/2, PREVIEW_BASE_WIDTH, 600)
      const h = reset ? PREVIEW_BASE_HEIGHT : w * ASPECT_RATIO

      this.previewWidth  = w
      this.previewHeight = h
    },
    onTextClick({ pageY, clientX}) {
      const top = pageY + 5
      const left = clientX + 5

      if (!this.show) {
        this.previewTop = `${top}px`
        this.previewLeft = `${(left * 100) / window.innerWidth}%`
      }

      this.show = !this.show
    },
    onPreviewWindowEnter() {
      this.setPreviewSize()

      if (this.$refs.content) {
        this.$refs.content.scrollTop = 0
      }
    },
    onPreviewWindowAfterLeave() {
      this.setPreviewSize(true)
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
      const isMin = this.previewWidth < PREVIEW_BASE_WIDTH
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
  },
  watch: {
    windowWidth() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.previewer {

}

.text {
  transition: color 250ms ease-out;

  .is-ready & {
    cursor: pointer;   
  }

  .previewer.is-ready:hover &,
  // .is-active class is set on the parent component
  .is-active .previewer & {
    color: $white;
    transition: color 150ms ease-out;
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
  line-height: 1.1;
  font-weight: $font-weight-normal;

  ::v-deep {
    a {
      color: $white;
      text-decoration: underline;
    }

    p + p {
      margin-top: 1em;
    }
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

.preview-window-enter-active {
  transition: opacity 0.4s cubic-bezier(0.46, 0.44, 0.28, 0.93)  
}

.preview-window-leave-active {
  transition: opacity 0.75s cubic-bezier(0.54, 0.46, 0.04, 0.96);
}
</style>