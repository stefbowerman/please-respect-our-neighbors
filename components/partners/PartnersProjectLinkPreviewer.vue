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

    <div
      :class="[
        'preview-window',
        { 'is-visible': showPreviewWindow }
      ]"
      :style="previewWindowStyle"
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
      </div>
      <div
        class="preview-window__scale-control"
        v-dragged="onScaleControlDrag"
      >
        Drag Me
      </div>
    </div>
  </span>
    
  </span>
</template>

<script>
export default {
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
      previewHeight: 200,
      previewWidth: 300,
      aspectRatio: (2/3),

      // These values don't change
      previewFrameHeight: 800,
      previewFrameWidth: 1200
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
        transform: `scale(${this.previewHeight / this.previewFrameHeight})`
      }
    }
  },
  methods: {
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
  z-index: 1;
  top: 50%;
  left: 50%;
  height: 200px;
  width: 300px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s $easing-ease-out-quart;
  background-image: $light-gradient;
  border: 1px solid var(--text-color);

  &.is-visible {
    opacity: 1;
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

.preview-window__scale-control {
  position: absolute;
  top: 100%;
  left: 100%;
  background-color: white;
  color: black;
  font-size: 10px;
  cursor: nwse-resize;
  text-transform: uppercase;
  transform: translate(5px, 5px);
  width: 66px;
  text-align: center;
  padding: 6px 0 4px;
}
</style>