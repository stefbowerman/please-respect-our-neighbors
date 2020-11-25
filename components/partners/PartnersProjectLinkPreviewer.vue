<template>
  <span
    :class="[
      'link-previewer',
      {'loaded': iframeLoaded }
    ]"
  >
    <span
      v-text="text"
      @click="onClick"
    />

    <span
      :class="[
        'preview-window',
        { 'is-visible': showPreviewWindow }
      ]"
      :style="previewWindowStyle"
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
    </span>
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
      iframeLoaded: false
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
      if (typeof window === "undefined") {
        return {}
      }

      const height = 800
      const width  = 1280

      const scaleFactor = (window.innerWidth * 0.2) / width

      const transform = `scale(${scaleFactor})`

      return {
        height,
        width,
        transform
      }
    }
  },
  methods: {
    onClick() {
      this.show = !this.show
    },
    onIframeLoad() {
      this.iframeLoaded = true
    }
  }
}
</script>

<style lang="scss" scoped>
.link-previewer {
  position: relative;

  &.loaded {
    cursor: pointer;
  }

  &:hover {
    color: $white;
  }
}

.preview-window {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 800px;
  width: 1280px;
  transform-origin: top left;
  transform: scale(0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s $easing-ease-out-quart;
  background-image: $light-gradient;
  border: 1px solid var(--text-color);

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
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

  iframe {
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: opacity 0.8s $easing-ease-out-quart;

    &.is-loaded {
      opacity: 1;
    }
  }
}
</style>