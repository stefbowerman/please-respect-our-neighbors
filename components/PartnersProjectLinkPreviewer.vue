<template>
  <span class="link-previewer">
    <span
      v-text="text"
      @click="showPreview = !showPreview"
    />

    <span
      :class="[
        'preview-window',
        { 'is-visible': showPreview }
      ]"
      :style="{}"
    >
      <iframe
        v-if="showPreview"      
        :src="url"
        :class="[
          { 'is-loaded': iframeLoaded }
        ]"
        @load="iframeLoaded = true"
        @onload="iframeLoaded = true"        
      />
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
      showPreview: false,
      iframeLoaded: false
    }
  },
  computed: {
    // previewWindowStyle() {
    //   if (window ===) return

    //   const height = 800
    //   const width  = 1280

    //   const scaleFactor = (window.innerWidth * 0.2) / width

    //   const transform = `scale(${scaleFactor})`

    //   return {
    //     height,
    //     width,
    //     transform
    //   }
    // }
  },
  methods: {
    // onClick() {
    //   console.log(`trigger preview for ${this.url}`)
    //   this.showPreview = !this.showPreview
    // }
  }
}
</script>

<style lang="scss" scoped>
.link-previewer {
  position: relative;
  cursor: pointer;
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
  transition: opacity 0.5s ease-out;
  background-image: $light-gradient;
  border: 1px solid var(--text-color);

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
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